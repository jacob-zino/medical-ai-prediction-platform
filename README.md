# Medical AI Prediction Platform

A web application that serves four machine-learning models through a FastAPI backend and a React/TypeScript frontend: pneumonia detection from chest X-rays, brain-tumor classification from MRI scans, Parkinson's detection from voice recordings, and stroke-risk prediction from clinical data.

> University project built by a team of two (2026): **Jacob Zino** ([@jacob-zino](https://github.com/jacob-zino)) and **Magaly El Khoury** ([@magalykhoury](https://github.com/magalykhoury)).

> ⚠️ Educational project only. It is not a medical device and must not be used for diagnosis.

## Models
| Module | Input | Approach | Test result |
|---|---|---|---|
| Pneumonia | Chest X-ray image | MobileNetV2 transfer learning (vs. EfficientNetB0); decision threshold 0.63 chosen on the validation set | Accuracy 88.0%, AUC 0.97, pneumonia recall 97.7% (624 images) |
| Brain tumor | MRI image (glioma / meningioma / pituitary / no tumor) | Custom CNN vs. MobileNetV2 vs. EfficientNetB0 with fine-tuning | MobileNetV2: accuracy 86.7% (1,600 images) |
| Parkinson's | `.wav` voice recording | MFCC and spectral features (Librosa) → dense neural network | Accuracy 97.7% (172 recordings)\* |
| Stroke risk | Clinical form (age, glucose, BMI, …) | Logistic regression; SMOTE on the training split only; threshold tuned on validation data | Recall 0.78, precision 0.18, ROC-AUC 0.84 (imbalanced data: ~5% positive) |

\* The Parkinson's split is random by recording; if the same speakers appear in train and test, this figure is optimistic.

Training and evaluation are in `notebooks/` (originally run on Google Colab, so the file paths point to Google Drive).

## Tech stack
**Backend:** Python 3.13 · FastAPI · Uvicorn · TensorFlow/Keras · scikit-learn · Librosa · NumPy/Pandas
**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS · React Router · Axios

## Project structure
```
backend/
  app/main.py            FastAPI app, CORS, routers
  app/routes/            /predict/pneumonia, /predict/brain-tumor, /predict/parkinson, /predict/stroke
  app/services/          Parkinson audio feature extraction
  models/                trained models, scalers, encoders, thresholds
frontend/                React + TypeScript single-page app (one page per model)
notebooks/               training and evaluation notebooks
```

## Getting started
**Prerequisites:** Python 3.13 and Node.js 20+.

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. The frontend calls the API on port 8000; check `src/api/axios.ts` if you change the port.

### API
| Endpoint | Body |
|---|---|
| `POST /predict/pneumonia` | multipart `file` (X-ray image) |
| `POST /predict/brain-tumor` | multipart `file` (MRI image) |
| `POST /predict/parkinson` | multipart `file` (`.wav`) |
| `POST /predict/stroke` | JSON: `gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status` |

## Datasets
The training data comes from public research datasets (chest X-rays, brain MRI, voice recordings, stroke clinical records). It is **not included** in this repository; download the datasets separately to re-run the notebooks.

## Known limitations
- Single-image predictions can be wrong; check the metrics above, not individual results.
- No authentication, and no input validation beyond file type.
