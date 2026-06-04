import toast from 'react-hot-toast';
import type { FriendRequest } from '../../types';
import { useAcceptFriendRequest } from '../../hooks/useFriends';

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconDot = () => (
  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-3)', display: 'inline-block' }} />
);

interface Props { request: FriendRequest }

const FriendRequestCard = ({ request }: Props) => {
  const { mutate: accept, isPending } = useAcceptFriendRequest();
  const sender = request.sender;

  const handleAccept = () => {
    accept(request._id, {
      onSuccess: () => toast.success(`You're now friends with ${sender.fullname}!`),
      onError: () => toast.error('Failed to accept request'),
    });
  };

  const avatarSrc = sender.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(sender.fullname)}&background=2a2a2a&color=efefef&size=128`;

  const timeAgo = (date: string) => {
    const ms = Date.now() - new Date(date).getTime();
    const h = Math.floor(ms / 3600000);
    if (h < 1) return 'Just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="notif-row">
      <img src={avatarSrc} className="avatar" width={42} height={42} alt={sender.fullname} />
      <div className="notif-body">
        <div className="notif-text">
          <span>{sender.fullname}</span> sent you a friend request
        </div>
        <div className="notif-meta">
          {sender.nativeLanguage && <>{sender.nativeLanguage} → {sender.learningLanguage}</>}
          {sender.location && <><IconDot /> {sender.location}</>}
          <IconDot /> {timeAgo(request.createdAt)}
        </div>
      </div>
      <div className="notif-actions">
        <button className="btn btn-green btn-sm" onClick={handleAccept} disabled={isPending}>
          <IconCheck /> {isPending ? 'Accepting…' : 'Accept'}
        </button>
        <button className="btn-icon" title="Decline">
          <IconX />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
