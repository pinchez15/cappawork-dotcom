import { createClient } from "@supabase/supabase-js";

// Admin client (service role) - server-only
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: fetch,
    },
  }
);

// Public client (anon key) - for public blog reads only
export const supabasePublic = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: fetch,
    },
  }
);

