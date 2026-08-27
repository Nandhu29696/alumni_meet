import EventCard from './EventCard';

export default function MyEventsScreen({ registrations, onOpen, onCancel }) {
  const active = registrations.filter((item) => item.status === 'registered');
  const attended = registrations.filter((item) => item.status === 'attended');
  function section(title, items, allowCancel) {
    return <section className="my-events-section"><div className="section-heading"><div><span className="section-kicker">{title === 'Registered' ? 'YOUR CALENDAR' : 'YOUR HISTORY'}</span><h2>{title}</h2></div><strong>{items.length}</strong></div><div className="events-grid events-list">{items.map((item) => <div key={item.id} className="my-event-item"><EventCard event={item.event || { id: item.event_id, title: item.event_title, date: item.created_at, location: 'Event details' }} registered={item.status === 'registered'} onOpen={onOpen} onRsvp={() => {}} /><div className="my-event-meta"><span>{item.status === 'attended' ? 'Attended' : 'Registered'}</span>{allowCancel && <button className="text-button" onClick={() => onCancel(item.event_id)}>Cancel RSVP</button>}</div></div>)}</div>{!items.length && <div className="empty-state">No {title.toLowerCase()} events yet.</div>}</section>;
  }
  return <div className="my-events-screen"><div className="screen-heading"><div><span className="section-kicker">YOUR GATHERINGS</span><h2>My events</h2><p>Keep track of upcoming RSVPs and the events you have attended.</p></div></div>{section('Registered', active, true)}{section('Attended', attended, false)}</div>;
}
