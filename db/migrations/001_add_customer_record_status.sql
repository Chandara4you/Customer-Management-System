-- db/customer-record-status-migration — M3: Gabriel Antonino
-- Sprint 1: Add record_status to the customer table (soft-delete support)
-- Run this in Supabase SQL Editor BEFORE deploying the frontend.

ALTER TABLE customer
  ADD COLUMN IF NOT EXISTS record_status VARCHAR(8)
    NOT NULL DEFAULT 'ACTIVE'
    CHECK (record_status IN ('ACTIVE', 'INACTIVE'));

-- Backfill: mark all existing rows as ACTIVE
UPDATE customer SET record_status = 'ACTIVE' WHERE record_status IS NULL;

-- Verify
SELECT custno, custname, record_status FROM customer LIMIT 10;
