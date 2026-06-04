import { useState, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import UserCard from '../components/users/UserCard';
import { useRecommendedUsers, useOutgoingRequests } from '../hooks/useFriends';

const LANGS = ['Japanese', 'Korean', 'French', 'German', 'Portuguese', 'Spanish', 'Mandarin', 'Italian'];

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const HomePage = () => {
  const { data: users = [], isLoading } = useRecommendedUsers();
  const { data: outgoing = [] } = useOutgoingRequests();
  const [search, setSearch] = useState('');
  const [activeLang, setActiveLang] = useState('All');

  // Build a set of user IDs we've already sent requests to
  const sentIds = useMemo(
    () => new Set(outgoing.map(r => (typeof r.recipient === 'string' ? r.recipient : r.recipient._id))),
    [outgoing]
  );

  const filtered = useMemo(() => {
    let list = users;
    if (activeLang !== 'All') {
      list = list.filter(u => u.learningLanguage === activeLang || u.nativeLanguage === activeLang);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullname.toLowerCase().includes(q) ||
        u.location?.toLowerCase().includes(q) ||
        u.nativeLanguage?.toLowerCase().includes(q) ||
        u.learningLanguage?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, activeLang, search]);

  return (
    <Layout>
      <div className="page-head">
        <h1 className="page-title">Discover Partners</h1>
        <p className="page-subtitle">Find language learners that match your goals</p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <div className="search-wrap" style={{ flex: 1 }}>
          <span className="search-icon"><IconSearch /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, language, or location…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-ghost btn-sm"><IconFilter /> Filter</button>
      </div>

      {/* Filter chips */}
      <div className="filter-chips">
        {['All', ...LANGS].map(l => (
          <button key={l} className={`chip${activeLang === l ? ' active' : ''}`} onClick={() => setActiveLang(l)}>
            {l}
          </button>
        ))}
        <button className={`chip${activeLang === 'online' ? ' active' : ''}`} onClick={() => setActiveLang(activeLang === 'online' ? 'All' : 'online')}>
          <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="var(--green)" /></svg>
          Online only
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="spinner-wrap" style={{ minHeight: 300 }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="empty-title">No partners found</div>
          <div className="empty-sub">Try a different search or remove filters.</div>
        </div>
      ) : (
        <div className="users-grid">
          {filtered.map(user => (
            <UserCard key={user._id} user={user} sentRequestIds={sentIds} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
