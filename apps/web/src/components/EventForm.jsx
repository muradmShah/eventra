import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const CATEGORIES = [
    ['conference', 'Conference'],
    ['gala', 'Gala'],
    ['wedding', 'Wedding'],
    ['corporate', 'Corporate'],
    ['concert', 'Concert'],
    ['festival', 'Festival'],
    ['private', 'Private'],
];

const STATUSES = [
    ['draft', 'Draft'],
    ['published', 'Published'],
    ['completed', 'Completed'],
    ['cancelled', 'Cancelled'],
];

const DEFAULT_FORM = {
    title: '',
    description: '',
    startDate: '',
    time: '',
    location: '',
    capacity: '',
    price: '',
    category: 'conference',
    status: 'draft',
};

// Restore an in-progress draft from sessionStorage so a sudden page reload
// (dev-server restart, preview re-render) doesn't wipe everything the admin
// just typed. Only active when a draftKey is passed (Create flow); the Edit
// flow loads initialValues from the server and is left untouched.
function loadDraft(draftKey, initialValues) {
    const base = { ...DEFAULT_FORM, ...(initialValues || {}) };
    if (!draftKey) return base;
    try {
        const saved = sessionStorage.getItem(draftKey);
        if (saved) return { ...base, ...JSON.parse(saved) };
    } catch {}
    return base;
}

const inputCls =
    'h-11 w-full border border-input bg-background px-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent';
const labelCls = 'font-code text-[10px] uppercase tracking-[0.2em] text-muted-foreground';

export default function EventForm({ initialValues, onSubmit, submitLabel, submitting, draftKey }) {
    const [form, setForm] = useState(() => loadDraft(draftKey, initialValues));
    const [error, setError] = useState('');

    useEffect(() => {
        if (!draftKey) return;
        try {
            sessionStorage.setItem(draftKey, JSON.stringify(form));
        } catch {}
    }, [draftKey, form]);

    const clearDraft = () => {
        if (!draftKey) return;
        try {
            sessionStorage.removeItem(draftKey);
        } catch {}
    };

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) {
            setError('Title is required.');
            return;
        }
        if (!form.startDate) {
            setError('Start date is required.');
            return;
        }
        const capacityNum = Number(form.capacity);
        if (form.capacity !== '' && (isNaN(capacityNum) || capacityNum < 0)) {
            setError('Capacity must be a non-negative number.');
            return;
        }

        const payload = {
            title: form.title.trim(),
            description: form.description.trim(),
            startDate: new Date(form.startDate).toISOString(),
            time: form.time.trim(),
            location: form.location.trim(),
            venue: form.location.trim(),
            capacity: form.capacity === '' ? 0 : capacityNum,
            price: form.price === '' ? 0 : Number(form.price),
            category: form.category,
            status: form.status,
        };

        try {
            await onSubmit(payload);
            clearDraft();
        } catch (err) {
            const data = err?.response?.data || {};
            const first = Object.values(data)[0];
            setError(first?.message || err?.message || 'Unable to save event.');
        }
    };

    return (
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
                <label className={labelCls} htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    required
                    value={form.title}
                    onChange={update('title')}
                    className={inputCls}
                    placeholder="Event title"
                />
            </div>

            <div className="space-y-2">
                <label className={labelCls} htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={update('description')}
                    className="w-full border border-input bg-background p-3 font-sans text-sm text-foreground outline-none transition-colors focus:border-accent"
                    placeholder="What is this event about?"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className={labelCls} htmlFor="startDate">
                        Date
                    </label>
                    <input
                        id="startDate"
                        type="datetime-local"
                        required
                        value={form.startDate}
                        onChange={update('startDate')}
                        className={inputCls}
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelCls} htmlFor="time">
                        Display time
                    </label>
                    <input
                        id="time"
                        value={form.time}
                        onChange={update('time')}
                        className={inputCls}
                        placeholder="e.g. 09:00"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className={labelCls} htmlFor="location">
                    Location
                </label>
                <input
                    id="location"
                    value={form.location}
                    onChange={update('location')}
                    className={inputCls}
                    placeholder="Venue and city"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                    <label className={labelCls} htmlFor="capacity">
                        Capacity
                    </label>
                    <input
                        id="capacity"
                        type="number"
                        min="0"
                        value={form.capacity}
                        onChange={update('capacity')}
                        className={inputCls}
                        placeholder="0 = unlimited"
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelCls} htmlFor="price">
                        Price (PKR)
                    </label>
                    <input
                        id="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={update('price')}
                        className={inputCls}
                        placeholder="0 = free"
                    />
                </div>
                <div className="space-y-2">
                    <label className={labelCls} htmlFor="category">
                        Category
                    </label>
                    <select
                        id="category"
                        value={form.category}
                        onChange={update('category')}
                        className={inputCls}
                    >
                        {CATEGORIES.map(([v, l]) => (
                            <option key={v} value={v}>
                                {l}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className={labelCls} htmlFor="status">
                    Status
                </label>
                <select
                    id="status"
                    value={form.status}
                    onChange={update('status')}
                    className={inputCls}
                >
                    {STATUSES.map(([v, l]) => (
                        <option key={v} value={v}>
                            {l}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 bg-primary font-code text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto sm:px-8"
            >
                {submitting ? 'Saving…' : submitLabel}
            </button>
        </form>
    );
}
