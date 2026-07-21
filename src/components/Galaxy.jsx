import { useEffect } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000;
const ARMS = 3;
const ARM_SPREAD = 0.45;
const THICKNESS = 0.35;
const RADIUS = 5;

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 1/6) { r = c; g = x; b = 0; }
  else if (h < 2/6) { r = x; g = c; b = 0; }
  else if (h < 3/6) { r = 0; g = c; b = x; }
  else if (h < 4/6) { r = 0; g = x; b = c; }
  else if (h < 5/6) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return [r + m, g + m, b + m];
}

function generateGalaxyData() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const arm = Math.floor(Math.random() * ARMS);
    const armAngleOffset = (arm / ARMS) * Math.PI * 2;
    const radius = Math.random() ** 1.2 * RADIUS;
    const spinAngle = radius * 2.2;
    const randomAngleOffset = (Math.random() - 0.5) * ARM_SPREAD * (1 - radius / RADIUS * 0.5);

    const angle = spinAngle + armAngleOffset + randomAngleOffset;
    const scatter = (1 - radius / RADIUS) * 0.3 + 0.05;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * scatter;
    const z = Math.sin(angle) * radius + (Math.random() - 0.5) * scatter;
    const y = (Math.random() - 0.5) * THICKNESS * (1 - radius / RADIUS * 0.7);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const coreT = 1 - Math.min(radius / RADIUS, 1);
    const hue = 0.62 + coreT * 0.1 + (Math.random() - 0.5) * 0.04;
    const sat = 0.3 + coreT * 0.5 + (Math.random() - 0.5) * 0.1;
    const lum = 0.5 + coreT * 0.3 + Math.random() * 0.15;

    const [r, g, b] = hslToRgb(hue, sat, lum);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  return { positions, colors };
}

export default function Galaxy({ containerRef }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { positions, colors } = generateGalaxyData();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const galaxy = new THREE.Points(geo, mat);
    galaxy.position.x = 4.5;
    const scene = new THREE.Scene();
    scene.add(galaxy);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 2.5, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.zIndex = '0';
    container.appendChild(renderer.domElement);

    let raf;
    let currentRotation = 0;

    function getScrollProgress() {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      return Math.max(0, Math.min(1, scrolled / total));
    }

    function animate() {
      const progress = getScrollProgress();
      const targetRotation = progress * Math.PI * 1.2;
      currentRotation += (targetRotation - currentRotation) * 0.08;

      galaxy.rotation.y = currentRotation;
      galaxy.rotation.x = Math.sin(currentRotation * 0.15) * 0.08;

      const parallaxOffset = (progress - 0.5) * 0.6;
      camera.position.x = parallaxOffset * 0.3;
      camera.position.y = 2.5 - progress * 0.5;
      camera.lookAt(0, 0, 0);

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
      window.removeEventListener('resize', resize);
      container.removeChild(renderer.domElement);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, [containerRef]);

  return null;
}
