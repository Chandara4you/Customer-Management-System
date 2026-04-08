// src/services/customerService.js
// BRANCH: feat/supabase-client (Gabriel B. Antonino — M3)
// All functions return { data, error }. Raw Supabase errors are never thrown.
import { supabase } from '../config/supabaseClient.js';
import { PAY_TERMS, RECORD_STATUSES } from '../utils/constants.js';

const TABLE = 'customer';

/**
 * Fetch all ACTIVE customers ordered by custno ASC.
 * Soft-deleted (INACTIVE) customers are excluded.
 */
export async function getCustomers() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('record_status', RECORD_STATUSES.ACTIVE)
      .order('custno', { ascending: true });

    if (error) {
      console.error('getCustomers:', error.message);
      return { data: null, error: 'Unable to load customers. Please try again.' };
    }
    return { data: data ?? [], error: null };
  } catch (err) {
    console.error('getCustomers:', err);
    return { data: null, error: 'Unexpected error while loading customers.' };
  }
}

/**
 * Fetch a single customer by primary key.
 */
export async function getCustomerById(custno) {
  try {
    if (!custno || typeof custno !== 'string') {
      return { data: null, error: 'Invalid customer number.' };
    }
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('custno', custno)
      .maybeSingle();

    if (error) {
      console.error('getCustomerById:', error.message);
      return { data: null, error: 'Unable to load customer details.' };
    }
    if (!data) {
      return { data: null, error: 'Customer not found.' };
    }
    return { data, error: null };
  } catch (err) {
    console.error('getCustomerById:', err);
    return { data: null, error: 'Unexpected error while loading customer.' };
  }
}

/**
 * Create a customer. Sprint 2 — exported now so Sprint 2 branches can import it
 * without re-touching this file. Validates payterm against the allowed set.
 */
export async function createCustomer(payload) {
  try {
    if (!payload || !PAY_TERMS.includes(payload.payterm)) {
      return { data: null, error: `payterm must be one of ${PAY_TERMS.join(', ')}.` };
    }
    const { data, error } = await supabase
      .from(TABLE)
      .insert([{ ...payload, record_status: RECORD_STATUSES.ACTIVE }])
      .select()
      .single();

    if (error) {
      console.error('createCustomer:', error.message);
      return { data: null, error: 'Unable to create customer.' };
    }
    return { data, error: null };
  } catch (err) {
    console.error('createCustomer:', err);
    return { data: null, error: 'Unexpected error while creating customer.' };
  }
}

/**
 * Update a customer by primary key. Sprint 2.
 */
export async function updateCustomer(custno, payload) {
  try {
    if (!custno) {
      return { data: null, error: 'Invalid customer number.' };
    }
    if (payload?.payterm && !PAY_TERMS.includes(payload.payterm)) {
      return { data: null, error: `payterm must be one of ${PAY_TERMS.join(', ')}.` };
    }
    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('custno', custno)
      .select()
      .single();

    if (error) {
      console.error('updateCustomer:', error.message);
      return { data: null, error: 'Unable to update customer.' };
    }
    return { data, error: null };
  } catch (err) {
    console.error('updateCustomer:', err);
    return { data: null, error: 'Unexpected error while updating customer.' };
  }
}

/**
 * Soft-delete a customer by setting record_status = 'INACTIVE'.
 * Preserves downstream FK integrity with the sales table.
 */
export async function softDeleteCustomer(custno) {
  try {
    if (!custno) {
      return { data: null, error: 'Invalid customer number.' };
    }
    const { data, error } = await supabase
      .from(TABLE)
      .update({ record_status: RECORD_STATUSES.INACTIVE })
      .eq('custno', custno)
      .select()
      .single();

    if (error) {
      console.error('softDeleteCustomer:', error.message);
      return { data: null, error: 'Unable to delete customer.' };
    }
    return { data, error: null };
  } catch (err) {
    console.error('softDeleteCustomer:', err);
    return { data: null, error: 'Unexpected error while deleting customer.' };
  }
}

/**
 * Search ACTIVE customers by name or address using case-insensitive LIKE.
 */
export async function searchCustomers(query) {
  try {
    const term = (query ?? '').trim();
    if (!term) {
      return getCustomers();
    }
    const pattern = `%${term}%`;
    const { data, error } = await supabase
      .from(TABLE)
      .select('custno, custname, address, payterm, record_status')
      .eq('record_status', RECORD_STATUSES.ACTIVE)
      .or(`custname.ilike.${pattern},address.ilike.${pattern}`)
      .order('custno', { ascending: true });

    if (error) {
      console.error('searchCustomers:', error.message);
      return { data: null, error: 'Search failed. Please try again.' };
    }
    return { data: data ?? [], error: null };
  } catch (err) {
    console.error('searchCustomers:', err);
    return { data: null, error: 'Unexpected error during search.' };
  }
}
