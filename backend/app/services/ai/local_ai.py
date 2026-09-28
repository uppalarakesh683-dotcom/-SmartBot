import os

from dotenv import load_dotenv
from huggingface_hub import AsyncInferenceClient


load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL = os.getenv(
    "HF_MODEL",
    "meta-llama/Llama-3.1-8B-Instruct",
)

if not HF_TOKEN:
    raise RuntimeError("HF_TOKEN is missing from .env")


client = AsyncInferenceClient(
    api_key=HF_TOKEN,
)


async def generate_local_response(message: str) -> str:
    response = await client.chat.completions.create(
        model=HF_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are SmartBot, an intelligent AI assistant. "
                    "Give clear, useful, accurate and well-structured answers."
                ),
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=0.7,
        max_tokens=512,
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "Hugging Face returned an empty response."
        )

    return content