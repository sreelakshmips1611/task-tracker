import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TaskModal from '../src/components/TaskModal';

vi.mock('../src/services/api', () => ({ taskApi: { create: vi.fn(), update: vi.fn() }, getApiError: vi.fn(() => 'Request failed') }));

describe('TaskModal', () => {
  it('requires a task title', async () => {
    const user = userEvent.setup();
    render(<TaskModal task={null} onClose={vi.fn()} onSaved={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });
});
