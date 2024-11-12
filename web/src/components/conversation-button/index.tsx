import { useTracks } from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { PulseCircle } from "../../assets/icons";
import { useMultibandTrackVolume } from "../../hooks/useTrackVolume";
import { AudioVisualizer } from "../audio-visualizer";
import { Loader } from "../loader";
import { MicrophoneButton } from "../microphone-button";
import styles from "./styles.module.css";

const ConversationButton = ({
  roomState,
  onConnect,
  isLoading,
  frequencies,
}: {
  roomState: ConnectionState;
  onConnect: (
    connect: boolean,
    opts?: {
      token: string;
      url: string;
    }
  ) => void;
  isLoading: boolean;
  frequencies: any;
}) => {
  const tracks = useTracks();

  const barCount = 3;

  const handleButtonClick = () => {
    onConnect(roomState === ConnectionState.Disconnected);
  };

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    barCount
  );

  const isActive =
    roomState === ConnectionState.Connected ||
    roomState === ConnectionState.Connecting;

  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={handleButtonClick}
    >
      <div className={styles.innerContainer}>
        {isLoading ? (
          <Loader />
        ) : roomState === ConnectionState.Connected ? (
          <div className={styles.audioVisualizerContainer}>
            <AudioVisualizer
              state={"speaking"}
              barWidth={8}
              minBarHeight={8}
              maxBarHeight={38}
              frequencies={localMultibandVolume}
              gap={4}
              variant="microphone"
            />
          </div>
        ) : (
          <>
            <PulseCircle
              width={40}
              height={40}
              className={styles.pulseCircle}
            />
            <span className={styles.text}>Start a conversation</span>
          </>
        )}
      </div>
      <div
        className={`${styles.microphoneButtonContainer} ${
          isActive ? styles.active : ""
        }`}
      >
        <MicrophoneButton state={roomState} source={Track.Source.Microphone} />
      </div>
    </button>
  );
};

export default ConversationButton;
