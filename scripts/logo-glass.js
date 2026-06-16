/* Composite the white logo onto a soft translucent "glass" pill for video overlay */
const sharp = require('sharp');
const os = require('os');
const path = require('path');

const DESK = path.join(os.homedir(), 'Desktop');
const SRC  = path.join(DESK, 'chantashop-logo-for-dark-bg.png'); // white "Shop", transparent
const OUT  = path.join(DESK, 'chantashop-logo-glass.png');

(async () => {
  // 1. Tight-trim the white logo
  const logoBuf = await sharp(SRC).trim().png().toBuffer();
  const { width: lw, height: lh } = await sharp(logoBuf).metadata();

  // 2. Panel geometry
  const padX = 160, padY = 120;
  const panelW = lw + padX * 2;
  const panelH = lh + padY * 2;
  const radius = Math.round(panelH / 2);      // full pill
  const margin = 90;                          // room for blur bleed
  const canvasW = panelW + margin * 2;
  const canvasH = panelH + margin * 2;

  // 3. Translucent rounded panel (dark glass)
  const panelSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${panelW}" height="${panelH}">
       <rect x="0" y="0" width="${panelW}" height="${panelH}"
             rx="${radius}" ry="${radius}"
             fill="#0a0a0a" fill-opacity="0.85"/>
     </svg>`
  );

  // 4. Place panel on transparent canvas, then blur for soft frosted edges
  const softPanel = await sharp({
      create: { width: canvasW, height: canvasH, channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
    .composite([{ input: panelSvg, left: margin, top: margin }])
    .blur(22)
    .png()
    .toBuffer();

  // 5. Composite the sharp logo centered on the soft panel
  await sharp(softPanel)
    .composite([{ input: logoBuf, gravity: 'center' }])
    .png()
    .toFile(OUT);

  const m = await sharp(OUT).metadata();
  console.log(`âœ“ ${OUT}  (${m.width}x${m.height})`);
})();
