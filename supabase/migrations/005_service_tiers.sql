-- Add service tier column to projects table
-- Tiers: internal_tool ($9,900), scale_ready ($14,900), commercial_product ($24,900)

ALTER TABLE public.projects
ADD COLUMN service_tier text
CHECK (service_tier IN ('internal_tool', 'scale_ready', 'commercial_product'));

-- Add comment for documentation
COMMENT ON COLUMN public.projects.service_tier IS 'Service tier determines the project template and scope: internal_tool, scale_ready, or commercial_product';
