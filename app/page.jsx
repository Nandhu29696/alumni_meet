'use client';

import { useEffect, useState } from 'react';
import {
  apiRequest,
  adminEvents,
  cancelRsvp,
  checkIn,
  deleteEvent,
  deletePerson,
  getAlumni,
  getAlumniProfile,
  getAnalytics,
  getAttendance,
  getEvent,
  getEvents,
  getMyEvents,
  logout,
  refreshSession,
  rsvp,
  updateEvent,
  updateProfile,
  updatePerson,
  uploadProfileImages
} from '../services/api';
import AdminScreen from '../components/AdminScreen';
import AlumniDetailScreen from '../components/AlumniDetailScreen';
import ConfirmDialog from '../components/ConfirmDialog';
import DirectoryScreen from '../components/DirectoryScreen';
import EventDetailScreen from '../components/EventDetailScreen';
import EventsScreen from '../components/EventsScreen';
import MyEventsScreen from '../components/MyEventsScreen';
import Overview from '../components/Overview';
import ProfileScreen from '../components/ProfileScreen';
import Shell, { ProfileMenu } from '../components/Shell';
import ToastStack from '../components/ToastStack';

const tabs = [['Overview', '◒'], ['Alumni directory', '◌'], ['Events', '▣'], ['My events', '□'], ['My profile', '◉']];

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date()).toUpperCase();
}

function errorMessage(error, fallback) {
  return error?.message || fallback;
}

