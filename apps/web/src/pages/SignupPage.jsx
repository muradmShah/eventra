import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User, Phone, AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
    const [loading, setLoading] = useState(false);

    const update = (key) => (e) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        if (error) {
            setError('');
            setIsDuplicateEmail(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsDuplicateEmail(false);

        if (form.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (form.password !== form.confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await signup(form.email.trim(), form.password, {
                name: form.name.trim(),
                phone: form.phone.trim(),
            });
            navigate('/');
        } catch (err) {
            const data = err?.response?.data || {};
            const emailErr = data.email;
            const passwordErr = data.password || data.passwordConfirm;

            if (
                emailErr?.code === 'validation_not_unique' ||
                /unique/i.test(emailErr?.message || '')
            ) {
                setIsDuplicateEmail(true);
                setError(
                    'An account with this email already exists. Please sign in instead, or use a different email.'
                );
            } else if (emailErr?.message) {
                setError(emailErr.message);
            } else if (passwordErr?.message) {
                setError(passwordErr.message);
            } else {
                const firstField = Object.values(data).find((v) => v?.message);
                setError(
                    firstField?.message ||
                        err?.response?.message ||
                        err?.message ||
                        'Unable to create your account. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-[100dvh] bg-background text-foreground">
            <Helmet>
                <title>Create Account · EVENTRA</title>
                <meta
                    name="description"
                    content="Create an EVENTRA account to register for galas, conferences, weddings, concerts and private events in Nowshera, KP."
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
                                    Become a member
                                </span>
                            </span>
                        </div>
                        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            Create your account
                        </h1>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Register once, then sign up for any event in seconds.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                            >
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <div className="space-y-1">
                                    <p>{error}</p>
                                    {isDuplicateEmail && (
                                        <p>
                                            <Link
                                                to="/login"
                                                className="font-medium underline underline-offset-4 decoration-destructive/60 hover:decoration-destructive"
                                            >
                                                Go to sign in
                                            </Link>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={form.name}
                                    onChange={update('name')}
                                    placeholder="Your full name"
                                    className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                            </div>
                        </div>

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
                                    value={form.email}
                                    onChange={update('email')}
                                    placeholder="you@example.com"
                                    className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                            >
                                Phone <span className="lowercase tracking-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={update('phone')}
                                    placeholder="+92 3XX XXXXXXX"
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
                                    autoComplete="new-password"
                                    required
                                    value={form.password}
                                    onChange={update('password')}
                                    placeholder="At least 8 characters"
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

                        <div className="space-y-2">
                            <label
                                htmlFor="confirm"
                                className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                            >
                                Confirm password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    id="confirm"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={form.confirm}
                                    onChange={update('confirm')}
                                    placeholder="Re-enter your password"
                                    className="h-12 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-accent"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex h-12 w-full items-center justify-center gap-2 bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                        >
                            {loading ? 'Creating account…' : 'Create account'}
                            {!loading && (
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            )}
                        </button>
                    </form>

                    <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-accent" />
                            Your account lets you register for any published event.
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-accent" />
                            We never share your details with third parties.
                        </li>
                    </ul>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-foreground underline underline-offset-4 decoration-accent decoration-2 hover:text-accent"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
