import { useLocalParticipant } from "@livekit/components-react";
import { ParticipantEvent } from "livekit-client";
import { useEffect, useRef, useState } from "react";

const useSpeechLimit = (
  limitInSeconds = 10,
  timeForInterruption = 1,
  timeToUnmute = 5
) => {
  const { localParticipant } = useLocalParticipant();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechStartTime, setSpeechStartTime] = useState<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmuteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!localParticipant) return;

    const handleSpeakingChange = () => {
      if (localParticipant.isSpeaking) {
        if (!isSpeaking) {
          // Participant starts speaking
          setIsSpeaking(true);
          setSpeechStartTime(Date.now());
        }
        // Clear the pause timer if participant starts speaking again
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
          pauseTimeoutRef.current = null;
        }
      } else {
        // Participant stops speaking, start pause timer
        if (pauseTimeoutRef.current) return; // Pause timer already running

        pauseTimeoutRef.current = setTimeout(() => {
          // If the pause lasts more than 1 second, reset speech timer
          setIsSpeaking(false);
          setSpeechStartTime(null);
          pauseTimeoutRef.current = null;
        }, timeForInterruption * 1000); // timeForInterruption-second pause
      }
    };

    const checkSpeechDuration = () => {
      if (isSpeaking && speechStartTime) {
        const elapsedSeconds = (Date.now() - speechStartTime) / 1000;
        if (elapsedSeconds >= limitInSeconds) {
          // Mute participant's microphone
          setFeedback("Please wait before speaking again.");
          localParticipant.setMicrophoneEnabled(false);
          setIsSpeaking(false);
          setSpeechStartTime(null);

          // Start unmute timer
          unmuteTimeoutRef.current = setTimeout(() => {
            localParticipant.setMicrophoneEnabled(true);
            setFeedback(null);
            unmuteTimeoutRef.current = null;
          }, timeToUnmute * 1000); // Unmute after timeToUnmute seconds
        }
      }
    };

    // Subscribe to speaking state changes
    localParticipant.on(
      ParticipantEvent.IsSpeakingChanged,
      handleSpeakingChange
    );

    // Check speech duration every 100 milliseconds
    const speechDurationInterval = setInterval(checkSpeechDuration, 100);

    return () => {
      // Cleanup
      localParticipant.off(
        ParticipantEvent.IsSpeakingChanged,
        handleSpeakingChange
      );
      clearInterval(speechDurationInterval);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      // Do not clear unmuteTimeoutRef to allow unmute to occur
    };
  }, [localParticipant, isSpeaking, speechStartTime, limitInSeconds]);

  return feedback;
};

export default useSpeechLimit;
