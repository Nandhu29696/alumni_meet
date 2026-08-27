import EventCard from './EventCard';

export default function Overview({ events, people, registered, onRsvp, onOpen, setActive }) {
  return <>
    <div className="welcome-band">
      <div>
        <span className="welcome-label">THE HALLWAY</span>
        <h2>Stay close to<br />
          <em>where you began.</em></h2>
        <p>Reconnect with the people and moments that made your school years special.</p>
        <button className="primary-button" onClick={() => setActive('Alumni directory')}>
          Explore the community <span>↗</span>
        </button>
      </div>
      <div className="sun-art">
        <span>✦</span>
        <div className="sun" />
        <div className="arch arch-one" />
        <div className="arch arch-two" />
      </div>
    </div>
    <div className="stats">
      <div>
        <span className="stat-label">COMMUNITY MEMBERS</span>
        <strong>{people.length}</strong>
        <small className="positive">Live directory</small>
      </div>
      <div>
        <span className="stat-label">UPCOMING EVENTS</span>
        <strong>{events.length.toString().padStart(2, '0')}</strong>
        <small>Events</small>
      </div>
      <div>
        <span className="stat-label">YOUR RSVPS</span>
        <strong>{registered.length}</strong>
        <small className="positive">Persistent</small>
      </div>
    </div>
    <div className="section-heading">
      <div>
        <span className="section-kicker">MARK YOUR CALENDAR</span>
        <h2>Upcoming events</h2>
      </div>
      <button className="text-button" onClick={() => setActive('Events')}>
        View all events ↗</button>
    </div>
    <div className="events-grid overview-events-grid">{events.slice(0, 3).map((event) =>
      <EventCard key={event.id} event={event}
        registered={registered.includes(event.id)}
        onRsvp={onRsvp} onOpen={onOpen} />
    )}
    </div>
  </>;
}
