import {
  useConnectionState,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useMemo } from "react";
import { AudioVisualizer } from "../audio-visualizer";
import ConversationButton from "../conversation-button";
import { DisconnectButton } from "../disconnect-button";
import styles from "./styles.module.css";
import { useMultibandTrackVolume } from "../../hooks/useTrackVolume";

const BAR_COUNT = 5;
const DEFAULT_VOLUMES = Array.from({ length: BAR_COUNT }, () => [0.0]);

export const ConversationToolbar = ({
  onConnect,
}: {
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}) => {
  const { state: agentState, audioTrack: agentAudioTrack } =
    useVoiceAssistant();

  const roomState = useConnectionState();

  const subscribedVolumes = useMultibandTrackVolume(
    agentAudioTrack?.publication.track,
    BAR_COUNT
  );

  const conversationToolbar = useMemo(() => {
    const isLoading =
      roomState === ConnectionState.Connecting ||
      (!agentAudioTrack && roomState === ConnectionState.Connected);

    return (
      <div className={styles.visualizerContainer}>
        <div className={styles.relativePosition}>
          <AudioVisualizer
            state={agentState}
            barWidth={56}
            minBarHeight={40}
            maxBarHeight={118}
            frequencies={!agentAudioTrack ? DEFAULT_VOLUMES : subscribedVolumes}
            gap={9}
          />
        </div>
        <div className={styles.conversationToolbar}>
          <div
            className={`${styles.conversationToolbarInner} ${
              agentAudioTrack ? styles.active : ""
            }`}
          >
            <ConversationButton
              roomState={roomState}
              onConnect={onConnect}
              isLoading={isLoading}
              frequencies={
                !agentAudioTrack ? DEFAULT_VOLUMES : subscribedVolumes
              }
            />
          </div>
          <DisconnectButton
            className={`${styles.disconnectButton} ${
              agentAudioTrack ? styles.active : ""
            }`}
          />
        </div>
      </div>
    );
  }, [roomState, agentAudioTrack, subscribedVolumes, onConnect, agentState]);

  return conversationToolbar;
};
