import { useState, useRef, useEffect } from "react";
import BrushReveal from "../components/BrushReveal";
import DriftWall from "../components/DriftWall";
import PremiumFeatures from "../components/PremiumFeatures";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Activity } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

const baseGalleryItems = Array.from({ length: 27 }, (_, i) => ({
  image: `/gallery/${i + 1}.webp`,
  title: `Galería ${i + 1}`,
  href: undefined,
}));

// Rellenamos hasta 30 para que las 5 columnas tengan exactamente 6 imágenes cada una y no haya descuadres
const galleryItems = [
  ...baseGalleryItems,
  baseGalleryItems[0],
  baseGalleryItems[1],
  baseGalleryItems[2],
];

function App() {
  const navigate = useNavigate();
  const { isDark, toggleDark } = useDarkMode();
  
  

  const { scrollY } = useScroll();

  const galleryRef = useRef(null);

  // Tie the slide-in directly to the scroll wheel for gallery
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "start 20%"],
  });

  const galleryX = useTransform(galleryProgress, [0, 1], ["100%", "0%"]);

  const heroScale = useTransform(scrollY, [0, 800], [1, 0.35]);
  const heroRadius = useTransform(scrollY, [0, 800], ["0px", "48px"]);
  const heroOpacity = useTransform(scrollY, [0, 800, 1200], [1, 1, 0]);

  return (
    <div
      className="relative font-sans selection:bg-[#f4484a] selection:text-white bg-[#f8f9fa] dark:bg-[#121212]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(2, 119, 171, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 119, 171, 0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <Header variant="home" />

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
            className="w-full h-full relative origin-center bg-white dark:bg-[#121212] shadow-2xl overflow-hidden pointer-events-auto"
          >
            <BrushReveal
              bgImage="/milo1_nobg.webp"
              revealImage="/atreus1_nobg.webp"
              xrayImage={isDark ? "/atreusx_dark.webp" : "/atreusx_nobg.webp"}
              brushSize={180}
              revealScale={0.73}
              bgScale={0.9}
              bgObjectPosition="center 10%"
              revealOffsetY={-0.29}
            />
            {/* No fade gradient at the bottom as requested */}
          </motion.div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SECOND SECTION: ¿Por qué elegirnos?                         */}
      {/* ============================================================== */}
      {/* Pulled up with negative margin to seamlessly follow the shrinking hero */}
      <div className="relative z-20 text-gray-900 dark:text-white flex flex-col items-center justify-center pb-32 px-6 md:px-12 -mt-[25vh]">
        {/* Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl text-center mb-24 relative z-10 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-md border border-blue-100 dark:border-blue-800 mb-6 shadow-sm">
            <Activity className="w-4 h-4 text-[#f4484a]" />
            <span className="font-['Outfit'] font-bold text-sm tracking-widest uppercase text-[#0277ab]">
              Nuestra Experiencia
            </span>
          </div>
          <h2 className="font-['Outfit'] font-black text-5xl md:text-7xl text-[#0277ab] mb-8 tracking-tight drop-shadow-sm">
            ¿Por qué elegirnos?
          </h2>
          <p className="font-serif text-lg md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-3xl">
            Veterinarias Terán es sinónimo de profesionalismo y pasión. Son{" "}
            <strong className="font-bold text-[#0277ab]">24 años</strong>{" "}
            salvaguardando el bienestar de las mascotas del Perú, siendo
            precursores en tecnología médica de punta y capacitación constante
            de nuestro staff. Cada día es un reto para salvar una vida y mejorar
            nuestro país.
          </p>
        </motion.div>

        {/* Premium Bento Grid */}
        <PremiumFeatures />
      </div>

      {/* ============================================================== */}
      {/* 3. THIRD SECTION: Photo Gallery & 4. FOOTER (Combined)         */}
      {/* ============================================================== */}
      <div className="relative w-full" ref={galleryRef}>
        {/* Sticky Gallery */}
        <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col z-10 bg-transparent">
          <motion.div
            style={{ x: galleryX }}
            className="relative z-30 w-full h-full flex items-center overflow-hidden px-6 md:px-12"
          >
            {/* Left Side: Text */}
            <div className="relative z-10 w-full md:w-[35%] flex flex-col items-start pl-4 md:pl-12">
              <h2 className="font-['Outfit'] font-black text-6xl md:text-7xl lg:text-8xl text-[#0277ab] tracking-tight drop-shadow-sm leading-[0.9]">
                Nuestra
                <br />
                Galería
              </h2>
              <div className="w-20 h-2 bg-[#f4484a] rounded-full mt-6 mb-6 shadow-sm"></div>
              <p className="font-serif text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-sm">
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
                overlayColor="transparent" /* Allow animated background to show */
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

        <Footer />
      </div>
    </div>
  );
}

export default App;
