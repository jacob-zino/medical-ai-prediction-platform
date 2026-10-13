import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Navbar";
import Home from "./pages/Home";
import Pneumonia from "./pages/Pneumonia";
import Stroke from "./pages/Stroke";
import Parkinson from "./pages/Parkinson";
import BrainTumor from "./pages/BrainTumor";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f3f6fb] text-slate-800 flex">
        <Sidebar />

        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pneumonia" element={<Pneumonia />} />
              <Route path="/stroke" element={<Stroke />} />
              <Route path="/parkinson" element={<Parkinson />} />
              <Route path="/brain-tumor" element={<BrainTumor />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}