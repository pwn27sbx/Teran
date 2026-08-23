import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";

export default function Nosotros() {
  const stats = [
    { label: "Años de Experiencia", value: "21+" },
    { label: "Mascotas Atendidas", value: "50k+" },
    { label: "Sedes en Arequipa", value: "3" },
    { label: "Profesionales", value: "40+" },
  ];

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
      
      <Header variant="back" />
      
      <main className="flex-1 flex flex-col relative z-10 pt-28 pb-8 px-4 lg:px-8 justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1350px] mx-auto w-full flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch h-auto lg:h-[calc(100vh-140px)] lg:min-h-[650px] lg:max-h-[780px]"
        >
          
          {/* Column 1: Image (Bento Block 1) */}
          <div className="order-2 lg:order-none w-full lg:w-[32%] h-[300px] sm:h-[400px] lg:h-auto relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#0277ab]/10 border border-white/40 dark:border-white/10 shrink-0 group">
            <img 
              src="/staff.webp" 
              alt="MVZ Mario y Vanessa Terán Rivas" 
              className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0277ab]/90 via-[#0277ab]/20 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            
            <div className="absolute bottom-6 lg:bottom-10 left-6 lg:left-10 right-6 lg:right-10 text-white">
              <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold mb-3 border border-white/30">Directores</div>
              <h3 className="text-xl lg:text-3xl font-bold leading-tight">MVZ Mario y<br/>Vanessa Terán</h3>
            </div>
          </div>

          {/* Column 2: Content wrapper */}
          <div className="contents lg:flex lg:flex-col lg:w-[68%] gap-4 lg:gap-6 min-h-0">
            
            {/* Top Row: Title + CTA (Bento Block 2) */}
            <div className="order-1 lg:order-none bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-2xl rounded-[2.5rem] p-6 lg:p-10 border border-white/60 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-none shrink-0 flex flex-col md:flex-row gap-6 lg:gap-8 items-start lg:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[#0277ab] mb-3 lg:mb-4">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-widest">Nuestra Historia</span>
                </div>
                <h1 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-3 lg:mb-4">Quiénes Somos</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-lg font-medium leading-relaxed max-w-3xl">
                  Clínicas Veterinarias Terán nacen a través de una tradición familiar que se canaliza en una enorme vocación profesional por la medicina veterinaria generada en sus jóvenes directores.
                </p>
              </div>
              <Link 
                to="/emergencias" 
                className="shrink-0 bg-[#f4484a] text-white px-6 py-4 lg:px-8 lg:py-5 rounded-[2rem] font-bold shadow-xl shadow-red-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3 text-base lg:text-lg w-full md:w-auto"
              >
                Nuestras Sedes <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
              </Link>
            </div>

            {/* Bottom Row: Story + Stats */}
            <div className="contents lg:flex lg:flex-row gap-4 lg:gap-6 lg:flex-1 lg:min-h-0">
              
              {/* Story (Bento Block 3) */}
              <div className="order-4 lg:order-none w-full lg:w-[60%] bg-[#0277ab] rounded-[2.5rem] p-6 lg:p-10 text-white flex flex-col justify-center shadow-xl shadow-[#0277ab]/20 relative overflow-hidden">
                <div className="absolute -bottom-24 -right-24 opacity-10 rotate-12 pointer-events-none">
                  <Star className="w-[350px] h-[350px] fill-current" />
                </div>
                <div className="relative z-10 space-y-3 lg:space-y-5 text-sm lg:text-[15px] leading-relaxed text-white/95 font-medium overflow-y-auto pr-2 custom-scrollbar">
                  <p>
                    El hecho de vivir en un entorno donde las mascotas son parte importante de la vida familiar e interrelacionarse con ellas ha sido la base para consolidar uno de sus proyectos institucionales más importantes a nivel profesional, la construcción del primer HOSPITAL VETERINARIO DEL SUR DEL PERÚ.
                  </p>
                  <p>
                    Son más de 21 años donde la constante capacitación y especialización en el rubro veterinario en animales menores, se plasma en una institución reconocida por la calidad profesional de sus médicos y un equipamiento de primer nivel y avanzada tecnología.
                  </p>
                  <p>
                    En esencia la base del reconocimiento por nuestros clientes se da en que todos los que trabajamos en VETERINARIAS TERÁN tenemos la vocación profesional y de servicio a las familias que comparten y conviven con una mascota.
                  </p>
                </div>
              </div>

              {/* Stats Grid (Bento Block 4) */}
              <div className="order-3 lg:order-none w-full lg:w-[40%] grid grid-cols-2 grid-rows-2 gap-3 lg:gap-6 shrink-0 md:shrink">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 dark:border-white/10 flex flex-col items-center justify-center p-4 lg:p-6 shadow-xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-1 transition-transform cursor-default">
                    <span className="text-3xl lg:text-5xl font-black text-[#f4484a] mb-1 lg:mb-2">{stat.value}</span>
                    <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">{stat.label}</span>
                  </div>
                ))}
              </div>
              
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
