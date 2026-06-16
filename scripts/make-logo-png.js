/* Render the ChantaShop text logo to transparent PNGs (2 variants) */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const sharp = require('sharp');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT_DIR = path.join(os.homedir(), 'Desktop');
const TMP = os.tmpdir();

function logoHtml({ shopColor }) {
  // Mirrors src/components/layout/Logo.tsx exactly, scaled up for crisp export.
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,900;1,6..96,900&display=swap');
  html,body{margin:0;padding:0;background:transparent;}
  .wrap{display:inline-flex;align-items:baseline;padding:80px;
    font-family:'Bodoni Moda', serif;line-height:1;white-space:nowrap;}
  .chanta{font-size:200px;font-weight:900;color:#db2777;letter-spacing:-0.05em;}
  .shop{font-size:200px;font-weight:900;font-style:italic;color:${shopColor};
    letter-spacing:-0.05em;margin-left:-0.15em;}
  .ge{font-family:Arial, Helvetica, sans-serif;font-size:80px;font-weight:900;
    color:#db2777;margin-left:4px;}
</style></head>
<body><div class="wrap"><span class="chanta">Chanta</span><span class="shop">Shop</span><span class="ge">.ge</span></div></body></html>`;
}

async function render(name, shopColor) {
  const htmlPath = path.join(TMP, `logo-${name}.html`);
  const rawPng   = path.join(TMP, `logo-${name}-raw.png`);
  const outPng   = path.join(OUT_DIR, `chantashop-logo-${name}.png`);

  fs.writeFileSync(htmlPath, logoHtml({ shopColor }));

  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--default-background-color=00000000',
    '--window-size=2200,700',
    `--screenshot=${rawPng}`,
    `file:///${htmlPath.replace(/\\/g, '/')}`,
    '--virtual-time-budget=6000',
  ], { stdio: 'ignore' });

  // Trim transparent padding to a tight crop, then add small even margin.
  await sharp(rawPng)
    .trim()
    .extend({ top: 40, bottom: 40, left: 60, right: 60,
              background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(outPng);

  const { width, height } = await sharp(outPng).metadata();
  console.log(`✓ ${outPng}  (${width}x${height})`);
}

(async () => {
  // light variant = white "Shop" → for placing on DARK backgrounds
  await render('for-dark-bg', '#ffffff');
  // dark variant = black "Shop" → for placing on LIGHT backgrounds
  await render('for-light-bg', '#000000');
})();
