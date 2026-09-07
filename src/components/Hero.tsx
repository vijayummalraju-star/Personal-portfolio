import Embers from './Embers';

const LETTERS = ['V', 'I', 'J', 'A', 'Y'];

interface HeroProps {
  playing: boolean;
}

export default function Hero({ playing }: HeroProps) {
  return (
    <section id="top" className={`hero ${playing ? 'is-playing' : ''}`} aria-label="Opening">
      <h1 className="sr-only">VIJAY UMMALRAJU — Artist, Creative, Storyteller. Welcome to my world.</h1>

      <div className="hero__ember" aria-hidden="true" />
      <Embers density={90} className="hero__embers" />

      <div className="hero__figure" aria-hidden="true">
        <img src="/uploads/vijay.png" alt="" draggable={false} />
        <div className="hero__figureShade" />
      </div>

      <div className="hero__word" aria-hidden="true">
        <div className="wordmark" data-text="VIJAY">
          {LETTERS.map((ch, i) => (
            <span key={i} className="wm-letter" style={{ animationDelay: `${0.9 + i * 0.12}s` }}>
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="furniture" aria-hidden="true">
        <p className="welcome">
          <b className="welcome__dots">•••</b>
          <span className="welcome__text">Welcome to my world</span>
          <b className="welcome__dots">•••</b>
        </p>
        <p className="chip chip--artist">
          <span>•Artist Vijay•</span>
        </p>
        <p className="chip chip--legend">
          <span>•Legend•</span>
        </p>
        <div className="arrows arrows--l">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${2.4 + i * 0.08}s` }} />
          ))}
        </div>
        <div className="arrows arrows--r">
          {Array.from({ length: 7 }).map((_, i) => (
            <i key={i} style={{ animationDelay: `${2.4 + i * 0.08}s` }} />
          ))}
        </div>
        <div className="grid-dots grid-dots--tl" />
        <div className="grid-dots grid-dots--br" />
      </div>

      <a className="hero__scroll" href="#universe" aria-label="Scroll to explore">
        <span>Scroll</span>
        <i />
      </a>

      <div className="hero__vignette" aria-hidden="true" />
    </section>
  );
}
