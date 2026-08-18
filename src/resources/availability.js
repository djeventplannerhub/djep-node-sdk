const Resource = require('./resource');

class Availability extends Resource {
  /**
   * Check availability for a single date (with employee detail)
   * @param {string} date - MM/DD/YYYY or YYYY-MM-DD
   */
  async check(date) {
    return this.http.get('check_availability', { date });
  }

  /**
   * Check availability for a date range (max 90 days)
   */
  async range(startDate, endDate) {
    return this.http.get('check_availability_range', { start_date: startDate, end_date: endDate });
  }
}

module.exports = Availability;
