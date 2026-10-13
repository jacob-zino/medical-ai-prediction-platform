import { Link } from "react-router-dom";

const modules = [
  {
    title: "Pneumonia Detection",
    description: "Upload a chest X-ray image and receive a model prediction.",
    path: "/pneumonia",
    status: "Ready",
    type: "Image AI",
  },
  {
    title: "Stroke Prediction",
    description: "Fill in patient data to estimate stroke risk.",
    path: "/stroke",
    status: "Ready",
    type: "Tabular ML",
  },
  {
    title: "Parkinson Detection",
    description: "Upload a WAV audio sample for voice-based analysis.",
    path: "/parkinson",
    status: "Ready",
    type: "Audio DL",
  },
  {
    title: "Brain Tumor Detection",
    description: "Upload an MRI scan for brain tumor analysis.",
    path: "/brain-tumor",
    status: "Ready",
    type: "Image AI",
  }
];


export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#CCE3FF] bg-white px-6 py-6 md:px-8 md:py-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium tracking-wide text-[#13356F] uppercase">
              Medical AI Workspace
            </p>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#13356F] leading-tight">  
              Disease Detection Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#618EC9]">
              A simple interface for testing the medical AI modules in one
              place. Open a module, upload the required input, and review the
              prediction output clearly during your presentation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* <Link
              to="/pneumonia"
              className="rounded-full border border-[#CCE3FF] bg-[#CCE3FF] px-5 py-3 text-sm font-medium text-[#13356F] transition hover:opacity-80"
            >
              Open first module
            </Link>

            <Link
              to="/parkinson"
              className="rounded-full border border-[#CCE3FF] bg-[#FEFEFE] px-5 py-3 text-sm font-medium text-[#13356F] transition hover:opacity-80"
            >
              View all modules
            </Link> */}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
        <div className="rounded-[28px] border border-[#CCE3FF] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full bg-[#CCE3FF] px-3 py-1 text-xs font-medium text-[#13356F]">
              Overview
            </span>
            <span className="text-sm text-[#13356F]">3 modules</span>
          </div>

          <h2 className="font-heading text-2xl font-semibold text-[#13356F]">
            System status
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#618EC9]">
            The platform currently includes three available medical AI modules
            for image, audio, and clinical-data based prediction.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-[#F2F6FA] bg-[#F2F6FA] px-4 py-4">
              <p className="text-sm text-[#13356F]">Active modules</p>
              <p className="mt-1 text-2xl font-semibold text-[#13356F]">3</p>
            </div>

            <div className="rounded-2xl border border-[#F2F6FA] bg-[#F2F6FA] px-4 py-4">
              <p className="text-sm text-[#13356F]">Supported inputs</p>
              <p className="mt-1 text-base font-medium text-[#13356F]">
                X-ray, WAV, medical form
              </p>
            </div>

            <div className="rounded-2xl border border-[#F2F6FA] bg-[#F2F6FA] px-4 py-4">
              <p className="text-sm text-[#13356F]">Presentation mode</p>
              <p className="mt-1 text-base font-medium text-[#13356F]">
                Clean and demo-ready
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#CCE3FF] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-[#13356F]">
                Available modules
              </h2>
              <p className="mt-1 text-sm text-[#618EC9]">
                Open any module and continue testing from the dashboard.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              All ready
            </span>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <Link
                key={module.path}
                to={module.path}
                className="block rounded-[22px] border border-[#CCE3FF] border-l-4 border-l-emerald-600 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        {module.status}
                      </span>
                      <span className="rounded-full border border-[#CCE3FF] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#13356F]">
                        {module.type}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-[#13356F]">
                      {module.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[#618EC9]">
                      {module.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-center">
                    <span className="rounded-full border border-[#CCE3FF] bg-white px-4 py-2 text-sm font-medium text-[#13356F]">
                      Open module
                    </span>
                    <span className="text-lg text-stone-400">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}