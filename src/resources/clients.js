const Resource = require('./resource');

class Clients extends Resource {
  async list(params = {}) {
    return this.http.get('clients', params);
  }

  all(params = {}) {
    return this._autoPaginate('clients', params);
  }

  async get(clientid) {
    return this.http.get('client', { clientid });
  }

  /**
   * @param {Object} data - Required: first_name, last_name
   */
  async create(data) {
    return this.http.post('create_client', data);
  }

  /**
   * @param {number} clientid
   * @param {Object} fields - field:value pairs to update
   */
  async update(clientid, fields) {
    const data = { ...fields, clientid, fields: Object.keys(fields).join(',') };
    return this.http.post('update_client', data);
  }

  async delete(clientid) {
    return this.http.post('delete_client', { clientid });
  }
}

module.exports = Clients;
