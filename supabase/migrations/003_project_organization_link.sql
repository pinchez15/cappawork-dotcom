-- Project Organization Link and Invite Tracking
-- This migration adds organization_id to projects and creates invite tracking

-- Add organization_id to projects table for linking projects to client organizations
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_projects_organization_id ON public.projects(organization_id);

-- Invite tracking table
CREATE TABLE IF NOT EXISTS public.organization_invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  clerk_invitation_id text UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for invite tracking
CREATE INDEX IF NOT EXISTS idx_organization_invites_org_id ON public.organization_invites(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_invites_email ON public.organization_invites(email);
CREATE INDEX IF NOT EXISTS idx_organization_invites_clerk_id ON public.organization_invites(clerk_invitation_id);
CREATE INDEX IF NOT EXISTS idx_organization_invites_status ON public.organization_invites(status);

-- Enable RLS
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- RLS Policy (service role access)
CREATE POLICY "Service role full access organization_invites" ON public.organization_invites
  FOR ALL USING (true) WITH CHECK (true);
