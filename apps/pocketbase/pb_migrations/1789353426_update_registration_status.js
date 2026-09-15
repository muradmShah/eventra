// apps/pocketbase/pb_migrations/1789353426_update_registration_status.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const regs = app.findCollectionByNameOrId("registrations");
    const field = regs.fields.getByName("status");
    field.values = ["active", "cancelled"];
    app.save(regs);
  },
  (app) => {
    const regs = app.findCollectionByNameOrId("registrations");
    const field = regs.fields.getByName("status");
    field.values = ["pending", "confirmed", "cancelled", "waitlist"];
    app.save(regs);
  },
);
