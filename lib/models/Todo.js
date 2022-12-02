const pool = require('../utils/pool');

class Todo {
  id;
  task;
  user_id;
  complete;

  constructor(row) {
    this.id = row.id;
    this.task = row.task;
    this.user_id = row.user_id;
    this.complete = row.complete;
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * FROM todos WHERE user_id = 1$',
      [user_id]
    );

    return rows.map((row) => new Todo(row));
  }
}

module.exports = { Todo };
