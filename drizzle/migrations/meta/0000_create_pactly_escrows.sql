CREATE TABLE public.escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_name TEXT NOT NULL,
  beneficiary_initials TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 50),
  currency TEXT NOT NULL DEFAULT 'USDC',
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('github', 'figma', 'staging')),
  trigger_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'disbursed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  disbursed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.escrows TO anon, authenticated;
GRANT ALL ON public.escrows TO service_role;
ALTER TABLE public.escrows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo users can view escrows" ON public.escrows FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Demo users can create escrows" ON public.escrows FOR INSERT TO anon, authenticated WITH CHECK (amount >= 50 AND amount <= 1000);
CREATE POLICY "Demo users can update escrow status" ON public.escrows FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (status IN ('locked', 'disbursed'));
CREATE INDEX escrows_created_at_idx ON public.escrows (created_at DESC);
CREATE INDEX escrows_status_idx ON public.escrows (status);
INSERT INTO public.escrows (id, beneficiary_name, beneficiary_initials, title, description, amount, trigger_type, trigger_label, status, created_at, disbursed_at) VALUES
  ('11111111-1111-4111-8111-111111111111', 'Jessica Miles', 'JM', 'GitHub PR #42', 'Product build', 727.00, 'github', 'GitHub PR #42 Merged', 'locked', '2026-09-22T12:00:00Z', NULL),
  ('22222222-2222-4222-8222-222222222222', 'Northstar Labs', 'NL', 'Mobile design system', 'Figma', 240.00, 'figma', 'Figma Design Approved', 'disbursed', '2026-09-18T12:00:00Z', '2026-09-18T15:30:00Z'),
  ('33333333-3333-4333-8333-333333333333', 'Arlo Studio', 'AS', 'Staging deployment', 'Health check', 860.00, 'staging', 'Staging Health-check Passed', 'locked', '2026-09-15T12:00:00Z', NULL);