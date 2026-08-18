const Resource = require('./resource');

class Contacts extends Resource {
  async list(params = {}) { return this.http.get('contacts', params); }
  all(params = {}) { return this._autoPaginate('contacts', params); }
  async get(contactid) { return this.http.get('contact', { contactid }); }
}

module.exports = Contacts;
