import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Award, Quote } from "lucide-react";
import Stack from "@/components/Stack";
import { testimonials, type Testimonial } from "@/data/testimonialsData";

export default function Certificacion() {

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f3f4f6] dark:bg-[#0a0a0a] font-sans selection:bg-[#0277ab] selection:text-white flex flex-col relative">
      {/* Background ambient glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-blue-400/20 dark:bg-blue-600/10 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0"></div>

      <Header variant="back" />
      
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-6 pt-28 md:pt-32 pb-16 md:pb-12 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 min-h-0 relative z-10">
        
        {/* Left Column: Testimonials 1 & 2 (Shifted Up) */}
        <div className="hidden lg:flex w-1/3 flex-col gap-6 h-full justify-center pb-16">
          {[testimonials[0], testimonials[1]].map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} direction={-1} />
          ))}
        </div>

        {/* Center Column: The Accreditation Altar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/3 flex flex-col items-center justify-center text-center h-full relative"
        >
          {/* Custom style for hardware accelerated floating and marquee */}
          <style>{`
            @keyframes float-badge {
              0%, 100% { transform: translateY(-12px); }
              50% { transform: translateY(12px); }
            }
            .animate-float-badge {
              animation: float-badge 6s ease-in-out infinite;
              will-change: transform;
            }
          `}</style>
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-[#0277ab] dark:text-sky-400 font-bold text-xs tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            Excelencia Médica
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
            Certificación <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0277ab] to-blue-400">
              Oficial
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-serif leading-relaxed max-w-sm mx-auto mb-10">
            Avalados por el Colegio Médico Veterinario de Arequipa. Conoce la vocación que impulsa a nuestros especialistas cada día.
          </p>

          {/* Badge with floating animation */}
          <div className="relative mb-6 lg:mb-0 group animate-float-badge">
            <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/40 transition-colors duration-500"></div>
            <img 
              src="/acreditacion.webp" 
              alt="Certificación Colegio Médico Veterinario" 
              className="w-56 md:w-72 h-auto relative z-10 drop-shadow-2xl"
              style={{ willChange: "transform" }}
            />
          </div>
        </motion.div>

        {/* Right Column: Testimonials 3 & 4 (Shifted Down) */}
        <div className="hidden lg:flex w-1/3 flex-col gap-6 h-full justify-center pt-16">
          {[testimonials[2], testimonials[3]].map((t, i) => (
            <TestimonialCard key={i+2} testimonial={t} index={i+2} direction={1} />
          ))}
        </div>

        {/* Mobile View: Stacked Cards Carousel using ReactBits Stack */}
        <div className="flex lg:hidden w-full pb-8 pt-4 justify-center items-center h-[400px]">
          <div className="w-[85vw] max-w-[340px] h-[340px]">
            <Stack
              randomRotation={false}
              sensitivity={100}
              sendToBackOnClick={false}
              autoplay={true}
              autoplayDelay={4000}
              pauseOnHover={true}
              mobileClickOnly={false}
              cards={testimonials.map((testimonial, i) => (
                <div key={i} className="w-full h-full bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-xl border border-white/50 dark:border-gray-800 flex flex-col relative overflow-hidden pointer-events-none">
                  <div className="absolute top-4 right-4 text-[#0277ab]/10 dark:text-blue-400/10 pointer-events-none">
                    <Quote size={60} className="transform rotate-180" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm shrink-0">
                        <img loading="lazy" src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">{testimonial.name}</h3>
                        <p className="text-[#0277ab] font-bold text-[9px] tracking-widest uppercase mt-0.5">Médico Veterinario</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-hidden pr-1 mt-1 flex flex-col justify-center">
                      <p className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed text-[16px] italic line-clamp-6">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            />
          </div>
        </div>

      </main>
    </div>
  );
}

// Subcomponent for the cards to keep code clean
function TestimonialCard({ testimonial, index, direction }: { testimonial: Testimonial, index: number, direction: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction * 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-gray-800 flex flex-col relative group hover:-translate-y-1 transition-transform duration-300 h-full min-h-[350px] lg:h-[320px] lg:min-h-0"
    >
      <div className="absolute top-6 right-6 text-[#0277ab]/10 dark:text-blue-400/10 group-hover:scale-110 group-hover:text-[#0277ab]/20 transition-all duration-300">
        <Quote size={80} className="transform rotate-180" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-md shrink-0">
            <img loading="lazy" src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">{testimonial.name}</h3>
            <p className="text-[#0277ab] font-bold text-[10px] tracking-widest uppercase mt-0.5">Médico Veterinario</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mt-2 flex flex-col justify-center">
          <p className="text-gray-700 dark:text-gray-300 font-serif leading-relaxed text-[15px] italic">
            "{testimonial.text}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
