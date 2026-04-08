// src/pages/reports/Reports.jsx
// BRANCH: feat/routing-skeleton (Jomar A. Auditor — M2)
import { useMemo } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers.js';
import { PAY_TERMS, PAY_TERM_BADGE_CLASSES } from '../../utils/constants.js';

const PAY_TERM_LABELS = {
  COD: 'Cash on Delivery',
  '30D': '30-Day Terms',
  '45D': '45-Day Terms',
};

function SummaryCard({ label, value, sublabel, accentClass, badgeClass }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        {badgeClass && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
          >
            {label}
          </span>
        )}
      </div>
      <p className={`mt-3 text-3xl font-bold ${accentClass ?? 'text-slate-900'}`}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}

function BarRow({ label, count, total, className }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
        <span>
          {label} ({PAY_TERM_LABELS[label]})
        </span>
        <span>
          {count} · {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        {/* Tailwind exception: runtime-computed percentage widths cannot be
            generated at build time. React's documented escape hatch for
            dynamic styles is the `style` prop — narrowed here to width only. */}
        <div
          className={`h-full rounded-full transition-all duration-300 ${className}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

const BAR_COLORS = {
  COD: 'bg-amber-500',
  '30D': 'bg-blue-500',
  '45D': 'bg-emerald-500',
};

export default function Reports() {
  const { customers, loading, error } = useCustomers();

  const stats = useMemo(() => {
    const total = customers.length;
    const byTerm = PAY_TERMS.reduce((acc, term) => {
      acc[term] = customers.filter((c) => c.payterm === term).length;
      return acc;
    }, {});
    return { total, byTerm };
  }, [customers]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-600">
          Summary dashboard for active customer records.
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-start justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customers
            </p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {loading ? '—' : stats.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">Active records only</p>
        </div>

        {PAY_TERMS.map((term) => (
          <SummaryCard
            key={term}
            label={term}
            value={loading ? '—' : stats.byTerm[term] ?? 0}
            sublabel={PAY_TERM_LABELS[term]}
            badgeClass={PAY_TERM_BADGE_CLASSES[term]}
          />
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-sm font-semibold text-slate-800">Payment Term Distribution</h2>
        <p className="mt-1 text-xs text-slate-500">
          Proportion of customers assigned to each payment term.
        </p>
        <div className="mt-5 space-y-4">
          {PAY_TERMS.map((term) => (
            <BarRow
              key={term}
              label={term}
              count={stats.byTerm[term] ?? 0}
              total={stats.total}
              className={BAR_COLORS[term]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
