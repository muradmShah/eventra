import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Download, Copy, Check } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, EmptyState, ErrorBanner } from '@/components/States';
import { fetchEvent, fetchEventRegistrations } from '@/lib/events';
import { formatDate } from '@/lib/format';

function toCSV(rows) {
    return rows
        .map((r) =>
            r
                .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
                .join(','),
        )
        .join('\n');
}

export default function EventAttendeesPage() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [regs, setRegs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        Promise.all([fetchEvent(id), fetchEventRegistrations(id)])
            .then(([e, r]) => {
                setEvent(e);
                setRegs(r);
            })
            .catch((e) => setError(e.message || 'Unable to load attendees.'))
            .finally(() => setLoading(false));
    }, [id]);

    const filtered = useMemo(() => {
        return regs.filter((r) => {
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            if (!query.trim()) return true;
            const att = r.expand?.attendee;
            const hay = `${att?.name || ''} ${att?.email || ''} ${att?.phone || ''}`.toLowerCase();
            return hay.includes(query.trim().toLowerCase());
        });
    }, [regs, query, statusFilter]);

    const csvHeaders = ['Name', 'Email', 'Phone', 'Status', 'Tickets', 'Registered'];
    const csvRows = filtered.map((r) => {
        const a = r.expand?.attendee;
        return [a?.name || '', a?.email || '', a?.phone || '', r.status, r.tickets || 1, formatDate(r.created)];
    });

    const download = () => {
        const csv = toCSV([csvHeaders, ...csvRows]);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendees-${event?.slug || id}.csv`;
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

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Attendees · EVENTRA</title>
                <meta name="description" content="Event attendee list and export." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-5xl px-5 py-16 md:px-8">
                <Link
                    to="/admin/events"
                    className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to events
                </Link>

                {loading ? (
                    <Loader label="Loading attendees…" />
                ) : error ? (
                    <ErrorBanner message={error} />
                ) : (
                    <>
                        <p className="mt-8 font-code text-xs uppercase tracking-[0.28em] text-accent">
                            Attendees
                        </p>
                        <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                            {event?.title}
                        </h1>
                        <p className="mt-3 font-code text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                            {regs.length} registration(s) · {regs.filter((r) => r.status === 'active').length} active
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search name, email, phone…"
                                    className="h-11 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-accent"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-11 border border-input bg-background px-3 text-sm outline-none focus:border-accent"
                            >
                                <option value="all">All statuses</option>
                                <option value="active">Active</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                onClick={copy}
                                className="inline-flex h-11 items-center justify-center gap-2 border border-border px-4 font-code text-[11px] uppercase tracking-[0.18em] text-foreground hover:bg-secondary"
                            >
                                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                            <button
                                onClick={download}
                                className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-4 font-code text-[11px] uppercase tracking-[0.18em] text-primary-foreground hover:-translate-y-0.5"
                            >
                                <Download className="h-4 w-4" /> Export CSV
                            </button>
                        </div>

                        <div className="mt-6">
                            {filtered.length === 0 ? (
                                <EmptyState
                                    title="No attendees found"
                                    body="No registrations match your search or filter."
                                />
                            ) : (
                                <div className="overflow-x-auto border border-border">
                                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                                        <thead className="bg-secondary">
                                            <tr className="font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                                <th className="p-4">Attendee</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Tickets</th>
                                                <th className="p-4">Registered</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border bg-card">
                                            {filtered.map((r) => {
                                                const a = r.expand?.attendee;
                                                return (
                                                    <tr key={r.id}>
                                                        <td className="p-4 font-display font-medium text-foreground">
                                                            {a?.name || '—'}
                                                        </td>
                                                        <td className="p-4 text-muted-foreground">{a?.email || '—'}</td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`font-code text-[10px] uppercase tracking-[0.18em] ${
                                                                    r.status === 'active' ? 'text-accent' : 'text-muted-foreground'
                                                                }`}
                                                            >
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-muted-foreground">{r.tickets || 1}</td>
                                                        <td className="p-4 text-muted-foreground">{formatDate(r.created)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
