'use client';

import '../auth.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getErrorMessage, registerAccount } from '../../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', tenant_id: '', role_id: '' });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackendapi.vercel.app/api'}/auth/roles/`, { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Could not load membership roles');
        }
        const data = await response.json();
        const options = (data.roles || []).filter((role) => role.code === 'alumni' || role.code === 'student');
        setRoles(options);
        if (options[0]) setForm((current) => ({ ...current, role_id: current.role_id || options[0].id }));
      } catch {
        setRoles([
          { id: 'alumni', code: 'alumni', name: 'Alumni' },
          { id: 'student', code: 'student', name: 'Student' }
        ]);
      } finally {
        setLoadingRoles(false);
      }
    }
    loadRoles();
  }, []);

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        tenant_id: form.tenant_id.trim(),
        role_id: form.role_id,
      };
      if (!payload.name || payload.name.length < 2) {
        throw new Error('Please enter your full name.');
      }
      if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        throw new Error('Please enter a valid email address.');
      }
      if (!payload.tenant_id) {
        throw new Error('Please enter your college or tenant code.');
      }
      if (!payload.role_id) {
        throw new Error('Please choose a role.');
      }
      if (payload.password.length < 8) {
        throw new Error('Password must be at least 8 characters long.');
      }
      await registerAccount(payload);
      window.location.assign('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create your account right now.'));
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-shell"><section className="auth-card"><div className="auth-logo"><span className="auth-logo-mark">AM</span><span>Alumni<br /><strong>Meet</strong></span></div><h1>Join the hallway</h1><p>Create your alumni profile and join your institution community.</p><form onSubmit={submit}><label>Full name<input required minLength="2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>College or tenant code<input required minLength="2" placeholder="e.g. northview" value={form.tenant_id} onChange={(event) => setForm({ ...form, tenant_id: event.target.value.trim() })} /></label><label>Role<select value={form.role_id} onChange={(event) => setForm({ ...form, role_id: event.target.value })} disabled={loadingRoles || roles.length === 0}><option value="">Select your role</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><label>Password<input type="password" required minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>{error && <p className="auth-error">{error}</p>}<button className="auth-submit" disabled={busy || loadingRoles}>{busy ? 'Creating account...' : 'Create account'}</button></form><Link className="auth-link" href="/login">Already have an account? Sign in</Link></section></main>;
}
