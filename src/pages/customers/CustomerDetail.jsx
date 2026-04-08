// src/pages/customers/CustomerDetail.jsx
// BRANCH: feat/ui-customer-detail (Jomar A. Auditor — M2)
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, AlertCircle, MapPin, Hash, User as UserIcon } from 'lucide-react';
import { getCustomerById } from '../../services/customerService.js';
import { PageLoader } from '../../components/ui/PageLoader.jsx';
import { PAY_TERM_BADGE_CLASSES, ROUTES } from '../../utils/constants.js';

function PayTermBadge({ value }) {
  const className = PAY_TERM_BADGE_CLASSES[value] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {value ?? '—'}
    </span>
  );
}

export default function CustomerDetail() {
  const { custNo } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: fetchError } = await getCustomerById(custNo);
      if (cancelled) return;
      if (fetchError) {
        setError(fetchError);
        setCustomer(null);
      } else {
        setCustomer(data);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [custNo]);

  if (loading) return <PageLoader message="Loading customer…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4">
        <Link
          to={ROUTES.CUSTOMERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {customer && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {customer.custno}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900">{customer.custname}</h1>
              </div>
              <div className="group relative inline-flex">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 opacity-70 shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                >
                  Coming in Sprint 2
                </span>
              </div>
            </div>
          </div>

          <dl className="divide-y divide-slate-100">
            <div className="flex gap-4 px-6 py-4">
              <dt className="flex w-32 items-center gap-2 text-sm font-medium text-slate-500">
                <Hash className="h-4 w-4" />
                Customer No
              </dt>
              <dd className="font-mono text-sm text-slate-900">{customer.custno}</dd>
            </div>
            <div className="flex gap-4 px-6 py-4">
              <dt className="flex w-32 items-center gap-2 text-sm font-medium text-slate-500">
                <UserIcon className="h-4 w-4" />
                Name
              </dt>
              <dd className="text-sm text-slate-900">{customer.custname}</dd>
            </div>
            <div className="flex gap-4 px-6 py-4">
              <dt className="flex w-32 items-center gap-2 text-sm font-medium text-slate-500">
                <MapPin className="h-4 w-4" />
                Address
              </dt>
              <dd className="text-sm text-slate-900">{customer.address}</dd>
            </div>
            <div className="flex items-center gap-4 px-6 py-4">
              <dt className="w-32 text-sm font-medium text-slate-500">Pay Term</dt>
              <dd>
                <PayTermBadge value={customer.payterm} />
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
