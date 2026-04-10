// feat/ui-admin — M2: Jomar Auditor
export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Admin Panel</h1>
        <p className="text-sm text-slate-500 mt-0.5">SUPERADMIN access only</p>
      </div>

      <div className="card p-10 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
          <svg className="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-700">User Management</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Activate or deactivate user accounts. Full implementation arriving in Sprint 2.
          </p>
        </div>
        <span className="badge badge-blue">Coming in Sprint 2</span>
      </div>
    </div>
  );
}
