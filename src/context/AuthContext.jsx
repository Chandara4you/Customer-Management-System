// src/context/AuthContext.jsx
// BRANCH: feat/auth-context (Wayne Andy Y. Villamor — M4)
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../config/supabaseClient.js';
import { RECORD_STATUSES } from '../utils/constants.js';

const AuthContext = createContext(null);

const INACTIVE_ACCOUNT_MESSAGE =
  'Your account is inactive. Please contact an administrator.';

async function fetchUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('user')
      .select('id, email, first_name, last_name, username, user_type, record_status')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('fetchUserProfile:', error.message);
      return { profile: null, error: 'Unable to load your profile.' };
    }
    if (!data) {
      return { profile: null, error: 'Your profile could not be found.' };
    }
    return { profile: data, error: null };
  } catch (err) {
    console.error('fetchUserProfile:', err);
    return { profile: null, error: 'Unexpected error while loading profile.' };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setCurrentUser(null);
    setUserProfile(null);
  }, []);

  const runLoginGuard = useCallback(
    async (activeSession) => {
      if (!activeSession?.user) {
        clearAuthState();
        return;
      }
      const { profile, error: profileError } = await fetchUserProfile(activeSession.user.id);

      if (profileError || !profile) {
        await supabase.auth.signOut();
        clearAuthState();
        setAuthError(profileError ?? 'Unable to verify your account.');
        return;
      }

      if (profile.record_status !== RECORD_STATUSES.ACTIVE) {
        await supabase.auth.signOut();
        clearAuthState();
        setAuthError(INACTIVE_ACCOUNT_MESSAGE);
        return;
      }

      setSession(activeSession);
      setCurrentUser(activeSession.user);
      setUserProfile(profile);
      setAuthError(null);
    },
    [clearAuthState]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error) {
        console.error('AuthContext.getSession:', error.message);
        setAuthLoading(false);
        return;
      }
      if (data?.session) {
        await runLoginGuard(data.session);
      }
      if (mounted) setAuthLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await runLoginGuard(nextSession);
      } else if (event === 'SIGNED_OUT') {
        clearAuthState();
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [runLoginGuard, clearAuthState]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearAuthState();
    setAuthError(null);
  }, [clearAuthState]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  const value = {
    session,
    currentUser,
    userProfile,
    authLoading,
    authError,
    signOut,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return ctx;
}
