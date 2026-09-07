import { useEffect, useRef } from 'react';

interface EmbersProps {
  density?: number;
  className?: string;
  warm?: boolean;
}

/** Rising ember / dust particles on a transparent canvas. */
export default function Embers({ density = 70, className = '', warm = false }: EmbersProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let running = true;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    interface P { x: number; y: number; r: number; vy: number; vx: number; life: number; maxLife: number; hue: number; }
    let parts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (initial: boolean): P => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 8,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.25 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.35,
      life: 0,
      maxLife: 240 + Math.random() * 320,
      hue: warm ? 18 + Math.random() * 22 : Math.random() * 22,
    });

    parts = Array.from({ length: density }, () => spawn(true));

    const io = new IntersectionObserver(
      (es) => {
        running = es[0]?.isIntersecting ?? true;
        if (running) loop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += 1;
        p.x += p.vx + Math.sin((p.life + i * 37) * 0.02) * 0.25;
        p.y -= p.vy;
        const fade = Math.sin(Math.min(1, p.life / p.maxLife) * Math.PI);
        const a = Math.max(0, fade) * 0.75;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 92%, ${warm ? 62 : 55}%, ${a})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 55%, ${a})`;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.y < -12 || p.life > p.maxLife) parts[i] = spawn(false);
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [density, warm]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
