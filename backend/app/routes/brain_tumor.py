from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from PIL import Image
import io
import json
import os

router = APIRouter()

# backend/app/routes/brain_tumor.py
# _file_ is inside backend/app/routes
# This goes back 3 levels to backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "brain_tumor_best_model.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "models", "brain_tumor_class_names.json")

print("Brain tumor model path:", MODEL_PATH)
print("Brain tumor class names path:", CLASS_NAMES_PATH)
print("Model exists:", os.path.exists(MODEL_PATH))
print("Class names exists:", os.path.exists(CLASS_NAMES_PATH))

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print("Brain tumor classes:", class_names)


def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image)

    # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)

    # IMPORTANT:
    # This is EfficientNet preprocessing.
    # Do NOT divide by 255 here.
    image_array = preprocess_input(image_array)

    return image_array


@router.post("/brain-tumor")
async def predict_brain_tumor(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        processed = preprocess_image(image)

        preds = model.predict(processed, verbose=0)[0]

        predicted_index = int(np.argmax(preds))
        predicted_class = class_names[predicted_index]
        confidence = float(preds[predicted_index])

        all_predictions = {
            class_names[i]: round(float(preds[i]) * 100, 2)
            for i in range(len(class_names))
        }

        return JSONResponse({
            "prediction": predicted_class,
            "confidence": round(confidence * 100, 2),
            "all_predictions": all_predictions
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)