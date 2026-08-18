const Resource = require('./resource');

class Packages extends Resource {
  async list(params = {}) { return this.http.get('packages', params); }
  all(params = {}) { return this._autoPaginate('packages', params); }
  async get(pkg_idnumber) { return this.http.get('package', { pkg_idnumber }); }
}

module.exports = Packages;
