import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Universe from './components/Universe';
import Chrono from './components/Chrono';
import Gallery from './components/Gallery';
import Finale from './components/Finale';

const SECTIONS = ['#top', '#universe', '#journey', '#work', '#contact'];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('#top');

  useEffect(() => {
    let live = true;
    const t0 = performance.now();
    setProgress(8);
    const img = new Image();
    img.src = '/uploads/vijay.png';
    const imgReady = new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      window.setTimeout(resolve, 6000);
    });
    const fontsReady =
      typeof document !== 'undefined' && 'fonts' in document
        ? document.fonts.ready.then(() => undefined).catch(() => undefined)
        : Promise.resolve();
    const minBlack = new Promise<void>((r) => window.setTimeout(r, 1100));
    setProgress(38);
    Promise.all([imgReady, fontsReady, minBlack]).then(() => {
      if (!live) return;
      const held = performance.now() - t0;
      const wait = Math.max(0, 1400 - held);
      setProgress(72);
      window.setTimeout(() => {
        if (!live) return;
        setProgress(100);
        window.setTimeout(() => live && setReady(true), 250);
      }, wait);
    });
    return () => {
      live = false;
    };
  }, []);

  const enter = useCallback(() => {
    setBooted(true);
    document.documentElement.classList.remove('is-booting');
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') enter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ready, enter]);

  useEffect(() => {
    if (!booted) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    SECTIONS.forEach((s) => {
      const el = document.querySelector(s);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [booted]);

  useEffect(() => {
    document.documentElement.classList.add('is-booting');
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {!booted && (
        <div className={`boot ${ready ? 'is-ready' : ''}`} role="dialog" aria-label="Enter the portfolio">
          <div className="boot__inner">
            <p className="boot__over">••• Welcome to my world •••</p>
            <p className="boot__name">VIJAY UMMALRAJU</p>
            <p className="boot__roles">Artist · Creative · Storyteller</p>
            <div className="boot__bar" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </div>
            <button className="boot__enter" onClick={enter} disabled={!ready} aria-label="Enter the portfolio">
              <span>{ready ? 'Enter' : 'Loading...'}</span>
            </button>
          </div>
        </div>
      )}

      <Header visible={booted} active={active} />

      <main className="flow">
        <Hero playing={booted} />
        <Universe />
        <Chrono />
        <Gallery />
      </main>

      <Finale />
    </>
  );
}
