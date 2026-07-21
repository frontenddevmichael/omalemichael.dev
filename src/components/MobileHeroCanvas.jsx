import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 40;

export default function MobileHeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Visibility tracking ──
    let isVisible = true;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; if (isVisible) scheduleFrame(); },
      { threshold: 0.01 }
    );
    obs.observe(canvas);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.12 + 0.04),
      o: Math.random() * 0.35 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      time++;

      for (const p of particles) {
        p.x += p.vx + Math.sin(time * 0.005 + p.phase) * 0.04;
        p.y += p.vy;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const pulse = 0.6 + 0.4 * Math.sin(time * 0.01 + p.phase);
        const alpha = p.o * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.3})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function scheduleFrame() {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    }

    function tick() {
      raf = null;
      draw();
      if (isVisible) scheduleFrame();
    }

    draw();
    if (isVisible) scheduleFrame();

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
      aria-hidden="true"
    />
  );
}
