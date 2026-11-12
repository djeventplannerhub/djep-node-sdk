const Resource = require('./resource');

class Addons extends Resource {
  async list(params = {}) { return this.http.get('addons', params); }
  all(params = {}) { return this._autoPaginate('addons', params); }
  async get(addonid) { return this.http.get('addon', { addonid }); }

  /**
   * Create an addon.
   * Required: name. Optional: category, description, notes, price, deposit,
   * taxable, active, display_order, image_1_url through image_6_url with
   * matching _title and _description, default_icon.
   *
   * deposit is a flat amount added to the retainer of any event this addon
   * goes on, unless that event's package takes a percentage deposit. It
   * cannot be negative.
   *
   * Throws ConflictError when an addon with that name already exists. Read
   * err.existingId for its id.
   */
  async create(data) {
    return this.http.post('create_addon', data);
  }

  /**
   * Update an addon. Only the fields you pass are written.
   *
   * deposit behaves like price: named with no value keeps the stored figure,
   * and 0 clears it.
   */
  async update(addonid, fields) {
    return this.http.post('update_addon', { ...fields, addonid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Addons;
