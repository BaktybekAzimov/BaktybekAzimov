import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../../pages/Login';
import { render } from '../../test/test-utils';
import * as AuthContext from '../../contexts/AuthContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  const mockSignIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockSignIn.mockClear();

    // Mock useAuth hook
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });
  });

  it('renders login form with all elements', () => {
    render(<Login />);

    expect(screen.getByText('TruckTrack')).toBeInTheDocument();
    expect(screen.getByText('Система учёта рейсов грузовиков')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('shows demo credentials information', () => {
    render(<Login />);

    expect(screen.getByText(/Демо доступ:/)).toBeInTheDocument();
    expect(screen.getByText(/admin@demo.com/)).toBeInTheDocument();
    expect(screen.getByText(/dispatcher@demo.com/)).toBeInTheDocument();
    expect(screen.getByText(/driver@demo.com/)).toBeInTheDocument();
  });

  it('handles successful login with admin credentials', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'admin@demo.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('admin@demo.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles successful login with dispatcher credentials', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'dispatcher@demo.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('dispatcher@demo.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles successful login with driver credentials', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce(undefined);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'driver@demo.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('driver@demo.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message when login fails with invalid email', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid login credentials';
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'wrong@email.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays error message when login fails with invalid password', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid login credentials';
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'admin@demo.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays default error message when error has no message', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce({});

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'test');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Ошибка входа. Проверьте email и пароль.')).toBeInTheDocument();
    });
  });

  it('prevents submission with empty fields (HTML5 validation)', async () => {
    const user = userEvent.setup();

    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /войти/i });
    await user.click(submitButton);

    // HTML5 validation prevents form submission
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    let resolveSignIn: () => void;
    const signInPromise = new Promise<void>((resolve) => {
      resolveSignIn = resolve;
    });
    mockSignIn.mockReturnValue(signInPromise);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'admin@demo.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    // Button should show loading state
    expect(submitButton).toBeDisabled();

    // Resolve the promise
    resolveSignIn!();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('clears error message on new submission', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValueOnce(new Error('First error'));

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    // First submission with error
    await user.type(emailInput, 'wrong@email.com');
    await user.type(passwordInput, 'wrong');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First error')).toBeInTheDocument();
    });

    // Second submission should clear error
    mockSignIn.mockResolvedValueOnce(undefined);
    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'admin@demo.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('First error')).not.toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /войти/i });

    await user.type(emailInput, 'not-an-email');
    await user.type(passwordInput, 'password');

    // Check HTML5 validation
    expect(emailInput.validity.valid).toBe(false);

    await user.click(submitButton);

    // Should not call signIn due to HTML5 validation
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
