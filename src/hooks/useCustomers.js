// src/hooks/useCustomers.js
// BRANCH: feat/supabase-client (Gabriel B. Antonino — M3)
import { useCallback, useEffect, useState } from 'react';
import { getCustomers } from '../services/customerService.js';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getCustomers();
    if (fetchError) {
      setError(fetchError);
      setCustomers([]);
    } else {
      setCustomers(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: fetchError } = await getCustomers();
      if (cancelled) return;
      if (fetchError) {
        setError(fetchError);
        setCustomers([]);
      } else {
        setCustomers(data ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { customers, loading, error, refetch: fetchData };
}
