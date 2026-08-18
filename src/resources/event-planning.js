const Resource = require('./resource');

class EventPlanning extends Resource {
  /**
   * Get planning form data for a specific event.
   * Note: this endpoint previously returned to-do items. Those now live on
   * event_tasks - use djep.events.tasks(eventid).
   */
  async forEvent(eventid) { return this.http.get('event_planning', { eventid }); }
}

module.exports = EventPlanning;
