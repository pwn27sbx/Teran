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
    const DROP_LIFESPAN = 250;

    const addDrop = (x, y, dx = 0, dy = 0) => {
      const speed = Math.sqrt(dx * dx + dy * dy);
      const moveAngle = Math.atan2(dy, dx);

      // Stable main oil drop that stretches with speed (no jitter)
      const squash = Math.max(0.4, 1.0 - (speed * 0.015)); 
      const rScale = 1.0 + (Math.min(speed, 50) * 0.005);
      
      const blobs = [{
        rScale,
        squash,
        angle: moveAngle,
        offsetX: 0,
        offsetY: 0
      }];

      drops.push({ 
        x, 
        y, 
        createdAt: Date.now(),
        blobs
      });
    };

    // Main animation loop
    const renderLoop = () => {
      const revImg = revealImgRef.current;
      const now = Date.now();
      
      if (!canvas.width || !canvas.height) {
         rafRef.current = requestAnimationFrame(renderLoop);
         return;
      }
      
      // -- UPDATE POSITIONS & PARALLAX --
      if (!isHoveringRef.current) {
        // Auto wander logic - fast, organic, edge to edge
        if (Math.random() < 0.03) {
          // Target extreme corners frequently to zip across
          let targetX = Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2;
          let targetY = Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2;
          
          // Occasionally aim for the center
          if (Math.random() < 0.3) {
             targetX = Math.random();
             targetY = Math.random();
          }

          autoTargetRef.current = {
            x: targetX * canvas.width,
            y: targetY * canvas.height
          };
        }
        
        // Move much faster (like a fast mouse)
        currentPosRef.current.x += (autoTargetRef.current.x - currentPosRef.current.x) * 0.08;
        currentPosRef.current.y += (autoTargetRef.current.y - currentPosRef.current.y) * 0.08;
      } else {
        currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.2;
        currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.2;
      }
      
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

      // Convert Screen Coordinates to Canvas Coordinates accounting for scale and translate
      const s = 1.05;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const getCanvasCoords = (screenX, screenY) => {
        return {
          x: (screenX - canvasOffsetX - cx) / s + cx,
          y: (screenY - canvasOffsetY - cy) / s + cy
        };
      };

      // Auto-add drops
      const dx = currentPosRef.current.x - (lastPosRef.current?.x || currentPosRef.current.x);
      const dy = currentPosRef.current.y - (lastPosRef.current?.y || currentPosRef.current.y);
      const dist = Math.sqrt(dx*dx + dy*dy);
      const spacing = brushSize * 0.1;
      
      if (dist > spacing) {
         const steps = Math.min(30, Math.floor(dist / spacing));
         for (let i = 1; i <= steps; i++) {
           const sX = (lastPosRef.current?.x || currentPosRef.current.x) + (dx * i) / steps;
           const sY = (lastPosRef.current?.y || currentPosRef.current.y) + (dy * i) / steps;
           const cPos = getCanvasCoords(sX, sY);
           addDrop(cPos.x, cPos.y, dx, dy);
         }
         lastPosRef.current = { x: currentPosRef.current.x, y: currentPosRef.current.y };
      } else {
         const cPos = getCanvasCoords(currentPosRef.current.x, currentPosRef.current.y);
         addDrop(cPos.x, cPos.y, dx, dy);
         lastPosRef.current = { x: currentPosRef.current.x, y: currentPosRef.current.y };
      }

      // Clean up old drops
      while (drops.length > 0 && now - drops[0].createdAt > DROP_LIFESPAN) {
        drops.shift();
      }

      // 1. Clear offscreen canvas
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      
      // 2. Draw all active drops (Positive Mask)
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.fillStyle = 'black';
      
      for (const drop of drops) {
        const life = (now - drop.createdAt) / DROP_LIFESPAN;
        const scale = 1 - Math.pow(life, 2); 
        const baseRadius = brushSize * scale;
        
        if (baseRadius > 0) {
          const size = baseRadius;
          
          const gradient = offCtx.createRadialGradient(
            drop.x, drop.y, size * 0.2, 
            drop.x, drop.y, size
          );
          gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          offCtx.fillStyle = gradient;
          offCtx.beginPath();
          offCtx.arc(drop.x, drop.y, size, 0, Math.PI * 2);
          offCtx.fill();
        }
      }

      // 3. Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Draw the drops onto main canvas
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(offCanvas, 0, 0);

      // 5. Draw reveal image masked by the solid drops
      if (revImg) {
        ctx.globalCompositeOperation = 'source-in';
        const { w, h, x, y } = getCustomFraming(revImg, canvas.width, canvas.height, true);
        ctx.drawImage(revImg, x, y, w, h);

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
      targetPosRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
      isHoveringRef.current = true;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      targetPosRef.current = { 
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
