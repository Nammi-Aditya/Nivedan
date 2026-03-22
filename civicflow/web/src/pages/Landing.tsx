import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiZap, FiLock, FiGlobe, FiCpu, FiFileText, FiTool, FiShield,
  FiShoppingBag, FiAlertCircle, FiHome, FiMessageCircle, FiEdit3,
  FiSend, FiBell, FiBarChart2, FiMapPin, FiSmartphone, FiHeart,
  FiCheckCircle,
} from 'react-icons/fi';
import { IoLogoApple, IoLogoAndroid } from 'react-icons/io5';
import { LuLandmark, LuBot } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import Navbar     from '../components/landing/Navbar';
import PhoneScene from '../components/landing/PhoneScene';
import ScrollDots from '../components/landing/ScrollDots';
import logo       from '../assets/LOGO.png';
import '../styles/landing.css';

const FONT_DISPLAY = "'Google Sans Flex', system-ui, sans-serif";
const FONT_UI      = "'Google Sans Flex', system-ui, sans-serif";
const FONT_MONO    = "'JetBrains Mono', 'SF Mono', monospace";

// ── Icon helper ───────────────────────────────────────────────────────────────
function Icon({ as: I, size = 16, color, style }: {
  as: IconType; size?: number; color?: string; style?: React.CSSProperties;
}) {
  return <I size={size} color={color} style={{ flexShrink: 0, ...style }} />;
}

// ── Section data ──────────────────────────────────────────────────────────────
const HERO = {
  badge: 'Available in 8+ Indian Languages',
  h1Lines: ['File Government', 'Complaints.'],
  h1Accent: 'From Your Pocket.',
  body: "No more standing in queues. Nivedan's AI agent files your complaint, fills the forms, submits to government portals — and tracks everything. In your language.",
  trust: [
    { icon: FiZap,  label: 'Powered by AI' },
    { icon: FiLock, label: 'Govt. Grade Security' },
    { icon: FiGlobe,label: '8+ Languages' },
  ],
};

const SECTIONS = [
  {
    num: '01', label: 'INTRODUCTION', phoneRight: true,
    h2: ['Your AI-Powered', 'Complaint Officer'],
    body: 'Nivedan is the first AI agent built for Indian citizens to file government complaints without stepping out of their homes.',
    chips: [
      { icon: LuBot,       text: 'AI Agent' },
      { icon: FiFileText,  text: 'Auto Form Fill' },
      { icon: LuLandmark,  text: 'Govt. Portal' },
    ],
  },
  {
    num: '02', label: 'GET STARTED', phoneRight: false,
    h2: ['One Account.', 'Every Complaint.'],
    body: 'Register once with your phone number. Nivedan remembers your details so every future complaint takes seconds — not days.',
    stats: [{ n: '10k+', sub: 'Users' }, { n: '7', sub: 'Portals' }, { n: '< 5 min', sub: 'To File' }],
  },
  {
    num: '03', label: 'LANGUAGES', phoneRight: true,
    h2: ['Speak Your', 'Language.'],
    body: 'File in Hindi, Telugu, Tamil, Malayalam, Kannada, Marathi, Gujarati, or English. Our AI understands and responds in your mother tongue.',
    langs: [
      { t: 'हिंदी', hi: true }, { t: 'తెలుగు', hi: false },
      { t: 'தமிழ்', hi: false }, { t: 'മലയാളം', hi: true },
      { t: 'ಕನ್ನಡ', hi: false }, { t: 'मराठी', hi: false },
      { t: 'ગુજરાતી', hi: true }, { t: 'English', hi: false },
    ],
  },
  {
    num: '04', label: 'COMPLAINT TYPES', phoneRight: false,
    h2: ['Every Complaint.', 'One App.'],
    body: 'From labour disputes to cyber fraud — all major categories connected to official government portals.',
    categories: [
      { icon: FiTool,         title: 'Labour Issues',    desc: 'Salary disputes, termination, harassment' },
      { icon: FiShield,       title: 'Cyber Crime',      desc: 'Online fraud, scams, identity theft' },
      { icon: FiShoppingBag,  title: 'Consumer Rights',  desc: 'Defective products, service complaints' },
      { icon: FiAlertCircle,  title: 'Police Complaints',desc: 'FIR not registered, misconduct' },
      { icon: FiHome,         title: 'Municipal Issues', desc: 'Roads, water, electricity' },
    ],
  },
  {
    num: '05', label: 'AI AGENT', phoneRight: true,
    h2: ['Just Tell It', 'Your Problem.'],
    body: 'Our AI has a natural conversation with you, fetches the right government form, fills every field — and submits it.',
    steps: [
      { icon: FiMessageCircle, text: 'Describe your problem in your language' },
      { icon: FiFileText,      text: 'AI fetches the correct govt. form' },
      { icon: FiEdit3,         text: 'Form is auto-filled with your details' },
      { icon: FiSend,          text: 'Submitted directly to govt. portal' },
      { icon: FiBell,          text: 'You get notified of every update' },
    ],
  },
  {
    num: '06', label: 'DASHBOARD', phoneRight: false,
    h2: ['Zero Follow-ups.', 'Total Peace.'],
    body: 'Real-time complaint tracking. No more visiting offices, no more unanswered calls.',
    cards: [
      { icon: FiMapPin,    title: 'Real-time tracking',  desc: 'Know exactly where your complaint stands' },
      { icon: FiBell,      title: 'Push notifications',  desc: 'Instant alerts for every portal response' },
      { icon: FiBarChart2, title: 'Case history',        desc: 'All complaints in one organised place' },
    ],
  },
];

