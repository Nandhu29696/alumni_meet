const SESSION_KEY = 'alumni_meet_auth';

export function getSession() {
  if (typeof window === 'undefined') return {};
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

export function setSession(session) {
  if (typeof window === 'undefined') return session;
  const current = getSession();
  const next = { ...current, ...session };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAccessToken() {
  return getSession().access_token || null;
}

export function getRefreshToken() {
  return getSession().refresh_token || null;
}

export function isSignedIn() {
  return Boolean(getAccessToken());
}
