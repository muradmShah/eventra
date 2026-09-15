// apps/pocketbase/pb_migrations/1789212523_add_role_to_users.js
/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // Add a privileged role field to distinguish attendees from organizers/admins.
    if (!users.fields.getByName("role")) {
      users.fields.add(
        new SelectField({
          name: "role",
          required: true,
          maxSelect: 1,
          values: ["attendee", "organizer", "admin"],
        }),
      );
    }

    // Optional contact phone for event attendees.
    if (!users.fields.getByName("phone")) {
      users.fields.add(
        new TextField({
          name: "phone",
          max: 32,
        }),
      );
    }

    // Public sign-up is open (event attendees self-register), but a new
    // account may only set role to "attendee" (or leave it unset).
    users.createRule =
      "(@request.body.role:isset = false || @request.body.role = 'attendee')";

    // Lock the privileged role field: a user can update their own record but
    // cannot change their role unless an admin does it.
    users.updateRule =
      "(id = @request.auth.id && @request.body.role:changed = false) || @request.auth.role = 'admin'";

    app.save(users);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    if (users.fields.getByName("role")) {
      users.fields.removeByName("role");
    }
    if (users.fields.getByName("phone")) {
      users.fields.removeByName("phone");
    }
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    app.save(users);
  },
);
