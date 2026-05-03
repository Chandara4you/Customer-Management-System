// feat/ui-customer-crud — M2: Jomar Auditor
import { useState } from 'react';
import { updateCustomer } from '../../services/customerService';
import { PAY_TERMS } from '../../utils/constants';

export default function EditCustomerModal({ customer, onClose, onSuccess }) {
  const [form, setForm] = useState({
    custname: customer.custname || '',
    address: customer.address || '',
    payterm: customer.payterm || 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!form.custname) {
      setError('Customer name is required');
      return;
    }
    setLoading(true);
    const { error: err } = await updateCustomer(customer.custno, form);
    setLoading(false);
    if (err) {
      setError(err.message || 'Failed to update customer');
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Edit Customer</h2>
          <p className="text-sm text-slate-500 mt-0.5">Customer No: {customer.custno}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
            <input
              type="text"
              name="custname"
              value={form.custname}
              onChange={handleChange}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
