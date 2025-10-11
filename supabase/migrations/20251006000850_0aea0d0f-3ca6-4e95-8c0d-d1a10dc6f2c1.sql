-- Enable RLS on invites table
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view invites
CREATE POLICY "Admins can view invites"
  ON public.invites
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can create invites
CREATE POLICY "Admins can create invites"
  ON public.invites
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update invites
CREATE POLICY "Admins can update invites"
  ON public.invites
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete invites
CREATE POLICY "Admins can delete invites"
  ON public.invites
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));