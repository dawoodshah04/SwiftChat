import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import useAuth from '../hooks/useAuth';
import useStreamChat from '../hooks/useStreamChat';
import { useFriends } from '../hooks/useFriends';
import { useVideoClient } from '../lib/videoContext';
import type { User } from '../types';
import type { Channel as StreamChannel } from 'stream-chat';

// ── Inline SVGs ───────────────────────────────────────────
const IconSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconMessage2 = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconVideo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6 6l.98-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
// ──────────────────────────────────────────────────────────

/* Conversation list item */
const ConvItem = ({ user, active, onClick }: { user: User; active: boolean; onClick: () => void }) => {
  const avatarSrc = user.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname)}&background=2a2a2a&color=efefef&size=64`;
  return (
    <div className={`conv-item${active ? ' active' : ''}`} onClick={onClick}>
      <div className="avatar-wrap">
        <img src={avatarSrc} className="avatar" width={36} height={36} alt={user.fullname} />
        <div className="online-ring" />
      </div>
      <div className="conv-item-info">
        <div className="conv-item-name">
          {user.fullname}
          <span className="conv-item-time">—</span>
        </div>
        <div className="conv-item-preview">
          {user.nativeLanguage && `${user.nativeLanguage} → ${user.learningLanguage}`}
        </div>
      </div>
    </div>
  );
};

/* Custom chat header with call buttons */
const ChatHeader = ({ friend, authUserId }: { friend: User; authUserId: string }) => {
  const navigate = useNavigate();
  const videoClient = useVideoClient();

  const avatarSrc = friend.profilePic ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.fullname)}&background=2a2a2a&color=efefef&size=64`;

  const initiateCall = async () => {
    if (!videoClient) { toast.error('Video client not ready, please wait a moment'); return; }
    try {
      const callId = [authUserId, friend._id].sort().join('_');
      const call = videoClient.call('default', callId, { reuseInstance: true });
      await call.getOrCreate({
        ring: true,
        data: {
          members: [{ user_id: authUserId }, { user_id: friend._id }],
        },
      });
      navigate(`/call/${callId}`);
    } catch (err) {
      console.error('Call initiation failed:', err);
      toast.error('Failed to start call');
    }
  };

  return (
    <div className="chat-hdr">
      <div className="avatar-wrap">
        <img src={avatarSrc} className="avatar" width={36} height={36} alt={friend.fullname} />
        <div className="online-ring" />
      </div>
      <div className="chat-hdr-info">
        <div className="chat-hdr-name">{friend.fullname}</div>
        <div className="chat-hdr-status">
          <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
          {friend.nativeLanguage && `${friend.nativeLanguage} → ${friend.learningLanguage}`}
        </div>
      </div>
      {/* Call action buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          className="btn-icon"
          onClick={initiateCall}
          title="Start video call"
          disabled={!videoClient}
          style={{ width: 34, height: 34, color: videoClient ? 'var(--green)' : 'var(--text-3)' }}
        >
          <IconVideo />
        </button>
        <button
          className="btn-icon"
          onClick={initiateCall}
          title="Start voice call"
          disabled={!videoClient}
          style={{ width: 34, height: 34 }}
        >
          <IconPhone />
        </button>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { client, isConnecting, error } = useStreamChat(authUser);
  const { data: friends = [] } = useFriends();

  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(null);
  const [search, setSearch] = useState('');

  const activeFriendId = userId || null;
  const activeFriend = friends.find(f => f._id === activeFriendId) ?? null;

  // Set the active channel whenever userId or client changes
  useEffect(() => {
    if (!activeFriendId || !authUser || isConnecting || !client.userID) return;

    const createChannel = async () => {
      try {
        const ch = client.channel('messaging', {
          members: [authUser._id, activeFriendId],
        });
        await ch.watch();
        setActiveChannel(ch);
      } catch (e) {
        console.error('Channel error', e);
      }
    };

    createChannel();
  }, [activeFriendId, authUser, isConnecting, client]);

  // Pick first friend if no userId in URL
  useEffect(() => {
    if (!userId && friends.length > 0) {
      navigate(`/chat/${friends[0]._id}`, { replace: true });
    }
  }, [userId, friends, navigate]);

  const filtered = search
    ? friends.filter(f => f.fullname.toLowerCase().includes(search.toLowerCase()))
    : friends;

  return (
    <div className="app-shell app-shell-chat">
      <Navbar />
      <Sidebar />

      {/* ── Conversation list ── */}
      <div className="conv-list">
        <div className="conv-header">
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Messages</div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', display: 'flex' }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '6px 10px 6px 30px', fontSize: 12, color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
        </div>
        <div className="conv-items">
          {filtered.map(friend => (
            <ConvItem
              key={friend._id}
              user={friend}
              active={friend._id === activeFriendId}
              onClick={() => navigate(`/chat/${friend._id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: '24px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-3)' }}>
              {friends.length === 0 ? 'Add friends to start chatting' : 'No conversations found'}
            </div>
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="chat-area">
        {isConnecting ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : error ? (
          <div className="empty-state">
            <div style={{ color: 'var(--red)', marginBottom: 8 }}>⚠ Connection error</div>
            <div className="empty-sub">{error}</div>
          </div>
        ) : !activeChannel ? (
          <div className="empty-state" style={{ flex: 1 }}>
            <IconMessage2 />
            <div className="empty-title" style={{ marginTop: 16 }}>
              {friends.length === 0 ? 'No friends yet' : 'Select a conversation'}
            </div>
            <div className="empty-sub">
              {friends.length === 0
                ? 'Discover people and send friend requests to start chatting.'
                : 'Choose a friend from the list to start messaging.'}
            </div>
            {friends.length === 0 && (
              <button className="btn btn-green btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/home')}>
                Discover people
              </button>
            )}
          </div>
        ) : (
          <Chat client={client} theme="str-chat__theme-dark">
            <Channel channel={activeChannel}>
              <Window>
                {/* Custom header with call buttons replaces ChannelHeader */}
                {activeFriend && authUser && (
                  <ChatHeader friend={activeFriend} authUserId={authUser._id} />
                )}
                <MessageList />
                <MessageComposer />
              </Window>
            </Channel>
          </Chat>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
