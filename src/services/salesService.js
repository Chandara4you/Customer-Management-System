// feat/sales-product-api — M1: Christian Adlawan (Sprint 2)
import { supabase } from '../lib/supabase';

export async function getSalesByCustomer(custNo) {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('transNo, salesDate, empNo')
      .eq('custNo', custNo)
      .order('salesDate', { ascending: false });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('getSalesByCustomer:', err);
    return { data: null, error: err };
  }
}

export async function getSalesDetail(transNo) {
  try {
    const { data, error } = await supabase
      .from('salesDetail')
      .select(`
        transNo,
        prodCode,
        quantity,
        product:prodCode (
          description,
          unit
        )
      `)
      .eq('transNo', transNo);
    if (error) throw error;

    // Get current prices for each product
    const prodCodes = [...new Set(data.map(d => d.prodCode))];
    const { data: prices } = await supabase
      .from('priceHist')
      .select('prodCode, unitPrice, effDate')
      .in('prodCode', prodCodes)
      .order('effDate', { ascending: false });

    // Map latest price per product
    const priceMap = {};
    prices?.forEach(p => {
      if (!priceMap[p.prodCode]) priceMap[p.prodCode] = p.unitPrice;
    });

    // Enrich data with prices
    const enriched = data.map(d => ({
      ...d,
      unitPrice: priceMap[d.prodCode] || 0,
      lineTotal: (priceMap[d.prodCode] || 0) * (d.quantity || 0)
    }));

    return { data: enriched, error: null };
  } catch (err) {
    console.error('getSalesDetail:', err);
    return { data: null, error: err };
  }
}
