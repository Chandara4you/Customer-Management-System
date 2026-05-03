// feat/ui-customer-detail — M2: Jomar Auditor
import { useState, useEffect } from 'react';
import { getSalesDetail } from '../../services/salesService';

export default function SalesDetailModal({ transNo, onClose }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      const { data, error: err } = await getSalesDetail(transNo);
      if (err) setError(err.message);
      else setDetails(data || []);
      setLoading(false);
    }
    load();
  }, [transNo]);

  const total = details.reduce((sum, d) => sum + (d.lineTotal || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-3xl w-full max-h-[80vh] flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sales Detail</h2>
            <p className="text-sm text-slate-500 mt-0.5">Transaction: {transNo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          ) : details.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No line items found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase">Product</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Qty</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Unit Price</th>
                  <th className="pb-3 text-xs font-semibold text-slate-500 uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-slate-800">{d.product?.description || d.prodCode}</p>
                        <p className="text-xs text-slate-500">{d.prodCode} • {d.product?.unit || '—'}</p>
                      </div>
                    </td>
                    <td className="py-3 text-right text-slate-700">{d.quantity}</td>
                    <td className="py-3 text-right text-slate-700">₱{d.unitPrice.toFixed(2)}</td>
                    <td className="py-3 text-right font-medium text-slate-900">₱{d.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td colSpan={3} className="pt-3 text-right font-semibold text-slate-700">Grand Total:</td>
                  <td className="pt-3 text-right font-bold text-brand-600 text-base">₱{total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
