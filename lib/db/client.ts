import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors
let _supabaseAdmin: SupabaseClient | null = null;
let _supabasePublic: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      throw new Error(
        "Missing Supabase credentials. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
      );
    }

    _supabaseAdmin = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: fetch,
      },
    });
  }
  return _supabaseAdmin;
}

function getSupabasePublic(): SupabaseClient {
  if (!_supabasePublic) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      throw new Error(
        "Missing Supabase credentials. SUPABASE_URL and SUPABASE_ANON_KEY must be set."
      );
    }

    _supabasePublic = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: fetch,
      },
    });
  }
  return _supabasePublic;
}

// Export getters that initialize on first use
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient];
  },
});

export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabasePublic()[prop as keyof SupabaseClient];
  },
});

