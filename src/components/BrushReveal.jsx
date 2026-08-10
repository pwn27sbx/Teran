import React, { useRef, useEffect, useState } from 'react';

export default function BrushReveal({ 
  bgImage, 
  revealImage, 
  brushSize = 80,
  revealScale = 1.0,
  revealOffsetY = 0 
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const bgImgRef = useRef(null);
  const revealImgRef = useRef(null);
  
  // Refs for animation and parallax
  const bgNodeRef = useRef(null);
  const lastPosRef = useRef(null);
  const rafRef = useRef(null);
  const offCanvasRef = useRef(null);
  
  const isHoveringRef = useRef(false);
  const currentPosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const autoTargetRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const idleTimerRef = useRef(0);
  const lastAngleRef = useRef(0);
  const momentumRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let loadedCount = 0;
    
    const bg = new Image();
    bg.src = bgImage;
    bg.onload = () => { bgImgRef.current = bg; loadedCount++; if (loadedCount === 2) setImagesLoaded(true); };

    const rev = new Image();
    rev.src = revealImage;
    rev.onload = () => { 
      revealImgRef.current = rev; 
      loadedCount++; 
      if (loadedCount === 2) setImagesLoaded(true); 
    };
  }, [bgImage, revealImage]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Persistent offscreen canvas for the fading mask
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    offCanvasRef.current = offCanvas;

    const handleResize = () => {
      const parent = containerRef.current;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      
      if (currentPosRef.current.x === 0 && currentPosRef.current.y === 0 && canvas.width > 0) {
         currentPosRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
         autoTargetRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
         mousePosRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Calculate dimensions to match CSS object-cover with a 20% top offset
    const getCustomFraming = (img, canvasW, canvasH, isReveal = false) => {
      const canvasRatio = canvasW / canvasH;
      const imgRatio = img.width / img.height;
      let w = canvasW, h = canvasH, x = 0, y = 0;
      
      if (imgRatio > canvasRatio) {
        w = canvasH * imgRatio;
        x = (canvasW - w) / 2;
      } else {
        h = canvasW / imgRatio;
        y = (canvasH - h) * 0.2;
      }

      if (isReveal) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        w *= revealScale;
        h *= revealScale;
        x = cx - w / 2;
        y = cy - h / 2;
        y += h * revealOffsetY;
      }

      return { w, h, x, y };
    };

    const drops = [];
    const DROP_LIFESPAN = 400; // Shorter trail to make the paw pop out

    const addDrop = (x, y, angle) => {
      // Vary the size of the trail slightly for wavy edges, 
      // but KEEP IT UNDER 1.0 so the main head (size 1.0) always fully covers the front!
      const sizeMod = 0.75 + Math.random() * 0.2; // 0.75 to 0.95

      // Generate satellite drops (splatters) at a perfect middle ground
      const satellites = [];
      if (Math.random() < 0.45) { // Middle ground chance
        const numSats = 1 + Math.floor(Math.random() * 2); // 1 to 2 splatters
        for (let i = 0; i < numSats; i++) {
          satellites.push({
            ox: (Math.random() - 0.5) * brushSize * 1.9, // Balanced spread
            oy: (Math.random() - 0.5) * brushSize * 1.9,
            sz: 0.07 + Math.random() * 0.13 // Balanced size (up to 20%)
          });
        }
      }

      drops.push({ 
        x, // No positional offsets to prevent the "caterpillar" look
        y, 
        sizeMod,
        satellites,
        angle, 
        createdAt: Date.now() 
      });
    };

    let lastRenderedPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const renderLoop = () => {
      const revImg = revealImgRef.current;
      const canvas = canvasRef.current;
      const offCanvas = offCanvasRef.current;
      if (!canvas || !offCanvas) return;
      const ctx = canvas.getContext('2d');
      const offCtx = offCanvas.getContext('2d');
      
      if (!canvas.width || !canvas.height) {
         rafRef.current = requestAnimationFrame(renderLoop);
         return;
      }
      
      const now = Date.now();

      // Core Mouse Physics and Momentum
      if (isHoveringRef.current) {
        const mouseDx = mousePosRef.current.x - lastMousePosRef.current.x;
        const mouseDy = mousePosRef.current.y - lastMousePosRef.current.y;
        const mouseSpeed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        
        lastMousePosRef.current = { ...mousePosRef.current };
        
        // Filter out micro-jitter
        if (mouseSpeed > 0.5) {
           idleTimerRef.current = 0;
           momentumRef.current.x = momentumRef.current.x * 0.6 + mouseDx * 0.4;
           momentumRef.current.y = momentumRef.current.y * 0.6 + mouseDy * 0.4;
           targetPosRef.current.x = mousePosRef.current.x;
           targetPosRef.current.y = mousePosRef.current.y;
        } else {
           idleTimerRef.current += 1;
           // If stopped, apply drift and let the stroke dry up progressively
           if (idleTimerRef.current > 2) {
              targetPosRef.current.x += momentumRef.current.x;
              targetPosRef.current.y += momentumRef.current.y;
              momentumRef.current.x *= 0.90; // Drift friction
              momentumRef.current.y *= 0.90;
           }
        }
      } else {
        // Auto-wander logic when not hovering
        if (Math.random() < 0.03) {
          let targetX = Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2;
          let targetY = Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2;
          if (Math.random() < 0.3) {
             targetX = Math.random();
             targetY = Math.random();
          }
          autoTargetRef.current = {
            x: targetX * canvas.width,
            y: targetY * canvas.height
          };
        }
        targetPosRef.current.x += (autoTargetRef.current.x - targetPosRef.current.x) * 0.05;
        targetPosRef.current.y += (autoTargetRef.current.y - targetPosRef.current.y) * 0.05;
      }
      
      // Smooth interpolation for the brush position
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.15;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.15;

      // Calculate velocity for stretching/rotation
      const dx = currentPosRef.current.x - lastRenderedPos.x;
      const dy = currentPosRef.current.y - lastRenderedPos.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 1.0) {
        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - lastAngleRef.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        lastAngleRef.current += diff * 0.15;
      }
      const moveAngle = lastAngleRef.current;
      
      lastRenderedPos = { ...currentPosRef.current };
      
      // Update Parallax Transforms
      const pX = (currentPosRef.current.x / canvas.width) - 0.5;
      const pY = (currentPosRef.current.y / canvas.height) - 0.5;
      
      const bgOffsetX = pX * -30;
      const bgOffsetY = pY * -30;
      const canvasOffsetX = pX * -60;
      const canvasOffsetY = pY * -60;
      
      if (bgNodeRef.current) {
        bgNodeRef.current.style.transform = `translate(${bgOffsetX}px, ${bgOffsetY}px) scale(1.05)`;
      }
      if (canvasRef.current) {
        canvasRef.current.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px) scale(1.05)`;
      }

      const s = 1.05;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const getCanvasCoords = (screenX, screenY) => {
        return {
          x: (screenX - canvasOffsetX - cx) / s + cx,
          y: (screenY - canvasOffsetY - cy) / s + cy
        };
      };

      const cPos = getCanvasCoords(currentPosRef.current.x, currentPosRef.current.y);

      // Auto-add drops for the trail
      const ddx = currentPosRef.current.x - (lastPosRef.current?.x || currentPosRef.current.x);
      const ddy = currentPosRef.current.y - (lastPosRef.current?.y || currentPosRef.current.y);
      const dist = Math.sqrt(ddx*ddx + ddy*ddy);
      const spacing = brushSize * 0.05; // Extremely tight spacing for a perfectly smooth core
      
      if (dist > spacing) {
         const steps = Math.min(30, Math.floor(dist / spacing));
         for (let i = 1; i <= steps; i++) {
           const sX = (lastPosRef.current?.x || currentPosRef.current.x) + (ddx * i) / steps;
           const sY = (lastPosRef.current?.y || currentPosRef.current.y) + (ddy * i) / steps;
           const trailCPos = getCanvasCoords(sX, sY);
           addDrop(trailCPos.x, trailCPos.y, moveAngle);
         }
         lastPosRef.current = { x: currentPosRef.current.x, y: currentPosRef.current.y };
      } else if (!lastPosRef.current) {
         lastPosRef.current = { x: currentPosRef.current.x, y: currentPosRef.current.y };
      }

      // Clean up old drops
      while (drops.length > 0 && now - drops[0].createdAt > DROP_LIFESPAN) {
        drops.shift();
      }

      // 1. Clear offscreen canvas
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.fillStyle = 'black';
      
      const drawGota = (ctx, x, y, size) => {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      };
      
      // 2. Draw trail drops (Organic oily continuous stroke)
      for (const drop of drops) {
        const life = Math.max(0, (now - drop.createdAt) / DROP_LIFESPAN);
        const scale = 1 - Math.pow(life, 2); 
        const size = brushSize * scale * drop.sizeMod; 
        
        if (size > 0.5) {
          offCtx.beginPath();
          offCtx.ellipse(drop.x, drop.y, size * 1.15, size * 0.85, drop.angle, 0, Math.PI * 2);
          offCtx.fill();
          
          // Draw satellite splatters
          for (const sat of drop.satellites) {
            const satSize = brushSize * scale * sat.sz;
            if (satSize > 0.5) {
              offCtx.beginPath();
              offCtx.arc(drop.x + sat.ox, drop.y + sat.oy, satSize, 0, Math.PI * 2);
              offCtx.fill();
            }
          }
        }
      }

      // 3. Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Draw reveal image masked by the solid ellipse
      if (revImg) {
        ctx.globalCompositeOperation = 'source-over';
        const { w, h, x, y } = getCustomFraming(revImg, canvas.width, canvas.height, true);
        ctx.drawImage(revImg, x, y, w, h);

        // Apply the mask
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(offCanvas, 0, 0);

        // Feathering edges to eliminate artifacts
        ctx.globalCompositeOperation = 'destination-out';
        const featherSize = 250; 
        const overlap = 5;
        
        if (x > 0) {
          const gradLeft = ctx.createLinearGradient(x + overlap, 0, x + featherSize, 0);
          gradLeft.addColorStop(0, 'rgba(0,0,0,1)');
          gradLeft.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradLeft;
          ctx.fillRect(x - overlap, 0, featherSize + overlap * 2, canvas.height);
        }
        
        if (x + w < canvas.width) {
          const gradRight = ctx.createLinearGradient(x + w - overlap, 0, x + w - featherSize, 0);
          gradRight.addColorStop(0, 'rgba(0,0,0,1)');
          gradRight.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradRight;
          ctx.fillRect(x + w - featherSize - overlap, 0, featherSize + overlap * 2, canvas.height);
        }
        
        if (y > 0) {
          const gradTop = ctx.createLinearGradient(0, y + overlap, 0, y + featherSize);
          gradTop.addColorStop(0, 'rgba(0,0,0,1)');
          gradTop.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradTop;
          ctx.fillRect(0, y - overlap, canvas.width, featherSize + overlap * 2);
        }
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };
    rafRef.current = requestAnimationFrame(renderLoop);

    const handlePointerMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
      isHoveringRef.current = true;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      mousePosRef.current = { 
        x: touch.clientX - rect.left, 
        y: touch.clientY - rect.top 
      };
      isHoveringRef.current = true;
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
      autoTargetRef.current = { ...targetPosRef.current };
    };

    const container = containerRef.current;
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, brushSize]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-white cursor-crosshair">
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900 text-white font-serif text-xl tracking-widest">
          Cargando magia...
        </div>
      )}
      
      {/* Base Layer */}
      <img 
        ref={bgNodeRef}
        src={bgImage} 
        alt="Base" 
        className="absolute inset-0 w-full h-full object-cover object-[center_20%] pointer-events-none"
        style={{ willChange: 'transform' }}
      />
      
      {/* Reveal Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full touch-none pointer-events-none"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
