const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { Todo } = require('../models/Todo');

module.exports = Router()
  .put('/:id', [authenticate, authorize], async (req, res, next) => {
    console.log('userrr', req.user);
    try {
      const updatedTodo = await Todo.update(req.params.id, req.body);
      if (!updatedTodo) next();
      res.json(updatedTodo);
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', [authenticate], async (req, res, next) => {
    console.log('get', req.user);
    try {
      const todos = await Todo.getById(req.user.id);
      // console.log(todos);
      if (!todos) next();
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  .get('/', [authenticate], async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      // console.log(todos);
      if (!todos) next();
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  .post('/', [authenticate], async (req, res, next) => {
    try {
      console.log('useuse', req.user);
      const todo = await Todo.insert({ ...req.body, user_id: req.user.id });
      if (!todo) next();
      res.json(todo);
    } catch (e) {
      next(e);
    }
  });
