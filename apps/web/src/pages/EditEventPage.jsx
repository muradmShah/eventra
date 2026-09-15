import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppNav from '@/components/AppNav';
import EventForm from '@/components/EventForm';
import { Loader, ErrorBanner } from '@/components/States';
import { fetchEvent, updateEvent } from '@/lib/events';

export default function EditEventPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvent(id)
            .then((e) => {
                setEvent(e);
                const d = new Date(e.startDate);
                const pad = (n) => String(n).padStart(2, '0');
                e._startDateLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            })
            .catch((e) => setError(e.message || 'Event not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (payload) => {
        setSubmitting(true);
        try {
            await updateEvent(id, payload);
            navigate('/admin/events');
        } finally {
            setSubmitting(false);
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
                <AppNav />
                <div className="mx-auto max-w-3xl px-5 py-20 md:px-8">
                    <ErrorBanner message={error || 'Event not found.'} />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Edit Event · EVENTRA</title>
                <meta name="description" content="Edit an existing event." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
                <Link
                    to="/admin/events"
                    className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to events
                </Link>
                <p className="mt-8 font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Administration
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Edit Event
                </h1>
                <div className="mt-10 border border-border bg-card p-7 paper md:p-9">
                    <EventForm
                        initialValues={{
                            title: event.title,
                            description: event.description,
                            startDate: event._startDateLocal,
                            time: event.time,
                            location: event.location || event.venue,
                            capacity: event.capacity,
                            price: event.price,
                            category: event.category,
                            status: event.status,
                        }}
                        onSubmit={handleSubmit}
                        submitLabel="Save changes"
                        submitting={submitting}
                    />
                </div>
            </div>
        </main>
    );
}
