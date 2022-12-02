const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { Todo } = require('../models/Todo');

module.exports = Router().get('/', [authenticate], async (req, res, next) => {
  try {
    const todos = await Todo.getAll();
    // if (!todos) next();
    res.json(todos);
  } catch (e) {
    next(e);
  }
});
