import { useEffect, useMemo, useState } from 'react';
import { downloadAttendanceCsv, uploadEventBanner } from '../services/api';
import QrScanner from './QrScanner';

const emptyEvent = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  event_type: 'offline',
  banner_image: '',
  capacity: 50,
  registration_deadline: '',
  is_free: true,
  price: 0,
  status: 'upcoming',
  waitlist_enabled: false,
  is_active: true
};

function eventFormValues(event) {
  if (!event) return emptyEvent;
  const date = event.date ? new Date(event.date) : null;
  return {
    ...emptyEvent,
    ...event,
    date: date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : event.date || '',
    time: event.time?.slice(0, 5) || (date ? date.toISOString().slice(11, 16) : ''),
    registration_deadline: event.registration_deadline
      ? new Date(event.registration_deadline).toISOString().slice(0, 16)
      : ''
  };
}

function sortEvents(items, mode) {
  const cloned = [...items];
  if (mode === 'date-asc') return cloned.sort((a, b) => new Date(a.date) - new Date(b.date));
  if (mode === 'title-asc') return cloned.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return cloned.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function sortPeople(items, mode) {
  const cloned = [...items];
  if (mode === 'batch-desc') return cloned.sort((a, b) => (b.batch_year || 0) - (a.batch_year || 0));
  return cloned.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export default function AdminScreen({
  events,
  people,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onDeletePerson,
  onUpdatePerson,
  onCheckIn,
  attendance,
  analytics,
  onLoadAttendance,
  onNotify,
  onConfirm
}) {
  const [event, setEvent] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [qrToken, setQrToken] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [eventQuery, setEventQuery] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventSort, setEventSort] = useState('date-desc');

  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleRoleFilter, setPeopleRoleFilter] = useState('all');
  const [peopleStateFilter, setPeopleStateFilter] = useState('all');
  const [peopleSort, setPeopleSort] = useState('name-asc');

  useEffect(() => {
    if (editingId) {
      setEvent(eventFormValues(events.find((item) => item.id === editingId)));
    }
  }, [editingId, events]);

  const filteredEvents = useMemo(() => {
    const byQuery = events.filter((item) => item.title.toLowerCase().includes(eventQuery.toLowerCase()));
    const byStatus = eventStatusFilter === 'all' ? byQuery : byQuery.filter((item) => item.status === eventStatusFilter);
    return sortEvents(byStatus, eventSort);
  }, [events, eventQuery, eventStatusFilter, eventSort]);

  const filteredPeople = useMemo(() => {
    const byQuery = people.filter((person) => person.name.toLowerCase().includes(peopleQuery.toLowerCase()));
    const byRole = peopleRoleFilter === 'all' ? byQuery : byQuery.filter((person) => (person.role || 'alumni') === peopleRoleFilter);
    const byState = peopleStateFilter === 'all'
      ? byRole
      : byRole.filter((person) => peopleStateFilter === 'active' ? person.is_active !== false : person.is_active === false);
    return sortPeople(byState, peopleSort);
  }, [people, peopleQuery, peopleRoleFilter, peopleStateFilter, peopleSort]);

  function change(field, value) {
    setEvent((current) => ({ ...current, [field]: value }));
  }

  async function uploadBanner(file) {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const result = await uploadEventBanner(file);
      change('banner_image', result.banner_image);
    } catch (error) {
      setUploadError(error.message || 'Banner upload failed. Check backend availability.');
      onNotify?.('error', error.message || 'Banner upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEvent(emptyEvent);
    setModalOpen(false);
  }

  function startCreate() {
    setEditingId(null);
    setEvent(emptyEvent);
    setModalOpen(true);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEvent(eventFormValues(item));
    setModalOpen(true);
  }

  async function submit(eventObject) {
    eventObject.preventDefault();
    setSaving(true);
    const payload = {
      ...event,
      capacity: Number(event.capacity),
      price: Number(event.price),
      is_free: Number(event.price) === 0,
      registration_deadline: event.registration_deadline ? new Date(event.registration_deadline).toISOString() : null
    };
    try {
      if (editingId) {
        await onUpdateEvent(editingId, payload);
      } else {
        await onCreateEvent(payload);
      }
      cancelEdit();
    } catch (error) {
      onNotify?.('error', error.message || 'Unable to save event right now.');
    } finally {
      setSaving(false);
    }
  }

  async function checkInGuest(eventObject) {
    eventObject.preventDefault();
    setCheckingIn(true);
    setCheckInResult(null);
    try {
      const result = await onCheckIn(qrToken);
      setCheckInResult(result);
      setQrToken('');
      onLoadAttendance?.();
      onNotify?.('success', `Checked in ${result.attendee?.name || 'attendee'}.`);
    } catch (error) {
      setCheckInResult({ detail: error.message });
      onNotify?.('error', error.message || 'Check-in failed.');
    } finally {
      setCheckingIn(false);
    }
  }

  async function scan(value) {
    setScannerOpen(false);
    setQrToken(value);
    setCheckingIn(true);
    try {
      const result = await onCheckIn(value);
      setCheckInResult(result);
      onLoadAttendance?.();
      onNotify?.('success', `Checked in ${result.attendee?.name || 'attendee'}.`);
    } catch (error) {
      setCheckInResult({ detail: error.message });
      onNotify?.('error', error.message || 'Check-in failed.');
    } finally {
      setCheckingIn(false);
    }
  }

  async function exportAttendance() {
    setExporting(true);
    try {
      await downloadAttendanceCsv();
      onNotify?.('success', 'Attendance CSV downloaded.');
    } catch (error) {
      onNotify?.('error', error.message || 'Could not export attendance.');
      setCheckInResult({ detail: error.message });
    } finally {
      setExporting(false);
    }
  }

  async function removeEvent(item) {
    const confirmed = onConfirm ? await onConfirm({
      title: 'Delete event?',
      message: `This will permanently remove \"${item.title}\".`,
      confirmLabel: 'Delete event',
      danger: true
    }) : window.confirm(`Delete ${item.title}?`);
    if (!confirmed) return;
    await onDeleteEvent(item.id);
  }

  async function removePerson(item) {
    const confirmed = onConfirm ? await onConfirm({
      title: 'Remove person?',
      message: `This will remove ${item.name} from the directory.`,
      confirmLabel: 'Remove person',
      danger: true
    }) : window.confirm(`Remove ${item.name}?`);
    if (!confirmed) return;
    await onDeletePerson(item.user_id || item.id);
  }

  return <>
    <div className="screen-heading">
      <div>
        <span className="section-kicker">CONTROL ROOM</span>
        <h2>Admin console</h2>
        <p>Create, update, and manage community events and profiles.</p>
      </div>
      <div className="admin-heading-actions">
        <span className="admin-badge">{people.length} PEOPLE · {events.length} EVENTS</span>
        <button type="button" className="primary-button" onClick={startCreate}>+ Create event</button>
      </div>
    </div>

    <form className="check-in-form" onSubmit={checkInGuest}>
      <div>
        <span className="section-kicker">DOOR DESK</span>
        <h3>QR check-in</h3>
        <p>Scan a member code or paste its URL to mark attendance.</p>
      </div>
      <div className="check-in-controls">
        <input
          aria-label="Registration QR URL"
          placeholder="Paste scanned QR URL"
          value={qrToken}
          onChange={(eventObject) => setQrToken(eventObject.target.value)}
          required
        />
        <button type="button" className="primary-button mobile-camera-action" onClick={() => setScannerOpen(true)}>
          Use camera scanner
        </button>
        <button className="secondary-button" disabled={checkingIn}>
          {checkingIn ? 'Checking...' : 'Use pasted code'}
        </button>
      </div>
      {scannerOpen && <QrScanner onScan={scan} />}
      {checkInResult && <p className={checkInResult.detail ? 'check-in-result error' : 'check-in-result'}>
        {checkInResult.detail || `${checkInResult.attendee?.name} checked in for ${checkInResult.event_title}.`}
      </p>}
    </form>

    {analytics && <div className="analytics-panel">
      <div>
        <span className="section-kicker">SYSTEM OVERVIEW</span>
        <h3>Dashboard analytics</h3>
      </div>
      <div className="analytics-grid">
        <div><small>Total users</small><strong>{analytics.users.total}</strong><span>{analytics.users.active} active</span></div>
        <div><small>Events</small><strong>{analytics.events.total}</strong><span>{analytics.events.upcoming} upcoming</span></div>
        <div><small>Participation</small><strong>{analytics.participation.registrations}</strong><span>{analytics.participation.attended} attended</span></div>
        <div><small>User growth</small><strong>+{analytics.growth.users_last_30_days}</strong><span>Last 30 days</span></div>
      </div>
    </div>}

    <div className="attendance-panel">
      <div>
        <span className="section-kicker">ATTENDANCE</span>
        <h3>Checked-in guests</h3>
      </div>
      <button className="text-button" type="button" onClick={exportAttendance} disabled={exporting}>
        {exporting ? 'Preparing CSV...' : 'Export CSV ↗'}
      </button>
      {!attendance.length && <p className="empty-state">No check-ins yet.</p>}
      {attendance.map((row) => <div className="admin-row" key={row.id}>
        <span><strong>{row.attendee}</strong><small>{row.event_title} · {row.email}</small></span>
        <small>{row.checked_in_at ? new Date(row.checked_in_at).toLocaleString() : ''}</small>
      </div>)}
    </div>

    <div className="admin-layout">
      <div className="admin-stack">
        <div className="admin-events published-events">
          <div className="directory-toolbar">
            <h3>Published events</h3>
            <div className="admin-toolbar-controls">
              <label className="admin-search">
                <span>⌕</span>
                <input value={eventQuery} onChange={(eventObject) => setEventQuery(eventObject.target.value)} placeholder="Search by event name" />
              </label>
              <select className="admin-compact-select" value={eventStatusFilter} onChange={(eventObject) => setEventStatusFilter(eventObject.target.value)}>
                <option value="all">All status</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select className="admin-compact-select" value={eventSort} onChange={(eventObject) => setEventSort(eventObject.target.value)}>
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="title-asc">Title A-Z</option>
              </select>
            </div>
          </div>
          {filteredEvents.map((item) => <div className="admin-row" key={item.id}>
            <span>
              <strong>{item.title}</strong>
              <small>{item.date} · {item.location}</small>
            </span>
            <div className="row-actions">
              <button className="edit-button edit-icon-button" onClick={() => startEdit(item)} aria-label={`Edit ${item.title}`} title="Edit event">✎</button>
              <button className="danger-icon" onClick={() => removeEvent(item)} aria-label={`Delete ${item.title}`}>×</button>
            </div>
          </div>)}
          {!filteredEvents.length && <p className="empty-state">No events match this view.</p>}
        </div>

        <div className="admin-events admin-people">
          <div className="directory-toolbar">
            <h3>People directory</h3>
            <div className="admin-toolbar-controls">
              <label className="admin-search">
                <span>⌕</span>
                <input value={peopleQuery} onChange={(eventObject) => setPeopleQuery(eventObject.target.value)} placeholder="Search by name" />
              </label>
              <select className="admin-compact-select" value={peopleRoleFilter} onChange={(eventObject) => setPeopleRoleFilter(eventObject.target.value)}>
                <option value="all">All roles</option>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
              </select>
              <select className="admin-compact-select" value={peopleStateFilter} onChange={(eventObject) => setPeopleStateFilter(eventObject.target.value)}>
                <option value="all">All state</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
              <select className="admin-compact-select" value={peopleSort} onChange={(eventObject) => setPeopleSort(eventObject.target.value)}>
                <option value="name-asc">Name A-Z</option>
                <option value="batch-desc">Newest batch</option>
              </select>
            </div>
          </div>

          {filteredPeople.map((item) => <div className="admin-row" key={item.id}>
            <span className="admin-person-summary">
              {item.avatar_image ? <img src={item.avatar_image} alt="" /> : <span className="admin-person-initials">{item.name.slice(0, 2).toUpperCase()}</span>}
              <span>
                <strong>{item.name}</strong>
                <small>Class of {item.batch_year || '—'} · {item.current_company || 'No company'}</small>
              </span>
            </span>
            <div className="row-actions">
              <select className="role-select" value={item.role || 'alumni'} onChange={(eventObject) => onUpdatePerson(item.user_id || item.id, { role: eventObject.target.value })}>
                <option value="alumni">Alumni</option>
                <option value="student">Student</option>
              </select>
              <button className="status-button" onClick={() => onUpdatePerson(item.user_id || item.id, { is_active: item.is_active === false })}>
                {item.is_active === false ? 'Enable' : 'Disable'}
              </button>
              <button className="danger-icon" onClick={() => removePerson(item)} aria-label={`Remove ${item.name}`}>×</button>
            </div>
          </div>)}
          {!filteredPeople.length && <p className="empty-state">No people match this view.</p>}
        </div>
      </div>
    </div>

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(eventObject) => { if (eventObject.target === eventObject.currentTarget) cancelEdit(); }}>
      <form className="admin-form event-modal" onSubmit={submit}>
        <div className="modal-heading">
          <div>
            <span className="section-kicker">EVENT EDITOR</span>
            <h3>{editingId ? 'Edit event' : 'Create an event'}</h3>
          </div>
          <button type="button" className="modal-close" onClick={cancelEdit} aria-label="Close event editor">×</button>
        </div>

        <label>Title<input required value={event.title} onChange={(eventObject) => change('title', eventObject.target.value)} /></label>
        <label>Description<textarea required value={event.description} onChange={(eventObject) => change('description', eventObject.target.value)} /></label>

        <div className="modal-two-col">
          <label>Date<input required type="date" value={event.date} onChange={(eventObject) => change('date', eventObject.target.value)} /></label>
          <label>Start time<input required type="time" value={event.time} onChange={(eventObject) => change('time', eventObject.target.value)} /></label>
        </div>

        <label>Location or online link<input required value={event.location} onChange={(eventObject) => change('location', eventObject.target.value)} /></label>

        <div className="modal-two-col">
          <label>Event type
            <select value={event.event_type} onChange={(eventObject) => change('event_type', eventObject.target.value)}>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label>Capacity<input required type="number" min="1" value={event.capacity} onChange={(eventObject) => change('capacity', eventObject.target.value)} /></label>
        </div>

        <label>Banner image
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(eventObject) => uploadBanner(eventObject.target.files?.[0])} />
          {uploading && <small className="upload-status">Uploading image...</small>}
          {uploadError && <small className="upload-status">{uploadError}</small>}
          {event.banner_image && <img className="banner-preview" src={event.banner_image} alt="Event banner preview" />}
        </label>

        <div className="modal-two-col">
          <label>Registration deadline
            <input type="datetime-local" value={event.registration_deadline} onChange={(eventObject) => change('registration_deadline', eventObject.target.value)} />
          </label>
          <label>Ticket price
            <input type="number" min="0" value={event.price} onChange={(eventObject) => change('price', eventObject.target.value)} />
          </label>
        </div>

        <div className="modal-two-col">
          <label>Status
            <select value={event.status} onChange={(eventObject) => change('status', eventObject.target.value)}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label>Active
            <select value={event.is_active ? 'yes' : 'no'} onChange={(eventObject) => change('is_active', eventObject.target.value === 'yes')}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div className="modal-checks">
          <label className="check-field"><input type="checkbox" checked={event.waitlist_enabled} onChange={(eventObject) => change('waitlist_enabled', eventObject.target.checked)} />Enable waitlist</label>
          <label className="check-field"><input type="checkbox" checked={Number(event.price) === 0} onChange={(eventObject) => change('price', eventObject.target.checked ? 0 : event.price || 100)} />Free event</label>
        </div>

        <div className="form-footer">
          <button type="button" className="secondary-button" onClick={cancelEdit}>Cancel</button>
          <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create event'}</button>
        </div>
      </form>
    </div>}
  </>;
}
