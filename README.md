# DJEP Node.js SDK

Official Node.js SDK for the [DJ Event Planner (DJEP)](https://www.djeventplanner.com) REST API.

## Requirements

- Node.js 14 or later
- No external dependencies

## Installation

### Via npm

```bash
npm install @djeventplannerhub/djep-sdk
```

### Manual Installation

Download the SDK and require it directly:

```javascript
const DJEP = require('./djep-node-sdk');
```

## Quick Start

```javascript
const DJEP = require('@djeventplannerhub/djep-sdk');

// Load your API key from environment variables (never hardcode keys)
const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN);

// Check API status
const status = await djep.status();
console.log(status.data.api_version);

// List upcoming events
const events = await djep.events.list({ status: 'Booked', per_page: 10 });
events.data.forEach(event => {
  console.log(`${event.event_type} on ${event.event_date}`);
});
```

## Authentication

Your API key is generated in DJEP under **Setup > Integrations > API Key**.

**Important:** Never hardcode your API key in source files. Use environment variables.

```javascript
// Environment variable (recommended)
const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN);

// Or from a .env file (using dotenv)
require('dotenv').config();
const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN);
```

## Usage

### Events

```javascript
// List events
const events = await djep.events.list({ status: 'Booked', sort_by: 'event_date' });

// Get a single event
const event = await djep.events.get(56789);

// Create an event (financials auto-calculated from package)
const newEvent = await djep.events.create({
  clientid: 12345,
  event_date: '2026-09-15',
  event_type: 'Wedding',
  start_time: '3:00 PM',
  end_time: '11:00 PM',
  addons: '501:2,502:1',
});
console.log(`Total fee: ${newEvent.data.financials.total_fee}`);

// Update specific fields
await djep.events.update(56789, { status: 'Confirmed', guest_count: 200 });

// Update and recalculate financials
await djep.events.update(56789, { pkg_idnumber: 14200 }, true);

// Delete an event (cascading)
await djep.events.delete(56789);

// Event sub-data
const payments = await djep.events.payments(56789);
const songs = await djep.events.musicRequests(56789);
const planning = await djep.events.planning(56789);
```

### Clients

```javascript
const clients = await djep.clients.list({ per_page: 25 });
const client = await djep.clients.get(12345);

const newClient = await djep.clients.create({
  first_name: 'John',
  last_name: 'Smith',
  email: 'john@example.com',
});

await djep.clients.update(12345, { email: 'new@example.com' });
await djep.clients.delete(12345);
```

### Venues, Employees, Packages, Addons, Contacts

```javascript
// All follow the same pattern
const venues = await djep.venues.list();
const venue = await djep.venues.get(789);

const employees = await djep.employees.list();
const packages = await djep.packages.list();
const addons = await djep.addons.list();
const contacts = await djep.contacts.list();
```

### Contacts

```javascript
const contacts = await djep.contacts.list();
const contact = await djep.contacts.get(1016);

// Create a contact. At least one of first_name, last_name or company.
await djep.contacts.create({
  first_name: 'Ada',
  last_name: 'Lovelace',
  company: 'Analytical Engines',
  email_address: 'ada@example.com',
  business_phone: '555 0100',
});

// Update one. Only the fields you pass are written.
await djep.contacts.update(1016, { job_title: 'Head of Catering' });
```

Creating and editing contacts is for administrators, master admins and
salespeople. An employee with "Add Vendors To Events" can attach an existing
vendor to an event, but cannot create the record itself.

### Vendors

```javascript
const vendors = await djep.vendors.list();
const vendor = await djep.vendors.get(3456);

// Create a vendor. Same fields as a contact, marked as a vendor for you.
await djep.vendors.create({ company: 'Big Lights Co', business_phone: '555 0199' });

// Update one
await djep.vendors.update(3456, { notes: 'Preferred supplier' });

// Link a vendor to an event
await djep.vendors.linkToEvent(56789, 3456);
```

`vendors.update()` only reaches contacts already marked as vendors. A general
contact returns `404` here even though it exists, so use `contacts.update()`
for those.

### Payments

```javascript
// List all payments company-wide
const payments = await djep.payments.list({ per_page: 50 });

// Add a payment to an event
const result = await djep.payments.addToEvent(56789, 500, 'Credit Card', {
  processing_fee: 15,
  comments: 'Final payment',
});
console.log(`Balance due: ${result.data.balance_due}`);
```

### Music Requests

```javascript
// Get requests for an event
const songs = await djep.musicRequests.forEvent(56789);

// Add a music request
await djep.musicRequests.add(56789, 'Queen', 'Bohemian Rhapsody', 'MPL');
await djep.musicRequests.add(56789, 'ABBA', 'Dancing Queen', 'DED', 'For the bride');

// Update one. Only the fields you pass are written.
await djep.musicRequests.update(88, { type: 'DNP', comments: 'Bride asked us to drop this' });

// Remove one. This cannot be undone.
await djep.musicRequests.delete(88);
```

### Timelines

```javascript
// Replace the running order. Send every activity you want kept.
await djep.planning.updateTimeline(56789, [
  { time: '6:00 PM', name: 'Guests arrive' },
  { time: '7:00 PM', name: 'Speeches',    comments: 'Three, ten minutes each' },
  { time: '7:30 PM', name: 'First dance', comments: 'Dim the lights' },
], 'Reception running order');

// Second timeline
await djep.planning.updateTimeline(56789, activities, 'Ceremony', 2);

// Clear a timeline
await djep.planning.updateTimeline(56789, []);
```

Up to 52 activities are stored. This replaces the whole timeline rather than
appending, and clearing it removes the headline too.

### Check In And Check Out

```javascript
// Check yourself in, with the location
await djep.events.checkIn(56789, 0, { latitude: '50.7989', longitude: '-1.0912' });

// An administrator checking somebody else in
await djep.events.checkIn(56789, 19842);

await djep.events.checkOut(56789);
```

One way only, the same as the buttons in the web app. A second check in returns
`409`, and checking out before checking in returns `400`.

Read `notification_status` on the response rather than `notification_sent`: the
office email can be switched off, have no recipient, or be blocked by the
server, and the status says which.

### Event Confirmations

```javascript
// An employee confirming their own assignment (recorded as C)
await djep.events.confirmAssignment(56789);

// An administrator confirming for somebody (recorded as A)
await djep.events.confirmAssignment(56789, 19842);

// A reply collected earlier and sent on later
await djep.events.confirmAssignment(56789, 0, '2026-06-13 14:02');

// Declining, which only the employee themselves can do
const result = await djep.events.declineAssignment(56789, 'Double booked');
console.log(result.data.reassign_to_employee);  // standby employee, or null
```

An assignment can only be answered once; a second answer returns `409`. Where
the account nominates a standby employee a decline reports them, but nothing is
reassigned for you.

### Booking Helpers

```javascript
// List available helpers
const helpers = await djep.bookingHelpers.list();

// Run by unique_id (recommended)
const result = await djep.bookingHelpers.run(56789, 'book_event_1');
console.log(result.data.log);

// Or by position index
const result2 = await djep.bookingHelpers.run(56789, null, 0);
```

### Availability

```javascript
// Check a single date
const avail = await djep.availability.check('09/15/2026');
if (avail.data.available) {
  console.log(`${avail.data.employees.available} employees available`);
}

// Check a date range (max 90 days)
const range = await djep.availability.range('09/01/2026', '09/30/2026');
range.data.dates.forEach(date => {
  console.log(`${date.date}: ${date.available ? 'Available' : 'Unavailable'}`);
});
```

### Settings

```javascript
const rfiSettings = await djep.settings.websiteTools('request_info');
const company = await djep.settings.company();
const fields = await djep.settings.customFields();
```

### Expenses

```javascript
const expenses = await djep.expenses.list({ per_page: 25 });
const categories = await djep.expenses.categories();
const payees = await djep.expenses.payees();
const methods = await djep.expenses.paymentMethods();
```

### Other Resources

```javascript
const rfi = await djep.submissions.rfi();
const quotes = await djep.submissions.quotes();
const contactUs = await djep.submissions.contactUs();

const closedDates = await djep.closedDates.list();
const equipment = await djep.equipment.list();
const systems = await djep.systems.list();
```

### Create Submission (RFI)

Push leads from external sources into the DJ's submissions queue:

```javascript
// Wedding Wire lead
const submission = await djep.submissions.create({
  first_name: 'Sarah', last_name: 'Johnson',
  email: 'sarah@example.com', telephone: '555-0123',
  event_date: '2026-09-15', event_type: 'Wedding',
  guest_count: 200, source: 'Wedding Wire',
  send_notification: 'true',
});
console.log(`Submission ${submission.data.req_idnumber} created`);

// With custom questions and privacy consent
const submission2 = await djep.submissions.create({
  first_name: 'Emma', last_name: 'Wilson',
  email: 'emma@example.com',
  event_date: '2027-06-20', event_type: 'Wedding',
  question_1: 'Yes, we need lighting', q1_mapto: 'custom_field1',
  privacy_policy_signed: 'true', source: 'Custom Website',
  send_notification: 'true',
});
```

### Convenience Endpoints

Quick actions without the `fields` parameter:

```javascript
// Quick status change — returns old and new status
const result = await djep.events.updateStatus(56789, 'Booked');
console.log(`${result.data.old_status} → ${result.data.new_status}`);

// Assign employee to position (1-15), with optional fee and role
await djep.events.assignEmployee(56789, 1, 48113, { fee: 500, role: 'Lead DJ' });
await djep.events.assignEmployee(56789, 2, 48361, { fee: 350, role: 'MC' });

// Unassign position 3
await djep.events.assignEmployee(56789, 3, 0);

// Update notes — pass any combination of note fields
await djep.events.updateNotes(56789, {
  comments: 'AI Summary: Client wants 80s and 90s hits',
  next_action: 'Send playlist proposal',
  next_action_date: '08/15/2026',
});
```

## Auto-Pagination

For resources with pagination, use `all()` to automatically iterate through every page:

```javascript
// Fetches all events across all pages
for await (const event of djep.events.all({ status: 'Booked' })) {
  console.log(event.event_date);
}

// Works with any paginated resource
for await (const client of djep.clients.all()) {
  console.log(`${client.first_name} ${client.last_name}`);
}
```

## Error Handling

The SDK throws specific errors for different error types:

```javascript
const { DJEPError, AuthenticationError, NotFoundError, ValidationError, ForbiddenError, RateLimitError } = require('@djeventplannerhub/djep-sdk');

try {
  const event = await djep.events.get(99999);
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.log('Invalid API key');
  } else if (err instanceof NotFoundError) {
    console.log('Event not found');
  } else if (err instanceof ForbiddenError) {
    console.log('Insufficient permissions');
  } else if (err instanceof ValidationError) {
    console.log('Invalid parameters');
  } else if (err instanceof RateLimitError) {
    console.log('Too many requests');
  } else if (err instanceof DJEPError) {
    console.log(`API error: ${err.message}`);
  }
}
```

## Configuration Options

```javascript
const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN, {
  timeout: 60000, // Request timeout in milliseconds (default: 30000)
});
```

## Security

- **Never** commit API keys to version control
- Store keys in environment variables or `.env` files (excluded from Git)
- Use the most restrictive API key for your use case
- API keys provide full access to the associated account — treat them like passwords

## API Documentation

Full API documentation is available at your DJEP instance:

```
https://yourdomain.com/api/api.asp?action=docs
```

## License

MIT
