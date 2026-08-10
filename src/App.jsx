import React, { useState, useRef } from 'react';
import BrushReveal from './components/BrushReveal';
import DriftWall from './components/DriftWall';
import { Menu, Store, MapPin, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const galleryRef = useRef(null);
  
  // Tie the slide-in directly to the scroll wheel
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "center center"]
  });
  
  // Apply a spring physics layer to smooth out the scroll progress
  const smoothGalleryProgress = useSpring(galleryProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001
  });
  
  // Use the smoothed progress for the transform
  const galleryX = useTransform(smoothGalleryProgress, [0, 0.8], ["100%", "0%"]);

  // Advanced Lando-style zoom out effect:
  // Scales down drastically and gets rounded corners as the user scrolls
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.35]);
  const heroRadius = useTransform(scrollY, [0, 800], ["0px", "48px"]);
  const heroOpacity = useTransform(scrollY, [0, 800, 1200], [1, 1, 0]);

  return (
    <div className="relative bg-[#a89582] font-sans selection:bg-[#f4484a] selection:text-white">

      {/* Fixed Paw pattern background overlay (pure CSS) covering the whole page */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25.044 19.33c-.767-3.082-3.83-5.267-6.84-4.88-3.01.386-5.02 3.197-4.49 6.277.53 3.08 3.593 5.265 6.603 4.88 3.01-.387 5.494-3.197 4.727-6.277zm11.238 2.378c-.767-3.08-4.24-4.494-7.25-4.108-3.01.387-5.02 3.198-4.49 6.278.53 3.08 4.004 4.093 7.014 3.707 3.01-.387 5.493-2.798 4.726-5.877zm-3.597 12.155c-2.3-2.75-6.28-3.64-9.76-1.57-3.48 2.07-5.49 6.21-4.72 9.29.77 3.08 4.24 3.79 7.25 3.4 3.01-.38 6.78-2.61 8.32-6.59 1.53-3.98.05-5.91-1.09-4.53zm9.646-7.855c-.767-3.08-3.342-5.495-6.352-5.11-3.01.388-5.02 3.198-4.49 6.278.53 3.08 3.013 4.894 6.023 4.507 3.01-.387 5.586-2.597 4.82-5.676z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }} />

      {/* Fixed Header - stays on top of everything while scrolling */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none"
      >
        {/* Logo and Text */}
        <div className="flex items-center gap-2 text-gray-900 drop-shadow-md">
          <img src="/logoTeran.svg" alt="Logo Hospital Veterinario Terán" className="h-[74px] w-auto mt-1.5" />
          <div className="flex flex-col justify-center items-start">
            <span className="font-['Outfit'] font-black text-[56px] tracking-tighter uppercase leading-none text-gray-900 mb-0">TERAN</span>
            <span className="font-['Outfit'] font-bold text-[14px] tracking-[0.09em] uppercase text-gray-700 leading-none mt-1">Hospital Veterinario</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="flex items-center gap-2 font-['Outfit'] font-bold text-[14px] text-white bg-[#f4484a] px-6 py-3.5 rounded-2xl shadow-md shadow-[#f4484a]/30 cursor-pointer hover:bg-[#db4042] hover:scale-105 active:scale-95 transition-all duration-300">
            <span>EMERGENCIAS 24 HORAS</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 font-['Outfit'] font-semibold text-[15px] text-gray-800 bg-white/60 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-gray-200/50 shadow-sm cursor-pointer hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300">
              <Menu className="w-5 h-5 text-gray-700" />
              <span>MENÚ</span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-3 w-56 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-2xl overflow-hidden flex flex-col py-2 z-50 origin-top-right"
                >
                  <a href="#" className="px-6 py-3 hover:bg-teal-50 hover:text-teal-700 font-['Outfit'] font-medium text-gray-800 transition-colors">Inicio</a>
                  <a href="#" className="px-6 py-3 hover:bg-teal-50 hover:text-teal-700 font-['Outfit'] font-medium text-gray-800 transition-colors">Servicios</a>
                  <a href="#" className="px-6 py-3 hover:bg-teal-50 hover:text-teal-700 font-['Outfit'] font-medium text-gray-800 transition-colors">Nosotros</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (Sticky wrapper for Lando Zoom Out effect)     */}
      {/* ============================================================== */}
      <div className="h-[200vh] w-full relative z-10">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.div
            style={{ scale: heroScale, borderRadius: heroRadius, opacity: heroOpacity }}
            className="w-full h-full relative origin-center bg-white shadow-2xl overflow-hidden pointer-events-auto"
          >
            <BrushReveal
              bgImage="/milo1.png"
              revealImage="/atreus1.png"
              brushSize={150}
              revealScale={0.83}
              revealOffsetY={-0.18}
            />
            {/* Bottom Fade Gradient for grounding inside the hero */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SECOND SECTION: ¿Por qué elegirnos?                         */}
      {/* ============================================================== */}
      {/* Pulled up with negative margin to seamlessly follow the shrinking hero */}
      <div className="relative z-20 text-[#fdfbf7] flex flex-col items-center justify-center pb-32 px-6 md:px-12 -mt-[25vh]">

        {/* Text Area */}
        <div className="max-w-4xl text-center mb-24 relative z-10">
          <h2 className="font-['Outfit'] font-black text-5xl md:text-6xl text-white mb-8 tracking-tight drop-shadow-md">¿Por qué elegirnos?</h2>
          <p className="font-serif text-lg md:text-2xl leading-relaxed text-white/90 font-light drop-shadow-sm">
            Veterinarias Terán es sinónimo de profesionalismo y pasión por la medicina veterinaria, son 24 años de salvaguardar el bienestar de las mascotas del Perú, 24 años en los cuales hemos sido precursores en incluir tecnología médica de punta haciendo hincapié en la capacitación constante de nuestro staff, tanto nacional como internacionalmente, cada día es un reto para mejorar la sociedad, para salvar una vida pero sobre todo cambiar nuestro país.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">

          {/* Column 1: Tienda Virtual */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 transition-transform hover:scale-110 duration-300">
              <Store className="w-14 h-14 text-gray-800" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">Tienda Virtual</h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              El más exclusivo Pet Shop con los mejores productos en alimentos, juguetes, casas, camas, ropa, venta de mascotas y mucho más...
            </p>
          </div>

          {/* Column 2: Nuestras sedes */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 transition-transform hover:scale-110 duration-300">
              <MapPin className="w-14 h-14 text-[#f4484a]" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">Nuestras sedes</h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              Cada vez más cerca de ti, encuentra una veterinaria Terán cerca a tu casa.
            </p>
          </div>

          {/* Column 3: Terán TV */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 p-4 transition-transform hover:scale-110 duration-300">
              <img src="/logoTeran.svg" alt="Terán TV Logo" className="w-full h-auto drop-shadow-sm" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">Terán TV</h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              Bienvenidos a TERÁN TV, nuestro archivo videográfico con nuestros casos veterinarios, testimonios, proyectos especiales y mucho más.
            </p>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THIRD SECTION: Galería DriftWall                            */}
      {/* ============================================================== */}
      <div ref={galleryRef} className="w-full overflow-hidden">
        <motion.div 
          style={{ x: galleryX }}
          className="relative z-30 w-full bg-[#a89582] h-screen min-h-[700px] flex items-center overflow-hidden px-6 md:px-12 shadow-[20px_0_50px_rgba(0,0,0,0.3)]"
        >
        
        {/* Left Side: Text */}
        <div className="relative z-10 w-full md:w-[35%] flex flex-col items-start pl-4 md:pl-12">
          <h2 className="font-['Outfit'] font-black text-6xl md:text-7xl lg:text-8xl text-white tracking-tight drop-shadow-lg leading-[0.9]">
            Nuestra<br />Galería
          </h2>
          <div className="w-20 h-2 bg-[#f4484a] rounded-full mt-6 mb-6"></div>
          <p className="font-serif text-lg md:text-xl leading-relaxed text-white/90 font-light drop-shadow-sm">
            Un vistazo a la excelencia de nuestras instalaciones y los pacientes felices que confían en nosotros día a día.
          </p>
        </div>
        
        {/* Right Side: DriftWall seamlessly fading into the background */}
        <div className="absolute right-[-5vw] top-0 w-[120%] md:w-[75%] h-full z-0 pointer-events-auto">
          <DriftWall
            columns={5}
            tileWidth={220}
            tileHeight={145}
            gap={20}
            tilt={15}
            turn={-15}
            perspective={1200}
            depth={120}
            speed={35}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.4}
            overlayColor="#a89582" /* Blends perfectly with bg */
            radius={20}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
        </motion.div>
      </div>

    </div>
  );
}

export default App;
