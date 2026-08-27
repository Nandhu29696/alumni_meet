export function setSession(tokens) {
  return tokens;
}

export function clearSession() {
  document.cookie.split(';').forEach((cookie) => { document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`); });
}

export function isSignedIn() {
  return typeof window !== 'undefined';
}
