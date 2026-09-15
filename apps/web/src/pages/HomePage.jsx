import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, CalendarDays, MapPin, Users, Sparkles, Mic2, GraduationCap, Music, Heart, Building2, ShieldCheck, Clock, Handshake, Quote, Check, Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import AnchorRail from '@/components/AnchorRail';
const LOGO = 'https://horizons-cdn.hostinger.com/505f231a-6d60-4222-985c-2283d3e0fd15/b896a77b4095aa3cc8bad3035e03c60c.png';
const TEAM_IMG = 'https://images.hostinger.com/28ae539e-bc1b-433c-8ef3-c8255ef16144.png';
const HERO_SLIDES = [{
  img: 'https://images.hostinger.com/2a87df53-8c6b-4d9f-9d7a-6190fdcd8a9b.png',
  caption: 'Galas & award nights'
}, {
  img: 'https://images.hostinger.com/d3de22aa-ecbf-4b60-8652-54b0b167be1a.png',
  caption: 'Conferences & summits'
}, {
  img: 'https://images.hostinger.com/7bd4bb03-0df9-4289-be7c-43eadc7d73f2.png',
  caption: 'Festivals & concerts'
}, {
  img: 'https://images.hostinger.com/fb34b7c8-25d3-43d5-97e1-b6aa3e71dafc.png',
  caption: 'Weddings & private events'
}];
function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const next = useCallback(() => setIndex(i => (i + 1) % HERO_SLIDES.length), []);
  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);
  return <div className="absolute inset-0">
      {HERO_SLIDES.map((s, i) => <img key={s.img} src={s.img} alt={s.caption} loading={i === 0 ? 'eager' : 'lazy'} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${i === index ? 'opacity-45 kenburns' : 'opacity-0'}`} />)}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
      <div className="absolute inset-0 bg-blueprint opacity-60" aria-hidden="true" />
      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {HERO_SLIDES.map((s, i) => <button key={s.img} type="button" onClick={() => setIndex(i)} aria-label={`Show ${s.caption}`} className={`h-1.5 transition-all duration-300 ${i === index ? 'w-8 bg-accent' : 'w-4 bg-primary-foreground/40 hover:bg-primary-foreground/70'}`} />)}
      </div>
      <span className="absolute bottom-16 left-1/2 -translate-x-1/2 font-code text-[10px] uppercase tracking-[0.24em] text-primary-foreground/70">
        {HERO_SLIDES[index].caption}
      </span>
    </div>;
}

/* ---------------------------------- bits ---------------------------------- */

function SectionTag({
  index,
  label,
  dark = false
}) {
  return <div className={`flex items-center gap-3 ${dark ? 'text-primary-foreground' : 'text-foreground'}`}>
            <span className="font-code text-xs text-accent">{index}</span>
            <span className={`h-px w-10 ${dark ? 'bg-primary-foreground/40' : 'bg-foreground/30'}`} />
            <span className="font-code text-xs uppercase tracking-[0.28em]">{label}</span>
        </div>;
}
function FileBarChart(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 18v-3" />
            <path d="M12 18v-6" />
            <path d="M16 18v-4" />
        </svg>;
}
function Header() {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
                <a href="#top" className="flex items-center gap-3">
                    <img src={LOGO} alt="EVENTRA logo" className="h-11 w-11 object-contain" />
                    <span className="leading-tight">
                        <span className="block font-display text-base font-semibold tracking-tight">
                            EVENTRA
                        </span>
                        <span className="block font-code text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                            Events, engineered
                        </span>
                    </span>
                </a>
                <nav className="hidden items-center gap-7 md:flex">
                    <Link to="/events" className="font-code text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent">
                        Events
                    </Link>
                    {[['Highlights', '#events'], ['Services', '#services'], ['Process', '#process'], ['Why us', '#trust']].map(([label, href]) => <a key={href} href={href} className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                            {label}
                        </a>)}
                    <Link to="/login" className="font-code text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
                        Sign in
                    </Link>
                    <a href="#contact" className="inline-flex h-10 items-center gap-2 border border-primary bg-primary px-4 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0">
                        Plan an event
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                </nav>
                <div className="flex items-center gap-3 md:hidden">
                    <Link to="/events" className="font-code text-[11px] uppercase tracking-[0.18em] text-foreground">
                        Events
                    </Link>
                    <Link to="/login" className="font-code text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        Sign in
                    </Link>
                    <a href="#contact" className="inline-flex h-10 items-center gap-2 border border-primary bg-primary px-4 font-code text-[11px] uppercase tracking-[0.18em] text-primary-foreground">
                        Plan
                    </a>
                </div>
            </div>
        </header>;
}

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  return <section id="top" className="relative overflow-hidden bg-primary text-primary-foreground">
            <HeroSlideshow />
            <div className="relative mx-auto grid min-h-[100dvh] max-w-6xl grid-cols-1 items-center gap-14 px-5 pb-24 pt-32 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                    <Reveal>
                        <p className="font-code text-[11px] uppercase tracking-[0.3em] text-primary-foreground/60">
                            Nowshera · Khyber Pakhtunkhwa — Est. 2018
                        </p>
                    </Reveal>
                    <Reveal delay={0.08}>
                        <h1 className="mt-6 font-display text-5xl font-light leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
                            We turn gatherings into{' '}
                            <span className="italic text-accent-foreground underline decoration-accent decoration-2 underline-offset-8">
                                occasions
                            </span>{' '}
                            worth remembering.
                        </h1>
                    </Reveal>
                    <Reveal delay={0.16}>
                        <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-primary-foreground/80 md:text-lg">EVENTRA designs and delivers conferences, galas, workshops, festivals, and weddings across the region with a calm, disciplined production team and a platform that keeps every registration, seat, and report perfectly in order.</p>
                    </Reveal>
                    <Reveal delay={0.24}>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <a href="#events" className="inline-flex h-12 items-center gap-2 bg-background px-6 font-code text-xs uppercase tracking-[0.2em] text-foreground transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0">
                                Browse upcoming events
                                <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                            </a>
                            <a href="#contact" className="inline-flex h-12 items-center gap-2 border border-primary-foreground/35 px-6 font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors duration-150 hover:border-primary-foreground/70 hover:bg-primary-foreground/5">
                                Talk to our team
                            </a>
                        </div>
                    </Reveal>
                    <Reveal delay={0.32}>
                        <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-primary-foreground/15 pt-6">
                            {[['240+', 'Events delivered'], ['18k', 'Attendees hosted'], ['7', 'Years in production']].map(([n, label]) => <div key={label}>
                                    <dt className="sr-only">{label}</dt>
                                    <dd className="font-display text-2xl font-medium">{n}</dd>
                                    <dd className="font-code text-[10px] uppercase tracking-[0.22em] text-primary-foreground/55">
                                        {label}
                                    </dd>
                                </div>)}
                        </dl>
                    </Reveal>
                </div>

                {/* Floating event ticket card */}
                <div className="relative hidden pb-10 lg:block">
                    <Reveal delay={0.2} y={30}>
                        <div className="relative ml-auto max-w-sm rotate-[3deg] border border-primary-foreground/15 bg-background p-6 text-foreground paper-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-code text-[10px] uppercase tracking-[0.24em] text-accent">
                                    Next up · Featured
                                </span>
                                <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.5} />
                            </div>
                            <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight">
                                Nowshera Tech Summit 2026
                            </h2>
                            <div className="mt-4 space-y-2 border-t border-dashed border-border pt-4">
                                <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                    <CalendarDays className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                    Sat 14 March 2026 · 09:00
                                </p>
                                <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                    Pearl Continental, Peshawar Rd
                                </p>
                                <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                    <Users className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                    320 seats · 48 remaining
                                </p>
                            </div>
                            <a href="#events" className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 bg-primary font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5">
                                Reserve a seat
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </a>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>;
}

/* ------------------------------- stats band ------------------------------- */

function Stats() {
  return <section className="border-b border-border bg-background">
            <div className="mx-auto grid max-w-6xl grid-cols-2 border-x-0 md:grid-cols-4">
                {[{
        value: 240,
        suffix: '+',
        label: 'Events delivered'
      }, {
        value: 18000,
        suffix: '+',
        label: 'Attendees hosted'
      }, {
        value: 96,
        suffix: '%',
        label: 'Client return rate'
      }, {
        value: 7,
        suffix: '',
        label: 'Years in production'
      }].map((stat, i) => <div key={stat.label} className={`p-7 ${i !== 0 ? 'border-l border-border' : ''} ${i >= 2 ? 'max-md:border-t max-md:border-l-0' : ''} ${i === 2 ? 'max-md:border-l' : ''}`}>
                        <CountUp value={stat.value} suffix={stat.suffix} className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl" />
                        <p className="mt-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {stat.label}
                        </p>
                    </div>)}
            </div>
        </section>;
}

/* --------------------------------- events --------------------------------- */

const EVENTS = [{
  img: 'https://images.hostinger.com/975bba4d-8275-4d29-a94d-7e73926f1ab5.png',
  tag: 'Conference',
  title: 'Nowshera Tech Summit 2026',
  date: 'Sat 14 March 2026',
  venue: 'Pearl Continental, Peshawar Rd',
  seats: '48 of 320 remaining',
  price: 'PKR 2,500'
}, {
  img: 'https://images.hostinger.com/99d4ec50-25f5-4601-abf8-d6e72532ddc8.png',
  tag: 'Workshop',
  title: 'Brand Storytelling Lab',
  date: 'Sun 29 March 2026',
  venue: 'NEC Studio, Nowshera Cantt',
  seats: '12 of 40 remaining',
  price: 'PKR 1,800'
}, {
  img: 'https://images.hostinger.com/1a3bfb14-b53a-4c44-8847-6633bcdefc95.png',
  tag: 'Festival',
  title: 'Riverside Sound & Light Festival',
  date: 'Fri 17 April 2026',
  venue: 'Kund Riverside Park',
  seats: 'Open grounds · no cap',
  price: 'PKR 1,200'
}, {
  img: 'https://images.hostinger.com/cf05e31b-3e73-4a76-b8be-27edd8410c94.png',
  tag: 'Private',
  title: 'Garden Wedding Showcase',
  date: 'By appointment',
  venue: 'The Orchard, Risalpur Rd',
  seats: 'Viewing by invite',
  price: 'On request'
}];
function Events() {
  return <section id="events" className="scroll-mt-24 bg-background">
            <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <SectionTag index="01" label="Upcoming events" />
                        <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-5xl">
                            Find your next occasion.
                        </h2>
                        <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground">Browse what is coming up, reserve a seat in seconds, and track your registrations from a single dashboard. Capacity is enforced in real time no overselling, no surprises.</p>
                    </div>
                    <a href="#contact" className="hidden items-center gap-2 font-code text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-accent md:inline-flex">
                        Can’t find what you need? Ask us
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </a>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-7">
                    {EVENTS.map((event, i) => <Reveal key={event.title} delay={i * 0.08} y={28}>
                            <article className="group flex h-full flex-col border border-border bg-card transition-transform duration-300 hover:-translate-y-1.5 paper">
                                <div className="relative aspect-[3/2] overflow-hidden border-b border-border">
                                    <img src={event.img} alt={event.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <span className="absolute left-4 top-4 border border-primary bg-primary px-2.5 py-1 font-code text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
                                        {event.tag}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="font-display text-xl font-medium leading-snug tracking-tight text-foreground">
                                        {event.title}
                                    </h3>
                                    <div className="mt-4 space-y-2">
                                        <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                            {event.date}
                                        </p>
                                        <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                            <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                            {event.venue}
                                        </p>
                                        <p className="flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                            <Users className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                            {event.seats}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-5">
                                        <span className="font-display text-lg font-medium text-foreground">
                                            {event.price}
                                        </span>
                                        <a href="#contact" className="inline-flex h-9 items-center gap-2 border border-primary bg-primary px-4 font-code text-[10px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5">
                                            Register
                                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </Reveal>)}
                </div>
            </div>
        </section>;
}

/* -------------------------------- services -------------------------------- */

const SERVICES = [{
  icon: Mic2,
  name: 'Conferences & summits',
  body: 'End-to-end corporate conferences stage, AV, agenda, speakers, and registration handled by one production team.'
}, {
  icon: Sparkles,
  name: 'Galas & award nights',
  body: 'Black-tie evenings designed down to the centerpiece: venue, catering, run-of-show, and guest seating.'
}, {
  icon: GraduationCap,
  name: 'Workshops & training',
  body: 'Intimate, hands-on sessions with capped attendance, materials, and certificates of participation.'
}, {
  icon: Music,
  name: 'Festivals & concerts',
  body: 'Large-scale outdoor productions with staged sound, lighting, security, and crowd flow planning.'
}, {
  icon: Heart,
  name: 'Weddings & private events',
  body: 'Bespoke celebrations — from garden receptions to grand walimas — managed with discretion and taste.'
}, {
  icon: Building2,
  name: 'Corporate & brand activations',
  body: 'Product launches, store openings, and campus events that put your brand at the center of the room.'
}];
function Services() {
  return <section id="services" className="scroll-mt-24 border-y border-border bg-muted bg-blueprint-light">
            <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="max-w-2xl">
                    <SectionTag index="02" label="What we do" />
                    <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-5xl">
                        Six kinds of occasion. One standard of care.
                    </h2>
                    <p className="mt-5 text-base font-light leading-relaxed text-muted-foreground">From a forty-seat workshop to a riverside festival, every event gets the same disciplined production because the small details are what guests remember.</p>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((service, i) => <Reveal key={service.name} delay={i * 0.05} y={18}>
                            <article className="group h-full bg-card p-7 transition-colors duration-300 hover:bg-background md:p-8">
                                <span className="flex h-11 w-11 items-center justify-center border border-primary bg-primary text-primary-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                                    <service.icon className="h-5 w-5" strokeWidth={1.5} />
                                </span>
                                <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-foreground">
                                    {service.name}
                                </h3>
                                <p className="mt-2.5 text-sm font-light leading-relaxed text-muted-foreground">
                                    {service.body}
                                </p>
                            </article>
                        </Reveal>)}
                </div>
            </div>
        </section>;
}

/* --------------------------------- process -------------------------------- */

const STEPS = [{
  icon: Handshake,
  step: 'Step 01',
  title: 'Brief & scope',
  body: 'We sit down with you to understand the occasion, the audience, the budget, and the one feeling guests should leave with.'
}, {
  icon: CalendarDays,
  step: 'Step 02',
  title: 'Design & plan',
  body: 'Venue, agenda, vendors, and run-of-show are mapped on our platform — every seat, slot, and cost accounted for.'
}, {
  icon: ShieldCheck,
  step: 'Step 03',
  title: 'Register & confirm',
  body: 'Attendees register through a branded page with real-time capacity. You watch the roster fill from your admin console.'
}, {
  icon: Sparkles,
  step: 'Step 04',
  title: 'Produce & report',
  body: 'On the day, our crew runs the show. After, you get attendance, fill-rate, and feedback reports — audit-ready.'
}];
function Process() {
  return <section id="process" className="scroll-mt-24 bg-background">
            <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[240px_1fr]">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <SectionTag index="03" label="How it works" />
                        <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
                            A calm process for a flawless day.
                        </h2>
                        <p className="mt-5 max-w-xs text-base font-light leading-relaxed text-muted-foreground">
                            Four steps from first conversation to final report — transparent at every
                            stage.
                        </p>
                    </div>
                    <div className="border-t border-border">
                        {STEPS.map((s, i) => <Reveal key={s.step} delay={i * 0.06} y={18}>
                                <div className="group grid grid-cols-[auto_1fr] items-start gap-6 border-b border-border py-7 transition-colors duration-200 hover:bg-secondary/50 md:grid-cols-[120px_auto_1fr] md:items-center md:gap-8 md:px-4">
                                    <span className="flex h-12 w-12 items-center justify-center border border-primary bg-primary text-primary-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                                        <s.icon className="h-5 w-5" strokeWidth={1.5} />
                                    </span>
                                    <p className="font-code text-[10px] uppercase tracking-[0.24em] text-accent">
                                        {s.step}
                                    </p>
                                    <div className="col-span-2 md:col-span-1">
                                        <h3 className="font-display text-xl font-medium tracking-tight text-foreground md:text-2xl">
                                            {s.title}
                                        </h3>
                                        <p className="mt-1.5 max-w-xl text-sm font-light leading-relaxed text-muted-foreground">
                                            {s.body}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>)}
                    </div>
                </div>
            </div>
        </section>;
}

/* ---------------------------------- trust --------------------------------- */

const TRUST = [{
  icon: ShieldCheck,
  name: 'Capacity you can trust',
  body: 'Registration is atomic an event can never oversell. Waitlists promote automatically when seats open.',
  img: 'https://images.hostinger.com/f0abdfa7-61e6-487f-abf4-009331980dcc.png',
  imgAlt: 'Registration desk checking tickets at capacity'
}, {
  icon: Clock,
  name: 'On time, every time',
  body: 'A documented run-of-show and a dedicated floor manager mean the day runs to the minute, not the mood.',
  img: 'https://images.hostinger.com/a5440eb1-c836-4e8f-a3dc-d49684f5cfc7.png',
  imgAlt: 'Floor manager coordinating a live event run-of-show'
}, {
  icon: Users,
  name: 'Local network, deep roots',
  body: 'Seven years in Nowshera means trusted venues, caterers, and vendors and backup plans when plans shift.',
  img: 'https://images.hostinger.com/235c8370-e578-47c8-8859-4c77d8ded28c.png',
  imgAlt: 'Local vendors preparing an outdoor event in Nowshera'
}, {
  icon: FileBarChart,
  name: 'Reports that prove value',
  body: 'Attendance, fill rates, and feedback delivered as clean, exportable reports your stakeholders will actually read.',
  img: 'https://images.hostinger.com/398853e4-4b86-49e5-aa93-1f9303c07289.png',
  imgAlt: 'Analyst reviewing event attendance reports on a laptop'
}];
function Trust() {
  return <section id="trust" className="scroll-mt-24 bg-primary text-primary-foreground">
            <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="absolute inset-0 bg-blueprint opacity-50" aria-hidden="true" />
                <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <SectionTag index="04" label="Why EVENTRA" dark />
                        <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
                            Trust isn’t a slogan.{' '}
                            <span className="italic underline decoration-accent decoration-2 underline-offset-8">
                                It’s a process.
                            </span>
                        </h2>
                        <p className="mt-5 max-w-md text-base font-light leading-relaxed text-primary-foreground/70">
                            We earned our reputation one event at a time. Here is what every client
                            gets — whether it is their first summit or their fiftieth walima.
                        </p>
                        <div className="mt-8 overflow-hidden border border-primary-foreground/15">
                            <img src={TEAM_IMG} alt="The EVENTRA production team reviewing an event plan" loading="lazy" className="w-full object-cover" />
                        </div>
                    </div>
                    <div className="border-t border-primary-foreground/15">
                        {TRUST.map((item, i) => <Reveal key={item.name} delay={i * 0.06} y={18}>
                                <div className="group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-primary-foreground/15 py-7 transition-colors duration-200 hover:bg-primary-foreground/5 md:grid-cols-[140px_1fr] md:gap-6 md:px-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-primary-foreground/25 md:h-[88px] md:w-full">
                                        <img src={item.img} alt={item.imgAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <span className="absolute bottom-1.5 left-1.5 flex h-8 w-8 items-center justify-center border border-primary-foreground/40 bg-primary/85 text-primary-foreground backdrop-blur-sm transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                                            <item.icon className="h-4 w-4" strokeWidth={1.5} />
                                        </span>
                                    </div>
                                    <div className="min-w-0 pt-0.5">
                                        <h3 className="font-display text-lg font-medium tracking-tight">
                                            {item.name}
                                        </h3>
                                        <p className="mt-1.5 text-sm font-light leading-relaxed text-primary-foreground/65">
                                            {item.body}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>)}
                    </div>
                </div>
            </div>
        </section>;
}

/* --------------------------------- voices --------------------------------- */

const TESTIMONIALS = [{
  quote: 'They ran our annual tech summit like a Swiss watch. Registration closed at capacity with zero complaints, and the post-event report landed in my inbox the next morning.',
  name: 'Ayesha Khan',
  role: 'Director, KP Innovators Forum'
}, {
  quote: 'Our walima had 600 guests and I didn’t worry about a single thing. The floor manager knew exactly when to move, and the venue looked like a dream.',
  name: 'Bilal & Hira Yousafzai',
  role: 'Wedding · Risalpur Rd'
}, {
  quote: 'We booked a forty-seat workshop and it filled in three days. The waitlist handled itself. That’s the kind of calm I want from a partner.',
  name: 'Dr. Sana Mahmood',
  role: 'Founder, North Clinical Academy'
}];
function Voices() {
  return <section id="voices" className="scroll-mt-24 border-y border-border bg-muted bg-blueprint-light">
            <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="max-w-2xl">
                    <SectionTag index="05" label="In their words" />
                    <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-5xl">
                        The proof is in the room.
                    </h2>
                </div>
                <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-7">
                    {TESTIMONIALS.map((t, i) => <Reveal key={t.name} delay={i * 0.08} y={28}>
                            <figure className="flex h-full flex-col border border-border bg-card p-7 transition-transform duration-300 hover:-translate-y-1.5 paper md:p-8">
                                <Quote className="h-7 w-7 text-accent" strokeWidth={1.5} />
                                <blockquote className="mt-5 flex-1 font-display text-lg font-light leading-relaxed text-foreground">
                                    “{t.quote}”
                                </blockquote>
                                <figcaption className="mt-6 border-t border-dashed border-border pt-4">
                                    <p className="font-display text-base font-medium text-foreground">{t.name}</p>
                                    <p className="mt-0.5 font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                        {t.role}
                                    </p>
                                </figcaption>
                            </figure>
                        </Reveal>)}
                </div>
            </div>
        </section>;
}

/* --------------------------------- contact -------------------------------- */

const CONTACT_REASONS = ['A public event you want us to list', 'A private event you want us to produce', 'A venue or vendor partnership', 'Something else entirely'];
function Contact() {
  return <section id="contact" className="scroll-mt-24 bg-background">
            <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 lg:py-32">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <SectionTag index="06" label="Plan with us" />
                        <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight md:text-5xl">
                            Let’s design your next occasion.
                        </h2>
                        <p className="mt-5 max-w-md text-base font-light leading-relaxed text-muted-foreground">Tell us what you are planning. We will come back within one working day with first thoughts, a rough scope, and a no pressure quote.</p>
                        <ul className="mt-8 space-y-3">
                            {[[Mail, 'hello@nowsheraevents.co'], [Phone, '+92 3132222577'], [MapPin, 'CSD MeGA MALL, Nowshera,2ND FLOOR NEAR METAKLOUDS OFFICE, NOWSHERA, KP']].map(([Icon, text]) => <li key={text} className="flex items-center gap-3 font-code text-[12px] uppercase tracking-[0.14em] text-foreground">
                                    <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
                                    {text}
                                </li>)}
                        </ul>
                    </div>

                    <Reveal y={28}>
                        <form onSubmit={e => {
            e.preventDefault();
            const f = e.currentTarget;
            f.reset();
            const note = document.getElementById('form-note');
            if (note) {
              note.classList.remove('opacity-0');
              note.classList.add('opacity-100');
            }
          }} className="border border-border bg-card p-7 paper md:p-9">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <label className="block">
                                    <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        Full name
                                    </span>
                                    <input required type="text" name="name" placeholder="Your name" className="mt-2 h-11 w-full border border-input bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent" />
                                </label>
                                <label className="block">
                                    <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                        Email
                                    </span>
                                    <input required type="email" name="email" placeholder="you@example.com" className="mt-2 h-11 w-full border border-input bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent" />
                                </label>
                            </div>

                            <label className="mt-5 block">
                                <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    What’s this about?
                                </span>
                                <select name="reason" defaultValue="" className="mt-2 h-11 w-full border border-input bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent">
                                    <option value="" disabled>
                                        Select a reason…
                                    </option>
                                    {CONTACT_REASONS.map(r => <option key={r} value={r}>
                                            {r}
                                        </option>)}
                                </select>
                            </label>

                            <label className="mt-5 block">
                                <span className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Tell us about the event
                                </span>
                                <textarea required name="message" rows={4} placeholder="Date, audience size, venue, and the feeling you want guests to leave with…" className="mt-2 w-full border border-input bg-background p-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent" />
                            </label>

                            <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-primary font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0">
                                Send the brief
                                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                            <p id="form-note" className="mt-4 flex items-center gap-2 font-code text-[11px] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity duration-300">
                                <Check className="h-4 w-4" strokeWidth={2} />
                                Thanks — we’ll be in touch within one working day.
                            </p>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>;
}

/* --------------------------------- footer ---------------------------------- */

function Footer() {
  return <footer className="bg-primary text-primary-foreground">
            <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
                <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
                    <div>
                        <div className="flex items-center gap-3">
                            <img src={LOGO} alt="EVENTRA logo" className="h-11 w-11 object-contain" />
                            <span className="font-display text-xl font-medium tracking-tight">
                                EVENTRA
                            </span>
                        </div>
                        <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-primary-foreground/65">Conferences, galas, workshops, festivals, and weddings designed and delivered with discipline across Nowshera and the wider Khyber Pakhtunkhwa region.</p>
                        <div className="mt-5 flex items-center gap-4">
                            {[Instagram, Facebook, Linkedin].map((Icon, i) => <a key={i} href="#top" aria-label="Social link" className="flex h-9 w-9 items-center justify-center border border-primary-foreground/25 text-primary-foreground/70 transition-colors hover:border-accent hover:text-accent">
                                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                                </a>)}
                        </div>
                    </div>
                    <nav className="flex flex-wrap gap-x-8 gap-y-3">
                        {[['Events', '#events'], ['Services', '#services'], ['Process', '#process'], ['Why us', '#trust'], ['Voices', '#voices'], ['Contact', '#contact']].map(([label, href]) => <a key={href} href={href} className="font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground/60 transition-colors hover:text-primary-foreground">
                                {label}
                            </a>)}
                    </nav>
                </div>
                <div className="mt-12 flex flex-col justify-between gap-3 border-t border-primary-foreground/15 pt-6 md:flex-row md:items-center">
                    <p className="font-code text-[10px] uppercase tracking-[0.2em] text-primary-foreground/45">
                        © {new Date().getFullYear()} EVENTRA — Events, engineered.
                    </p>
                    <a href="mailto:hello@nowsheraevents.co" className="font-code text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60 transition-colors hover:text-primary-foreground">
                        hello@nowsheraevents.co
                    </a>
                </div>
            </div>
        </footer>;
}

/* ---------------------------------- page ----------------------------------- */

export default function HomePage() {
  return <>
            <Helmet>
                <title>EVENTRA — Events, Engineered</title>
                <meta name="description" content="EVENTRA designs and delivers conferences, galas, workshops, festivals, and weddings across Nowshera and Khyber Pakhtunkhwa — with disciplined production and a registration platform that never oversells." />
            </Helmet>
            <Header />
            <AnchorRail />
            <main>
                <Hero />
                <Stats />
                <Events />
                <Services />
                <Process />
                <Trust />
                <Voices />
                <Contact />
            </main>
            <Footer />
        </>;
}