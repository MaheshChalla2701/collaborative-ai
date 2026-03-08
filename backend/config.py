"""Configuration for Collaborative AI."""

import os
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Council members - list of OpenRouter model identifiers
COUNCIL_MODELS = [
    "amazon/nova-2-lite-free", 
     "arcee-ai/trinity-mini-free", 
     "deepseek/deepseek-v3.2", 
     "mistralai/ministral-3-14b-instruct-2512",
     "deepseek/deepseek-v3.2-speciale",
     "x-ai/grok-4.1-fast",
     "nvidia/nemotron-nano-12b-v2-vl:free", 
    "openai/gpt-oss-safeguard-20b", 
    "qwen/qwen3-vl-30b-a3b-thinking",
    "stepfun/step-3.5-flash:free",
    "arcee-ai/trinity-large-preview:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "nvidia/nemotron-3-nano-30b-a3b:free"

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
