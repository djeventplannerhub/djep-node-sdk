const Resource = require('./resource');

class Contacts extends Resource {
  async list(params = {}) { return this.http.get('contacts', params); }
  all(params = {}) { return this._autoPaginate('contacts', params); }
  async get(contactid) { return this.http.get('contact', { contactid }); }

  /**
   * Create a contact.
   * @param {Object} data - At least one of first_name, last_name or company is
   *   required. Also accepts middle_name, job_title, email_address, spouse,
   *   web_page, notes, profile_image_url, business_phone, home_phone,
   *   mobile_phone, pager, business_fax, home_fax, the business_ and home_
   *   address fields, and is_vendor.
   *
   * Administrators, master admins and salespeople only. An employee with
   * "Add Vendors To Events" can attach an existing vendor to an event with
   * djep.vendors.linkToEvent(), but cannot create the record itself.
   */
  async create(data) {
    return this.http.post('create_contact', data);
  }

  /**
   * Update a contact. Only the fields you pass are written.
   *
   * The name is re-checked after the edit, so clearing every one of
   * first_name, last_name and company in a single call is refused.
   */
  async update(contactid, fields) {
    const data = { ...fields, contactid, fields: Object.keys(fields).join(',') };
    return this.http.post('update_contact', data);
  }
}

module.exports = Contacts;
