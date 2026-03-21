# huggingface_example.py
import os
from huggingface_hub import InferenceClient

os.environ["HUGGINGFACE_API_KEY"] = "your-hf-key-here"

client = InferenceClient(
    provider="novita",
    api_key=os.environ["HUGGINGFACE_API_KEY"],
)

def query_huggingface(prompt):
    """Query Hugging Face model with a prompt"""
    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying Hugging Face...")
    result = query_huggingface(user_prompt)
    print("\nResponse:")
    print(result)