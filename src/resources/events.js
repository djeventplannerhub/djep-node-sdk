const Resource = require('./resource');

class Events extends Resource {
  /**
   * List events (paginated)
   * @param {Object} params - page, per_page, sort_by, sort_dir, status, event_type, clientid, etc.
   */
  async list(params = {}) {
    return this.http.get('events', params);
  }

  /**
   * Auto-paginate through all events
   */
  all(params = {}) {
    return this._autoPaginate('events', params);
  }

  /**
   * Get a single event by ID
   */
  async get(eventid) {
    return this.http.get('event', { eventid });
  }

  /**
   * Create a new event
   * Financials are auto-calculated from the assigned package.
   * @param {Object} data - event_date required, plus clientid OR (first_name + last_name)
   */
  async create(data) {
    return this.http.post('create_event', data);
  }

  /**
   * Update an existing event (PATCH-style)
   * @param {number} eventid
   * @param {Object} fields - field:value pairs to update
   * @param {boolean} recalculate - recalculate financials
   */
  async update(eventid, fields, recalculate = false) {
    const data = { ...fields, eventid, fields: Object.keys(fields).join(',') };
    if (recalculate) data.recalculate = 'true';
    return this.http.post('update_event', data);
  }

  /**
   * Delete an event and all associated records (cascading)
   */
  async delete(eventid) {
    return this.http.post('delete_event', { eventid });
  }

  /** Get payments for a specific event */
  async payments(eventid) {
    return this.http.get('event_payments', { eventid });
  }

  /** Get music requests for a specific event */
  async musicRequests(eventid) {
    return this.http.get('event_music_requests', { eventid });
  }

  /**
   * Get planning form data for a specific event
   * Returns the primary and additional planning forms with their question/answer data.
   * For to-do items, use tasks() instead.
   */
  async planning(eventid) {
    return this.http.get('event_planning', { eventid });
  }

  /**
   * Quick status update
   * @param {number} eventid
   * @param {string} status - new status value
   * @returns {Object} Response with old_status and new_status
   */
  async updateStatus(eventid, status) {
    return this.http.post('update_status', { eventid, status });
  }

  /**
   * Assign or unassign an employee to an event position
   * @param {number} eventid
   * @param {number} position - 1-15
   * @param {number} employeeid - employee ID, or 0 to unassign
   * @param {Object} options - optional fee, role
   */
  async assignEmployee(eventid, position, employeeid, options = {}) {
    return this.http.post('assign_employee', { ...options, eventid, position, djemployeeid: employeeid });
  }

  /**
   * Update one or more note fields on an event
   * @param {number} eventid
   * @param {Object} notes - any of: comments, service_description, post_event_notes, next_action, next_action_date
   */
  async updateNotes(eventid, notes) {
    return this.http.post('update_notes', { ...notes, eventid });
  }

  /**
   * Get task / to-do items for a specific event
   * @param {number} eventid
   * @param {Object} params - completed, sort_by, sort_dir
   */
  async tasks(eventid, params = {}) {
    return this.http.get('event_tasks', { ...params, eventid });
  }

  /**
   * Set which systems are assigned to an event.
   * REPLACES the whole list; send every system you want on the event.
   * Maximum of 10. Pass an empty array to clear.
   */
  async assignSystems(eventid, systemids) {
    return this.http.post('assign_event_systems', { eventid, systems: systemids.join(',') });
  }

  /**
   * Set which standalone equipment is assigned to an event.
   * Accepts either [318, 412] or { 318: 2, 412: 1 } for quantities.
   * REPLACES the whole list. Pass an empty array to clear.
   */
  async assignEquipment(eventid, equipment) {
    const parts = Array.isArray(equipment)
      ? equipment.map(String)
      : Object.entries(equipment).map(([id, qty]) => `${id}=${qty}`);
    return this.http.post('assign_event_equipment', { eventid, equipment: parts.join(',') });
  }

  /**
   * Check an employee in to an event.
   * @param {number} eventid
   * @param {number} employeeid - leave at 0 for the key's own employee. A
   *   master admin key has no employee of its own, so it has to name one.
   *   Checking anybody else in needs administrator, master admin or
   *   salesperson access.
   * @param {Object} options - latitude and longitude, stored as the location
   *   the check in happened at.
   *
   * One way only, the same as the buttons in the web app: check in once, then
   * check out once. A second check in returns 409.
   *
   * The response carries notification_status rather than just a flag, because
   * the office email can be switched off, have no recipient, or be blocked by
   * the server. Read that, not notification_sent, if you need to know what
   * actually happened.
   */
  async checkIn(eventid, employeeid = 0, options = {}) {
    return this.http.post('check_in', this._checkInPayload(eventid, employeeid, options));
  }

  /**
   * Check an employee out of an event. Same arguments as checkIn().
   * Checking out before checking in returns 400, and checking out twice
   * returns 409.
   */
  async checkOut(eventid, employeeid = 0, options = {}) {
    return this.http.post('check_out', this._checkInPayload(eventid, employeeid, options));
  }

  _checkInPayload(eventid, employeeid, options) {
    const data = { ...options, eventid };
    if (employeeid > 0) data.djemployeeid = employeeid;
    return data;
  }

  /**
   * Confirm an employee's assignment to an event.
   * @param {number} eventid
   * @param {number} employeeid - leave at 0 for the key's own employee
   * @param {string} respondedAt - when the answer was actually given, e.g.
   *   '2026-06-13 14:02'. Only honoured when the employee is answering for
   *   themselves, which is the point of a confirmation link collected now and
   *   sent on later. Cannot be in the future.
   *
   * An employee answering for themselves is recorded as C. An administrator,
   * master admin or salesperson confirming for someone else is recorded as A,
   * which is what the web app stores. Check recorded_as on the response to see
   * which it was.
   *
   * An assignment can only be answered once; a second answer returns 409.
   */
  async confirmAssignment(eventid, employeeid = 0, respondedAt = '') {
    return this.http.post('confirm_assignment',
      this._assignmentPayload(eventid, employeeid, 'confirmed', '', respondedAt));
  }

  /**
   * Decline an employee's assignment to an event.
   * @param {string} reason - stored against the event. Some accounts require
   *   one, and the API returns 400 if it is missing.
   *
   * Only the employee the assignment belongs to can decline it. DJEP has no
   * way for an administrator to decline on somebody's behalf, so naming
   * another employee here returns 400 rather than quietly recording it.
   *
   * Where the account nominates a standby employee, the response reports them
   * as reassign_to_employee. Nothing is reassigned for you, so an integration
   * never hands out work as a side effect of recording an answer.
   */
  async declineAssignment(eventid, reason = '', employeeid = 0, respondedAt = '') {
    return this.http.post('confirm_assignment',
      this._assignmentPayload(eventid, employeeid, 'declined', reason, respondedAt));
  }

  _assignmentPayload(eventid, employeeid, status, reason, respondedAt) {
    const data = { eventid, status };
    if (employeeid > 0) data.djemployeeid = employeeid;
    if (reason) data.reason = reason;
    if (respondedAt) data.responded_at = respondedAt;
    return data;
  }
}

module.exports = Events;
