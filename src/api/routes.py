from flask import Blueprint, jsonify
from src.token_service import create_access_token
import random

api_bp = Blueprint('api', __name__)

@api_bp.route("/getToken", methods=["GET"])
def get_token():
    participant_identity = f"user_{random.randint(1, 10000)}"
    room_name = "voice_assistant_room"
    participant_token = create_access_token(participant_identity, room_name)
    return jsonify({
        "token": participant_token,
        "identity": participant_identity,
        "room": room_name
    })
