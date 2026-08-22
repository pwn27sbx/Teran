import { useState, useRef, useEffect } from "react";
import BrushReveal from "../components/BrushReveal";
import DriftWall from "../components/DriftWall";
import LogoLoop from "../components/LogoLoop";
import CurvedInput from "../components/CurvedInput";
import Scanner from "../components/Scanner";
import PremiumFeatures from "../components/PremiumFeatures";
import Topography from "../components/Topography";
import {
  Menu,
  Store,
  MapPin,
  Activity,
  ChevronUp,
  PhoneCall,
  Sun,
  Moon,
} from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
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
  const navigate = useNavigate();
  const { isDark, toggleDark } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

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
    <div className="relative font-sans selection:bg-[#f4484a] selection:text-white bg-[#f8f9fa] dark:bg-[#121212]">
      {/* Animated Topography Background */}
      <div className="fixed inset-0 z-0 opacity-40 dark:opacity-50">
        <Topography
          lowColor={isDark ? "#082f49" : "#e0f2fe"}
          midColor={isDark ? "#0277ab" : "#bae6fd"}
          highColor={isDark ? "#f4484a" : "#fca5a5"}
          speed={0.35}
          morphAmount={3}
          morphSpeed={0.05}
          bands={1.5}
          thickness={0.015}
          scale={1.5}
          pixelSize={1}
          glow={0.1}
          colorMode="elevation"
          contrast={1.2}
          brightness={isDark ? 0.8 : 1.2}
          fillBands={false}
          opacity={1}
          grain={true}
          grainIntensity={0.02}
          mouseInteraction={true}
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>
      {/* Fixed Header - stays on top of everything while scrolling */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none"
      >
        {/* Logo and Text */}
        <div className="flex items-center gap-2 text-gray-900 dark:text-white drop-shadow-md pointer-events-auto">
          <img
            src="/logoTeran.svg"
            alt="Logo Hospital Veterinario Terán"
            className="h-[74px] w-auto mt-1.5"
          />
          <div className="flex flex-col justify-center items-start">
            <span className="font-['Outfit'] font-black text-[56px] tracking-tighter uppercase leading-none text-gray-900 dark:text-white mb-0 drop-shadow-sm">
              TERAN
            </span>
            <span className="font-['Outfit'] font-bold text-[14px] tracking-[0.09em] uppercase text-gray-700 dark:text-gray-300 leading-none mt-1 drop-shadow-sm">
              Hospital Veterinario
            </span>
          </div>
        </div>

        {/* Right Actions: Glass Dock */}
        <div ref={menuRef} className="group relative flex items-center p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto">
          
          {/* Animated Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
            <motion.rect
              width="100%"
              height="100%"
              rx="26"
              fill="none"
              stroke="#f4484a"
              strokeWidth="2"
              pathLength="100"
              strokeDasharray="15 85"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            />
          </svg>

          {/* Botón Emergencias */}
          <Link
            to="/emergencias"
            className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-[#f4484a] hover:bg-[#d63d3f] text-white rounded-full font-['Outfit'] font-bold text-[12px] md:text-[13px] tracking-widest shadow-[0_4px_15px_rgba(244,72,74,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">EMERGENCIAS 24H</span>
            <span className="sm:hidden">24H</span>
          </Link>

          {/* Botón Menú */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-10 flex items-center justify-center w-10 h-10 ml-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-3 w-56 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-2xl border border-white/40 dark:border-gray-700/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex flex-col p-2 z-50 origin-top-right"
              >
                <Link
                  to="/"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3"
                >
                  Inicio
                </Link>
                <Link
                  to="/servicios"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3"
                >
                  Servicios
                </Link>
                <Link
                  to="/nosotros"
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3"
                >
                  Nosotros
                </Link>
                
                <div className="h-px bg-gray-200 dark:bg-gray-700/50 my-1 mx-2" />
                
                <button
                  onClick={() => {
                    toggleDark();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium text-gray-800 dark:text-gray-100 transition-all flex items-center gap-3 w-full text-left"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Modo Claro" : "Modo Oscuro"}
                </button>
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
            className="w-full h-full relative origin-center bg-white dark:bg-gray-900 shadow-2xl overflow-hidden pointer-events-auto"
          >
            <BrushReveal
              bgImage="/milo1_nobg.webp"
              revealImage="/atreus1_nobg.webp"
              xrayImage="/atreusx_nobg.webp"
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

        {/* Footer slides over the gallery */}
        <footer
          ref={footerRef}
          className="relative z-20 flex flex-col items-center pt-32 w-full min-h-screen overflow-hidden bg-[#f8f9fa] shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
        >
          {/* Dog on the left */}
          <motion.img
            src="/miloperfil.webp"
            alt="Dog"
            className="absolute -left-[15%] md:-left-[9%] bottom-0 w-[400px] md:w-[600px] lg:w-[780px] xl:w-[950px] object-contain pointer-events-none mix-blend-multiply"
            style={{ x: dogX, y: dogY, opacity: animalsOpacity }}
          />

          {/* Cat on the right */}
          <motion.img
            src="/atreusperfil.webp"
            alt="Cat"
            className="absolute -right-[10%] md:-right-[7%] bottom-0 w-[400px] md:w-[600px] lg:w-[780px] xl:w-[950px] object-contain pointer-events-none mix-blend-multiply"
            style={{ x: catX, y: catY, opacity: animalsOpacity }}
          />

          <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center px-6 mt-10 md:mt-20">
            <h2 className="font-['Outfit'] font-black text-4xl md:text-5xl text-[#0277ab] mb-4">
              Boletín Terrancito
            </h2>
            <p className="font-serif text-gray-600 dark:text-gray-400 text-base md:text-lg mb-2">
              Suscríbete y recibe nuestras ofertas y novedades
            </p>

            <div className="w-full max-w-md mx-auto flex flex-col -space-y-4 items-center mt-4">
              <CurvedInput
                theme={isDark ? 'dark' : 'light'}
                showButton={false}
                showIcon={false}
                placeholder="Nombre y Apellidos*"
                type="text"
                cornerRadius={18}
                borderWidth={2}
                borderColor={isDark ? "#38bdf8" : "#0277ab"}
                fontSize={16}
                backgroundColor={isDark ? "#1f2937" : "#ffffff"}
                textColor={isDark ? "#f3f4f6" : "#1d2050"}
                placeholderColor={isDark ? "#9ca3af" : "#9aa0b6"}
                shadowSize="md"
                shadowColor="#000000"
                width={450}
                height={64}
                bend={18}
              />
              <CurvedInput
                theme={isDark ? 'dark' : 'light'}
                showButton={true}
                buttonText="Enviar"
                showIcon={false}
                placeholder="tucorreo@email.com*"
                type="email"
                cornerRadius={18}
                borderWidth={2}
                borderColor={isDark ? "#38bdf8" : "#0277ab"}
                fontSize={16}
                backgroundColor={isDark ? "#1f2937" : "#ffffff"}
                textColor={isDark ? "#f3f4f6" : "#1d2050"}
                placeholderColor={isDark ? "#9ca3af" : "#9aa0b6"}
                buttonColor="#f4484a"
                buttonTextColor="#ffffff"
                shadowSize="md"
                shadowColor="#000000"
                width={450}
                height={64}
                bend={18}
              />
            </div>
          </div>

          <div className="w-full flex flex-col items-center px-6 relative z-10 mt-auto mb-10">
            <h3 className="font-['Outfit'] font-bold text-sm md:text-base tracking-[0.25em] uppercase text-gray-500 dark:text-gray-400 mb-10">
              NUESTROS COLABORADORES
            </h3>
            <div className="w-full max-w-xl mx-auto overflow-hidden">
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

          <div className="w-full text-gray-500 dark:text-gray-400 font-['Outfit'] mt-20 py-8 px-6 relative z-30">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 text-sm md:text-base">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-medium">
                  © 2026 Dommomedia. Todos los derechos reservados.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-gray-400 font-medium">
                  <a
                    href="#"
                    className="hover:text-[#0277ab] transition-colors"
                  >
                    Política de privacidad
                  </a>
                  <span className="hidden sm:inline">-</span>
                  <a
                    href="#"
                    className="hover:text-[#0277ab] transition-colors"
                  >
                    Política de cookies
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 px-4 py-2 rounded-full font-medium">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span>
                    Nº de visitas:{" "}
                    <strong className="text-gray-700 dark:text-gray-300">126.935</strong>
                  </span>
                </div>
              </div>

              {/* Scroll to top button */}
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="md:absolute left-6 md:left-12 bottom-8 w-12 h-12 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80 hover:bg-[#0277ab] hover:text-white text-gray-500 dark:text-gray-400 rounded-xl transition-all hover:-translate-y-2 shadow-sm hover:shadow-md"
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
