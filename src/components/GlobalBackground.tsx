import React, { useEffect, useState } from 'react';
import Topography from './Topography';

export default function GlobalBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const root = window.document.documentElement;
    setIsDark(root.classList.contains('dark'));

    // Observe class changes on html tag
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(root.classList.contains('dark'));
        }
      });
    });

    observer.observe(root, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-0 opacity-40 dark:opacity-50 pointer-events-auto">
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
  );
}
