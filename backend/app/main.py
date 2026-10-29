from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.analyzer.code_analyzer import analyze_code


app = FastAPI(
    title="CodePulse API",
    description="Intelligent Code Quality Analyzer API",
    version="1.0.0",
)


# Allow requests from the local React development server.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CodeAnalysisRequest(BaseModel):
    code: str = Field(
        ...,
        min_length=1,
        max_length=100000,
        description="Python source code to analyze",
    )


@app.get("/")
def root():
    return {
        "success": True,
        "message": "CodePulse API is running!",
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
    }


@app.post("/api/analyze")
def analyze_source_code(request: CodeAnalysisRequest):
    try:
        result = analyze_code(request.code)
        return result

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        # Keep internal exception details out of the response.
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred during code analysis.",
        ) from error