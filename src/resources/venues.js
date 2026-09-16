const Resource = require('./resource');

class Venues extends Resource {
  async list(params = {}) { return this.http.get('venues', params); }
  all(params = {}) { return this._autoPaginate('venues', params); }
  async get(venueid) { return this.http.get('venue', { venueid }); }

  /**
   * Create a venue.
   * Required: name. Optional: address, address2, city, state, zipcode, country,
   * telephone, cell_phone, email, manager, category, website, directions,
   * one_time_venue.
   *
   * Set one_time_venue true for a site you do not want in the master picklist.
   * It is still a real venue record, because an event points at a venue rather
   * than storing an address.
   */
  async create(data) {
    return this.http.post('create_venue', data);
  }

  /** Update a venue. Only the fields you pass are written. */
  async update(venueid, fields) {
    return this.http.post('update_venue', { ...fields, venueid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Venues;
