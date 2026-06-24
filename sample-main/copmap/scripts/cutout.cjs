/* Flood-fill background remover: removes only the white background that is
   connected to the image border, preserving light/white subject interiors
   (e.g. the white patrol car). Outputs transparent PNGs to public/cut/. */
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'cut');
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  ['public/police_officer.png', 'officer'],
  ['public/images/police_drone.png', 'drone'],
  ['public/images/police_suv.png', 'suv'],
  ['public/patrol_car.png', 'car'],
  ['public/images/smart_camera.png', 'camera'],
  ['public/images/police_smartwatch.png', 'watch'],
  ['public/images/cyber_badge.png', 'badge'],
  ['public/police_map.png', 'map'],
];

// a pixel counts as "background" only if near-pure-white & near-neutral
function isBg(d, i) {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mn >= 226 && (mx - mn) <= 16;
}

(async () => {
  for (const [rel, name] of jobs) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) { console.log('skip (missing)', rel); continue; }
    const img = await Jimp.read(src);
    const { data, width: w, height: h } = img.bitmap;
    const N = w * h;
    const bg = new Uint8Array(N); // 1 = background
    const stack = [];
    const push = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return; const p = y * w + x; if (!bg[p] && isBg(data, p * 4)) { bg[p] = 1; stack.push(p); } };
    // seed every border pixel
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    // flood fill (4-connected)
    while (stack.length) { const p = stack.pop(); const x = p % w, y = (p / w) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
    // apply alpha + 1px feather to kill the light fringe
    let cut = 0;
    for (let p = 0; p < N; p++) {
      if (bg[p]) { data[p * 4 + 3] = 0; cut++; continue; }
      const x = p % w, y = (p / w) | 0;
      const edge = (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (y > 0 && bg[p - w]) || (y < h - 1 && bg[p + w]);
      if (edge) {
        const i = p * 4, lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (lum > 232) data[i + 3] = 0;             // trim bright halo
        else if (lum > 205) data[i + 3] = 150;       // soften remaining fringe
      }
    }
    await img.writeAsync(path.join(OUT, name + '.png'));
    console.log(`${name.padEnd(9)} ${w}x${h}  bg=${Math.round((cut / N) * 100)}%`);
  }
  console.log('done ->', OUT);
})();
