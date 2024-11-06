#!/bin/bash

# Run Flask API server
python -m src.main &

# Run LiveKit agent
python -c "from src.voice_agent import entrypoint, prewarm; from livekit.agents import cli, WorkerOptions; cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))" dev
