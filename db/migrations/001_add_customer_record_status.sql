-- db/migrations/001_add_customer_record_status.sql
-- BRANCH: db/customer-record-status-migration (Gabriel B. Antonino — M3)
--
-- Sprint 1 migration: add soft-delete support to the customer table.
-- The column defaults to 'ACTIVE' so all 30 existing seed rows remain visible
-- to CustomerList.jsx, which filters on record_status = 'ACTIVE'.
--
-- To run: open the Supabase project SQL editor and paste this file, or run
-- via psql against the HopePMS database. Idempotent — safe to re-run.

BEGIN;

ALTER TABLE customer
  ADD COLUMN IF NOT EXISTS record_status VARCHAR(8) NOT NULL DEFAULT 'ACTIVE';

-- Enforce the allowed values.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'customer'
      AND constraint_name = 'customer_record_status_check'
  ) THEN
    ALTER TABLE customer
      ADD CONSTRAINT customer_record_status_check
      CHECK (record_status IN ('ACTIVE', 'INACTIVE'));
  END IF;
END $$;

-- Index on record_status so the CustomerList query stays fast as INACTIVE
-- rows accumulate. Customer table is small (~30 rows today) but this keeps
-- the plan stable as sales reconciliation grows it.
CREATE INDEX IF NOT EXISTS idx_customer_record_status
  ON customer (record_status);

-- Safety: explicitly mark all existing rows ACTIVE (the DEFAULT already does
-- this on the ADD COLUMN, but we assert it here for re-runs).
UPDATE customer SET record_status = 'ACTIVE' WHERE record_status IS NULL;

COMMIT;

-- ---------------------------------------------------------------------------
-- Rollback (run manually if you need to revert):
--
-- BEGIN;
--   DROP INDEX IF EXISTS idx_customer_record_status;
--   ALTER TABLE customer DROP CONSTRAINT IF EXISTS customer_record_status_check;
--   ALTER TABLE customer DROP COLUMN IF EXISTS record_status;
-- COMMIT;
-- ---------------------------------------------------------------------------
