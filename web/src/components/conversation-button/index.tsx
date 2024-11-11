import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { PulseCircle } from "../../assets/icons";
import { MicrophoneButton } from "../microphone-button";
import styles from "./styles.module.css";
import { useTracks } from "@livekit/components-react";
import { useMultibandTrackVolume } from "../../hooks/useTrackVolume";
import { Loader } from "../loader";
import { AudioVisualizer } from "../audio-visualizer";

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

  return (
    <button className={styles.button} onClick={handleButtonClick}>
      <div className={styles.innerContainer}>
        <PulseCircle width={40} height={40} className={styles.pulseCircle} />
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
              gap={3}
              variant="microphone"
            />
          </div>
        ) : (
          <span>Start a conversation</span>
        )}
      </div>
      <MicrophoneButton state={roomState} source={Track.Source.Microphone} />
    </button>
  );
};

export default ConversationButton;
