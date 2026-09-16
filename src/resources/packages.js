const Resource = require('./resource');

class Packages extends Resource {
  async list(params = {}) { return this.http.get('packages', params); }
  all(params = {}) { return this._autoPaginate('packages', params); }
  async get(pkg_idnumber) { return this.http.get('package', { pkg_idnumber }); }

  /**
   * Create a package.
   * Required: name. Optional: client_facing_name, category, description, notes,
   * price, taxable, active, display_order, hourly, hourly_rate,
   * half_hourly_rate, default_length, deposit, deposit_percent, overtime_rate,
   * auto_assign_addons, and the photo gallery fields.
   *
   * Package names are not required to be unique, matching the software.
   */
  async create(data) {
    return this.http.post('create_package', data);
  }

  /** Update a package. Only the fields you pass are written. */
  async update(packageid, fields) {
    return this.http.post('update_package', { ...fields, packageid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Packages;
