-- auth trigger — M4: Wayne Andy Villamor
-- Sprint 1: Provision new users as USER / INACTIVE on every Google OAuth or email sign-up.
-- Run in Supabase SQL Editor after M3's migration.

CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user (id, user_type, record_status)
  VALUES (NEW.id, 'USER', 'INACTIVE')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop old trigger if it exists, then re-create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.provision_new_user();
