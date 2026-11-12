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

  /**
   * Replace one of an event's two timelines.
   * @param {number} eventid
   * @param {Array} activities - rows in running order, each with any of time,
   *   name and comments. Up to 52 are stored; anything past that is dropped.
   *   Pass an empty array to clear the timeline.
   * @param {string} headline - text shown above the activities
   * @param {number} slot - 1 for the timeline, 2 for the second timeline
   *
   * REPLACES the whole timeline, so send every activity you want kept.
   * Clearing it removes the headline too, because a timeline with a headline
   * and no activities reads back as one blank activity.
   *
   *   await djep.planning.updateTimeline(252318, [
   *     { time: '6:00 PM', name: 'Guests arrive' },
   *     { time: '7:30 PM', name: 'First dance', comments: 'Dim the lights' },
   *   ], 'Reception running order');
   */
  async updateTimeline(eventid, activities, headline = '', slot = 1) {
    const data = { eventid, slot, headline };
    activities.slice(0, 52).forEach((activity, i) => {
      const n = i + 1;
      data[`activity_${n}_time`] = activity.time || '';
      data[`activity_${n}_name`] = activity.name || '';
      data[`activity_${n}_comments`] = activity.comments || '';
    });
    return this.http.post('update_timeline', data);
  }
}

module.exports = EventPlanning;
