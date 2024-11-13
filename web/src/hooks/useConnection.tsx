import React, { createContext, useCallback, useState } from "react";

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl?: string;
  token?: string;
  disconnect: () => Promise<void>;
  connect: (promptId: string | null) => Promise<void>;
  error?: string;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined
);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl?: string;
    token?: string;
    shouldConnect: boolean;
    error?: string;
  }>({ shouldConnect: false });

  const connect = useCallback(async (promptId: string | null) => {
    let token = "";
    let url = "";
    if (!process.env.LIVEKIT_URL) {
      throw new Error("LIVEKIT_URL is not set");
    }
    url = process.env.LIVEKIT_URL;

    let requestUrl = `${process.env.VA_BACKEND_URL}/api/getToken`;

    // used for personalized prompts
    if (promptId) {
      requestUrl += `?prompt_id=${encodeURIComponent(promptId)}`;
    }

    try {
      const response = await fetch(requestUrl);

      if (response.status === 429) {
        setConnectionDetails({
          ...connectionDetails,
          error: "Rate limit exceeded. Please try again later.",
        });
        return;
      }

      const data = await response.json();

      token = data.token;
      setConnectionDetails({ wsUrl: url, token, shouldConnect: true });
    } catch (error: any) {
      setConnectionDetails({
        ...connectionDetails,
        error: error.message || "Something went wrong",
      });
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({
      ...prev,
      shouldConnect: false,
      error: undefined,
    }));
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        shouldConnect: connectionDetails.shouldConnect,
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        connect,
        disconnect,
        error: connectionDetails.error,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
