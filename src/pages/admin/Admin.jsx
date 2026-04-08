// src/pages/admin/Admin.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { ShieldCheck } from 'lucide-react';

export default function Admin() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
      <p className="mt-1 text-sm text-slate-600">
        SUPERADMIN-only control panel for user activation and account management.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Coming in Sprint 2</h2>
        <p className="mt-2 text-sm text-slate-600">
          This page will allow SUPERADMINs to activate newly registered users (USER / INACTIVE
          by default) and manage role assignments.
        </p>
      </div>
    </div>
  );
}
