import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { User } from '../../types';
import { useVideoClient } from '../../lib/videoContext';
import useAuth from '../../hooks/useAuth';

const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconMessage = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconVideo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

interface Props { user: User }

const FriendCard = ({ user }: Props) => {
  const navigate = useNavigate();
  const videoClient = useVideoClient();
  const { authUser } = useAuth();

  const avatarSrc = user.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=2a2a2a&color=efefef&size=128`;

  const initiateCall = async () => {
    if (!videoClient || !authUser) {
      toast.error('Video client not ready, please wait a moment');
      return;
    }
    try {
      const callId = [authUser._id, user._id].sort().join('_');
      const call = videoClient.call('default', callId, { reuseInstance: true });
      await call.getOrCreate({
        ring: true,
        data: {
          members: [{ user_id: authUser._id }, { user_id: user._id }],
        },
      });
      navigate(`/call/${callId}`);
    } catch (err) {
      console.error('Call initiation failed:', err);
      toast.error('Failed to start call');
    }
  };

  return (
    <article className="user-card">
      {/* Top */}
      <div className="uc-top">
        <div className="avatar-wrap">
          <img src={avatarSrc} className="avatar" width={46} height={46} alt={user.fullname} />
          <div className="online-ring" />
        </div>
        <div className="uc-info">
          <div className="uc-name">{user.fullname}</div>
          {user.location && (
            <div className="uc-location">
              <IconPin /> {user.location}
            </div>
          )}
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3, paddingTop: 2 }}>
          <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor" /></svg>
          Online
        </span>
      </div>

      {/* Languages */}
      {user.nativeLanguage && (
        <div className="uc-langs">
          <span className="lang-pill">{user.nativeLanguage}</span>
          <IconArrow />
          <span className="lang-pill lang-pill-green">{user.learningLanguage}</span>
        </div>
      )}

      {/* Bio */}
      {user.bio && <div className="uc-bio">{user.bio}</div>}

      {/* Actions */}
      <div className="uc-actions">
        <button
          className="btn btn-green btn-sm flex-1"
          style={{ justifyContent: 'center' }}
          onClick={() => navigate(`/chat/${user._id}`)}
        >
          <IconMessage /> Message
        </button>
        <button
          className="btn-icon"
          title={videoClient ? 'Start video call' : 'Video client initializing…'}
          onClick={initiateCall}
          disabled={!videoClient}
          style={{ color: videoClient ? 'var(--green)' : 'var(--text-3)', width: 34, height: 34 }}
        >
          <IconVideo />
        </button>
      </div>
    </article>
  );
};

export default FriendCard;
