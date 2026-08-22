import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Lazy loading pages for better performance
const Home = React.lazy(() => import("./pages/Home"));
const Servicios = React.lazy(() => import("./pages/Servicios"));
const Emergencias = React.lazy(() => import("./pages/Emergencias"));
const Tienda = React.lazy(() => import("./pages/Tienda"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Fallback loader while chunks are downloading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] dark:bg-[#121212]">
    <Loader2 className="w-10 h-10 animate-spin text-[#0277ab]" />
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/emergencias" element={<Emergencias />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
