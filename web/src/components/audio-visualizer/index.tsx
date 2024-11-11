import { AgentState } from "@livekit/components-react";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

type AgentMultibandAudioVisualizerProps = {
  state: AgentState;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  frequencies: Float32Array[] | number[][];
  gap: number;
};

export const AudioVisualizer = ({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  frequencies,
  gap,
}: AgentMultibandAudioVisualizerProps) => {
  const summedFrequencies = frequencies.map((bandFrequencies) =>
    Math.sqrt(
      (bandFrequencies as number[]).reduce((sum, value) => sum + value, 0) /
        bandFrequencies.length
    )
  );

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
      setThinkingIndex((prev) =>
        thinkingDirection === "right"
          ? prev === summedFrequencies.length - 1
            ? (setThinkingDirection("left"), prev - 1)
            : prev + 1
          : prev === 0
          ? (setThinkingDirection("right"), prev + 1)
          : prev - 1
      );
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection]);

  const isReady = !["disconnected", "connecting", "initializing"].includes(
    state
  );

  return (
    <div
      className={styles.audioVisualizerContainer}
      style={{ gap: `${gap}px` }}
    >
      {summedFrequencies.map((frequency, index) => {
        const isCenter = index === Math.floor(summedFrequencies.length / 2);
        const distanceFromCenter = Math.abs(
          index - Math.floor(summedFrequencies.length / 2)
        );
        const scaleFactor = 1 - distanceFromCenter / summedFrequencies.length;

        const height =
          minBarHeight +
          frequency * (maxBarHeight - minBarHeight) * scaleFactor +
          "px";

        return (
          <div
            key={`frequency-${index}`}
            className={`${styles.audioBar} ${isReady ? styles.ready : ""} ${
              isCenter && isReady ? styles.center : ""
            } ${isCenter && state === "listening" ? styles.pulse : ""}`}
            style={{ height, width: `${barWidth}px` }}
          ></div>
        );
      })}
    </div>
  );
};
