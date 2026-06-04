import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../lib/axios';
import useAuth from '../../hooks/useAuth';
import { useFriendRequests } from '../../hooks/useFriends';

// ── Inline SVG Icons ──────────────────────────────────────
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
const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconBolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" />
  </svg>
);
// ──────────────────────────────────────────────────────────

const Navbar = () => {
  const { authUser } = useAuth();
  const { data: requests } = useFriendRequests();
  const pendingCount = requests?.incommingReq?.length ?? 0;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      queryClient.clear();
      navigate('/login');
      toast.success('Logged out');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="app-navbar">
      {/* Brand */}
      <NavLink to="/home" className="brand">
        <div className="brand-mark"><IconBolt /></div>
        <span className="brand-name">SwiftChat</span>
      </NavLink>

      {/* Nav links */}
      <div className="nav-items">
        <NavLink to="/home" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconSearch /> Discover
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconUsers /> Friends
        </NavLink>
        <NavLink to="/notifications" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} style={{ position: 'relative' }}>
          <IconBell /> Requests
          {pendingCount > 0 && <span className="badge-dot" />}
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <IconMessage /> Chat
        </NavLink>
      </div>

      {/* User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="user-menu-btn" onClick={handleLogout} title="Logout">
          <img
            src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullname || 'U')}&background=2a2a2a&color=efefef`}
            className="avatar"
            width={26} height={26}
            alt={authUser?.fullname}
          />
          <span className="user-menu-name">{authUser?.fullname?.split(' ')[0] ?? '…'}</span>
          <IconLogout />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
