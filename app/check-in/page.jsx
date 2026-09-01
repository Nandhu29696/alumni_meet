'use client';

import { useEffect, useState } from 'react';
import { checkIn, getErrorMessage } from '../../services/api';

export default function CheckInPage() {
    const [state, setState] = useState({ loading: true, result: null, error: '' });

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) {
            setState({ loading: false, result: null, error: 'This QR code does not contain a registration token.' });
            return;
        }
        checkIn(token)
            .then((result) => setState({ loading: false, result, error: '' }))
            .catch((error) => setState({ loading: false, result: null, error: getErrorMessage(error, 'Unable to verify this registration.') }));
    }, []);

    return <main className="check-in-shell">
        <section className="check-in-card">
            <div className="check-in-brand">
                <span className="check-in-brand-mark">AM</span>
                <span className="check-in-brand-text">Alumni<br /><strong>Meet</strong></span>
            </div>

            {state.loading ? (
                <div className="check-in-status check-in-loading" aria-live="polite">
                    <div className="check-in-status-pill">Verifying</div>
                    <h1>Checking entry</h1>
                    <p>Checking the registration and attendee details.</p>
                </div>
            ) : state.result ? (
                <div className="check-in-status check-in-success" aria-live="polite">
                    <div className="check-in-status-pill success-pill">Attendance confirmed</div>
                    <h1>{state.result.attendee?.name}</h1>
                    <p>Checked in for <strong>{state.result.event_title}</strong>.</p>
                    <p className="check-in-quiet">Status: Attended</p>
                </div>
            ) : (
                <div className="check-in-status check-in-error" aria-live="polite">
                    <div className="check-in-status-pill danger-pill">Access required</div>
                    <h1>Unable to check in</h1>
                    <p className="auth-error">{state.error}</p>
                    <p>Sign in as an administrator and scan the QR code again.</p>
                </div>
            )}
        </section>
    </main>;
}
