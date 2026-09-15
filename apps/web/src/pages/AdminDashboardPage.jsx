import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, TrendingUp, ArrowRight } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, ErrorBanner } from '@/components/States';
import { fetchAllEvents, fetchAllRegistrations } from '@/lib/events';
import { formatDate } from '@/lib/format';

export default function AdminDashboardPage() {
    const [events, setEvents] = useState([]);
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([fetchAllEvents(), fetchAllRegistrations()])
            .then(([e, r]) => {
                setEvents(e);
                setRegs(r);
            })
            .catch((e) => setError(e.message || 'Unable to load dashboard.'))
            .finally(() => setLoading(false));
    }, []);

    const byStatus = (s) => events.filter((e) => e.status === s).length;
    const activeRegs = regs.filter((r) => r.status === 'active');
    const totalCap = events.reduce((sum, e) => sum + (e.capacity > 0 ? e.capacity : 0), 0);
    const availableCap = Math.max(0, totalCap - activeRegs.length);

    const stats = [
        ['Total Events', events.length],
        ['Published Events', byStatus('published')],
        ['Completed Events', byStatus('completed')],
        ['Cancelled Events', byStatus('cancelled')],
        ['Total Registrations', regs.length],
        ['Active Registrations', activeRegs.length],
        ['Available Capacity', availableCap],
    ];

    const now = Date.now();
    const recent = [...events].sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 5);
    const upcoming = events
        .filter((e) => e.status === 'published' && new Date(e.startDate).getTime() > now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 5);

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Admin Dashboard · EVENTRA</title>
                <meta name="description" content="Admin overview of events and registrations." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Administration
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Admin Dashboard
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
                                    <p className="font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                                        {value}
                                    </p>
                                    <p className="mt-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <section>
                                <h2 className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
                                    <TrendingUp className="h-5 w-5 text-accent" /> Recent Events
                                </h2>
                                <div className="mt-4 divide-y divide-border border border-border bg-card">
                                    {recent.length === 0 ? (
                                        <p className="p-5 text-sm text-muted-foreground">No events yet.</p>
                                    ) : (
                                        recent.map((e) => (
                                            <Link
                                                key={e.id}
                                                to={`/admin/events/${e.id}/edit`}
                                                className="flex items-center justify-between p-4 text-sm hover:bg-secondary"
                                            >
                                                <span className="font-display font-medium text-foreground">{e.title}</span>
                                                <span className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                    {e.status}
                                                </span>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </section>

                            <section>
                                <h2 className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
                                    <CalendarDays className="h-5 w-5 text-accent" /> Upcoming Events
                                </h2>
                                <div className="mt-4 divide-y divide-border border border-border bg-card">
                                    {upcoming.length === 0 ? (
                                        <p className="p-5 text-sm text-muted-foreground">No upcoming published events.</p>
                                    ) : (
                                        upcoming.map((e) => (
                                            <div key={e.id} className="flex items-center justify-between p-4 text-sm">
                                                <div>
                                                    <p className="font-display font-medium text-foreground">{e.title}</p>
                                                    <p className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                        {formatDate(e.startDate)}
                                                    </p>
                                                </div>
                                                <span className="font-code text-[10px] uppercase tracking-[0.18em] text-accent">
                                                    {e.registeredSeats || 0}/{e.capacity || '∞'}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        <section className="mt-12">
                            <h2 className="flex items-center gap-2 font-display text-xl font-medium tracking-tight">
                                <Users className="h-5 w-5 text-accent" /> Registration Overview
                            </h2>
                            <div className="mt-4 overflow-x-auto border border-border">
                                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                    <thead className="bg-secondary">
                                        <tr className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                            <th className="p-4">Event</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Capacity</th>
                                            <th className="p-4">Registered</th>
                                            <th className="p-4">Fill rate</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-card">
                                        {events.slice(0, 8).map((e) => {
                                            const used = e.registeredSeats || 0;
                                            const rate = e.capacity > 0 ? Math.round((used / e.capacity) * 100) : 0;
                                            return (
                                                <tr key={e.id}>
                                                    <td className="p-4 font-display font-medium text-foreground">{e.title}</td>
                                                    <td className="p-4 text-muted-foreground">{e.status}</td>
                                                    <td className="p-4 text-muted-foreground">{e.capacity || '∞'}</td>
                                                    <td className="p-4 text-muted-foreground">{used}</td>
                                                    <td className="p-4 text-muted-foreground">{rate}%</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <Link
                                to="/admin/events"
                                className="inline-flex h-11 items-center gap-2 border border-primary bg-primary px-5 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:-translate-y-0.5"
                            >
                                Manage Events <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                                to="/admin/reports"
                                className="inline-flex h-11 items-center gap-2 border border-border px-5 font-code text-[11px] uppercase tracking-[0.2em] text-foreground hover:bg-secondary"
                            >
                                Reports
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
