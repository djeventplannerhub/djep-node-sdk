const Resource = require('./resource');

class ClosedDates extends Resource {
  async list(params = {}) { return this.http.get('closed_dates', params); }
}

module.exports = ClosedDates;
