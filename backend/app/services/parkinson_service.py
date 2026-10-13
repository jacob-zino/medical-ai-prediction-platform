import io
import os
import numpy as np
import librosa
import joblib
from tensorflow import keras

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "parkinson_best_model.keras")
SCALER_PATH = os.path.join(BASE_DIR, "models", "parkinson_scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "parkinson_label_encoder.pkl")

print("MODEL LOADED FROM:", MODEL_PATH)
print("SCALER LOADED FROM:", SCALER_PATH)
print("ENCODER LOADED FROM:", ENCODER_PATH)

model = keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoder = joblib.load(ENCODER_PATH)


def extract_features_from_bytes(audio_bytes, n_mfcc=20):
    y, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000, mono=True)

    y, _ = librosa.effects.trim(y)

    if len(y) == 0:
        raise ValueError("Empty audio after trimming silence.")

    if np.max(np.abs(y)) > 0:
        y = y / np.max(np.abs(y))

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)

    mfcc_mean = np.mean(mfcc, axis=1)
    mfcc_std = np.std(mfcc, axis=1)

    zcr = np.mean(librosa.feature.zero_crossing_rate(y))
    rms = np.mean(librosa.feature.rms(y=y))
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))

    features = np.hstack([
        mfcc_mean,
        mfcc_std,
        zcr,
        rms,
        spectral_centroid
    ])

    return features


def calibrate_probabilities(raw_probs, temperature=2.0):
    raw_probs = np.asarray(raw_probs, dtype=np.float64)

    logits = np.log(raw_probs + 1e-8)
    scaled_logits = logits / temperature

    exp_logits = np.exp(scaled_logits)
    calibrated_probs = exp_logits / np.sum(exp_logits)

    return calibrated_probs


def predict_parkinson(audio_bytes):
    features = extract_features_from_bytes(audio_bytes)
    features_scaled = scaler.transform([features])

    raw_probs = model.predict(features_scaled, verbose=0)[0]

    probs = calibrate_probabilities(raw_probs, temperature=2.0)

    probabilities = {
        class_name: round(float(prob), 4)
        for class_name, prob in zip(label_encoder.classes_, probs)
    }

    parkinson_idx = label_encoder.transform(["Parkinson"])[0]
    healthy_idx = label_encoder.transform(["Healthy"])[0]

    parkinson_prob = float(probs[parkinson_idx])
    healthy_prob = float(probs[healthy_idx])

    mean_abs_z = float(np.mean(np.abs(features_scaled)))
    max_abs_z = float(np.max(np.abs(features_scaled)))

    if mean_abs_z > 4 or max_abs_z > 10:
        return {
            "prediction": "Uncertain",
            "confidence": round(float(max(probs)), 4),
            "probabilities": probabilities,
            "message": "This audio is different from the training dataset style."
        }

    if parkinson_prob >= healthy_prob:
        return {
            "prediction": "Parkinson",
            "confidence": round(parkinson_prob, 4),
            "probabilities": probabilities
        }

    return {
        "prediction": "Healthy",
        "confidence": round(healthy_prob, 4),
        "probabilities": probabilities
    }