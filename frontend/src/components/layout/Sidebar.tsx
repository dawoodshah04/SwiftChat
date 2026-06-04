import { NavLink } from 'react-router-dom';
import { useFriends, useFriendRequests } from '../../hooks/useFriends';
import type { User } from '../../types';

// ── Inline SVGs ───────────────────────────────────────────
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconMessage = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
// ──────────────────────────────────────────────────────────

interface FriendRowProps { user: User }

const FriendRow = ({ user }: FriendRowProps) => (
  <NavLink
    to={`/chat/${user._id}`}
    className="sf"
    style={({ isActive }) => isActive ? { background: 'var(--surface)' } : {}}
  >
    <div className="avatar-wrap">
      <img
        src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=2a2a2a&color=efefef`}
        className="avatar" width={30} height={30} alt={user.fullname}
      />
      <div className="online-ring" />
    </div>
    <div className="sf-info">
      <div className="sf-name">{user.fullname}</div>
      <div className="sf-lang">
        {user.nativeLanguage ? `${user.nativeLanguage} → ${user.learningLanguage}` : '…'}
      </div>
    </div>
  </NavLink>
);

const Sidebar = () => {
  const { data: friends = [] } = useFriends();
  const { data: requests } = useFriendRequests();
  const pendingCount = requests?.incommingReq?.length ?? 0;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-label">Menu</div>

      <NavLink to="/home" className={({ isActive }) => `s-link${isActive ? ' active' : ''}`}>
        <IconSearch /> Discover People
      </NavLink>
      <NavLink to="/friends" className={({ isActive }) => `s-link${isActive ? ' active' : ''}`}>
        <IconUsers /> My Friends
      </NavLink>
      <NavLink to="/notifications" className={({ isActive }) => `s-link${isActive ? ' active' : ''}`} style={{ position: 'relative' }}>
        <IconBell /> Requests
        {pendingCount > 0 && (
          <span className="badge-count s-link-count">{pendingCount}</span>
        )}
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `s-link${isActive ? ' active' : ''}`}>
        <IconMessage /> Messages
      </NavLink>

      {friends.length > 0 && (
        <>
          <div className="sidebar-label" style={{ marginTop: 12 }}>Online Now</div>
          {friends.slice(0, 5).map(f => (
            <FriendRow key={f._id} user={f} />
          ))}
        </>
      )}
    </aside>
  );
};

export default Sidebar;
