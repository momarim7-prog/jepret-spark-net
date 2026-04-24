-- Fix function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Replace broad SELECT with: anyone can SELECT specific paths but listing is restricted to owner
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;

-- Anyone can read individual avatar files (needed for <img src=publicUrl>)
-- but listing requires ownership. Public buckets serve via CDN regardless.
CREATE POLICY "Users can list own avatar files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );