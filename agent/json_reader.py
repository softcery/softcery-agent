import json
import os

def get_prompt_by_id(prompt_id, json_file_path='assets/personalized_prompts.json'):
    json_path = os.path.join(os.path.dirname(__file__), json_file_path)
    
    try:
        with open(json_path, 'r') as file:
            specialized_prompts = json.load(file)
        
        # Return the value if the id is found, otherwise return None
        return specialized_prompts.get(prompt_id)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        # Handle error if file is not found or cannot be decoded
        print(f"Error loading JSON file: {e}")
        return None
