import { useState } from "react";
import api from "../api/axios";

type StrokeResponse = {
  prediction: number;
  probability: number;
  threshold: number;
  interpretation: string;
  error?: string;
};

type StrokeFormData = {
  gender: string;
  age: number;
  hypertension: number;
  heart_disease: number;
  ever_married: string;
  work_type: string;
  Residence_type: string;
  avg_glucose_level: number;
  bmi: number;
  smoking_status: string;
};

const inputClass =
  "mt-2 w-full rounded-[18px] border border-[#CCE3FF] bg-[#F2F6FA] px-4 py-3 text-[#13356F] outline-none transition focus:border-[#9EC5F8] focus:bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#13356F]">{label}</label>
      {children}
    </div>
  );
}

const initialFormData: StrokeFormData = {
  gender: "Male",
  age: 23,
  hypertension: 0,
  heart_disease: 0,
  ever_married: "No",
  work_type: "Govt_job",
  Residence_type: "Urban",
  avg_glucose_level: 89,
  bmi: 24.3,
  smoking_status: "formerly smoked",
};

export default function Stroke() {
  const [formData, setFormData] = useState<StrokeFormData>(initialFormData);
  const [result, setResult] = useState<StrokeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" ||
        name === "hypertension" ||
        name === "heart_disease" ||
        name === "avg_glucose_level" ||
        name === "bmi"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post<StrokeResponse>(
        "/predict/stroke",
        formData
      );

      if (response.data.error) {
        setError(response.data.error);
        return;
      }

      setResult(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to predict stroke risk.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResult(null);
    setError("");
  };

  const isHighRisk =
    result &&
    (result.prediction === 1 || result.probability > result.threshold);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <section className="rounded-[28px] border border-[#CCE3FF] bg-white px-6 py-6 md:px-8 md:py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13356F]">
              Clinical form analysis
            </p>

            <h1 className="font-heading mt-3 text-3xl md:text-4xl font-semibold text-[#13356F]">
              Stroke Risk Prediction
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#618EC9]">
              Enter the patient medical information below to estimate stroke
              risk using the trained machine learning model in a clear and
              presentation-ready workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full border border-[#CCE3FF] bg-[#13356F] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Running prediction..." : "Predict stroke risk"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-full border border-[#CCE3FF] bg-[#CCE3FF] px-5 py-3 text-sm font-medium text-[#13356F] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset form
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.9fr]">
        <div className="rounded-[28px] border border-[#CCE3FF] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-[#CCE3FF] px-3 py-1 text-xs font-medium text-[#13356F]">
              Patient form
            </span>
            <span className="text-sm text-[#13356F]">Clinical inputs</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-[#13356F]">
            Patient information
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#618EC9]">
            Complete the fields below, then run the model to estimate the
            patient stroke risk.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Gender">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Age">
              <input
                name="age"
                type="number"
                step="0.1"
                value={formData.age}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Hypertension">
              <select
                name="hypertension"
                value={formData.hypertension}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </Field>

            <Field label="Heart Disease">
              <select
                name="heart_disease"
                value={formData.heart_disease}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </Field>

            <Field label="Ever Married">
              <select
                name="ever_married"
                value={formData.ever_married}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="Work Type">
              <select
                name="work_type"
                value={formData.work_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Private</option>
                <option>Self-employed</option>
                <option>Govt_job</option>
                <option>children</option>
                <option>Never_worked</option>
              </select>
            </Field>

            <Field label="Residence Type">
              <select
                name="Residence_type"
                value={formData.Residence_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Urban</option>
                <option>Rural</option>
              </select>
            </Field>

            <Field label="Average Glucose Level">
              <input
                name="avg_glucose_level"
                type="number"
                step="0.1"
                value={formData.avg_glucose_level}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="BMI">
              <input
                name="bmi"
                type="number"
                step="0.1"
                value={formData.bmi}
                onChange={handleChange}
                className={inputClass}
              />
            </Field>

            <Field label="Smoking Status">
              <select
                name="smoking_status"
                value={formData.smoking_status}
                onChange={handleChange}
                className={inputClass}
              >
                <option>never smoked</option>
                <option>formerly smoked</option>
                <option>smokes</option>
                <option>Unknown</option>
              </select>
            </Field>
          </div>

          {error && (
            <div className="mt-5 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-[#CCE3FF] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[#13356F]">
                Prediction result
              </h2>
              <p className="mt-1 text-sm text-[#618EC9]">
                Review the returned risk assessment and model values.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Output
            </span>
          </div>

          {!result ? (
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/40 p-5 border-l-4 border-l-emerald-600">
              <div className="flex h-60 items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-white p-8 text-center text-sm leading-7 text-emerald-700">
                Fill in the patient information form and click “Predict stroke
                risk” to display the model output here.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`rounded-[22px] border-l-4 p-4 ${
                  isHighRisk
                    ? "border border-red-200 border-l-red-500 bg-red-50"
                    : "border border-emerald-200 border-l-emerald-600 bg-emerald-50"
                }`}
              >
                <p className={`${isHighRisk ? "text-red-700" : "text-emerald-700"} text-sm`}>
                  Risk assessment
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                  {result.interpretation === "Lower stroke risk"
                    ? "Low Risk of Stroke"
                    : "High Risk of Stroke"}
                </p>
              </div>

              <div
                className={`rounded-[22px] border-l-4 p-4 ${
                  result.probability > result.threshold
                    ? "border border-red-200 border-l-red-500 bg-red-50"
                    : "border border-emerald-200 border-l-emerald-600 bg-emerald-50"
                }`}
              >
                <p
                  className={`${
                    result.probability > result.threshold
                      ? "text-red-700"
                      : "text-emerald-700"
                  } text-sm`}
                >
                  Probability
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                  {(result.probability * 100).toFixed(2)}%
                </p>
              </div>

              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/40 border-l-4 border-l-emerald-600 p-4">
                <p className="text-sm text-emerald-700">Threshold</p>
                <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                  {result.threshold.toFixed(2)}
                </p>
              </div>

              <div className="rounded-[22px] border border-emerald-100 bg-emerald-50/40 border-l-4 border-l-emerald-600 p-4">
                <p className="text-sm text-emerald-700">Model output</p>
                <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                  {result.prediction}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}