// test/sprint1-auth-flows — M5: Trixian Wackyll Granado
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Helper component to read auth context values
function AuthConsumer() {
  const { currentUser, authError } = useAuth();
  return (
    <div>
      <span data-testid="user">{currentUser?.email ?? 'none'}</span>
      <span data-testid="error">{authError ?? ''}</span>
    </div>
  );
}

describe('AuthContext — login guard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('allows ACTIVE users through', async () => {
    const fakeSession = { user: { id: 'uid-1', email: 'active@test.com' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: fakeSession } });
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data:  { id: 'uid-1', user_type: 'USER', record_status: 'ACTIVE' },
        error: null,
      }),
    });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('active@test.com')
    );
    expect(screen.getByTestId('error').textContent).toBe('');
  });

  it('blocks INACTIVE users and signs them out', async () => {
    const fakeSession = { user: { id: 'uid-2', email: 'inactive@test.com' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: fakeSession } });
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data:  { id: 'uid-2', user_type: 'USER', record_status: 'INACTIVE' },
        error: null,
      }),
    });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() =>
      expect(screen.getByTestId('error').textContent).toMatch(/inactive/i)
    );
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('treats no profile row as allowed (trigger may not have fired yet)', async () => {
    const fakeSession = { user: { id: 'uid-3', email: 'new@test.com' } };

    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: fakeSession } });
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }),
    });

    render(<AuthProvider><AuthConsumer /></AuthProvider>);
    await waitFor(() =>
      expect(screen.getByTestId('user').textContent).toBe('new@test.com')
    );
  });
});
