'use client';

import '../auth.css';
import Link from 'next/link';
import { useState } from 'react';
import { login } from '../../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await login(form); window.location.assign('/'); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="auth-shell"><section className="auth-card"><div className="auth-logo"><span className="auth-logo-mark">AM</span><span>Alumni<br /><strong>Meet</strong></span></div><h1>Welcome back</h1><p>Return to the people and places that shaped you.</p><form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><Link className="forgot-link" href="/forgot-password">Forgot password?</Link>{error && <p className="auth-error">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form><Link className="auth-link" href="/register">Create an account</Link></section></main>;
}
