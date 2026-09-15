// apps/pocketbase/pb_hooks/registration-rules.pb.js
/// <reference path="../pb_data/types.d.ts" />

// Backend-enforced registration rules:
//  - attendee is forced to the authenticated user
//  - event must be published and in the future
//  - no duplicate active registration
//  - cannot exceed capacity
//  - cancelled registrations do not count toward capacity
onRecordCreateRequest((e) => {
  // `e.auth` is the authenticated record on the request event directly.
  // (Do NOT use `e.requestInfo.auth` — `requestInfo` is a method, so that
  // resolves to undefined and would reject every authenticated request.)
  const auth = e.auth;
  if (!auth) {
    throw new BadRequestError("You must be signed in to register for an event.");
  }

  // Force attendee to the signed-in user (ignore any client-supplied value).
  e.record.set("attendee", auth.id);

  // Default status to active.
  if (!e.record.get("status")) {
    e.record.set("status", "active");
  }

  const tickets = Number(e.record.get("tickets")) || 1;
  if (tickets < 1) {
    throw new BadRequestError("Ticket count must be at least 1.");
  }
  e.record.set("tickets", tickets);

  const eventId = e.record.get("event");
  if (!eventId) {
    throw new BadRequestError("Event is required.");
  }

  let event;
  try {
    event = $app.findRecordById("events", eventId);
  } catch (_) {
    throw new BadRequestError("Event not found.");
  }

  if (event.get("status") !== "published") {
    throw new BadRequestError("Registration is closed for this event.");
  }

  const startStr = event.get("startDate");
  if (startStr) {
    const start = new Date(startStr);
    if (!isNaN(start.getTime()) && start.getTime() < Date.now()) {
      throw new BadRequestError("Registration has ended for this event.");
    }
  }

  // Duplicate active registration check + capacity check in one pass.
  const all = $app.findAllRecords("registrations");
  let used = 0;
  let alreadyRegistered = false;
  for (let i = 0; i < all.length; i++) {
    const r = all[i];
    if (r.get("event") === eventId && r.get("status") === "active") {
      used += r.get("tickets") || 1;
      if (r.get("attendee") === auth.id) {
        alreadyRegistered = true;
      }
    }
  }

  if (alreadyRegistered) {
    throw new BadRequestError("You are already registered for this event.");
  }

  const capacity = event.get("capacity") || 0;
  if (capacity > 0 && used + tickets > capacity) {
    throw new BadRequestError("This event is full.");
  }

  e.next();
}, "registrations");

// Prevent an admin from reducing event capacity below active registrations.
onRecordUpdateRequest((e) => {
  const newCap = e.record.get("capacity");
  if (newCap !== undefined && newCap !== null && newCap > 0) {
    const eventId = e.record.id;
    const all = $app.findAllRecords("registrations");
    let used = 0;
    for (let i = 0; i < all.length; i++) {
      const r = all[i];
      if (r.get("event") === eventId && r.get("status") === "active") {
        used += r.get("tickets") || 1;
      }
    }
    if (newCap < used) {
      throw new BadRequestError(
        "Capacity cannot be reduced below the number of active registrations (" +
          used +
          ").",
      );
    }
  }
  e.next();
}, "events");
