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
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none">
        <Link to="/" className="flex items-center gap-3 group pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-black text-xl tracking-tight text-[#0277ab]">
            TERAN
          </span>
        </Link>

        {/* Right Actions: Glass Dock */}
        <div ref={menuRef} className="group relative flex items-center p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto">
          
          {/* Animated Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <motion.rect
              width="100%"
              height="100%"
              rx="26"
              fill="none"
              stroke="#f4484a"
              strokeWidth="2"
              pathLength="100"
              strokeDasharray="15 85"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            />
          </svg>

          {/* Botón Emergencias */}
          <Link
            to="/emergencias"
            className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-[#f4484a] hover:bg-[#d63d3f] text-white rounded-full font-['Outfit'] font-bold text-[12px] md:text-[13px] tracking-widest shadow-[0_4px_15px_rgba(244,72,74,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">EMERGENCIAS 24H</span>
            <span className="sm:hidden">24H</span>
          </Link>

          {/* Botón Menú */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-10 flex items-center justify-center w-10 h-10 ml-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col p-2 z-50 origin-top-right"
              >
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3"
                >
                  Inicio
                </Link>
                <Link
                  to="/servicios"
                  className="px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 font-['Outfit'] font-medium text-[#0277ab] dark:text-sky-400 flex items-center gap-3"
                >
                  Servicios
                </Link>
                <Link
                  to="/nosotros"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3"
                >
                  Nosotros
                </Link>

                <div className="h-px bg-gray-200 dark:bg-gray-700/50 my-1 mx-2" />
                
                <button
                  onClick={() => {
                    toggleDark();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3 w-full text-left"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Modo Claro" : "Modo Oscuro"}
                </button>
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
