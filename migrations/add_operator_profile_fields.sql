-- Migration: add_operator_profile_fields
-- Fixes BUG-004: Operator creation 500 error
-- Adds missing profile fields to operators table

ALTER TABLE commandcentered.operators
ADD COLUMN IF NOT EXISTS primary_role TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'commandcentered'
  AND table_name = 'operators'
  AND column_name IN ('primary_role', 'bio', 'portfolio_url');
