import asyncio
import json
import os
import requests

from livekit import rtc
from livekit.agents import JobContext, WorkerOptions, cli, JobProcess
from livekit.agents.llm import (
    ChatContext,
    ChatMessage,
)
from livekit.agents.pipeline import VoicePipelineAgent
from livekit.agents.log import logger
from livekit.plugins import azure, cartesia, deepgram, silero, openai
from typing import List, Any

from dotenv import load_dotenv

load_dotenv()


def prewarm(proc: JobProcess):
    # preload models when process starts to speed up first interaction
    proc.userdata["vad"] = silero.VAD.load()

    # fetch cartesia voices

    headers = {
        "X-API-Key": os.getenv("CARTESIA_API_KEY", ""),
        "Cartesia-Version": "2024-08-01",
        "Content-Type": "application/json",
    }
    response = requests.get("https://api.cartesia.ai/voices", headers=headers)
    if response.status_code == 200:
        proc.userdata["cartesia_voices"] = response.json()
    else:
        logger.warning(
            f"Failed to fetch Cartesia voices: {response.status_code}"
        )


async def entrypoint(ctx: JobContext):
    initial_ctx = ChatContext(
        messages=[
            ChatMessage(
                role="system",
                content="""You are an AI voice agent tasked with generating a prompt for a specific role in a conversation. Your goal is to create a concise and straightforward prompt that will guide an AI to effectively play the role of a voice agent in a given context.""",
            )
        ]
    )
    cartesia_voices: List[dict[str, Any]] = ctx.proc.userdata["cartesia_voices"]

    # tts = azure.TTS()
    tts = cartesia.TTS(
        voice="829ccd10-f8b3-43cd-b8a0-4aeaa81f3b30",
    )
    llm = openai.LLM.with_groq(model="llama3-70b-8192")
    agent = VoicePipelineAgent(
        vad=ctx.proc.userdata["vad"],
        stt=deepgram.STT(),
        llm=llm,
        tts=tts,
        chat_ctx=initial_ctx,
        allow_interruptions=True,
        # sensitivity of when to interrupt
        interrupt_speech_duration=1,
        interrupt_min_words=3,
    )

    is_user_speaking = False
    is_agent_speaking = False

    @ctx.room.on("participant_attributes_changed")
    def on_participant_attributes_changed(
        changed_attributes: dict[str, str], participant: rtc.Participant
    ):
        # check for attribute changes from the user itself
        if participant.kind != rtc.ParticipantKind.PARTICIPANT_KIND_STANDARD:
            return

        if "voice" in changed_attributes:
            voice_id = participant.attributes.get("voice")
            logger.info(
                f"participant {participant.identity} requested voice change: {voice_id}"
            )
            if not voice_id:
                return

            voice_data = next(
                (voice for voice in cartesia_voices if voice["id"] == voice_id),
                None,
            )
            if not voice_data:
                logger.warning(f"Voice {voice_id} not found")
                return
            if "embedding" in voice_data:
                model = "sonic-english"
                language = "en"
                if "language" in voice_data and voice_data["language"] != "en":
                    language = voice_data["language"]
                    model = "sonic-multilingual"
                tts._opts.voice = voice_data["embedding"]
                tts._opts.model = model
                tts._opts.language = language
                # allow user to confirm voice change as long as no one is speaking
                if not (is_agent_speaking or is_user_speaking):
                    asyncio.create_task(
                        agent.say(
                            "How do I sound now?", allow_interruptions=True
                        )
                    )

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
        nonlocal is_user_speaking
        is_user_speaking = True

    @agent.on("user_stopped_speaking")
    def user_stopped_speaking():
        nonlocal is_user_speaking
        is_user_speaking = False

    # set voice listing as attribute for UI
    voices = []
    for voice in cartesia_voices:
        voices.append(
            {
                "id": voice["id"],
                "name": voice["name"],
            }
        )
    voices.sort(key=lambda x: x["name"])
    await ctx.room.local_participant.set_attributes(
        {"voices": json.dumps(voices)}
    )

    agent.start(ctx.room)
    await agent.say(
        "Thank you for calling Softcery Voice Agent",
        allow_interruptions=True,
    )


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
