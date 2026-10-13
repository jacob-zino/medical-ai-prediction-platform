from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import pneumonia, stroke, parkinson, brain_tumor

app = FastAPI(
    title="Medical AI Project API",
    description="AI-based disease detection system",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pneumonia.router, prefix="/predict", tags=["Pneumonia"])
app.include_router(stroke.router, prefix="/predict", tags=["Stroke"])
app.include_router(parkinson.router, prefix="/predict", tags=["Parkinson"])
app.include_router(brain_tumor.router, prefix="/predict", tags=["Brain Tumor"])


@app.get("/")
def root():
    return {"message": "Medical AI Project API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}