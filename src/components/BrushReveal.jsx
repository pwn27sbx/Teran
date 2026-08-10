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
  const globalFadeRef = useRef(1.0); // Track global opacity/scale for fade out
  const momentumRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef(null);
  const numNodes = 20; // Number of segments for a smooth curve

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
         if (nodesRef.current) {
             nodesRef.current.forEach(n => {
                 n.x = canvas.width / 2;
                 n.y = canvas.height / 2;
             });
         }
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

        if (mouseSpeed > 0.1) {
           momentumRef.current.x = momentumRef.current.x * 0.6 + mouseDx * 0.4;
           momentumRef.current.y = momentumRef.current.y * 0.6 + mouseDy * 0.4;
           targetPosRef.current.x = mousePosRef.current.x;
           targetPosRef.current.y = mousePosRef.current.y;
        } else {
           targetPosRef.current.x += momentumRef.current.x;
           targetPosRef.current.y += momentumRef.current.y;
           momentumRef.current.x *= 0.90;
           momentumRef.current.y *= 0.90;
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

      // Centralized Idle Timer Logic based on distance to target!
      const distToTarget = Math.sqrt(Math.pow(targetPosRef.current.x - currentPosRef.current.x, 2) + Math.pow(targetPosRef.current.y - currentPosRef.current.y, 2));
      
      if (distToTarget > 1.0) {
         idleTimerRef.current = 0;
         globalFadeRef.current = 1.0; // Stay fully visible while moving
      } else {
         idleTimerRef.current += 1;
         if (idleTimerRef.current > 3) {
            globalFadeRef.current = Math.max(0, globalFadeRef.current - 0.15); // Shrink very fast when stopped
         }
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

      const s = 1.05;
      const centerScreenX = canvas.width / 2;
      const centerScreenY = canvas.height / 2;

      const getCanvasCoords = (screenX, screenY) => {
        return {
          x: (screenX - canvasOffsetX - centerScreenX) / s + centerScreenX,
          y: (screenY - canvasOffsetY - centerScreenY) / s + centerScreenY
        };
      };

      // --- Kinematic Spring Chain Physics ---
      const head = getCanvasCoords(currentPosRef.current.x, currentPosRef.current.y);
      
      if (!nodesRef.current) {
          nodesRef.current = Array(numNodes).fill().map(() => ({ ...head }));
      }
      
      nodesRef.current[0] = { ...head };

      if (idleTimerRef.current <= 3) {
          // Active state: Nodes follow each other smoothly (creates the curve)
          for (let i = 1; i < numNodes; i++) {
              let dx = nodesRef.current[i-1].x - nodesRef.current[i].x;
              let dy = nodesRef.current[i-1].y - nodesRef.current[i].y;
              nodesRef.current[i].x += dx * 0.35; // Stiffness of the liquid
              nodesRef.current[i].y += dy * 0.35;
          }
      } else {
          // Idle state: Snap back & Delay effect!
          for (let i = 1; i < numNodes; i++) {
              let dx = nodesRef.current[i-1].x - nodesRef.current[i].x;
              let dy = nodesRef.current[i-1].y - nodesRef.current[i].y;
              nodesRef.current[i].x += dx * 0.70; // Violently snap to head (oil retracting)
              nodesRef.current[i].y += dy * 0.70;
          }
          
          if (idleTimerRef.current > 20) { 
             globalFadeRef.current = Math.max(0, globalFadeRef.current - 0.10);
          }
      }

      // 1. Clear offscreen canvas
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.globalCompositeOperation = 'source-over';

      // 2. Draw the continuous curved oil drop (Trapezoid & Circle Spline)
      const baseRadius = brushSize * 1.0 * globalFadeRef.current; 

      if (baseRadius > 0.1) {
         offCtx.fillStyle = 'black';
         
         for (let i = 0; i < numNodes - 1; i++) {
             const p1 = nodesRef.current[i];
             const p2 = nodesRef.current[i+1];
             
             // Scale radius down linearly from head to tail (100% to 5%)
             const r1 = baseRadius * (1 - (i / numNodes) * 0.95);
             const r2 = baseRadius * (1 - ((i+1) / numNodes) * 0.95);
             
             if (r1 < 0.1) continue;

             // Stamp a circle at p1
             offCtx.beginPath();
             offCtx.arc(p1.x, p1.y, r1, 0, Math.PI * 2);
             offCtx.fill();
             
             const dx = p2.x - p1.x;
             const dy = p2.y - p1.y;
             
             // Draw connecting trapezoid if points are far enough apart
             if (dx*dx + dy*dy > 0.5) {
                 const angle = Math.atan2(dy, dx);
                 const cos = Math.cos(angle - Math.PI/2);
                 const sin = Math.sin(angle - Math.PI/2);
                 
                 offCtx.beginPath();
                 offCtx.moveTo(p1.x + r1 * cos, p1.y + r1 * sin);
                 offCtx.lineTo(p1.x - r1 * cos, p1.y - r1 * sin);
                 offCtx.lineTo(p2.x - r2 * cos, p2.y - r2 * sin);
                 offCtx.lineTo(p2.x + r2 * cos, p2.y + r2 * sin);
                 offCtx.closePath();
                 offCtx.fill();
             }
         }
         
         // Cap the tail with a final tiny circle
         const lastP = nodesRef.current[numNodes - 1];
         const lastR = baseRadius * 0.05;
         if (lastR > 0.1) {
             offCtx.beginPath();
             offCtx.arc(lastP.x, lastP.y, lastR, 0, Math.PI * 2);
             offCtx.fill();
         }
      }

      // 4. Clear main canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 5. Draw reveal image masked by the melted fluid shape
      if (revImg && globalFadeRef.current > 0) {
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
