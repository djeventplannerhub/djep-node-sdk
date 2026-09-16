const Resource = require('./resource');

class Employees extends Resource {
  async list(params = {}) { return this.http.get('employees', params); }
  all(params = {}) { return this._autoPaginate('employees', params); }
  async get(djemployeeid) { return this.http.get('employee', { djemployeeid }); }

  /**
   * Update an employee.
   *
   * Writable: active, disabled, email, cell_phone, telephone, work_telephone,
   * fax_phone, first_name, last_name, middle_name, stage_name,
   * employment_category through employment_category5, address, address2, city,
   * state, zipcode, country, emergency_contact, employee_display_order, notes,
   * start_date, birthday.
   *
   * Permission flags, passwords, usernames, wage settings and mail credentials
   * are deliberately NOT writable at any permission level. Naming one returns a
   * 400 and nothing is written, including the allowed fields.
   *
   * There is no create method. Employees are created in DJEP.
   */
  async update(djemployeeid, fields) {
    return this.http.post('update_employee', { ...fields, djemployeeid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Employees;
