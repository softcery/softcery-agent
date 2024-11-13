import string
from flask import Blueprint, jsonify, request, abort
from config import RATE_LIMIT_MAX_REQUESTS_API, RATE_LIMIT_TIME_WINDOW_API
from token_service import create_access_token
import random
from rate_limiter import RateLimiter

api_bp = Blueprint('api', __name__)

# Initialize the rate limiter for IPs with desired limits
rate_limiter = RateLimiter(max_requests=RATE_LIMIT_MAX_REQUESTS_API, time_window=RATE_LIMIT_TIME_WINDOW_API)  # 1 request per minute

@api_bp.route("/getToken", methods=["GET"])
def get_token():
    # Get the 'id' from query parameters if present
    request_id = request.args.get('prompt_id')
    
    ip_address = request.remote_addr
    if not rate_limiter.is_allowed(ip_address):
        abort(429, description="Too many requests from this IP. Please try again later.")
    
    participant_identity = f"user_{random.randint(1, 10000)}"
    room_name = "voice_assistant_room_" + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    
    # Append 'id' to room_name in the format "_prompt_{id}" if it exists
    if request_id:
        room_name += f"_prompt_{request_id}"
    
    participant_token = create_access_token(participant_identity, room_name)
    response = {
        "token": participant_token,
        "identity": participant_identity,
        "room": room_name
    }
    
    # Include 'id' in the response only if it is provided
    if request_id:
        response["id"] = request_id
    
    return jsonify(response)

