const Resource = require('./resource');

class Submissions extends Resource {
  async rfi(params = {}) { return this.http.get('rfi_submissions', params); }
  async quotes(params = {}) { return this.http.get('quote_submissions', params); }
  async contactUs(params = {}) { return this.http.get('contactus_submissions', params); }

  /**
   * Create a new RFI submission (push a lead into the submissions queue)
   * @param {Object} data - Required: first_name, last_name, email, event_date
   */
  async create(data) {
    return this.http.post('create_submission', data);
  }

  /**
   * Convert an RFI submission into a client and event
   * @param {number} reqIdNumber
   * @param {Object} options - clientid, status, event_type, event_date, start_time,
   *                           end_time, inquiry_source
   */
  async convert(reqIdNumber, options = {}) {
    return this.http.post('convert_submission', { ...options, req_idnumber: reqIdNumber });
  }
}

module.exports = Submissions;