export default function Home() {
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState([]);
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [user, setUser] = useState({ name: 'Member' });
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [alumniPage, setAlumniPage] = useState(1);
  const [alumniHasMore, setAlumniHasMore] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  function notify(type, message) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3800);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function requestConfirm(options) {
    return new Promise((resolve) => {
      setConfirmState({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || 'Confirm',
        cancelLabel: options.cancelLabel || 'Cancel',
        danger: Boolean(options.danger),
        resolve
      });
    });
  }

  function closeConfirm(result) {
    if (confirmState?.resolve) confirmState.resolve(result);
    setConfirmState(null);
  }

  useEffect(() => {
    (async () => {
      try {
        let profile;
        try {
          profile = await apiRequest('/auth/profile/');
        } catch {
          await refreshSession();
          profile = await apiRequest('/auth/profile/');
        }

        setUser(profile);
        if (profile.role === 'admin' || profile.role === 'super_admin') {
          const [attendanceData, analyticsData] = await Promise.all([getAttendance(), getAnalytics()]);
          setAttendance(attendanceData.results);
          setAnalytics(analyticsData);
        }

        const [peopleData, eventsData, mine] = await Promise.all([getAlumni(), getEvents(), getMyEvents()]);
        setPeople(peopleData.results.filter((item) => item.role !== 'super_admin'));
        setAlumniHasMore(peopleData.has_next);
        setEvents(eventsData.results);
        setMyEvents(mine.results);
        setRegistered(mine.results.filter((item) => item.status === 'registered').map((item) => item.event_id));
      } catch {
        window.location.assign('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function saveProfile(profile) {
    try {
      setUser(await updateProfile(profile));
      notify('success', 'Profile saved.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not save profile.'));
    }
  }

  async function saveProfileImages(files) {
    try {
      const images = await uploadProfileImages(files);
      setUser((current) => ({ ...current, ...images }));
      notify('success', 'Profile images updated.');
      return images;
    } catch (error) {
      notify('error', errorMessage(error, 'Could not upload profile images.'));
      throw error;
    }
  }

  async function loadMorePeople() {
    try {
      const nextPage = alumniPage + 1;
      const result = await getAlumni(nextPage);
      setPeople((current) => [...current, ...result.results.filter((item) => item.role !== 'super_admin')]);
      setAlumniPage(nextPage);
      setAlumniHasMore(result.has_next);
    } catch (error) {
      notify('error', errorMessage(error, 'Could not load more people.'));
    }
  }

  async function openPerson(person) {
    try {
      setSelectedPerson(await getAlumniProfile(person.user_id || person.id));
    } catch {
      setSelectedPerson(person);
    }
  }

  async function openEvent(event) {
    try {
      setSelectedEvent(await getEvent(event.id));
    } catch {
      setSelectedEvent(event);
    }
  }

  async function registerFor(event) {
    setSelectedEvent(event);
    try {
      const registration = await rsvp(event.id);
      setRegistered((current) => current.includes(event.id) ? current : [...current, event.id]);
      setMyEvents((current) => [...current.filter((item) => item.event_id !== event.id), { ...registration, event }]);
      setSelectedEvent((current) => current ? {
        ...current,
        ...registration,
        is_registered: true,
        participant_count: (current.participant_count || 0) + 1,
        remaining_capacity: Math.max(0, (current.remaining_capacity ?? current.capacity ?? 100) - 1)
      } : current);
      notify('success', `RSVP confirmed for ${event.title}.`);
    } catch (error) {
      if (error.message.includes('Authentication')) {
        window.location.assign('/login');
        return;
      }
      notify('error', errorMessage(error, 'Could not register for this event.'));
    }
  }

  async function cancelEventRsvp(eventId) {
    const confirmed = await requestConfirm({
      title: 'Cancel RSVP?',
      message: 'Your spot will be released immediately.',
      confirmLabel: 'Cancel RSVP',
      danger: true
    });
    if (!confirmed) return;

    try {
      await cancelRsvp(eventId);
      setRegistered((current) => current.filter((id) => id !== eventId));
      setMyEvents((current) => current.map((item) => item.event_id === eventId ? { ...item, status: 'cancelled' } : item));
      notify('success', 'RSVP cancelled.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not cancel RSVP.'));
    }
  }

  async function loadAttendance() {
    try {
      const result = await getAttendance();
      setAttendance(result.results);
    } catch (error) {
      notify('error', errorMessage(error, 'Could not refresh attendance.'));
    }
  }

  async function editPerson(id, person) {
    if (!id) {
      notify('error', 'Could not update this profile: missing person id.');
      return;
    }

    if (Object.prototype.hasOwnProperty.call(person, 'is_active') && person.is_active === false) {
      const confirmed = await requestConfirm({
        title: 'Disable this user?',
        message: 'They will not be able to sign in until re-enabled.',
        confirmLabel: 'Disable user',
        danger: true
      });
      if (!confirmed) return;
    }

    try {
      await updatePerson(id, person);
      setPeople((current) => current.map((item) => ((item.user_id || item.id) === id ? { ...item, ...person } : item)));
      notify('success', 'Profile updated.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not update person.'));
    }
  }

  async function createEvent(event) {
    try {
      const created = await adminEvents(event);
      setEvents((current) => [created, ...current]);
      notify('success', 'Event published.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not create event.'));
      throw error;
    }
  }

  async function editEvent(id, event) {
    try {
      const updated = await updateEvent(id, event);
      setEvents((current) => current.map((item) => item.id === id ? updated : item));
      notify('success', 'Event updated.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not update event.'));
      throw error;
    }
  }

  async function removeEvent(id) {
    const confirmed = await requestConfirm({
      title: 'Delete event?',
      message: 'This action is permanent and cannot be undone.',
      confirmLabel: 'Delete event',
      danger: true
    });
    if (!confirmed) return;

    try {
      await deleteEvent(id);
      setEvents((current) => current.filter((event) => event.id !== id));
      notify('success', 'Event deleted.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not delete event.'));
    }
  }

  async function removePerson(id) {
    const confirmed = await requestConfirm({
      title: 'Remove person?',
      message: 'This will remove the profile from directory and admin listings.',
      confirmLabel: 'Remove person',
      danger: true
    });
    if (!confirmed) return;

    try {
      await deletePerson(id);
      setPeople((current) => current.filter((person) => person.user_id !== id && person.id !== id));
      notify('success', 'Person removed.');
    } catch (error) {
      notify('error', errorMessage(error, 'Could not remove person.'));
    }
  }

  const admin = user.role === 'admin' || user.role === 'super_admin';
  const navTabs = admin ? [...tabs, ['Admin console', '◆']] : tabs;
  const title = active === 'Overview' ? `${timeGreeting()}, ${user.name?.split(' ')[0] || 'there'}` : active;

  let screen;
  if (selectedEvent) {
    screen = <EventDetailScreen event={selectedEvent} registered={registered.includes(selectedEvent.id)} onRsvp={registerFor} onBack={() => setSelectedEvent(null)} />;
  } else if (selectedPerson) {
    screen = <AlumniDetailScreen person={selectedPerson} onBack={() => setSelectedPerson(null)} />;
  } else if (active === 'Overview') {
    screen = <Overview events={events} people={people} registered={registered} onRsvp={registerFor} onOpen={openEvent} setActive={setActive} />;
  }

  if (!selectedEvent && !selectedPerson && active === 'Events') {
    screen = <EventsScreen events={events} registered={registered} onRsvp={registerFor} onOpen={openEvent} loading={loading} />;
  }

  if (!selectedEvent && !selectedPerson && active === 'Alumni directory') {
    screen = <DirectoryScreen people={people} query={query} setQuery={setQuery} onOpen={openPerson} hasMore={alumniHasMore} onLoadMore={loadMorePeople} loading={loading} />;
  }

  if (!selectedEvent && !selectedPerson && active === 'My events') {
    screen = <MyEventsScreen registrations={myEvents} onOpen={openEvent} onCancel={cancelEventRsvp} />;
  }

  if (!selectedEvent && !selectedPerson && active === 'My profile') {
    screen = <ProfileScreen user={user} onSave={saveProfile} onUploadImages={saveProfileImages} />;
  }

  if (!selectedEvent && !selectedPerson && active === 'Admin console' && admin) {
    screen = <AdminScreen
      events={events}
      people={people}
      onCreateEvent={createEvent}
      onUpdateEvent={editEvent}
      onDeleteEvent={removeEvent}
      onDeletePerson={removePerson}
      onUpdatePerson={editPerson}
      onCheckIn={checkIn}
      attendance={attendance}
      analytics={analytics}
      onLoadAttendance={loadAttendance}
      onNotify={notify}
      onConfirm={requestConfirm}
    />;
  }

  return (
    <>
      <Shell active={active} setActive={setActive} navTabs={navTabs}>
        <section className="content">
          <header className="topbar">
            <div>
              <p className="kicker">{todayLabel()}</p>
              <h1>{title}</h1>
            </div>
            <div className="top-actions">
              <ProfileMenu user={user} onProfile={() => setActive('My profile')} onSignOut={async () => {
                try { await logout(); } finally { window.location.assign('/login'); }
              }} />
            </div>
          </header>
          {screen}
          {loading && <div className="loading-state" role="status" aria-live="polite">
            <span className="loading-line" /><span className="loading-line short" />
            <span className="loading-card" />
          </div>}
        </section>
      </Shell>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog
        open={Boolean(confirmState)}
        title={confirmState?.title || ''}
        message={confirmState?.message || ''}
        confirmLabel={confirmState?.confirmLabel || 'Confirm'}
        cancelLabel={confirmState?.cancelLabel || 'Cancel'}
        danger={Boolean(confirmState?.danger)}
        onCancel={() => closeConfirm(false)}
        onConfirm={() => closeConfirm(true)}
      />
    </>
  );
}
