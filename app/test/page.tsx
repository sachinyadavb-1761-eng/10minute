import { supabase } from "../lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase.auth.getSession();

  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: "red" }}>Error: {error.message}</p>
      ) : (
        <p style={{ color: "green" }}>✅ Supabase connected successfully!</p>
      )}
    </div>
  );
}
