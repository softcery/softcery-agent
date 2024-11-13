import {
  useConnectionState,
  useLocalParticipant
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect } from "react";
import useSpeechLimit from "../../hooks/useSpeechLimit";
import { ConversationToolbar } from "../conversation-toolbar";
import styles from "./styles.module.css";

export interface AssistantProps {
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
  error?: string;
}

export default function Assistant({ onConnect, error }: AssistantProps) {
  const { localParticipant } = useLocalParticipant();

  const feedback = useSpeechLimit(
    Number(process.env.SPEECH_LIMIT_SECONDS),
    Number(process.env.SPEECH_TIME_FOR_INTERRUPTION),
    Number(process.env.TIME_TO_UNMUTE)
  );

  const roomState = useConnectionState();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <ConversationToolbar onConnect={onConnect} />
        {error && <div className={styles.error}>{error}</div>}
        {feedback && <div className={styles.error}>{feedback}</div>}
      </div>
    </div>
  );
}
