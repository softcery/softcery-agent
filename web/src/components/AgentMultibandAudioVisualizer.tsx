import { AgentState } from "@livekit/components-react";
import { useEffect, useState } from "react";

type AgentMultibandAudioVisualizerProps = {
  state: AgentState;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  frequencies: Float32Array[] | number[][];
  borderRadius: number;
  gap: number;
};

export const AgentMultibandAudioVisualizer = ({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  frequencies,
  borderRadius,
  gap,
}: AgentMultibandAudioVisualizerProps) => {
  const summedFrequencies = frequencies.map((bandFrequencies) => {
    const sum = (bandFrequencies as number[]).reduce((a, b) => a + b, 0);
    return Math.sqrt(sum / bandFrequencies.length);
  });

  const [thinkingIndex, setThinkingIndex] = useState(
    Math.floor(summedFrequencies.length / 2)
  );
  const [thinkingDirection, setThinkingDirection] = useState<"left" | "right">(
    "right"
  );

  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIndex(Math.floor(summedFrequencies.length / 2));
      return;
    }
    const timeout = setTimeout(() => {
      if (thinkingDirection === "right") {
        if (thinkingIndex === summedFrequencies.length - 1) {
          setThinkingDirection("left");
          setThinkingIndex((prev) => prev - 1);
        } else {
          setThinkingIndex((prev) => prev + 1);
        }
      } else {
        if (thinkingIndex === 0) {
          setThinkingDirection("right");
          setThinkingIndex((prev) => prev + 1);
        } else {
          setThinkingIndex((prev) => prev - 1);
        }
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection, thinkingIndex]);

  const isReady = !(
    state === "disconnected" ||
    state === "connecting" ||
    state === "initializing"
  );
  return (
    <div
      style={{
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: gap + "px",
      }}
    >
      {summedFrequencies.map((frequency, index) => {
        const isCenter = index === Math.floor(summedFrequencies.length / 2);
        let color = `black`;
        let transform;
        // color = `${accentColor}${accentShade ? "-" + accentShade : ""}`;

        return (
          <div
            key={"frequency-" + index}
            style={{
              height:
                minBarHeight + frequency * (maxBarHeight - minBarHeight) + "px",
              width: barWidth + "px",
              transition:
                "background-color 0.35s ease-out, transform 0.25s ease-out",
              transform: transform,
              borderRadius: borderRadius + "px",
              boxShadow: isReady
                ? `${0.1 * barWidth}px ${
                    0.1 * barWidth
                  }px 0px 0px rgba(0, 0, 0, 0.1)`
                : "none",
              backgroundColor: color,
              animation:
                isCenter && state === "listening"
                  ? "pulse 2s infinite"
                  : "none",
            }}
          ></div>
        );
      })}
    </div>
  );
};
