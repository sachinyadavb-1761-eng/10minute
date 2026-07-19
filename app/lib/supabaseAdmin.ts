import { createClient } from "@supabase/supabase-js";

// ⚠️ Ye client SIRF server-side code mein use hoga (API routes)
// Iska service role key RLS ko bypass kar deta hai — kabhi bhi
// client-side component mein import mat karna

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export default supabaseAdmin;
