"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

type Department = {
  id: string;
  name: string;
};

export default function SuperadminPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [newDeptName, setNewDeptName] = useState("");
  const [message, setMessage] = useState("");

  // Team member form
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [memberRole, setMemberRole] = useState("user");
  const [memberDept, setMemberDept] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const { data } = await supabase.from("departments").select("*");
    if (data) setDepartments(data);
  };

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase
      .from("departments")
      .insert({ name: newDeptName });

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Department created!");
      setNewDeptName("");
      fetchDepartments();
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setCreating(true);

    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: memberEmail,
        password: memberPassword,
        role: memberRole,
        department_id: memberRole === "superadmin" ? null : memberDept,
      }),
    });

    const result = await res.json();
    setCreating(false);

    if (!res.ok) {
      setMessage("Error: " + result.error);
    } else {
      setMessage("Team member created successfully!");
      setMemberEmail("");
      setMemberPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Superadmin Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {message && <p>{message}</p>}

      <hr style={{ margin: "20px 0" }} />

      <h2>Create Department</h2>
      <form onSubmit={handleCreateDept} style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Department name"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h3>Existing Departments:</h3>
      <ul>
        {departments.map((d) => (
          <li key={d.id}>{d.name}</li>
        ))}
      </ul>

      <hr style={{ margin: "20px 0" }} />

      <h2>Add Team Member</h2>
      <form
        onSubmit={handleCreateMember}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          placeholder="Email"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={memberPassword}
          onChange={(e) => setMemberPassword(e.target.value)}
          required
        />
        <select
          value={memberRole}
          onChange={(e) => setMemberRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="department_admin">Department Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>

        {memberRole !== "superadmin" && (
          <select
            value={memberDept}
            onChange={(e) => setMemberDept(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Member"}
        </button>
      </form>
    </div>
  );
}
