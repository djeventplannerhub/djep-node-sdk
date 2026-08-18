const Resource = require('./resource');

class Planner extends Resource {
  /**
   * List planner items (paginated)
   * Covers appointments, contacts, and to-do items, attached to an event or standalone.
   * @param {Object} params - page, per_page, sort_by, sort_dir, date_from, date_to,
   *                          djemployeeid, type (A/C/T), eventid (0 = standalone only), completed
   */
  async list(params = {}) {
    return this.http.get('planner_items', params);
  }

  /**
   * Auto-paginate through all planner items
   */
  all(params = {}) {
    return this._autoPaginate('planner_items', params);
  }

  /**
   * Get a single planner item by ID
   */
  async get(plannerId) {
    return this.http.get('planner_items', { planner_id: plannerId });
  }

  /**
   * Create a planner item
   *
   * Required: type (A = Appointment, C = Contact, T = Task/To-Do), title
   * Conditional: start_time (required for types A and C, ignored for T)
   * Optional: date (defaults to today; the due date when type is T), length, details,
   *           eventid, clientid, venueid, contactid, employee_djemployeeid, djemployeeid,
   *           additional_employees, meetinglocationid, client_visible,
   *           calendar_background, calendar_text
   *
   * A type C item must be linked to at least one of clientid, employee_djemployeeid,
   * venueid, or contactid, or the API returns a 400.
   *
   * djemployeeid is the employee the item is ASSIGNED TO.
   * employee_djemployeeid is the employee the item is ABOUT.
   *
   * @param {Object} data
   */
  async create(data) {
    return this.http.post('create_planner_item', data);
  }

  /**
   * Update a planner item (PATCH-style)
   * @param {number} plannerId
   * @param {Object} fields - field/value pairs to update
   */
  async update(plannerId, fields) {
    const data = { ...fields, planner_id: plannerId, fields: Object.keys(fields).join(',') };
    return this.http.post('update_planner_item', data);
  }

  /**
   * Mark a planner item complete or incomplete
   */
  async complete(plannerId, completed = true) {
    return this.update(plannerId, { completed: completed ? 'true' : 'false' });
  }
}

module.exports = Planner;
