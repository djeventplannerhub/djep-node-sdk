const Resource = require('./resource');

class HourlyTracker extends Resource {
  /**
   * List hourly time tracking entries (paginated)
   * @param {Object} params - page, per_page, sort_by, sort_dir, date_from, date_to,
   *                          djemployeeid, approved, paid
   */
  async list(params = {}) {
    return this.http.get('hourly_tracker', params);
  }

  /**
   * Auto-paginate through all hourly tracker entries
   */
  all(params = {}) {
    return this._autoPaginate('hourly_tracker', params);
  }
}

module.exports = HourlyTracker;
