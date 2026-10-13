from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.parkinson_service import predict_parkinson

router = APIRouter()

@router.post("/parkinson")
async def predict_parkinson_route(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".wav"):
        raise HTTPException(status_code=400, detail="Only .wav files are allowed")

    audio_bytes = await file.read()

    try:
        result = predict_parkinson(audio_bytes)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")