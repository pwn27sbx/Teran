import React, { useRef, useId } from 'react';

const GooeyButton = ({
  children,
  onClick,
  className = "",
  particleColor = "#ffffff",
  particleCount = 15,
  particleR = 40,
  particleDistances = [60, 20]
}) => {
  const containerRef = useRef(null);
  const filterId = useId().replace(/:/g, "");

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    const p = document.createElement('span');
    p.style.position = 'absolute';
    p.style.width = '0';
    p.style.height = '0';
    p.style.zIndex = '-1';
    p.style.pointerEvents = 'none';

    const start = getXY(d[0], particleCount - i, particleCount);
    const end = getXY(d[1], particleCount - i, particleCount);

    p.style.setProperty('--start-x', `${start[0]}px`);
    p.style.setProperty('--start-y', `${start[1]}px`);
    p.style.setProperty('--end-x', `${end[0]}px`);
    p.style.setProperty('--end-y', `${end[1]}px`);
    p.style.setProperty('--end-scale', `${Math.max(0, noise(2.5))}`);

    const animationProps = `linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1) ${t}ms 1 both`;
    
    p.style.animation = `particle-fly ${animationProps}`;
    
    const child = document.createElement('span');
    child.style.position = 'absolute';
    child.style.left = `calc(var(--start-x) * -1)`;
    child.style.top = `calc(var(--start-y) * -1)`;
    child.style.background = particleColor;
    child.style.borderRadius = '50%';
    child.style.transform = 'translate(-50%, -50%)';
    child.style.width = `${r}px`;
    child.style.height = `${r}px`;
    child.style.animation = `particle-scale ${animationProps}`;
    
    p.appendChild(child);
    return p;
  };

  const makeParticles = () => {
    if (!containerRef.current) return;
    const filterEl = containerRef.current.querySelector('.gooey-filter');
    if (!filterEl) return;

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * 300 + 400; 
      const p = createParticle(i, t, particleDistances, particleR);
      p.style.left = '50%';
      p.style.top = '50%';
      filterEl.appendChild(p);

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, t);
    }
  };

  const handleClick = (e) => {
    makeParticles();
    if (onClick) onClick(e);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <style>
        {`
          @keyframes particle-fly {
            0% { transform: translate(var(--start-x), var(--start-y)); }
            100% { transform: translate(var(--end-x), var(--end-y)); }
          }
          @keyframes particle-scale {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(var(--end-scale)); }
          }
        `}
      </style>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={`gooey-btn-filter-${filterId}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      
      <div 
        className="gooey-filter absolute pointer-events-none z-0" 
        style={{ 
          filter: `url(#gooey-btn-filter-${filterId})`,
          top: '-120px', bottom: '-120px', left: '-120px', right: '-120px'
        }}
      >
          <div className="absolute rounded-2xl" style={{ 
            background: particleColor,
            top: '120px', bottom: '120px', left: '120px', right: '120px'
          }}></div>
      </div>

      <button
        onClick={handleClick}
        className={`relative z-10 ${className}`}
      >
        {children}
      </button>
    </div>
  );
};

export default GooeyButton;
