// feat/ui-customer-crud — M2: Jomar Auditor
import { useState } from 'react';
import { createCustomer } from '../../services/customerService';
import { PAY_TERMS } from '../../utils/constants';

export default function AddCustomerModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ custno: '', custname: '', address: '', payterm: 'COD' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.custno || !form.custname) {
      setError('Customer number and name are required');
      return;
    }
    setLoading(true);
    const { error: err } = await createCustomer(form);
    setLoading(false);
    if (err) {
      setError(err.message || 'Failed to create customer');
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Add New Customer</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer No. *</label>
            <input
              type="text"
              name="custno"
              value={form.custno}
              onChange={handleChange}
              placeholder="C0001"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
            <input
              type="text"
              name="custname"
              value={form.custname}
              onChange={handleChange}
              placeholder="Enter customer name"
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Term</label>
            <select name="payterm" value={form.payterm} onChange={handleChange} className="input">
              {Object.keys(PAY_TERMS).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
