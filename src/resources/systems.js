const Resource = require('./resource');

class Systems extends Resource {
  async list(params = {}) { return this.http.get('systems', params); }
  all(params = {}) { return this._autoPaginate('systems', params); }
}

module.exports = Systems;
