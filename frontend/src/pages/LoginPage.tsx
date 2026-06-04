import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

const IconBolt = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" /></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IconLock = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const IconArrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;

/* Mockup chat preview */
const BUBBLES = [
  { from: 'yuki', text: 'こんにちは！How was your day? 😊' },
  { from: 'me', text: 'Great! Did you try the て-form verbs? 🎉' },
  { from: 'yuki', text: '食べています — correct? 😄' },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.post('/auth/login', { email, password });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Welcome back!');
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
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

        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-sub">Log in to continue your language journey.</p>

        <form className="auth-form-stack" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon"><IconMail /></span>
              <input id="email" className="form-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <a href="#" style={{ fontSize: 12, color: 'var(--text-2)' }}>Forgot password?</a>
            </div>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input id="password" className="form-input" type="password" placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
              style={{ accentColor: 'var(--green)', width: 14, height: 14 }} />
            Keep me signed in
          </label>

          <button type="submit" className="btn btn-green btn-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Log in'} {!loading && <IconArrow />}
          </button>

          <div className="divider-or">or</div>

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
          New to SwiftChat? <Link to="/signup">Create an account</Link>
        </p>
      </div>

      {/* ── Visual Panel ── */}
      <div className="visual-panel">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Pick up where you left off</h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, maxWidth: 300 }}>
            Your language partners are waiting. Jump back in.
          </p>
        </div>

        {/* Chat mockup preview */}
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', width: '100%', maxWidth: 320, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <div className="avatar-wrap">
              <img src="https://ui-avatars.com/api/?name=Yuki+T&background=2a2a2a&color=efefef&size=64" className="avatar" width={32} height={32} alt="Yuki" />
              <div className="online-ring" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Yuki Tanaka</div>
              <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg> Online now
              </div>
            </div>
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160 }}>
            {BUBBLES.map((b, i) => (
              <div key={i} className={`msg-row${b.from === 'me' ? ' out' : ''}`}>
                <img src={b.from === 'yuki'
                  ? 'https://ui-avatars.com/api/?name=Yuki+T&background=2a2a2a&color=efefef&size=64'
                  : 'https://ui-avatars.com/api/?name=You&background=10b981&color=fff&size=64'}
                  className="avatar" width={22} height={22} alt="" />
                <div className="msg-col" style={b.from === 'me' ? { alignItems: 'flex-end' } : {}}>
                  <div className={`msg-bubble ${b.from === 'me' ? 'out' : 'in'}`} style={{ fontSize: 12 }}>{b.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '7px 12px', fontSize: 12, color: 'var(--text-3)' }}>Type a message…</div>
            <div className="send-btn" style={{ width: 28, height: 28, cursor: 'default' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center' }}>
          Secure login · End-to-end encrypted
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
