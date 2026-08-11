import React, { useState, useRef } from 'react';
import BrushReveal from './components/BrushReveal';
import DriftWall from './components/DriftWall';
import LogoLoop from './components/LogoLoop';
import { Menu, Store, MapPin, Activity, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

const baseGalleryItems = Array.from({ length: 27 }, (_, i) => ({
  image: `/gallery/${i + 1}.webp`,
  title: `Galería ${i + 1}`
}));

// Rellenamos hasta 30 para que las 5 columnas tengan exactamente 6 imágenes cada una y no haya descuadres
const galleryItems = [
  ...baseGalleryItems,
  baseGalleryItems[0],
  baseGalleryItems[1],
  baseGalleryItems[2],
];

const brandLogos = [
  { src: "/logos/pfizer.svg", alt: "Pfizer", title: "Pfizer" },
  { src: "/logos/nexgard.svg", alt: "NexGard", title: "NexGard" },
  { src: "/logos/hills2.svg", alt: "Hill's", title: "Hill's" },
  { src: "/logos/purina.svg", alt: "Purina", title: "Purina" },
  { src: "/logos/equilibrio.svg", alt: "Equilibrio", title: "Equilibrio" },
  { src: "/logos/hartz-full.svg", alt: "Hartz", title: "Hartz" },
  { src: "/logos/virbac.svg", alt: "Virbac", title: "Virbac" }
];

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
    <div className="relative bg-[#0277ab] font-sans selection:bg-[#f4484a] selection:text-white">

      {/* Fixed Paw pattern background overlay (pure CSS) covering the whole page */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.4 9.6a6.4 6.4 0 0 0-3.2-5.6 5.7 5.7 0 0 0-5.8.5A11 11 0 0 0 12 6a11 11 0 0 0-1.4-1.5 5.7 5.7 0 0 0-5.8-.5 6.4 6.4 0 0 0-3.2 5.6c0 1.2.6 2.4 1.7 3.3a12.8 12.8 0 0 0 4.3 2.1c.9.2 1.7.5 2.5 1 .7.4 1.4.9 1.9 1.5.5-.6 1.2-1.1 1.9-1.5.8-.4 1.6-.7 2.5-1a12.8 12.8 0 0 0 4.3-2.1c1.1-.9 1.7-2.1 1.7-3.3zM12 24c-5 0-9.8-3.4-11.4-8.3-.3-.9-.1-1.9.5-2.6s1.5-1.2 2.5-1.2c.4 0 .9.1 1.3.2 2.4.9 4.3 2.4 5.9 4.4 1.5-2 3.4-3.5 5.9-4.4.4-.1.9-.2 1.3-.2 1 0 1.9.5 2.5 1.2.6.7.8 1.7.5 2.6C21.8 20.6 17 24 12 24z' fill='%23ffffff'/%3E%3C/svg%3E")`,
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
          className="relative z-30 w-full bg-[#0277ab] h-screen min-h-[700px] flex items-center overflow-hidden px-6 md:px-12 shadow-[20px_0_50px_rgba(0,0,0,0.3)]"
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
            items={galleryItems}
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
            fade={0.2}
            dim={0.9}
            overlayColor="#0277ab" /* Blends perfectly with bg */
            radius={20}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
        </motion.div>
      </div>

      {/* ============================================================== */}
      {/* 4. FOURTH SECTION: Newsletter & Footer                           */}
      {/* ============================================================== */}
      <footer className="relative z-20 flex flex-col items-center pt-32 w-full">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center px-6">
          <h2 className="font-['Outfit'] font-black text-5xl md:text-6xl text-white mb-4 drop-shadow-md">Boletín Terrancito</h2>
          <p className="font-serif text-white/90 text-lg md:text-xl mb-12 drop-shadow-sm">Suscríbete y recibe nuestras ofertas y novedades</p>
          
          <form className="w-full flex flex-col gap-5 max-w-md">
            <input 
              type="text" 
              placeholder="Nombre y Apellidos*" 
              className="w-full px-6 py-4 rounded-2xl bg-white/95 backdrop-blur-md border-none shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-gray-800 placeholder:text-gray-400 font-['Outfit'] font-medium focus:ring-4 focus:ring-[#f4484a]/40 outline-none transition-all"
            />
            <input 
              type="email" 
              placeholder="tucorreo@email.com*" 
              className="w-full px-6 py-4 rounded-2xl bg-white/95 backdrop-blur-md border-none shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-gray-800 placeholder:text-gray-400 font-['Outfit'] font-medium focus:ring-4 focus:ring-[#f4484a]/40 outline-none transition-all"
            />
            <button 
              type="button" 
              className="mt-4 w-full md:w-auto self-center bg-[#f4484a] text-white font-['Outfit'] font-bold text-lg px-14 py-4 rounded-2xl shadow-[0_10px_30px_rgba(244,72,74,0.3)] hover:bg-[#db4042] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Enviar
            </button>
          </form>
        </div>

        <div className="mt-32 w-full flex flex-col items-center px-6">
          <h3 className="font-['Outfit'] font-bold text-sm md:text-base tracking-[0.25em] uppercase text-white/80 mb-10">Nuestros Colaboradores:</h3>
          <div className="w-full max-w-5xl mx-auto overflow-hidden">
            <LogoLoop
              logos={brandLogos}
              speed={60}
              direction="left"
              logoHeight={60}
              gap={50}
              hoverSpeed={15}
              scaleOnHover
              fadeOut={true}
              fadeOutColor="#0277ab"
              ariaLabel="Nuestros Colaboradores"
            />
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="w-full bg-white text-gray-500 font-['Outfit'] mt-32 py-10 px-6 relative shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-sm md:text-base">
            <div className="flex items-center gap-2 mb-6 bg-gray-100 px-4 py-2 rounded-full font-medium">
              <Activity className="w-4 h-4 text-gray-400" />
              <span>Nº de visitas: <strong className="text-gray-700">126.935</strong></span>
            </div>
            
            <div className="w-full h-px bg-gray-200 mb-8 max-w-4xl"></div>
            
            <p className="mb-2 font-medium">© 2026 Dommomedia. Todos los derechos reservados.</p>
            <div className="flex gap-4 mb-6 text-gray-400 font-medium">
              <a href="#" className="hover:text-[#0277ab] transition-colors">Política de privacidad</a>
              <span>-</span>
              <a href="#" className="hover:text-[#0277ab] transition-colors">Política de cookies</a>
            </div>
            
            <a href="#" className="flex items-center gap-2 font-bold text-[#0277ab] bg-[#0277ab]/5 px-6 py-3 rounded-xl hover:bg-[#0277ab]/10 hover:text-[#015a82] transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              Visítanos en Facebook
            </a>
            
            {/* Scroll to top button */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute left-6 md:left-12 bottom-10 w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-[#0277ab] hover:text-white text-gray-500 rounded-xl transition-all hover:-translate-y-2 shadow-sm hover:shadow-md"
              aria-label="Volver arriba"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
