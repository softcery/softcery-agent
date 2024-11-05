from flask import Flask
from src.api.routes import api_bp
from src.voice_agent import entrypoint, prewarm
from livekit.agents import cli, WorkerOptions
import threading

app = Flask(__name__)

app.register_blueprint(api_bp, url_prefix='/api')

def start_livekit_agent():
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))

if __name__ == "__main__":
    agent_thread = threading.Thread(target=start_livekit_agent)
    agent_thread.start()

    app.run(host="0.0.0.0", port=5000)
