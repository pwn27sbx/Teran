import React, { useRef, useEffect, useState } from "react";

export interface BrushRevealProps {
  bgImage: string;
  revealImage: string;
  xrayImage?: string;
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
  xrayImage,
  brushSize = 80,
  revealScale = 1.0,
  bgScale = 0.9,
  bgObjectPosition = "center 20%",
  revealOffsetY = 0,
}: BrushRevealProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const xrayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const revealImgRef = useRef<HTMLImageElement | null>(null);
  const xrayImgRef = useRef<HTMLImageElement | null>(null);

  // Refs for animation and parallax
  const isVisibleRef = useRef<boolean>(true);
  const cachedRevFramingRef = useRef<Framing | null>(null);
  const cachedXrayFramingRef = useRef<Framing | null>(null);
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
  const numNodes = 12; // Reduced from 20 to 12 for 144fps performance optimization

  useEffect(() => {
    // If xrayImage is provided, we wait for 3 images instead of 2
    const totalToLoad = xrayImage ? 3 : 2;
    let loadedCount = 0;
    let isMounted = true;

    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === totalToLoad && isMounted) {
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

    if (xrayImage) {
      const xray = new Image();
      xray.src = xrayImage;
      xray.onload = () => {
        xrayImgRef.current = xray;
        checkLoaded();
      };
      xray.onerror = () => {
        checkLoaded();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [bgImage, revealImage, xrayImage]);

  useEffect(() => {
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.getContext("2d");

    // Persistent offscreen canvas for the fading mask
    const offCanvas = document.createElement("canvas");
    offCanvas.getContext("2d");
    offCanvasRef.current = offCanvas;

    const handleResize = () => {
      cachedRevFramingRef.current = null;
      cachedXrayFramingRef.current = null;
      const parent = containerRef.current;
      if (!parent || !canvas) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      if (xrayCanvasRef.current) {
        xrayCanvasRef.current.width = canvas.width;
        xrayCanvasRef.current.height = canvas.height;
      }

      if (
        currentPosRef.current.x === 0 &&
        currentPosRef.current.y === 0 &&
        canvas.width > 0
      ) {
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

    const ro = new ResizeObserver(() => {
      handleResize();
    });
    if (containerRef.current) {
      ro.observe(containerRef.current);
    }
    const io = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(renderLoop);
      }
    });
    if (containerRef.current) io.observe(containerRef.current);

    // Calculate custom framing
    const getCustomFraming = (
      img: HTMLImageElement,
      canvasW: number,
      canvasH: number,
      hPos: number,
      vPos: number,
      isReveal = false,
    ): Framing => {
      const canvasRatio = canvasW / canvasH;
      const imgRatio = img.width / img.height;
      let w = canvasW;
      let h = canvasH;
      let x = 0;
      let y = 0;

      if (imgRatio > canvasRatio) {
        w = canvasH * imgRatio;
        x = (canvasW - w) * hPos;
      } else {
        h = canvasW / imgRatio;
        y = (canvasH - h) * vPos;
      }

      if (isReveal) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        w *= revealScale;
        h *= revealScale;
        x = cx - w / 2;
        y = cy - h / 2;
        y += h * revealOffsetY;

        // Apply scaleFactor anchored to bgObjectPosition to match the CSS behavior!
        const globalScale = bgScale;
        const elemX = canvasW * hPos * (1 - globalScale);
        const elemY = canvasH * vPos * (1 - globalScale);

        w *= globalScale;
        h *= globalScale;
        x = elemX + x * globalScale;
        y = elemY + y * globalScale;
      }

      return { w, h, x, y };
    };

    const renderLoop = () => {
      if (!isVisibleRef.current) {
        rafRef.current = null;
        return;
      }

      const revImg = revealImgRef.current;
      const currentCanvas = canvasRef.current;
      const currentOffCanvas = offCanvasRef.current;
      if (!currentCanvas || !currentOffCanvas) return;

      const ctx = currentCanvas.getContext("2d");
      const offCtx = currentOffCanvas.getContext("2d");
      if (!ctx || !offCtx) return;

      if (!currentCanvas.width || !currentCanvas.height) {
        rafRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      let hPos = 0.5;
      let vPos = 0.2;
      if (bgObjectPosition) {
        const parts = bgObjectPosition.trim().split(/\s+/);
        const hPart = parts[0];
        const vPart = parts.length > 1 ? parts[1] : parts[0];

        if (hPart === "left") hPos = 0;
        else if (hPart === "right") hPos = 1;
        else if (hPart === "center") hPos = 0.5;
        else if (hPart.endsWith("%")) hPos = parseFloat(hPart) / 100;

        if (vPart === "top") vPos = 0;
        else if (vPart === "bottom") vPos = 1;
        else if (vPart === "center") vPos = 0.5;
        else if (vPart.endsWith("%")) vPos = parseFloat(vPart) / 100;
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
                Math.pow(currentPosRef.current.y - mousePosRef.current.y, 2),
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
        const isMobileWander = window.innerWidth < 768;
        const wanderChance = isMobileWander ? 0.04 : 0.015;
        
        if (Math.random() < wanderChance) {
          const cx = currentCanvas.width / 2;
          const cy = currentCanvas.height / 2;

          if (isMobileWander) {
            const padding = Math.max(currentCanvas.width, currentCanvas.height) * 1.0;
            const dxToTarget = autoTargetRef.current.x - currentPosRef.current.x;
            const dyToTarget = autoTargetRef.current.y - currentPosRef.current.y;
            const distToTarget = Math.sqrt(dxToTarget * dxToTarget + dyToTarget * dyToTarget);

            if (distToTarget < 200 || (autoTargetRef.current.x === cx && autoTargetRef.current.y === cy)) {
              // 0: horizontal, PI/4: diagonal down-right, PI/2: vertical down, 3PI/4: diagonal down-left
              const angles = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4];
              let angle = angles[Math.floor(Math.random() * angles.length)];
              if (Math.random() > 0.5) angle += Math.PI;

              const startX = cx - Math.cos(angle) * padding;
              const startY = cy - Math.sin(angle) * padding;

              currentPosRef.current = { x: startX, y: startY };
              targetPosRef.current = { x: startX, y: startY };
              if (nodesRef.current) {
                nodesRef.current.forEach((n) => {
                  n.x = startX;
                  n.y = startY;
                });
              }

              autoTargetRef.current = {
                x: cx + Math.cos(angle) * padding,
                y: cy + Math.sin(angle) * padding,
              };
            }
          } else {
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
            const finalDx =
              dx * Math.cos(angleOffset) - dy * Math.sin(angleOffset);
            const finalDy =
              dx * Math.sin(angleOffset) + dy * Math.cos(angleOffset);

            const padding =
              Math.max(currentCanvas.width, currentCanvas.height) * 1.0;
              
            autoTargetRef.current = {
              x: cx + finalDx * padding,
              y: cy + finalDy * padding,
            };
          }
        }
        targetPosRef.current.x +=
          (autoTargetRef.current.x - targetPosRef.current.x) * 0.03;
        targetPosRef.current.y +=
          (autoTargetRef.current.y - targetPosRef.current.y) * 0.03;
      }

      // Smooth interpolation for the brush position
      currentPosRef.current.x +=
        (targetPosRef.current.x - currentPosRef.current.x) * 0.15;
      currentPosRef.current.y +=
        (targetPosRef.current.y - currentPosRef.current.y) * 0.15;

      // Update Parallax Transforms
      // Use mousePosRef instead of currentPosRef so the background doesn't drift infinitely when the brush flies away
      let pX = mousePosRef.current.x / currentCanvas.width - 0.5;
      let pY = mousePosRef.current.y / currentCanvas.height - 0.5;

      // Clamp values just in case the mouse goes out of window
      pX = Math.max(-0.6, Math.min(0.6, pX));
      pY = Math.max(-0.6, Math.min(0.6, pY));

      // Reduce parallax intensity per user request
      const isMobile = window.innerWidth < 768;
      const additionalY = isMobile ? 350 : 0; // Push down on mobile

      const bgOffsetX = pX * -8;
      const bgOffsetY = pY * -8 + additionalY;
      const canvasOffsetX = pX * -15;
      const canvasOffsetY = pY * -15 + additionalY;

      // Compute final transforms
      const scaleFactor = bgScale;
      const parallaxScale = 1.05;
      const finalBgScale = scaleFactor * parallaxScale;

      const origin = bgObjectPosition || "center 10%";
      if (bgNodeRef.current) {
        bgNodeRef.current.style.transformOrigin = origin;
        bgNodeRef.current.style.transform = `translate(${bgOffsetX}px, ${bgOffsetY}px) scale(${finalBgScale})`;
      }

      const maskStyle = isMobile
        ? "linear-gradient(to bottom, black 50%, transparent 85%)"
        : "none";
      if (canvasRef.current) {
        canvasRef.current.style.transformOrigin = origin;
        canvasRef.current.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px) scale(${parallaxScale})`;
        canvasRef.current.style.webkitMaskImage = maskStyle;
        canvasRef.current.style.maskImage = maskStyle;
      }
      if (xrayCanvasRef.current) {
        xrayCanvasRef.current.style.transformOrigin = origin;
        xrayCanvasRef.current.style.transform = `translate(${canvasOffsetX}px, ${canvasOffsetY}px) scale(${parallaxScale})`;
        xrayCanvasRef.current.style.webkitMaskImage = maskStyle;
        xrayCanvasRef.current.style.maskImage = maskStyle;
      }

      const s = parallaxScale;
      const originX = currentCanvas.width * hPos;
      const originY = currentCanvas.height * vPos;

      const getCanvasCoords = (screenX: number, screenY: number): Point => {
        // Use the same clamped pX/pY logic for calculating offsets when drawing the brush
        let curPX = mousePosRef.current.x / currentCanvas.width - 0.5;
        let curPY = mousePosRef.current.y / currentCanvas.height - 0.5;
        curPX = Math.max(-0.6, Math.min(0.6, curPX));
        curPY = Math.max(-0.6, Math.min(0.6, curPY));

        // Reduce parallax intensity per user request, and apply the mobile shift
        const cOffX = curPX * -15;
        const cOffY = curPY * -15 + additionalY;

        return {
          x: (screenX - cOffX - originX) / s + originX,
          y: (screenY - cOffY - originY) / s + originY,
        };
      };

      // --- Kinematic Spring Chain Physics ---
      const head = getCanvasCoords(
        currentPosRef.current.x,
        currentPosRef.current.y,
      );

      if (!nodesRef.current) {
        nodesRef.current = Array.from({ length: numNodes }, () => ({
          ...head,
        }));
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
      offCtx.globalCompositeOperation = "source-over";

      // 2. Draw the continuous curved oil drop (Trapezoid & Circle Spline)
      const baseRadius = brushSize * 1.3; // Always full thickness when rendering

      if (baseRadius > 0.1) {
        offCtx.fillStyle = "black";

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
        ctx.globalCompositeOperation = "source-over";

        if (!cachedRevFramingRef.current) {
          cachedRevFramingRef.current = getCustomFraming(
            revImg,
            currentCanvas.width,
            currentCanvas.height,
            hPos,
            vPos,
            true,
          );
        }
        const { w, h, x, y } = cachedRevFramingRef.current;
        ctx.drawImage(revImg, x, y, w, h);

        // Apply the mask
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(currentOffCanvas, 0, 0);

        // Optimization: Feathering edges are incredibly heavy. We'll only calculate and draw them if x > 0 or y > 0
        if (x > 0 || y > 0 || x + w < currentCanvas.width) {
          ctx.globalCompositeOperation = "destination-out";
          const featherSize = 250;
          const overlap = 5;

          if (x > 0) {
            const gradLeft = ctx.createLinearGradient(
              x + overlap,
              0,
              x + featherSize,
              0,
            );
            gradLeft.addColorStop(0, "rgba(0,0,0,1)");
            gradLeft.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradLeft;
            ctx.fillRect(
              x - overlap,
              0,
              featherSize + overlap * 2,
              currentCanvas.height,
            );
          }

          if (x + w < currentCanvas.width) {
            const gradRight = ctx.createLinearGradient(
              x + w - overlap,
              0,
              x + w - featherSize,
              0,
            );
            gradRight.addColorStop(0, "rgba(0,0,0,1)");
            gradRight.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradRight;
            ctx.fillRect(
              x + w - featherSize - overlap,
              0,
              featherSize + overlap * 2,
              currentCanvas.height,
            );
          }

          if (y > 0) {
            const gradTop = ctx.createLinearGradient(
              0,
              y + overlap,
              0,
              y + featherSize,
            );
            gradTop.addColorStop(0, "rgba(0,0,0,1)");
            gradTop.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = gradTop;
            ctx.fillRect(
              0,
              y - overlap,
              currentCanvas.width,
              featherSize + overlap * 2,
            );
          }
        }
      }

      // 6. Draw X-Ray layer
      if (xrayImgRef.current && xrayCanvasRef.current) {
        const xctx = xrayCanvasRef.current.getContext("2d");
        if (xctx) {
          xctx.clearRect(
            0,
            0,
            xrayCanvasRef.current.width,
            xrayCanvasRef.current.height,
          );
          if (!cachedXrayFramingRef.current) {
            cachedXrayFramingRef.current = getCustomFraming(
              xrayImgRef.current,
              currentCanvas.width,
              currentCanvas.height,
              hPos,
              vPos,
              true,
            );
          }
          const { w, h, x, y } = cachedXrayFramingRef.current;

          // Draw the image with lower opacity
          xctx.globalAlpha = 0.3;
          xctx.drawImage(xrayImgRef.current, x, y, w, h);
          xctx.globalAlpha = 1.0;

          // Apply scanning mask
          xctx.globalCompositeOperation = "destination-in";

          // 2 seconds per cycle
          const time = performance.now() / 2000;
          const progress = time % 1;
          // band center goes from slightly above the image to slightly below
          const bandY = y - h * 0.2 + h * 1.4 * progress;
          const bandHeight = h * 0.3; // thickness of the scan line

          const grad = xctx.createLinearGradient(
            0,
            bandY - bandHeight / 2,
            0,
            bandY + bandHeight / 2,
          );
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(0.5, "rgba(0,0,0,1)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          xctx.fillStyle = grad;
          xctx.fillRect(
            0,
            0,
            xrayCanvasRef.current.width,
            xrayCanvasRef.current.height,
          );

          xctx.globalCompositeOperation = "source-over";
        }
      }

      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      isHoveringRef.current = true;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      isHoveringRef.current = false;
      autoTargetRef.current = { ...targetPosRef.current };
    };

    let touchTimer: ReturnType<typeof setTimeout> | null = null;
    let isWaitingForBrush = false;
    let isBrushActive = false;
    let touchStartPos = { x: 0, y: 0 };
    let lastTouchPos = { x: 0, y: 0 };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      touchStartPos = { x: touch.clientX, y: touch.clientY };
      lastTouchPos = { ...touchStartPos };
      
      isWaitingForBrush = true;
      isBrushActive = false;
      
      if (touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        if (isWaitingForBrush) {
          isBrushActive = true;
          isWaitingForBrush = false;
          isHoveringRef.current = true;
          
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();
            mousePosRef.current = {
              x: lastTouchPos.x - rect.left,
              y: lastTouchPos.y - rect.top,
            };
          }
        }
      }, 500); // Medio segundo para activar
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      
      lastTouchPos = { x: touch.clientX, y: touch.clientY };

      if (isWaitingForBrush) {
        // Si se mueve mucho antes del medio segundo, es scroll
        const dist = Math.hypot(touch.clientX - touchStartPos.x, touch.clientY - touchStartPos.y);
        if (dist > 15) {
          isWaitingForBrush = false;
          if (touchTimer) clearTimeout(touchTimer);
        }
      }

      if (isBrushActive) {
        // Si el brush está activo, prevenimos el scroll
        e.preventDefault();
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          mousePosRef.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
          };
          isHoveringRef.current = true;
        }
      }
    };

    const handleTouchEnd = () => {
      isWaitingForBrush = false;
      if (touchTimer) clearTimeout(touchTimer);
      
      if (isBrushActive) {
        isBrushActive = false;
        isHoveringRef.current = false;
        
        // Push the brush far off-screen seamlessly so it doesn't look stuck
        const container = containerRef.current;
        if (container) {
          const angle = Math.random() * Math.PI * 2;
          const padding = Math.max(container.clientWidth, container.clientHeight) * 1.5;
          autoTargetRef.current = {
            x: targetPosRef.current.x + Math.cos(angle) * padding,
            y: targetPosRef.current.y + Math.sin(angle) * padding
          };
        } else {
          autoTargetRef.current = { ...targetPosRef.current };
        }
      }
    };

    const handleContextMenu = (e: Event) => {
      // Evita que salga el menú contextual al dejar presionado (tanto en móvil como simuladores de PC)
      e.preventDefault();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("contextmenu", handleContextMenu);
    }
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      io.disconnect();
      ro.disconnect();
      if (container) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("contextmenu", handleContextMenu);
      }
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, brushSize, bgScale, revealScale, revealOffsetY, bgObjectPosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-transparent"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none"
      }}
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
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ willChange: "transform", objectPosition: bgObjectPosition }}
      />

      {/* Reveal Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none pointer-events-none"
        style={{ willChange: "transform" }}
      />

      {/* X-Ray Layer */}
      {xrayImage && (
        <canvas
          ref={xrayCanvasRef}
          className="absolute inset-0 w-full h-full touch-none pointer-events-none"
          style={{ willChange: "transform" }}
        />
      )}
    </div>
  );
}