// ── Content renderer ──────────────────────────────────────────────────────────
function SectionContent({ idx }: { idx: number }) {
  const navigate = useNavigate();

  if (idx === 0) {
    return (
      <>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '6px 14px', borderRadius: 100,
          background: 'rgba(232,137,26,0.08)', border: '1px solid rgba(232,137,26,0.35)',
          fontFamily: FONT_MONO, fontSize: 11, color: '#C9731A',
          letterSpacing: '0.03em', marginBottom: 22,
        }}>
          <Icon as={FiGlobe} size={12} color="#C9731A" />
          {HERO.badge}
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontSize: 'clamp(38px,5vw,64px)',
          fontWeight: 900, lineHeight: 1.08, margin: '0 0 22px', color: '#1B2A4A',
        }}>
          {HERO.h1Lines.map(l => <span key={l} style={{ display: 'block' }}>{l}</span>)}
          <span style={{ display: 'block', color: '#E8891A' }}>{HERO.h1Accent}</span>
        </h1>

        {/* Body */}
        <p style={{
          fontFamily: FONT_UI, fontSize: 17, lineHeight: 1.72,
          color: 'rgba(27,42,74,0.65)', maxWidth: 400, margin: '0 0 28px',
        }}>
          {HERO.body}
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          <button onClick={() => navigate('/register')} style={{
            height: 52, padding: '0 28px', borderRadius: 12, border: 'none',
            background: '#E8891A', color: '#fff', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#C9731A'; e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#E8891A'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Icon as={IoLogoAndroid} size={18} color="#fff" />
            Download for Free
          </button>
          <button style={{
            height: 52, padding: '0 28px', borderRadius: 12,
            border: '1.5px solid rgba(27,42,74,0.28)', background: 'transparent',
            color: '#1B2A4A', fontFamily: FONT_UI, fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,42,74,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            See How It Works
          </button>
        </div>

        {/* Trust row */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {HERO.trust.map((t, i) => (
            <span key={i} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: FONT_UI, fontSize: 12, color: 'rgba(27,42,74,0.45)',
            }}>
              <Icon as={t.icon} size={13} color="rgba(27,42,74,0.40)" />
              {t.label}
            </span>
          ))}
        </div>
      </>
    );
  }

  const sec = SECTIONS[idx - 1];
  return (
    <>
      {/* Section label */}
      <div style={{ marginBottom: 14 }}>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 11, fontWeight: 500,
          color: '#C9731A', letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          {sec.num} / {sec.label}
        </span>
      </div>

      {/* H2 */}
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontSize: 'clamp(34px,4vw,52px)',
        fontWeight: 900, lineHeight: 1.12, margin: '0 0 18px', color: '#1B2A4A',
      }}>
        {sec.h2.map(l => <span key={l} style={{ display: 'block' }}>{l}</span>)}
      </h2>

      {/* Body */}
      <p style={{
        fontFamily: FONT_UI, fontSize: 16, lineHeight: 1.72,
        color: 'rgba(27,42,74,0.65)', maxWidth: 380, margin: '0 0 22px',
      }}>
        {sec.body}
      </p>

      {/* Chips */}
      {'chips' in sec && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(sec as any).chips.map((c: { icon: IconType; text: string }) => (
            <span key={c.text} className="feature-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon as={c.icon} size={12} color="#C9731A" />
              {c.text}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {'stats' in sec && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(sec as any).stats.map((s: any, i: number) => (
            <div key={s.sub} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: '#E8891A' }}>{s.n}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 12, color: 'rgba(27,42,74,0.50)', marginTop: 4 }}>{s.sub}</div>
              </div>
              {i < 2 && <div className="stat-divider" />}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {'langs' in sec && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 300 }}>
          {(sec as any).langs.map((l: any) => (
            <div key={l.t} style={{
              padding: '9px 16px', borderRadius: 100, textAlign: 'center',
              fontFamily: FONT_UI, fontSize: 14, fontWeight: l.hi ? 600 : 400,
              background: l.hi ? '#E8891A' : 'rgba(27,42,74,0.05)',
              color:      l.hi ? '#fff'    : 'rgba(27,42,74,0.75)',
              border:     l.hi ? 'none'    : '1px solid rgba(27,42,74,0.12)',
            }}>{l.t}</div>
          ))}
        </div>
      )}

      {/* Categories */}
      {'categories' in sec && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(sec as any).categories.map((c: { icon: IconType; title: string; desc: string }) => (
            <div key={c.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingLeft: 14, borderLeft: '2px solid #E8891A' }}>
              <Icon as={c.icon} size={16} color="#E8891A" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: FONT_UI, fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{c.title}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 12, color: 'rgba(27,42,74,0.50)', marginTop: 2 }}>{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Steps */}
      {'steps' in sec && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 13, top: 24, bottom: 24, width: 1, borderLeft: '2px dashed rgba(232,137,26,0.25)' }} />
          {(sec as any).steps.map((step: { icon: IconType; text: string }, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', position: 'relative' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#E8891A', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, zIndex: 1,
              }}>
                <Icon as={step.icon} size={13} color="#fff" />
              </div>
              <span style={{ fontFamily: FONT_UI, fontSize: 14, color: 'rgba(27,42,74,0.78)' }}>{step.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      {'cards' in sec && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(sec as any).cards.map((card: { icon: IconType; title: string; desc: string }) => (
            <div key={card.title} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Icon as={card.icon} size={15} color="#E8891A" />
                <div style={{ fontFamily: FONT_UI, fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{card.title}</div>
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: 'rgba(27,42,74,0.55)' }}>{card.desc}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '100px 24px',
      background: '#FFFFFF', borderTop: '1px solid rgba(27,42,74,0.08)',
    }}>
      <span style={{
        fontFamily: FONT_MONO, fontSize: 11, color: '#C9731A',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        padding: '6px 18px', border: '1px solid rgba(232,137,26,0.35)',
        borderRadius: 100, background: 'rgba(232,137,26,0.07)',
        marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <Icon as={FiCheckCircle} size={11} color="#C9731A" />
        Free to Download
      </span>
      <h2 style={{
        fontFamily: FONT_DISPLAY, fontSize: 'clamp(44px,7vw,72px)',
        fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#1B2A4A',
      }}>
        Your Voice.<br /><span style={{ color: '#E8891A' }}>Finally Heard.</span>
      </h2>
      <p style={{
        fontFamily: FONT_UI, fontSize: 18, color: 'rgba(27,42,74,0.60)',
        maxWidth: 500, lineHeight: 1.7, marginBottom: 40,
      }}>
        Join thousands of Indian citizens who file complaints the modern way. No queues. No confusion. Just results.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={() => navigate('/register')} style={{
          height: 56, minWidth: 220, padding: '0 32px', borderRadius: 14,
          border: 'none', background: '#E8891A', color: '#fff',
          fontFamily: FONT_UI, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(232,137,26,0.30)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C9731A'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#E8891A'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Icon as={IoLogoAndroid} size={20} color="#fff" />
          Download for Android
        </button>
        <button style={{
          height: 56, minWidth: 220, padding: '0 32px', borderRadius: 14,
          border: '1.5px solid rgba(27,42,74,0.28)', background: 'transparent',
          color: '#1B2A4A', fontFamily: FONT_UI, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,42,74,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Icon as={IoLogoApple} size={20} color="#1B2A4A" />
          Download for iOS
        </button>
      </div>
      <p style={{ marginTop: 24, fontFamily: FONT_UI, fontSize: 13, color: 'rgba(27,42,74,0.35)' }}>
        4.8 / 5 rating · 10,000+ complaints filed · 100% free
      </p>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: '#F4F7FC', padding: '60px 64px 40px',
      borderTop: '1px solid rgba(27,42,74,0.09)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48, marginBottom: 40 }}>
        <div>
          <img src={logo} alt="Nivedan" style={{ height: 36, marginBottom: 14, objectFit: 'contain' }} />
          <div style={{ fontFamily: FONT_UI, fontSize: 14, color: 'rgba(27,42,74,0.55)', lineHeight: 1.6 }}>
            Complaints. From your pocket.
            <br /><br />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              Made with <Icon as={FiHeart} size={13} color="#E8891A" style={{ margin: '0 2px' }} /> for Indian citizens.
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, color: 'rgba(27,42,74,0.40)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Links</div>
          {['Features', 'Languages', 'How It Works', 'Privacy Policy', 'Terms of Service'].map(l => (
            <div key={l} style={{ marginBottom: 10 }}>
              <a href="#" style={{ fontFamily: FONT_UI, fontSize: 14, color: 'rgba(27,42,74,0.55)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1B2A4A')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(27,42,74,0.55)')}
              >{l}</a>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, color: 'rgba(27,42,74,0.40)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Available on</div>
          {[
            { label: 'Google Play', icon: IoLogoAndroid },
            { label: 'App Store',   icon: IoLogoApple },
          ].map(s => (
            <button key={s.label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: 160, height: 40, marginBottom: 10,
              borderRadius: 100, border: '1.5px solid rgba(27,42,74,0.20)',
              background: 'transparent', color: '#1B2A4A',
              fontFamily: FONT_UI, fontSize: 13, cursor: 'pointer', paddingLeft: 16,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1B2A4A'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1B2A4A'; }}
            >
              <Icon as={s.icon} size={15} />
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(27,42,74,0.09)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontFamily: FONT_UI, fontSize: 12, color: 'rgba(27,42,74,0.35)' }}>© 2026 Nivedan. All rights reserved.</span>
        <span style={{ fontFamily: FONT_UI, fontSize: 12, color: 'rgba(27,42,74,0.35)', display: 'flex', alignItems: 'center', gap: 5 }}>
          Built in India
          <Icon as={FiGlobe} size={12} color="rgba(27,42,74,0.35)" />
        </span>
      </div>
    </footer>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const TOTAL_SECTIONS = 7;

export default function Landing() {
  const [section,     setSection]     = useState(0);
  const [displayIdx,  setDisplayIdx]  = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight * TOTAL_SECTIONS;
      const p   = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      const s   = Math.min(Math.floor(p * TOTAL_SECTIONS), TOTAL_SECTIONS - 1);
      setSection(prev => prev !== s ? s : prev);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (section === displayIdx) return;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    setFadeOpacity(0);
    fadeTimer.current = setTimeout(() => {
      setDisplayIdx(section);
      setFadeOpacity(1);
    }, 260);
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
  }, [section]);

  const scrollToSection = (i: number) => {
    window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' });
  };

  const phoneRight = displayIdx === 0 || SECTIONS[displayIdx - 1]?.phoneRight;
  const textLeft   = phoneRight;

  return (
    <div className="landing-page">
      <Navbar />

      {/* Fixed 3-D phone canvas — pointer events enabled for drag interaction.
          Wheel events forwarded to window so page scroll still works. */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 1 }}
        onWheel={e => window.scrollBy({ top: e.deltaY, behavior: 'auto' })}
      >
        <PhoneScene section={section} />
      </div>

      {/* Fixed content overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 5,
        display: 'flex', alignItems: 'center',
        pointerEvents: 'none', paddingTop: 64,
      }}>
        <div style={{
          position:    'absolute',
          left:        textLeft ? '5%' : 'auto',
          right:      !textLeft ? '5%' : 'auto',
          width:       'min(440px, 42%)',
          opacity:     fadeOpacity,
          transform:   `translateY(${fadeOpacity === 1 ? 0 : 12}px)`,
          transition:  'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'auto',
        }}>
          <SectionContent idx={displayIdx} />
        </div>
      </div>

      {/* Scroll dots */}
      <ScrollDots
        active={Math.max(0, section - 1)}
        onDotClick={i => scrollToSection(i + 1)}
      />

      {/* 700vh scroll spacer */}
      <div style={{ height: `${TOTAL_SECTIONS * 100}vh` }} aria-hidden="true" />

      {/* Below-fold: CTA + Footer */}
      <div style={{ position: 'relative', zIndex: 15, background: '#fff' }}>
        <FinalCTA />
        <Footer />
      </div>
    </div>
  );
}
