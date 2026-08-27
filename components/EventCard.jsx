function eventStatusLabel(status = '') {
  const value = status.toLowerCase();
  if (value === 'completed') return 'Completed';
  if (value === 'cancelled') return 'Cancelled';
  return 'Upcoming';
}

export default function EventCard({ event, registered, onRsvp, onDelete, onOpen, admin }) {
  const date = event.month
    ? event
    : (() => {
      const value = new Date(event.date);
      return {
        month: value.toLocaleDateString('en', { month: 'short' }).toUpperCase(),
        day: value.getDate()
      };
    })();

  const statusClass = `event-status-chip ${String(event.status || 'upcoming').toLowerCase()}`;

  return <article className="event-card" onClick={() => onOpen?.(event)}>
    <div className="event-card-banner">
      {event.banner_image ? <img src={event.banner_image} alt="" /> : <div className="event-banner-fallback" />}
      <span className={statusClass}>{eventStatusLabel(event.status)}</span>
    </div>

    <div className="event-card-body">
      <div className="date-tile"><span>{date.month}</span><strong>{date.day}</strong></div>
      <div className="event-copy">
        <span className="tag">{event.event_type || event.type || 'COMMUNITY'}</span>
        <h3>{event.title}</h3>
        <p>{event.location || 'Location to be announced'}</p>
        <div className="event-actions">
          {admin
            ? <button className="rsvp-button danger" onClick={(eventObject) => { eventObject.stopPropagation(); onDelete(event.id); }}>Delete</button>
            : <button className={registered ? 'rsvp-button registered' : 'rsvp-button'} onClick={(eventObject) => { eventObject.stopPropagation(); onRsvp(event); }}>
              {registered ? '✓ Going' : 'RSVP now'} <span>↗</span>
            </button>}
        </div>
      </div>
    </div>
  </article>;
}
