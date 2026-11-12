const Resource = require('./resource');

class MusicRequests extends Resource {
  /**
   * Get music requests for a specific event
   */
  async forEvent(eventid) {
    return this.http.get('event_music_requests', { eventid });
  }

  /**
   * Add a music request to an event
   * @param {number} eventid
   * @param {string} artist
   * @param {string} song
   * @param {string} type - MPL, PIP, DED, DNP, OIR, GRQ, CR1-CR5
   * @param {string} comments - optional dedication or notes
   */
  async add(eventid, artist, song, type, comments = '') {
    const data = { eventid, artist, song, type };
    if (comments) data.comments = comments;
    return this.http.post('add_music_request', data);
  }

  /**
   * Update a music request. Only the fields you pass are written.
   * @param {number} requestId - the r_id from forEvent()
   * @param {Object} fields - any of song, artist, type, comments, location,
   *   status. An invalid type is refused before anything is written.
   */
  async update(requestId, fields) {
    const data = { ...fields, r_id: requestId, fields: Object.keys(fields).join(',') };
    return this.http.post('update_music_request', data);
  }

  /**
   * Remove a music request from its event. This cannot be undone.
   */
  async delete(requestId) {
    return this.http.post('delete_music_request', { r_id: requestId });
  }
}

module.exports = MusicRequests;
