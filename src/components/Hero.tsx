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
        </p>
      </div>
    </section>
  );
}
