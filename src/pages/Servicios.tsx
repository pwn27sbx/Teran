import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import { Stethoscope } from "lucide-react";
import { categories, services } from "../data/servicesData";

export default function Servicios() {
  const [activeCategory, setActiveCategory] = useState("todos");

  const filteredServices = activeCategory === "todos" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] relative overflow-hidden font-['Outfit'] selection:bg-[#0277ab] selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <Header variant="back" />

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 text-[#0277ab] font-bold text-sm tracking-widest uppercase mb-6 shadow-sm">
            <Stethoscope className="w-4 h-4" />
            Especialidades
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Nuestros <span className="text-[#0277ab]">Servicios</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-serif leading-relaxed">
            Más de 24 años mejorando la salud de tu mascota. Descubre todas las especialidades con las que contamos.
          </p>
        </motion.div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat.id 
                  ? "bg-[#0277ab] text-white shadow-md scale-105" 
                  : "bg-white/50 text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 hover:text-[#0277ab]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid with AnimatePresence for filtering */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-5 md:p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border ${service.border} shadow-sm hover:shadow-lg transition-shadow cursor-pointer group flex items-start gap-4 h-full`}
              >
                <div className={`w-12 h-12 rounded-xl shrink-0 ${service.color} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 mt-1`}>
                  {service.icon}
                </div>
                <div>
                  <h2 className="text-[17px] md:text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight mb-1">{service.title}</h2>
                  <h3 className="text-[11px] font-bold text-[#0277ab] uppercase tracking-wider mb-2">{service.subtitle}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-serif leading-snug text-[14px]">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
