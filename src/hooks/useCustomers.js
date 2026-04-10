// feat/supabase-client — M3: Gabriel Antonino
import { useState, useEffect, useCallback } from 'react';
import { getCustomers, searchCustomers } from '../services/customerService';

/**
 * Hook for fetching and searching the active customer list.
 * Returns { customers, loading, error, search, refresh }
 */
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [query, setQuery]         = useState('');

  const load = useCallback(async (q = '') => {
    setLoading(true);
    setError(null);
    const { data, error: err } = q.trim()
      ? await searchCustomers(q.trim())
      : await getCustomers();
    if (err) setError(err.message ?? 'Failed to load customers.');
    else setCustomers(data ?? []);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => { load(''); }, [load]);

  const search = useCallback((q) => {
    setQuery(q);
    load(q);
  }, [load]);

  const refresh = useCallback(() => load(query), [load, query]);

  return { customers, loading, error, search, refresh, query };
}
