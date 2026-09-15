import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Copy, Check } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, ErrorBanner } from '@/components/States';
import { fetchAllEvents, fetchAllRegistrations } from '@/lib/events';
import { formatDate } from '@/lib/format';

function toCSV(rows) {
    return rows
        .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
}

export default function ReportsPage() {
    const [events, setEvents] = useState([]);
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Promise.all([fetchAllEvents(), fetchAllRegistrations()])
            .then(([e, r]) => {
                setEvents(e);
                setRegs(r);
            })
            .catch((e) => setError(e.message || 'Unable to load reports.'))
            .finally(() => setLoading(false));
    }, []);

    const activeRegs = regs.filter((r) => r.status === 'active');
    const byEvent = useMemo(() => {
        return events
            .map((e) => {
                const eventRegs = regs.filter((r) => r.event === e.id);
                const active = eventRegs.filter((r) => r.status === 'active').length;
                return {
                    id: e.id,
                    title: e.title,
                    status: e.status,
                    capacity: e.capacity || 0,
                    registered: active,
                    available: e.capacity > 0 ? Math.max(0, e.capacity - active) : '∞',
                };
            })
            .sort((a, b) => b.registered - a.registered);
    }, [events, regs]);

    const summary = {
        totalEvents: events.length,
        published: events.filter((e) => e.status === 'published').length,
        completed: events.filter((e) => e.status === 'completed').length,
        cancelled: events.filter((e) => e.status === 'cancelled').length,
        totalRegs: regs.length,
        activeRegs: activeRegs.length,
        totalCapacity: events.reduce((s, e) => s + (e.capacity > 0 ? e.capacity : 0), 0),
        available: Math.max(0, events.reduce((s, e) => s + (e.capacity > 0 ? e.capacity : 0), 0) - activeRegs.length),
    };

    const csvHeaders = ['Event', 'Status', 'Capacity', 'Registered', 'Available'];
    const csvRows = byEvent.map((e) => [e.title, e.status, e.capacity, e.registered, e.available]);

    const download = () => {
        const csv = toCSV([csvHeaders, ...csvRows]);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events-report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copy = async () => {
        const csv = toCSV([csvHeaders, ...csvRows]);
        try {
            await navigator.clipboard.writeText(csv);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_) {
            // clipboard unavailable
        }
    };

    const cards = [
        ['Total Events', summary.totalEvents],
        ['Published', summary.published],
        ['Completed', summary.completed],
        ['Cancelled', summary.cancelled],
        ['Total Registrations', summary.totalRegs],
        ['Active Registrations', summary.activeRegs],
        ['Total Capacity', summary.totalCapacity],
        ['Available Capacity', summary.available],
    ];

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Reports · EVENTRA</title>
                <meta name="description" content="Event registration reports and exports." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Administration
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Reports
                </h1>

                {loading ? (
                    <Loader label="Loading reports…" />
                ) : error ? (
                    <ErrorBanner message={error} />
                ) : (
                    <>
                        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border lg:grid-cols-4">
                            {cards.map(([label, value]) => (
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

                        <section className="mt-12">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h2 className="font-display text-2xl font-medium tracking-tight">
                                    Registrations by event
                                </h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copy}
                                        className="inline-flex h-11 items-center gap-2 border border-border px-4 font-code text-[11px] uppercase tracking-[0.18em] text-foreground hover:bg-secondary"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={download}
                                        className="inline-flex h-11 items-center gap-2 bg-primary px-4 font-code text-[11px] uppercase tracking-[0.18em] text-primary-foreground hover:-translate-y-0.5"
                                    >
                                        <Download className="h-4 w-4" /> Export CSV
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 overflow-x-auto border border-border">
                                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                    <thead className="bg-secondary">
                                        <tr className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                            <th className="p-4">Event</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Capacity</th>
                                            <th className="p-4">Registered</th>
                                            <th className="p-4">Available</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-card">
                                        {byEvent.map((e) => (
                                            <tr key={e.id}>
                                                <td className="p-4 font-display font-medium text-foreground">{e.title}</td>
                                                <td className="p-4 text-muted-foreground">{e.status}</td>
                                                <td className="p-4 text-muted-foreground">{e.capacity || '∞'}</td>
                                                <td className="p-4 text-muted-foreground">{e.registered}</td>
                                                <td className="p-4 text-muted-foreground">{e.available}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
