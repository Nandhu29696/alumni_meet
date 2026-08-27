'use client';

import Link from 'next/link';
import { useState } from 'react';
import { requestPasswordOtp, resetPassword } from '../../services/api';

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: '', otp: '', new_password: '' });
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function requestOtp(event) { event?.preventDefault(); setBusy(true); setMessage(''); try { await requestPasswordOtp(form.email); setSent(true); setMessage('If that email is registered, an OTP has been sent.'); } catch (error) { setMessage(error.message); } finally { setBusy(false); } }
  async function reset(event) { event.preventDefault(); setBusy(true); setMessage(''); try { await resetPassword(form); setMessage('Password reset successfully. Redirecting to sign in...'); setTimeout(() => window.location.assign('/login'), 1200); } catch (error) { setMessage(error.message); setBusy(false); } }
  return <main className="auth-shell"><section className="auth-card"><div className="auth-logo"><span className="auth-logo-mark">AM</span><span>Alumni<br /><strong>Meet</strong></span></div><h1>Reset password</h1><p>Request a one-time code sent to your email.</p>{!sent ? <form onSubmit={requestOtp}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>{message && <p className="auth-error">{message}</p>}<button className="auth-submit" disabled={busy}>{busy ? 'Sending...' : 'Send OTP'}</button></form> : <form onSubmit={reset}><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><div className="otp-heading"><label>OTP<input inputMode="numeric" pattern="[0-9]{6}" minLength="6" maxLength="6" required value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value })} /></label><button type="button" className="resend-button" onClick={() => requestOtp()} disabled={busy}>Resend OTP</button></div><label>New password<input type="password" minLength="8" required value={form.new_password} onChange={(event) => setForm({ ...form, new_password: event.target.value })} /></label>{message && <p className={message.includes('successfully') || message.includes('sent') ? 'saved-note' : 'auth-error'}>{message}</p>}<button className="auth-submit" disabled={busy}>{busy ? 'Resetting...' : 'Reset password'}</button></form>}<Link className="auth-link" href="/login">Back to sign in</Link></section></main>;
}
