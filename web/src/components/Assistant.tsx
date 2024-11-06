"use client";

import {
  DisconnectButton,
  useConnectionState,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { useEffect, useMemo } from "react";
import { useMultibandTrackVolume } from "../hooks/useTrackVolume";
import { AgentMultibandAudioVisualizer } from "./AgentMultibandAudioVisualizer";
import { MicrophoneButton } from "./MicrophoneButton";

export interface AssistantProps {
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
  error?: string;
}

export interface Voice {
  id: string;
  user_id: string | null;
  is_public: boolean;
  name: string;
  description: string;
  created_at: Date;
  embedding: number[];
}

const barCount = 5;
const defaultVolumes = Array.from({ length: barCount }, () => [0.0]);

export default function Assistant({ onConnect, error }: AssistantProps) {
  const { localParticipant } = useLocalParticipant();
  const { state: agentState, audioTrack: agentAudioTrack } =
    useVoiceAssistant();

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
    const buttonStyle: React.CSSProperties = {
      backgroundColor: "#3498db",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    };

    const conversationToolbar = (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <DisconnectButton style={buttonStyle}>Disconnect</DisconnectButton>
        <MicrophoneButton localMultibandVolume={localMultibandVolume} />
      </div>
    );
    const isLoading =
      roomState === ConnectionState.Connecting ||
      (!agentAudioTrack && roomState === ConnectionState.Connected);

    console.log(isLoading);

    const startConversationButton = (
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{ ...buttonStyle, padding: "0.5rem 1rem" }}
          onClick={() => {
            onConnect(roomState === ConnectionState.Disconnected);
          }}
        >
          <div style={{ width: "100%" }}>
            {!isLoading ? "Start a conversation" : "Loading..."}
          </div>
        </button>
      </div>
    );

    const visualizerContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          width: "100%",
        }}
      >
        <div style={{ position: "relative" }}>
          <AgentMultibandAudioVisualizer
            state={agentState}
            barWidth={12}
            minBarHeight={16}
            maxBarHeight={28}
            frequencies={!agentAudioTrack ? defaultVolumes : subscribedVolumes}
            borderRadius={4}
            gap={8}
          />
        </div>
        <div>
          <div>{!agentAudioTrack ? startConversationButton : null}</div>
          <div>{agentAudioTrack ? conversationToolbar : null}</div>
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
    <>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          width: "100%",
          height: `100vh`,
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            flexGrow: 1,
            flexBasis: "50%",
            gap: "1rem",
            height: "100%",
          }}
        >
          {audioTileContent}
          {error ? (
            <div style={{ color: "red", margin: "0 auto" }}>{error}</div>
          ) : null}
        </div>
      </div>
    </>
  );
}
