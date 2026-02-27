-- Update service tier values from old software dev tiers to new consultancy tiers
-- Old: internal_tool, scale_ready, commercial_product
-- New: portal_build ($10K), diagnostic ($30K), implementation ($50K+)

-- 1. Drop the old CHECK constraint
ALTER TABLE public.projects
DROP CONSTRAINT IF EXISTS projects_service_tier_check;

-- 2. Migrate any existing data to new tier values
UPDATE public.projects SET service_tier = 'portal_build' WHERE service_tier = 'internal_tool';
UPDATE public.projects SET service_tier = 'diagnostic' WHERE service_tier = 'scale_ready';
UPDATE public.projects SET service_tier = 'implementation' WHERE service_tier = 'commercial_product';

-- 3. Add new CHECK constraint with updated tier values
ALTER TABLE public.projects
ADD CONSTRAINT projects_service_tier_check
CHECK (service_tier IN ('portal_build', 'diagnostic', 'implementation'));

-- Update comment
COMMENT ON COLUMN public.projects.service_tier IS 'Service tier: portal_build ($10K), diagnostic ($30K Phase I), implementation ($50K+ Phase II)';
