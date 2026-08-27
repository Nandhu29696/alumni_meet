import { useMemo, useState } from 'react';
import EventCard from './EventCard';

export default function EventsScreen({ events, registered, onRsvp, onOpen, loading = false }) {
  const [filters, setFilters] = useState({ type: '', location: '', status: 'upcoming', date: '' });
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => events.filter((event) => (
    `${event.title} ${event.location}`.toLowerCase().includes(search.toLowerCase())
    && (!filters.type || event.event_type === filters.type)
    && (!filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase()))
    && (!filters.status || event.status === filters.status)
    && (!filters.date || event.date === filters.date)
  )), [events, search, filters]);

  const visible = filtered.slice((page - 1) * 6, page * 6);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6));

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters({ type: '', location: '', status: 'upcoming', date: '' });
    setSearch('');
    setPage(1);
  }

  return <>
    <div className="screen-heading">
      <div>
        <span className="section-kicker">MARK YOUR CALENDAR</span>
        <h2>Community events</h2>
        <p>Join reunions, conversations, and gatherings hosted by your community.</p>
      </div>
    </div>

    <div className="event-toolbar">
      <label className="list-search">
        <span>⌕</span>
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search events" />
      </label>
      <div className="event-tools-right">
        <button type="button" className="filter-toggle" onClick={() => setFiltersOpen((value) => !value)} aria-expanded={filtersOpen}>
          {filtersOpen ? 'Hide filters' : 'Filters'}
        </button>
        <div className="view-toggle" aria-label="Event view">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} type="button">▦ Grid</button>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} type="button">☷ Table</button>
        </div>
      </div>
    </div>

    <div className={filtersOpen ? 'event-filter-panel mobile-open' : 'event-filter-panel'}>
      <div className="event-filters">
        <input type="date" value={filters.date} onChange={(event) => updateFilter('date', event.target.value)} />
        <select value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>
          <option value="">All types</option>
          <option value="offline">Offline</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <input placeholder="Filter location" value={filters.location} onChange={(event) => updateFilter('location', event.target.value)} />
        <select value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
          <option value="">All status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="event-filter-actions">
        <button type="button" className="text-button filter-reset" onClick={resetFilters}>Reset filters</button>
      </div>
    </div>

    {loading ? <div className="events-grid events-list skeleton-grid" role="status" aria-live="polite">
      {Array.from({ length: 6 }).map((_, index) => <article className="event-card skeleton-card" key={index} />)}
    </div> : view === 'grid' ? <>
      <div className="events-grid events-list">
        {visible.map((event) => <EventCard key={event.id} event={event} registered={registered.includes(event.id)} onRsvp={onRsvp} onOpen={onOpen} />)}
      </div>
      {!visible.length && <div className="empty-state">No events match your filters.</div>}
    </> : <>
      <div className="data-table-wrap">
        <table className="data-table data-table-cards">
          <thead>
            <tr><th>Event</th><th>Date</th><th>Location</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {visible.map((event) => <tr key={event.id}>
              <td data-label="Event"><strong>{event.title}</strong></td>
              <td data-label="Date">{event.date || '—'}</td>
              <td data-label="Location">{event.location || '—'}</td>
              <td data-label="Status"><span className="status-chip">{event.status || 'upcoming'}</span></td>
              <td data-label="Action">
                <div className="table-action-group">
                  <button
                    className="table-icon-action"
                    type="button"
                    onClick={() => onOpen(event)}
                    data-tooltip="Open"
                    aria-label="Open event"
                  >
                    ↗
                  </button>
                  <button
                    className={registered.includes(event.id) ? 'table-icon-action is-active' : 'table-icon-action'}
                    type="button"
                    disabled={registered.includes(event.id)}
                    onClick={() => onRsvp(event)}
                    data-tooltip={registered.includes(event.id) ? 'Going' : 'RSVP now'}
                    aria-label={registered.includes(event.id) ? 'Going' : 'RSVP now'}
                  >
                    {registered.includes(event.id) ? '✓' : '+'}
                  </button>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {!visible.length && <div className="empty-state">No events in table view for this filter.</div>}
    </>}

    {filtered.length > 6 && <div className="pagination-controls">
      <button type="button" className="table-action" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
      <span className="pagination-label">Page {page} of {pageCount}</span>
      <button type="button" className="table-action" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
    </div>}
  </>;
}
