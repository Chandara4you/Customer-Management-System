// feat/ui-auth-callback — M2: Jomar Auditor / M4: Wayne Andy Villamor
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

/**
 * Landing page for Google OAuth redirect.
 * Supabase exchanges the code in the URL and fires onAuthStateChange.
 * AuthContext's login guard then decides whether the user is allowed in.
 */
export default function AuthCallbackPage() {
  const { currentUser, loading, authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (authError) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }
    if (currentUser) {
      navigate(ROUTES.CUSTOMERS, { replace: true });
    }
  }, [currentUser, loading, authError, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                    flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center
                      shadow-lg shadow-brand-600/30 animate-pulse-slow">
        <span className="text-white font-bold text-lg">H</span>
      </div>
      <LoadingSpinner size="lg" />
      <p className="text-slate-400 text-sm font-medium">Signing you in…</p>
    </div>
  );
}
