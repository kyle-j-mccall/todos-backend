const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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
    const [agent] = await registerAndLogin();
    const resp = await agent.get('/api/v1/todos');
    expect(resp.status).toBe(200);
    expect(resp.body).toMatchInlineSnapshot(`Array []`);
  });
});
