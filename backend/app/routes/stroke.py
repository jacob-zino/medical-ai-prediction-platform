from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import joblib

router = APIRouter()

# ===== Load saved artifacts =====
MODEL_PATH = "models/stroke_model.pkl"
SCALER_PATH = "models/stroke_scaler.pkl"
IMPUTER_PATH = "models/stroke_bmi_imputer.pkl"
ENCODERS_PATH = "models/stroke_label_encoders.pkl"
THRESHOLD_PATH = "models/stroke_threshold.pkl"
FEATURE_COLUMNS_PATH = "models/stroke_feature_columns.pkl"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
imputer = joblib.load(IMPUTER_PATH)
label_encoders = joblib.load(ENCODERS_PATH)
threshold = joblib.load(THRESHOLD_PATH)
feature_columns = joblib.load(FEATURE_COLUMNS_PATH)


# ===== Request schema =====
class StrokeInput(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float | None = None
    smoking_status: str


@router.post("/stroke")
def predict_stroke(data: StrokeInput):
    # Convert input to DataFrame
    input_df = pd.DataFrame([data.model_dump()])

    # Reorder columns exactly like training
    input_df = input_df[feature_columns]

    # Impute bmi if missing
    input_df[["bmi"]] = imputer.transform(input_df[["bmi"]])

    # Encode categorical columns
    for column in input_df.select_dtypes(include="object").columns:
        if column in label_encoders:
            encoder = label_encoders[column]

            value = input_df.at[0, column]

            if value not in encoder.classes_:
                return {
                    "error": f"Invalid value '{value}' for column '{column}'. "
                             f"Allowed values: {list(encoder.classes_)}"
                }

            input_df[column] = encoder.transform(input_df[column])

    # Scale
    input_scaled = scaler.transform(input_df)

    # Predict probability
    probability = float(model.predict_proba(input_scaled)[0][1])

    # Apply saved threshold
    prediction = int(probability >= threshold)

    interpretation = "Higher stroke risk" if prediction == 1 else "Lower stroke risk"

    return {
        "prediction": prediction,
        "probability": round(probability, 4),
        "threshold": float(threshold),
        "interpretation": interpretation
    }