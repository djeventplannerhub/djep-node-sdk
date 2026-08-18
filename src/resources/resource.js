class Resource {
  constructor(http) {
    this.http = http;
  }

  /**
   * Auto-paginate through all records
   * Returns an async generator that yields each record
   */
  async *_autoPaginate(action, params = {}) {
    params.per_page = params.per_page || 100;
    params.page = 1;

    while (true) {
      const response = await this.http.get(action, { ...params });
      const data = response.data || [];

      for (const record of data) {
        yield record;
      }

      const pagination = response.pagination;
      if (!pagination || params.page >= pagination.total_pages) break;
      params.page++;
    }
  }
}

module.exports = Resource;
