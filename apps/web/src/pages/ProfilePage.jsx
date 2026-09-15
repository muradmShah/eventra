import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { User, Mail, Phone, Shield, Check } from 'lucide-react';
import AppNav from '@/components/AppNav';
import { Loader, ErrorBanner } from '@/components/States';
import { useAuth } from '@/contexts/AuthContext';
import pb from '@/lib/pocketbaseClient';

export default function ProfilePage() {
    const { user, reloadUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setLoading(false);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaved(false);
        setSaving(true);
        try {
            await pb.collection('users').update(user.id, {
                name: name.trim(),
                phone: phone.trim(),
            });
            await reloadUser();
            setSaved(true);
        } catch (err) {
            setError(err?.response?.message || 'Unable to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[100dvh] bg-background pt-16">
                <AppNav />
                <Loader label="Loading profile…" />
            </main>
        );
    }

    const inputCls =
        'h-11 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors focus:border-accent';

    return (
        <main className="min-h-[100dvh] bg-background pt-16">
            <Helmet>
                <title>Profile · EVENTRA</title>
                <meta name="description" content="View and update your profile." />
            </Helmet>
            <AppNav />
            <div className="mx-auto max-w-2xl px-5 py-16 md:px-8">
                <p className="font-code text-xs uppercase tracking-[0.28em] text-accent">
                    Account
                </p>
                <h1 className="mt-4 font-display text-4xl font-light tracking-tight md:text-5xl">
                    Profile
                </h1>

                <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
                    {[
                        [Mail, 'Email', user.email],
                        [Shield, 'Role', user.role],
                        [User, 'Member since', new Date(user.created).toLocaleDateString()],
                    ].map(([Icon, label, value]) => (
                        <div key={label} className="bg-card p-5">
                            <p className="flex items-center gap-2 font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                                {label}
                            </p>
                            <p className="mt-2 break-words font-display text-base font-medium text-foreground">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-10 space-y-5 border border-border bg-card p-7 paper">
                    {error && <ErrorBanner message={error} />}
                    {saved && (
                        <div className="flex items-center gap-2 border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-accent">
                            <Check className="h-4 w-4" /> Profile updated.
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor="name">
                            Full name
                        </label>
                        <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputCls}
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground" htmlFor="phone">
                            Phone
                        </label>
                        <div className="relative">
                            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={inputCls}
                                placeholder="+92 3XX XXXXXXX"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-12 items-center justify-center gap-2 bg-primary px-8 font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60"
                    >
                        {saving ? 'Saving…' : 'Save changes'}
                    </button>
                </form>
            </div>
        </main>
    );
}
