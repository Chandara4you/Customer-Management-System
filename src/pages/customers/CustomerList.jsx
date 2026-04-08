// src/pages/customers/CustomerList.jsx
// BRANCH: feat/ui-customer-list (Jomar A. Auditor — M2)
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers.js';
import { PAY_TERM_BADGE_CLASSES, PAGE_SIZE } from '../../utils/constants.js';

function PayTermBadge({ value }) {
  const className = PAY_TERM_BADGE_CLASSES[value] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
    >
      {value ?? '—'}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-4 py-3">
        <div className="h-3 w-14 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-3 w-64 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-3">
        <div className="h-5 w-12 animate-pulse rounded-full bg-slate-200" />
      </td>
    </tr>
  );
}

export default function CustomerList() {
  const { customers, loading, error } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.custname?.toLowerCase().includes(term) ||
        c.address?.toLowerCase().includes(term) ||
        c.custno?.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse and search customer records.
          </p>
        </div>
        <div className="group relative inline-flex">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white opacity-60 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          >
            Coming in Sprint 2
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, address, or customer number"
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Cust No</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Pay Term</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={`skeleton-${i}`} />)}

              {!loading && error && (
                <tr>
                  <td colSpan={4} className="px-4 py-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <p className="text-sm font-medium text-slate-800">{error}</p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && pageRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">No customers found.</p>
                      {searchTerm && (
                        <p className="text-xs text-slate-500">
                          Try a different search term.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                pageRows.map((c) => (
                  <tr
                    key={c.custno}
                    className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                      <Link
                        to={`/customers/${c.custno}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {c.custno}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        to={`/customers/${c.custno}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {c.custname}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.address}</td>
                    <td className="px-4 py-3">
                      <PayTermBadge value={c.payterm} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing <span className="font-semibold">{pageStart + 1}</span>–
              <span className="font-semibold">
                {Math.min(pageStart + PAGE_SIZE, filtered.length)}
              </span>{' '}
              of <span className="font-semibold">{filtered.length}</span> customers
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </button>
              <span className="text-xs font-medium text-slate-600">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
