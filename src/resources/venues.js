const Resource = require('./resource');

class Venues extends Resource {
  async list(params = {}) { return this.http.get('venues', params); }
  all(params = {}) { return this._autoPaginate('venues', params); }
  async get(venueid) { return this.http.get('venue', { venueid }); }
}

module.exports = Venues;
