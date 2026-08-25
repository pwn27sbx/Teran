import { Link } from "react-router-dom";
import { ArrowLeft, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import LocationCard from "@/components/LocationCard";

export default function Emergencias() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#f5f5f7] dark:bg-black flex flex-col items-center justify-start md:justify-center pt-24 pb-12 p-4 md:p-8 relative overflow-x-hidden transition-colors duration-700 font-['Outfit']">
      
      {/* Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[800px] max-h-[800px] bg-red-600/5 dark:bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Absolute Minimalist Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 md:top-8 md:left-10 z-20"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
      </motion.div>

      <div className="w-full max-w-5xl z-10 flex flex-col items-center text-center h-full justify-start md:justify-center gap-8 mt-4 md:mt-0">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 dark:bg-red-500"></span>
            </span>
            Unidad de Trauma Activa
          </div>

          <h1 className="text-5xl md:text-[5.5rem] lg:text-[6.5rem] leading-[0.9] font-black text-gray-900 dark:text-white tracking-tighter mb-4">
            Emergencias<span className="text-red-600">.</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl font-medium tracking-tight leading-snug">
            Atención veterinaria inmediata las 24 horas. Nuestro equipo de cuidados intensivos está preparado para recibirte.
          </p>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row gap-2 sm:gap-4 w-full max-w-2xl my-6"
        >
          <a 
            href="tel:+5154274343" 
            className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center gap-1.5 sm:gap-2 shadow-[0_15px_30px_-10px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 opacity-90" />
            <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wider sm:tracking-widest uppercase opacity-70 text-center">Central Telefónica</span>
            <span className="text-[15px] sm:text-2xl md:text-3xl font-black tracking-tight">(054) 274343</span>
          </a>
          
          <a 
            href="https://wa.me/51959390711?text=Hola,%20tengo%20una%20emergencia%20veterinaria." 
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#222] text-gray-900 dark:text-white rounded-[1.5rem] p-3 sm:p-5 md:p-6 flex flex-col items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-95 group"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-7 sm:h-7 text-[#25D366] group-hover:scale-110 transition-transform">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-gray-400 text-center">WhatsApp de Emergencia</span>
            <span className="text-[15px] sm:text-2xl md:text-3xl font-black tracking-tight">959 390 711</span>
          </a>
        </motion.div>

        {/* Locations Grid - Compact Apple Store Card Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-left"
        >
          <LocationCard
            title="Paucarpata"
            address="Av. Pizarro C8"
            phones={["(054) 332600"]}
            mapUrl="https://maps.app.goo.gl/cDu13hWDqMQ8dVFK7"
            embedUrl="https://maps.google.com/maps?q=Av.+Pizarro+C8,+Paucarpata,+Arequipa&output=embed"
            is24Hours={true}
            themeColor="red"
          />
          <LocationCard
            title="Yanahuara"
            address="Los Cedros F-2"
            phones={["(054) 274343", "(054) 255587"]}
            mapUrl="https://maps.app.goo.gl/BppbhbcL43Jw75GM8"
            embedUrl="https://maps.google.com/maps?q=Veterinarias+Teran,+Yanahuara,+Arequipa&output=embed"
            themeColor="blue"
          />
          <LocationCard
            title="Terán Express"
            address="Bustamante y Rivero, Perú 304"
            phones={["(054) 429893"]}
            mapUrl="https://maps.app.goo.gl/FHVmby9iddVw4kL88"
            embedUrl="https://maps.google.com/maps?q=Peru+304,+Bustamante+y+Rivero,+Arequipa&output=embed"
            themeColor="amber"
          />
        </motion.div>
      </div>
    </div>
  );
}
