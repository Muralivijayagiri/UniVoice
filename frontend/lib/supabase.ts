import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

/**
 * Checks whether the Supabase public credentials are configured in the environment.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url === null || url === undefined || url.trim() === "") {
    return false;
  }
  if (anonKey === null || anonKey === undefined || anonKey.trim() === "") {
    return false;
  }
  if (
    url.includes("placeholder-project") ||
    anonKey.includes("dummy-anon-key")
  ) {
    return false;
  }

  return true;
}

/**
 * Returns true only when Supabase Row Level Security has been verified for the
 * live student, scholarship, admissions, and library tables.
 *
 * The Scholarship Section, Admissions Department, and Library Administration
 * must not query live rows while RLS is unresolved; they use local demo
 * datasets instead until this flag is `true`.
 */
export function isSupabaseRlsResolved(): boolean {
  return process.env.NEXT_PUBLIC_SUPABASE_RLS_RESOLVED === "true";
}

/**
 * Returns a singleton instance of the Supabase client initialized with anon credentials.
 * Throws a descriptive error if required environment variables are not found.
 *
 * NOTE: Never pass or use the service-role key in client or front-facing modules.
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance !== null) {
    return clientInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    supabaseUrl === null ||
    supabaseUrl === undefined ||
    supabaseUrl.trim() === ""
  ) {
    throw new Error(
      "Supabase client initialization failed: Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please set it in .env.local."
    );
  }

  if (
    supabaseAnonKey === null ||
    supabaseAnonKey === undefined ||
    supabaseAnonKey.trim() === ""
  ) {
    throw new Error(
      "Supabase client initialization failed: Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please set it in .env.local."
    );
  }

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return clientInstance;
}
