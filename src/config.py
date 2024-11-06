import os
from dotenv import load_dotenv

load_dotenv()

CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")
CARTESIA_API_URL = os.getenv("CARTESIA_API_URL", "https://api.cartesia.ai/voices")

RATE_LIMIT_MAX_REQUESTS_RTC = int(os.getenv("RATE_LIMIT_MAX_REQUESTS_RTC", 5))
RATE_LIMIT_TIME_WINDOW_RTC = int(os.getenv("RATE_LIMIT_TIME_WINDOW_RTC", 60))

RATE_LIMIT_MAX_REQUESTS_API = int(os.getenv("RATE_LIMIT_MAX_REQUESTS_API", 5))
RATE_LIMIT_TIME_WINDOW_API = int(os.getenv("RATE_LIMIT_TIME_WINDOW_API", 60))

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")

API_PORT = os.getenv("API_PORT", 5000)
API_ORIGINS = os.getenv("API_ORIGINS")