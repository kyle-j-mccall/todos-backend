const { Todo } = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);
    console.log('hellloooo');
    if (!req.user || req.user.id !== todo.user_id)
      throw new Error('You do not have access to view this page');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
