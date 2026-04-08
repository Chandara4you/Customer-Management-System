// src/context/AuthContext.test.jsx
// BRANCH: test/sprint1-auth-flows (Trixian Wackyll C. Granado — M5)
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

// Mock the Supabase client module — the login guard lives in AuthContext and
// should block any user whose profile row has record_status !== 'ACTIVE'.
vi.mock('../config/supabaseClient.js', () => {
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const getSession = vi.fn();
  const onAuthStateChange = vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });

  const fromMock = vi.fn();

  return {
    supabase: {
      auth: { signOut, getSession, onAuthStateChange },
      from: fromMock,
    },
  };
});

import { supabase } from '../config/supabaseClient.js';

function ProfileProbe() {
  const { authLoading, userProfile, authError, session } = useAuth();
  if (authLoading) return <span>loading</span>;
  return (
    <div>
      <span data-testid="session">{session ? 'has-session' : 'no-session'}</span>
      <span data-testid="profile">{userProfile ? userProfile.user_type : 'no-profile'}</span>
      <span data-testid="error">{authError ?? 'no-error'}</span>
    </div>
  );
}

function mockProfileResponse(profile) {
  supabase.from.mockImplementation(() => ({
    select: () => ({
      eq: () => ({
        maybeSingle: vi.fn().mockResolvedValue({ data: profile, error: null }),
      }),
    }),
  }));
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AuthContext — login guard', () => {
  it('allows an ACTIVE user and exposes their profile', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-active-1', email: 'active@neu.edu.ph' },
        },
      },
      error: null,
    });

    mockProfileResponse({
      id: 'user-active-1',
      email: 'active@neu.edu.ph',
      first_name: 'Active',
      last_name: 'User',
      username: 'active',
      user_type: 'USER',
      record_status: 'ACTIVE',
    });

    render(
      <AuthProvider>
        <ProfileProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('session')).toHaveTextContent('has-session');
    });
    expect(screen.getByTestId('profile')).toHaveTextContent('USER');
    expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });

  it('blocks an INACTIVE user, calls signOut, and sets the authError message', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-inactive-1', email: 'inactive@neu.edu.ph' },
        },
      },
      error: null,
    });

    mockProfileResponse({
      id: 'user-inactive-1',
      email: 'inactive@neu.edu.ph',
      first_name: 'Inactive',
      last_name: 'User',
      username: 'inactive',
      user_type: 'USER',
      record_status: 'INACTIVE',
    });

    render(
      <AuthProvider>
        <ProfileProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('session')).toHaveTextContent('no-session');
    expect(screen.getByTestId('profile')).toHaveTextContent('no-profile');
    expect(screen.getByTestId('error')).toHaveTextContent(
      'Your account is inactive. Please contact an administrator.'
    );
  });
});
