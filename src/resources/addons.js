const Resource = require('./resource');

class Addons extends Resource {
  async list(params = {}) { return this.http.get('addons', params); }
  all(params = {}) { return this._autoPaginate('addons', params); }
  async get(addonid) { return this.http.get('addon', { addonid }); }
}

module.exports = Addons;
