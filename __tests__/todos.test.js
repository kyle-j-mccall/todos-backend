const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { Todo } = require('../lib/models/Todo');

const mockUser = {
  firstName: 'Testing',
  lastName: 'User 2',
  email: 'testEmail@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('POST /api/v1/todos should post a todo with current user', async () => {
    const [agent] = await registerAndLogin();
    const mockTodo = {
      task: 'do dishes',
    };

    const resp = await agent.post('/api/v1/todos').send(mockTodo);
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Object {
        "complete": false,
        "id": "1",
        "task": "do dishes",
        "user_id": "1",
      }
    `);
  });

  it('GET /api/v1/todos should return a list of todos from the authenticated user', async () => {
    const [agent, user] = await registerAndLogin();
    const mockTodo1 = {
      task: 'clean',
      user_id: user.id,
    };
    const testResp = await agent.post('/api/v1/todos').send(mockTodo1);
    const resp = await agent.get('/api/v1/todos');
    console.log(testResp.body);

    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`
      Array [
        Object {
          "complete": false,
          "id": "1",
          "task": "clean",
          "user_id": "1",
        },
      ]
    `);
  });
  it('PUT /api/v1/todos/:id should update an authenticated users todos', async () => {
    const [agent, user] = await registerAndLogin();
    console.log('updateeee', user);
    const todo = await Todo.insert({
      task: 'watch movie',
      user_id: user.id,
    });
    await agent.post('/api/v1/todos').send(todo);

    const resp = await agent
      .put(`/api/v1/todos/${todo.id}`)
      .send({ complete: true });
    expect(resp.status).toBe(200);
    expect(resp.body.complete).toBe(true);
  });
});
