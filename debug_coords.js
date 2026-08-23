const canvasW = 402; const canvasH = 874;
const canvasRatio = canvasW / canvasH;
const imgRatio = 2048 / 2048;

let w = canvasW, h = canvasH, x = 0, y = 0;
let hPos = 0.5, vPos = 0.1;

if (imgRatio > canvasRatio) {
  w = canvasH * imgRatio;
  x = (canvasW - w) * hPos;
} else {
  h = canvasW / imgRatio;
  y = (canvasH - h) * vPos;
}

const revealScale = 0.73;
const revealOffsetY = -0.35;
const bgScale = 1.5;

const cx = x + w / 2;
const cy = y + h / 2;
w *= revealScale; h *= revealScale;
x = cx - w / 2; y = cy - h / 2;
y += h * revealOffsetY;

const elemX = canvasW * hPos * (1 - bgScale);
const elemY = canvasH * vPos * (1 - bgScale);

w *= bgScale; h *= bgScale;
x = elemX + x * bgScale; y = elemY + y * bgScale;

console.log({x, y, w, h});
