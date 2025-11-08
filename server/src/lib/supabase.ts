import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Ensure environment variables from server/.env are loaded when this module is imported.
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

// Expose a server-side Supabase client that uses the service_role key.
// This client MUST only be used server-side (do not expose the service role key to the browser).
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  // Use default fetch; add any server-specific options here
});

export default supabaseAdmin;
