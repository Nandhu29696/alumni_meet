import { useMemo, useState } from 'react';

function initials(name = '') { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

export default function DirectoryScreen({ people, query, setQuery, onOpen, hasMore, onLoadMore, loading = false }) {
  const [view, setView] = useState('grid');
  const filtered = useMemo(() => people.filter((person) => `${person.name} ${person.current_company} ${person.batch_year} ${person.location}`.toLowerCase().includes(query.toLowerCase())), [people, query]);

  return <>
    <div className="screen-heading">
      <div>
        <span className="section-kicker">THE COMMUNITY</span>
        <h2>Find your people</h2>
        <p>Browse alumni by name, batch, workplace, or city.</p>
      </div>
      <div className="directory-heading-tools">
        <label className="search">
          <span>⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" />
        </label>
        <div className="view-toggle" aria-label="Directory view">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} type="button">▦ Grid</button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} type="button">☷ Table</button>
        </div>
      </div>
    </div>

    {loading ? <div className="alumni-grid directory-grid skeleton-grid" role="status" aria-live="polite">
      {Array.from({ length: 8 }).map((_, index) => <article className="alumni-card skeleton-card" key={index} />)}
    </div> : view === 'grid' ? <>
      <div className="alumni-grid directory-grid">
        {filtered.map((person) => <article className="alumni-card" key={person.id || person.name}>
          <div className="avatar avatar-large teal">{person.avatar_image ? <img src={person.avatar_image} alt={person.name} /> : initials(person.name)}</div>
          <h3>{person.name}</h3>
          <p>{person.job_title || 'Alumni member'}{person.current_company ? <> at <strong>{person.current_company}</strong></> : null}</p>
          <div className="person-meta"><span>Class of {person.batch_year || '—'}</span><span>{person.location || 'India'}</span></div>
          <button className="connect-button" onClick={() => onOpen(person)}>View profile ↗</button>
        </article>)}
      </div>
      {!filtered.length && <div className="empty-state">No directory results. Try a different search.</div>}
    </> : <>
      <div className="data-table-wrap">
        <table className="data-table data-table-cards">
          <thead>
            <tr><th>Person</th><th>Role</th><th>Company</th><th>Class</th><th>Location</th><th>Action</th></tr>
          </thead>
          <tbody>
            {filtered.map((person) => <tr key={person.id || person.name} onClick={() => onOpen(person)}>
              <td data-label="Person"><div className="table-person">{person.avatar_image ? <img src={person.avatar_image} alt="" /> : <span>{initials(person.name)}</span>}<strong>{person.name}</strong></div></td>
              <td data-label="Role">{person.job_title || 'Alumni member'}</td>
              <td data-label="Company">{person.current_company || '—'}</td>
              <td data-label="Class">{person.batch_year || '—'}</td>
              <td data-label="Location">{person.location || 'India'}</td>
              <td data-label="Action"><button className="table-action" type="button" onClick={(event) => { event.stopPropagation(); onOpen(person); }}>Open</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {!filtered.length && <div className="empty-state">No directory rows to show in table view.</div>}
    </>}

    {hasMore && !loading && <div className="pagination-controls">
      <button className="table-action" onClick={onLoadMore} type="button">Load more people</button>
    </div>}
  </>;
}
