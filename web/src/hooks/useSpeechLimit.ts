import { useLocalParticipant } from "@livekit/components-react";
import { useEffect, useState, useRef } from "react";
import { ParticipantEvent } from "livekit-client";

const useSpeechLimit = (limitInSeconds = 5) => {
  const { localParticipant } = useLocalParticipant();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechStartTime, setSpeechStartTime] = useState<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!localParticipant) return;

    const handleSpeakingChange = () => {
      if (localParticipant.isSpeaking) {
        if (!isSpeaking) {
          // Start counting time when participant starts speaking
          setIsSpeaking(true);
          setSpeechStartTime((prevTime) => prevTime ?? Date.now());
        }
        // If the pause timer is running, reset it
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current);
          pauseTimeoutRef.current = null;
        }
      } else {
        // Start a pause timer for 1 second
        if (pauseTimeoutRef.current) return;

        pauseTimeoutRef.current = setTimeout(() => {
          // If the pause lasts more than 1 second, reset the state
          setIsSpeaking(false);
          setSpeechStartTime(null);
          pauseTimeoutRef.current = null;
        }, 1000); // 1 second pause
      }
    };

    const interval = setInterval(() => {
      if (isSpeaking && speechStartTime) {
        const elapsedSeconds = (Date.now() - speechStartTime) / 1000;
        if (elapsedSeconds >= limitInSeconds) {
          // Muting participant's microphone
          localParticipant.setMicrophoneEnabled(false);
          setIsSpeaking(false);
          setSpeechStartTime(null);
        }
      }
    }, 1000);

    // Subscribe to speaking state changes
    localParticipant.on(
      ParticipantEvent.IsSpeakingChanged,
      handleSpeakingChange
    );

    return () => {
      clearInterval(interval);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      localParticipant.off(
        ParticipantEvent.IsSpeakingChanged,
        handleSpeakingChange
      );
    };
  }, [
    localParticipant,
    isSpeaking,
    speechStartTime,
    limitInSeconds,
  ]);

  return null; // This hook does not return a value
};

export default useSpeechLimit;
