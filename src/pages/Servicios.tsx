import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, PhoneCall, Activity, HeartPulse, Stethoscope, Droplet, Zap, ChevronLeft,
  Eye, Heart, Pill, Bed, Baby, Truck, Scissors, Syringe, Flame, BookOpen, Package, Cpu, Plane,
  Sun, Moon
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

const categories = [
  { id: "todos", label: "Todos" },
  { id: "diagnostico", label: "Diagnóstico y Análisis" },
  { id: "medica", label: "Atención Médica" },
  { id: "bienestar", label: "Bienestar y Prevención" },
  { id: "especiales", label: "Servicios Especiales" },
];

const services = [
  {
    id: "rayos-x",
    category: "diagnostico",
    title: "Rayos X",
    subtitle: "Digitalizador de alta resolución",
    description: "Equipamiento de última generación para diagnósticos por imagen rápidos y precisos.",
    icon: <Zap className="w-6 h-6 text-[#0277ab]" />,
    color: "bg-blue-50/50",
    border: "border-[#0277ab]/20"
  },
  {
    id: "laboratorio",
    category: "diagnostico",
    title: "Laboratorio Veterinario",
    subtitle: "Resultados en tiempo real",
    description: "Análisis clínicos completos in situ. Tecnología avanzada para evaluar la salud de tu mascota.",
    icon: <Activity className="w-6 h-6 text-[#f4484a]" />,
    color: "bg-red-50/50",
    border: "border-[#f4484a]/20"
  },
  {
    id: "ecografia",
    category: "diagnostico",
    title: "Ecografía",
    subtitle: "Diagnóstico por imagen",
    description: "Imágenes de ultrasonido precisas para una evaluación no invasiva de los órganos internos.",
    icon: <Eye className="w-6 h-6 text-teal-600" />,
    color: "bg-teal-50/50",
    border: "border-teal-600/20"
  },
  {
    id: "ecocardiologia",
    category: "diagnostico",
    title: "Eco cardiología",
    subtitle: "Salud cardiovascular",
    description: "Evaluación detallada del corazón para detectar y tratar anomalías cardíacas a tiempo.",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    color: "bg-rose-50/50",
    border: "border-rose-500/20"
  },
  {
    id: "uci",
    category: "medica",
    title: "UCI",
    subtitle: "Cuidados Intensivos",
    description: "Unidad especializada para la monitorización y atención de pacientes en estado crítico las 24 horas.",
    icon: <HeartPulse className="w-6 h-6 text-orange-500" />,
    color: "bg-orange-50/50",
    border: "border-orange-500/20"
  },
  {
    id: "quirurgico",
    category: "medica",
    title: "Centro Quirúrgico",
    subtitle: "Quirófano equipado",
    description: "Intervenciones quirúrgicas seguras con monitoreo constante y profesionales capacitados.",
    icon: <Stethoscope className="w-6 h-6 text-emerald-600" />,
    color: "bg-emerald-50/50",
    border: "border-emerald-600/20"
  },
  {
    id: "hospitalizacion",
    category: "medica",
    title: "Hospitalización",
    subtitle: "Cuidado continuo",
    description: "Áreas confortables y seguras para la recuperación bajo supervisión médica constante.",
    icon: <Bed className="w-6 h-6 text-blue-500" />,
    color: "bg-blue-50/50",
    border: "border-blue-500/20"
  },
  {
    id: "maternidad",
    category: "medica",
    title: "Sala de maternidad",
    subtitle: "Atención neonatal",
    description: "Ambiente cálido, tranquilo y supervisado para partos y cuidado de los recién nacidos.",
    icon: <Baby className="w-6 h-6 text-pink-500" />,
    color: "bg-pink-50/50",
    border: "border-pink-500/20"
  },
  {
    id: "hidroterapia",
    category: "bienestar",
    title: "Hidroterapia",
    subtitle: "Rehabilitación física",
    description: "Terapias en agua para mejorar la movilidad, aliviar dolores articulares y acelerar la recuperación.",
    icon: <Droplet className="w-6 h-6 text-teal-600" />,
    color: "bg-teal-50/50",
    border: "border-teal-600/20"
  },
  {
    id: "estetica",
    category: "bienestar",
    title: "Estética animal",
    subtitle: "Grooming profesional",
    description: "Cortes de raza, baños medicados y cuidado del pelaje para mantenerlos hermosos y sanos.",
    icon: <Scissors className="w-6 h-6 text-fuchsia-500" />,
    color: "bg-fuchsia-50/50",
    border: "border-fuchsia-500/20"
  },
  {
    id: "vacunacion",
    category: "bienestar",
    title: "Vacunación",
    subtitle: "Prevención",
    description: "Calendarios de vacunación completos para protegerlos de las principales enfermedades.",
    icon: <Syringe className="w-6 h-6 text-yellow-600" />,
    color: "bg-yellow-50/50",
    border: "border-yellow-600/20"
  },
  {
    id: "educacion",
    category: "bienestar",
    title: "Educación",
    subtitle: "Adiestramiento",
    description: "Programas de comportamiento para mejorar la convivencia y obediencia de tu mascota.",
    icon: <BookOpen className="w-6 h-6 text-cyan-600" />,
    color: "bg-cyan-50/50",
    border: "border-cyan-600/20"
  },
  {
    id: "farmacia",
    category: "especiales",
    title: "Farmacia",
    subtitle: "Medicamentos veterinarios",
    description: "Amplio stock de medicinas y tratamientos prescritos listos para el cuidado de tu mascota.",
    icon: <Pill className="w-6 h-6 text-indigo-500" />,
    color: "bg-indigo-50/50",
    border: "border-indigo-500/20"
  },
  {
    id: "ambulancia",
    category: "especiales",
    title: "Ambulancia",
    subtitle: "Traslado seguro",
    description: "Vehículo equipado para emergencias y traslados seguros hacia nuestras instalaciones.",
    icon: <Truck className="w-6 h-6 text-red-600" />,
    color: "bg-red-50/50",
    border: "border-red-600/20"
  },
  {
    id: "crematorio",
    category: "especiales",
    title: "Crematorio",
    subtitle: "Despedida digna",
    description: "Un servicio respetuoso y cálido para acompañarte en el momento de la despedida.",
    icon: <Flame className="w-6 h-6 text-gray-500 dark:text-gray-400" />,
    color: "bg-gray-50/50",
    border: "border-gray-500/20"
  },
  {
    id: "delivery",
    category: "especiales",
    title: "Delivery",
    subtitle: "Envíos a casa",
    description: "Llevamos medicamentos, alimentos y accesorios directamente a la puerta de tu hogar.",
    icon: <Package className="w-6 h-6 text-orange-400" />,
    color: "bg-orange-50/50",
    border: "border-orange-400/20"
  },
  {
    id: "microchip",
    category: "especiales",
    title: "Microchip",
    subtitle: "Identificación",
    description: "Implantación indolora de microchip para la identificación internacional de tu mascota.",
    icon: <Cpu className="w-6 h-6 text-[#0277ab]" />,
    color: "bg-blue-50/50",
    border: "border-[#0277ab]/20"
  },
  {
    id: "viaje",
    category: "especiales",
    title: "Certificación de viaje",
    subtitle: "Al extranjero",
    description: "Gestión de certificados de salud y trámites necesarios para viajar con tu mascota.",
    icon: <Plane className="w-6 h-6 text-sky-500" />,
    color: "bg-sky-50/50",
    border: "border-sky-500/20"
  }
];

export default function Servicios() {
  const { isDark, toggleDark } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("todos");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServices = activeCategory === "todos" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] relative overflow-hidden font-['Outfit'] selection:bg-[#0277ab] selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-black text-xl tracking-tight text-[#0277ab]">
            TERAN
          </span>
        </Link>

        {/* Right Actions */}
        <div ref={menuRef} className="relative flex items-center gap-3">
          {/* Botón Dark Mode */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDark}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/40 dark:border-gray-700/40 hover:bg-white/90 hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#f4484a]/90 backdrop-blur-md text-white shadow-[0_4px_20px_rgba(244,72,74,0.4)] border border-white/20 dark:border-gray-700/20 hover:bg-[#f4484a] transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>EMERGENCIAS</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[14px] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/40 dark:border-gray-700/40 hover:bg-white/90 hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-4 h-4" />
            <span>MENÚ</span>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-2xl flex flex-col p-2 z-50 origin-top-right"
              >
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-2"
                >
                  Inicio
                </Link>
                <Link
                  to="/servicios"
                  className="px-4 py-2.5 rounded-xl bg-blue-50/50 text-[#0277ab] font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  Servicios
                </Link>
                <Link
                  to="/nosotros"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-2"
                >
                  Nosotros
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

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
