# CappaWork Client Portal - Setup Guide

## Overview

This implementation transforms CappaWork.com into a comprehensive client portal and project management system. All features are built and ready to use.

## What's Been Implemented

### ✅ Foundation
- Database schema with all tables (projects, tasks, secrets, URLs, design, blog)
- Clerk authentication setup with middleware
- Supabase client configuration
- Auth guards (requireAdmin, requireProjectAccess)
- Secrets encryption service

### ✅ Admin Dashboard
- Project list and CRUD operations
- Kanban board with drag-and-drop
- PRD rich text editor
- Secrets vault with encryption
- URLs management
- Design specifications viewer
- Blog post management (create, edit, publish)

### ✅ Client Portal
- Scoped project access (clients only see their projects)
- Read-only kanban progress view
- Design selection wizard (3-step onboarding)
- Handoff page with credential access
- Project URLs viewer

### ✅ Blog System
- Admin blog editor with TipTap
- Public blog routes updated to use Supabase
- TipTap content renderer

## Next Steps

### 1. Install Dependencies

```bash
cd cappawork-dotcom
pnpm install
```

This will install:
- @clerk/nextjs
- @supabase/supabase-js
- svix
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- @tiptap/react, @tiptap/starter-kit, @tiptap/html, and extensions

### 2. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Run the migration:
   ```bash
   # In Supabase dashboard, go to SQL Editor and run:
   # Copy contents from supabase/migrations/001_schema.sql
   ```
3. Get your Supabase credentials:
   - Project URL
   - Anon key (for public reads)
   - Service role key (for server-side operations)

### 3. Set Up Clerk

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Configure webhook:
   - Endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`
4. Get your Clerk keys:
   - Publishable key
   - Secret key
   - Webhook secret

### 4. Environment Variables

Add these to your `.env.local` (and Vercel):

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Encryption (for secrets vault)
# Generate a 32-byte hex key: openssl rand -hex 32
ENCRYPTION_KEY=your-32-byte-hex-key-here
```

### 5. Set Yourself as Admin

After your first login with Clerk, you need to mark your profile as admin:

```sql
-- In Supabase SQL Editor, run:
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### 6. Deploy

1. Push to GitHub
2. Connect to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

### 7. Configure Clerk Webhook

After deployment, update your Clerk webhook URL to point to:
`https://your-domain.com/api/webhooks/clerk`

## Features Overview

### Admin Features (`/admin`)
- **Dashboard**: View all projects
- **Project Editor**: Full project management with kanban, PRD, secrets, URLs
- **Blog Manager**: Create and edit blog posts with rich text editor

### Client Features (`/projects`)
- **Project List**: See only projects they're invited to
- **Progress View**: Read-only kanban showing build status
- **Design Wizard**: 3-step onboarding to select theme, colors, fonts
- **Handoff**: Access all credentials when project is complete

### Public Features
- **Blog**: Public blog listing and posts (now powered by Supabase)

## Database Schema

All tables are created with proper relationships:
- `profiles` - Users (synced from Clerk)
- `projects` - Client projects
- `project_members` - Access control (links clients to projects)
- `project_phases` - Kanban columns
- `project_tasks` - Kanban cards
- `project_secrets` - Encrypted API keys
- `project_urls` - Project links
- `project_design` - Client design selections
- `design_themes` - Predefined themes
- `blog_posts` - Blog content

## Security Notes

- All secrets are encrypted with AES-256-GCM
- Clients can only access projects they're members of
- Admin access is controlled via `is_admin` flag in profiles
- Service role key is server-only (never exposed to client)

## Migration from Sanity

The blog system has been migrated from Sanity to Supabase. The old Sanity code can be removed if desired, but it won't interfere with the new system.

## Support

If you encounter issues:
1. Check that all environment variables are set
2. Verify Supabase migration ran successfully
3. Ensure Clerk webhook is configured
4. Check browser console and server logs for errors

