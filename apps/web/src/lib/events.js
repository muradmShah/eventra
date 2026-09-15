import pb from '@/lib/pocketbaseClient';

/** Public: published events that start in the future. */
export async function fetchPublishedEvents() {
    const now = new Date().toISOString();
    return pb.collection('events').getFullList({
        filter: `status = "published" && startDate > "${now}"`,
        sort: 'startDate',
    });
}

/** Public: single event. */
export async function fetchEvent(id) {
    return pb.collection('events').getOne(id);
}

/** Admin: all events. */
export async function fetchAllEvents() {
    return pb.collection('events').getFullList({ sort: '-created' });
}

export async function createEvent(data) {
    return pb.collection('events').create({
        ...data,
        owner: pb.authStore.record.id,
    });
}

export async function updateEvent(id, data) {
    return pb.collection('events').update(id, data);
}

export async function deleteEvent(id) {
    return pb.collection('events').delete(id);
}

export async function setEventStatus(id, status) {
    return pb.collection('events').update(id, { status });
}

/** Attendee: register for an event (attendee is set server-side). */
export async function registerForEvent(eventId, tickets = 1, notes = '') {
    return pb.collection('registrations').create({
        event: eventId,
        tickets,
        notes,
        status: 'active',
    });
}

/** Attendee: has the current user an active registration for this event? */
export async function fetchMyRegistrationForEvent(eventId) {
    const me = pb.authStore.record;
    if (!me) return null;
    const list = await pb.collection('registrations').getList(1, 1, {
        filter: `event = "${eventId}" && attendee = "${me.id}" && status = "active"`,
    });
    return list.items[0] || null;
}

/** Attendee: all of my registrations, newest first, with event expanded. */
export async function fetchMyRegistrations() {
    const me = pb.authStore.record;
    if (!me) return [];
    return pb.collection('registrations').getFullList({
        filter: `attendee = "${me.id}"`,
        sort: '-created',
        expand: 'event',
    });
}

export async function cancelRegistration(id) {
    return pb.collection('registrations').update(id, { status: 'cancelled' });
}

/** Admin: registrations for a specific event, attendee expanded. */
export async function fetchEventRegistrations(eventId) {
    return pb.collection('registrations').getFullList({
        filter: `event = "${eventId}"`,
        sort: '-created',
        expand: 'attendee',
    });
}

/** Admin: all registrations (admin listRule allows this). */
export async function fetchAllRegistrations() {
    return pb.collection('registrations').getFullList({ sort: '-created', expand: 'event' });
}

export function seatsRemaining(event) {
    if (!event) return 0;
    if (!event.capacity || event.capacity <= 0) return -1; // unlimited
    const used = event.registeredSeats || 0;
    return Math.max(0, event.capacity - used);
}

export function isFull(event) {
    const r = seatsRemaining(event);
    return r === 0;
}

export function formatPrice(price) {
    if (price === 0 || price === undefined || price === null) return 'Free';
    return `PKR ${Number(price).toLocaleString()}`;
}
