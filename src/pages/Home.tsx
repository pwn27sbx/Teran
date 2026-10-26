import { useState, useRef, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import HeroField from "@/components/HeroField";
import { HeroSubjectBackdrop, HeroSubjectObject } from "@/components/HeroSubjectReveal";
import HeroOverlay from "@/components/HeroOverlay";
import DriftWall from "@/components/DriftWall";
import PremiumFeatures from "@/components/PremiumFeatures";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity } from "lucide-react";
import { SEO } from "@/components/SEO";
import { VisualErrorBoundary } from "@/components/VisualErrorBoundary";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { galleryItems } from "@/data/gallery";

const SCROLL_RANGE = [0, 800, 1200];
const HERO_SCALE_RANGE = [1, 0.35];
const HERO_RADIUS_RANGE = ["0px", "48px"];
const HERO_OPACITY_RANGE = [1, 1, 0];
const GALLERY_SCROLL_OFFSET: ["start end", "start 20%"] = ["start end", "start 20%"];

function Home() {
  const { t } = useTranslation();
  
  const shouldReduceMotion = useReducedMotion();
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
    offset: GALLERY_SCROLL_OFFSET,
  });

  const galleryX = useTransform(galleryProgress, [0, 1], ["100%", "0%"]);

  const heroScale = useTransform(scrollY, [SCROLL_RANGE[0], SCROLL_RANGE[1]], HERO_SCALE_RANGE);
  const heroRadius = useTransform(scrollY, [SCROLL_RANGE[0], SCROLL_RANGE[1]], HERO_RADIUS_RANGE);
  const heroOpacity = useTransform(scrollY, SCROLL_RANGE, HERO_OPACITY_RANGE);

  // With reduced motion the hero renders statically: no scroll-driven scale,
  // radius or opacity, so the composition never moves under the copy.
  const heroMotionStyle = shouldReduceMotion
    ? undefined
    : { scale: heroScale, borderRadius: heroRadius, opacity: heroOpacity };

  return (
    <div
      className="relative font-sans selection:bg-[#f4484a] selection:text-white bg-[#f8f9fa] dark:bg-[#121212]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(2, 119, 171, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 119, 171, 0.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <SEO url="/" />
      <Header variant="home" />

      {/* ============================================================== */}
      {/* 1. HERO SECTION (Sticky wrapper for Lando Zoom Out effect)     */}
      {/* ============================================================== */}
      <div className="h-[200vh] w-full relative z-10">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none">
          <motion.div
            style={heroMotionStyle}
            className="w-full h-full relative origin-center bg-white dark:bg-[#121212] shadow-2xl overflow-hidden pointer-events-auto"
          >
            {/* Quiet contour field: the reference hero is a light field crossed
                by thin lines, not a flat surface. Decorative and inert. */}
            <div className="pointer-events-none absolute inset-0 text-[#186dac] opacity-[0.14]">
              <HeroField />
            </div>

            {/* Media layer only, split in two: the dog hosts the scene as a
                full-bleed backdrop and the cat reveals its own study from the
                slot the overlay allocates. Each layer keeps its own boundary,
                so a media failure can never remove the copy. */}
            <div className="w-full h-full md:scale-[1] md:translate-y-[5vh] origin-bottom">
              <VisualErrorBoundary fallbackMessage="Error loading hero effect">
                <HeroSubjectBackdrop />
              </VisualErrorBoundary>
            </div>
            <HeroOverlay
              media={
                <VisualErrorBoundary fallbackMessage="Error loading hero subject">
                  <HeroSubjectObject />
                </VisualErrorBoundary>
              }
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
            {t('home.why_us')}
          </h2>
          <p className="font-serif text-lg md:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 font-light max-w-3xl">
            <Trans 
              i18nKey="home.why_us_desc"
              components={{ strong: <strong className="font-bold text-[#0277ab]" /> }} 
            />
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
                {t('home.gallery')}
              </h2>
              <div className="w-16 md:w-20 h-1.5 md:h-2 bg-[#f4484a] rounded-full mt-4 md:mt-6 mb-4 md:mb-6 shadow-sm"></div>
              <p className="font-serif text-base md:text-xl leading-relaxed text-gray-900 dark:text-gray-100 md:text-gray-600 md:dark:text-gray-400 font-medium md:font-light max-w-[320px] md:max-w-sm drop-shadow-sm">
                {t('home.gallery_desc')}
              </p>
            </div>

            {/* Bottom Half (Mobile) / Right Side (Desktop): DriftWall seamlessly fading */}
            <div className="relative md:absolute bottom-0 right-0 md:right-[-5vw] w-full md:w-[75%] h-[65%] md:h-full z-0 pointer-events-auto">
              {/* Fade for mobile to smoothly blend the images into the text boundary */}
              <div className="md:hidden absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#f8f9fa] dark:from-[#121212] to-transparent z-10 pointer-events-none"></div>
              <VisualErrorBoundary fallbackMessage="Error loading gallery">
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
              </VisualErrorBoundary>
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

export default Home;
