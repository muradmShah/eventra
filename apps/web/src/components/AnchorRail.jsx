import React, { useEffect, useState } from 'react';

const SECTIONS = [
    { id: 'events', label: 'Events' },
    { id: 'services', label: 'Services' },
    { id: 'process', label: 'Process' },
    { id: 'trust', label: 'Why us' },
    { id: 'voices', label: 'Voices' },
    { id: 'contact', label: 'Contact' },
];

export default function AnchorRail() {
    const [active, setActive] = useState('events');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-38% 0px -55% 0px' }
        );
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const jump = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav
            aria-label="Section navigation"
            className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
        >
            <ul className="flex flex-col gap-4">
                {SECTIONS.map(({ id, label }, i) => {
                    const isActive = active === id;
                    return (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() => jump(id)}
                                className="group flex items-center gap-3"
                                aria-current={isActive ? 'true' : undefined}
                            >
                                <span
                                    className={`font-code text-[10px] tracking-widest transition-opacity duration-200 ${
                                        isActive ? 'opacity-100' : 'opacity-35 group-hover:opacity-70'
                                    }`}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span
                                    className={`block h-px transition-all duration-300 ${
                                        isActive
                                            ? 'w-8 bg-accent'
                                            : 'w-4 bg-foreground/40 group-hover:w-6 group-hover:bg-foreground/70'
                                    }`}
                                />
                                <span
                                    className={`font-code text-[10px] uppercase tracking-[0.2em] transition-all duration-200 ${
                                        isActive
                                            ? 'translate-x-0 text-foreground opacity-100'
                                            : '-translate-x-1 text-foreground/45 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                    }`}
                                >
                                    {label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
