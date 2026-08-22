import React, { useRef, useEffect, useState } from 'react';

export interface BrushRevealProps {
  bgImage: string;
  revealImage: string;
  brushSize?: number;
  revealScale?: number;
  bgScale?: number;
  bgObjectPosition?: string;
  revealOffsetY?: number;
}

interface Point {
  x: number;
  y: number;
}

interface Framing {
  w: number;
  h: number;
  x: number;
  y: number;
}

export default function BrushReveal({
  bgImage,
  revealImage,
  brushSize = 80,
  revealScale = 1.0,
  bgScale = 0.90,
  bgObjectPosition = 'center 20%',
  revealOffsetY = 0,
}: BrushRevealProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);

  // Refs for animation and parallax
  const bgNodeRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const offCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isHoveringRef = useRef<boolean>(false);
  const currentPosRef = useRef<Point>({ x: 0, y: 0 });
  const targetPosRef = useRef<Point>({ x: 0, y: 0 });
  const autoTargetRef = useRef<Point>({ x: 0, y: 0 });
  const mousePosRef = useRef<Point>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<Point>({ x: 0, y: 0 });
  const exitVelocityRef = useRef<Point | null>(null); // Tracks the escape velocity when stopped
  const idleTimerRef = useRef<number>(0); // Tracks how long the mouse has been still
  const momentumRef = useRef<Point>({ x: 0, y: 0 });
  const nodesRef = useRef<Point[] | null>(null);
  const numNodes = 20; // Number of segments for a smooth curve

  useEffect(() => {
    let loadedCount = 0;
    let isMounted = true;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2 && isMounted) {
        setImagesLoaded(true);
      }
    };

    const bg = new Image();
    bg.src = bgImage;
    bg.onload = () => {
      bgImgRef.current = bg;
      checkLoaded();
    };
    bg.onerror = () => {
      checkLoaded();
    };

    const rev = new Image();
    rev.src = revealImage;
    rev.onload = () => {
      revealImgRef.current = rev;
      checkLoaded();
    };
    rev.onerror = () => {
      checkLoaded();
    };

    return () => {
      isMounted = false;
    };
  }, [bgImage, revealImage]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.getContext('2d', { willReadFrequently: true });

    // Persistent offscreen canvas for the fading mask
    const offCanvas = document.createElement('canvas');
    offCanvas.getContext('2d', { willReadFrequently: true });
    offCanvasRef.current = offCanvas;

    const handleResize = () => {
      const parent = containerRef.current;
      if (!parent || !canvas) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;

      if (currentPosRef.current.x === 0 && currentPosRef.current.y === 0 && canvas.width > 0) {
        currentPosRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
        autoTargetRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
        mousePosRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
        if (nodesRef.current) {
          nodesRef.current.forEach((n) => {
            n.x = canvas.width / 2;
            n.y = canvas.height / 2;
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Calculate dimensions to match CSS object-cover with a 20% top offset
    const getCustomFraming = (
      img: HTMLImageElement,
      canvasW: number,
      canvasH: number,
      isReveal = false
    ): Framing => {
      const canvasRatio = canvasW / canvasH;
      const imgRatio = img.width / img.height;
      let w = canvasW;
      let h = canvasH;
      let x = 0;
      let y = 0;

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

        // Apply scaleFactor anchored to bottom center to match the CSS behavior!
        const globalScale = bgScale;
        const elemX = (canvasW * (1 - globalScale)) / 2;
        const elemY = canvasH * (1 - globalScale);

        w *= globalScale;
        h *= globalScale;
        x = elemX + x * globalScale;
        y = elemY + y * globalScale;
      }

      return { w, h, x, y };
    };

    const renderLoop = () => {
      const revImg = revealImgRef.current;
      const currentCanvas = canvasRef.current;
      const currentOffCanvas = offCanvasRef.current;
      if (!currentCanvas || !currentOffCanvas) return;

      const ctx = currentCanvas.getContext('2d');
      const offCtx = currentOffCanvas.getContext('2d');
      if (!ctx || !offCtx) return;

      if (!currentCanvas.width || !currentCanvas.height) {
        rafRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      // Core Mouse Physics and Momentum
      if (isHoveringRef.current) {
        const mouseDx = mousePosRef.current.x - lastMousePosRef.current.x;
        const mouseDy = mousePosRef.current.y - lastMousePosRef.current.y;
        const mouseSpeed = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        lastMousePosRef.current = { ...mousePosRef.current };

        if (mouseSpeed > 1.0) {
          // Actively moving
          momentumRef.current.x = momentumRef.current.x * 0.8 + mouseDx * 0.2;
          momentumRef.current.y = momentumRef.current.y * 0.8 + mouseDy * 0.2;
          targetPosRef.current.x = mousePosRef.current.x;
          targetPosRef.current.y = mousePosRef.current.y;

          idleTimerRef.current = 0;

          if (exitVelocityRef.current) {
            // We were exiting. If the brush is far away, snap it back to the mouse so it doesn't whip across the screen
            // Changed to 800 to prevent false-positive teleporting during very fast mouse sweeps!
            const dist = Math.sqrt(
              Math.pow(currentPosRef.current.x - mousePosRef.current.x, 2) +
                Math.pow(currentPosRef.current.y - mousePosRef.current.y, 2)
            );
            if (dist > 800) {
              currentPosRef.current = { ...mousePosRef.current };
              if (nodesRef.current) {
                nodesRef.current.forEach((n) => {
                  n.x = mousePosRef.current.x;
                  n.y = mousePosRef.current.y;
                });
              }
            }
            exitVelocityRef.current = null;
          }
        } else {
          idleTimerRef.current += 1;

          if (idleTimerRef.current > 5) {
            // Stopped moving for a moment! Fly off the screen!
            if (!exitVelocityRef.current) {
              let mx = momentumRef.current.x;
              let my = momentumRef.current.y;
              let mSpeed = Math.sqrt(mx * mx + my * my);

              if (mSpeed < 1.0) {
                // If they clicked without moving, pick a random direction
                const angle = Math.random() * Math.PI * 2;
                mx = Math.cos(angle);
                my = Math.sin(angle);
                mSpeed = 1.0;
              }

              // Set high exit velocity in the direction of last movement
              exitVelocityRef.current = {
                x: (mx / mSpeed) * 35,
                y: (my / mSpeed) * 35,
              };
            }

            // Keep pushing the target off screen
            if (exitVelocityRef.current) {
              targetPosRef.current.x += exitVelocityRef.current.x;
              targetPosRef.current.y += exitVelocityRef.current.y;
            }
          } else {
            // Stopped for just a few frames (maybe changing direction). Let it coast slightly.
            targetPosRef.current.x += momentumRef.current.x;
            targetPosRef.current.y += momentumRef.current.y;
            momentumRef.current.x *= 0.8;
            momentumRef.current.y *= 0.8;
          }
        }
      } else {
        // Auto-wander logic when completely not hovering (mouse off window)
        // Pick a new target occasionally to sweep across the screen
        if (Math.random() < 0.015) {
          const cx = currentCanvas.width / 2;
          const cy = currentCanvas.height / 2;

          let dx = cx - currentPosRef.current.x;
          let dy = cy - currentPosRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < 100) {
            const angle = Math.random() * Math.PI * 2;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
          } else {
            dx /= dist;
            dy /= dist;
          }

          const angleOffset = (Math.random() - 0.5) * Math.PI * 0.8; // +/- 72 degrees
          const finalDx = dx * Math.cos(angleOffset) - dy * Math.sin(angleOffset);
          const finalDy = dx * Math.sin(angleOffset) + dy * Math.cos(angleOffset);

          const padding = Math.max(currentCanvas.width, currentCanvas.height) * 1.0;
          autoTargetRef.current = {
            x: cx + finalDx * padding,
            y: cy + finalDy * padding,
          };
        }
        targetPosRef.current.x += (autoTargetRef.current.x - targetPosRef.current.x) * 0.03;
        targetPosRef.current.y += (autoTargetRef.current.y - targetPosRef.current.y) * 0.03;
      }

      // Smooth interpolation for the brush position
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.15;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.15;

      // Update Parallax Transforms
      // Use mousePosRef instead of currentPosRef so the background doesn't drift infinitely when the brush flies away
      let pX = mousePosRef.current.x / currentCanvas.width - 0.5;
      let pY = mousePosRef.current.y / currentCanvas.height - 0.5;

      // Clamp values just in case the mouse goes out of window
      pX = Math.max(-0.6, Math.min(0.6, pX));
      pY = Math.max(-0.6, Math.min(0.6, pY));

      // Reduce parallax intensity per user request
      const bgOffsetX = pX * -8;
      const bgOffsetY = pY * -8;
      const canvasOffsetX = pX * -15;
      const canvasOffsetY = pY * -15;

      // Compute final transforms adding the +15 buffer
      const scaleFactor = bgScale;
      const parallaxScale = 1.05;
      const finalBgScale = scaleFactor * parallaxScale;

      if (bgNodeRef.current) {
        bgNodeRef.current.style.transformOrigin = 'bottom center';
        // Add +15px downward buffer to hide the bottom cut line below the screen edge
        bgNodeRef.current.style.transform = `translate(${bgOffsetX}px, ${bgOffsetY + 15}px) scale(${finalBgScale})`;
      }
      if (canvasRef.current) {
        canvasRef.current.style.transformOrigin = 'bottom center';
        // Add +15px downward buffer to match the background image
        canvasRef.current.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY + 15}px) scale(${parallaxScale})`;
      }

      const s = parallaxScale;
      const originX = currentCanvas.width / 2;
      const originY = currentCanvas.height; // Anchor to bottom

      const getCanvasCoords = (screenX: number, screenY: number): Point => {
        // Use the same clamped pX/pY logic for calculating offsets when drawing the brush
        let curPX = mousePosRef.current.x / currentCanvas.width - 0.5;
        let curPY = mousePosRef.current.y / currentCanvas.height - 0.5;
        curPX = Math.max(-0.6, Math.min(0.6, curPX));
        curPY = Math.max(-0.6, Math.min(0.6, curPY));

        // Reduce parallax intensity per user request
        const cOffX = curPX * -15;
        const cOffY = curPY * -15;

        return {
          x: (screenX - cOffX - originX) / s + originX,
          y: (screenY - cOffY - 15 - originY) / s + originY,
        };
      };

      // --- Kinematic Spring Chain Physics ---
      const head = getCanvasCoords(currentPosRef.current.x, currentPosRef.current.y);

      if (!nodesRef.current) {
        nodesRef.current = Array.from({ length: numNodes }, () => ({ ...head }));
      }

      const nodes = nodesRef.current;
      nodes[0] = { ...head };

      // Active state: Nodes follow each other smoothly (creates the curve)
      for (let i = 1; i < numNodes; i++) {
        const dx = nodes[i - 1].x - nodes[i].x;
        const dy = nodes[i - 1].y - nodes[i].y;
        nodes[i].x += dx * 0.35; // Stiffness of the liquid
        nodes[i].y += dy * 0.35;
      }

      // 1. Clear offscreen canvas
      offCtx.clearRect(0, 0, currentOffCanvas.width, currentOffCanvas.height);
      offCtx.globalCompositeOperation = 'source-over';

      // 2. Draw the continuous curved oil drop (Trapezoid & Circle Spline)
      const baseRadius = brushSize * 1.3; // Always full thickness when rendering

      if (baseRadius > 0.1) {
        offCtx.fillStyle = 'black';

        // Calculate Aerodynamic Squash based on head velocity
        const dxHead = nodes[0].x - nodes[1].x;
        const dyHead = nodes[0].y - nodes[1].y;
        const headSpeed = Math.sqrt(dxHead * dxHead + dyHead * dyHead);

        // Global tension factor (squash only, stretch is handled by the spring physics separating the nodes!)
        const globalSquash = Math.max(0.8, 1.0 - headSpeed / 60.0); // Aún menos aplastamiento

        for (let i = 0; i < numNodes - 1; i++) {
          const p1 = nodes[i];
          const p2 = nodes[i + 1];

          // Scale radius down linearly from head to tail
          const r1 = baseRadius * (1 - (i / numNodes) * 0.95);
          const r2 = baseRadius * (1 - ((i + 1) / numNodes) * 0.95);

          if (r1 < 0.1) continue;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;

          // Apply squash factor to get the actual radius for this frame
          const r1Squashed = r1 * globalSquash;
          const r2Squashed = r2 * globalSquash;

          // Stamp a circle at p1
          offCtx.beginPath();
          offCtx.arc(p1.x, p1.y, r1Squashed, 0, Math.PI * 2);
          offCtx.fill();

          // Draw connecting trapezoid
          if (dx * dx + dy * dy > 0.5) {
            const localAngle = Math.atan2(dy, dx);
            const cos = Math.cos(localAngle - Math.PI / 2);
            const sin = Math.sin(localAngle - Math.PI / 2);

            offCtx.beginPath();
            offCtx.moveTo(p1.x + r1Squashed * cos, p1.y + r1Squashed * sin);
            offCtx.lineTo(p1.x - r1Squashed * cos, p1.y - r1Squashed * sin);
            offCtx.lineTo(p2.x - r2Squashed * cos, p2.y - r2Squashed * sin);
            offCtx.lineTo(p2.x + r2Squashed * cos, p2.y + r2Squashed * sin);
            offCtx.closePath();
            offCtx.fill();
          }
        }

        // Cap the tail
        const lastP = nodes[numNodes - 1];
        const lastR = baseRadius * 0.05 * globalSquash;
        if (lastR > 0.1) {
          offCtx.beginPath();
          offCtx.arc(lastP.x, lastP.y, lastR, 0, Math.PI * 2);
          offCtx.fill();
        }
      }

      // 4. Clear main canvas
      ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

      // 5. Draw reveal image masked by the melted fluid shape
      if (revImg) {
        ctx.globalCompositeOperation = 'source-over';

        const { w, h, x, y } = getCustomFraming(
          revImg,
          currentCanvas.width,
          currentCanvas.height,
          true
        );
        ctx.drawImage(revImg, x, y, w, h);

        // Apply the mask
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(currentOffCanvas, 0, 0);

        // Feathering edges to eliminate artifacts
        ctx.globalCompositeOperation = 'destination-out';
        const featherSize = 250;
        const overlap = 5;

        if (x > 0) {
          const gradLeft = ctx.createLinearGradient(x + overlap, 0, x + featherSize, 0);
          gradLeft.addColorStop(0, 'rgba(0,0,0,1)');
          gradLeft.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradLeft;
          ctx.fillRect(x - overlap, 0, featherSize + overlap * 2, currentCanvas.height);
        }

        if (x + w < currentCanvas.width) {
          const gradRight = ctx.createLinearGradient(
            x + w - overlap,
            0,
            x + w - featherSize,
            0
          );
          gradRight.addColorStop(0, 'rgba(0,0,0,1)');
          gradRight.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradRight;
          ctx.fillRect(
            x + w - featherSize - overlap,
            0,
            featherSize + overlap * 2,
            currentCanvas.height
          );
        }

        if (y > 0) {
          const gradTop = ctx.createLinearGradient(0, y + overlap, 0, y + featherSize);
          gradTop.addColorStop(0, 'rgba(0,0,0,1)');
          gradTop.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradTop;
          ctx.fillRect(0, y - overlap, currentCanvas.width, featherSize + overlap * 2);
        }
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    const handlePointerMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isHoveringRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const container = containerRef.current;
      if (!touch || !container) return;
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      isHoveringRef.current = true;
    };

    const handlePointerLeave = () => {
      isHoveringRef.current = false;
      autoTargetRef.current = { ...targetPosRef.current };
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerleave', handlePointerLeave);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handlePointerLeave);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handlePointerLeave);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, brushSize, bgScale, revealScale, revealOffsetY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white dark:bg-gray-900 cursor-crosshair"
    >
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#f8f9fa] text-[#0277ab] font-serif text-xl tracking-widest">
          Cargando magia...
        </div>
      )}

      {/* Base Layer */}
      <img
        ref={bgNodeRef}
        src={bgImage}
        alt="Base"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ willChange: 'transform', objectPosition: bgObjectPosition }}
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

