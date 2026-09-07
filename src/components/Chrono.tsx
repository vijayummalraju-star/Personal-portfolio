import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useApi, useReducedMotion } from '../hooks';
import type { JourneyYear } from '../types';
import Reveal from './Reveal';

const MIN = -58;
const MAX = 58;

function angleFor(i: number, n: number) {
  if (n <= 1) return 0;
  return MIN + ((MAX - MIN) * i) / (n - 1);
}

export default function Chrono() {
  const { data, loading, error } = useApi<JourneyYear>('/api/journey');
  const [active, setActive] = useState(0);
  const touched = useRef(false);
  const reduced = useReducedMotion();
  const years = data ?? [];

  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(0, years.length - 1)));
  }, [years.length]);

  useEffect(() => {
    if (reduced || years.length < 2) return;
    const id = window.setInterval(() => {
      if (!touched.current) setActive((a) => (a + 1) % years.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduced, years.length]);

  const current = years[active];
  const n = Math.max(years.length, 1);

  return (
    <section id="journey" className="chrono" aria-labelledby="chronoTitle">
      <div className="chrono__head">
        <Reveal>
          <p className="scene-over scene-over--warm">Scene 03</p>
          <h2 className="chrono__title" id="chronoTitle">
            <span>A</span> <span>Journey</span> <span>Through</span> <span>Time</span>
          </h2>
          <p className="chrono__rail-words" aria-hidden="true">
            <i />
            <span>Ideas</span>
            <span>Experiences</span>
            <span>People</span>
            <span>Projects</span>
            <span>Me</span>
            <i />
          </p>
        </Reveal>
      </div>

      <div className="chrono__body">
        <p className="c-note c-note--bl" aria-hidden="true">
          Same<br />curiosity<br />a brighter<br />tomorrow
        </p>
        <p className="c-note c-note--br" aria-hidden="true">
          Still<br />designing<br />what&rsquo;s<br />next
        </p>

        <div className="clock" aria-hidden="true">
          <svg viewBox="0 0 400 230">
            <path d="M 20 210 A 185 185 0 0 1 380 210" className="clock__arc" />
            {Array.from({ length: 13 }).map((_, i) => {
              const a = (Math.PI * i) / 12;
              const x1 = 200 - Math.cos(a) * 168;
              const y1 = 210 - Math.sin(a) * 168;
              const x2 = 200 - Math.cos(a) * 182;
              const y2 = 210 - Math.sin(a) * 182;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="clock__tick" />;
            })}
            <g className="clock__hand" style={{ transform: `rotate(${angleFor(active, n)}deg)` }}>
              <line x1="200" y1="210" x2="200" y2="52" className="clock__beam" />
              <line x1="200" y1="210" x2="200" y2="70" className="clock__core" />
            </g>
            <circle cx="200" cy="210" r="11" className="clock__pivot" />
            <circle cx="200" cy="210" r="4" className="clock__pin" />
          </svg>
        </div>

        <div className="chrono__rail" role="tablist" aria-label="Years" onPointerDown={() => { touched.current = true; }}>
          {loading && (
            <div className="chrono__status" role="status">
              <Loader2 className="spin" size={20} />
              <span>Travelling through time…</span>
            </div>
          )}
          {error && !loading && (
            <div className="chrono__status" role="alert">
              <span>The time machine stalled — {error}</span>
            </div>
          )}
          {years.map((y, i) => {
            const isActive = i === active;
            return (
              <button
                key={y.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`year-node ${isActive ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
                style={{ left: `${8 + (i / Math.max(n - 1, 1)) * 84}%` }}
                onMouseEnter={() => { touched.current = true; setActive(i); }}
                onFocus={() => { touched.current = true; setActive(i); }}
                onClick={() => { touched.current = true; setActive(i); }}
              >
                <span className="year-node__dot" />
                <span className="year-node__year">{y.year}</span>
              </button>
            );
          })}
          <div className="chrono__beam" style={{ left: `${8 + (active / Math.max(n - 1, 1)) * 84}%` }} aria-hidden="true" />
        </div>

        <div className="chrono__deck">
          {years.map((y, i) => (
            <button
              key={y.id}
              type="button"
              className={`year-card ${i === active ? 'is-active' : ''} ${i < active ? 'is-past' : ''}`}
              onClick={() => { touched.current = true; setActive(i); }}
              aria-pressed={i === active}
            >
              <span className="year-card__year">{y.year}</span>
              <span className="year-card__title">{y.title}</span>
              <span className="year-card__lines">
                {y.details.split('\n').map((ln, k) => (
                  <span key={k}>{ln}</span>
                ))}
              </span>
              {i === active && <ArrowUpRight size={16} className="year-card__go" />}
            </button>
          ))}
        </div>

        {current && (
          <p className="chrono__hint" aria-live="polite">
            {current.year} — {current.title}
          </p>
        )}
      </div>

      <div className="chrono__floor" aria-hidden="true" />
    </section>
  );
}
