const Resource = require('./resource');

class Vendors extends Resource {
  async list(params = {}) { return this.http.get('vendors', params); }
  all(params = {}) { return this._autoPaginate('vendors', params); }
  async get(contactid) { return this.http.get('vendor', { contactid }); }

  /**
   * Link a vendor to an event
   */
  async linkToEvent(eventid, contactid) {
    return this.http.post('link_vendor', { eventid, contactid });
  }
}

module.exports = Vendors;
