
export const categories = [
  { id: "todos", label: "Todos" },
  { id: "diagnostico", label: "Diagnóstico y Análisis" },
  { id: "medica", label: "Atención Médica" },
  { id: "bienestar", label: "Bienestar y Prevención" },
  { id: "especiales", label: "Servicios Especiales" },
];

export const services = [
  {
    id: "rayos-x",
    category: "diagnostico",
    title: "Rayos X",
    subtitle: "Digitalizador de alta resolución",
    description: "Equipamiento de última generación para diagnósticos por imagen rápidos y precisos.",
    iconName: "Zap",
    color: "bg-blue-50/50",
    border: "border-[#0277ab]/20"
  },
  {
    id: "laboratorio",
    category: "diagnostico",
    title: "Laboratorio Veterinario",
    subtitle: "Resultados en tiempo real",
    description: "Análisis clínicos completos in situ. Tecnología avanzada para evaluar la salud de tu mascota.",
    iconName: "Activity",
    color: "bg-red-50/50",
    border: "border-[#f4484a]/20"
  },
  {
    id: "ecografia",
    category: "diagnostico",
    title: "Ecografía",
    subtitle: "Diagnóstico por imagen",
    description: "Imágenes de ultrasonido precisas para una evaluación no invasiva de los órganos internos.",
    iconName: "Eye",
    color: "bg-teal-50/50",
    border: "border-teal-600/20"
  },
  {
    id: "ecocardiologia",
    category: "diagnostico",
    title: "Eco cardiología",
    subtitle: "Salud cardiovascular",
    description: "Evaluación detallada del corazón para detectar y tratar anomalías cardíacas a tiempo.",
    iconName: "Heart",
    color: "bg-rose-50/50",
    border: "border-rose-500/20"
  },
  {
    id: "uci",
    category: "medica",
    title: "UCI",
    subtitle: "Cuidados Intensivos",
    description: "Unidad especializada para la monitorización y atención de pacientes en estado crítico las 24 horas.",
    iconName: "HeartPulse",
    color: "bg-orange-50/50",
    border: "border-orange-500/20"
  },
  {
    id: "quirurgico",
    category: "medica",
    title: "Centro Quirúrgico",
    subtitle: "Quirófano equipado",
    description: "Intervenciones quirúrgicas seguras con monitoreo constante y profesionales capacitados.",
    iconName: "Stethoscope",
    color: "bg-emerald-50/50",
    border: "border-emerald-600/20"
  },
  {
    id: "hospitalizacion",
    category: "medica",
    title: "Hospitalización",
    subtitle: "Cuidado continuo",
    description: "Áreas confortables y seguras para la recuperación bajo supervisión médica constante.",
    iconName: "Bed",
    color: "bg-blue-50/50",
    border: "border-blue-500/20"
  },
  {
    id: "maternidad",
    category: "medica",
    title: "Sala de maternidad",
    subtitle: "Atención neonatal",
    description: "Ambiente cálido, tranquilo y supervisado para partos y cuidado de los recién nacidos.",
    iconName: "Baby",
    color: "bg-pink-50/50",
    border: "border-pink-500/20"
  },
  {
    id: "hidroterapia",
    category: "bienestar",
    title: "Hidroterapia",
    subtitle: "Rehabilitación física",
    description: "Terapias en agua para mejorar la movilidad, aliviar dolores articulares y acelerar la recuperación.",
    iconName: "Droplet",
    color: "bg-teal-50/50",
    border: "border-teal-600/20"
  },
  {
    id: "estetica",
    category: "bienestar",
    title: "Estética animal",
    subtitle: "Grooming profesional",
    description: "Cortes de raza, baños medicados y cuidado del pelaje para mantenerlos hermosos y sanos.",
    iconName: "Scissors",
    color: "bg-fuchsia-50/50",
    border: "border-fuchsia-500/20"
  },
  {
    id: "vacunacion",
    category: "bienestar",
    title: "Vacunación",
    subtitle: "Prevención",
    description: "Calendarios de vacunación completos para protegerlos de las principales enfermedades.",
    iconName: "Syringe",
    color: "bg-yellow-50/50",
    border: "border-yellow-600/20"
  },
  {
    id: "educacion",
    category: "bienestar",
    title: "Educación",
    subtitle: "Adiestramiento",
    description: "Programas de comportamiento para mejorar la convivencia y obediencia de tu mascota.",
    iconName: "BookOpen",
    color: "bg-cyan-50/50",
    border: "border-cyan-600/20"
  },
  {
    id: "farmacia",
    category: "especiales",
    title: "Farmacia",
    subtitle: "Medicamentos veterinarios",
    description: "Amplio stock de medicinas y tratamientos prescritos listos para el cuidado de tu mascota.",
    iconName: "Pill",
    color: "bg-indigo-50/50",
    border: "border-indigo-500/20"
  },
  {
    id: "ambulancia",
    category: "especiales",
    title: "Ambulancia",
    subtitle: "Traslado seguro",
    description: "Vehículo equipado para emergencias y traslados seguros hacia nuestras instalaciones.",
    iconName: "Truck",
    color: "bg-red-50/50",
    border: "border-red-600/20"
  },
  {
    id: "crematorio",
    category: "especiales",
    title: "Crematorio",
    subtitle: "Despedida digna",
    description: "Un servicio respetuoso y cálido para acompañarte en el momento de la despedida.",
    iconName: "Flame",
    color: "bg-gray-50/50",
    border: "border-gray-500/20"
  },
  {
    id: "delivery",
    category: "especiales",
    title: "Delivery",
    subtitle: "Envíos a casa",
    description: "Llevamos medicamentos, alimentos y accesorios directamente a la puerta de tu hogar.",
    iconName: "Package",
    color: "bg-orange-50/50",
    border: "border-orange-400/20"
  },
  {
    id: "microchip",
    category: "especiales",
    title: "Microchip",
    subtitle: "Identificación",
    description: "Implantación indolora de microchip para la identificación internacional de tu mascota.",
    iconName: "Cpu",
    color: "bg-blue-50/50",
    border: "border-[#0277ab]/20"
  },
  {
    id: "viaje",
    category: "especiales",
    title: "Certificación de viaje",
    subtitle: "Al extranjero",
    description: "Gestión de certificados de salud y trámites necesarios para viajar con tu mascota.",
    iconName: "Plane",
    color: "bg-sky-50/50",
    border: "border-sky-500/20"
  }
];
