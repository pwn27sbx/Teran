import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Servicios from "./pages/Servicios";

import Emergencias from "./pages/Emergencias";
import GlobalBackground from "./components/GlobalBackground";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] selection:bg-[#f4484a] selection:text-white">
        <GlobalBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/emergencias" element={<Emergencias />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
