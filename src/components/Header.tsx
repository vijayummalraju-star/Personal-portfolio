import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#journey' },
  { label: 'Journal', href: '#universe' },
  { label: 'Contact', href: '#contact' },
];

interface HeaderProps {
  visible: boolean;
  active: string;
}

export default function Header({ visible, active }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hdr ${visible ? 'is-in' : ''} ${scrolled ? 'is-scrolled' : ''}`} id="site-header">
      <svg className="hdr__rule" aria-hidden="true" preserveAspectRatio="none">
        <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>

      <a className="hdr__mark" href="#top" aria-label="Vijay Ummalraju, home">
        <span className="mark-word">VIJAY&nbsp;UMMALRAJU</span>
      </a>

      <span className="hdr__div" aria-hidden="true" />

      <p className="hdr__roles">
        <span>Artist</span>
        <span>Creative</span>
        <span>Storyteller</span>
      </p>

      <nav className="hdr__nav" aria-label="Primary">
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} data-nav className={active === l.href ? 'is-active' : ''}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hdr__meta">
        <span className="hdr__metaLabel">Portfolio — MMXXVI</span>
        <span className="hdr__pips" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>

      <button
        className="hdr__burger"
        aria-expanded={open}
        aria-controls="mobileMenu"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav id="mobileMenu" className={`hdr__mobile ${open ? 'is-open' : ''}`} aria-label="Primary, expanded">
        <ul>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} className={active === l.href ? 'is-active' : ''} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="hdr__mobileTag">••• Welcome to my world •••</p>
      </nav>
    </header>
  );
}
