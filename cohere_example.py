# cohere_example.py
# Queries Cohere Command models using the Cohere Python SDK

import os
import cohere

# Configure API - reads key from environment variable
os.environ["COHERE_API_KEY"] = "your-cohere-key-here"
api_key = os.getenv("COHERE_API_KEY")
if not api_key:
    raise ValueError("COHERE_API_KEY environment variable is not set.")

# Initialize Cohere client
co = cohere.ClientV2(api_key=api_key)


def query_cohere(prompt):
    """Query Cohere's Command R model with a user prompt and return the response."""
    try:
        response = co.chat(
            model="command-r-plus-08-2024",            # Cohere's latest instruction-tuned model
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        # Extract text from the response
        return response.message.content[0].text.strip()
    except Exception as e:
        return f"Error: {str(e)}"


# Main execution
if __name__ == "__main__":
    user_prompt = input("Enter your prompt: ")
    print("\nQuerying Cohere API...")
    result = query_cohere(user_prompt)
    print("\nResponse:")
    print(result)
