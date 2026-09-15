import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, X, ArrowRight } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, EmptyState, ErrorBanner } from '@/components/States';
import { fetchMyRegistrations, cancelRegistration } from '@/lib/events';
import { formatDate } from '@/lib/format';

export default function MyRegistrationsPage() {
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState(null);

    const load = () => {
        setLoading(true);
        fetchMyRegistrations()
            .then(setRegs)
            .catch((e) => setError(e.message || 'Unable to load registrations.'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleCancel = async (id) => {
        setCancelling(id);
        try {
            await cancelRegistration(id);
            setRegs((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)),
            );
        } catch (e) {
            setError(e?.response?.message || e?.message || 'Unable to cancel registration.');
        } finally {
            setCancelling(null);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>My Registrations · EVENTRA</title>
                <meta name="description" content="View and manage your event registrations." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Attendee
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    My Registrations
                </h1>

                {error && <div className="mt-6"><ErrorBanner message={error} /></div>}

                {loading ? (
                    <Loader label="Loading registrations…" />
                ) : regs.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="No registrations yet"
                            body="Browse upcoming events and reserve your first seat."
                        />
                        <Link
                            to="/events"
                            className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground"
                        >
                            Browse events <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-10 overflow-x-auto border border-border">
                        <table className="w-full min-w-[720px] border-collapse text-left">
                            <thead className="bg-secondary">
                                <tr className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                    <th className="p-4">Event</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Registered</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {regs.map((r) => {
                                    const ev = r.expand?.event;
                                    return (
                                        <tr key={r.id} className="align-top text-sm">
                                            <td className="p-4 font-display font-medium text-foreground">
                                                {ev ? (
                                                    <Link to={`/events/${ev.id}`} className="hover:text-accent">
                                                        {ev.title}
                                                    </Link>
                                                ) : (
                                                    'Event'
                                                )}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {ev ? formatDate(ev.startDate) : '—'}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {ev?.time || '—'}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {ev?.location || ev?.venue || '—'}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`font-code text-[10px] uppercase tracking-[0.18em] ${
                                                        r.status === 'active'
                                                            ? 'text-accent'
                                                            : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {formatDate(r.created)}
                                            </td>
                                            <td className="p-4">
                                                {r.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleCancel(r.id)}
                                                        disabled={cancelling === r.id}
                                                        className="inline-flex h-9 items-center gap-1.5 border border-destructive/40 px-3 font-code text-[10px] uppercase tracking-[0.18em] text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        {cancelling === r.id ? 'Cancelling…' : 'Cancel'}
                                                    </button>
                                                ) : (
                                                    <span className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && regs.length > 0 && (
                    <div className="mt-6 flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-accent" />
                        Cancelled registrations free up their seats for other attendees.
                    </div>
                )}
            </div>
        </main>
    );
}
