import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import { useCallback } from "react";
import { ConnectionProvider, useConnection } from "./hooks/useConnection";
import Assistant from "./components/assistant";

export default function Home() {
  return (
    <ConnectionProvider>
      <HomeInner />
    </ConnectionProvider>
  );
}

export function HomeInner() {
  const path = window.location.pathname;

  const segments = path.split('/');
  const promptId = segments[segments.length - 1]; 

  const { wsUrl, token, connect, disconnect, error } = useConnection();

  const handleConnect = useCallback(
    async (c: boolean) => {
      c ? connect(promptId) : disconnect();
    },
    [connect, disconnect]
  );

  return (
    <main
      style={{
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <LiveKitRoom serverUrl={wsUrl} token={token}>
        <Assistant onConnect={handleConnect} error={error} />
        <RoomAudioRenderer />
        <StartAudio label="Click to enable audio playback" />
      </LiveKitRoom>
    </main>
  );
}
