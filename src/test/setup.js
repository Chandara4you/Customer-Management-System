// test/sprint1-auth-flows — M5: Trixian Wackyll Granado
import '@testing-library/jest-dom';

// Mock Supabase globally so no real network calls go out in tests
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession:         vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange:  vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp:             vi.fn(),
      signInWithOAuth:    vi.fn(),
      signOut:            vi.fn().mockResolvedValue({}),
    },
    from: vi.fn().mockReturnValue({
      select:  vi.fn().mockReturnThis(),
      eq:      vi.fn().mockReturnThis(),
      single:  vi.fn().mockResolvedValue({ data: null, error: null }),
      ilike:   vi.fn().mockReturnThis(),
      order:   vi.fn().mockReturnThis(),
      insert:  vi.fn().mockReturnThis(),
      update:  vi.fn().mockReturnThis(),
    }),
  },
}));
