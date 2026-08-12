import React, { useRef, useEffect, useState, useId } from 'react';

const GooeyNav = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 20, // Small particles like in the video!
  timeVariance = 300,
  initialActiveIndex = 0
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const filterId = useId().replace(/:/g, "");

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r, color) => {
    const p = document.createElement('span');
    p.classList.add('particle');

    const start = getXY(d[0], particleCount - i, particleCount);
    const end = getXY(d[1], particleCount - i, particleCount);

    p.style.setProperty('--start-x', `${start[0]}px`);
    p.style.setProperty('--start-y', `${start[1]}px`);
    p.style.setProperty('--end-x', `${end[0]}px`);
    p.style.setProperty('--end-y', `${end[1]}px`);
    p.style.setProperty('--end-scale', `${Math.max(0, noise(2.5))}`);
    
    // We use the active color for the particles
    p.style.setProperty('--color', color);

    const animationProps = `var(--time) var(--linear-ease) ${t}ms 1 both`;
    p.style.animation = `particle-fly ${animationProps}`;
    
    const child = document.createElement('span');
    child.classList.add('point');
    child.style.width = `${r}px`;
    child.style.height = `${r}px`;
    child.style.animation = `particle-scale ${animationProps}`;
    
    p.appendChild(child);
    return p;
  };

  const makeParticles = (element, color) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;

    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * timeVariance;
      const p = createParticle(i, t, d, r, color);
      element.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, bubbleTime + t);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };

    const activeColor = element.getAttribute('data-color') || '#ffffff';
    const activeTextColor = element.getAttribute('data-text-color') || '#000000';
    
    filterRef.current.style.setProperty('--active-bg', activeColor);
    textRef.current.style.setProperty('--active-text-color', activeTextColor);
    
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    // Use innerHTML to preserve icons if any
    textRef.current.innerHTML = element.innerHTML;
  };

  const handleClick = (e, index, item) => {
    const liEl = e.currentTarget;
    
    if (activeIndex === index) {
      if (item.onClick) item.onClick(e);
      return;
    }
    
    setActiveIndex(index);
    updateEffectPosition(liEl);
    
    filterRef.current?.classList.remove('active');
    textRef.current?.classList.remove('active');

    const activeColor = liEl.getAttribute('data-color') || '#ffffff';

    setTimeout(() => {
      filterRef.current?.classList.add('active');
      textRef.current?.classList.add('active');
      makeParticles(filterRef.current, activeColor);
    }, 10);
    
    if (item.onClick) {
      item.onClick(e);
    }
  };

  const handleKeyDown = (e, index, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e, index, item);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
          }

          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
          }

          .effect.text {
            color: transparent;
            transition: color 0.1s linear;
            z-index: 2;
          }

          .effect.text.active {
            color: var(--active-text-color, white);
          }

          .effect.filter {
            filter: url(#gooey-nav-filter-${filterId});
          }

          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--active-bg, #ffffff);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 1rem; /* rounded-2xl */
            transition: background-color 0.3s ease;
          }

          .effect.active::after {
            animation: pill 0.3s ease both;
          }

          .particle {
            position: absolute;
            width: 0;
            height: 0;
            z-index: -2;
          }

          .point {
            position: absolute;
            left: calc(var(--start-x) * -1);
            top: calc(var(--start-y) * -1);
            background: var(--color);
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }

          @keyframes particle-fly {
            0% { transform: translate(var(--start-x), var(--start-y)); }
            100% { transform: translate(var(--end-x), var(--end-y)); }
          }

          @keyframes particle-scale {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(var(--end-scale)); }
          }

          @keyframes pill {
            0% { transform: scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          li.active {
            color: transparent !important;
          }

          li.active::after {
            opacity: 1;
            transform: scale(1);
          }

          li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 1rem; /* rounded-2xl */
            background: var(--active-bg, #ffffff);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
        `}
      </style>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={`gooey-nav-filter-${filterId}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>

      <div className="relative font-['Outfit'] font-bold text-sm tracking-wide pointer-events-auto" ref={containerRef}>
        <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            className="flex items-center gap-4 relative m-0 p-0 list-none z-[1]"
          >
            {items.map((item, index) => (
              <li
                key={index}
                data-color={item.activeColor || '#ffffff'}
                data-text-color={item.activeTextColor || '#000000'}
                className={`rounded-2xl relative cursor-pointer transition-all duration-300 ease shadow-sm text-gray-800 hover:brightness-90 ${item.className || ''} ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <a
                  onClick={e => handleClick(e, index, item)}
                  href={item.href || '#'}
                  onKeyDown={e => handleKeyDown(e, index, item)}
                  className="outline-none py-3.5 px-6 inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
