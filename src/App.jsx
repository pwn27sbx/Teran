import React, { useState, useRef } from "react";
import BrushReveal from "./components/BrushReveal";
import DriftWall from "./components/DriftWall";
import LogoLoop from "./components/LogoLoop";
import CurvedInput from "./components/CurvedInput";

import {
  Menu,
  Store,
  MapPin,
  Activity,
  ChevronUp,
  PhoneCall,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";

const baseGalleryItems = Array.from({ length: 27 }, (_, i) => ({
  image: `/gallery/${i + 1}.webp`,
  title: `Galería ${i + 1}`,
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
  { src: "/logos/nextgard.svg", alt: "NexGard", title: "NexGard" },
  { src: "/logos/hills2.svg", alt: "Hill's", title: "Hill's" },
  { src: "/logos/purina.svg", alt: "Purina", title: "Purina" },
  { src: "/logos/equilibrio.svg", alt: "Equilibrio", title: "Equilibrio" },
  { src: "/logos/hartz-full.svg", alt: "Hartz", title: "Hartz" },
  { src: "/logos/virbac.svg", alt: "Virbac", title: "Virbac" },
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const galleryRef = useRef(null);
  const footerRef = useRef(null);

  // Tie the slide-in directly to the scroll wheel for gallery
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "start 20%"],
  });

  // Scroll progress for the footer (curtain effect animation)
  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Animals slide diagonally inwards and upwards as footer scrolls in
  const dogX = useTransform(footerProgress, [0.3, 1], [-150, 0]);
  const dogY = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const catX = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const catY = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const animalsOpacity = useTransform(footerProgress, [0.3, 0.9], [0, 0.95]);
  // Use the raw progress for the transform to prevent rubber-banding
  const galleryX = useTransform(galleryProgress, [0, 1], ["100%", "0%"]);

  // Advanced Lando-style zoom out effect:
  // Scales down drastically and gets rounded corners as the user scrolls
  const heroScale = useTransform(scrollY, [0, 800], [1, 0.35]);
  const heroRadius = useTransform(scrollY, [0, 800], ["0px", "48px"]);
  const heroOpacity = useTransform(scrollY, [0, 800, 1200], [1, 1, 0]);

  return (
    <div className="relative bg-[#0277ab] font-sans selection:bg-[#f4484a] selection:text-white">
      {/* Fixed Paw pattern background overlay (pure CSS) covering the whole page */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff'%3E%3Cellipse cx='25' cy='35' rx='12' ry='16' transform='rotate(-30 25 35)' /%3E%3Cellipse cx='42' cy='18' rx='12' ry='16' transform='rotate(-10 42 18)' /%3E%3Cellipse cx='68' cy='18' rx='12' ry='16' transform='rotate(10 68 18)' /%3E%3Cellipse cx='85' cy='35' rx='12' ry='16' transform='rotate(30 85 35)' /%3E%3Cpath d='M 30,55 Q 55,40 80,55 Q 95,75 80,90 Q 55,100 30,90 Q 15,75 30,55 Z' /%3E%3C/svg%3E")`,
          backgroundSize: "90px 90px",
        }}
      />

      {/* Fixed Header - stays on top of everything while scrolling */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none"
      >
        {/* Logo and Text */}
        <div className="flex items-center gap-2 text-gray-900 drop-shadow-md">
          <img
            src="/logoTeran.svg"
            alt="Logo Hospital Veterinario Terán"
            className="h-[74px] w-auto mt-1.5"
          />
          <div className="flex flex-col justify-center items-start">
            <span className="font-['Outfit'] font-black text-[56px] tracking-tighter uppercase leading-none text-gray-900 mb-0">
              TERAN
            </span>
            <span className="font-['Outfit'] font-bold text-[14px] tracking-[0.09em] uppercase text-gray-700 leading-none mt-1">
              Hospital Veterinario
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="relative pointer-events-auto flex items-center gap-3">
          {/* Botón Emergencias (Glassmorphism + Pulse suave en sombra) */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-['Outfit'] font-bold text-[14px] bg-[#f4484a]/90 backdrop-blur-md text-white shadow-[0_4px_20px_rgba(244,72,74,0.4)] border border-white/20 hover:bg-[#f4484a] transition-all"
            onClick={() => console.log("Emergencias clicked")}
          >
            <PhoneCall className="w-4 h-4" />
            <span>EMERGENCIAS 24H</span>
          </motion.button>

          {/* Botón Menú (Glassmorphism) */}
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-['Outfit'] font-bold text-[14px] bg-white/70 backdrop-blur-md text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/40 hover:bg-white/90 hover:shadow-[0_4px_25px_rgba(0,0,0,0.1)] transition-all"
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
                className="absolute top-full right-0 mt-3 w-56 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col p-2 z-50 origin-top-right"
              >
                <a
                  href="#"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 transition-all flex items-center gap-2"
                >
                  Inicio
                </a>
                <a
                  href="#"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 transition-all flex items-center gap-2"
                >
                  Servicios
                </a>
                <a
                  href="#"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 transition-all flex items-center gap-2"
                >
                  Nosotros
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (Sticky wrapper for Lando Zoom Out effect)     */}
      {/* ============================================================== */}
      <div className="h-[200vh] w-full relative z-10">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.div
            style={{
              scale: heroScale,
              borderRadius: heroRadius,
              opacity: heroOpacity,
            }}
            className="w-full h-full relative origin-center bg-white shadow-2xl overflow-hidden pointer-events-auto"
          >
            <BrushReveal
              bgImage="/milo1_nobg.png"
              revealImage="/atreus1_nobg.png"
              brushSize={150}
              revealScale={0.78}
              revealOffsetY={-0.26}
            />
            {/* No fade gradient at the bottom as requested */}
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
          <h2 className="font-['Outfit'] font-black text-5xl md:text-6xl text-white mb-8 tracking-tight drop-shadow-md">
            ¿Por qué elegirnos?
          </h2>
          <p className="font-serif text-lg md:text-2xl leading-relaxed text-white/90 font-light drop-shadow-sm">
            Veterinarias Terán es sinónimo de profesionalismo y pasión por la
            medicina veterinaria, son 24 años de salvaguardar el bienestar de
            las mascotas del Perú, 24 años en los cuales hemos sido precursores
            en incluir tecnología médica de punta haciendo hincapié en la
            capacitación constante de nuestro staff, tanto nacional como
            internacionalmente, cada día es un reto para mejorar la sociedad,
            para salvar una vida pero sobre todo cambiar nuestro país.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
          {/* Column 1: Tienda Virtual */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 transition-transform hover:scale-110 duration-300">
              <Store className="w-14 h-14 text-gray-800" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">
              Tienda Virtual
            </h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              El más exclusivo Pet Shop con los mejores productos en alimentos,
              juguetes, casas, camas, ropa, venta de mascotas y mucho más...
            </p>
          </div>

          {/* Column 2: Nuestras sedes */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 transition-transform hover:scale-110 duration-300">
              <MapPin className="w-14 h-14 text-[#f4484a]" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">
              Nuestras sedes
            </h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              Cada vez más cerca de ti, encuentra una veterinaria Terán cerca a
              tu casa.
            </p>
          </div>

          {/* Column 3: Terán TV */}
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl shrink-0 p-4 transition-transform hover:scale-110 duration-300">
              <img
                src="/logoTeran.svg"
                alt="Terán TV Logo"
                className="w-full h-auto drop-shadow-sm"
              />
            </div>
            <h3 className="font-['Outfit'] font-bold text-2xl text-white mb-4">
              Terán TV
            </h3>
            <p className="font-serif text-white/90 leading-relaxed text-lg px-2">
              Bienvenidos a TERÁN TV, nuestro archivo videográfico con nuestros
              casos veterinarios, testimonios, proyectos especiales y mucho más.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. THIRD SECTION: Photo Gallery & 4. FOOTER (Combined)         */}
      {/* ============================================================== */}
      <div className="relative w-full" ref={galleryRef}>
        {/* Sticky Gallery */}
        <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col z-10 bg-[#0277ab]">
          <motion.div
            style={{ x: galleryX }}
            className="relative z-30 w-full h-full flex items-center overflow-hidden px-6 md:px-12"
          >
            {/* Left Side: Text */}
            <div className="relative z-10 w-full md:w-[35%] flex flex-col items-start pl-4 md:pl-12">
              <h2 className="font-['Outfit'] font-black text-6xl md:text-7xl lg:text-8xl text-white tracking-tight drop-shadow-lg leading-[0.9]">
                Nuestra
                <br />
                Galería
              </h2>
              <div className="w-20 h-2 bg-[#f4484a] rounded-full mt-6 mb-6"></div>
              <p className="font-serif text-lg md:text-xl leading-relaxed text-white/90 font-light drop-shadow-sm">
                Un vistazo a la excelencia de nuestras instalaciones y los
                pacientes felices que confían en nosotros día a día.
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

        {/* Scroll Pause */}
        <div className="w-full h-[35vh] pointer-events-none" />

        {/* Footer slides over the gallery */}
        <footer
          ref={footerRef}
          className="relative z-20 flex flex-col items-center pt-32 w-full min-h-screen overflow-hidden bg-[#f8f9fa] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
        >
          {/* Dog on the left */}
          <motion.img
            src="/miloperfil.png"
            alt="Dog"
            className="absolute left-0 bottom-0 w-[350px] md:w-[550px] lg:w-[700px] xl:w-[850px] object-contain -translate-x-[35%] md:-translate-x-1/4 pointer-events-none mix-blend-multiply"
            style={{ x: dogX, y: dogY, opacity: animalsOpacity }}
          />

          {/* Cat on the right */}
          <motion.img
            src="/atreusperfil.png"
            alt="Cat"
            className="absolute right-0 bottom-0 w-[350px] md:w-[550px] lg:w-[700px] xl:w-[850px] object-contain translate-x-1/4 md:translate-x-[15%] pointer-events-none mix-blend-multiply"
            style={{ x: catX, y: catY, opacity: animalsOpacity }}
          />

          <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center px-6 mt-10 md:mt-20">
            <h2 className="font-['Outfit'] font-black text-4xl md:text-5xl text-[#0277ab] mb-4">
              Boletín Terrancito
            </h2>
            <p className="font-serif text-gray-600 text-base md:text-lg mb-2">
              Suscríbete y recibe nuestras ofertas y novedades
            </p>

            <form className="w-full flex flex-col -space-y-4 max-w-md items-center mt-4">
              <CurvedInput
                showButton={false}
                showIcon={false}
                placeholder="Nombre y Apellidos*"
                type="text"
                cornerRadius={18}
                borderWidth={2}
                borderColor="#0277ab"
                fontSize={16}
                backgroundColor="#ffffff"
                textColor="#1d2050"
                placeholderColor="#9aa0b6"
                shadowSize="md"
                shadowColor="#000000"
                width={450}
                height={64}
                bend={18}
              />
              <CurvedInput
                showButton={true}
                buttonText="Enviar"
                showIcon={false}
                placeholder="tucorreo@email.com*"
                type="email"
                cornerRadius={18}
                borderWidth={2}
                borderColor="#0277ab"
                fontSize={16}
                backgroundColor="#ffffff"
                textColor="#1d2050"
                placeholderColor="#9aa0b6"
                buttonColor="#f4484a"
                buttonTextColor="#ffffff"
                shadowSize="md"
                shadowColor="#000000"
                width={450}
                height={64}
                bend={18}
              />
            </form>
          </div>

          <div className="w-full flex flex-col items-center px-6 relative z-10 mt-auto mb-10">
            <h3 className="font-['Outfit'] font-bold text-sm md:text-base tracking-[0.25em] uppercase text-gray-500 mb-10">
              NUESTROS COLABORADORES
            </h3>
            <div className="w-full max-w-3xl mx-auto overflow-hidden">
              <LogoLoop
                logos={brandLogos}
                speed={60}
                direction="left"
                logoHeight={50}
                gap={35}
                hoverSpeed={15}
                scaleOnHover
                fadeOut={true}
                fadeOutColor="#f8f9fa"
                ariaLabel="Nuestros Colaboradores"
              />
            </div>
          </div>

          <div className="w-full text-gray-500 font-['Outfit'] mt-20 py-8 px-6 relative z-30">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm md:text-base">
              <div className="flex flex-col items-center md:items-start gap-1">
                <p className="font-medium">
                  © 2026 Dommomedia. Todos los derechos reservados.
                </p>
                <div className="flex gap-4 text-gray-400 font-medium">
                  <a
                    href="#"
                    className="hover:text-[#0277ab] transition-colors"
                  >
                    Política de privacidad
                  </a>
                  <span>-</span>
                  <a
                    href="#"
                    className="hover:text-[#0277ab] transition-colors"
                  >
                    Política de cookies
                  </a>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex items-center gap-2 bg-gray-100/50 px-4 py-2 rounded-full font-medium">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span>
                    Nº de visitas:{" "}
                    <strong className="text-gray-700">126.935</strong>
                  </span>
                </div>

                <a
                  href="#"
                  className="flex items-center gap-2 font-bold text-[#0277ab] bg-[#0277ab]/5 px-5 py-2.5 rounded-xl hover:bg-[#0277ab]/10 hover:text-[#015a82] transition-all"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Visítanos en Facebook
                </a>
              </div>

              {/* Scroll to top button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="md:absolute left-6 md:left-12 bottom-8 w-12 h-12 flex items-center justify-center bg-gray-100/80 hover:bg-[#0277ab] hover:text-white text-gray-500 rounded-xl transition-all hover:-translate-y-2 shadow-sm hover:shadow-md"
                aria-label="Volver arriba"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
