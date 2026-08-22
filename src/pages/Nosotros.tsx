import React from "react";
import { ArrowLeft } from "lucide-react";
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
      
      <main className="flex-1 flex flex-col relative z-10 pt-24 pb-8 px-6 lg:px-12 justify-center">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Portrait Image (Apple Style) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[380px] shrink-0 relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
          >
            <div className="aspect-[3/4] w-full">
              <img 
                src="/staff.webp" 
                alt="MVZ Mario y Vanessa Terán Rivas" 
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-2">Directores</p>
                <h3 className="text-xl font-medium tracking-tight text-white/95">MVZ Mario y Vanessa Terán</h3>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-center"
          >
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tighter text-gray-900 dark:text-white mb-6 leading-[1.1]">
              Vocación de familia. <br/>
              <span className="text-gray-400 dark:text-gray-500">Innovación en salud.</span>
            </h1>

            <p className="text-lg lg:text-xl font-serif text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Clínicas Veterinarias Terán nacen a través de una tradición familiar que se canaliza en una enorme vocación profesional por la medicina veterinaria generada en sus jóvenes directores.
            </p>

            {/* Editorial Columns */}
            <div className="md:columns-2 gap-10 text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mb-12 max-w-3xl">
              <p className="mb-4 break-inside-avoid">
                El hecho de vivir en un entorno donde las mascotas son parte importante de la vida familiar e interrelacionarse con ellas ha sido la base para consolidar uno de sus proyectos institucionales más importantes a nivel profesional, la construcción del primer HOSPITAL VETERINARIO DEL SUR DEL PERÚ.
              </p>
              <p className="mb-4 break-inside-avoid">
                Son más de 21 años donde la constante capacitación y especialización en el rubro veterinario en animales menores, se plasma en una institución reconocida por la calidad profesional de sus médicos y un equipamiento de primer nivel y avanzada tecnología.
              </p>
              <p className="break-inside-avoid">
                En esencia la base del reconocimiento por nuestros clientes se da en que todos los que trabajamos en VETERINARIAS TERÁN tenemos la vocación profesional y de servicio a las familias que comparten y conviven con una mascota.
              </p>
            </div>

            {/* Stats & Action - Minimalist */}
            <div className="flex flex-wrap items-center gap-8 lg:gap-12 pt-8 border-t border-gray-200 dark:border-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-3xl font-semibold tracking-tighter text-gray-900 dark:text-white mb-1">{stat.value}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</span>
                </div>
              ))}
              
              <div className="ml-auto mt-4 md:mt-0">
                <Link 
                  to="/emergencias" 
                  className="group flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
                >
                  Conoce nuestras sedes
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </div>
                </Link>
              </div>
            </div>
            
          </motion.div>
        </div>
      </main>
    </div>
  );
}
