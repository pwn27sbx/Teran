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
  const brushImgRef = useRef(null);
  const lastPosRef = useRef(null);
  const rafRef = useRef(null);
  const offCanvasRef = useRef(null);

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
        // Shift up slightly to cut off the bottom legs (like the red line requested)
        y = (canvasH - h) * 0.2;
      }

      if (isReveal) {
        // Apply custom scale from center
        const cx = x + w / 2;
        const cy = y + h / 2;
        w *= revealScale;
        h *= revealScale;
        x = cx - w / 2;
        y = cy - h / 2;

        // Apply custom vertical shift
        y += h * revealOffsetY;
      }

      return { w, h, x, y };
    };

    // Array to hold our water drops
    const drops = [];
    const DROP_LIFESPAN = 250; // milliseconds before it vanishes completely

    const addDrop = (x, y) => {
      drops.push({ x, y, createdAt: Date.now() });
    };

    // Main animation loop
    const renderLoop = () => {
      const revImg = revealImgRef.current;
      const now = Date.now();
      
      // Clean up old drops
      while (drops.length > 0 && now - drops[0].createdAt > DROP_LIFESPAN) {
        drops.shift();
      }

      // 1. Clear offscreen canvas
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      
      // 2. Draw all active drops as solid shrinking circles
      offCtx.globalCompositeOperation = 'source-over';
      offCtx.fillStyle = 'black';
      
      for (const drop of drops) {
        const life = (now - drop.createdAt) / DROP_LIFESPAN; // 0.0 to 1.0
        // Easing function for smooth shrinking
        const scale = 1 - Math.pow(life, 2); 
        const currentRadius = brushSize * scale;
        
        if (currentRadius > 0) {
          offCtx.beginPath();
          offCtx.arc(drop.x, drop.y, currentRadius, 0, Math.PI * 2);
          offCtx.fill();
        }
      }

      // 3. Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Draw the drops onto main canvas
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(offCanvas, 0, 0);

      // 5. Draw reveal image masked by the solid drops (100% opacity)
      if (revImg) {
        ctx.globalCompositeOperation = 'source-in';
        const { w, h, x, y } = getCustomFraming(revImg, canvas.width, canvas.height, true);
        ctx.drawImage(revImg, x, y, w, h);

        // Feathering edges to completely eliminate hard cut-offs when scaled down
        ctx.globalCompositeOperation = 'destination-out';
        const featherSize = 250; 
        const overlap = 5; // Erase slightly outside the boundary to kill 1px artifacts
        
        // Left edge feathering
        if (x > 0) {
          const gradLeft = ctx.createLinearGradient(x + overlap, 0, x + featherSize, 0);
          gradLeft.addColorStop(0, 'rgba(0,0,0,1)');
          gradLeft.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradLeft;
          ctx.fillRect(x - overlap, 0, featherSize + overlap * 2, canvas.height);
        }
        
        // Right edge feathering
        if (x + w < canvas.width) {
          const gradRight = ctx.createLinearGradient(x + w - overlap, 0, x + w - featherSize, 0);
          gradRight.addColorStop(0, 'rgba(0,0,0,1)');
          gradRight.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradRight;
          ctx.fillRect(x + w - featherSize - overlap, 0, featherSize + overlap * 2, canvas.height);
        }
        
        // Top edge feathering
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
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (lastPosRef.current) {
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const spacing = brushSize * 0.1; 
        if (dist > spacing) {
          const steps = Math.min(30, Math.floor(dist / spacing));
          for (let i = 1; i <= steps; i++) {
            addDrop(lastPosRef.current.x + (dx * i) / steps, lastPosRef.current.y + (dy * i) / steps);
          }
        } else {
          addDrop(x, y);
        }
      } else {
        addDrop(x, y);
      }
      lastPosRef.current = { x, y };
    };

    const handlePointerLeave = () => {
      lastPosRef.current = null;
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      handlePointerMove({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: ()=>{} });
    }, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
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
      
      {/* Milo - Base Layer */}
      <img 
        src={bgImage} 
        alt="Base" 
        className="absolute inset-0 w-full h-full object-cover object-[center_20%] pointer-events-none"
      />
      
      {/* Atreus - Reveal Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full touch-none"
      />
    </div>
  );
}
