import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LOGO = 'https://horizons-cdn.hostinger.com/505f231a-6d60-4222-985c-2283d3e0fd15/b896a77b4095aa3cc8bad3035e03c60c.png';

export default function AppNav() {
    const { isAuthed, role, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const links = !isAuthed
        ? [
              ['Home', '/'],
              ['Events', '/events'],
              ['Sign In', '/login'],
              ['Create Account', '/signup'],
          ]
        : isAdmin
          ? [
                ['Admin Dashboard', '/admin'],
                ['Manage Events', '/admin/events'],
                ['Reports', '/admin/reports'],
                ['Profile', '/profile'],
            ]
          : [
                ['Dashboard', '/dashboard'],
                ['Events', '/events'],
                ['My Registrations', '/my-registrations'],
                ['Profile', '/profile'],
            ];

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate('/');
    };

    const isActive = (href) =>
        href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <img src={LOGO} alt="EVENTRA logo" className="h-11 w-11 object-contain" />
                    <span className="leading-tight">
                        <span className="block font-display text-base font-semibold tracking-tight">
                            EVENTRA
                        </span>
                        <span className="block font-code text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                            Events, engineered
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 md:flex">
                    {links.map(([label, href]) => (
                        <Link
                            key={href}
                            to={href}
                            className={`font-code text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-foreground ${
                                isActive(href) ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    {isAuthed && (
                        <button
                            onClick={handleLogout}
                            className="inline-flex h-9 items-center gap-2 border border-primary bg-primary px-4 font-code text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5"
                        >
                            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                            Sign Out
                        </button>
                    )}
                </nav>

                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex h-10 w-10 items-center justify-center text-foreground md:hidden"
                    aria-label="Toggle menu"
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {open && (
                <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {links.map(([label, href]) => (
                            <Link
                                key={href}
                                to={href}
                                onClick={() => setOpen(false)}
                                className={`flex h-11 items-center font-code text-xs uppercase tracking-[0.18em] ${
                                    isActive(href) ? 'text-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                        {isAuthed && (
                            <button
                                onClick={handleLogout}
                                className="mt-2 inline-flex h-11 items-center justify-center gap-2 bg-primary font-code text-xs uppercase tracking-[0.18em] text-primary-foreground"
                            >
                                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                                Sign Out
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
