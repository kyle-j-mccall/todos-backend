const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { Todo } = require('../models/Todo');

module.exports = Router()
  .get('/', [authenticate], async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      console.log(todos);
      if (!todos) next();
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  .post('/', [authenticate], async (req, res, next) => {
    try {
      const todo = await Todo.insert({ ...req.body, user_id: req.user.id });
      if (!todo) next();
      res.json(todo);
    } catch (e) {
      next(e);
    }
  });
