// feat/ui-login-page — M2: Jomar Auditor
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

// ── Zod schema (module-level) ─────────────────────────────────────────────────
const schema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Google icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

// ── Shield icon ───────────────────────────────────────────────────────────────
function ShieldIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67v4.12c0 3.65-2.38 7.05-6 8.19-3.62-1.14-6-4.54-6-8.19V7.67L12 5z"/>
    </svg>
  );
}

// ── Eye icon ──────────────────────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );
}

// ── Left panel branding section ───────────────────────────────────────────────
function LeftPanel() {
  return (
    <section
      className="hidden md:flex w-1/2 flex-col justify-between relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0f2460 0%, #1a3ba0 40%, #1d4ed8 80%, #2563eb 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.4) 0%, transparent 70%)' }} />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 opacity-[0.06]"
           style={{
             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
             backgroundSize: '32px 32px',
           }}
      />

      {/* Top: Logo */}
      <div className="relative z-10 p-12 pb-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShieldIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-display font-extrabold text-2xl tracking-tight">HopeCMS</span>
        </div>
      </div>

      {/* Middle: Headline + badges */}
      <div className="relative z-10 px-12">
        <h2 className="text-white font-display font-bold leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}>
          Manage your customers.<br />
          <span style={{ color: '#93c5fd' }}>Empower your team.</span>
        </h2>
        <p className="text-blue-200 text-base leading-relaxed mb-8 max-w-sm opacity-80">
          A unified platform for HOPE, Inc. to track customers, manage access, and keep every team member in sync.
        </p>
        <div className="flex flex-wrap gap-2.5">
          {['Role-based access', 'Real-time data', 'Audit-ready'].map(tag => (
            <span key={tag}
              className="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: '#bfdbfe', border: '1px solid rgba(255,255,255,0.12)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: Illustration card */}
      <div className="relative z-10 p-12 pt-8">
        <div className="rounded-2xl overflow-hidden"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
          <img
            src="/hero.svg"
            alt="HopeCMS dashboard preview"
            className="w-full h-auto"
            style={{ maxHeight: '240px', objectFit: 'cover' }}
          />
        </div>
        <p className="mt-4 text-center text-xs font-medium"
           style={{ color: 'rgba(180,197,255,0.6)' }}>
          Trusted by HOPE, Inc. operations team
        </p>
      </div>
    </section>
  );
}

// ── Main Login page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle, authError, setAuthError } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname ?? ROUTES.CUSTOMERS;

  const [fields, setFields]     = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [showPw, setShowPw]     = useState(false);

  function onChange(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined, form: undefined }));
    setAuthError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = schema.safeParse(fields);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors({ email: flat.email?.[0], password: flat.password?.[0] });
      return;
    }
    setLoading(true);
    const { error } = await signInWithEmail(fields.email, fields.password);
    if (error) { setErrors({ form: error.message }); setLoading(false); return; }
    navigate(from, { replace: true });
  }

  async function handleGoogle() {
    setGLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setErrors({ form: error.message }); setGLoading(false); }
  }

  const anyError = authError || errors.form;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* ── Left panel ─────────────────────────────── */}
      <LeftPanel />

      {/* ── Right panel: form ──────────────────────── */}
      <section className="w-full md:w-1/2 flex items-center justify-center bg-surface p-6 sm:p-10 md:p-16 lg:p-24 min-h-screen md:min-h-0">
        <div className="w-full max-w-[400px] animate-slide-up">

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #004ac6, #2563eb)' }}>
              <ShieldIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-on-surface tracking-tight">HopeCMS</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-display font-bold text-on-surface leading-tight mb-1.5">
              Welcome back
            </h1>
            <p className="text-on-surface-variant text-sm">
              Sign in to your HopeCMS account to continue.
            </p>
          </div>

          {/* Error banner */}
          {anyError && (
            <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl animate-slide-up"
                 style={{ background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)' }}>
              <svg className="h-[18px] w-[18px] text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm font-medium text-on-error-container">{anyError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={onChange}
                placeholder="name@company.com"
                className={`w-full h-12 px-4 rounded-xl text-sm text-on-surface bg-surface-container-lowest
                            placeholder-outline transition-all outline-none
                            border focus:ring-4
                            ${errors.email
                              ? 'border-error focus:ring-error/10 focus:border-error'
                              : 'border-outline-variant/40 focus:border-primary focus:ring-primary/10'
                            }`}
              />
              {errors.email && (
                <p className="text-xs text-error font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={fields.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  className={`w-full h-12 px-4 pr-12 rounded-xl text-sm text-on-surface bg-surface-container-lowest
                              placeholder-outline transition-all outline-none
                              border focus:ring-4
                              ${errors.password
                                ? 'border-error focus:ring-error/10 focus:border-error'
                                : 'border-outline-variant/40 focus:border-primary focus:ring-primary/10'
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error font-medium">{errors.password}</p>
              )}
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm text-white
                         flex items-center justify-center gap-2.5
                         transition-all active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                boxShadow: '0 4px 20px rgba(0,74,198,0.35)',
              }}
            >
              {loading && <LoadingSpinner size="sm" className="text-white" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-surface text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                or
              </span>
            </div>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3
                       text-on-surface text-sm font-semibold
                       bg-surface-container-lowest border border-outline-variant/40
                       hover:bg-surface-container-low
                       transition-all active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {gLoading ? <LoadingSpinner size="sm" /> : <GoogleIcon />}
            {gLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Register link */}
          <p className="mt-8 text-center text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary font-semibold hover:opacity-75 transition-opacity">
              Create one
            </Link>
          </p>

          {/* Footer note */}
          <p className="mt-6 text-center text-[11px] text-on-surface-variant/60 flex items-center justify-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            New accounts require administrator activation.
          </p>
        </div>
      </section>
    </div>
  );
}