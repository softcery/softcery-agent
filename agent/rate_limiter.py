import time
from typing import Dict, List

class RateLimiter:
    def __init__(self, max_requests: int, time_window: int):
        self.max_requests = max_requests
        self.time_window = time_window
        self.requests: Dict[str, List[float]] = {}

    def is_allowed(self, user_id: str) -> bool:
        current_time = time.time()
        if user_id not in self.requests:
            self.requests[user_id] = []

        # Remove timestamps outside the time window
        self.requests[user_id] = [
            timestamp for timestamp in self.requests[user_id]
            if current_time - timestamp < self.time_window
        ]

        if len(self.requests[user_id]) < self.max_requests:
            self.requests[user_id].append(current_time)
            return True
        return False
