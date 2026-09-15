import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    CalendarDays,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    ArrowRight,
    Ticket,
    Check,
    AlertCircle,
} from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, ErrorBanner } from '@/components/States';
import {
    fetchEvent,
    registerForEvent,
    fetchMyRegistrationForEvent,
    seatsRemaining,
    isFull,
    formatPrice,
} from '@/lib/events';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthed, isAdmin, logout } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [existing, setExisting] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [success, setSuccess] = useState(false);
    const [regError, setRegError] = useState('');

    useEffect(() => {
        let active = true;
        setLoading(true);
        fetchEvent(id)
            .then((ev) => {
                if (!active) return;
                setEvent(ev);
                if (isAuthed) {
                    return fetchMyRegistrationForEvent(id).then((r) => active && setExisting(r));
                }
            })
            .catch((e) => active && setError(e.message || 'Event not found.'))
            .finally(() => active && setLoading(false));
        return () => {
            active = false;
        };
    }, [id, isAuthed]);

    const canRegister =
        event &&
        event.status === 'published' &&
        !isFull(event) &&
        !existing &&
        !isAdmin &&
        new Date(event.startDate).getTime() > Date.now();

    const handleRegister = async () => {
        if (!isAuthed) {
            navigate('/login');
            return;
        }
        setRegError('');
        setRegistering(true);
        try {
            await registerForEvent(id, 1);
            setSuccess(true);
            setExisting({ status: 'active' });
        } catch (err) {
            const msg = err?.response?.message || err?.message || '';
            // If the token went stale mid-session, force a clean re-auth instead
            // of showing a confusing "must be signed in" error.
            if (msg.includes('signed in')) {
                logout();
                navigate('/login');
                return;
            }
            setRegError(msg || 'Unable to register. Please try again.');
        } finally {
            setRegistering(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[100dvh] bg-background pt-16">
                <AppNav />
                <Loader label="Loading event…" />
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-[100dvh] bg-background pt-16">
                <Helmet>
                    <title>Event not found · EVENTRA</title>
                </Helmet>
                <AppNav />
                <div className="mx-auto max-w-3xl px-5 py-20 md:px-8">
                    <ErrorBanner message={error || 'Event not found.'} />
                    <Link
                        to="/events"
                        className="mt-6 inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to events
                    </Link>
                </div>
            </main>
        );
    }

    const remaining = seatsRemaining(event);
    const full = isFull(event);

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>{event.title} · EVENTRA</title>
                <meta name="description" content={event.description?.slice(0, 150)} />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-4xl px-5 py-16 md:px-8">
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to events
                </Link>

                <div className="mt-8 flex h-48 items-center justify-center border border-border bg-primary">
                    <span className="font-display text-4xl font-medium uppercase tracking-tight text-primary-foreground">
                        {event.category || 'event'}
                    </span>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <span className="border border-primary bg-primary px-3 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
                        {event.status}
                    </span>
                    <span className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {event.category}
                    </span>
                </div>

                <h1 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
                    {event.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
                    {event.description}
                </p>

                <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
                    {[
                        [CalendarDays, 'Date', formatDate(event.startDate)],
                        [Clock, 'Time', event.time || 'TBA'],
                        [MapPin, 'Location', event.location || event.venue || 'TBA'],
                        [
                            Users,
                            'Capacity',
                            event.capacity > 0
                                ? `${event.registeredSeats || 0} / ${event.capacity} registered`
                                : `${event.registeredSeats || 0} registered · open grounds`,
                        ],
                    ].map(([Icon, label, value]) => (
                        <div key={label} className="bg-card p-5">
                            <dt className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                {label}
                            </dt>
                            <dd className="mt-2 font-display text-lg font-medium text-foreground">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-6 paper">
                    <div>
                        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Price
                        </p>
                        <p className="font-display text-2xl font-medium text-foreground">
                            {formatPrice(event.price)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            Availability
                        </p>
                        <p
                            className={`font-display text-2xl font-medium ${
                                full ? 'text-destructive' : 'text-accent'
                            }`}
                        >
                            {remaining === -1 ? 'Open grounds' : full ? 'Event Full' : `${remaining} seats remaining`}
                        </p>
                    </div>
                </div>

                {success && (
                    <div
                        role="status"
                        className="mt-6 flex items-start gap-2 border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent"
                    >
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            Registration confirmed. View it in{' '}
                            <Link to="/my-registrations" className="underline">
                                My Registrations
                            </Link>
                            .
                        </span>
                    </div>
                )}

                {regError && (
                    <div className="mt-6">
                        <ErrorBanner message={regError} />
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    {existing ? (
                        <div className="inline-flex h-12 items-center gap-2 border border-accent/40 bg-accent/5 px-6 font-code text-xs uppercase tracking-[0.2em] text-accent">
                            <Check className="h-4 w-4" /> You are registered
                        </div>
                    ) : !isAuthed ? (
                        <button
                            onClick={handleRegister}
                            className="inline-flex h-12 items-center gap-2 bg-primary px-6 font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5"
                        >
                            <Ticket className="h-4 w-4" strokeWidth={1.75} />
                            Sign in to register
                        </button>
                    ) : isAdmin ? (
                        <div className="inline-flex h-12 items-center gap-2 border border-border px-6 font-code text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            <AlertCircle className="h-4 w-4" /> Admins manage events, not register
                        </div>
                    ) : (
                        <button
                            onClick={handleRegister}
                            disabled={!canRegister || registering}
                            className="inline-flex h-12 items-center gap-2 bg-primary px-6 font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {registering ? 'Registering…' : 'Register now'}
                            {!registering && <ArrowRight className="h-4 w-4" strokeWidth={1.75} />}
                        </button>
                    )}
                    {isAdmin && (
                        <Link
                            to={`/admin/events/${event.id}/attendees`}
                            className="inline-flex h-12 items-center gap-2 border border-primary px-6 font-code text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-secondary"
                        >
                            View attendees
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
