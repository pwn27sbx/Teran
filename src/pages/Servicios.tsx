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
    <div className="min-h-screen lg:h-[100dvh] bg-[#f8f9fa] dark:bg-[#121212] relative overflow-x-hidden lg:overflow-hidden font-['Outfit'] selection:bg-[#0277ab] selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <Header variant="back" />

      {/* Main Content */}
      <main className="pt-24 lg:pt-[85px] pb-8 lg:pb-4 px-6 lg:px-8 relative z-10 max-w-[1600px] mx-auto min-h-screen lg:min-h-0 lg:h-full flex flex-col justify-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-4 shrink-0"
        >
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 text-[#0277ab] font-bold text-[10px] tracking-widest uppercase mb-2 lg:mb-3 shadow-sm">
              <Stethoscope className="w-3 h-3" />
              Especialidades
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2">
              Nuestros <span className="text-[#0277ab]">Servicios</span>
            </h1>
            <p className="text-[15px] lg:text-base text-gray-500 dark:text-gray-400 font-serif">
              Más de 21 años mejorando la salud de tu mascota con la mejor tecnología.
            </p>
          </div>

          {/* Categories Tabs (Moved to right on desktop) */}
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? "bg-[#0277ab] text-white shadow-md scale-105" 
                    : "bg-white/50 text-gray-500 hover:bg-white dark:bg-gray-900 border border-gray-200/50 hover:text-[#0277ab]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Services Grid - 4 Columns */}
        <div className="w-full flex-1 lg:min-h-0 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-3 w-full"
            >
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`p-4 lg:p-3 xl:p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border ${service.border} shadow-sm hover:shadow-lg transition-all cursor-pointer group flex items-start gap-3 lg:gap-4`}
                >
                  <div className={`w-10 h-10 xl:w-11 xl:h-11 rounded-[0.8rem] shrink-0 ${service.color} flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 mt-0.5`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[15px] lg:text-[14px] xl:text-[16px] font-bold text-gray-800 dark:text-gray-100 leading-tight mb-1 truncate">{service.title}</h2>
                    <h3 className="text-[9px] xl:text-[10px] font-bold text-[#0277ab] uppercase tracking-wider mb-1 lg:mb-1.5">{service.subtitle}</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-serif leading-snug text-[12px] lg:text-[11px] xl:text-[12px] line-clamp-3 lg:line-clamp-2 xl:line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}
