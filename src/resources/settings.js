const Resource = require('./resource');

class Settings extends Resource {
  async websiteTools(tool) { return this.http.get('settings', { type: 'websitetools', tool }); }
  async company() { return this.http.get('settings', { type: 'company' }); }
  async customFields() { return this.http.get('settings', { type: 'custom_fields' }); }

  /**
   * Get the account's picklists: event types, event statuses, booked statuses,
   * inquiry sources, client types, payment methods, employee roles and music
   * request types, plus currency symbol, tax rate and date format.
   *
   * Read this rather than hardcoding values. Statuses are validated on write
   * and differ from account to account.
   */
  async lists() {
    return this.http.get('settings', { type: 'lists' });
  }
}

module.exports = Settings;
