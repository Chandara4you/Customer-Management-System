// feat/supabase-client — M3: Gabriel Antonino
import { supabase } from '../lib/supabase';

const TABLE = 'customer';

/**
 * Fetch all active customers.
 * @returns {{ data: Array|null, error: Error|null }}
 */
export async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('record_status', 'ACTIVE')
      .order('custname', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('getCustomers:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch a single customer by primary key.
 * @param {string|number} custno
 * @returns {{ data: Object|null, error: Error|null }}
 */
export async function getCustomerById(custno) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('custno', custno)
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('getCustomerById:', err);
    return { data: null, error: err };
  }
}

/**
 * Search customers by name (case-insensitive partial match).
 * @param {string} query
 * @returns {{ data: Array|null, error: Error|null }}
 */
export async function searchCustomers(query) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('record_status', 'ACTIVE')
      .ilike('custname', `%${query}%`)
      .order('custname', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('searchCustomers:', err);
    return { data: null, error: err };
  }
}

/**
 * Count customers grouped by payterm.
 * @returns {{ data: Object|null, error: Error|null }}
 *   data = { total, COD, '30D', '45D' }
 */
export async function getCustomerStats() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('payterm')
      .eq('record_status', 'ACTIVE');
    if (error) throw error;

    const total = data.length;
    const counts = data.reduce((acc, row) => {
      const pt = row.payterm ?? 'Other';
      acc[pt] = (acc[pt] ?? 0) + 1;
      return acc;
    }, {});

    return { data: { total, ...counts }, error: null };
  } catch (err) {
    console.error('getCustomerStats:', err);
    return { data: null, error: err };
  }
}

/**
 * Soft-delete a customer (Sprint 2 — placeholder for now).
 * @param {string|number} custno
 * @returns {{ data: Object|null, error: Error|null }}
 */
export async function softDeleteCustomer(custno) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ record_status: 'INACTIVE' })
      .eq('custno', custno)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('softDeleteCustomer:', err);
    return { data: null, error: err };
  }
}

/**
 * Create a new customer (Sprint 2 — placeholder for now).
 * @param {{ custname: string, address: string, payterm: string }} payload
 * @returns {{ data: Object|null, error: Error|null }}
 */
export async function createCustomer(payload) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...payload, record_status: 'ACTIVE' })
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('createCustomer:', err);
    return { data: null, error: err };
  }
}

/**
 * Update an existing customer (Sprint 2 — placeholder for now).
 * @param {string|number} custno
 * @param {Partial<{ custname: string, address: string, payterm: string }>} payload
 * @returns {{ data: Object|null, error: Error|null }}
 */
export async function updateCustomer(custno, payload) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('custno', custno)
      .select()
      .single();
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('updateCustomer:', err);
    return { data: null, error: err };
  }
}
