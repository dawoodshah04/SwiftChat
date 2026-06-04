import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FriendCard from '../components/users/FriendCard';
import { useFriends } from '../hooks/useFriends';

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useFriends();
  const [tab, setTab] = useState<'all' | 'online'>('all');
  const navigate = useNavigate();

  const displayed = tab === 'online' ? friends : friends;

  return (
    <Layout>
      <div className="page-head">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">My Friends</h1>
            <p className="page-subtitle">Your language learning network · {friends.length} friends</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/home')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Find more
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${tab === 'all' ? ' active' : ''}`} onClick={() => setTab('all')}>
          All friends ({friends.length})
        </button>
        <button className={`tab-btn${tab === 'online' ? ' active' : ''}`} onClick={() => setTab('online')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="var(--green)" /></svg>
            Online
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="spinner-wrap" style={{ minHeight: 300 }}>
          <div className="spinner" />
        </div>
      ) : friends.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <div className="empty-title">No friends yet</div>
          <div className="empty-sub">
            Head to Discover to send friend requests and start building your network.
          </div>
          <button className="btn btn-green btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/home')}>
            Discover people
          </button>
        </div>
      ) : (
        <div className="users-grid">
          {displayed.map(friend => (
            <FriendCard key={friend._id} user={friend} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default FriendsPage;
