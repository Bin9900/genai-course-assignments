# multi_api_query.py
# Unified program to query any of the six supported AI providers.
# Bonus features: streaming (OpenAI/Groq/Gemini), response comparison, retry with backoff.

import os
import time
import requests
import google.generativeai as genai

# ── lazy imports so missing packages don't crash unrelated providers ──────────
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    from groq import Groq
except ImportError:
    Groq = None

try:
    import cohere
except ImportError:
    cohere = None


# ── helpers ───────────────────────────────────────────────────────────────────

def retry(fn, retries=3, backoff=2):
    """Call fn(); on exception wait backoff**attempt seconds and retry."""
    for attempt in range(retries):
        try:
            return fn()
        except Exception as e:
            if attempt == retries - 1:
                return f"Error after {retries} attempts: {e}"
            wait = backoff ** attempt
            print(f"  [retry {attempt + 1}] Error: {e}. Retrying in {wait}s…")
            time.sleep(wait)


# ── individual provider functions ─────────────────────────────────────────────

def query_openai(prompt, stream=False):
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        return "OPENAI_API_KEY not set."
    if OpenAI is None:
        return "openai package not installed."
    client = OpenAI(api_key=key)

    def call():
        if stream:
            print("\nResponse (streaming):")
            full = ""
            with client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500, temperature=0.7, stream=True,
            ) as s:
                for chunk in s:
                    delta = chunk.choices[0].delta.content or ""
                    print(delta, end="", flush=True)
                    full += delta
            print()
            return full
        else:
            r = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500, temperature=0.7,
            )
            return r.choices[0].message.content.strip()

    return retry(call)


def query_groq(prompt, stream=False):
    key = os.getenv("GROQ_API_KEY")
    if not key:
        return "GROQ_API_KEY not set."
    if Groq is None:
        return "groq package not installed."
    client = Groq(api_key=key)

    def call():
        if stream:
            print("\nResponse (streaming):")
            full = ""
            with client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500, temperature=0.7, stream=True,
            ) as s:
                for chunk in s:
                    delta = chunk.choices[0].delta.content or ""
                    print(delta, end="", flush=True)
                    full += delta
            print()
            return full
        else:
            r = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500, temperature=0.7,
            )
            return r.choices[0].message.content.strip()

    return retry(call)


def query_ollama(prompt):
    url = "http://localhost:11434/api/generate"

    def call():
        r = requests.post(
            url,
            json={"model": "llama3", "prompt": prompt, "stream": False,
                  "options": {"temperature": 0.7, "num_predict": 500}},
            timeout=120,
        )
        r.raise_for_status()
        return r.json().get("response", "No response.").strip()

    return retry(call)


def query_huggingface(prompt):
    key = os.getenv("HUGGINGFACE_API_KEY")
    if not key:
        return "HUGGINGFACE_API_KEY not set."
    model_id = "mistralai/Mistral-7B-Instruct-v0.3"
    url = f"https://api-inference.huggingface.co/models/{model_id}"
    headers = {"Authorization": f"Bearer {key}"}
    formatted = f"<s>[INST] {prompt} [/INST]"

    def call():
        r = requests.post(
            url, headers=headers,
            json={"inputs": formatted,
                  "parameters": {"max_new_tokens": 500, "temperature": 0.7,
                                 "return_full_text": False}},
            timeout=60,
        )
        r.raise_for_status()
        data = r.json()
        if isinstance(data, list) and data:
            return data[0].get("generated_text", "No text.").strip()
        return str(data)

    return retry(call)


def query_gemini(prompt, stream=False):
    key = os.getenv("GOOGLE_API_KEY")
    if not key:
        return "GOOGLE_API_KEY not set."
    genai.configure(api_key=key)
    m = genai.GenerativeModel(
        "gemini-1.5-flash",
        generation_config=genai.types.GenerationConfig(
            max_output_tokens=500, temperature=0.7),
    )

    def call():
        if stream:
            print("\nResponse (streaming):")
            full = ""
            for chunk in m.generate_content(prompt, stream=True):
                print(chunk.text, end="", flush=True)
                full += chunk.text
            print()
            return full
        else:
            return m.generate_content(prompt).text.strip()

    return retry(call)


def query_cohere(prompt):
    key = os.getenv("COHERE_API_KEY")
    if not key:
        return "COHERE_API_KEY not set."
    if cohere is None:
        return "cohere package not installed."
    co = cohere.ClientV2(api_key=key)

    def call():
        r = co.chat(
            model="command-r",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500, temperature=0.7,
        )
        return r.message.content[0].text.strip()

    return retry(call)


# ── provider registry ─────────────────────────────────────────────────────────

PROVIDERS = {
    "1": ("OpenAI (GPT-4o-mini)",           query_openai),
    "2": ("Groq (Llama 3)",                 query_groq),
    "3": ("Ollama (local Llama 3)",         query_ollama),
    "4": ("Hugging Face (Mistral-7B)",      query_huggingface),
    "5": ("Google Gemini (1.5 Flash)",      query_gemini),
    "6": ("Cohere (Command R)",             query_cohere),
}

STREAMING_PROVIDERS = {"1", "2", "5"}   # providers that support streaming


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 55)
    print("         Multi-API Query Tool")
    print("=" * 55)

    # Provider selection
    print("\nAvailable AI providers:")
    for k, (name, _) in PROVIDERS.items():
        print(f"  {k}. {name}")
    print("  7. Compare ALL providers")

    choice = input("\nSelect provider (1-7): ").strip()

    # Prompt input
    user_prompt = input("\nEnter your prompt: ").strip()
    if not user_prompt:
        print("Prompt cannot be empty.")
        return

    # Streaming preference (only for supported providers)
    use_stream = False
    if choice in STREAMING_PROVIDERS:
        s = input("Enable streaming? (y/n) [n]: ").strip().lower()
        use_stream = s == "y"

    print()

    # Dispatch
    if choice == "7":
        print("Querying ALL providers — this may take a moment…\n")
        results = {}
        for k, (name, fn) in PROVIDERS.items():
            print(f"── {name} ──")
            try:
                # streaming not used in compare mode for cleaner output
                res = fn(user_prompt)
            except TypeError:
                res = fn(user_prompt)
            results[name] = res
            print(res[:300] + ("…" if len(res) > 300 else ""))
            print()

        print("=" * 55)
        print("Response lengths:")
        for name, res in results.items():
            print(f"  {name}: {len(res)} chars")

    elif choice in PROVIDERS:
        name, fn = PROVIDERS[choice]
        print(f"Querying {name}…")
        try:
            if choice in STREAMING_PROVIDERS:
                result = fn(user_prompt, stream=use_stream)
            else:
                result = fn(user_prompt)
        except TypeError:
            result = fn(user_prompt)

        if not use_stream:
            print("\nResponse:")
            print(result)
    else:
        print("Invalid choice. Please run the program again and select 1-7.")


if __name__ == "__main__":
    main()
