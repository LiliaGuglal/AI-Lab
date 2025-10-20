"""
KickAI Judge Computer Vision Service
Main entry point for the CV processing service
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

app = FastAPI(
    title="KickAI Judge CV Service",
    description="Computer Vision processing service for kickboxing match analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "KickAI Judge Computer Vision",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "process_video": "/api/v1/process-video",
            "analyze_frame": "/api/v1/analyze-frame"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "cv-service",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.post("/api/v1/process-video")
async def process_video():
    """Process uploaded video for strike detection and analysis"""
    # TODO: Implement video processing pipeline
    return {
        "message": "Video processing endpoint - to be implemented",
        "status": "not_implemented"
    }

@app.post("/api/v1/analyze-frame")
async def analyze_frame():
    """Analyze single frame for pose estimation and strike detection"""
    # TODO: Implement frame analysis
    return {
        "message": "Frame analysis endpoint - to be implemented", 
        "status": "not_implemented"
    }

if __name__ == "__main__":
    port = int(os.getenv("CV_PORT", 8000))
    host = os.getenv("CV_HOST", "0.0.0.0")
    
    print(f"🥊 Starting KickAI Judge CV Service on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True if os.getenv("ENV") == "development" else False
    )