import { AgentState } from "@livekit/components-react";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";

type AgentMultibandAudioVisualizerProps = {
  state: AgentState;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  frequencies: Float32Array[] | number[][];
  gap: number;
  variant?: "microphone";
};

export const AudioVisualizer = ({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  frequencies,
  gap,
  variant,
}: AgentMultibandAudioVisualizerProps) => {
  const summedFrequencies = useMemo(
    () =>
      frequencies.map((bandFrequencies) =>
        Math.sqrt(
          (bandFrequencies as number[]).reduce((sum, value) => sum + value, 0) /
            bandFrequencies.length
        )
      ),
    [frequencies]
  );

  const centerIndex = useMemo(
    () => Math.floor(summedFrequencies.length / 2),
    [summedFrequencies.length]
  );

  const [thinkingIndex, setThinkingIndex] = useState(centerIndex);
  const [thinkingDirection, setThinkingDirection] = useState<"left" | "right">(
    "right"
  );

  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIndex(centerIndex);
      return;
    }

    const timeout = setTimeout(() => {
      setThinkingIndex((prev) => {
        if (thinkingDirection === "right") {
          if (prev === summedFrequencies.length - 1) {
            setThinkingDirection("left");
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev === 0) {
            setThinkingDirection("right");
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection, centerIndex]);

  const isReady = useMemo(
    () => !["disconnected", "connecting", "initializing"].includes(state),
    [state]
  );

  return (
    <div
      className={styles.audioVisualizerContainer}
      style={{ gap: `${gap}px` }}
    >
      {summedFrequencies.map((frequency, index) => {
        const isCenter = index === centerIndex;
        const distanceFromCenter = Math.abs(index - centerIndex);

        // Apply a non-linear scaling factor for smoother transitions
        const scaleFactor = 1 / (1 + distanceFromCenter); // Adjust for sharper or softer drop-off

        const height =
          minBarHeight +
          frequency * (maxBarHeight - minBarHeight) * scaleFactor +
          "px";

        return (
          <div
            key={`frequency-${index}`}
            className={`${styles.audioBar} ${
              variant === "microphone"
                ? styles.microphone
                : `${isReady ? styles.ready : ""} ${
                    isCenter ? styles.center : ""
                  } ${isCenter && state === "listening" ? styles.pulse : ""}`
            }`}
            style={{ height, width: `${barWidth}px` }}
          ></div>
        );
      })}
    </div>
  );
};
