import { useState } from 'react';

function dateLabel(value) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function initials(name = '') { return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(); }

function qrFileName(eventTitle = 'event') {
  return `${eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'event'}-qr.png`;
}

export default function EventDetailScreen({ event, registered, onRsvp, onBack }) {
  const [busy, setBusy] = useState(false);

  async function register() {
    if (registered || event.is_registered || busy) return;
    setBusy(true);
    await onRsvp(event);
    setBusy(false);
  }

  function downloadQrCode() {
    if (!event.qr_code) return;
    const anchor = document.createElement('a');
    anchor.href = event.qr_code;
    anchor.download = qrFileName(event.title);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  const participantsCount = event.attendees_count || event.participant_count || event.participants?.length || 0;
  const capacity = event.capacity || 100;
  const remaining = event.remaining_capacity ?? Math.max(0, capacity - participantsCount);

  return <div className="event-detail-screen">
    <button className="back-button" onClick={onBack}>← Back to events</button>
    <div className="event-hero">
      <img src={event.banner_image} alt="" />
      <div className="event-hero-overlay">
        <span className="tag">{event.event_type || 'OFFLINE'} · {event.status || 'UPCOMING'}</span>
        <h2>{event.title}</h2>
      </div>
    </div>
    <div className="event-detail-grid">
      <section className="event-detail-main">
        <span className="section-kicker">ABOUT THIS EVENT</span>
        <p className="event-date">{dateLabel(`${event.date}T${event.time || '00:00'}`)}</p>
        <p className="event-location">⌖ {event.location}</p>
        <p className="event-description">{event.description || 'Join the community for an evening of meaningful conversations and familiar faces.'}</p>
        <div className="event-facts">
          <span>{event.is_free ? 'Free entry' : `₹${event.price}`}</span>
          <span>{event.event_type || 'Offline'}</span>
          <span>{event.waitlist_enabled ? 'Waitlist enabled' : 'RSVP required'}</span>
        </div>
        <button className={registered || event.is_registered ? 'primary-button detail-rsvp registered' : 'primary-button detail-rsvp'} onClick={register} disabled={busy || registered || event.is_registered}>
          {registered || event.is_registered ? '✓ You are going' : busy ? 'Joining...' : 'RSVP for this event'} <span>↗</span>
        </button>
        {event.qr_code && <div className="registration-qr">
          <div>
            <span className="section-kicker">YOUR ENTRY PASS</span>
            <h3>Show this QR at the door</h3>
            <small>Status: {event.registration_status === 'attended' ? 'Attended' : 'Registered'}</small>
            <button className="table-action qr-download" type="button" onClick={downloadQrCode}>Download QR</button>
          </div>
          <img src={event.qr_code} alt="Your event registration QR code" />
        </div>}
      </section>
      <aside className="participant-panel">
        <div className="participant-heading">
          <div><span className="section-kicker">THE ROOM</span><h3>Participants</h3></div>
          <strong>{participantsCount}<small> / {capacity}</small></strong>
        </div>
        <p className="capacity-note">{remaining > 0 ? `${remaining} seats remaining` : 'Event is at full capacity'}</p>
        <div className="participant-list">
          {(event.participants || []).slice(0, 12).map((person) => <div className="participant" key={person.id || person.email || person.name}>
            <span className="avatar">{person.avatar_image ? <img src={person.avatar_image} alt="" /> : initials(person.name)}</span>
            <span>
              <strong>{person.name || 'Community member'}</strong>
              <small>{person.email || 'Registered attendee'}</small>
            </span>
          </div>)}
          {!event.participants?.length && <p className="empty-participants">No participant list available yet.</p>}
        </div>
      </aside>
    </div>
  </div>;
}
