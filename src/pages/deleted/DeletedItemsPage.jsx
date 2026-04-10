// feat/ui-deleted — M2: Jomar Auditor
export default function DeletedItemsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Deleted Items</h1>
        <p className="text-sm text-slate-500 mt-0.5">Soft-deleted customers — ADMIN and SUPERADMIN only</p>
      </div>

      <div className="card p-10 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-700">Soft-Delete Archive</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Customers marked INACTIVE will appear here. The <code className="bg-slate-100 px-1 rounded text-xs">record_status</code> column is already in place via the Sprint 1 migration — restore functionality ships in Sprint 2.
          </p>
        </div>
        <span className="badge badge-slate">Coming in Sprint 2</span>
      </div>
    </div>
  );
}
