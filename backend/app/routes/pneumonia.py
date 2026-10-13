from fastapi import APIRouter, UploadFile, File
import numpy as np
from tensorflow import keras
from tensorflow.keras.utils import img_to_array
from PIL import Image
import io
import os
import json

router = APIRouter()

IMG_SIZE = (224, 224)

# backend/app/routes/pneumonia.py
# __file__ is inside backend/app/routes
# This goes back 3 levels to backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best_mobilenetv2_final.keras")
THRESHOLD_PATH = os.path.join(BASE_DIR, "models", "pneumonia_threshold.json")

print("Pneumonia model path:", MODEL_PATH)
print("Pneumonia threshold path:", THRESHOLD_PATH)

# Load model once when backend starts
model = keras.models.load_model(MODEL_PATH)

# Load threshold once when backend starts
with open(THRESHOLD_PATH, "r") as f:
    threshold_info = json.load(f)

PNEUMONIA_THRESHOLD = float(threshold_info["threshold"])

print("Pneumonia model loaded successfully")
print("Pneumonia threshold:", PNEUMONIA_THRESHOLD)


def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize(IMG_SIZE)

    img_array = img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)

    # IMPORTANT:
    # Do NOT divide by 255 here.
    # Your trained Keras model already contains MobileNetV2 preprocess_input inside the model.
    return img_array


@router.post("/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        image = Image.open(io.BytesIO(contents))
        img_array = preprocess_image(image)

        probability = float(model.predict(img_array, verbose=0)[0][0])

        prediction = "PNEUMONIA" if probability >= PNEUMONIA_THRESHOLD else "NORMAL"

        confidence = probability if prediction == "PNEUMONIA" else 1 - probability

        return {
            "prediction": prediction,
            "confidence": round(float(confidence), 4),
            "pneumonia_probability": round(float(probability), 4),
            "threshold": PNEUMONIA_THRESHOLD
        }

    except Exception as e:
        return {
            "error": str(e)
        }