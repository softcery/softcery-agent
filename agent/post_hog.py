from posthog import Posthog
from config import POSTHOG_API_KEY, POSTHOG_HOST

posthogInstance = Posthog(project_api_key=POSTHOG_API_KEY, host=POSTHOG_HOST)
