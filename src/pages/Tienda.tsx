import React from "react";
import { Link } from "react-router-dom";
import { Store, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Tienda() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] flex flex-col font-sans relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(2, 119, 171, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 119, 171, 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Dog and Cat Images */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply z-0">
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          src="/miloperfil.webp"
          alt="Perro feliz"
          className="absolute -left-[15%] md:-left-[5%] bottom-0 w-[400px] md:w-[600px] object-contain opacity-80"
        />
        
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          src="/atreusperfil.webp"
          alt="Gato curioso"
          className="absolute -right-[10%] md:-right-[5%] bottom-0 w-[400px] md:w-[600px] object-contain opacity-80"
        />
      </div>

      <Header variant="back" />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center mt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center max-w-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-[#0277ab] dark:text-blue-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Próximamente
          </h1>
          
          <h2 className="text-xl md:text-2xl font-bold text-[#0277ab] mb-6 font-['Outfit'] tracking-widest uppercase">
            Tienda Virtual Terán
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
            Estamos preparando el mejor catálogo de alimentos, juguetes y accesorios para consentir a tu mascota. ¡Vuelve pronto!
          </p>

          <Link 
            to="/" 
            className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3.5 rounded-full font-bold shadow-xl hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar al Inicio
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
