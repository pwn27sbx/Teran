function getCustomFraming(imgW, imgH, canvasW, canvasH, isReveal, bgObjectPosition, revealScale, bgScale, revealOffsetY) {
  const canvasRatio = canvasW / canvasH;
  const imgRatio = imgW / imgH;
  let w = canvasW;
  let h = canvasH;
  let x = 0;
  let y = 0;

  let hPos = 0.5;
  let vPos = 0.2;
  if (bgObjectPosition) {
    const parts = bgObjectPosition.trim().split(/\s+/);
    const hPart = parts[0];
    const vPart = parts.length > 1 ? parts[1] : parts[0];
    
    if (hPart === 'left') hPos = 0;
    else if (hPart === 'right') hPos = 1;
    else if (hPart === 'center') hPos = 0.5;
    else if (hPart.endsWith('%')) hPos = parseFloat(hPart) / 100;
    
    if (vPart === 'top') vPos = 0;
    else if (vPart === 'bottom') vPos = 1;
    else if (vPart === 'center') vPos = 0.5;
    else if (vPart.endsWith('%')) vPos = parseFloat(vPart) / 100;
  }

  if (imgRatio > canvasRatio) {
    w = canvasH * imgRatio;
    x = (canvasW - w) * hPos;
  } else {
    h = canvasW / imgRatio;
    y = (canvasH - h) * vPos;
  }

  const base = { w, h, x, y };

  if (isReveal) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    w *= revealScale;
    h *= revealScale;
    x = cx - w / 2;
    y = cy - h / 2;
    y += h * revealOffsetY;

    const globalScale = bgScale;
    const elemX = (canvasW * (1 - globalScale)) / 2;
    const elemY = canvasH * (1 - globalScale);

    w *= globalScale;
    h *= globalScale;
    x = elemX + x * globalScale;
    y = elemY + y * globalScale;
  }

  return { base, reveal: { w, h, x, y } };
}

console.log("MOBILE:", getCustomFraming(2048, 2048, 402, 874, true, "center 10%", 0.73, 0.9, -0.35));
console.log("DESKTOP:", getCustomFraming(2048, 2048, 1920, 1080, true, "center 10%", 0.73, 0.9, -0.35));
