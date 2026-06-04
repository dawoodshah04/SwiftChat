import { Link } from 'react-router-dom';

const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" />
  </svg>
);
const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconMessage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const PAIRS = [
  { name: 'Yuki Tanaka', meta: '🇯🇵 Japanese → 🇺🇸 English · Tokyo', online: true },
  { name: 'Sofia Reyes', meta: '🇧🇷 Portuguese → 🇩🇪 German · São Paulo', online: true },
  { name: 'Jean Dupont', meta: '🇫🇷 French → 🇰🇷 Korean · Paris', online: false },
];

const LandingPage = () => (
  <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
    {/* ── Topbar ── */}
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><IconBolt /></div>
        <span className="brand-name">SwiftChat</span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
        <Link to="/signup" className="btn btn-green btn-sm">Get started</Link>
      </div>
    </header>

    {/* ── Hero ── */}
    <section className="hero-body">
      <div className="hero-label">
        <svg width="9" height="9" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>
        Free language exchange · 180+ countries
      </div>

      <h1 className="hero-title">
        Learn languages through<br /><em>real conversations</em>
      </h1>
      <p className="hero-sub">
        Connect with native speakers worldwide. Practice daily, make global friends, and actually speak with confidence.
      </p>

      <div className="hero-cta">
        <Link to="/signup" className="btn btn-green btn-lg">
          Start for free <IconArrow />
        </Link>
        <Link to="/login" className="btn btn-outline btn-lg">See how it works</Link>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-num">42k+</div>
          <div className="stat-label">Active learners</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">180+</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">56</div>
          <div className="stat-label">Languages</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">4.9★</div>
          <div className="stat-label">Average rating</div>
        </div>
      </div>

      {/* Live partner preview */}
      <div style={{ width: '100%', maxWidth: 500, marginBottom: 48 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Live right now</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PAIRS.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
              <div className="avatar-wrap">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=2a2a2a&color=efefef&size=64`}
                  className="avatar" width={34} height={34} alt={p.name}
                />
                {p.online && <div className="online-ring" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 1 }}>{p.meta}</div>
              </div>
              {p.online
                ? <span className="lang-pill lang-pill-green" style={{ fontSize: 10 }}>Online</span>
                : <span className="lang-pill" style={{ fontSize: 10 }}>Away</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature">
          <div className="feature-icon"><IconGlobe /></div>
          <div className="feature-title">Smart Matching</div>
          <div className="feature-desc">We pair you with native speakers who want to learn your language.</div>
        </div>
        <div className="feature">
          <div className="feature-icon"><IconUsers /></div>
          <div className="feature-title">Real Friends</div>
          <div className="feature-desc">Build a genuine network. Follow progress and grow together.</div>
        </div>
        <div className="feature">
          <div className="feature-icon"><IconMessage /></div>
          <div className="feature-title">Live Chat</div>
          <div className="feature-desc">Real-time messaging powered by Stream. No lag, no limits.</div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-3)', fontSize: 12 }}>
      <div className="brand">
        <div className="brand-mark" style={{ width: 22, height: 22 }}><IconBolt /></div>
        <span style={{ fontSize: 13, fontWeight: 700 }}>SwiftChat</span>
      </div>
      <span>© 2025 SwiftChat. All rights reserved.</span>
      <div style={{ display: 'flex', gap: 16 }}>
        <a href="#" style={{ color: 'var(--text-3)' }}>Privacy</a>
        <a href="#" style={{ color: 'var(--text-3)' }}>Terms</a>
      </div>
    </footer>
  </div>
);

export default LandingPage;
