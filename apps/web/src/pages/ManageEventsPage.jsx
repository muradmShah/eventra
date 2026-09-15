import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Plus, Eye, Pencil, Users, ArrowRight } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, EmptyState, ErrorBanner } from '@/components/States';
import { fetchAllEvents, setEventStatus, deleteEvent } from '@/lib/events';
import { formatDate } from '@/lib/format';

const STATUS_ACTIONS = [
    { to: 'published', label: 'Publish', show: (s) => s === 'draft' },
    { to: 'completed', label: 'Complete', show: (s) => s === 'published' },
    { to: 'cancelled', label: 'Cancel', show: (s) => s !== 'cancelled' && s !== 'completed' },
];

export default function ManageEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(null);

    const load = () => {
        setLoading(true);
        fetchAllEvents()
            .then(setEvents)
            .catch((e) => setError(e.message || 'Unable to load events.'))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const changeStatus = async (id, status) => {
        setBusy(`${id}-${status}`);
        setError('');
        try {
            await setEventStatus(id, status);
            setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
        } catch (e) {
            setError(e?.response?.message || e?.message || 'Unable to change status.');
        } finally {
            setBusy(null);
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete this event? This cannot be undone.')) return;
        setBusy(`del-${id}`);
        try {
            await deleteEvent(id);
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (e) {
            setError(e?.response?.message || e?.message || 'Unable to delete event.');
        } finally {
            setBusy(null);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Manage Events · EVENTRA</title>
                <meta name="description" content="Admin event management." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                            Administration
                        </p>
                        <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                            Manage Events
                        </h1>
                    </div>
                    <Link
                        to="/admin/events/new"
                        className="inline-flex h-11 items-center gap-2 bg-primary px-5 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4" /> Create Event
                    </Link>
                </div>

                {error && <div className="mt-6"><ErrorBanner message={error} /></div>}

                {loading ? (
                    <Loader label="Loading events…" />
                ) : events.length === 0 ? (
                    <div className="mt-10">
                        <EmptyState
                            title="No events yet"
                            body="Create your first event to start accepting registrations."
                        />
                    </div>
                ) : (
                    <div className="mt-10 overflow-x-auto border border-border">
                        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                            <thead className="bg-secondary">
                                <tr className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                    <th className="p-4">Event</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Capacity</th>
                                    <th className="p-4">Registered</th>
                                    <th className="p-4">Available</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {events.map((e) => {
                                    const used = e.registeredSeats || 0;
                                    const avail = e.capacity > 0 ? Math.max(0, e.capacity - used) : '∞';
                                    return (
                                        <tr key={e.id} className="align-top">
                                            <td className="p-4 font-display font-medium text-foreground">{e.title}</td>
                                            <td className="p-4 text-muted-foreground">{formatDate(e.startDate)}</td>
                                            <td className="p-4 text-muted-foreground">{e.location || e.venue || '—'}</td>
                                            <td className="p-4 text-muted-foreground">{e.capacity || '∞'}</td>
                                            <td className="p-4 text-muted-foreground">{used}</td>
                                            <td className="p-4 text-muted-foreground">{avail}</td>
                                            <td className="p-4">
                                                <span className="font-code text-[10px] uppercase tracking-[0.18em] text-accent">
                                                    {e.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    <Link
                                                        to={`/events/${e.id}`}
                                                        className="inline-flex h-8 items-center gap-1 border border-border px-2 font-code text-[9px] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                                                        title="View"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/events/${e.id}/edit`}
                                                        className="inline-flex h-8 items-center gap-1 border border-border px-2 font-code text-[9px] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/events/${e.id}/attendees`}
                                                        className="inline-flex h-8 items-center gap-1 border border-border px-2 font-code text-[9px] uppercase tracking-[0.16em] text-foreground hover:bg-secondary"
                                                        title="Attendees"
                                                    >
                                                        <Users className="h-3 w-3" />
                                                    </Link>
                                                    {STATUS_ACTIONS.filter((a) => a.show(e.status)).map((a) => (
                                                        <button
                                                            key={a.to}
                                                            onClick={() => changeStatus(e.id, a.to)}
                                                            disabled={busy === `${e.id}-${a.to}`}
                                                            className="inline-flex h-8 items-center border border-primary bg-primary px-2 font-code text-[9px] uppercase tracking-[0.16em] text-primary-foreground disabled:opacity-60"
                                                        >
                                                            {busy === `${e.id}-${a.to}` ? '…' : a.label}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() => remove(e.id)}
                                                        disabled={busy === `del-${e.id}`}
                                                        className="inline-flex h-8 items-center border border-destructive/40 px-2 font-code text-[9px] uppercase tracking-[0.16em] text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                                    >
                                                        Del
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                    >
                        <ArrowRight className="h-3.5 w-3.5 rotate-180" /> Back to dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}
