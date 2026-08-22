import { motion } from "framer-motion";
import Header from "../components/Header";
import { Award, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dra. Jenny",
    text: "La pasión y sensibilidad de esta carrera son extraordinarias para mí, me siento muy feliz de poder aportar con mis conocimientos a la mejoría de muchos pacientes que veo diariamente con uno u otro problema de salud, es realmente satisfactorio poder ayudar a seres tan especiales.",
    image: "http://hospitalveterinarioteran.com/wp-content/uploads/2017/12/jenny-testimonio.jpg"
  },
  {
    name: "Dr. Jorge",
    text: "La veterinaria es una ciencia de mucho estudio y aprendizaje constantes, el poder llevar esos conocimientos a mis alumnos y guiar su camino me genera una satisfacción de saber que algún día serán ellos los que salven la vida de estos seres nobles a quienes respeto y quiero.",
    image: "http://hospitalveterinarioteran.com/wp-content/uploads/2017/12/jorge-testimonio.jpg"
  },
  {
    name: "Dra. Juana",
    text: "Cualquier persona puede amar a su mascota pero, ante una enfermedad, la única persona verdaderamente capacitada para curarla será el Médico Veterinario. Es por ello mi compromiso de ser mejor cada día.",
    image: "http://hospitalveterinarioteran.com/wp-content/uploads/2017/12/juana-testimonio.jpg"
  },
  {
    name: "Dra. Gabriela",
    text: "Ejerzo mi profesión en el día a día tratando y cuidando de estas maravillosas vidas y procurando siempre dar la mejor calidad de atención para mejorar sus vidas y condiciones.",
    image: "http://hospitalveterinarioteran.com/wp-content/uploads/2017/12/gabriela-testimonio.jpg"
  }
];

export default function Certificacion() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#f8f9fa] dark:bg-[#121212] font-sans selection:bg-[#0277ab] selection:text-white flex flex-col">
      <Header variant="back" />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-28 pb-8 flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-0">
        
        {/* Left Side: Header & Certificate (1/3 width) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/3 flex flex-col justify-center h-full"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-[#0277ab] font-bold text-sm tracking-widest uppercase w-fit mb-6 shadow-sm">
            <Award className="w-4 h-4" />
            Acreditación
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            Certificación <br className="hidden lg:block" />
            <span className="text-[#0277ab]">Oficial</span>
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 font-serif leading-relaxed mb-8">
            Certificada por el Colegio Médico Veterinario de Arequipa. Lo que dicen nuestros médicos sobre su labor diaria.
          </p>
          
          <div className="flex-1 flex items-center justify-start max-h-[250px] lg:max-h-[300px]">
            <img 
              src="http://hospitalveterinarioteran.com/wp-content/uploads/2017/11/acreditacion1.png" 
              alt="Certificación Colegio Médico Veterinario" 
              className="max-h-full w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </motion.div>

        {/* Right Side: 2x2 Testimonials Grid (2/3 width) */}
        <div className="w-full lg:w-2/3 h-full flex-1 min-h-0">
          {/* Use a custom scrollbar just in case the screen is too short, but usually it fits */}
          <div className="h-full w-full overflow-y-auto overflow-x-hidden custom-scrollbar pr-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative group flex flex-col"
                >
                  <div className="absolute top-6 right-6 text-blue-50 dark:text-blue-900/10">
                    <Quote size={48} className="transform rotate-180" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-50 dark:border-gray-800 shadow-sm shrink-0">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-none mb-1">{t.name}</h3>
                        <p className="text-[#0277ab] font-bold text-xs tracking-wider uppercase">Médico Veterinario</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-serif leading-relaxed text-[15px] italic flex-1 overflow-y-auto custom-scrollbar">
                      "{t.text}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
