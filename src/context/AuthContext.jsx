// feat/auth-context — M4: Wayne Andy Villamor
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * Reads the public.user row for a given auth UID.
 * Returns null if not found (provision trigger may not have fired yet).
 */
async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('user')
    .select('id, user_type, record_status')
    .eq('id', userId)
    .single();
  if (error) {
    console.error('fetchProfile:', error);
    return null;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile]         = useState(null); // public.user row
  const [loading, setLoading]         = useState(true);
  const [authError, setAuthError]     = useState(null);

  // Login guard: block INACTIVE users
  async function applyLoginGuard(session) {
    if (!session?.user) {
      setCurrentUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const prof = await fetchProfile(session.user.id);

    if (prof?.record_status === 'INACTIVE') {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setProfile(null);
      setAuthError('Your account is inactive. Contact the administrator.');
      setLoading(false);
      return;
    }

    setCurrentUser(session.user);
    setProfile(prof);
    setAuthError(null);
    setLoading(false);
  }

  useEffect(() => {
    // Bootstrap: check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      applyLoginGuard(session);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        applyLoginGuard(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function signUpWithEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  }

  async function signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      profile,
      role: profile?.user_type ?? null,
      loading,
      authError,
      setAuthError,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Use inside any component that needs auth state. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
