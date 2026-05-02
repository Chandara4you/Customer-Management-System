// feat/sales-product-api — M1: Christian Adlawan (Sprint 2)
import { supabase } from '../lib/supabase';

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('product')
      .select('prodCode, description, unit')
      .order('prodCode');
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('getProducts:', err);
    return { data: null, error: err };
  }
}

export async function getCurrentPrices() {
  try {
    // Get latest price per product
    const { data, error } = await supabase
      .from('priceHist')
      .select('prodCode, unitPrice, effDate')
      .order('effDate', { ascending: false });
    if (error) throw error;

    // Map to latest price per product
    const priceMap = {};
    data?.forEach(p => {
      if (!priceMap[p.prodCode]) {
        priceMap[p.prodCode] = { unitPrice: p.unitPrice, effDate: p.effDate };
      }
    });

    return { data: priceMap, error: null };
  } catch (err) {
    console.error('getCurrentPrices:', err);
    return { data: null, error: err };
  }
}
