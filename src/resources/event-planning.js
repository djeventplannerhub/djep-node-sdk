const Resource = require('./resource');

class EventPlanning extends Resource {
  /**
   * Get planning form data for a specific event.
   * Note: this endpoint previously returned to-do items. Those now live on
   * event_tasks - use djep.events.tasks(eventid).
   */
  async forEvent(eventid) { return this.http.get('event_planning', { eventid }); }

  /**
   * Write answers back to a planning form.
   *
   * @param {number} eventid
   * @param {Object} answers - question_id: answer. For grids use the cell name
   *                 as the key, e.g. GUESTTABLE_ROW_2_COLUMN_1.
   * @param {number} formid - Only for additional forms. Omit for the primary.
   *
   * Only the questions you pass are touched. Everything is validated before
   * anything is written, so one bad value means nothing changes.
   */
  async updateAnswers(eventid, answers, formid = 0) {
    // Grid cells are sent as ID_ROW_n_COLUMN_n but 'fields' takes the question
    // id, so collapse those back to the question they belong to.
    const questionIds = [...new Set(
      Object.keys(answers).map((k) => k.replace(/_ROW_\d+_COLUMN_\d+$/, ''))
    )];
    const data = { ...answers, eventid, fields: questionIds.join(',') };
    if (formid > 0) data.formid = formid;
    return this.http.post('update_event_planning', data);
  }
}

module.exports = EventPlanning;
