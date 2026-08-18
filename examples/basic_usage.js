/**
 * DJEP Node.js SDK — Basic Usage Example
 *
 * Run: DJEP_API_KEY=your_key DJEP_DOMAIN=yourdomain.com node basic_usage.js
 */

const DJEP = require('../src/index');

async function main() {
  const djep = new DJEP(process.env.DJEP_API_KEY, process.env.DJEP_DOMAIN);

  try {
    // Check API status
    const status = await djep.status();
    console.log(`API Version: ${status.data.api_version}`);
    console.log(`Endpoints: ${status.data.endpoints.length}\n`);

    // List first 5 events
    const events = await djep.events.list({ per_page: 5, sort_by: 'event_date', sort_dir: 'DESC' });
    console.log(`Total events: ${events.pagination.total_records}`);
    events.data.forEach(e => {
      console.log(`  [${e.status}] ${e.event_type} on ${e.event_date}`);
    });

    // List clients
    console.log('\nClients:');
    const clients = await djep.clients.list({ per_page: 5 });
    clients.data.forEach(c => {
      console.log(`  ${c.first_name} ${c.last_name} (${c.email})`);
    });

    // Check availability
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = `${futureDate.getMonth() + 1}/${futureDate.getDate()}/${futureDate.getFullYear()}`;

    console.log(`\nAvailability for ${dateStr}:`);
    const avail = await djep.availability.check(dateStr);
    console.log(`  Available: ${avail.data.available}`);

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

main();
