const Resource = require('./resource');

class Payments extends Resource {
  async list(params = {}) { return this.http.get('payments', params); }
  all(params = {}) { return this._autoPaginate('payments', params); }

  /**
   * Add a payment to an event
   * @param {number} eventid
   * @param {number} amount
   * @param {string} method - e.g. "Cash", "Check", "Credit Card"
   * @param {Object} options - date, processing_fee, comments, notes, etc.
   */
  async addToEvent(eventid, amount, method, options = {}) {
    return this.http.post('add_payment', { ...options, eventid, amount, method });
  }
}

module.exports = Payments;
