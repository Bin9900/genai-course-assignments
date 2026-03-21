# gemini_example.py
import os
from google import genai

os.environ["GOOGLE_API_KEY"] = "your-google-key-here"

client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

def query_gemini(prompt):
    """Query Google Gemini with a prompt"""
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying Google Gemini API...")
    result = query_gemini(user_prompt)
    print("\nResponse:")
    print(result)