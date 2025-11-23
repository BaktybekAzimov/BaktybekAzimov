import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { render } from '../../test/test-utils';
import * as AuthContext from '../../contexts/AuthContext';

// Mock Navigate component
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => {
      mockNavigate(to);
      return <div data-testid="navigate">{to}</div>;
    },
  };
});

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('shows loading spinner when auth is loading', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should show loading spinner, not the content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should redirect to /login
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated as admin', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: {
        id: 'admin-id',
        email: 'admin@demo.com',
        role: 'admin',
      },
      supabaseUser: {},
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: true,
      isDispatcher: false,
      isDriver: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders children when user is authenticated as dispatcher', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: {
        id: 'dispatcher-id',
        email: 'dispatcher@demo.com',
        role: 'dispatcher',
      },
      supabaseUser: {},
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: true,
      isDriver: false,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders children when user is authenticated as driver', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: {
        id: 'driver-id',
        email: 'driver@demo.com',
        role: 'driver',
      },
      supabaseUser: {},
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: true,
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles transition from loading to authenticated', () => {
    const { rerender } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Initially loading
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

    // Then authenticated
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: {
        id: 'user-id',
        email: 'user@demo.com',
        role: 'admin',
      },
      supabaseUser: {},
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: true,
      isDispatcher: false,
      isDriver: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles transition from loading to unauthenticated', () => {
    const { rerender } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Initially loading
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Then unauthenticated
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      supabaseUser: null,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      isAdmin: false,
      isDispatcher: false,
      isDriver: false,
    });

    rerender(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
