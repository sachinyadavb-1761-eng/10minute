"use client";

import { useState } from "react";
import { Space_Grotesk, Manrope } from "next/font/google";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Login successful — check role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("User not found, please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      setError("Could not fetch role.");
      return;
    }

    if (profile.role === "superadmin") {
      router.push("/superadmin");
    } else if (profile.role === "department_admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div
      className={`${spaceGrotesk.variable} ${manrope.variable} min-h-screen flex items-center justify-center`}
      style={{ background: "#F4F6F5", fontFamily: "var(--font-body)" }}
    >
      <div className="w-full max-w-[380px] px-6">
        <div className="text-center mb-8">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[15px] font-semibold text-[#1C2321] tracking-wide"
          >
            10 minute
          </span>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[22px] font-semibold text-[#1C2321] mb-6"
          >
            Welcome back
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-[#E3E7E5] rounded-lg px-4 py-3 text-[14px] text-[#1C2321] outline-none focus:border-[#2F6F5E] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[#E3E7E5] rounded-lg px-4 py-3 text-[14px] text-[#1C2321] outline-none focus:border-[#2F6F5E] transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2F6F5E] text-white border-none rounded-lg py-3 text-[14px] font-semibold mt-2 hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <p className="text-[13px] text-red-600 text-center mt-1">
                {error}
              </p>
            )}
          </form>

          <p className="text-[13px] text-[#6B7570] text-center mt-6">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-[#2F6F5E] font-medium">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
