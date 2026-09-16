const { HttpClient, DJEPError, AuthenticationError, NotFoundError, ValidationError, ForbiddenError, RateLimitError, ConflictError } = require('./http-client');
const Events = require('./resources/events');
const Clients = require('./resources/clients');
const Venues = require('./resources/venues');
const Employees = require('./resources/employees');
const Packages = require('./resources/packages');
const Addons = require('./resources/addons');
const Contacts = require('./resources/contacts');
const Vendors = require('./resources/vendors');
const Payments = require('./resources/payments');
const Expenses = require('./resources/expenses');
const MusicRequests = require('./resources/music-requests');
const BookingHelpers = require('./resources/booking-helpers');
const Availability = require('./resources/availability');
const Settings = require('./resources/settings');
const Submissions = require('./resources/submissions');
const ClosedDates = require('./resources/closed-dates');
const Equipment = require('./resources/equipment');
const Systems = require('./resources/systems');
const EventPlanning = require('./resources/event-planning');
const Planner = require('./resources/planner');
const HourlyTracker = require('./resources/hourly-tracker');

class DJEP {
  static VERSION = '1.3.0';

  /**
   * Create a new DJEP API client
   *
   * @param {string} apiKey  Your full API key
   * @param {string} domain  Your DJEP domain (e.g. "djep21.com")
   * @param {Object} options Optional: timeout (ms), baseUrl
   */
  constructor(apiKey, domain, options = {}) {
    const http = new HttpClient(apiKey, domain, options);

    this.events = new Events(http);
    this.clients = new Clients(http);
    this.venues = new Venues(http);
    this.employees = new Employees(http);
    this.packages = new Packages(http);
    this.addons = new Addons(http);
    this.contacts = new Contacts(http);
    this.vendors = new Vendors(http);
    this.payments = new Payments(http);
    this.expenses = new Expenses(http);
    this.musicRequests = new MusicRequests(http);
    this.bookingHelpers = new BookingHelpers(http);
    this.availability = new Availability(http);
    this.settings = new Settings(http);
    this.submissions = new Submissions(http);
    this.closedDates = new ClosedDates(http);
    this.equipment = new Equipment(http);
    this.systems = new Systems(http);
    this.planning = new EventPlanning(http);
    this.planner = new Planner(http);
    this.hourlyTracker = new HourlyTracker(http);

    this._http = http;
  }

  /**
   * Check API status and get available endpoints
   */
  async status() {
    return this._http.get('status');
  }
}

module.exports = DJEP;
module.exports.DJEP = DJEP;
module.exports.DJEPError = DJEPError;
module.exports.AuthenticationError = AuthenticationError;
module.exports.NotFoundError = NotFoundError;
module.exports.ValidationError = ValidationError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.RateLimitError = RateLimitError;
module.exports.ConflictError = ConflictError;
