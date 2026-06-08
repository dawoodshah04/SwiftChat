import { useNavigate } from 'react-router-dom';
import { useCalls, CallingState } from '@stream-io/video-react-sdk';

// SVG Icons
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.98-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/**
 * Floating incoming call notification overlay.
 * Rendered globally inside the StreamVideo provider in App.tsx so it fires on any page.
 */
const IncomingCallModal = () => {
  const navigate = useNavigate();
  const calls = useCalls();
  const incomingCalls = calls.filter(
    (c) => !c.isCreatedByMe && c.state.callingState === CallingState.RINGING
  );
  const call = incomingCalls[0] ?? null;

  if (!call) return null;

  const caller = call.state.createdBy;
  const callerName = caller?.name || 'Someone';
  const avatarSrc =
    (caller as any)?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(callerName)}&background=1a2a1a&color=10b981&size=128`;

  const handleAccept = () => {
    // Don't call call.accept() here.
    // CallPage will call call.join() which internally calls accept() for
    // an incoming RINGING call — calling accept() twice causes a 400 error.
    navigate(`/call/${call.id}`);
  };

  const handleDecline = async () => {
    try {
      await call.reject();
    } catch (err) {
      console.error('Failed to reject call:', err);
    }
  };

  return (
    <div className="incoming-call-modal">
      {/* Animated top border */}
      <div className="incoming-call-glow" />

      {/* Header label */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: 12 }}>
        Incoming Video Call
      </div>

      {/* Caller info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={avatarSrc}
            alt={callerName}
            style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-2)' }}
          />
          <div className="call-pulse-dot" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {callerName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
            </svg>
            Calling you…
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn btn-danger btn-sm flex-1"
          style={{ justifyContent: 'center' }}
          onClick={handleDecline}
        >
          <IconX /> Decline
        </button>
        <button
          className="btn btn-green btn-sm flex-1"
          style={{ justifyContent: 'center' }}
          onClick={handleAccept}
        >
          <IconPhone /> Accept
        </button>
      </div>
    </div>
  );
};

export default IncomingCallModal;
