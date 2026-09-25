import axiosMockAdapter from 'axios-mock-adapter';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import api, { taskApi } from '../src/services/api';

const mock = new axiosMockAdapter(api);

describe('Task API integration', () => {
  beforeEach(() => mock.reset());
  afterEach(() => mock.reset());
  it('loads tasks from the backend endpoint', async () => {
    mock.onGet('/tasks').reply(200, { tasks: [{ id: 1, title: 'Test task', status: 'pending' }] });
    const response = await taskApi.list();
    expect(response.data.tasks).toHaveLength(1);
    expect(response.data.tasks[0].title).toBe('Test task');
  });
});
