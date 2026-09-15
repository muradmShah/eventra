import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, EmptyState, ErrorBanner } from '@/components/States';
import { fetchMyRegistrations, fetchPublishedEvents } from '@/lib/events';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/contexts/AuthContext';

export default function AttendeeDashboardPage() {
    const { user } = useAuth();
    const [regs, setRegs] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchMyRegistrations(), fetchPublishedEvents()])
            .then(([r, e]) => {
                setRegs(r);
                setEvents(e);
            })
            .catch((e) => setError(e.message || 'Unable to load dashboard.'))
            .finally(() => setLoading(false));
    }, []);

    const active = regs.filter((r) => r.status === 'active');
    const upcoming = active.filter((r) => {
        const ev = r.expand?.event;
        return ev && new Date(ev.startDate).getTime() > Date.now();
    });
    const cancelled = regs.filter((r) => r.status === 'cancelled');

    const stats = [
        ['Active registrations', active.length],
        ['Upcoming events', upcoming.length],
        ['Cancelled', cancelled.length],
        ['Published events available', events.length],
    ];

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>My Dashboard · EVENTRA</title>
                <meta name="description" content="Your event registration dashboard." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Attendee dashboard
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
                </h1>

                {loading ? (
                    <Loader label="Loading dashboard…" />
                ) : error ? (
                    <ErrorBanner message={error} />
                ) : (
                    <>
                        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
                            {stats.map(([label, value]) => (
                                <div key={label} className="bg-card p-6">
                                    <p className="font-display text-4xl font-medium tracking-tight text-foreground">
                                        {value}
                                    </p>
                                    <p className="mt-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <section className="mt-14">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-2xl font-medium tracking-tight">
                                    Upcoming registrations
                                </h2>
                                <Link
                                    to="/events"
                                    className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-accent hover:text-foreground"
                                >
                                    Browse events <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                            <div className="mt-6">
                                {upcoming.length === 0 ? (
                                    <EmptyState
                                        title="No upcoming registrations"
                                        body="Browse the events page and register for your next occasion."
                                    />
                                ) : (
                                    <div className="divide-y divide-border border border-border bg-card">
                                        {upcoming.map((r) => {
                                            const ev = r.expand?.event;
                                            return (
                                                <Link
                                                    key={r.id}
                                                    to={ev ? `/events/${ev.id}` : '/events'}
                                                    className="flex flex-col gap-2 p-5 transition-colors hover:bg-secondary sm:flex-row sm:items-center sm:justify-between"
                                                >
                                                    <div>
                                                        <p className="font-display text-lg font-medium text-foreground">
                                                            {ev?.title || 'Event'}
                                                        </p>
                                                        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                            <span className="flex items-center gap-1.5">
                                                                <CalendarDays className="h-3.5 w-3.5 text-accent" />
                                                                {ev ? formatDate(ev.startDate) : '—'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Ticket className="h-3.5 w-3.5 text-accent" />
                                                                {r.tickets} ticket(s)
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1.5 font-code text-[10px] uppercase tracking-[0.18em] text-accent">
                                                        <CheckCircle2 className="h-4 w-4" /> Active
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link
                                to="/my-registrations"
                                className="inline-flex h-11 items-center gap-2 border border-primary bg-primary px-5 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:-translate-y-0.5"
                            >
                                My Registrations
                            </Link>
                            <Link
                                to="/profile"
                                className="inline-flex h-11 items-center gap-2 border border-border px-5 font-code text-[11px] uppercase tracking-[0.2em] text-foreground hover:bg-secondary"
                            >
                                Profile
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
