import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email.trim(), password);
            const role = res?.record?.role;
            if (role === 'admin' || role === 'organizer') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const apiMessage = String(err?.response?.message || '').toLowerCase();
            const isInvalidCredentials =
                err?.status === 400 ||
                err?.response?.status === 400 ||
                apiMessage.includes('failed to authenticate') ||
                apiMessage.includes('invalid login credentials');

            setError(
                isInvalidCredentials
                    ? 'The email address or password is incorrect. Please check your details and try again.'
                    : 'We couldn’t sign you in right now. Please try again in a moment.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-[100dvh] bg-background text-foreground">
            <Helmet>
                <title>Sign In · EVENTRA</title>
                <meta
                    name="description"
                    content="Sign in to your EVENTRA account to register for events and manage your bookings."
                />
            </Helmet>

            <div className="bg-blueprint-light absolute inset-0 -z-10 opacity-60" />

            <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-5 py-16 md:px-8">
                <Link
                    to="/"
                    className="mb-10 inline-flex items-center gap-2 font-code text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to site
                </Link>

                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center bg-primary font-display text-sm font-semibold text-primary-foreground paper-sm">
                                EV
                            </span>
                            <span className="leading-tight">
                                <span className="block font-display text-base font-semibold tracking-tight">
                                    EVENTRA
                                </span>
                                <span className="block font-code text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                                    Member access
                                </span>
                            </span>
                        </div>
                        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            Welcome back
                        </h1>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Sign in to manage your event registrations and bookings.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                            >
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 w-full border border-input bg-background pl-10 pr-20 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 font-code text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex h-12 w-full items-center justify-center gap-2 bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                        >
                            {loading ? 'Signing in…' : 'Sign in'}
                            {!loading && (
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        New to EVENTRA?{' '}
                        <Link
                            to="/signup"
                            className="font-medium text-foreground underline underline-offset-4 decoration-accent decoration-2 hover:text-accent"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
