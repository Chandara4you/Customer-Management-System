// feat/ui-customer-list — M2: Jomar Auditor
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '../../hooks/useCustomers';
import { ROUTES, PAGE_SIZE, PAY_TERM_LABELS } from '../../utils/constants';

// ── Pay-term badge ─────────────────────────────────────────────────────────────
function PaytermBadge({ term }) {
  const map = {
    COD:  'badge-green',
    '30D': 'badge-blue',
    '45D': 'badge-amber',
  };
  return (
    <span className={`badge ${map[term] ?? 'badge-slate'}`}>
      {PAY_TERM_LABELS[term] ?? term ?? '—'}
    </span>
  );
}

// ── Skeleton row ───────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[40, 32, 48, 24, 20].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className={`h-4 bg-slate-100 rounded animate-pulse`} style={{ width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ query, onClear }) {
  return (
    <tr>
      <td colSpan={5} className="py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium text-sm">
            {query ? `No customers match "${query}"` : 'No customers found'}
          </p>
          {query && (
            <button onClick={onClear} className="text-brand-600 text-xs hover:underline">
              Clear search
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CustomerListPage() {
  const { customers, loading, error, search, refresh, query } = useCustomers();
  const navigate = useNavigate();
  const [page, setPage]     = useState(1);
  const [localQ, setLocalQ] = useState('');

  // Client-side pagination
  const total      = customers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const slice      = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return customers.slice(start, start + PAGE_SIZE);
  }, [customers, safePage]);

  function handleSearchChange(e) {
    const val = e.target.value;
    setLocalQ(val);
    setPage(1);
    // Debounce: only fire after 300 ms of inactivity
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => search(val), 300);
  }

  function clearSearch() {
    setLocalQ('');
    setPage(1);
    search('');
  }

  function goToPage(p) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Loading…' : `${total} active customer${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh */}
          <button onClick={refresh} title="Refresh" className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          {/* Add Customer — disabled Sprint 1 */}
          <div className="relative group">
            <button
              disabled
              className="btn-primary opacity-50 cursor-not-allowed"
              aria-describedby="add-tooltip"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </button>
            <div
              id="add-tooltip"
              role="tooltip"
              className="absolute right-0 top-full mt-2 w-44 px-3 py-2 bg-slate-800 text-white text-xs
                         rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10"
            >
              Coming in Sprint 2
            </div>
          </div>
        </div>
      </div>

      {/* ── Table card ──────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={localQ}
              onChange={handleSearchChange}
              placeholder="Search customers by name…"
              className="input pl-9 pr-9 text-sm"
            />
            {localQ && (
              <button onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cust No.</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Address</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pay Term</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : slice.length === 0
                  ? <EmptyState query={localQ} onClear={clearSearch} />
                  : slice.map(c => (
                      <tr
                        key={c.custno}
                        onClick={() => navigate(ROUTES.CUSTOMER_DETAIL(c.custno))}
                        className="border-b border-slate-50 hover:bg-brand-50/40 cursor-pointer
                                   transition-colors duration-100 group"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {String(c.custno).padStart(4, '0')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-brand-700 font-semibold text-xs">
                                {c.custname?.charAt(0)?.toUpperCase() ?? '?'}
                              </span>
                            </div>
                            <span className="font-medium text-slate-800 group-hover:text-brand-700 transition-colors">
                              {c.custname}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 hidden md:table-cell max-w-xs truncate">
                          {c.address ?? '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <PaytermBadge term={c.payterm} />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={e => { e.stopPropagation(); navigate(ROUTES.CUSTOMER_DETAIL(c.custno)); }}
                            className="btn-ghost text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!loading && total > 0 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-medium text-slate-700">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, total)}
              </span>{' '}
              of <span className="font-medium text-slate-700">{total}</span> customers
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600
                           hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Window around current page
                let p;
                if (totalPages <= 5) p = i + 1;
                else if (safePage <= 3) p = i + 1;
                else if (safePage >= totalPages - 2) p = totalPages - 4 + i;
                else p = safePage - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                      ${p === safePage
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-600
                           hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
