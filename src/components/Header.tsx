import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Menu, ChevronLeft } from "lucide-react";

interface HeaderProps {
  variant?: "home" | "back";
}

export default function Header({ variant = "home" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const headerContent = (
    <>
      {/* Left Side */}
      {variant === "home" ? (
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
      ) : (
        <Link to="/" className="flex items-center gap-3 group pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:shadow-md transition-all">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-black text-xl tracking-tight text-[#0277ab]">
            TERAN
          </span>
        </Link>
      )}

      {/* Right Actions: Glass Dock */}
      <div ref={menuRef} className="group relative flex items-center p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto">
        
        {/* Animated Border */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" aria-hidden="true">
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
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          className="relative z-10 flex items-center justify-center w-10 h-10 ml-1 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#f4484a]"
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
              role="menu"
            >
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className={`px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium transition-all flex items-center gap-3 ${location.pathname === "/" ? "bg-gray-50 dark:bg-gray-800/50 text-[#0277ab] dark:text-sky-400" : "text-gray-800 dark:text-gray-100"}`}
              >
                Inicio
              </Link>
              <Link
                to="/servicios"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className={`px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium transition-all flex items-center gap-3 ${location.pathname === "/servicios" ? "bg-gray-50 dark:bg-gray-800/50 text-[#0277ab] dark:text-sky-400" : "text-gray-800 dark:text-gray-100"}`}
              >
                Servicios
              </Link>
              <Link
                to="/nosotros"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className={`px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium transition-all flex items-center gap-3 ${location.pathname === "/nosotros" ? "bg-gray-50 dark:bg-gray-800/50 text-[#0277ab] dark:text-sky-400" : "text-gray-800 dark:text-gray-100"}`}
              >
                Nosotros
              </Link>
              <Link
                to="/certificacion"
                onClick={() => setIsMenuOpen(false)}
                role="menuitem"
                className={`px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-sm font-['Outfit'] font-medium transition-all flex items-center gap-3 ${location.pathname === "/certificacion" ? "bg-gray-50 dark:bg-gray-800/50 text-[#0277ab] dark:text-sky-400" : "text-gray-800 dark:text-gray-100"}`}
              >
                Certificación
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  if (variant === "home") {
    return (
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none"
      >
        {headerContent}
      </motion.header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 pointer-events-none">
      {headerContent}
    </header>
  );
}
