import { useEffect, useState } from 'react';

function initials(name = '') { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export default function AlumniDetailScreen({ person, onBack, onFollowToggle, currentUserId }) {
  const [followState, setFollowState] = useState({
    is_following: Boolean(person?.is_following),
    followers_count: Number(person?.followers_count || 0),
    following_count: Number(person?.following_count || 0),
  });

  useEffect(() => {
    setFollowState({
      is_following: Boolean(person?.is_following),
      followers_count: Number(person?.followers_count || 0),
      following_count: Number(person?.following_count || 0),
    });
  }, [person]);

  async function handleFollowToggle() {
    if (!onFollowToggle) return;
    const result = await onFollowToggle(person.user_id || person.id);
    if (result) {
      setFollowState({
        is_following: Boolean(result.is_following),
        followers_count: Number(result.followers_count || 0),
        following_count: Number(result.following_count || 0),
      });
    }
  }

  const isSelf = currentUserId && (person.user_id || person.id) === currentUserId;

  return <div className="profile-screen">
    <button className="back-button" onClick={onBack}>← Back to directory</button>
    <div className="profile-cover" style={person.cover_image ? { backgroundImage: `url(${person.cover_image})` } : undefined} />
    <div className="person-detail-header">
      <div className="avatar avatar-profile">{person.avatar_image ? <img src={person.avatar_image} alt={person.name} /> : initials(person.name)}</div>
      <div style={{ flex: 1 }}>
        <span className="section-kicker">ALUMNI PROFILE</span>
        <h2>{person.name}</h2>
        <p>{person.job_title || 'Alumni member'}{person.current_company ? ` at ${person.current_company}` : ''}</p>
      </div>
      {!isSelf && (
        <button className={followState.is_following ? 'secondary-button' : 'primary-button'} onClick={handleFollowToggle} type="button" style={{ minWidth: 130 }}>
          {followState.is_following ? 'Following' : 'Follow'}
        </button>
      )}
    </div>

    <div className="profile-detail-copy" style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', padding: '12px 0' }}>
        <span><strong>{followState.followers_count}</strong> followers</span>
        <span><strong>{followState.following_count}</strong> following</span>
        <span>Class of {person.batch_year || '—'}</span>
        <span>{person.location || 'India'}</span>
      </div>
      <p>{person.bio || 'This alumni member has not added a bio yet.'}</p>
    </div>
  </div>;
}
