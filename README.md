# EVENTRA — Event Registration & Management System

EVENTRA is a full-stack **Event Registration & Management System** developed for **Nowshera Events Co.** It provides a centralized platform where attendees can discover and register for events while administrators manage events, capacity, registrations, attendees, and operational reporting.

This project was developed as part of **AI SKOOL Portfolio Month 2026**.

---

## Project Overview

Nowshera Events Co. organizes workshops, seminars, conferences, and community events.

Previously, registrations were managed through WhatsApp messages and spreadsheets. As attendance increased, this created challenges with:

- Event capacity management
- Duplicate registrations
- Registration confirmation
- Attendee records
- Event availability
- Operational reporting
- Access control

EVENTRA solves these problems through a centralized web-based event management platform.

---

## User Roles

The system supports two primary roles:

### Attendee

Attendees can:

- Create an account
- Sign in and sign out
- Browse published upcoming events
- View event details
- Check event availability
- Register for eligible events
- View personal registrations
- Cancel eligible registrations
- Manage their profile

Attendees cannot:

- Manage events
- Access administrator features
- View another attendee's private information
- Register twice for the same event

### Administrator

Administrators can:

- Access the Admin Dashboard
- Create events
- Edit events
- Define event capacity
- Publish events
- Complete events
- Cancel events
- View event attendee lists
- Search and filter registrations
- Monitor registration totals
- Review capacity information
- Access reports and operational information

---

## Core Features

### Authentication

- User registration
- User login
- User logout
- Admin and Attendee roles
- Protected application areas
- Role-based access

### Event Management

Administrators can create and manage events containing:

- Event title
- Description
- Date
- Time
- Location
- Capacity
- Event status

### Event Lifecycle

Events can move through the following states:

```text
Draft
  ↓
Published
  ↓
Completed

Published
  ↓
Cancelled
```

Only eligible **Published** events can accept new registrations.

### Event Discovery

Attendees can browse published upcoming events and view:

- Event information
- Date and time
- Location
- Capacity
- Availability
- Event details

### Registration Management

Authenticated attendees can:

- Register for available events
- View their registrations
- Cancel eligible registrations

The system is designed to prevent:

- Duplicate registrations
- Registration beyond capacity
- Registration for cancelled events
- Registration for completed events
- Registration for past events

### Admin Dashboard

The administrator dashboard provides operational visibility into:

- Events
- Registrations
- Attendees
- Event capacity
- Remaining availability
- Event status

### Attendee Management

Administrators can review event-level attendee information to support event preparation and check-in operations.

### Reports

The reporting area provides administrators with useful event and registration information for operational monitoring.

---

## Business Rules

EVENTRA follows these core business rules:

1. An attendee may have only one active registration per event.
2. An event must be published before attendees can register.
3. Past events cannot accept new registrations.
4. Cancelled events cannot accept new registrations.
5. Completed events cannot accept new registrations.
6. Events cannot accept registrations beyond their configured capacity.
7. Cancelled registrations do not count toward used capacity.
8. Only administrators can create or manage events.
9. Capacity must be a positive whole number.
10. Capacity should not be reduced below existing active registrations.
11. Attendees can access only their own private registration information.
12. Important records retain creation and update information.

---

## Security

EVENTRA is designed around role-based access control.

Security considerations include:

- Authentication before protected operations
- Admin and Attendee role separation
- Record ownership controls
- Input validation
- Protected attendee information
- Prevention of unauthorized event management
- Prevention of cross-user registration access
- Sensitive credentials should not be stored directly in frontend source code

---

## Technology Stack

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Responsive Web Design

### Backend / Data

- PocketBase
- Authentication
- Persistent application data

### Development & Version Control

- Hostinger AI Website Builder
- Git
- GitHub
- npm

### Deployment

- Hostinger

---

## System Architecture

EVENTRA follows a web application architecture:

```text
┌──────────────────────────────┐
│           USER               │
│                              │
│   Attendee       Admin       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       React Frontend         │
│                              │
│  Pages                       │
│  Components                  │
│  Forms                       │
│  Dashboards                  │
│  Event Discovery             │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Application Logic       │
│                              │
│ Authentication               │
│ Authorization                │
│ Event Management             │
│ Registration Logic           │
│ Capacity Rules               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         PocketBase           │
│                              │
│ Users                        │
│ Events                       │
│ Registrations                │
│ Persistent Data              │
└──────────────────────────────┘
```

---

## Data Model

The application retains the information required to manage users, events, and registrations.

### Users

Typical user information includes:

```text
User
├── ID
├── Name
├── Email
├── Authentication Data
├── Role
├── Created At
└── Updated At
```

### Events

```text
Event
├── ID
├── Title
├── Description
├── Date
├── Time
├── Location
├── Capacity
├── Status
├── Created At
└── Updated At
```

### Registrations

```text
Registration
├── ID
├── User / Attendee
├── Event
├── Registration Status
├── Created At
└── Updated At
```

### Relationships

```text
User
  │
  │ 1
  │
  └──────────────< Registration >──────────────┐
                                               │
                                               │ *
                                               │
                                               1
                                             Event
```

A user can have registrations for multiple events, and an event can contain registrations from multiple attendees.

---

## Project Structure

