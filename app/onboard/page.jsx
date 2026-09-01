'use client';

import '../auth.css';
import Link from 'next/link';
import { useState } from 'react';
import { createTenant } from '../../services/api';

export default function OnboardPage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    domain: '',
    contact_email: '',
    primary_color: '#315a45'
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        domain: form.domain.trim(),
        contact_email: form.contact_email.trim(),
        primary_color: form.primary_color || '#315a45'
      };
      if (!payload.name) throw new Error('Please add your institution name.');
      if (!payload.slug) throw new Error('Please add a short community slug.');
      await createTenant(payload);
      window.location.assign('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-mark">AM</span>
          <span>Alumni<br /><strong>Meet</strong></span>
        </div>
        <h1>Set up your campus</h1>
        <p>Create your tenant so you can onboard members, events, and chapters in one place.</p>
        <form onSubmit={submit}>
          <label>Institution name
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Northview Academy" />
          </label>
          <label>Community slug
            <input required minLength="2" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="northview" />
          </label>
          <label>Domain
            <input value={form.domain} onChange={(event) => setForm({ ...form, domain: event.target.value })} placeholder="northview.edu" />
          </label>
          <label>Contact email
            <input type="email" value={form.contact_email} onChange={(event) => setForm({ ...form, contact_email: event.target.value })} placeholder="hello@northview.edu" />
          </label>
          <label>Brand color
            <input type="color" value={form.primary_color} onChange={(event) => setForm({ ...form, primary_color: event.target.value })} />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Creating tenant...' : 'Create tenant'}</button>
        </form>
        <Link className="auth-link" href="/">Skip for now</Link>
      </section>
    </main>
  );
}
