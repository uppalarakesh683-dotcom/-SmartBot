import os

from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from .env")

client = AsyncGroq(api_key=GROQ_API_KEY)


async def generate_local_response(message: str) -> str:
    response = await client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are SmartBot, an intelligent AI assistant. "
                    "Give clear, useful and accurate answers."
                ),
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        temperature=0.7,
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("Groq returned an empty response.")

    return content