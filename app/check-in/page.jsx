'use client';

import { useEffect, useState } from 'react';
import { checkIn } from '../../services/api';

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
            .catch((error) => setState({ loading: false, result: null, error: error.message || 'Unable to verify this registration.' }));
    }, []);

    return <main className="auth-shell">
        <section className="auth-card check-in-card">
            <div className="auth-logo">
                <span className="auth-logo-mark">AM</span>
                <span>Alumni<br /><strong>Meet</strong>
                </span>
            </div>
            {state.loading ? <>
                <h1>Verifying entry</h1>
                <p>Checking the registration and attendee details.</p>
            </> : state.result ? <>
                <h1>Attendance confirmed</h1>
                <p>
                    <strong>{state.result.attendee?.name}</strong> is checked in for
                    <strong>{state.result.event_title}</strong>.</p>
                <p className="check-in-success">Status: Attended</p>
            </> : <>
                <h1>Unable to check in</h1>
                <p className="auth-error">{state.error}</p>
                <p>Sign in as an administrator and scan the QR code again.</p>
            </>
            }
        </section>
    </main>;
}
