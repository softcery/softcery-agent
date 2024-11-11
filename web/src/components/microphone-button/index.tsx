import {
  TrackToggleProps,
  useMaybeRoomContext,
  useTrackToggle,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import { MicrophoneIcon } from "../../assets/icons";
import styles from "./styles.module.css";

export const MicrophoneButton = ({
  state,
  ...props
}: TrackToggleProps<Track.Source.Microphone> & { state: ConnectionState }) => {
  const { buttonProps, enabled } = useTrackToggle(props);

  const room = useMaybeRoomContext();
  const track = room?.localParticipant?.getTrackPublication(props.source);

  const isDisabled = !enabled && track?.isEnabled;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (buttonProps.onClick) {
      buttonProps.onClick(event as any);
    }
  };

  return (
    <button
      onClick={handleClick}
      {...buttonProps}
      className={`${styles.micContainer} ${isDisabled ? styles.disabled : ""}`}
    >
      <MicrophoneIcon color="#212121" width={18} height={18} />
    </button>
  );
};
