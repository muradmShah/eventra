// apps/pocketbase/pb_migrations/1789353425_add_event_time_location.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const events = app.findCollectionByNameOrId("events");

    if (!events.fields.getByName("time")) {
      events.fields.add(new TextField({ name: "time", max: 20 }));
    }
    if (!events.fields.getByName("location")) {
      events.fields.add(new TextField({ name: "location", max: 200 }));
    }

    app.save(events);
  },
  (app) => {
    const events = app.findCollectionByNameOrId("events");
    if (events.fields.getByName("time")) {
      events.fields.removeByName("time");
    }
    if (events.fields.getByName("location")) {
      events.fields.removeByName("location");
    }
    app.save(events);
  },
);
