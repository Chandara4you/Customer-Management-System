// feat/ui-reports — M2: Jomar Auditor
import { useEffect, useState } from 'react';
import { getCustomerStats } from '../../services/customerService';

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-0.5 leading-none">
          {value ?? <span className="text-slate-300 text-2xl">—</span>}
        </p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function DistributionBar({ label, count, total, colorClass, badgeClass }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className={`badge ${badgeClass}`}>{label}</span>
        </div>
        <span className="font-semibold text-slate-700">{count ?? 0}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          /* Dynamic runtime width — CSS custom property; Tailwind can't generate this at build time */
          className={`h-full rounded-full transition-all duration-700 ${colorClass} bar-fill`}
          style={{ '--bar-w': `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 text-right">{pct}% of total</p>
    </div>
  );
}

export default function ReportsPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await getCustomerStats();
      if (cancelled) return;
      if (err) setError(err.message ?? 'Failed to load statistics.');
      else setStats(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const payTerms = [
    { key: 'COD',  label: 'Cash on Delivery', colorClass: 'bg-emerald-400', badgeClass: 'badge-green' },
    { key: '30D',  label: 'Net 30 Days',       colorClass: 'bg-brand-400',   badgeClass: 'badge-blue'  },
    { key: '45D',  label: 'Net 45 Days',       colorClass: 'bg-amber-400',   badgeClass: 'badge-amber' },
  ];

  const Skeleton = () => (
    <div className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Customer summary — Sprint 1 scope</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {/* KPI cards */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Overview</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Customers"
              value={stats?.total ?? 0}
              sub="Active records"
              accent="bg-brand-50"
              icon={
                <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            {payTerms.map(pt => (
              <StatCard
                key={pt.key}
                label={pt.label}
                value={stats?.[pt.key] ?? 0}
                sub={`${stats?.total > 0 ? Math.round(((stats?.[pt.key] ?? 0) / stats.total) * 100) : 0}% of customers`}
                accent={pt.key === 'COD' ? 'bg-emerald-50' : pt.key === '30D' ? 'bg-brand-50' : 'bg-amber-50'}
                icon={
                  <svg className={`h-5 w-5 ${pt.key === 'COD' ? 'text-emerald-600' : pt.key === '30D' ? 'text-brand-600' : 'text-amber-600'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Distribution breakdown */}
      <section>
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-5">
            Payment Terms Distribution
          </h2>
          {loading ? (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                  <div className="h-2 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {payTerms.map(pt => (
                <DistributionBar
                  key={pt.key}
                  label={pt.label}
                  count={stats?.[pt.key] ?? 0}
                  total={stats?.total ?? 0}
                  colorClass={pt.colorClass}
                  badgeClass={pt.badgeClass}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sprint 2 placeholders */}
      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Coming in Sprint 2</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {['Sales Analytics', 'Revenue Trends', 'Payment History'].map(title => (
            <div key={title} className="card p-5 flex items-center gap-3 opacity-50">
              <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{title}</p>
                <p className="text-xs text-slate-400">Locked</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
