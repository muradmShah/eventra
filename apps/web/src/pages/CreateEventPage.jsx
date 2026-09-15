import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppNav from '@/components/AppNav';
import EventForm from '@/components/EventForm';
import { createEvent } from '@/lib/events';

export default function CreateEventPage() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (payload) => {
        setSubmitting(true);
        try {
            await createEvent(payload);
            navigate('/admin/events');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Create Event · EVENTRA</title>
                <meta name="description" content="Create a new event." />
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
                    Create Event
                </h1>
                <div className="mt-10 border border-border bg-card p-7 paper md:p-9">
                    <EventForm
                        draftKey="nec-event-create"
                        onSubmit={handleSubmit}
                        submitLabel="Create event"
                        submitting={submitting}
                    />
                </div>
            </div>
        </main>
    );
}
