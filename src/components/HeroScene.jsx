import { useEffect } from 'react';
import * as THREE from 'three';
import { REACT_PATH, FIGMA_PATH, GITHUB_PATH, SUPABASE_PATH, CLAUDE_PATH } from '../data/logoPaths';

const ICONS = [
  { name: 'React', path: REACT_PATH, viewBox: '0 0 512 512' },
  { name: 'Figma', path: FIGMA_PATH, viewBox: '0 0 384 512' },
  { name: 'GitHub', path: GITHUB_PATH, viewBox: '0 0 496 512' },
  { name: 'Supabase', path: SUPABASE_PATH, viewBox: '0 0 22 24' },
  { name: 'Claude', path: CLAUDE_PATH, viewBox: '0 0 30 36' },
];

function makeTexture(icon, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const [vbW, vbH] = icon.viewBox.split(' ').slice(2).map(Number);
  const scale = (size * 0.7) / Math.max(vbW, vbH);
  const ox = (size - vbW * scale) / 2;
  const oy = (size - vbH * scale) / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#ffffff';
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  try { ctx.fill(new Path2D(icon.path)); } catch (e) {}
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const SIZE = 256;

function getCorners(isMobile) {
  if (isMobile) return [
    { x: -1.1, y: 2.0, z: -1, s: 0.45 },
    { x: 1.1, y: 2.0, z: -0.5, s: 0.45 },
    { x: 0, y: -2.2, z: 0, s: 0.4 },
    { x: -1.2, y: -1.2, z: -1.5, s: 0.45 },
    { x: 1.2, y: -1.2, z: -1, s: 0.45 },
  ];
  return [
    { x: -3, y: 2, z: -1, s: 0.7 },
    { x: 3.2, y: 2.2, z: -0.5, s: 0.75 },
    { x: 0, y: -2.8, z: 0, s: 0.65 },
    { x: -3.2, y: -1.8, z: -1.5, s: 0.7 },
    { x: 3.5, y: -2, z: -1, s: 0.7 },
  ];
}

export default function HeroScene({ containerRef }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 600;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const CORNERS = getCorners(isMobile);
    const POUR_COUNT = isMobile ? 80 : 500;
    const dustCount = isMobile ? 20 : 60;

    const scene = new THREE.Scene();
    const aspect = container.clientHeight > 0 ? container.clientWidth / container.clientHeight : 1;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(isMobile ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '0';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(20, 20, 0xffffff, 0xffffff);
    grid.position.y = -3.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.08;
    scene.add(grid);

    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 16;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      dustPos[i * 3 + 2] = -2 - Math.random() * 4;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.3 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    const items = [];
    ICONS.forEach((icon, i) => {
      const c = CORNERS[i];
      const texture = makeTexture(icon, SIZE);
      const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.7, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(c.x, c.y, c.z);
      sprite.scale.set(c.s, c.s, 1);
      scene.add(sprite);
      items.push({
        sprite, mat,
        baseX: c.x, baseY: c.y, baseZ: c.z, scale: c.s,
        floatAmp: 0.1 + Math.random() * 0.15,
        floatSpeed: 0.25 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        driftAmp: 0.08 + Math.random() * 0.1,
        driftSpeed: 0.15 + Math.random() * 0.15,
        driftPhase: Math.random() * Math.PI * 2,
      });
    });

    const pPos = new Float32Array(POUR_COUNT * 3);
    const pVelY = new Float32Array(POUR_COUNT);
    const pLife = new Float32Array(POUR_COUNT);

    function initP(i, randAge) {
      pPos[i * 3] = (Math.random() - 0.5) * 1.8;
      pPos[i * 3 + 1] = 5.5 + (Math.random() - 0.5) * 1.2;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      pVelY[i] = -(2 + Math.random() * 1.5);
      pLife[i] = randAge ? Math.random() * 2.5 : 0;
    }

    for (let i = 0; i < POUR_COUNT; i++) initP(i, true);

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const pMesh = new THREE.Points(pGeo, pMat);
    scene.add(pMesh);

    let mouse = { x: 0, y: 0 };
    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    if (!isTouchDevice) {
      document.addEventListener('mousemove', onMouseMove);
    }

    function getScrollProgress() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      return Math.max(0, Math.min(1, (vh - rect.top) / total));
    }

    let prevTime = performance.now();
    let raf;
    let isVisible = true;
    const visObs = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }, { threshold: 0 });
    visObs.observe(container);

    function animate() {
      if (!isVisible) { raf = requestAnimationFrame(animate); return; }
      const now = performance.now();
      const delta = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      const time = now * 0.001;
      const scrollProgress = getScrollProgress();
      const fadeStart = 0.6;
      const scrollFade = scrollProgress < fadeStart ? 1 : Math.max(0, 1 - (scrollProgress - fadeStart) / 0.4);

      const parallaxLogo = (scrollProgress - 0.3) * 0.6;
      const parallaxGrid = (scrollProgress - 0.3) * 0.8;
      const parallaxDust = (scrollProgress - 0.3) * 0.15;

      const vFov = camera.fov * Math.PI / 180;
      const vHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const vWidth = vHeight * camera.aspect;
      const mwx = mouse.x * vWidth / 2;
      const mwy = mouse.y * vHeight / 2;

      const glowCycle = time * 0.12;
      const glowIndex = Math.floor(glowCycle) % items.length;
      const glowPhase = glowCycle - Math.floor(glowCycle);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const floatY = Math.sin(time * item.floatSpeed + item.phase) * item.floatAmp;
        const driftX = Math.sin(time * item.driftSpeed + item.driftPhase) * item.driftAmp;
        const cursorX = mouse.x * 0.08;
        const cursorY = mouse.y * 0.08;
        item.sprite.position.x = item.baseX + driftX + cursorX;
        item.sprite.position.y = item.baseY + floatY + cursorY + parallaxLogo;

        const dx = item.baseX - mwx;
        const dy = item.baseY - mwy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hoverBoost = Math.max(0, 1 - dist / 2.5) * 0.25;

        const isGlowing = i === glowIndex;
        const glowFactor = isGlowing ? Math.sin(glowPhase * Math.PI) : 0;

        item.mat.opacity = Math.min(1, (0.7 + hoverBoost + glowFactor * 0.25) * scrollFade);
      }

      // Pour particles — skip per-frame update on touch (low priority visual)
      if (!isTouchDevice) {
        const pourFlow = mouse.x * 0.3;

        for (let i = 0; i < POUR_COUNT; i++) {
          pLife[i] += delta;
          if (pLife[i] > 2.5) { initP(i, false); continue; }
          const progress = pLife[i] / 2.5;
          pVelY[i] -= 4 * delta;
          pPos[i * 3] += (pourFlow * 2 + (Math.random() - 0.5) * (0.5 + progress * 4)) * delta;
          pPos[i * 3 + 1] += pVelY[i] * delta;
          if (pPos[i * 3 + 1] < -4.5) { initP(i, false); }
        }
        pGeo.attributes.position.needsUpdate = true;

        pMat.size = 0.09 + Math.sin(time * 0.5) * 0.015;
        pMat.opacity = 0.75 * scrollFade;
      }

      dustMat.opacity = 0.3 * scrollFade;
      grid.position.y = -3.5 + parallaxGrid;
      grid.rotation.x = 0.05 + Math.sin(time * 0.02) * 0.01;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      visObs.disconnect();
      window.removeEventListener('resize', resize);
      if (!isTouchDevice) document.removeEventListener('mousemove', onMouseMove);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [containerRef]);

  return null;
}
