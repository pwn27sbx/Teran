import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] font-sans selection:bg-[#0277ab] selection:text-white">
      <Header variant="back" />
      
      <main className="pt-32 pb-24 px-6 relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 text-[#0277ab] font-bold text-sm tracking-widest uppercase mb-6 shadow-sm">
            <Award className="w-4 h-4" />
            Acreditación
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Certificación <span className="text-[#0277ab]">Oficial</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-serif leading-relaxed mb-10">
            Certificada por el Colegio Médico Veterinario de Arequipa.
          </p>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <img 
              src="http://hospitalveterinarioteran.com/wp-content/uploads/2017/11/acreditacion1.png" 
              alt="Certificación Colegio Médico Veterinario" 
              className="max-w-[200px] md:max-w-[250px] drop-shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        </motion.div>

        {/* Testimonials Section */}
        <div className="mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
              Lo que dicen nuestros <span className="text-[#f4484a]">médicos</span>
            </h2>
            <div className="w-16 h-1.5 bg-[#f4484a] mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 relative group"
              >
                <div className="absolute top-8 right-8 text-blue-100 dark:text-blue-900/30">
                  <Quote size={64} className="transform rotate-180" />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-50 dark:border-gray-800 shadow-md">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">{t.name}</h3>
                      <p className="text-[#0277ab] font-bold text-sm tracking-wider uppercase">Médico Veterinario</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-serif leading-relaxed text-lg italic flex-1">
                    "{t.text}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
