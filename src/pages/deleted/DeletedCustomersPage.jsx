// feat/ui-deleted-customers — M2: Jomar Auditor
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PAY_TERM_LABELS } from '../../utils/constants';

export default function DeletedCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recovering, setRecovering] = useState(null);

  async function loadDeleted() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('customer')
      .select('custno, custname, address, payterm, stamp')
      .eq('record_status', 'INACTIVE')
      .order('custname');
    if (err) setError(err.message);
    else setCustomers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDeleted();
  }, []);

  async function handleRecover(custno) {
    setRecovering(custno);
    const { error: err } = await supabase
      .from('customer')
      .update({ record_status: 'ACTIVE', stamp: `RECOVERED|${new Date().toISOString()}` })
      .eq('custno', custno);
    setRecovering(null);
    if (err) {
      alert('Failed to recover customer: ' + err.message);
    } else {
      loadDeleted();
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Deleted Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Loading…' : `${customers.length} inactive customer${customers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={loadDeleted} className="btn-secondary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {error && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Cust No.</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Address</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Pay Term</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Stamp</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {[30, 40, 50, 20, 40, 20].map((w, j) => (
                      <td key={j} className="px-6 py-3.5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium text-sm">No deleted customers</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.custno} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                        {c.custno}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-800">{c.custname}</td>
                    <td className="px-6 py-3.5 text-slate-500 hidden md:table-cell">{c.address || '—'}</td>
                    <td className="px-6 py-3.5">
                      <span className="badge-slate">{PAY_TERM_LABELS[c.payterm] || c.payterm}</span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400 font-mono hidden lg:table-cell max-w-[200px] truncate">
                      {c.stamp || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleRecover(c.custno)}
                        disabled={recovering === c.custno}
                        className="btn-primary text-xs"
                      >
                        {recovering === c.custno ? 'Recovering...' : 'Recover'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
