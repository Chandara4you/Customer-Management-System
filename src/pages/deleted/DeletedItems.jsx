// src/pages/deleted/DeletedItems.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { Trash2 } from 'lucide-react';

export default function DeletedItems() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Deleted Items</h1>
      <p className="mt-1 text-sm text-slate-600">
        Soft-deleted customers available for restore.
      </p>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-card">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Trash2 className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Coming in Sprint 2</h2>
        <p className="mt-2 text-sm text-slate-600">
          Once CRUD ships, customers marked INACTIVE via soft-delete will appear here with a
          restore action. The <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">record_status</code>{' '}
          column is already in place via the Sprint 1 migration.
        </p>
      </div>
    </div>
  );
}
