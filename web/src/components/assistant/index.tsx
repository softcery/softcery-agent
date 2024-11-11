import {
  useConnectionState,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { useEffect, useMemo } from "react";
import useSpeechLimit from "../../hooks/useSpeechLimit";
import { useMultibandTrackVolume } from "../../hooks/useTrackVolume";
import styles from "./styles.module.css";
import ConversationButton from "../conversation-button";
import { AudioVisualizer } from "../audio-visualizer";
import { DisconnectButton } from "../disconnect-button";
export interface AssistantProps {
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
  error?: string;
}

const barCount = 5;
const defaultVolumes = Array.from({ length: barCount }, () => [0.0]);

export default function Assistant({ onConnect, error }: AssistantProps) {
  const { localParticipant } = useLocalParticipant();
  const { state: agentState, audioTrack: agentAudioTrack } =
    useVoiceAssistant();

  useSpeechLimit();

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const subscribedVolumes = useMultibandTrackVolume(
    agentAudioTrack?.publication.track,
    barCount
  );

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    9
  );

  const audioTileContent = useMemo(() => {
    const isLoading =
      roomState === ConnectionState.Connecting ||
      (!agentAudioTrack && roomState === ConnectionState.Connected);

    const visualizerContent = (
      <div className={styles.visualizerContainer}>
        <div className={styles.relativePosition}>
          <AudioVisualizer
            state={agentState}
            barWidth={56}
            minBarHeight={40}
            maxBarHeight={118}
            frequencies={!agentAudioTrack ? defaultVolumes : subscribedVolumes}
            gap={9}
          />
        </div>
        <div className={styles.conversationToolbar}>
          <ConversationButton
            roomState={roomState}
            onConnect={onConnect}
            isLoading={isLoading}
            frequencies={!agentAudioTrack ? defaultVolumes : subscribedVolumes}
          />
          {agentAudioTrack ? <DisconnectButton /> : null}
        </div>
      </div>
    );

    return visualizerContent;
  }, [
    localMultibandVolume,
    roomState,
    agentAudioTrack,
    subscribedVolumes,
    onConnect,
    agentState,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {audioTileContent}
        {error ? <div className={styles.error}>{error}</div> : null}
      </div>
    </div>
  );
}
