import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Dribbble, Instagram, Linkedin, Loader2, Phone, Send } from 'lucide-react';
import Embers from './Embers';
import Reveal from './Reveal';

const LETTERS = ['V', 'I', 'J', 'A', 'Y'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export default function Finale() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [status, setStatus] = useState<SendState>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    setServerError(null);
    if (name.trim().length < 2) return setFieldError('Please tell me your name.');
    if (!EMAIL_RE.test(email.trim())) return setFieldError('Please enter a valid email address.');
    if (message.trim().length < 10) return setFieldError('Your message should be at least 10 characters.');
    setStatus('sending');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <footer className="fin" id="contact" aria-label="Closing">
      <div className="fin__stage">
        <Embers density={60} className="fin__embers" />
        <div className="fin__fog fin__fog--a" aria-hidden="true" />
        <div className="fin__fog fin__fog--b" aria-hidden="true" />

        <h2 className="sr-only">Vijay Ummalraju</h2>

        <Reveal className="fin__word" as="div">
          <div className="finword" aria-hidden="true">
            {LETTERS.map((ch, i) => (
              <span key={i} className="finword__letter" style={{ animationDelay: `${i * 0.1}s` }}>
                {ch}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="fin__man" aria-hidden="true">
          <img src="/uploads/vijay.png" alt="" draggable={false} />
          <div className="fin__manVeil" />
        </div>

        <p className="f-cap f-cap--tl" aria-hidden="true">
          Ideas<br />Designs<br />Experiences<br />Real Impact
        </p>
        <blockquote className="f-cap f-cap--quote">
          &ldquo;Good<br />Design<br />Smokes<br />Louder.&rdquo;
        </blockquote>
        <p className="f-cap f-cap--blw" aria-hidden="true">
          A<br />Designer&rsquo;s<br />World
        </p>
        <p className="f-cap f-cap--tr" aria-hidden="true">
          Same<br />Passion<br />A Brighter<br />Tomorrow
        </p>
        <p className="f-cap f-cap--br" aria-hidden="true">
          Design<br />Build<br />Explore<br />Repeat
        </p>
      </div>

      <div className="contact">
        <Reveal className="contact__head">
          <p className="scene-over">Final Scene</p>
          <h2 className="contact__title">
            Let&rsquo;s make something <em>legendary</em>
          </h2>
          <p className="contact__sub">Have a story to tell, a product to launch, or a world to build? My inbox is open.</p>
        </Reveal>

        <Reveal className="contact__grid">
          <form className="cform" onSubmit={submit} noValidate>
            <label className="cform__field">
              <span>Your name</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Appleseed" autoComplete="name" />
            </label>
            <label className="cform__field">
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" autoComplete="email" />
            </label>
            <label className="cform__field cform__field--full">
              <span>Your message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me about your project, your timeline, your wildest idea..." rows={5} />
            </label>
            {(fieldError || (status === 'error' && serverError)) && (
              <p className="cform__error" role="alert">{fieldError ?? serverError}</p>
            )}
            {status === 'sent' && (
              <p className="cform__ok" role="status">
                <CheckCircle2 size={16} /> Message received. I&rsquo;ll write back within 48 hours.
              </p>
            )}
            <button type="submit" className="cform__btn" disabled={status === 'sending'}>
              {status === 'sending' ? (<><Loader2 size={16} className="spin" /> Sending...</>) : (<><Send size={16} /> Send message <ArrowUpRight size={14} /></>)}
            </button>
          </form>

          <div className="contact__side">
            <p className="contact__label">Elsewhere</p>
            <nav className="contact__soc" aria-label="Social">
              <a href="https://instagram.com/" target="_blank" rel="me noreferrer">
                <Instagram size={16} /> Instagram <ArrowUpRight size={13} />
              </a>
              <a href="https://dribbble.com/" target="_blank" rel="me noreferrer">
                <Dribbble size={16} /> Dribbble <ArrowUpRight size={13} />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="me noreferrer">
                <Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} />
              </a>
            </nav>
            <p className="contact__label">Studio hours</p>
            <p className="contact__hours">Mon — Sat<br />9:00 — 21:00 IST</p>
            <p className="contact__label">Direct</p>
            <a className="contact__mail" href="mailto:vijayummalraju@gmail.com">vijayummalraju@gmail.com</a>
            <a className="contact__phone" href="tel:+918309022782">
              <Phone size={15} /> +91 8309022782
            </a>
          </div>
        </Reveal>
      </div>

      <div className="fin__bar">
        <a href="#contact" data-nav>Contact</a>
        <nav className="fin__soc" aria-label="Social">
          <a href="https://instagram.com/" target="_blank" rel="me noreferrer">Instagram</a>
          <a href="https://dribbble.com/" target="_blank" rel="me noreferrer">Dribbble</a>
          <a href="https://linkedin.com/" target="_blank" rel="me noreferrer">LinkedIn</a>
        </nav>
        <small className="fin__c">© 2026 Vijay Ummalraju — All rights reserved</small>
      </div>
    </footer>
  );
}
