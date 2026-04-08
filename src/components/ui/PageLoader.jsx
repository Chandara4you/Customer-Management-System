// src/components/ui/PageLoader.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { LoadingSpinner } from './LoadingSpinner.jsx';

export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    </div>
  );
}
