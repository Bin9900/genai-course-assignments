# ollama_example.py
# Queries a locally running Ollama instance via its REST API
# Prerequisite: install Ollama from https://ollama.ai/ and run `ollama pull llama3`

import requests
import json

# Ollama runs locally - no API key needed
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME  = "llama3"   # change to any model you have pulled locally


def query_ollama(prompt):
    """Send a prompt to the local Ollama server and return the response text."""
    payload = {
        "model":  MODEL_NAME,
        "prompt": prompt,
        "stream": False,          # get the full response in one shot
        "options": {
            "temperature": 0.7,
            "num_predict": 500,   # max tokens to generate
        },
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "No response received.").strip()
    except requests.exceptions.ConnectionError:
        return "Error: Ollama is not running. Start it with `ollama serve`."
    except Exception as e:
        return f"Error: {str(e)}"


# Main execution
if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print(f"\nQuerying Ollama ({MODEL_NAME}) locally...")
    result = query_ollama(user_prompt)
    print("\nResponse:")
    print(result)
