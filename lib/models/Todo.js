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
      'SELECT * FROM todos WHERE user_id = $1',
      [user_id]
    );
    if (!rows[0]) {
      return null;
    }
    return rows.map((row) => new Todo(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT * 
    FROM todos 
    WHERE id = $1`,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async insert({ task, user_id }) {
    const { rows } = await pool.query(
      `INSERT INTO todos (task, user_id) 
      VALUES ($1, $2) 
      RETURNING *`,
      [task, user_id]
    );
    return new Todo(rows[0]);
  }

  static async update(id, attrs) {
    const item = await Todo.getById(id);

    if (!item) return null;

    const { task, complete } = { ...item, ...attrs };

    const { rows } = await pool.query(
      `
    UPDATE todos
    SET task = $2, complete = $3
    WHERE id = $1
    
    RETURNING *`,
      [id, task, complete]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
    DELETE FROM todos WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    console.log('row row', rows);
    return new Todo(rows[0]);
  }
}

module.exports = { Todo };
