// feat/ui-customer-crud — M2: Jomar Auditor
import { useState } from 'react';
import { softDeleteCustomer } from '../../services/customerService';

export default function SoftDeleteConfirmDialog({ customer, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    const { error: err } = await softDeleteCustomer(customer.custno);
    setLoading(false);
    if (err) {
      setError(err.message || 'Failed to delete customer');
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="card max-w-md w-full animate-scale-in">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-red-600">Delete Customer</h2>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          <p className="text-slate-700">
            Are you sure you want to delete <span className="font-semibold">{customer.custname}</span>?
          </p>
          <p className="text-sm text-slate-500">
            This will soft-delete the customer (set record_status to INACTIVE). The customer will be hidden from regular views but can be recovered by ADMIN or SUPERADMIN.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleConfirm} disabled={loading} className="btn-danger flex-1">
              {loading ? 'Deleting...' : 'Delete Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
