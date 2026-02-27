-- Add service tier column to projects table
-- Tiers: portal_build ($10K), diagnostic ($30K), implementation ($50K+)

ALTER TABLE public.projects
ADD COLUMN service_tier text
CHECK (service_tier IN ('portal_build', 'diagnostic', 'implementation'));

-- Add comment for documentation
COMMENT ON COLUMN public.projects.service_tier IS 'Service tier: portal_build ($10K), diagnostic ($30K Phase I), implementation ($50K+ Phase II)';
