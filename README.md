# AI API Integration

A Python project that demonstrates how to integrate and query **six different Generative AI providers**: OpenAI, Groq, Ollama, Hugging Face, Google Gemini, and Cohere.

---

## Project Structure

```
ai-api-integration/
├── openai_example.py        # Query OpenAI GPT-4o-mini
├── groq_example.py          # Query Groq Llama 3
├── ollama_example.py        # Query local Ollama model
├── huggingface_example.py   # Query Hugging Face Mistral-7B
├── gemini_example.py        # Query Google Gemini 1.5 Flash
├── cohere_example.py        # Query Cohere Command R
├── multi_api_query.py       # Unified multi-provider tool (Bonus)
├── requirements.txt         # Python dependencies
├── README.md                # This file
└── screenshots/             # Output screenshots
    ├── openai_output.png
    ├── groq_output.png
    ├── ollama_output.png
    ├── huggingface_output.png
    ├── gemini_output.png
    └── cohere_output.png
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-api-integration
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Environment Variables

**Never hardcode API keys.** Use environment variables or a `.env` file.

#### Option A — Export directly (Linux/macOS)

```bash
export OPENAI_API_KEY="your-openai-key"
export GROQ_API_KEY="your-groq-key"
export HUGGINGFACE_API_KEY="your-hf-token"
export GOOGLE_API_KEY="your-google-key"
export COHERE_API_KEY="your-cohere-key"
```

#### Option B — PowerShell (Windows)

```powershell
$env:OPENAI_API_KEY="your-openai-key"
$env:GROQ_API_KEY="your-groq-key"
$env:HUGGINGFACE_API_KEY="your-hf-token"
$env:GOOGLE_API_KEY="your-google-key"
$env:COHERE_API_KEY="your-cohere-key"
```

#### Option C — `.env` file

Create a `.env` file in the project root (**add it to `.gitignore`!**):

```env
OPENAI_API_KEY=your-openai-key
GROQ_API_KEY=your-groq-key
HUGGINGFACE_API_KEY=your-hf-token
GOOGLE_API_KEY=your-google-key
COHERE_API_KEY=your-cohere-key
```

Then load it at runtime:

```python
from dotenv import load_dotenv
load_dotenv()
```

---

## How to Obtain Each API Key

| Provider | Steps |
|---|---|
| **OpenAI** | Sign up at [platform.openai.com](https://platform.openai.com/) → API Keys → Create new key |
| **Groq** | Sign up at [console.groq.com](https://console.groq.com/) → API Keys → Create key |
| **Ollama** | Download from [ollama.ai](https://ollama.ai/) — runs locally, no key needed |
| **Hugging Face** | Sign up at [huggingface.co](https://huggingface.co/) → Settings → Access Tokens → New token |
| **Google Gemini** | Visit [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) → Create API key |
| **Cohere** | Sign up at [dashboard.cohere.com](https://dashboard.cohere.com/) → API Keys → New trial key |

---

## How to Run Each Program

> Tip: Test with a simple prompt like `"What is artificial intelligence?"` first.

```bash
# OpenAI
python openai_example.py

# Groq
python groq_example.py

# Ollama (must have Ollama running locally)
ollama serve          # in a separate terminal
ollama pull llama3    # first time only
python ollama_example.py

# Hugging Face
python huggingface_example.py

# Google Gemini
python gemini_example.py

# Cohere
python cohere_example.py

# Multi-API (Bonus)
python multi_api_query.py
```

---

## Bonus Features (multi_api_query.py)

- **Provider selection** — choose any of the 6 providers interactively
- **Compare all** — option 7 queries all providers with the same prompt
- **Streaming responses** — enabled for OpenAI, Groq, and Gemini
- **Retry with exponential backoff** — automatically retries on transient errors
- **Response length comparison** — shows character counts when comparing providers

---

## Important Notes

- **Do NOT commit API keys** to GitHub — use environment variables or `.gitignore` your `.env` file
- Ollama requires the desktop app to be running (`ollama serve`)
- Free tier rate limits apply — avoid sending many rapid requests
- Hugging Face models may take a few seconds to warm up on first call
