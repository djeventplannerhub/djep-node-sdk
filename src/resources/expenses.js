const Resource = require('./resource');

class Expenses extends Resource {
  async list(params = {}) { return this.http.get('expenses', params); }
  all(params = {}) { return this._autoPaginate('expenses', params); }
  async categories() { return this.http.get('expense_categories'); }
  async payees() { return this.http.get('expense_payees'); }
  async paymentMethods() { return this.http.get('expense_payment_methods'); }
}

module.exports = Expenses;
