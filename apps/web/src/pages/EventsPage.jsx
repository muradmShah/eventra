import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users, Clock, ArrowRight, Ticket } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, EmptyState, ErrorBanner } from '@/components/States';
import { fetchPublishedEvents, seatsRemaining, isFull, formatPrice } from '@/lib/events';
import { formatDate } from '@/lib/format';
import pb from '@/lib/pocketbaseClient';

// Category-based header imagery for events without an uploaded image.
const CATEGORY_IMAGES = {
    conference:
        'https://images.hostinger.com/b0659f3d-b0f7-4ea8-85ad-b2066da89687.png',
    corporate:
        'https://images.hostinger.com/a706ae7e-adb8-4553-949e-c9bdffcbef6e.png',
    festival:
        'https://images.hostinger.com/93c168b8-7105-4e48-89ac-a3d37635a64a.png',
    gala:
        'https://images.hostinger.com/4697a8cd-4ffb-432a-b86b-02594400e13b.png',
    wedding:
        'https://images.hostinger.com/88da28cb-9353-483e-ac9b-b288657ace00.png',
};

const EVENT_IMAGES = {
    'north-clinical-health-conference':
        'https://images.hostinger.com/768c56c2-7c09-44a4-8226-4c7d7a8253fe.png',
};

function headerImage(event) {
    if (event.image) {
        return pb.files.getUrl(event, event.image);
    }
    return EVENT_IMAGES[event.slug] || CATEGORY_IMAGES[(event.category || '').toLowerCase()] || null;
}
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetchPublishedEvents().then(setEvents).catch(e => setError(e.message || 'Unable to load events.')).finally(() => setLoading(false));
  }, []);
  return <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Events · EVENTRA</title>
                <meta name="description" content="Browse upcoming published events hosted by EVENTRA and register in seconds." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Public events
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Find your next occasion.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-light text-muted-foreground">Browse upcoming, published events and reserve your seat in seconds. Capacity is enforced in real time no overselling.</p>

                {loading ? <Loader label="Loading events…" /> : error ? <ErrorBanner message={error} /> : events.length === 0 ? <EmptyState title="No upcoming events" body="There are no published events scheduled right now. Please check back soon." /> : <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map(event => {
          const remaining = seatsRemaining(event);
          const full = isFull(event);
          return <article key={event.id} className="group flex h-full flex-col border border-border bg-card transition-transform duration-300 hover:-translate-y-1.5 paper">
                                    <div className="relative flex h-32 items-center justify-center overflow-hidden border-b border-border bg-primary">
                                        {(() => {
          const img = headerImage(event);
          return img ? <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null;
        })()}
                                        <div className="absolute inset-0 bg-primary/55" />
                                        <span className="relative font-display text-2xl font-medium uppercase tracking-tight text-primary-foreground">
                                            {event.category || 'event'}
                                        </span>
                                        <span className="absolute left-4 top-4 border border-primary-foreground/30 bg-primary-foreground/10 px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h2 className="font-display text-xl font-medium leading-snug tracking-tight text-foreground">
                                            {event.title}
                                        </h2>
                                        <p className="mt-2 line-clamp-3 text-sm font-light text-muted-foreground">
                                            {event.description}
                                        </p>
                                        <div className="mt-4 space-y-2">
                                            <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                <CalendarDays className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                                {formatDate(event.startDate)}
                                            </p>
                                            {event.time && <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                                    {event.time}
                                                </p>}
                                            <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                                {event.location || event.venue || 'TBA'}
                                            </p>
                                            <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                                <Users className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                                {event.capacity > 0 ? `${event.registeredSeats || 0} / ${event.capacity} registered` : `${event.registeredSeats || 0} registered · open grounds`}
                                            </p>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between border-t border-dashed border-border pt-4">
                                            <span className="font-display text-base font-medium text-foreground">
                                                {formatPrice(event.price)}
                                            </span>
                                            <span className={`font-code text-[10px] uppercase tracking-[0.18em] ${full ? 'text-destructive' : 'text-accent'}`}>
                                                {remaining === -1 ? 'Open' : full ? 'Event Full' : `${remaining} seats left`}
                                            </span>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Link to={`/events/${event.id}`} className="inline-flex h-9 flex-1 items-center justify-center border border-border font-code text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-secondary">
                                                View Details
                                            </Link>
                                            <Link to={`/events/${event.id}`} className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 font-code text-[10px] uppercase tracking-[0.2em] transition-transform duration-150 hover:-translate-y-0.5 ${full ? 'cursor-not-allowed bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                                                <Ticket className="h-3.5 w-3.5" strokeWidth={1.75} />
                                                Register
                                            </Link>
                                        </div>
                                    </div>
                                </article>;
        })}
                    </div>}

                <div className="mt-12">
                    <Link to="/" className="inline-flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                        <ArrowRight className="h-3.5 w-3.5 rotate-180" strokeWidth={1.75} />
                        Back to home
                    </Link>
                </div>
            </div>
        </main>;
}