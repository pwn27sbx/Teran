import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, ChevronUp } from "lucide-react";
import CurvedInput from "./CurvedInput";
import LogoLoop from "./LogoLoop";
import { useDarkMode } from "../hooks/useDarkMode";

const brandLogos = [
  { src: "/logos/pfizer.svg", alt: "Pfizer", title: "Pfizer" },
  { src: "/logos/nextgard.svg", alt: "NexGard", title: "NexGard" },
  { src: "/logos/hills2.svg", alt: "Hill's", title: "Hill's" },
  { src: "/logos/purina.svg", alt: "Purina", title: "Purina" },
  { src: "/logos/equilibrio.svg", alt: "Equilibrio", title: "Equilibrio" },
  { src: "/logos/hartz-full.svg", alt: "Hartz", title: "Hartz" },
  { src: "/logos/virbac.svg", alt: "Virbac", title: "Virbac" },
];

export default function Footer() {
  const { isDark } = useDarkMode();
  const footerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: footerProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const dogX = useTransform(footerProgress, [0.3, 1], [-150, 0]);
  const dogY = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const catX = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const catY = useTransform(footerProgress, [0.3, 1], [150, 0]);
  const animalsOpacity = useTransform(footerProgress, [0.3, 0.9], [0, 0.95]);

  return (
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
              <a href="#" className="hover:text-[#0277ab] transition-colors">
                Política de privacidad
              </a>
              <span className="hidden sm:inline">-</span>
              <a href="#" className="hover:text-[#0277ab] transition-colors">
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
  );
}
