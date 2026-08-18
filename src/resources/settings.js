const Resource = require('./resource');

class Settings extends Resource {
  async websiteTools(tool) { return this.http.get('settings', { type: 'websitetools', tool }); }
  async company() { return this.http.get('settings', { type: 'company' }); }
  async customFields() { return this.http.get('settings', { type: 'custom_fields' }); }
}

module.exports = Settings;
