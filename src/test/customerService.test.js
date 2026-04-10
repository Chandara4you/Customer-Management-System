// test/sprint1-auth-flows — M5: Trixian Wackyll Granado
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCustomers, getCustomerById, searchCustomers, getCustomerStats } from '../services/customerService';
import { supabase } from '../lib/supabase';

const MOCK_CUSTOMERS = [
  { custno: 1, custname: 'Dela Cruz Enterprises', address: 'Manila', payterm: 'COD',  record_status: 'ACTIVE' },
  { custno: 2, custname: 'Santos Trading',        address: 'Cebu',   payterm: '30D', record_status: 'ACTIVE' },
  { custno: 3, custname: 'Reyes Corp',             address: 'Davao',  payterm: '45D', record_status: 'ACTIVE' },
];

function mockChain(resolved) {
  const chain = {
    select:  vi.fn().mockReturnThis(),
    eq:      vi.fn().mockReturnThis(),
    ilike:   vi.fn().mockReturnThis(),
    order:   vi.fn().mockResolvedValue(resolved),
    single:  vi.fn().mockResolvedValue(resolved),
  };
  supabase.from.mockReturnValue(chain);
  return chain;
}

describe('customerService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getCustomers()', () => {
    it('returns data on success', async () => {
      mockChain({ data: MOCK_CUSTOMERS, error: null });
      const { data, error } = await getCustomers();
      expect(error).toBeNull();
      expect(data).toHaveLength(3);
    });

    it('returns error on Supabase failure', async () => {
      mockChain({ data: null, error: { message: 'DB error' } });
      const { data, error } = await getCustomers();
      expect(data).toBeNull();
      expect(error).toBeTruthy();
    });
  });

  describe('getCustomerById()', () => {
    it('returns a single customer', async () => {
      mockChain({ data: MOCK_CUSTOMERS[0], error: null });
      const { data, error } = await getCustomerById(1);
      expect(error).toBeNull();
      expect(data.custname).toBe('Dela Cruz Enterprises');
    });
  });

  describe('searchCustomers()', () => {
    it('passes the query as ilike filter', async () => {
      const chain = mockChain({ data: [MOCK_CUSTOMERS[0]], error: null });
      await searchCustomers('dela');
      expect(chain.ilike).toHaveBeenCalledWith('custname', '%dela%');
    });
  });

  describe('getCustomerStats()', () => {
    it('correctly aggregates payterm counts', async () => {
      // Override order() to return payterm-only rows
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockResolvedValue({
          data: [
            { payterm: 'COD' },
            { payterm: 'COD' },
            { payterm: '30D' },
          ],
          error: null,
        }),
      };
      supabase.from.mockReturnValue(chain);

      const { data, error } = await getCustomerStats();
      expect(error).toBeNull();
      expect(data.total).toBe(3);
      expect(data.COD).toBe(2);
      expect(data['30D']).toBe(1);
    });
  });
});
