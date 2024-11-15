import asyncio
import json
import requests
from livekit import rtc
from livekit.agents import JobContext, WorkerOptions, cli, JobProcess
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.agents.llm import ChatContext, ChatMessage
from livekit.agents.log import logger
from livekit.plugins import silero, deepgram, openai, cartesia
from rate_limiter import RateLimiter
from config import CARTESIA_API_KEY, CARTESIA_API_URL, RATE_LIMIT_MAX_REQUESTS_RTC, RATE_LIMIT_TIME_WINDOW_RTC
from typing import List, Any
from json_reader import get_prompt_by_id
from assets.base_prompt import base_prompt
from post_hog import posthogInstance

rate_limiter = RateLimiter(RATE_LIMIT_MAX_REQUESTS_RTC, RATE_LIMIT_TIME_WINDOW_RTC)

def prewarm(proc: JobProcess):
    if not CARTESIA_API_KEY:
        logger.error("CARTESIA_API_KEY is missing. Check your environment variables.")
        return

    proc.userdata["vad"] = silero.VAD.load()

    headers = {
        "X-API-Key": CARTESIA_API_KEY,
        "Cartesia-Version": "2024-08-01",
        "Content-Type": "application/json",
    }
    try:
        response = requests.get(CARTESIA_API_URL, headers=headers)
        response.raise_for_status()
        proc.userdata["cartesia_voices"] = response.json()
    except requests.RequestException as e:
        logger.warning(f"Failed to fetch Cartesia voices: {e}")

def update_tts_voice(tts, voice_data: dict):
    """Update TTS model based on voice data."""
    model = "sonic-english" if voice_data.get("language") == "en" else "sonic-multilingual"
    tts._opts.voice = voice_data.get("embedding")
    tts._opts.model = model
    tts._opts.language = voice_data.get("language", "en")


async def entrypoint(ctx: JobContext):
    try:
        posthogInstance.capture(ctx.room.name, "user_connected")
        personal_prompt = ctx.room.name

        # Extract 'id' if it exists in the format "_prompt_{id}"
        id_from_prompt = None
        if "_prompt_" in personal_prompt:
            id_from_prompt = personal_prompt.split("_prompt_")[-1]
        print(id_from_prompt)

        personal_prompt = get_prompt_by_id(id_from_prompt)

        prompt_content = base_prompt

        if personal_prompt:
            prompt_content += f"\n{personal_prompt}" 

        initial_ctx = ChatContext(messages=[
            ChatMessage(role="system", content=prompt_content)
        ])
        
        cartesia_voices: List[dict[str, Any]] = ctx.proc.userdata.get("cartesia_voices")
        if cartesia_voices is None:
            logger.error("Cartesia voices are not available.")
            return
        
        tts = cartesia.TTS(voice="829ccd10-f8b3-43cd-b8a0-4aeaa81f3b30")
        llm = openai.LLM.with_groq(model="llama3-70b-8192")
        agent = VoicePipelineAgent(
            vad=ctx.proc.userdata["vad"],
            stt=deepgram.STT(),
            llm=llm,
            tts=tts,
            chat_ctx=initial_ctx,
            allow_interruptions=True,
            interrupt_speech_duration=1,
            interrupt_min_words=3,
        )

        is_user_speaking = False
        is_agent_speaking = False

        @ctx.room.on("participant_attributes_changed")
        def on_participant_attributes_changed(changed_attributes: dict[str, str], participant: rtc.Participant):
            user_id = participant.identity
    
            if participant.kind != rtc.ParticipantKind.PARTICIPANT_KIND_STANDARD:
                return

            if "voice" in changed_attributes:
                voice_id = participant.attributes.get("voice")
                logger.info(f"Participant {participant.identity} requested voice change: {voice_id}")
                
                if not voice_id:
                    return

                voice_data = next((voice for voice in cartesia_voices if voice["id"] == voice_id), None)
                if not voice_data:
                    logger.warning(f"Voice {voice_id} not found")
                    return

                if "embedding" in voice_data:
                    update_tts_voice(tts, voice_data)
                    if not (is_agent_speaking or is_user_speaking):
                        asyncio.create_task(agent.say("How do I sound now?", allow_interruptions=True))


        await ctx.connect()

        @agent.on("agent_started_speaking")
        def agent_started_speaking():
            nonlocal is_agent_speaking
            is_agent_speaking = True

        @agent.on("agent_stopped_speaking")
        def agent_stopped_speaking():
            nonlocal is_agent_speaking
            is_agent_speaking = False
        
        @agent.on("user_started_speaking")
        def user_started_speaking():

            # Check if user exceeds the rate limit
            logger.info(f"User {ctx.room.local_participant.identity} started speaking")
            user_id = ctx.room.local_participant.identity
            if not rate_limiter.is_allowed(user_id):
                logger.warning(f"Rate limit exceeded for user {user_id}")
                
                # Silently disconnect the participant
                asyncio.create_task(ctx.room.disconnect())
                return
            nonlocal is_user_speaking
            is_user_speaking = True

        @agent.on("user_stopped_speaking")
        def user_stopped_speaking():
            nonlocal is_user_speaking
            is_user_speaking = False

        @agent.on("user_speech_committed")
        def user_speech_committed(chat_ctx: ChatContext):
            posthogInstance.capture(ctx.room.name, "user_speech_committed", properties={
                "speech": chat_ctx.content
            })

        voices = [{"id": voice["id"], "name": voice["name"]} for voice in cartesia_voices]
        voices.sort(key=lambda x: x["name"])
        await ctx.room.local_participant.set_attributes({"voices": json.dumps(voices)})

        agent.start(ctx.room)
        # Agent says when connected
        await agent.say("Thank you for calling Softcery Voice Agent. Let’s dive into your product idea. What unicorn are you trying to build?", allow_interruptions=True)
    
    except Exception as e:
        logger.error(f"An error occurred in the entrypoint: {e}")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
