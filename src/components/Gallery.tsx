import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Loader2, X } from 'lucide-react';
import { useApi } from '../hooks';
import type { Project } from '../types';
import Reveal from './Reveal';

const pad = (v: number) => String(v + 1).padStart(2, '0');
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Gallery() {
  const { data, loading, error } = useApi<Project>('/api/projects');
  const wrapRef = useRef<HTMLDivElement>(null);
  const [prog, setProg] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const projects = data ?? [];
  const count = projects.length;
  const activeIdx = count ? Math.round(prog * (count - 1)) : 0;
  const openProject = projects.find((p) => p.id === openId) ?? null;

  /* Buttery scroll: measure on scroll (rAF-throttled), then ease the
     displayed progress toward the target every frame — no steppy jumps. */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = { v: 0 };
    let current = 0;
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      if (total <= 0) return;
      target.v = clamp(-r.top / total, 0, 1);
      if (reduced) {
        current = target.v;
        setProg(current);
      }
    };
    const requestMeasure = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };
    const tick = () => {
      if (!reduced) {
        const diff = target.v - current;
        if (Math.abs(diff) > 0.0004) {
          current += diff * 0.14;
          setProg(Math.round(current * 10000) / 10000);
        } else if (current !== target.v) {
          current = target.v;
          setProg(current);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    measure();
    current = target.v;
    setProg(current);
    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const jumpTo = (i: number) => {
    const el = wrapRef.current;
    if (!el || count < 2) return;
    const top = el.offsetTop;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (count - 1)) * total, behavior: 'smooth' });
  };

  return (
    <section id="work" className="gallery" aria-labelledby="galleryTitle">
      <div ref={wrapRef} className="gallery__track">
        <div className="gallery__pin">
          <div className="gallery__vignette" aria-hidden="true" />

          <Reveal className="gallery__head">
            <p className="g-label g-label--projects" id="galleryTitle">Projects</p>
            <p className="g-label g-label--ideas" aria-hidden="true">
              Ideas<br />Interfaces<br />Experiences<br /><b>Real Impact</b>
            </p>
            <p className="g-label g-label--scroll" aria-hidden="true">
              Scroll<br />Explore<br />Interact
            </p>
          </Reveal>

          <div className="g-count" aria-hidden="true">
            <span>{count ? pad(activeIdx) : '--'}</span>
            <small>/ {count ? pad(count - 1) : '--'}</small>
          </div>

          <div className="g-stage">
            {loading && (
              <div className="g-status" role="status">
                <Loader2 className="spin" size={22} />
                <span>Opening the vault…</span>
              </div>
            )}
            {error && !loading && (
              <div className="g-status" role="alert">
                <span>The vault jammed — {error}</span>
              </div>
            )}
            {projects.map((p, i) => {
              const off = i - prog * (count - 1);
              const near = Math.abs(off) < 0.5;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => (near ? setOpenId(p.id) : jumpTo(i))}
                  className={`g-card ${near ? 'is-near' : ''} ${p.featured ? 'is-featured' : ''}`}
                  style={{ '--ox': `${off * 330}px`, opacity: clamp(1.15 - Math.abs(off) * 0.42, 0, 1), zIndex: 100 - Math.round(Math.abs(off) * 10), pointerEvents: Math.abs(off) > 2.4 ? 'none' : 'auto' } as CSSProperties}
                  aria-label={`${p.title} — ${near ? 'open case study' : 'scroll to this project'}`}
                >
                  <span className="g-card__tag">{p.tag}</span>
                  <span className="g-card__title">{p.title}</span>
                  <span className="g-card__sub">{p.subtitle}</span>
                  <span className="g-card__cta">
                    {near ? 'Open case' : 'Travel here'} <ArrowUpRight size={14} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="g-figure" aria-hidden="true">
            <img src="/uploads/vijay.png" alt="" draggable={false} />
          </div>

          <div className="g-dots" role="tablist" aria-label="Projects">
            {projects.map((p, i) => (
              <button key={p.id} role="tab" aria-selected={i === activeIdx} type="button" aria-label={p.title} className={`g-dot ${i === activeIdx ? 'is-active' : ''}`} onClick={() => jumpTo(i)} />
            ))}
          </div>

          <p className="g-label g-label--real" aria-hidden="true">
            Real<br />Projects<br />Real<br />Stories
          </p>
          <p className="g-label g-label--tomorrow" aria-hidden="true">
            Designing<br />A Brighter<br />Tomorrow
          </p>
        </div>
      </div>

      {openProject && (
        <div className="case" role="dialog" aria-modal="true" aria-label={openProject.title}>
          <div className="case__backdrop" onClick={() => setOpenId(null)} />
          <div className="case__panel">
            <button type="button" className="case__close" onClick={() => setOpenId(null)} aria-label="Close">
              <X size={20} />
            </button>
            <p className="case__tag">{openProject.tag}</p>
            <h3 className="case__title">{openProject.title}</h3>
            <p className="case__sub">{openProject.subtitle}</p>
            <p className="case__story">{openProject.story}</p>
            <div className="case__row">
              <button type="button" className="case__btn" onClick={() => setOpenId(null)}>
                Back to the universe
              </button>
              <a className="case__btn case__btn--ghost" href="#contact">
                Start a project <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
