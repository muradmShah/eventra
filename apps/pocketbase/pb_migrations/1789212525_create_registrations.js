// apps/pocketbase/pb_migrations/1789212525_create_registrations.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    const events = app.findCollectionByNameOrId("events");

    let collection;
    try {
      collection = app.findCollectionByNameOrId("registrations");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "registrations",
        // An attendee sees only their own registrations; an organizer/admin
        // can see registrations for events they own.
        listRule:
          "@request.auth.id != '' && (@request.auth.id = attendee || @request.auth.id = event.owner || @request.auth.role = 'admin')",
        viewRule:
          "@request.auth.id != '' && (@request.auth.id = attendee || @request.auth.id = event.owner || @request.auth.role = 'admin')",
        // Any authenticated user can register for an event.
        createRule: "@request.auth.id != ''",
        // Only the attendee themselves (or an admin) can update/cancel.
        updateRule:
          "@request.auth.id != '' && (@request.auth.id = attendee || @request.auth.role = 'admin')",
        deleteRule:
          "@request.auth.id != '' && (@request.auth.id = attendee || @request.auth.role = 'admin')",
        fields: [
          {
            name: "event",
            type: "relation",
            required: true,
            maxSelect: 1,
            collectionId: events.id,
            cascadeDelete: true,
          },
          {
            name: "attendee",
            type: "relation",
            required: true,
            maxSelect: 1,
            collectionId: users.id,
            cascadeDelete: true,
          },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["pending", "confirmed", "cancelled", "waitlist"],
          },
          { name: "tickets", type: "number", min: 1, onlyInt: true },
          { name: "notes", type: "text", max: 1000 },
          {
            name: "created",
            type: "autodate",
            onCreate: true,
            onUpdate: false,
          },
          {
            name: "updated",
            type: "autodate",
            onCreate: true,
            onUpdate: true,
          },
        ],
        indexes: [
          "CREATE UNIQUE INDEX `idx_registrations_event_attendee` ON `registrations` (`event`, `attendee`)",
          "CREATE INDEX `idx_registrations_attendee` ON `registrations` (`attendee`)",
          "CREATE INDEX `idx_registrations_event` ON `registrations` (`event`)",
          "CREATE INDEX `idx_registrations_status` ON `registrations` (`status`)",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("registrations");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }
  },
);
