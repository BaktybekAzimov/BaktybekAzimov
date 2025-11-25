import { vi } from 'vitest';

export const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
  })),
};

export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'admin',
  full_name: 'Test User',
  phone: '+996555123456',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockSession = (user = createMockUser()) => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: {
    id: user.id,
    email: user.email,
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: user.created_at,
  },
});
