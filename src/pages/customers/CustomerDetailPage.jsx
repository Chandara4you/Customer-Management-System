// feat/ui-customer-detail — M2: Jomar Auditor
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById } from '../../services/customerService';
import { getSalesByCustomer } from '../../services/salesService';
import { PAY_TERM_LABELS, ROUTES } from '../../utils/constants';
import SalesDetailModal from '../../components/modals/SalesDetailModal';

export default function CustomerDetailPage() {
  const { custno } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrans, setSelectedTrans] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [custRes, salesRes] = await Promise.all([
        getCustomerById(custno),
        getSalesByCustomer(custno)
      ]);
      if (custRes.error) setError(custRes.error.message);
      else setCustomer(custRes.data);
      if (!salesRes.error) setSales(salesRes.data || []);
      setLoading(false);
    }
    load();
  }, [custno]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="card p-6 max-w-md mx-auto">
        <p className="text-red-600">{error || 'Customer not found'}</p>
        <button onClick={() => navigate(ROUTES.CUSTOMERS)} className="btn-secondary mt-4">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(ROUTES.CUSTOMERS)} className="btn-ghost">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900">{customer.custname}</h1>
          <p className="text-sm text-slate-500">Customer No: {customer.custno}</p>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Customer No.</dt>
            <dd className="mt-1 text-sm text-slate-900 font-mono">{customer.custno}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Name</dt>
            <dd className="mt-1 text-sm text-slate-900">{customer.custname}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Address</dt>
            <dd className="mt-1 text-sm text-slate-900">{customer.address || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 uppercase">Payment Term</dt>
            <dd className="mt-1">
              <span className="badge-blue">{PAY_TERM_LABELS[customer.payterm] || customer.payterm}</span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Sales History Panel */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Sales History</h2>
          <p className="text-sm text-slate-500 mt-0.5">{sales.length} transaction{sales.length !== 1 ? 's' : ''}</p>
        </div>
        {sales.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No sales transactions recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Transaction No.</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(s => (
                  <tr key={s.transNo} className="border-b border-slate-50 hover:bg-brand-50/40 transition-colors group">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">{s.transNo}</td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {new Date(s.salesDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">{s.empNo}</td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedTrans(s.transNo)}
                        className="btn-ghost text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sales Detail Modal */}
      {selectedTrans && (
        <SalesDetailModal transNo={selectedTrans} onClose={() => setSelectedTrans(null)} />
      )}
    </div>
  );
}
