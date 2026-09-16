const Resource = require('./resource');

class Systems extends Resource {
  async list(params = {}) { return this.http.get('systems', params); }
  all(params = {}) { return this._autoPaginate('systems', params); }

  /**
   * Create a system, a named group of equipment such as a DJ rack.
   * Required: name. Optional: category, location, active,
   * allow_check_availability, description, notes.
   */
  async create(data) {
    return this.http.post('create_system', data);
  }

  /** Update a system. Only the fields you pass are written. */
  async update(systemid, fields) {
    return this.http.post('update_system', { ...fields, systemid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Systems;
