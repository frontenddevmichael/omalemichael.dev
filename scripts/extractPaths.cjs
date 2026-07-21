const fs = require('fs');
const fa = fs.readFileSync('C:/Users/Admin/Documents/okiki/michael-portfolio/node_modules/react-icons/fa/index.js','utf8');
const si = fs.readFileSync('C:/Users/Admin/Documents/okiki/michael-portfolio/node_modules/react-icons/si/index.js','utf8');

function extractPath(code, name) {
  const idx = code.indexOf('module.exports.' + name + ' = function');
  if (idx === -1) return null;
  const marker = '"child":[{"tag":"path","attr":{"d":"';
  const section = code.substring(idx, idx + 6000);
  const mIdx = section.indexOf(marker);
  if (mIdx === -1) return null;
  const pathStart = mIdx + marker.length;
  const pathEnd = section.indexOf('"', pathStart);
  return section.substring(pathStart, pathEnd);
}

const items = [
  ['react', fa, 'FaReact'],
  ['github', fa, 'FaGithub'],
  ['figma', fa, 'FaFigma'],
  ['supabase', si, 'SiSupabase'],
  ['claude', si, 'SiClaude'],
];

let out = '';
for (const [key, src, name] of items) {
  const path = extractPath(src, name);
  if (!path) {
    console.log(key + ': FAILED');
    continue;
  }
  out += `export const ${key.toUpperCase()}_PATH = ${JSON.stringify(path)};\n`;
  console.log(key + ': ' + path.substring(0, 60) + '... (' + path.length + ' chars)');
}

const target = 'C:/Users/Admin/Documents/okiki/michael-portfolio/src/data/logoPaths.js';
fs.writeFileSync(target, out);
console.log('Wrote ' + target);
