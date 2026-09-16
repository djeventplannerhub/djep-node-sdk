const Resource = require('./resource');

class Addons extends Resource {
  async list(params = {}) { return this.http.get('addons', params); }
  all(params = {}) { return this._autoPaginate('addons', params); }
  async get(addonid) { return this.http.get('addon', { addonid }); }

  /**
   * Create an addon.
   * Required: name. Optional: category, description, notes, price, taxable,
   * active, display_order, image_1_url through image_6_url with matching
   * _title and _description, default_icon.
   *
   * Throws ConflictError when an addon with that name already exists. Read
   * err.existingId for its id.
   */
  async create(data) {
    return this.http.post('create_addon', data);
  }

  /** Update an addon. Only the fields you pass are written. */
  async update(addonid, fields) {
    return this.http.post('update_addon', { ...fields, addonid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Addons;
