// feat/routing-skeleton — M2: Jomar Auditor
import LoadingSpinner from './LoadingSpinner';

/** Full-page loading overlay used while auth state bootstraps. */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 gap-4 z-50">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        <span className="font-semibold text-slate-700 text-lg tracking-tight">HopePMS</span>
      </div>
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate-400 font-medium">Loading your workspace…</p>
    </div>
  );
}
