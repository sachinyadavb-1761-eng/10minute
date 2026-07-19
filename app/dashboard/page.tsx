"use client";

import { useEffect, useState } from "react";
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

// TODO (next step): yeh dummy data hai — streak check-in system banate waqt
// isko Supabase ke `streaks` table se fetch karenge.
const DUMMY_STREAK_DAYS = 4; // consecutive days
const DUMMY_TOTAL_STRIP = 7; // week strip mein kitne dots dikhane hain

export default function DashboardPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setEmail(data.user.email ?? null);
        setChecking(false);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  // proxy.ts already server-side protect karta hai, yeh sirf client-side
  // flash rokne ke liye hai jab tak user confirm nahi ho jaata
  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F4F6F5" }}
      >
        <span className="text-[14px] text-[#6B7570]">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`${spaceGrotesk.variable} ${manrope.variable} min-h-screen`}
      style={{ background: "#F4F6F5", fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-[480px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[15px] font-semibold text-[#1C2321] tracking-wide"
          >
            10 minute
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#6B7570]">Namaste, {email}</span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-[13px] text-[#6B7570] hover:text-[#1C2321] transition-colors"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>

        {/* Hero — 10 minute ring */}
        <div className="flex flex-col items-center mb-7">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r="78"
              fill="none"
              stroke="#E3E7E5"
              strokeWidth="10"
            />
            <circle
              cx="90"
              cy="90"
              r="78"
              fill="none"
              stroke="#2F6F5E"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="490"
              strokeDashoffset="122"
              transform="rotate(-90 90 90)"
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
            <text
              x="90"
              y="84"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-display)" }}
              fontSize="30"
              fontWeight="600"
              fill="#1C2321"
            >
              7:30
            </text>
            <text
              x="90"
              y="106"
              textAnchor="middle"
              fontSize="12"
              fill="#6B7570"
            >
              of 10:00 left
            </text>
          </svg>

          <button
            className="mt-5 text-[14px] text-[#2F6F5E] font-medium border border-[#2F6F5E] rounded-full px-5 py-2 hover:bg-[#2F6F5E] hover:text-white transition-colors"
            // TODO (next step): yahan click handler lagega jo aaj ka check-in
            // Supabase ke `streaks` table mein record karega.
          >
            Aaj ka 10 minute complete kiya
          </button>
        </div>

        {/* Streak strip */}
        <div className="bg-white rounded-xl px-5 py-4 mb-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] text-[#6B7570]">Streak</span>
            <span
              style={{ fontFamily: "var(--font-display)" }}
              className="text-[15px] font-semibold text-[#E2A33D]"
            >
              {DUMMY_STREAK_DAYS} din
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: DUMMY_TOTAL_STRIP }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded"
                style={{
                  background: i < DUMMY_STREAK_DAYS ? "#2F6F5E" : "#E3E7E5",
                }}
              />
            ))}
          </div>
        </div>

        {/* Community teaser */}
        <button
          className="w-full bg-white rounded-xl px-5 py-4 flex justify-between items-center text-left"
          // TODO: /community page banne ke baad yahan router.push("/community")
        >
          <div>
            <div className="text-[13px] text-[#6B7570] mb-0.5">Community</div>
            <div className="text-[14px] text-[#1C2321]">
              12 log aaj active hain
            </div>
          </div>
          <span className="text-[13px] text-[#2F6F5E]">Dekho →</span>
        </button>
      </div>
    </div>
  );
}
