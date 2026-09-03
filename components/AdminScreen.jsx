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

const managedFeatures = [
  ['member_management', 'Members'],
  ['event_management', 'Events'],
  ['event_banners', 'Banners'],
  ['qr_checkin', 'QR check-in'],
  ['attendance_export', 'Reports'],
  ['analytics', 'Analytics'],
  ['branding', 'Branding']
];

function organizationFeatures(organization) {
  return Object.fromEntries(managedFeatures.map(([feature]) => [feature, organization.features?.[feature] ?? organization.subscription_plan === 'chapter']));
}

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

function updatedLabel(item) {
  const value = item.updated_at || item.created_at;
  if (!value) return 'Last updated: unavailable';
  return `Last updated: ${new Date(value).toLocaleDateString()}`;
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
  organizations = [],
  contactMessages = [],
  isSuperAdmin = false,
  onChangeOrganization,
  onChangeContactStatus,
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
  const [scanHistory, setScanHistory] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  const [eventQuery, setEventQuery] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventSort, setEventSort] = useState('date-desc');

  const [peopleQuery, setPeopleQuery] = useState('');
  const [peopleRoleFilter, setPeopleRoleFilter] = useState('all');
  const [peopleStateFilter, setPeopleStateFilter] = useState('all');
  const [peopleSort, setPeopleSort] = useState('name-asc');
  const [eventPage, setEventPage] = useState(1);
  const [peoplePage, setPeoplePage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(5);
  const [peoplePageSize, setPeoplePageSize] = useState(5);
  const [selectedPeople, setSelectedPeople] = useState([]);

  useEffect(() => {
    if (editingId) {
      setEvent(eventFormValues(events.find((item) => item.id === editingId)));
    }
  }, [editingId, events]);

  const filteredEvents = useMemo(() => {
    const query = eventQuery.trim().toLowerCase();
    const byQuery = events.filter((item) => (item?.title || '').toLowerCase().includes(query));
    const byStatus = eventStatusFilter === 'all' ? byQuery : byQuery.filter((item) => item.status === eventStatusFilter);
    return sortEvents(byStatus, eventSort);
  }, [events, eventQuery, eventStatusFilter, eventSort]);

  const filteredPeople = useMemo(() => {
    const query = peopleQuery.trim().toLowerCase();
    const byQuery = people.filter((person) => (person?.name || '').toLowerCase().includes(query));
    const byRole = peopleRoleFilter === 'all' ? byQuery : byQuery.filter((person) => (person.role || 'alumni') === peopleRoleFilter);
    const byState = peopleStateFilter === 'all'
      ? byRole
      : byRole.filter((person) => peopleStateFilter === 'active' ? person.is_active !== false : person.is_active === false);
    return sortPeople(byState, peopleSort);
  }, [people, peopleQuery, peopleRoleFilter, peopleStateFilter, peopleSort]);

  useEffect(() => {
    setEventPage(1);
  }, [eventQuery, eventStatusFilter, eventSort, eventPageSize]);

  useEffect(() => {
    setPeoplePage(1);
  }, [peopleQuery, peopleRoleFilter, peopleStateFilter, peopleSort, peoplePageSize]);

  const eventPageCount = Math.max(1, Math.ceil(filteredEvents.length / eventPageSize));
  const peoplePageCount = Math.max(1, Math.ceil(filteredPeople.length / peoplePageSize));
  useEffect(() => {
    setEventPage((page) => Math.min(page, eventPageCount));
  }, [eventPageCount]);

  useEffect(() => {
    setPeoplePage((page) => Math.min(page, peoplePageCount));
  }, [peoplePageCount]);

  const visibleEvents = filteredEvents.slice((eventPage - 1) * eventPageSize, eventPage * eventPageSize);
  const visiblePeople = filteredPeople.slice((peoplePage - 1) * peoplePageSize, peoplePage * peoplePageSize);
  const visiblePersonIds = visiblePeople.map((item) => item.user_id || item.id);
  const allVisiblePeopleSelected = visiblePersonIds.length > 0 && visiblePersonIds.every((id) => selectedPeople.includes(id));

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
      setScanHistory((current) => [{ ...result, checked_in_at: new Date().toISOString() }, ...current].slice(0, 10));
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
      setScanHistory((current) => [{ ...result, checked_in_at: new Date().toISOString() }, ...current].slice(0, 10));
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

  function scanNext() {
    setCheckInResult(null);
    setScannerOpen(true);
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

  async function changePersonRole(item, role) {
    if (role === item.role) return;
    const confirmed = onConfirm ? await onConfirm({
      title: 'Change member role?',
      message: `Change ${item.name || 'this member'} to ${role}?`,
      confirmLabel: 'Change role'
    }) : window.confirm(`Change ${item.name || 'this member'} to ${role}?`);
    if (confirmed) await onUpdatePerson(item.user_id || item.id, { role });
  }

  function togglePersonSelection(id) {
    setSelectedPeople((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  function toggleVisiblePeople() {
    setSelectedPeople((current) => allVisiblePeopleSelected
      ? current.filter((id) => !visiblePersonIds.includes(id))
      : [...new Set([...current, ...visiblePersonIds])]);
  }

  async function bulkUpdatePeople(isActive) {
    if (!selectedPeople.length) return;
    const confirmed = onConfirm ? await onConfirm({
      title: `${isActive ? 'Enable' : 'Disable'} selected members?`,
      message: `This will ${isActive ? 'enable' : 'disable'} ${selectedPeople.length} selected member${selectedPeople.length === 1 ? '' : 's'}.`,
      confirmLabel: isActive ? 'Enable members' : 'Disable members',
      danger: !isActive
    }) : window.confirm(`${isActive ? 'Enable' : 'Disable'} selected members?`);
    if (!confirmed) return;
    await Promise.all(selectedPeople.map((id) => onUpdatePerson(id, { is_active: isActive })));
    setSelectedPeople([]);
  }

  return <>
    <div className="screen-heading admin-console-heading">
      <div>
        <span className="section-kicker">CONTROL ROOM</span>
        <h2>Admin console</h2>
        <p>Create, update, and manage community events and profiles.</p>
      </div>
      <div className="admin-heading-actions">
        <span className="admin-badge">{people.length} PEOPLE · {events.length} EVENTS</span>
        <button type="button" className="primary-button icon-action-button" onClick={startCreate} aria-label="Create event" title="Create event"><span className="button-label">+ Create event</span></button>
      </div>
    </div>

    <nav className="admin-console-nav" aria-label="Admin console sections">
      <a className={activeSection === 'overview' ? 'active' : ''} href="#admin-overview" onClick={() => setActiveSection('overview')}>Overview</a>
      <a className={activeSection === 'events' ? 'active' : ''} href="#admin-events" onClick={() => setActiveSection('events')}>Events <span>{events.length}</span></a>
      <a className={activeSection === 'people' ? 'active' : ''} href="#admin-people" onClick={() => setActiveSection('people')}>People <span>{people.length}</span></a>
      <a className={activeSection === 'attendance' ? 'active' : ''} href="#admin-attendance" onClick={() => setActiveSection('attendance')}>Attendance</a>
      {isSuperAdmin && <><a className={activeSection === 'organizations' ? 'active' : ''} href="#admin-organizations" onClick={() => setActiveSection('organizations')}>Organizations <span>{organizations.length}</span></a><a className={activeSection === 'requests' ? 'active' : ''} href="#admin-requests" onClick={() => setActiveSection('requests')}>Requests <span>{contactMessages.length}</span></a></>}
    </nav>

    <div className="admin-overview-strip" id="admin-overview">
      <div><span>People</span><strong>{people.length}</strong><small>Member profiles</small></div>
      <div><span>Events</span><strong>{events.length}</strong><small>Published events</small></div>
      <div><span>Checked in</span><strong>{attendance.length}</strong><small>Attendance records</small></div>
      {isSuperAdmin && <div><span>Open requests</span><strong>{contactMessages.filter((item) => item.status === 'new').length}</strong><small>Need your attention</small></div>}
    </div>

    {(activeSection === 'overview' || activeSection === 'attendance') && <form className="check-in-form" id="admin-attendance" onSubmit={checkInGuest}>
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
        <button type="button" className="primary-button mobile-camera-action icon-action-button qr-icon-button" onClick={() => setScannerOpen(true)} aria-label="Use camera scanner" title="Use camera scanner">
          <span className="button-label">Use camera scanner</span>
        </button>
        <button className="secondary-button icon-action-button qr-icon-button" disabled={checkingIn} aria-label="Use pasted code" title="Use pasted code">
          <span className="button-label">{checkingIn ? 'Checking...' : 'Use pasted code'}</span>
        </button>
      </div>
      {scannerOpen && <QrScanner onScan={scan} onClose={() => setScannerOpen(false)} />}
      {checkInResult && <div className={checkInResult.detail ? 'check-in-result error' : 'check-in-result'}>
        {checkInResult.detail ? <p>{checkInResult.detail}</p> : <><div className="check-in-success"><span className="check-in-attendee-avatar">{checkInResult.attendee?.avatar_image ? <img src={checkInResult.attendee.avatar_image} alt="" /> : (checkInResult.attendee?.name || 'A').slice(0, 2).toUpperCase()}</span><span><strong>{checkInResult.attendee?.name || 'Attendee'}</strong><small>{checkInResult.event_title || 'Event'} · Checked in just now</small></span></div><button type="button" className="primary-button scan-next-button" onClick={scanNext}>Scan next <span aria-hidden="true">↗</span></button></>}
      </div>}
      {scanHistory.length > 0 && <div className="scan-history"><span className="section-kicker">THIS SESSION</span>{scanHistory.map((scanResult, index) => <div className="scan-history-item" key={`${scanResult.event_id || 'scan'}-${scanResult.attendee?.id || index}-${scanResult.checked_in_at}`}><span>{scanResult.attendee?.name || 'Attendee'}</span><small>{scanResult.event_title || 'Event'} · {new Date(scanResult.checked_in_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small></div>)}</div>}
    </form>}

    {activeSection === 'overview' && analytics && <div className="analytics-panel">
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

    {activeSection === 'overview' && <section className="admin-activity-panel" aria-labelledby="activity-heading">
      <div className="admin-activity-heading"><div><span className="section-kicker">TODAY'S ACTIVITY</span><h3 id="activity-heading">Recent check-ins</h3></div><button className="text-button" type="button" onClick={() => setActiveSection('attendance')}>View attendance <span aria-hidden="true">↗</span></button></div>
      {attendance.length ? <div className="admin-activity-list">{attendance.slice(0, 4).map((row) => <div className="admin-activity-item" key={row.id}><span className="admin-activity-status" aria-hidden="true">✓</span><span><strong>{row.attendee}</strong><small>{row.event_title}</small></span><time>{row.checked_in_at ? new Date(row.checked_in_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Today'}</time></div>)}</div> : <p className="empty-state">No check-ins recorded today.</p>}
    </section>}

    {activeSection === 'attendance' && <div className="attendance-panel" id="admin-attendance-list">
      <div>
        <span className="section-kicker">ATTENDANCE</span>
        <h3>Checked-in guests</h3>
      </div>
      <button className="text-button icon-action-button" type="button" onClick={exportAttendance} disabled={exporting} aria-label="Export attendance CSV" title="Export attendance CSV">
        <span className="button-label">{exporting ? 'Preparing CSV...' : 'Export CSV ↗'}</span>
      </button>
      {!attendance.length && <p className="empty-state">No check-ins yet.</p>}
      {attendance.map((row) => <div className="admin-row" key={row.id}>
        <span><strong>{row.attendee}</strong><small>{row.event_title} · {row.email}</small></span>
        <small>{row.checked_in_at ? new Date(row.checked_in_at).toLocaleString() : ''}</small>
      </div>)}
    </div>}

    {(activeSection === 'events' || activeSection === 'people') && <div className="admin-layout">
      <div className="admin-stack">
        {activeSection === 'events' && <div className="admin-events published-events" id="admin-events">
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
              <select className="admin-compact-select" value={eventPageSize} onChange={(eventObject) => setEventPageSize(Number(eventObject.target.value))} aria-label="Events per page">
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
              </select>
            </div>
          </div>
          <div className="admin-table" role="table" aria-label="Published events"><div className="admin-table-row admin-table-head" role="row"><span>Event</span><span>Date and location</span><span>Status</span><span>Actions</span></div>{visibleEvents.map((item) => <div className="admin-table-row" role="row" key={item.id}><span data-label="Event"><strong>{item.title}</strong><small className="table-updated">{updatedLabel(item)}</small></span><span data-label="Date and location">{item.date} · {item.location}</span><span className="table-status" data-label="Status">{item.status || 'upcoming'}</span><span className="row-actions" data-label="Actions"><button className="edit-button edit-icon-button icon-action-button" onClick={() => startEdit(item)} aria-label={`Edit ${item.title}`} title={`Edit ${item.title}`}>✎</button><button className="danger-icon icon-action-button" onClick={() => removeEvent(item)} aria-label={`Delete ${item.title}`} title={`Delete ${item.title}`}>×</button></span></div>)}</div>
          {eventPageCount > 1 && <div className="admin-pagination"><span>Page {eventPage} of {eventPageCount}</span><div><button type="button" className="table-action" onClick={() => setEventPage((page) => Math.max(1, page - 1))} disabled={eventPage === 1}>Previous</button><button type="button" className="table-action" onClick={() => setEventPage((page) => Math.min(eventPageCount, page + 1))} disabled={eventPage === eventPageCount}>Next</button></div></div>}
          {!filteredEvents.length && <p className="empty-state">No events match this view.</p>}
        </div>}

        {activeSection === 'people' && <div className="admin-events admin-people" id="admin-people">
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
              <select className="admin-compact-select" value={peoplePageSize} onChange={(eventObject) => setPeoplePageSize(Number(eventObject.target.value))} aria-label="People per page">
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
              </select>
            </div>
          </div>

          <div className="admin-bulk-toolbar"><label><input type="checkbox" checked={allVisiblePeopleSelected} onChange={toggleVisiblePeople} /> Select visible</label><span>{selectedPeople.length} selected</span><button type="button" className="table-action" disabled={!selectedPeople.length} onClick={() => bulkUpdatePeople(true)}>Enable</button><button type="button" className="table-action danger-table-action" disabled={!selectedPeople.length} onClick={() => bulkUpdatePeople(false)}>Disable</button></div>
          <div className="admin-table people-table" role="table" aria-label="People directory"><div className="admin-table-row admin-table-head" role="row"><span>Person</span><span>Class and company</span><span>Role</span><span>Account</span><span>Actions</span></div>{visiblePeople.map((item) => { const personId = item.user_id || item.id; return <div className="admin-table-row" role="row" key={item.id}><span className="admin-person-summary"><input type="checkbox" checked={selectedPeople.includes(personId)} onChange={() => togglePersonSelection(personId)} aria-label={`Select ${item.name || 'member'}`} />{item.avatar_image ? <img src={item.avatar_image} alt="" /> : <span className="admin-person-initials">{String(item.name || 'Unknown person').slice(0, 2).toUpperCase()}</span>}<strong>{item.name || 'Unknown person'}</strong><small className="table-updated">{updatedLabel(item)}</small></span><span>Class of {item.batch_year || '—'} · {item.current_company || 'No company'}<small className="table-updated">{updatedLabel(item)}</small></span><span><select className="role-select" value={item.role || 'alumni'} onChange={(eventObject) => changePersonRole(item, eventObject.target.value)}><option value="alumni">Alumni</option><option value="student">Student</option></select></span><span className="table-status">{item.is_active === false ? 'Disabled' : 'Active'}</span><span className="row-actions"><button className="status-button icon-action-button" onClick={() => onUpdatePerson(personId, { is_active: item.is_active === false })} aria-label={`${item.is_active === false ? 'Enable' : 'Disable'} ${item.name || 'member'}`} title={`${item.is_active === false ? 'Enable' : 'Disable'} ${item.name || 'member'}`}>{item.is_active === false ? '✓' : '⊘'}</button><button className="danger-icon icon-action-button" onClick={() => removePerson(item)} aria-label={`Remove ${item.name}`} title={`Remove ${item.name}`}>×</button></span></div>; })}</div>
          {peoplePageCount > 1 && <div className="admin-pagination"><span>Page {peoplePage} of {peoplePageCount}</span><div><button type="button" className="table-action" onClick={() => setPeoplePage((page) => Math.max(1, page - 1))} disabled={peoplePage === 1}>Previous</button><button type="button" className="table-action" onClick={() => setPeoplePage((page) => Math.min(peoplePageCount, page + 1))} disabled={peoplePage === peoplePageCount}>Next</button></div></div>}
          {!filteredPeople.length && <p className="empty-state">No people match this view.</p>}
        </div>}
      </div>
    </div>}

    {isSuperAdmin && activeSection === 'organizations' && <section className="superadmin-panel" id="admin-organizations">
      <div className="screen-heading compact-heading"><div><span className="section-kicker">PLATFORM MANAGEMENT</span><h2>Organizations and subscriptions</h2><p>Manage plan access, billing status, and Chapter capabilities for every school, college, or company.</p></div><span className="admin-badge">{organizations.length} ORGANIZATIONS</span></div>
      {!organizations.length && <p className="empty-state">No organizations have been created yet.</p>}
      {organizations.map((organization) => <div className="superadmin-row" key={organization.id}><div><strong>{organization.name}</strong><small>{organization.organization_type || 'school'} · {organization.member_count || 0} members · {organization.contact_email || 'No contact email'}</small><div className="feature-toggles">{managedFeatures.map(([feature, label]) => <label key={feature}><input type="checkbox" checked={organizationFeatures(organization)[feature]} onChange={(eventObject) => onChangeOrganization(organization.id, { features: { ...organizationFeatures(organization), [feature]: eventObject.target.checked } })} />{label}</label>)}</div></div><div className="superadmin-controls"><select value={organization.subscription_plan || 'community'} onChange={(eventObject) => onChangeOrganization(organization.id, { subscription_plan: eventObject.target.value })} aria-label={`Plan for ${organization.name}`}><option value="community">Community</option><option value="chapter">Chapter</option></select><select value={organization.subscription_status || 'active'} onChange={(eventObject) => onChangeOrganization(organization.id, { subscription_status: eventObject.target.value })} aria-label={`Status for ${organization.name}`}><option value="pending">Pending</option><option value="active">Active</option><option value="past_due">Past due</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select><input type="number" min="1" value={organization.member_limit || 500} onChange={(eventObject) => onChangeOrganization(organization.id, { member_limit: Number(eventObject.target.value) })} aria-label={`Member limit for ${organization.name}`} /></div></div>)}
    </section>}

    {isSuperAdmin && activeSection === 'requests' && <section className="superadmin-panel" id="admin-requests">
      <div className="screen-heading compact-heading"><div><span className="section-kicker">INBOX</span><h2>Chapter requests</h2><p>Review organizations that contacted the Alumni Meet team about Chapter access.</p></div><span className="admin-badge">{contactMessages.length} REQUESTS</span></div>
      {!contactMessages.length && <p className="empty-state">No contact requests yet.</p>}
      {contactMessages.map((message) => <div className="superadmin-row" key={message.id}><div><strong>{message.subject || 'Contact request'}</strong><small>{message.name} · {message.email} · {message.organization || 'Organization not provided'}</small></div><select value={message.status || 'new'} onChange={(eventObject) => onChangeContactStatus(message.id, eventObject.target.value)} aria-label={`Status for ${message.subject || 'contact request'}`}><option value="new">New</option><option value="contacted">Contacted</option><option value="proposal_sent">Proposal sent</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="closed">Closed</option></select></div>)}
    </section>}

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
