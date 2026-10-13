import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Pneumonia", path: "/pneumonia" },
  { label: "Stroke", path: "/stroke" },
  { label: "Parkinson", path: "/parkinson" },
  { label: "Brain Tumor", path: "/brain-tumor" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <aside className="w-[250px] min-h-screen bg-[#EDF2F7] border-r border-slate-100 px-5 py-6 hidden md:flex md:flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#13356F]">Medical AI</h1>
        <p className="text-sm text-slate-500 mt-1">
          Disease Detection Dashboard
        </p>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-2xl px-4 py-3 font-medium transition ${
                active
                  ? "bg-[#CEE4FC] text-[#13356F]"
                  : "text-[#13356F] hover:bg-slate-100 hover:text-[#13356F]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}