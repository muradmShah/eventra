// apps/pocketbase/pb_migrations/1789212524_create_events.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    let collection;
    try {
      collection = app.findCollectionByNameOrId("events");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "events",
        // Events are publicly readable (marketing site lists upcoming events).
        listRule: "",
        viewRule: "",
        // Only authenticated organizers/admins can create events.
        createRule:
          "@request.auth.id != '' && (@request.auth.role = 'organizer' || @request.auth.role = 'admin')",
        // The organizer who owns the event, or any admin, can edit/delete.
        updateRule:
          "@request.auth.id != '' && (@request.auth.id = owner || @request.auth.role = 'admin')",
        deleteRule:
          "@request.auth.id != '' && (@request.auth.id = owner || @request.auth.role = 'admin')",
        fields: [
          { name: "title", type: "text", required: true, max: 200 },
          { name: "slug", type: "text", max: 220, pattern: "^[a-z0-9-]+$" },
          { name: "description", type: "text", max: 5000 },
          { name: "venue", type: "text", max: 200 },
          { name: "city", type: "text", max: 100 },
          {
            name: "startDate",
            type: "date",
            required: true,
          },
          { name: "endDate", type: "date" },
          {
            name: "capacity",
            type: "number",
            min: 0,
            onlyInt: true,
          },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["draft", "published", "cancelled", "completed"],
          },
          {
            name: "category",
            type: "select",
            maxSelect: 1,
            values: [
              "gala",
              "conference",
              "wedding",
              "corporate",
              "concert",
              "festival",
              "private",
            ],
          },
          { name: "price", type: "number", min: 0 },
          {
            name: "image",
            type: "file",
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
            ],
          },
          {
            name: "owner",
            type: "relation",
            required: true,
            maxSelect: 1,
            collectionId: users.id,
            cascadeDelete: true,
          },
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
          "CREATE UNIQUE INDEX `idx_events_slug` ON `events` (`slug`) WHERE `slug` != ''",
          "CREATE INDEX `idx_events_status` ON `events` (`status`)",
          "CREATE INDEX `idx_events_startDate` ON `events` (`startDate`)",
          "CREATE INDEX `idx_events_owner` ON `events` (`owner`)",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("events");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }
  },
);
