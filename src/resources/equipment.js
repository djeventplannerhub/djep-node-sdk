const Resource = require('./resource');

class Equipment extends Resource {
  async list(params = {}) { return this.http.get('equipment', params); }
  all(params = {}) { return this._autoPaginate('equipment', params); }
}

module.exports = Equipment;
