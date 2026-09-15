import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(pb.authStore.record);

    useEffect(() => {
        const unsub = pb.authStore.onChange((_token, record) => setUser(record));
        // Validate the persisted token on load. If it's stale/invalid (expired,
        // or invalidated by a server restart), refresh it — and when that fails,
        // clear the store so the UI reflects a true signed-out state instead of
        // letting the next request fail with a confusing "must be signed in".
        if (pb.authStore.isValid) {
            pb.collection('users')
                .authRefresh()
                .then(() => setUser(pb.authStore.record))
                .catch((err) => {
                    // Only wipe the session on a real auth rejection (expired or
                    // invalidated token). Transient network/server hiccups
                    // (status 0, aborts, 5xx) must NOT log the user out —
                    // otherwise a brief backend blip during a page reload clears
                    // the session and bounces the user to /login, which wipes any
                    // in-progress form input and can feel like a refresh loop.
                    const status = err?.status ?? 0;
                    if (status === 401 || status === 403) {
                        pb.authStore.clear();
                        setUser(null);
                    }
                });
        }
        return unsub;
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthed: pb.authStore.isValid,
            role: user?.role || null,
            isAdmin: user?.role === 'admin' || user?.role === 'organizer',
            login: (email, password) => pb.collection('users').authWithPassword(email, password),
            signup: async (email, password, extraFields = {}) => {
                // role is required on users; public sign-up may only create attendees
                const { role: _ignoredRole, ...safeExtra } = extraFields || {};
                await pb.collection('users').create({
                    email,
                    password,
                    passwordConfirm: password,
                    ...safeExtra,
                    role: 'attendee',
                });

                return pb.collection('users').authWithPassword(email, password);
            },
            logout: () => pb.authStore.clear(),
            reloadUser: async () => {
                const record = pb.authStore.record;
                if (!record) return;
                const fresh = await pb.collection('users').getOne(record.id);
                pb.authStore.save(pb.authStore.token, fresh);
                setUser(fresh);
            },
        }),
        [user],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
