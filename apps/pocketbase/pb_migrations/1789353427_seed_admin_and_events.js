// apps/pocketbase/pb_migrations/1789353427_seed_admin_and_events.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // Find or create the admin account.
    let admin = null;
    try {
      admin = app.findFirstRecordByData("users", "email", "admin@nowsheraevents.co");
    } catch (_) {
      admin = null;
    }
    if (!admin) {
      admin = new Record(users);
      admin.set("email", "admin@nowsheraevents.co");
      admin.set("name", "NEC Admin");
      admin.set("role", "admin");
      admin.set("password", "NECadmin2026!");
      admin.set("passwordConfirm", "NECadmin2026!");
      admin.set("verified", true);
      app.save(admin);
    }

    // Seed a handful of published, future events if none are owned by the admin yet.
    const allEvents = app.findAllRecords("events");
    const owned = allEvents.filter((r) => r.get("owner") === admin.id);
    if (owned.length === 0) {
      const eventsCol = app.findCollectionByNameOrId("events");
      const seed = [
        {
          title: "Nowshera Tech Summit 2026",
          slug: "nowshera-tech-summit-2026",
          description:
            "A full-day conference bringing together founders, engineers, and students from across Khyber Pakhtunkhwa for talks, demos, and networking.",
          location: "Pearl Continental, Peshawar Rd, Nowshera",
          city: "Nowshera",
          startDate: "2026-11-14T09:00:00Z",
          time: "09:00",
          capacity: 320,
          category: "conference",
          price: 2500,
        },
        {
          title: "Brand Storytelling Lab",
          slug: "brand-storytelling-lab",
          description:
            "An intimate, hands-on workshop on crafting brand narratives that convert. Capped at 40 seats with materials and certificates included.",
          location: "NEC Studio, Nowshera Cantt",
          city: "Nowshera",
          startDate: "2026-12-05T10:00:00Z",
          time: "10:00",
          capacity: 40,
          category: "corporate",
          price: 1800,
        },
        {
          title: "Riverside Sound & Light Festival",
          slug: "riverside-sound-light-festival",
          description:
            "An open-air evening festival by the Kabul river with live music, food stalls, and a coordinated light show. Open grounds — bring the family.",
          location: "Kund Riverside Park, Nowshera",
          city: "Nowshera",
          startDate: "2027-01-17T16:00:00Z",
          time: "16:00",
          capacity: 1500,
          category: "festival",
          price: 1200,
        },
        {
          title: "KP Innovators Gala 2027",
          slug: "kp-innovators-gala-2027",
          description:
            "A black-tie gala celebrating the region's most promising startups and leaders. Three-course dinner, awards, and a keynote speaker.",
          location: "Serena Hotel Ballroom, Peshawar",
          city: "Peshawar",
          startDate: "2027-02-20T19:00:00Z",
          time: "19:00",
          capacity: 250,
          category: "gala",
          price: 6000,
        },
        {
          title: "Garden Wedding Showcase",
          slug: "garden-wedding-showcase",
          description:
            "A curated showcase for couples planning their wedding — meet venues, caterers, and decorators, and tour a styled garden reception.",
          location: "The Orchard, Risalpur Rd, Nowshera",
          city: "Nowshera",
          startDate: "2026-10-24T11:00:00Z",
          time: "11:00",
          capacity: 120,
          category: "wedding",
          price: 0,
        },
        {
          title: "North Clinical Health Conference",
          slug: "north-clinical-health-conference",
          description:
            "A medical continuing-education conference for clinicians across KP, featuring case reviews, panel discussions, and CME credits.",
          location: "CSD MeGA MALL, 2nd Floor, Nowshera",
          city: "Nowshera",
          startDate: "2027-03-08T08:30:00Z",
          time: "08:30",
          capacity: 200,
          category: "conference",
          price: 3500,
        },
      ];

      for (const e of seed) {
        const rec = new Record(eventsCol);
        rec.set("title", e.title);
        rec.set("slug", e.slug);
        rec.set("description", e.description);
        rec.set("location", e.location);
        rec.set("venue", e.location);
        rec.set("city", e.city);
        rec.set("startDate", e.startDate);
        rec.set("time", e.time);
        rec.set("capacity", e.capacity);
        rec.set("status", "published");
        rec.set("category", e.category);
        rec.set("price", e.price);
        rec.set("owner", admin.id);
        app.save(rec);
      }
    }
  },
  (app) => {
    // Down: remove seeded events (by slug) and the seeded admin account.
    const slugs = [
      "nowshera-tech-summit-2026",
      "brand-storytelling-lab",
      "riverside-sound-light-festival",
      "kp-innovators-gala-2027",
      "garden-wedding-showcase",
      "north-clinical-health-conference",
    ];
    const allEvents = app.findAllRecords("events");
    for (const r of allEvents) {
      if (slugs.indexOf(r.get("slug")) !== -1) {
        app.delete(r);
      }
    }
    try {
      const admin = app.findFirstRecordByData(
        "users",
        "email",
        "admin@nowsheraevents.co",
      );
      if (admin) app.delete(admin);
    } catch (_) {
      // already gone
    }
  },
);
