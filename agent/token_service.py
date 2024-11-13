from livekit import api
from config import LIVEKIT_API_KEY, LIVEKIT_API_SECRET

def create_access_token(identity: str, room_name: str) -> str:
    token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
        .with_identity(identity) \
        .with_name(identity) \
        .with_grants(api.VideoGrants(room_join=True, room=room_name))
    return token.to_jwt()
