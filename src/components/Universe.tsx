import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Loader2 } from 'lucide-react';
import { useApi } from '../hooks';
import type { Tool } from '../types';
import Embers from './Embers';
import Reveal from './Reveal';

const SLOTS: Array<{ x: number; y: number; z: number; s: number }> = [
  { x: 8, y: 34, z: 60, s: 1.12 },
  { x: 27, y: 6, z: 10, s: 1.3 },
  { x: 33, y: 36, z: 40, s: 0.95 },
  { x: 19, y: 52, z: 90, s: 0.8 },
  { x: 12, y: 66, z: 70, s: 0.85 },
  { x: 39, y: 62, z: 80, s: 0.8 },
  { x: 60, y: 62, z: 80, s: 0.8 },
  { x: 72, y: 72, z: 110, s: 0.72 },
  { x: 76, y: 44, z: 60, s: 0.85 },
  { x: 72, y: 8, z: 20, s: 1.25 },
  { x: 60, y: 40, z: 50, s: 0.9 },
  { x: 86, y: 30, z: 40, s: 0.9 },
];

export default function Universe() {
  const { data, loading, error } = useApi<Tool>('/api/tools');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<number | null>(null);
  const tiltTarget = useRef({ x: 0, y: 0 });

  /* Inertia-smoothed pointer parallax: ease toward the target each frame
     so the universe glides instead of snapping to the cursor. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tick = () => {
      const dx = tiltTarget.current.x - cur.x;
      const dy = tiltTarget.current.y - cur.y;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        cur.x += dx * 0.09;
        cur.y += dy * 0.09;
        setTilt({
          x: Math.round(cur.x * 1000) / 1000,
          y: Math.round(cur.y * 1000) / 1000,
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    tiltTarget.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    };
  };

  const tools = data ?? [];

  return (
    <section id="universe" className="universe" aria-labelledby="uniTitle" onMouseMove={onMove}>
      <Embers density={50} warm className="universe__embers" />

      <Reveal className="universe__head">
        <p className="scene-over">Scene 02</p>
        <h2 className="scene-name" id="uniTitle">
          The Creative
          <br />
          Universe
        </h2>
        <p className="scene-sub">Tools · Ideas · People · Impact</p>
      </Reveal>

      <div className="universe__body">
        <p className="u-cap u-cap--l" aria-hidden="true">
          Ideas<br />Design<br />Build<br />Repeat
        </p>
        <p className="u-cap u-cap--r" aria-hidden="true">
          Better<br />Interfaces<br />A Brighter<br />Tomorrow
        </p>

        <div className="uni-stage" style={{ transform: `rotateY(${tilt.x * 5}deg) rotateX(${-tilt.y * 3.5}deg)` }}>
          <svg className="uni-ribbon" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="50" cy="30" rx="42" ry="20" />
            <ellipse cx="50" cy="30" rx="30" ry="13" className="rb2" />
          </svg>

          <div className="uni-figure" aria-hidden="true">
            <img src="/uploads/vijay.png" alt="" draggable={false} />
          </div>

          {loading && (
            <div className="uni-loading" role="status">
              <Loader2 className="spin" size={22} />
              <span>Summoning the universe…</span>
            </div>
          )}
          {error && !loading && (
            <div className="uni-loading" role="alert">
              <span>The universe flickered — {error}</span>
            </div>
          )}

          {tools.map((t, i) => {
            const s = SLOTS[i % SLOTS.length];
            const isHot = hovered === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`tool-card ${isHot ? 'is-hot' : ''}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, ['--d' as string]: `${i * 0.35}s` } as CSSProperties}
                onMouseEnter={() => setHovered(t.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(t.id)}
                onBlur={() => setHovered(null)}
                aria-label={`${t.name} — ${t.tagline}`}
              >
                <span className="tool-card__short" style={{ color: t.color }}>
                  {t.short}
                </span>
                <span className="tool-card__name">{t.name}</span>
                <span className="tool-card__tip">{t.tagline}</span>
              </button>
            );
          })}
        </div>

        <p className="u-cap u-cap--bl" aria-hidden="true">
          Product<br />Designer
        </p>
        <p className="u-cap u-cap--br" aria-hidden="true">
          Tools<br />Ideas<br />People<br />Impact
        </p>
      </div>

      <div className="universe__floor" aria-hidden="true" />
    </section>
  );
}
