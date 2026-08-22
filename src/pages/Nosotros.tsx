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
      
      <main className="flex-1 flex flex-col relative z-10 pt-28 pb-8 px-6 justify-center">
        <div className="max-w-6xl mx-auto w-full">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-[#0277ab] mb-4 tracking-tight">
              Quiénes Somos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-4xl mx-auto font-serif">
              Clínicas Veterinarias Terán nacen a través de una tradición familiar que se canaliza en una enorme vocación profesional por la medicina veterinaria generada en sus jóvenes directores los MVZ Mario y Vanessa Terán Rivas.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-center hover:scale-105 transition-transform duration-300 shadow-xl shadow-gray-200/50 dark:shadow-none">
                <h3 className="text-3xl md:text-4xl font-black text-[#f4484a] mb-1">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium text-[10px] md:text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Tradición Familiar</h2>
              <div className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed space-y-3">
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[260px] md:h-[300px] rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="/staff.webp" 
                alt="MVZ Mario y Vanessa Terán Rivas" 
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-['Outfit'] font-bold tracking-widest text-[10px] md:text-xs mb-1 text-blue-300 uppercase">Vocación y Servicio</p>
                <h3 className="text-lg md:text-xl font-bold">MVZ Mario y Vanessa Terán</h3>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-auto"
          >
            <Link 
              to="/emergencias" 
              className="inline-flex items-center gap-2 bg-[#f4484a] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-red-500/20 hover:scale-105 transition-all text-lg"
            >
              Conoce nuestras sedes
            </Link>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}
