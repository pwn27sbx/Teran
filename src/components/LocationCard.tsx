import React from "react";
import { ChevronRight } from "lucide-react";

interface LocationCardProps {
  title: string;
  address: string;
  phones: string[];
  mapUrl: string;
  embedUrl: string;
  is24Hours?: boolean;
  themeColor: "red" | "blue" | "amber";
}

const colorMap = {
  red: {
    badge: "bg-red-600/90",
    text: "text-red-600 dark:text-red-400",
    hoverShadow: "hover:shadow-red-900/10 dark:hover:shadow-red-900/20"
  },
  blue: {
    badge: "bg-blue-600/90",
    text: "text-blue-600 dark:text-blue-400",
    hoverShadow: "hover:shadow-gray-200/50 dark:hover:shadow-white/5"
  },
  amber: {
    badge: "bg-amber-600/90",
    text: "text-amber-600 dark:text-amber-400",
    hoverShadow: "hover:shadow-gray-200/50 dark:hover:shadow-white/5"
  }
};

export default function LocationCard({ title, address, phones, mapUrl, embedUrl, is24Hours, themeColor }: LocationCardProps) {
  const [loadMap, setLoadMap] = React.useState(false);
  
  React.useEffect(() => {
    // Retrasar la carga pesada del iframe para no congelar la animación de la página
    const timer = setTimeout(() => {
      setLoadMap(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const colors = colorMap[themeColor];
  
  return (
    <a 
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group bg-white/80 dark:bg-white/5 backdrop-blur-3xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-2 md:p-2.5 flex flex-col hover:shadow-xl ${colors.hoverShadow} transition-all duration-500 hover:-translate-y-1`}
    >
      <div className="w-full h-24 md:h-28 rounded-[1.5rem] overflow-hidden mb-3 relative bg-gray-100 dark:bg-gray-900">
        {loadMap ? (
          <iframe 
            src={embedUrl} 
            className="absolute inset-0 w-full h-full border-0 filter grayscale-[50%] contrast-110 opacity-80 group-hover:opacity-100 group-hover:grayscale-0 dark:invert-[.95] dark:hue-rotate-180 dark:grayscale-[.2] dark:contrast-[1.2] transition-all duration-700 pointer-events-none"
            loading="lazy" 
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-[1.5rem] pointer-events-none" />
        {is24Hours && (
          <div className={`absolute top-2 right-2 ${colors.badge} backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-md`}>
            24 Horas
          </div>
        )}
      </div>
      <div className="px-3 pb-3 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 font-medium">{address}</p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            {phones.map((phone, i) => (
              <p key={i} className="font-semibold text-sm md:text-base text-gray-900 dark:text-white leading-tight">{phone}</p>
            ))}
          </div>
          <span className={`${colors.text} text-[10px] font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
            LLEGAR <ChevronRight className="w-3 h-3"/>
          </span>
        </div>
      </div>
    </a>
  );
}
