-- Create user table for authentication
-- Sprint 1: User authentication and authorization

CREATE TABLE IF NOT EXISTS public.user (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL DEFAULT 'USER' CHECK (user_type IN ('USER', 'ADMIN', 'SUPERADMIN')),
  record_status TEXT NOT NULL DEFAULT 'INACTIVE' CHECK (record_status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own row
CREATE POLICY "Users can view own profile" ON public.user
  FOR SELECT USING (auth.uid() = id);
