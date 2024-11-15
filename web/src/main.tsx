import "@livekit/components-styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: process.env.POSTHOG_HOST,
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostHogProvider options={options} apiKey={process.env.POSTHOG_API_KEY}>
      <App />
    </PostHogProvider>
  </StrictMode>
);
