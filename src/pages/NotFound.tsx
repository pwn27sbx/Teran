import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col font-sans relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(2, 119, 171, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 119, 171, 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      
      <Header variant="back" />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        <h1 className="text-8xl md:text-9xl font-black text-[#0277ab] mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Página no encontrada</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-[#f4484a] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio
        </Link>
      </main>
    </div>
  );
}
