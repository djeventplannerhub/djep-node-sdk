const https = require('https');
const http = require('http');
const { URL } = require('url');

class DJEPError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'DJEPError';
    this.code = code;
  }
}

class AuthenticationError extends DJEPError {
  constructor(message, code) { super(message, code); this.name = 'AuthenticationError'; }
}
class NotFoundError extends DJEPError {
  constructor(message, code) { super(message, code); this.name = 'NotFoundError'; }
}
class ValidationError extends DJEPError {
  constructor(message, code) { super(message, code); this.name = 'ValidationError'; }
}
class ForbiddenError extends DJEPError {
  constructor(message, code) { super(message, code); this.name = 'ForbiddenError'; }
}
class RateLimitError extends DJEPError {
  constructor(message, code) { super(message, code); this.name = 'RateLimitError'; }
}

class HttpClient {
  constructor(apiKey, domain, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || `https://${domain}/api/api.asp`;
    this.timeout = options.timeout || 30000;
  }

  /**
   * Make a GET request
   */
  async get(action, params = {}) {
    params.action = action;
    const query = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}?${query}`;
    return this._request('GET', url);
  }

  /**
   * Make a POST request
   */
  async post(action, data = {}) {
    const url = `${this.baseUrl}?action=${encodeURIComponent(action)}`;
    const body = new URLSearchParams(data).toString();
    return this._request('POST', url, body);
  }

  /**
   * Execute the HTTP request
   */
  _request(method, url, body = null) {
    return new Promise((resolve, reject) => {
      const parsed = new URL(url);
      const transport = parsed.protocol === 'https:' ? https : http;

      const options = {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method,
        timeout: this.timeout,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
        },
      };

      if (method === 'POST' && body) {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.headers['Content-Length'] = Buffer.byteLength(body);
      }

      const req = transport.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          let response;
          try {
            response = JSON.parse(data);
          } catch (e) {
            reject(new DJEPError(`Invalid JSON response (HTTP ${res.statusCode}): ${data.substring(0, 200)}`, res.statusCode));
            return;
          }

          if (res.statusCode >= 400 || (response.success === false)) {
            const message = (response.error && response.error.message) || response.message || 'Unknown API error';
            const code = (response.error && response.error.code) || res.statusCode;

            switch (res.statusCode) {
              case 401: reject(new AuthenticationError(message, code)); break;
              case 403: reject(new ForbiddenError(message, code)); break;
              case 404: reject(new NotFoundError(message, code)); break;
              case 429: reject(new RateLimitError(message, code)); break;
              case 400: reject(new ValidationError(message, code)); break;
              default: reject(new DJEPError(message, code));
            }
            return;
          }

          resolve(response);
        });
      });

      req.on('error', (err) => {
        reject(new DJEPError(`Network error: ${err.message}`, 0));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new DJEPError('Request timed out', 0));
      });

      if (body) req.write(body);
      req.end();
    });
  }
}

module.exports = {
  HttpClient,
  DJEPError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
  RateLimitError,
};
