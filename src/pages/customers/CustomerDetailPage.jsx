// feat/ui-customer-detail — M2: Jomar Auditor
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById } from '../../services/customerService';
import { ROUTES, PAY_TERM_LABELS } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-4 border-b border-slate-100 last:border-0">
      <dt className="sm:w-36 flex-shrink-0 text-xs font-semibold text-slate-400 uppercase tracking-wider pt-0.5">
        {label}
      </dt>
      <dd className={`flex-1 text-sm font-medium text-slate-800 ${mono ? 'font-mono' : ''}`}>
        {value ?? <span className="text-slate-400 font-normal">—</span>}
      </dd>
    </div>
  );
}

export default function CustomerDetailPage() {
  const { custno } = useParams();
  const navigate   = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error: err } = await getCustomerById(custno);
      if (cancelled) return;
      if (err) setError(err.message ?? 'Customer not found.');
      else setCustomer(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [custno]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="h-7 w-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">{error ?? 'Customer not found.'}</p>
        <Link to={ROUTES.CUSTOMERS} className="btn-secondary">← Back to Customers</Link>
      </div>
    );
  }

  const payTermLabel = PAY_TERM_LABELS[customer.payterm] ?? customer.payterm ?? '—';
  const initial      = customer.custname?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link to={ROUTES.CUSTOMERS} className="hover:text-brand-600 transition-colors">
          Customers
        </Link>
        <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-800 font-medium">{customer.custname}</span>
      </nav>

      {/* Profile header */}
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-brand-700">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 truncate">{customer.custname}</h1>
          <p className="text-slate-500 text-sm mt-0.5 truncate">{customer.address ?? 'No address on file'}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`badge ${
              customer.payterm === 'COD'  ? 'badge-green' :
              customer.payterm === '30D' ? 'badge-blue'  :
              customer.payterm === '45D' ? 'badge-amber' : 'badge-slate'
            }`}>
              {payTermLabel}
            </span>
            <span className={`badge ${customer.record_status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
              {customer.record_status ?? 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Sprint 2 actions — disabled */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
          <div className="relative group">
            <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <div className="absolute right-0 top-full mt-2 w-40 px-3 py-2 bg-slate-800 text-white text-xs
                            rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
              Edit coming in Sprint 2
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="card px-6">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-5 pb-2">
          Customer Details
        </h2>
        <dl>
          <InfoRow label="Customer No."   value={String(customer.custno).padStart(4, '0')} mono />
          <InfoRow label="Full Name"      value={customer.custname} />
          <InfoRow label="Address"        value={customer.address} />
          <InfoRow label="Payment Terms"  value={payTermLabel} />
          <InfoRow label="Status"         value={customer.record_status ?? 'ACTIVE'} />
        </dl>
      </div>

      {/* Future sections — Sprint 2 placeholders */}
      <div className="grid sm:grid-cols-2 gap-4">
        {['Sales History', 'Payment Records'].map(title => (
          <div key={title} className="card p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] text-center">
            <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-xs text-slate-400">Available in Sprint 2</p>
          </div>
        ))}
      </div>

      {/* Back link */}
      <div className="pb-4">
        <button onClick={() => navigate(-1)} className="btn-ghost text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
