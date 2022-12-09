const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { Todo } = require('../models/Todo');

module.exports = Router()
  .put('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const updatedTodo = await Todo.update(req.params.id, req.body);

      res.json(updatedTodo);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', [authenticate], async (req, res, next) => {
    try {
      const todos = await Todo.getById(req.user.id);
      if (!todos) {
        next();
      } else {
        res.json(todos);
      }
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', [authenticate, authorize], async (req, res, next) => {
    try {
      const deleted = await Todo.delete(req.params.id);
      if (!deleted) next();
      res.status(200);
      res.send();
    } catch (e) {
      next(e);
    }
  })
  .get('/', [authenticate], async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
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
