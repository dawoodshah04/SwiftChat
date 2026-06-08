import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  StreamCall,
  useStreamVideoClient,
  useCallStateHooks,
  useCall,
  CallingState,
  SpeakerLayout,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import type { Call } from '@stream-io/video-react-sdk';

// ── Inline SVGs ───────────────────────────────────────────
const IconMicOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const IconMicOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const IconCamOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconCamOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"/>
  </svg>
);
const IconPhoneOff = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c.927.35 1.904.574 2.9.66A2 2 0 0 1 22 17v3a2 2 0 0 1-2.18 2c-7.11-.5-14.32-7.73-14.82-14.82A2 2 0 0 1 7 4h3a2 2 0 0 1 2 1.72c.086.996.31 1.973.66 2.9a2 2 0 0 1-.45 2.11L10.68 13.31z"/>
    <line x1="23" y1="1" x2="1" y2="23"/>
  </svg>
);

// ── Call Controls (inside StreamCall context) ─────────────
const CallControlsBar = () => {
  const call = useCall();
  const navigate = useNavigate();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCamOff } = useCameraState();

  const handleEndCall = async () => {
    try {
      await call?.leave();
    } catch (_) { /* ignore */ }
    navigate(-1);
  };

  return (
    <div className="call-controls-bar">
      {/* Mic toggle */}
      <button
        className={`call-ctrl-btn ${isMicMuted ? 'call-ctrl-muted' : 'call-ctrl-normal'}`}
        onClick={() => microphone.toggle()}
        title={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
      >
        {isMicMuted ? <IconMicOff /> : <IconMicOn />}
        <span className="call-ctrl-label">{isMicMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* End call */}
      <button className="call-ctrl-btn call-ctrl-end" onClick={handleEndCall} title="End call">
        <IconPhoneOff />
        <span className="call-ctrl-label">End</span>
      </button>

      {/* Camera toggle */}
      <button
        className={`call-ctrl-btn ${isCamOff ? 'call-ctrl-muted' : 'call-ctrl-normal'}`}
        onClick={() => camera.toggle()}
        title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
      >
        {isCamOff ? <IconCamOff /> : <IconCamOn />}
        <span className="call-ctrl-label">{isCamOff ? 'Start video' : 'Stop video'}</span>
      </button>
    </div>
  );
};

// ── Main call UI (inside StreamCall context) ──────────────
const CallUI = () => {
  const navigate = useNavigate();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Track if the call ever became active so we don't navigate away on initial IDLE state.
  // Without this guard, navigate(-1) fires before join() completes → user gets sent back.
  const hasBeenActive = useRef(false);
  if (
    callingState === CallingState.JOINED ||
    callingState === CallingState.JOINING ||
    callingState === CallingState.RINGING
  ) {
    hasBeenActive.current = true;
  }

  useEffect(() => {
    // Only navigate away AFTER the call has been active and then truly ended.
    if (hasBeenActive.current && callingState === CallingState.LEFT) {
      navigate(-1);
    }
  }, [callingState, navigate]);

  // Show connecting/ringing state without navigating away
  if (
    callingState === CallingState.JOINING ||
    callingState === CallingState.RINGING ||
    callingState === CallingState.IDLE
  ) {
    return (
      <div className="call-page">
        <div className="spinner-wrap" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
          <div className="spinner" />
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
            {callingState === CallingState.RINGING ? 'Ringing…' : 'Connecting to call…'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-page">
      <div className="call-video-area">
        <SpeakerLayout />
      </div>
      <CallControlsBar />
    </div>
  );
};

// ── CallPage ──────────────────────────────────────────────
const CallPage = () => {
  const { callId } = useParams<{ callId: string }>();
  const client = useStreamVideoClient();
  const navigate = useNavigate();
  const [call, setCall] = useState<Call | null>(null);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    if (!client || !callId) return;

    const c = client.call('default', callId, { reuseInstance: true });
    callRef.current = c;

    let mounted = true;

    const initCall = async () => {
      const currentState = c.state.callingState;

      if (currentState !== CallingState.JOINED && currentState !== CallingState.JOINING) {
        try {
          // IMPORTANT: fetch the call state first. This populates `c.state.createdBy`
          // so `c.isCreatedByMe` correctly evaluates to true for the caller.
          // Otherwise, `join()` thinks we are the callee and wrongly calls `accept()`, causing 400 Bad Request.
          await c.get();
          if (!mounted) return;

          await c.join({ create: false });
        } catch (err) {
          console.warn('[CallPage] join(create:false) failed, trying create:true:', err);
          if (!mounted) return;
          
          try {
            await c.join({ create: true });
          } catch (err2) {
            console.error('[CallPage] Could not join call:', err2);
            if (mounted) navigate(-1);
          }
        }
      }
      if (mounted) setCall(c);
    };

    initCall();

    return () => {
      mounted = false;
      callRef.current = null;
      // Intentionally NOT calling c.leave() here on unmount to survive React Strict Mode.
      // Users should explicitly click "End Call" to leave.
    };
  }, [client, callId, navigate]);

  if (!call) {
    return (
      <div className="call-page">
        <div className="spinner-wrap" style={{ minHeight: '100vh' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <CallUI />
    </StreamCall>
  );
};

export default CallPage;
