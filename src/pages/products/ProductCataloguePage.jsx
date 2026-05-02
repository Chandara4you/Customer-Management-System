// feat/ui-product-catalogue — M2: Jomar Auditor
import { useState, useEffect, useMemo } from 'react';
import { getProducts, getCurrentPrices } from '../../services/productService';

export default function ProductCataloguePage() {
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [prodRes, priceRes] = await Promise.all([
        getProducts(),
        getCurrentPrices()
      ]);
      if (prodRes.error) setError(prodRes.error.message);
      else setProducts(prodRes.data || []);
      if (!priceRes.error) setPrices(priceRes.data || {});
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.prodCode?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Product Catalogue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="badge-amber">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Only
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {/* Search */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input pl-9 text-sm"
            />
          </div>
        </div>

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
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Product Code</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Current Price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {[30, 50, 20, 25].map((w, j) => (
                      <td key={j} className="px-6 py-3.5">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${w}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium text-sm">
                        {search ? `No products match "${search}"` : 'No products found'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const priceInfo = prices[p.prodCode];
                  return (
                    <tr key={p.prodCode} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                          {p.prodCode}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">{p.description}</td>
                      <td className="px-6 py-3.5 text-slate-600">{p.unit || '—'}</td>
                      <td className="px-6 py-3.5 text-right">
                        {priceInfo ? (
                          <div>
                            <p className="font-semibold text-brand-600">₱{priceInfo.unitPrice.toFixed(2)}</p>
                            <p className="text-xs text-slate-400">
                              as of {new Date(priceInfo.effDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
