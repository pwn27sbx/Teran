import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, MapPin, Play, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SmartLink } from './SmartLink';

export default function PremiumFeatures() {
  const [active, setActive] = useState<string>('sedes');
  const { t } = useTranslation();

  const features = [
    {
      id: 'tienda',
      title: t('premium.store.title'),
      subtitle: t('premium.store.subtitle'),
      desc: t('premium.store.desc'),
      icon: Store,
      bgImg: '/gallery/1.webp',
      color: 'from-blue-600/90 to-cyan-500/80',
      accent: 'bg-blue-500 text-white',
      link: '/tienda'
    },
    {
      id: 'sedes',
      title: t('premium.locations.title'),
      subtitle: t('premium.locations.subtitle'),
      desc: t('premium.locations.desc'),
      icon: MapPin,
      bgImg: '/gallery/10.webp',
      color: 'from-red-600/90 to-rose-500/80',
      accent: 'bg-red-500 text-white',
      link: '/emergencias'
    },
    {
      id: 'tv',
      title: t('premium.tv.title'),
      subtitle: t('premium.tv.subtitle'),
      desc: t('premium.tv.desc'),
      icon: Play,
      bgImg: '/gallery/3.webp',
      color: 'from-amber-500/90 to-orange-400/80',
      accent: 'bg-amber-400 text-gray-900',
      link: 'https://www.youtube.com/channel/UC7C7Yo0ILqCbQN6PK1wzWgg/featured'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10 h-[500px] md:h-[600px] flex flex-col md:flex-row gap-4 md:gap-6">
      {features.map((f) => {
        const isActive = active === f.id;
        const Icon = f.icon;

        return (
          <motion.div
            key={f.id}
            layout
            role="button"
            tabIndex={0}
            onMouseEnter={() => setActive(f.id)}
            onFocus={() => setActive(f.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isActive) {
                  setActive(f.id);
                } else if (f.link) {
                   const isExternal = f.link.startsWith('http');
                   if(isExternal) {
                       window.open(f.link, '_blank', 'noopener,noreferrer');
                   } else {
                       window.location.href = f.link; // simple fallback if not using navigate hook inside onKeyDown
                   }
                }
              }
            }}
            onClick={() => {
              if (!isActive) {
                setActive(f.id);
              }
            }}
            animate={{
              flex: isActive ? 3 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className={`relative rounded-[2rem] overflow-hidden cursor-pointer group isolation-auto flex flex-col justify-end bg-gray-900 shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#f4484a]`}
          >
            {/* Background Image */}
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{ scale: isActive ? 1.05 : 1.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img 
                src={f.bgImg} 
                alt={f.title}
                loading="lazy"
                className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-80"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${f.color} mix-blend-multiply transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-40'}`} />
            <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-80' : 'opacity-40'}`} />

            {/* Content Area */}
            <div className={`relative z-10 p-4 md:p-8 flex flex-col h-full ${isActive ? 'justify-between' : 'justify-center md:justify-between'}`}>
              {/* Top Row: Icon + Mobile Inactive Title */}
              <div className="flex justify-between items-center md:items-start w-full">
                <div className="flex items-center gap-4">
                  <motion.div 
                    layout
                    className={`w-14 h-14 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xl transition-all duration-300 shrink-0 ${isActive ? f.accent + ' border-transparent scale-110' : 'group-hover:bg-white/20'}`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>

                  {/* Mobile Inactive Horizontal Title (Perfectly Aligned) */}
                  <AnimatePresence>
                    {!isActive && (
                      <motion.h3
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden font-['Outfit'] font-black text-white text-2xl whitespace-nowrap opacity-90 group-hover:opacity-100"
                      >
                        {f.title}
                      </motion.h3>
                    )}
                  </AnimatePresence>
                </div>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SmartLink 
                         href={f.link}
                         className="w-full h-full flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                         aria-label={`Go to ${f.title}`}
                         tabIndex={isActive ? 0 : -1}
                      >
                         <ArrowUpRight className="w-5 h-5" />
                      </SmartLink>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Text Area */}
              <div className={`${isActive ? 'mt-auto' : 'mt-0 md:mt-auto'} flex flex-col justify-end ${isActive ? 'min-h-[80px] md:min-h-[150px]' : 'md:min-h-[150px]'}`}>
                {/* Active Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex flex-col gap-2 origin-bottom-left"
                    >
                      <span className="font-['Outfit'] font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/80">
                        {f.subtitle}
                      </span>
                      <h3 className="font-['Outfit'] font-black text-white text-4xl md:text-5xl whitespace-normal leading-tight">
                        {f.title}
                      </h3>
                      <p className="text-gray-100 font-serif text-base md:text-lg max-w-md mt-2 leading-relaxed">
                        {f.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Desktop Inactive Vertical Title */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4 }}
                      className="hidden md:block absolute md:bottom-8 md:left-8 font-['Outfit'] font-black text-white text-3xl whitespace-nowrap opacity-70 group-hover:opacity-100 md:[writing-mode:vertical-rl] md:rotate-180"
                    >
                      {f.title}
                    </motion.h3>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
