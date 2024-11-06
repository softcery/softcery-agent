import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";
import { AgentMultibandAudioVisualizer } from "./AgentMultibandAudioVisualizer";

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

type MicrophoneButtonProps = {
  localMultibandVolume: Float32Array[];
};
export const MicrophoneButton = ({
  localMultibandVolume,
}: MicrophoneButtonProps) => {
  return (
    <button onClick={() => {}} style={buttonStyle}>
      <TrackToggle source={Track.Source.Microphone} showIcon={true}>
        <AgentMultibandAudioVisualizer
          state="speaking"
          barWidth={3}
          minBarHeight={2}
          maxBarHeight={16}
          frequencies={localMultibandVolume}
          borderRadius={0}
          gap={2}
        />
      </TrackToggle>
    </button>
  );
};
