// ─── 7×7 letter definitions ─────────────────────────
const LETTERS = {
  M: [0,6, 7,8,12,13, 14,16,18,20, 21,24,27, 28,34, 35,41, 42,48],
  I: [3,10,17,24,31,38,45],
  C: [2,3,4, 9, 16, 23, 30, 37, 44,45,46],
  H: [0,6, 7,13, 14,20, 21,22,23,24,25,26,27, 28,34, 35,41, 42,48],
  A: [2,3,4, 9,11, 16,18, 21,22,23,24,25,26,27, 28,34, 35,41, 42,48],
  E: [2,3,4,5, 9, 16, 23,24,25, 30, 37, 44,45,46,47],
  L: [2, 9, 16, 23, 30, 37, 44,45,46,47],
};

function parseIndices(str) {
  return new Set(str.split(',').map(Number));
}

function makeFrame(letter) {
  const indices = LETTERS[letter];
  const f = Array.from({ length: 49 }, () => false);
  for (const i of indices) f[i] = true;
  return f;
}

function partialFrame(full, keepRatio) {
  const f = full.slice();
  for (let i = 0; i < f.length; i++) {
    if (f[i] && Math.random() < 1 - keepRatio) f[i] = false;
  }
  return f;
}

function breathingFrames(letter) {
  const full = makeFrame(letter);
  const g = [];
  // hold
  g.push(full.slice(), full.slice(), full.slice(), full.slice());
  g.push(partialFrame(full, 0.55));
  g.push(partialFrame(full, 0.45));
  g.push(partialFrame(full, 0.55));
  g.push(full.slice(), full.slice(), full.slice(), full.slice());
  g.push(partialFrame(full, 0.5));
  g.push(partialFrame(full, 0.4));
  g.push(partialFrame(full, 0.5));
  g.push(full.slice(), full.slice(), full.slice(), full.slice());
  return g;
}

// Loader: progressive row reveal of M
export const loaderGrids = (() => {
  const fullM = makeFrame('M');
  const g = [];
  // progressive row reveal
  for (let r = 1; r <= 7; r++) {
    const f = Array.from({ length: 49 }, () => false);
    for (let rr = 0; rr < r; rr++)
      for (const i of LETTERS.M)
        if (Math.floor(i / 7) <= rr) f[i] = true;
    // Only set dots up to row r
    g.push(f);
  }
  g.push(fullM.slice(), fullM.slice(), fullM.slice());
  return g;
})();

// Big decor: breathing grids per letter
export const michaelGrids = 'MICHAEL'.split('').map(letter => breathingFrames(letter));

export { LETTERS, makeFrame };
