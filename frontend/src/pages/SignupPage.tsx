import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

const PAIRS = [
  { name: 'Yuki Tanaka', meta: '🇯🇵 Japanese → 🇺🇸 English · Tokyo', online: true },
  { name: 'Sofia Reyes', meta: '🇧🇷 Portuguese → 🇩🇪 German · São Paulo', online: true },
  { name: 'Marcus H.', meta: '🇺🇸 English → 🇯🇵 Japanese · Chicago', online: false },
];

const IconBolt = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" /></svg>;
const IconUser = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IconLock = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IconArrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;

const pwStrength = (val: string) => {
  if (!val) return { label: 'Enter a password', width: '0%', color: 'var(--text-3)' };
  if (val.length < 6) return { label: 'Too short', width: '33%', color: 'var(--red)' };
  if (val.length < 10) return { label: 'Moderate', width: '66%', color: 'var(--amber)' };
  return { label: 'Strong password ✓', width: '100%', color: 'var(--green)' };
};

const SignupPage = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pw = pwStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      await axiosInstance.post('/auth/signup', { fullname, email, password });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Account created!');
      navigate('/onboarding');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-layout">
      {/* ── Form Panel ── */}
      <div className="auth-panel">
        <div style={{ marginBottom: 40 }}>
          <Link to="/" className="brand">
            <div className="brand-mark"><IconBolt /></div>
            <span className="brand-name">SwiftChat</span>
          </Link>
        </div>

        <h1 className="auth-form-title">Create your account</h1>
        <p className="auth-form-sub">Start finding language partners in minutes.</p>

        <form className="auth-form-stack" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullname">Full name</label>
            <div className="input-wrap">
              <span className="input-icon"><IconUser /></span>
              <input id="fullname" className="form-input" type="text" placeholder="Your full name"
                value={fullname} onChange={e => setFullname(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon"><IconMail /></span>
              <input id="email" className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input id="password" className="form-input" type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="pw-bar" style={{ marginTop: 8 }}>
              <div className="pw-fill" style={{ width: pw.width, background: pw.color }} />
            </div>
            <div className="form-hint" style={{ color: pw.color }}>{pw.label}</div>
          </div>

          <button type="submit" className="btn btn-green btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'} {!loading && <IconArrow />}
          </button>

          <p className="terms-note">
            By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>

          <div className="divider-or">or continue with</div>

          <button type="button" className="btn btn-ghost btn-full">
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.3 30.2 0 24 0 14.7 0 6.7 5.4 2.8 13.2l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.1-10 6.1-17z"/>
              <path fill="#FBBC05" d="M10.6 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6C.9 15.8 0 19.8 0 24s.9 8.2 2.5 11.7l8.1-7z"/>
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.3-7.7 2.3-6.1 0-11.3-4.1-13.2-9.7l-8.1 7C6.7 42.6 14.7 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="auth-alt" style={{ marginTop: 24 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>

      {/* ── Visual Panel ── */}
      <div className="visual-panel">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Join thousands of learners</h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 300 }}>
            Find your perfect language exchange partner and start speaking with confidence.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          {PAIRS.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
              <div className="avatar-wrap">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=2a2a2a&color=efefef&size=64`} className="avatar" width={36} height={36} alt={p.name} />
                {p.online && <div className="online-ring" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>{p.meta}</div>
              </div>
              {p.online
                ? <span className="lang-pill lang-pill-green" style={{ fontSize: 10 }}>Online</span>
                : <span className="lang-pill" style={{ fontSize: 10 }}>Away</span>
              }
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 18, maxWidth: 320 }}>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, marginBottom: 12, fontStyle: 'italic' }}>
            "I went from zero Japanese to having actual conversations in 3 months."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://ui-avatars.com/api/?name=Marcus+H&background=10b981&color=fff&size=64" className="avatar" width={32} height={32} alt="Marcus" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Marcus H.</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Learning Japanese · 🇺🇸 Chicago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
