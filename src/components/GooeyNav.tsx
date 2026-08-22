import React, { useRef, useEffect, useState, useId } from 'react';

export interface GooeyNavItem {
  label: React.ReactNode;
  href?: string;
  activeColor?: string;
  activeTextColor?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number] | number[];
  particleR?: number;
  timeVariance?: number;
  initialActiveIndex?: number;
}

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 20, // Small particles like in the video!
  timeVariance = 300,
  initialActiveIndex = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const filterId = useId().replace(/:/g, '');

  const noise = (n: number = 1): number => n / 2 - Math.random() * n;

  // Simplified to just fly outwards from the center
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(15)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (
    i: number,
    t: number,
    _d: [number, number] | number[],
    r: number,
    color: string,
    bubbleTime: number
  ): HTMLSpanElement => {
    const p = document.createElement('span');
    p.classList.add('particle');

    // Fly outward by at least 200px to guarantee escaping wide buttons
    const end = getXY(200, i, particleCount);

    p.style.setProperty('--end-x', `${end[0]}px`);
    p.style.setProperty('--end-y', `${end[1]}px`);
    p.style.setProperty('--color', color || 'black');

    // Fast outward burst
    const flyAnim = `${bubbleTime}ms cubic-bezier(0.16, 1, 0.3, 1) ${t}ms 1 both`;
    p.style.animation = `particle-fly ${flyAnim}`;

    const child = document.createElement('span');
    child.classList.add('point');
    child.style.width = `${r}px`;
    child.style.height = `${r}px`;

    // Ease-in shrink: stays large for most of the flight, shrinks at the very end
    const scaleAnim = `${bubbleTime}ms ease-in ${t}ms 1 both`;
    child.style.animation = `particle-scale ${scaleAnim}`;

    p.appendChild(child);
    return p;
  };

  const makeParticles = (element: HTMLElement, color: string): void => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * timeVariance;
      const p = createParticle(i, t, d, r, color, bubbleTime);
      element.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, bubbleTime + t);
    }
  };

  const updateEffectPosition = (element: HTMLElement): void => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const left = `${pos.x - containerRect.x}px`;
    const top = `${pos.y - containerRect.y}px`;
    const width = `${pos.width}px`;
    const height = `${pos.height}px`;

    const activeColor = element.getAttribute('data-color') || '#ffffff';
    const activeTextColor = element.getAttribute('data-text-color') || '#000000';

    filterRef.current.style.setProperty('--active-bg', activeColor);
    textRef.current.style.setProperty('--active-text-color', activeTextColor);

    filterRef.current.style.left = left;
    filterRef.current.style.top = top;
    filterRef.current.style.width = width;
    filterRef.current.style.height = height;

    textRef.current.style.left = left;
    textRef.current.style.top = top;
    textRef.current.style.width = width;
    textRef.current.style.height = height;

    // Use innerHTML to preserve icons if any
    textRef.current.innerHTML = element.innerHTML;
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
    item: GooeyNavItem
  ): void => {
    const target = e.currentTarget;
    const liEl = (target.closest('li') ?? target) as HTMLElement;
    const activeColor = liEl.getAttribute('data-color') || '#ffffff';

    // Always shoot particles on click, even if already active!
    if (filterRef.current) {
      makeParticles(filterRef.current, activeColor);
    }

    if (activeIndex === index) {
      if (item.onClick) item.onClick(e);
      return;
    }

    setActiveIndex(index);
    updateEffectPosition(liEl);

    if (item.onClick) {
      item.onClick(e);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
    item: GooeyNavItem
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e, index, item);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
      filterRef.current?.classList.add('active');
    }

    const container = containerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement | undefined;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(container);
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
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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
            /* filter: url(#gooey-nav-filter-${filterId}); disabled for debugging */
          }

          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--active-bg, #ffffff);
            z-index: -1;
            border-radius: 1rem; /* rounded-2xl */
            transition: background-color 0.5s ease;
          }

          .particle {
            position: absolute;
            width: 0;
            height: 0;
            z-index: 999;
          }

          .point {
            position: absolute;
            left: 0;
            top: 0;
            background: var(--color);
            border-radius: 50%;
            transform: translate(-50%, -50%);
          }

          @keyframes particle-fly {
            0% { transform: translate(0, 0); }
            100% { transform: translate(var(--end-x), var(--end-y)); }
          }

          @keyframes particle-scale {
            0% { transform: translate(-50%, -50%) scale(1); }
            100% { transform: translate(-50%, -50%) scale(0); }
          }

          li.active {
            color: transparent !important;
          }
        `}
      </style>

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={`gooey-nav-filter-${filterId}`} x="-100%" y="-100%" width="300%" height="300%">
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
                style={{ '--active-bg': item.activeColor || '#ffffff' } as React.CSSProperties}
                className={`rounded-2xl relative cursor-pointer transition-all duration-300 ease shadow-sm text-gray-800 dark:text-gray-100 hover:brightness-90 ${item.className || ''} ${
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
