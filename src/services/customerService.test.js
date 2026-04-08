// src/services/customerService.test.js
// BRANCH: test/sprint1-auth-flows (Trixian Wackyll C. Granado — M5)
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Supabase client so we never touch the network during tests.
vi.mock('../config/supabaseClient.js', () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

import { supabase } from '../config/supabaseClient.js';
import { getCustomers, searchCustomers, createCustomer } from './customerService.js';

const SAMPLE_ROWS = [
  {
    custno: 'C0001',
    custname: 'Globus Medical, Inc',
    address: '2560 Gen Armistead Ave Audubon CA 94031',
    payterm: '30D',
    record_status: 'ACTIVE',
  },
  {
    custno: 'C0003',
    custname: 'Trisha Macdowell',
    address: '7642 Clairemont Mesa Blvd San Diego CA 90321',
    payterm: 'COD',
    record_status: 'ACTIVE',
  },
];

function buildChain(finalResult) {
  // Chain: .from().select().eq().order()  and  .from().select().eq().or().order()
  const order = vi.fn().mockResolvedValue(finalResult);
  const or = vi.fn().mockReturnValue({ order });
  const eq = vi.fn().mockReturnValue({ order, or });
  const select = vi.fn().mockReturnValue({ eq });
  return { select };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('customerService.getCustomers', () => {
  it('returns an array of customers on success', async () => {
    supabase.from.mockReturnValue(buildChain({ data: SAMPLE_ROWS, error: null }));

    const result = await getCustomers();

    expect(supabase.from).toHaveBeenCalledWith('customer');
    expect(result.error).toBeNull();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].custno).toBe('C0001');
  });

  it('returns a mapped error message on failure', async () => {
    supabase.from.mockReturnValue(
      buildChain({ data: null, error: { message: 'connection refused' } })
    );

    const result = await getCustomers();

    expect(result.data).toBeNull();
    expect(result.error).toMatch(/Unable to load customers/i);
  });
});

describe('customerService.searchCustomers', () => {
  it('filters customers by name (ilike) and returns matches', async () => {
    supabase.from.mockReturnValue(
      buildChain({
        data: [SAMPLE_ROWS[0]],
        error: null,
      })
    );

    const result = await searchCustomers('Globus');

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].custname).toMatch(/Globus/i);
  });

  it('falls back to getCustomers() when the query is empty', async () => {
    supabase.from.mockReturnValue(buildChain({ data: SAMPLE_ROWS, error: null }));

    const result = await searchCustomers('   ');

    expect(result.error).toBeNull();
    expect(result.data).toHaveLength(2);
  });
});

describe('customerService.createCustomer — payterm validation', () => {
  it('rejects an invalid payterm before hitting the database', async () => {
    const result = await createCustomer({
      custno: 'C9999',
      custname: 'Test Co',
      address: '123 Test St',
      payterm: '60D',
    });

    expect(result.data).toBeNull();
    expect(result.error).toMatch(/payterm/);
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
