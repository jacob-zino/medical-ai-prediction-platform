import { useRef, useState } from "react";
import axios from "../api/axios";

type PredictionResponse = {
  prediction: string;
  confidence: number;
};

export default function Parkinson() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;

    setFile(selected);
    setResult(null);
    setError("");

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    if (selected) {
      setAudioUrl(URL.createObjectURL(selected));
    } else {
      setAudioUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a WAV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await axios.post("/predict/parkinson", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      <section className="rounded-[28px] border border-[#CCE3FF] bg-white px-6 py-6 md:px-8 md:py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#13356F]">
              Audio analysis
            </p>

            <h1 className="font-heading mt-3 text-3xl md:text-4xl font-semibold text-[#13356F]">
              Parkinson Detection
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#618EC9]">
              Upload a WAV voice sample to run the Parkinson detection model and
              review the prediction result in a clear presentation-ready format.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="rounded-full border border-[#CCE3FF] bg-[#13356F] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Choose WAV file
            </button>

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading || !file}
              className="rounded-full border border-[#CCE3FF] bg-[#CCE3FF] px-5 py-3 text-sm font-medium text-[#13356F] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Running prediction..." : "Run prediction"}
            </button>
          </div>
        </div>
      </section>

      <input
        type="file"
        accept=".wav,audio/wav"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.05fr_1.95fr]">
        <div className="rounded-[28px] border border-[#CCE3FF] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-[#CCE3FF] px-3 py-1 text-xs font-medium text-[#13356F]">
              Upload panel
            </span>
            <span className="text-sm text-[#13356F]">WAV only</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-[#13356F]">
            Input summary
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#618EC9]">
            Select one voice recording in WAV format, then run the model to get
            a Parkinson prediction and confidence score.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[22px] border border-[#F2F6FA] bg-[#F2F6FA] p-4">
              <p className="text-sm text-[#13356F]">Accepted format</p>
              <p className="mt-1 text-base font-medium text-[#13356F]">.wav</p>
            </div>

            <div className="rounded-[22px] border border-[#F2F6FA] bg-[#F2F6FA] p-4">
              <p className="text-sm text-[#13356F]">Selected file</p>
              <p className="mt-1 break-words text-base font-medium text-[#13356F]">
                {file ? file.name : "No file selected"}
              </p>
            </div>

            <div className="rounded-[22px] border border-[#F2F6FA] bg-[#F2F6FA] p-4">
              <p className="text-sm text-emerald-700">Model status</p>
              <p className="mt-1 text-base font-medium text-[#13356F]">
                {loading ? "Processing..." : "Ready"}
              </p>
            </div>
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
                Preview and result
              </h2>
              <p className="mt-1 text-sm text-[#618EC9]">
                Review the uploaded sample and the returned model output.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Prediction view
            </span>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/40 p-5 border-l-4 border-l-emerald-600">
              <p className="mb-3 text-sm font-medium text-emerald-700">
                Audio preview
              </p>

              {audioUrl ? (
                <div className="rounded-[20px] border border-[#CCE3FF] bg-white p-4">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/wav" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-white text-sm text-emerald-700">
                  No audio selected yet
                </div>
              )}
            </div>

            <div className="rounded-[24px] border border-emerald-100 bg-emerald-50/40 p-5 border-l-4 border-l-emerald-600">
              <p className="mb-3 text-sm font-medium text-emerald-700">
                Model output
              </p>

              {result ? (
                <div className="space-y-4">
                  <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Prediction</p>
                    <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                      {result.prediction}
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm text-emerald-700">Confidence</p>
                    <p className="mt-1 text-2xl font-semibold text-[#13356F]">
                      {(result.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-36 items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-white text-sm text-emerald-700">
                  No prediction yet
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}