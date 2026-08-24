import { useDarkMode } from "../hooks/useDarkMode";
import { useState, useRef, useEffect } from "react";
import BrushReveal from "../components/BrushReveal";
import DriftWall from "../components/DriftWall";
import PremiumFeatures from "../components/PremiumFeatures";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Activity } from "lucide-react";


import { motion, useScroll, useTransform } from "framer-motion";

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
  
  const { isDark } = useDarkMode();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
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
            {/* Contenedor para ajustar tamaño y posición en PC sin romper las capas */}
            <div className="w-full h-full md:scale-[1] md:translate-y-[5vh] origin-bottom">
              <BrushReveal
                bgImage="/milo1_nobg.webp"
                revealImage="/atreus1_nobg.webp"
                xrayImage={isDark ? "/atreusx_dark.webp" : "/atreusx_nobg.webp"}
                brushSize={isMobile ? 90 : 180}
                revealScale={0.73}
                bgScale={isMobile ? 0.95 : 1}
                bgObjectPosition="center 5%"
                revealOffsetY={isMobile ? -0.35 : -0.354}
              />
            </div>
            {isMobile && (
              <div className="absolute top-[16vh] left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-900 dark:text-white drop-shadow-md z-10 pointer-events-none w-full">
                <img
                  src="/logoTeran.svg"
                  alt="Logo Hospital Veterinario Terán"
                  className="h-[85px] w-auto mt-0"
                />
                <div className="flex flex-col justify-center items-center mt-2">
                  <span className="font-['Outfit'] font-black text-[56px] tracking-tighter uppercase leading-none text-gray-900 dark:text-white mb-0 drop-shadow-sm text-center">
                    TERAN
                  </span>
                  <span className="font-['Outfit'] font-bold text-[14px] tracking-[0.09em] uppercase text-gray-700 dark:text-gray-300 leading-none mt-1.5 drop-shadow-sm text-center">
                    Hospital Veterinario
                  </span>
                </div>
              </div>
            )}
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
            className="relative z-30 w-full h-full flex flex-col md:flex-row items-center overflow-hidden"
          >
            {/* Top Half (Mobile) / Left Side (Desktop): Text */}
            <div className="relative z-20 w-full md:w-[35%] h-[35%] md:h-auto flex flex-col justify-center items-center md:items-start text-center md:text-left px-6 md:p-0 md:pl-12 pt-20 md:pt-0 mx-auto md:mx-0">
              <h2 className="font-['Outfit'] font-black text-5xl md:text-7xl lg:text-8xl text-[#0277ab] dark:text-sky-400 tracking-tight drop-shadow-md leading-tight md:leading-[0.9]">
                Nuestra Galería
              </h2>
              <div className="w-16 md:w-20 h-1.5 md:h-2 bg-[#f4484a] rounded-full mt-4 md:mt-6 mb-4 md:mb-6 shadow-sm"></div>
              <p className="font-serif text-base md:text-xl leading-relaxed text-gray-900 dark:text-gray-100 md:text-gray-600 md:dark:text-gray-400 font-medium md:font-light max-w-[320px] md:max-w-sm drop-shadow-sm">
                Un vistazo a la excelencia de nuestras instalaciones y los
                pacientes felices que confían en nosotros día a día.
              </p>
            </div>

            {/* Bottom Half (Mobile) / Right Side (Desktop): DriftWall seamlessly fading */}
            <div className="relative md:absolute bottom-0 right-0 md:right-[-5vw] w-full md:w-[75%] h-[65%] md:h-full z-0 pointer-events-auto">
              {/* Fade for mobile to smoothly blend the images into the text boundary */}
              <div className="md:hidden absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#f8f9fa] dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
              <DriftWall
                items={galleryItems}
                columns={isMobile ? 4 : 5}
                tileWidth={isMobile ? 160 : 220}
                tileHeight={isMobile ? 105 : 145}
                gap={isMobile ? 12 : 20}
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
