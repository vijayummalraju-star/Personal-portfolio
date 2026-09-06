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
    Promise.all([imgReady, fontsReady, minBlack]).then(() => {
      if (!live) return;
      const elapsed = performance.now() - t0;
      if (elapsed < 1600) window.setTimeout(() => live && setProgress(100), 1600 - elapsed);
      else setProgress(100);
      window.setTimeout(() => live && setBooted(true), Math.max(500, 1900 - elapsed));
      window.setTimeout(() => live && setReady(true), Math.max(1200, 2900 - elapsed));
    });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-24% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.6] }
    );
    SECTIONS.forEach((href) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const scrollTo = useCallback((href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <main className={ready ? 'site is-ready' : 'site'}>
      {!booted && (
        <div className="boot" aria-hidden="true">
          <div className="boot__bar"><span style={{ width: `${progress}%` }} /></div>
          <div className="boot__pct">{Math.round(progress)}%</div>
        </div>
      )}
      <Header visible={booted} active={active} />
      <Hero playing={ready} />
      <Universe onNavigate={scrollTo} />
      <Chrono />
      <Gallery />
      <Finale />
    </main>
  );
}
