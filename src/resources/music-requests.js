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
}

module.exports = MusicRequests;
