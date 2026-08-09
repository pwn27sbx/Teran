import React from 'react';
import BrushReveal from './components/BrushReveal';
import { Stethoscope } from 'lucide-react';

function App() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans">

      {/* Background Interactive Brush Effect */}
      <div className="absolute inset-0 z-0">
        <BrushReveal
          bgImage="/milo1.png"
          revealImage="/atreus1.png"
          brushSize={150}
          revealScale={0.83}
          revealOffsetY={-0.18}
        />
      </div>

      {/* Floating UI Layer */}
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-6 md:px-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 text-gray-900 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
          <Stethoscope className="w-5 h-5 text-teal-600" />
          <span className="font-serif font-bold text-xl tracking-wide">Hospital Terán</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-800 bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200/50 shadow-sm">
          <span className="hover:text-teal-600 cursor-pointer pointer-events-auto transition-colors">Inicio</span>
          <span className="hover:text-teal-600 cursor-pointer pointer-events-auto transition-colors">Servicios</span>
          <span className="hover:text-teal-600 cursor-pointer pointer-events-auto transition-colors">Nosotros</span>
        </div>
      </header>

      <main className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-gray-900 drop-shadow-sm mb-4 tracking-tight leading-[1.1]">
          Amor infinito.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 italic">
            Salud impecable.
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-2xl text-gray-700 max-w-2xl font-light">
          Pasa el puntero por la pantalla para descubrir la magia de nuestro equipo.
        </p>

        <button className="mt-10 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-teal-600 transition-all shadow-xl pointer-events-auto transform hover:scale-105 active:scale-95 duration-300">
          Agendar Cita Ahora
        </button>
      </main>

      {/* Bottom Fade Gradient for grounding */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-0 pointer-events-none" />
    </div>
  );
}

export default App;
