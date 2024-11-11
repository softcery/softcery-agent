import { TrackToggleProps, useTrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { MicrophoneIcon } from "../../assets/icons";
import styles from "./styles.module.css";

export const MicrophoneButton = ({
  showIcon,
  ...props
}: TrackToggleProps<Track.Source.Microphone>) => {
  const { buttonProps, enabled } = useTrackToggle(props);

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
      className={`${styles.micContainer} ${!enabled ? styles.disabled : ""}`}
    >
      <MicrophoneIcon color="#212121" width={18} height={18} />
    </button>
  );
};