```text
eventra/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── lib/
│   │   │   ├── components/
│   │   │   └── main.jsx
│   │   │
│   │   ├── tailwind.config.js
│   │   └── vite.config.js
│   │
│   └── pocketbase/
│
├── .gitignore
├── .nvmrc
├── .version
├── knip.json
├── package.json
├── package-lock.json
└── README.md
```

---

## Application Pages

EVENTRA includes the major pages required for the attendee and administrator workflows.

### Public / Authentication

- Home
- Sign Up
- Sign In
- Events
- Event Details

### Attendee

- Attendee Dashboard
- My Registrations
- Profile

### Administrator

- Admin Dashboard
- Manage Events
- Create Event
- Edit Event
- Event Attendees
- Reports

---

## Installation & Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/muradmShah/eventra.git
```

### 2. Enter the Project

```bash
cd eventra
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Environment

```bash
npm run dev
```

> Local execution may require the appropriate PocketBase configuration and environment settings used by the project.

---

## Live Deployment

The application is deployed on **Hostinger**.

### Live Application

https://nowshera-events-mvp-416233.hostingersite.com/

### GitHub Repository

https://github.com/muradmShah/eventra

---

## Testing

The following workflows should be verified during final testing:

### Authentication

- [x] Attendee account creation
- [x] Attendee login
- [x] Admin login
- [x] Logout
- [x] Role-based redirection

### Attendee

- [x] Attendee Dashboard
- [x] Event discovery
- [x] Event details
- [x] My Registrations
- [x] Profile access
- [x] Mobile responsiveness

### Administrator

- [x] Admin Dashboard
- [x] Event management
- [x] Event attendee view
- [x] Reports interface

### Business Rules

Final submission testing should verify:

- [ ] Duplicate registration prevention
- [ ] Capacity enforcement
- [ ] Cancelled event registration prevention
- [ ] Completed event registration prevention
- [ ] Past event registration prevention
- [ ] Registration cancellation updates availability
- [ ] Attendee data ownership protection
- [ ] Capacity cannot be reduced below active registrations

---

## Test Accounts

Test credentials can be provided to the evaluator for application verification.

### Admin Test Account

```text
Email: ADD_ADMIN_TEST_EMAIL
Password: ADD_ADMIN_TEST_PASSWORD
```

### Attendee Test Account

```text
Email: ADD_ATTENDEE_TEST_EMAIL
Password: ADD_ATTENDEE_TEST_PASSWORD
```

> Only dedicated test credentials should be published here. Never place personal passwords, API keys, service credentials, or production secrets in the repository.

---

## Feature Completion Checklist

| Feature | Status |
|---|---|
| Responsive website | Complete |
| User authentication | Complete |
| Admin role | Complete |
| Attendee role | Complete |
| Attendee Dashboard | Complete |
| Admin Dashboard | Complete |
| Event discovery | Complete |
| Event details | Complete |
| Event management interface | Complete |
| My Registrations | Complete |
| Event attendee interface | Complete |
| Reports interface | Complete |
| Git repository | Complete |
| GitHub repository | Complete |
| Hostinger deployment | Complete |
| README documentation | Complete |
| Final business-rule testing | Pending verification |
| Database schema evidence | Pending |
| Final screenshots | Pending |
| Final testing evidence | Pending |

---

## Acceptance Testing

### Successful Registration

**Given:** An authenticated attendee selects a published future event with available capacity.

**When:** The attendee confirms registration.

**Expected Result:** One registration is created and event availability is updated.

### Duplicate Registration

**Given:** An attendee already has an active registration for an event.

**When:** The attendee attempts to register again.

**Expected Result:** The second registration is rejected.

### Capacity Enforcement

**Given:** An event has reached maximum capacity.

**When:** Another attendee attempts to register.

**Expected Result:** Registration is rejected and capacity is not exceeded.

### Data Protection

**Given:** An authenticated attendee attempts to access another attendee's private registration information.

**Expected Result:** Access is denied.

---

## Responsive Design

EVENTRA is designed for current desktop and mobile browsers.

The interface includes:

- Responsive navigation
- Responsive event layouts
- Mobile-friendly forms
- Responsive dashboards
- Accessible primary actions
- Desktop and mobile event discovery

---

## Known Limitations

The following features are outside the scope of the current release:

- Online payments
- Reserved seating
- Seat maps
- Native mobile applications
- Production SMS infrastructure
- QR-code check-in
- Multi-language support
- Advanced ticket pricing
- Production-scale email delivery

---

## Future Improvements

Potential future releases could introduce:

- QR-code tickets
- QR-based check-in
- Automated confirmation emails
- Event reminder emails
- Calendar integration
- Attendance tracking
- Advanced analytics
- PDF attendee reports
- Event certificates
- Notification system
- Enhanced admin reporting

---

## AI SKOOL Portfolio Month 2026

**Project:** Event Registration & Management System

**Product:** EVENTRA

**Client:** Nowshera Events Co.

**Domain:** Events / Operations

**Program:** AI SKOOL Portfolio Month 2026

**Project Difficulty:** 5/10

---

## Submission Deliverables

The final project handover includes:

- Live deployed application
- GitHub repository
- README documentation
- Admin test account
- Attendee test account
- Database schema evidence
- Feature completion checklist
- Application screenshots
- Testing evidence
- Known limitations

---

## Author

**Murad Shah**

GitHub: **muradmShah**

Project: **EVENTRA — Event Registration & Management System**

---

## License

This project was developed for educational and portfolio purposes as part of AI SKOOL Portfolio Month 2026.