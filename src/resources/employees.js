const Resource = require('./resource');

class Employees extends Resource {
  async list(params = {}) { return this.http.get('employees', params); }
  all(params = {}) { return this._autoPaginate('employees', params); }
  async get(djemployeeid) { return this.http.get('employee', { djemployeeid }); }
}

module.exports = Employees;
