"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

type TeamMember = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);

    // RLS policy khud handle karega ki sirf apne department wale users dikhein
    const { data, error } = await supabase
      .from("users")
      .select("id, email, role");

    if (error) {
      setError(error.message);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Department Admin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Team Members (Your Department)</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.email} — <strong>{m.role}</strong>
          </li>
        ))}
      </ul>

      {!loading && members.length === 0 && (
        <p>Abhi tak koi team member nahi hai is department mein.</p>
      )}
    </div>
  );
}
