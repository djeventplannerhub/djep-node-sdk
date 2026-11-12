const Resource = require('./resource');

class Vendors extends Resource {
  async list(params = {}) { return this.http.get('vendors', params); }
  all(params = {}) { return this._autoPaginate('vendors', params); }
  async get(contactid) { return this.http.get('vendor', { contactid }); }

  /**
   * Create a vendor. Same fields as contacts.create(), and the record is
   * marked as a vendor for you.
   *
   * Administrators, master admins and salespeople only.
   */
  async create(data) {
    return this.http.post('create_vendor', data);
  }

  /**
   * Update a vendor. Only the fields you pass are written.
   *
   * This endpoint only reaches contacts already marked as vendors. A general
   * contact returns 404 here even though it exists, so use
   * djep.contacts.update() for those.
   */
  async update(contactid, fields) {
    const data = { ...fields, contactid, fields: Object.keys(fields).join(',') };
    return this.http.post('update_vendor', data);
  }

  /**
   * Link a vendor to an event
   */
  async linkToEvent(eventid, contactid) {
    return this.http.post('link_vendor', { eventid, contactid });
  }
}

module.exports = Vendors;
