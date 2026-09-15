// apps/pocketbase/pb_hooks/event-computed.pb.js
/// <reference path="../pb_data/types.d.ts" />

// Attach computed `registeredSeats` and `remainingSeats` to every event
// serialized through the API so the frontend can show live capacity without
// needing to list other people's registrations.
onRecordEnrich((e) => {
  try {
    const eventId = e.record.id;
    const all = $app.findAllRecords("registrations");
    let used = 0;
    for (let i = 0; i < all.length; i++) {
      const r = all[i];
      if (r.get("event") === eventId && r.get("status") === "active") {
        used += r.get("tickets") || 1;
      }
    }
    const cap = e.record.get("capacity") || 0;
    e.record.withCustomData(true);
    e.record.set("registeredSeats", used);
    e.record.set("remainingSeats", cap > 0 ? Math.max(0, cap - used) : -1);
  } catch (err) {
    $app.logger().error("event enrich failed", "err", String(err));
  }
  e.next();
}, "events");
