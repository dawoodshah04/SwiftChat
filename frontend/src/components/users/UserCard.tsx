import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { User } from '../../types';
import { useSendFriendRequest } from '../../hooks/useFriends';

// SVGs
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
const IconAddFriend = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconProfile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

interface Props {
  user: User;
  sentRequestIds?: Set<string>;
}

const UserCard = ({ user, sentRequestIds }: Props) => {
  const navigate = useNavigate();
  const { mutate: sendRequest, isPending } = useSendFriendRequest();
  const alreadySent = sentRequestIds?.has(user._id) ?? false;

  const handleAdd = () => {
    sendRequest(user._id, {
      onSuccess: () => toast.success(`Request sent to ${user.fullname}`),
      onError: () => toast.error('Failed to send request'),
    });
  };

  const avatarSrc = user.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=2a2a2a&color=efefef&size=128`;

  return (
    <article className="user-card">
      {/* Top row */}
      <div className="uc-top">
        <div className="avatar-wrap">
          <img src={avatarSrc} className="avatar" width={44} height={44} alt={user.fullname} />
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
        {alreadySent ? (
          <button className="btn btn-ghost btn-sm flex-1" disabled style={{ color: 'var(--text-3)', cursor: 'default', justifyContent: 'center' }}>
            <IconClock /> Request sent
          </button>
        ) : (
          <button
            className="btn btn-green btn-sm flex-1"
            style={{ justifyContent: 'center' }}
            onClick={handleAdd}
            disabled={isPending}
          >
            <IconAddFriend /> {isPending ? 'Sending…' : 'Add Friend'}
          </button>
        )}
        <button className="btn-icon" onClick={() => navigate(`/chat/${user._id}`)} title="View profile">
          <IconProfile />
        </button>
      </div>
    </article>
  );
};

export default UserCard;
