import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Login from '../src/pages/Login';

vi.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ authenticated: false, login: vi.fn() }) }));

describe('Login form', () => {
  it('shows required validation messages', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Login /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
  });
});
