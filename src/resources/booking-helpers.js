const Resource = require('./resource');

class BookingHelpers extends Resource {
  async list() {
    return this.http.get('booking_helpers');
  }

  /**
   * Run a booking helper on an event
   * @param {number} eventid
   * @param {string|null} uniqueId - the helper's unique_id (recommended)
   * @param {number|null} bhid - the helper's 0-based position index (alternative)
   */
  async run(eventid, uniqueId = null, bhid = null) {
    const data = { eventid };
    if (uniqueId !== null) data.unique_id = uniqueId;
    else if (bhid !== null) data.bhid = bhid;
    return this.http.post('run_booking_helper', data);
  }
}

module.exports = BookingHelpers;
