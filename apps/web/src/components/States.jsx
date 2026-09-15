import React from 'react';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';

export function Loader({ label = 'Loading…' }) {
    return (
        <div className="flex items-center justify-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-code text-xs uppercase tracking-[0.2em]">{label}</span>
        </div>
    );
}

export function EmptyState({ title = 'Nothing here yet', body }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-border py-20 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/60" strokeWidth={1.5} />
            <p className="font-display text-lg font-medium text-foreground">{title}</p>
            {body && <p className="max-w-sm text-sm font-light text-muted-foreground">{body}</p>}
        </div>
    );
}

export function ErrorBanner({ message }) {
    return (
        <div
            role="alert"
            className="flex items-start gap-2 border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
