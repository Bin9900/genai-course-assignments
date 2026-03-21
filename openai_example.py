import os
from groq import Groq

# Temporarily setting key directly to test
os.environ["GROQ_API_KEY"] = "your-groq-key-here"

client = Groq(api_key=os.environ["GROQ_API_KEY"])

def query_api(prompt):
    """Query Mixtral-8x7B via Groq - free alternative to OpenAI"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying API...")
    result = query_api(user_prompt)
    print("\nResponse:")
    print(result)