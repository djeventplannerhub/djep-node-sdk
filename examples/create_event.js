/**
 * DJEP Node.js SDK — Create Event with New Client
 *
 * Run: DJEP_API_KEY=your_key DJEP_DOMAIN=yourdomain.com node create_event.js
 */

const DJEP = require('../src/index');

async function main() {
  const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN);

  try {
    // Create an event with a new client in one call
    const event = await djep.events.create({
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah@example.com',
      cell_phone: '555-0123',
      event_date: '2026-11-15',
      event_type: 'Wedding',
      event_name: 'Johnson-Williams Wedding',
      start_time: '4:00 PM',
      end_time: '11:00 PM',
      guest_count: 200,
      status: 'Tentative',
    });

    console.log('Event created!');
    console.log(`  Event ID: ${event.data.eventid}`);
    console.log(`  Client ID: ${event.data.clientid}`);
    console.log(`  Package Price: $${event.data.financials.package_price}`);
    console.log(`  Tax: $${event.data.financials.tax}`);
    console.log(`  Total Fee: $${event.data.financials.total_fee}`);

    // Add a payment
    const payment = await djep.payments.addToEvent(
      event.data.eventid, 500, 'Credit Card',
      { comments: 'Deposit payment' }
    );
    console.log(`\nPayment added! Balance due: $${payment.data.balance_due}`);

    // Add music requests
    await djep.musicRequests.add(event.data.eventid, 'Ed Sheeran', 'Perfect', 'MPL');
    await djep.musicRequests.add(event.data.eventid, 'Journey', "Don't Stop Believin'", 'MPL');
    console.log('Music requests added!');

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

main();
