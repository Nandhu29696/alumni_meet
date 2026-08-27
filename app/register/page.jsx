'use client';

import '../auth.css';
import Link from 'next/link';
import { useState } from 'react';
import { registerAccount } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await registerAccount(form); window.location.assign('/login'); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="auth-shell"><section className="auth-card"><div className="auth-logo"><span className="auth-logo-mark">AM</span><span>Alumni<br /><strong>Meet</strong></span></div><h1>Join the hallway</h1><p>Create your alumni profile and start reconnecting.</p><form onSubmit={submit}><label>Full name<input required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Password<input type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className="auth-error">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button></form><Link className="auth-link" href="/login">Already have an account? Sign in</Link></section></main>;
}
