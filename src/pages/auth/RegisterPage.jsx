// feat/ui-register-page — M2: Jomar Auditor
import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

// ── Zod schema (module-level) ─────────────────────────────────────────────────
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  username:  z.string().min(3, 'At least 3 characters').regex(/^[a-z0-9_]+$/i, 'Letters, numbers and _ only'),
  email:     z.string().min(1, 'Email is required').email('Enter a valid email'),
  password:  z.string().min(8, 'At least 8 characters required'),
  confirm:   z.string().min(1, 'Please confirm your password'),
}).refine(d => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

// ── Password strength calculator ──────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: '',        color: '' },
    { label: 'Weak',    color: 'bg-error' },
    { label: 'Fair',    color: 'bg-amber-400' },
    { label: 'Good',    color: 'bg-yellow-400' },
    { label: 'Strong',  color: 'bg-emerald-500' },
  ];
  return { score: s, ...map[s] };
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function ShieldIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67v4.12c0 3.65-2.38 7.05-6 8.19-3.62-1.14-6-4.54-6-8.19V7.67L12 5z"/>
    </svg>
  );
}

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

// ── Field input component ─────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}

// ── Left panel ────────────────────────────────────────────────────────────────
function LeftPanel() {
  return (
    <section
      className="hidden lg:flex w-1/2 flex-col justify-between relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0f2460 0%, #1a3ba0 40%, #1d4ed8 80%, #2563eb 100%)' }}
    >
      {/* Orbs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.45) 0%, transparent 70%)' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.06]"
           style={{
             backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
             backgroundSize: '32px 32px',
           }} />

      {/* Logo */}
      <div className="relative z-10 p-12 pb-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
               style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShieldIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-display font-extrabold text-2xl tracking-tight">HopeCMS</span>
        </div>
      </div>

      {/* Middle: headline */}
      <div className="relative z-10 px-12">
        <h2 className="text-white font-display font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.5rem)' }}>
          Join the platform.<br />
          <span style={{ color: '#93c5fd' }}>Start managing.</span>
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed mb-8 max-w-xs opacity-80">
          Your account will be reviewed by an administrator before you can access the system.
        </p>

        {/* Feature list */}
        {[
          'Secure role-based authentication',
          'Real-time customer data',
          'Soft-delete & audit trail',
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <div className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                 style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <svg className="h-3.5 w-3.5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-blue-100 text-sm opacity-85">{feat}</span>
          </div>
        ))}
      </div>

      {/* Bottom: hero illustration */}
      <div className="relative z-10 p-12 pt-8">
        <div className="rounded-2xl overflow-hidden"
             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <img src="/hero.svg" alt="Dashboard preview" className="w-full h-auto" style={{ maxHeight: '220px', objectFit: 'cover' }} />
        </div>
      </div>
    </section>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessState({ email }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <LeftPanel />
      <section className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-6 sm:p-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-[400px] text-center animate-slide-up">
          <div className="h-16 w-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-on-surface mb-2">Check your email</h2>
          <p className="text-on-surface-variant text-sm mb-1">
            A confirmation link was sent to
          </p>
          <p className="text-primary font-semibold text-sm mb-6">{email}</p>
          <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
            Your account will be activated by an administrator after verification.
          </p>
          <Link to={ROUTES.LOGIN}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #004ac6, #2563eb)' }}>
            Back to Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── Main Register page ────────────────────────────────────────────────────────
const INIT = { firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' };

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields]     = useState(INIT);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [showCo, setShowCo]     = useState(false);

  const strength = useMemo(() => getStrength(fields.password), [fields.password]);

  function onChange(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: undefined, form: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = schema.safeParse(fields);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, v?.[0]])));
      return;
    }
    setLoading(true);
    const { error } = await signUpWithEmail(fields.email, fields.password);
    if (error) { setErrors({ form: error.message }); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogle() {
    setGLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setErrors({ form: error.message }); setGLoading(false); }
  }

  if (success) return <SuccessState email={fields.email} />;

  const inputCls = (field) =>
    `w-full h-12 px-4 rounded-xl text-sm text-on-surface bg-surface-container-lowest
     placeholder-outline transition-all outline-none border focus:ring-4
     ${errors[field]
       ? 'border-error focus:ring-error/10 focus:border-error'
       : 'border-outline-variant/40 focus:border-primary focus:ring-primary/10'
     }`;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* ── Left panel ─────────────────────────────── */}
      <LeftPanel />

      {/* ── Right panel: form ──────────────────────── */}
      <section className="w-full lg:w-1/2 bg-surface flex items-start justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-[420px] py-8 animate-slide-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #004ac6, #2563eb)' }}>
              <ShieldIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl text-on-surface tracking-tight">HopeCMS</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-display font-bold text-on-surface leading-tight mb-1.5">
              Create your account
            </h1>
            <p className="text-on-surface-variant text-sm">
              Enter your details to register for the HopeCMS platform.
            </p>
          </div>

          {/* Form error */}
          {errors.form && (
            <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl animate-slide-up"
                 style={{ background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)' }}>
              <svg className="h-[18px] w-[18px] text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm font-medium text-on-error-container">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" error={errors.firstName}>
                <input
                  name="firstName" value={fields.firstName} onChange={onChange}
                  placeholder="Juan" className={inputCls('firstName')}
                />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <input
                  name="lastName" value={fields.lastName} onChange={onChange}
                  placeholder="dela Cruz" className={inputCls('lastName')}
                />
              </Field>
            </div>

            <Field label="Username" error={errors.username}>
              <input
                name="username" value={fields.username} onChange={onChange}
                placeholder="juandc_admin" className={inputCls('username')}
              />
            </Field>

            <Field label="Email Address" error={errors.email}>
              <input
                name="email" type="email" autoComplete="email"
                value={fields.email} onChange={onChange}
                placeholder="name@organization.com" className={inputCls('email')}
              />
            </Field>

            {/* Password with strength */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
                Password
              </label>
              <div className="relative">
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={fields.password} onChange={onChange}
                  placeholder="Min. 8 characters"
                  className={inputCls('password') + ' pr-12'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
                  tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>

              {/* Strength bar */}
              {fields.password && (
                <div className="pt-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-300
                        ${i <= strength.score ? strength.color : 'bg-outline-variant/30'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Strength: <span className="font-semibold">{strength.label}</span>
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-error font-medium">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <Field label="Confirm Password" error={errors.confirm}>
              <div className="relative">
                <input
                  name="confirm" type={showCo ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={fields.confirm} onChange={onChange}
                  placeholder="Re-enter your password"
                  className={inputCls('confirm') + ' pr-12'}
                />
                <button type="button" onClick={() => setShowCo(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
                  tabIndex={-1}>
                  <EyeIcon open={showCo} />
                </button>
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm text-white
                         flex items-center justify-center gap-2.5 mt-2
                         transition-all active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
                boxShadow: '0 4px 20px rgba(0,74,198,0.35)',
              }}
            >
              {loading && <LoadingSpinner size="sm" className="text-white" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-surface text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                or
              </span>
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={gLoading}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-3
                       text-on-surface text-sm font-semibold
                       bg-surface-container-highest border border-outline-variant/40
                       hover:bg-surface-container-high
                       transition-all active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed">
            {gLoading ? <LoadingSpinner size="sm" /> : <GoogleIcon />}
            {gLoading ? 'Redirecting…' : 'Register with Google'}
          </button>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-outline-variant/20 space-y-4">
            <p className="text-[11px] text-on-surface-variant/60 text-center leading-relaxed">
              By registering, your account will be reviewed by an administrator before activation.
            </p>
            <p className="text-sm text-on-surface-variant text-center">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary font-semibold hover:opacity-75 transition-opacity">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}