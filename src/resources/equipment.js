const Resource = require('./resource');

class Equipment extends Resource {
  async list(params = {}) { return this.http.get('equipment', params); }
  all(params = {}) { return this._autoPaginate('equipment', params); }

  /**
   * Create an inventory item.
   * Required: name. Optional: assign_to (the systemid it belongs to, or 0 for
   * standalone), manufacturer, model_number, serial_number, category, location,
   * quantity_available, purchase_price, current_value, rental_fee, addon_fee,
   * date_of_purchase, purchased_from, warranty_length, insured, active,
   * description, notes.
   */
  async create(data) {
    return this.http.post('create_equipment', data);
  }

  /** Update an inventory item. Only the fields you pass are written. */
  async update(equipmentid, fields) {
    return this.http.post('update_equipment', { ...fields, equipmentid, fields: Object.keys(fields).join(',') });
  }
}

module.exports = Equipment;
