import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import useAuth from '../hooks/useAuth';

const LANGUAGES = [
  'English','Spanish','French','German','Portuguese','Italian',
  'Mandarin','Japanese','Korean','Hindi','Arabic','Russian',
  'Dutch','Swedish','Polish','Turkish','Thai','Vietnamese',
];

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Advanced'];

const IconBolt = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" /></svg>;
const IconCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>;
const IconPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconArrow = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const IconBack = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;

const OnboardingPage = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(2);
  const [fullname, setFullname] = useState(authUser?.fullname || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [location, setLocation] = useState(authUser?.location || '');
  const [nativeLang, setNativeLang] = useState('English');
  const [learningLang, setLearningLang] = useState('Japanese');
  const [level, setLevel] = useState('Elementary');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser?.fullname) setFullname(authUser.fullname);
  }, [authUser]);

  const avatarSrc = authUser?.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname || 'U')}&background=2a2a2a&color=efefef&size=128`;

  const handleFinish = async () => {
    if (!nativeLang || !learningLang) { toast.error('Please select languages'); return; }
    try {
      setLoading(true);
      await axiosInstance.post('/auth/onboarding', {
        fullname, bio, location,
        nativeLanguage: nativeLang,
        learningLanguage: learningLang,
      });
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Profile complete! Welcome 🎉');
      navigate('/home');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = () => (
    <div className="step-track">
      {[1, 2, 3].map((n, i) => (
        <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step-circle ${step > n ? 'done' : step === n ? 'current' : ''}`}>
            {step > n ? <IconCheck /> : n}
          </div>
          <span className={`step-name ${step === n ? 'current' : ''}`}>
            {['Account', 'Profile', 'Languages'][i]}
          </span>
          {n < 3 && <div className={`step-line ${step > n ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top bar */}
      <header className="onboard-bar">
        <div className="brand">
          <div className="brand-mark"><IconBolt /></div>
          <span className="brand-name">SwiftChat</span>
        </div>
        <StepIndicator />
        <button onClick={() => navigate('/home')} style={{ fontSize: 13, color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Skip for now →
        </button>
      </header>

      <div className="onboard-main">
        {/* ── Form Column ── */}
        <div>
          {/* STEP 2 — Profile */}
          {step === 2 && (
            <div className="fade-up">
              <div className="onboard-step-label">Step 2 of 3</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Set up your profile</h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                Tell people who you are. A complete profile gets 3× more requests.
              </p>

              <div className="auth-form-stack">
                {/* Avatar picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)' }}>
                  <img src={avatarSrc} className="avatar" width={56} height={56} alt="avatar" style={{ border: '2px solid var(--border)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Profile photo</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)' }}>Auto-generated from your name</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" type="text" value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Your full name" />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(optional)</span></label>
                  <textarea className="form-input" rows={3} value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Tell people a bit about yourself…" style={{ resize: 'vertical' }} />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div className="input-wrap">
                    <span className="input-icon"><IconPin /></span>
                    <input className="form-input" type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Country" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn btn-outline flex-1" style={{ justifyContent: 'center' }} onClick={() => setStep(1)}>
                    <IconBack /> Back
                  </button>
                  <button className="btn btn-green" style={{ flex: 2, justifyContent: 'center' }} onClick={() => setStep(3)}>
                    Continue <IconArrow />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Languages */}
          {step === 3 && (
            <div className="fade-up">
              <div className="onboard-step-label">Step 3 of 3</div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>Your language goals</h1>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 32 }}>
                Tell us what you speak and what you're learning.
              </p>

              <div className="auth-form-stack">
                <div className="form-group">
                  <label className="form-label">I speak (native)</label>
                  <select className="form-input" value={nativeLang} onChange={e => setNativeLang(e.target.value)}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">I'm learning</label>
                  <select className="form-input" value={learningLang} onChange={e => setLearningLang(e.target.value)}>
                    {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Proficiency level</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {LEVELS.map(l => (
                      <button key={l}
                        className={`btn btn-sm ${level === l ? 'btn-green' : 'btn-ghost'}`}
                        style={{ justifyContent: 'center' }}
                        onClick={() => setLevel(l)}
                      >{l}</button>
                    ))}
                  </div>
                </div>

                {/* Exchange preview */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>Your exchange preview</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="lang-pill">{nativeLang} native</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    <span className="lang-pill lang-pill-green">{learningLang} learner</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button className="btn btn-outline flex-1" style={{ justifyContent: 'center' }} onClick={() => setStep(2)}>
                    <IconBack /> Back
                  </button>
                  <button className="btn btn-green" style={{ flex: 2, justifyContent: 'center' }} onClick={handleFinish} disabled={loading}>
                    {loading ? 'Saving…' : 'Finish setup'}
                    {!loading && <IconCheck />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Preview Column ── */}
        <div style={{ position: 'sticky', top: 24, height: 'fit-content' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Profile preview
          </div>
          <div className="profile-preview">
            <div className="pp-cover" />
            <div className="pp-avatar-wrap">
              <img src={avatarSrc} className="avatar" width={48} height={48} alt="" style={{ border: '3px solid var(--surface)' }} />
            </div>
            <div className="pp-body">
              <div className="pp-name">{fullname || 'Your Name'}</div>
              {location && (
                <div className="pp-loc"><IconPin /> {location}</div>
              )}
              {nativeLang && (
                <div className="pp-langs">
                  <span className="lang-pill">{nativeLang}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  <span className="lang-pill lang-pill-green">{learningLang}</span>
                </div>
              )}
              <div className="pp-bio">{bio || 'Your bio will appear here…'}</div>
              <div className="pp-stats">
                <div className="pp-stat"><div className="pp-stat-num">0</div><div className="pp-stat-label">Friends</div></div>
                <div className="pp-stat"><div className="pp-stat-num">0</div><div className="pp-stat-label">Chats</div></div>
                <div className="pp-stat"><div className="pp-stat-num">New</div><div className="pp-stat-label">Member</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
