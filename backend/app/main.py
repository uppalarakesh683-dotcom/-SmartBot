from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.services.ai.local_ai import generate_local_response


app = FastAPI(
    title="SmartBot API",
    description="AI-powered backend for SmartBot",
    version="1.0.0",
)


# Allow the Next.js frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
    )


class ChatResponse(BaseModel):
    response: str


@app.get("/")
async def root():
    return {
        "message": "SmartBot API is running",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "SmartBot backend",
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        answer = await generate_local_response(request.message)

        return ChatResponse(
            response=answer
        )

    except Exception as error:
        print(f"AI ERROR: {repr(error)}")

        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(error)}",
        )