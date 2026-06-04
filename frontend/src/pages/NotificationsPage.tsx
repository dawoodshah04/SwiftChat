import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import FriendRequestCard from '../components/notifications/FriendRequestCard';
import { useFriendRequests, useOutgoingRequests } from '../hooks/useFriends';

const NotificationsPage = () => {
  const [tab, setTab] = useState<'incoming' | 'accepted' | 'outgoing'>('incoming');
  const { data: requests, isLoading } = useFriendRequests();
  const { data: outgoing = [] } = useOutgoingRequests();

  const incoming = requests?.incommingReq ?? [];
  const accepted = requests?.acceptedReq ?? [];

  return (
    <Layout>
      <div className="page-head">
        <h1 className="page-title">Friend Requests</h1>
        <p className="page-subtitle">Manage your incoming and outgoing requests</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${tab === 'incoming' ? ' active' : ''}`} onClick={() => setTab('incoming')}>
          Incoming
          {incoming.length > 0 && (
            <span className="badge-count" style={{ marginLeft: 6 }}>{incoming.length}</span>
          )}
        </button>
        <button className={`tab-btn${tab === 'accepted' ? ' active' : ''}`} onClick={() => setTab('accepted')}>
          Accepted
        </button>
        <button className={`tab-btn${tab === 'outgoing' ? ' active' : ''}`} onClick={() => setTab('outgoing')}>
          Outgoing
        </button>
      </div>

      {isLoading ? (
        <div className="spinner-wrap" style={{ minHeight: 240 }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* ── Incoming ── */}
          {tab === 'incoming' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {incoming.length === 0 ? (
                <div className="empty-state">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <div className="empty-title">No incoming requests</div>
                  <div className="empty-sub">When someone sends you a request, it'll appear here.</div>
                </div>
              ) : (
                incoming.map(req => <FriendRequestCard key={req._id} request={req} />)
              )}
            </div>
          )}

          {/* ── Accepted ── */}
          {tab === 'accepted' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {accepted.length === 0 ? (
                <div className="empty-state">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div className="empty-title">No accepted requests yet</div>
                  <div className="empty-sub">Accepted friend requests will appear here.</div>
                </div>
              ) : (
                accepted.map(req => {
                  const user = req.sender;
                  const avatarSrc = user.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=2a2a2a&color=efefef&size=64`;
                  return (
                    <div key={req._id} className="accepted-row">
                      <div className="accepted-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <img src={avatarSrc} className="avatar" width={32} height={32} alt={user.fullname} />
                      <div style={{ flex: 1, fontSize: 13, color: 'var(--text-2)' }}>
                        <strong style={{ color: 'var(--text)' }}>{user.fullname}</strong> accepted your request — you're now friends!
                      </div>
                      <Link to={`/chat/${user._id}`} className="btn btn-ghost btn-sm">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        Chat
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── Outgoing ── */}
          {tab === 'outgoing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {outgoing.length === 0 ? (
                <div className="empty-state">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  <div className="empty-title">No outgoing requests</div>
                  <div className="empty-sub">Requests you've sent will appear here.</div>
                </div>
              ) : (
                outgoing.map(req => {
                  const recipient = typeof req.recipient === 'string' ? null : req.recipient;
                  if (!recipient) return null;
                  const avatarSrc = recipient.profilePic ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.fullname)}&background=2a2a2a&color=efefef&size=128`;
                  return (
                    <div key={req._id} className="notif-row">
                      <img src={avatarSrc} className="avatar" width={42} height={42} alt={recipient.fullname} />
                      <div className="notif-body">
                        <div className="notif-text">You sent a request to <span>{recipient.fullname}</span></div>
                        <div className="notif-meta">
                          {recipient.nativeLanguage} → {recipient.learningLanguage}
                        </div>
                      </div>
                      <span className="lang-pill" style={{ fontSize: 11, flexShrink: 0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        Pending
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default NotificationsPage;
