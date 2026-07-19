"use client";

import { Space_Grotesk, Manrope } from "next/font/google";
import { useRouter } from "next/navigation";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const STEPS = [
  {
    number: 1,
    text: "Set aside just 10 minutes a day — for anything that matters to you.",
  },
  {
    number: 2,
    text: "Check in and build your streak, one day at a time.",
  },
  {
    number: 3,
    text: "Share your progress with the community and stay motivated.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      className={`${spaceGrotesk.variable} ${manrope.variable} min-h-screen`}
      style={{ background: "#F4F6F5", fontFamily: "var(--font-body)" }}
    >
      <div className="max-w-[560px] mx-auto px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-10">
          <span
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[15px] font-semibold text-[#1C2321] tracking-wide"
          >
            10 minute
          </span>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <svg width="90" height="90" viewBox="0 0 90 90" className="mb-6">
            <circle
              cx="45"
              cy="45"
              r="38"
              fill="none"
              stroke="#E3E7E5"
              strokeWidth="6"
            />
            <circle
              cx="45"
              cy="45"
              r="38"
              fill="none"
              stroke="#2F6F5E"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="180"
              strokeDashoffset="45"
              transform="rotate(-90 45 45)"
            />
          </svg>

          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[30px] font-semibold text-[#1C2321] mb-3 leading-tight"
          >
            Just 10 minutes a day,
            <br />
            change something big.
          </h1>
          <p className="text-[15px] text-[#6B7570] mb-8 max-w-[340px]">
            A small daily habit that, through consistency, makes a real
            difference over time — not alone, but with a community.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/signup")}
              className="bg-[#2F6F5E] text-white border-none px-7 py-3 rounded-lg text-[14px] font-semibold hover:opacity-90 transition-opacity"
            >
              Sign Up
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-transparent text-[#2F6F5E] border border-[#2F6F5E] px-7 py-3 rounded-lg text-[14px] font-semibold hover:bg-[#2F6F5E] hover:text-white transition-colors"
            >
              Login
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl p-7">
          <div
            style={{ fontFamily: "var(--font-display)" }}
            className="text-[13px] font-semibold text-[#6B7570] uppercase tracking-wide mb-5"
          >
            How it works
          </div>
          <div className="flex flex-col gap-4">
            {STEPS.map((step) => (
              <div key={step.number} className="flex gap-3 items-start">
                <div
                  style={{ fontFamily: "var(--font-display)" }}
                  className="bg-[#F4F6F5] text-[#2F6F5E] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                >
                  {step.number}
                </div>
                <div className="text-[14px] text-[#1C2321] pt-0.5">
                  {step.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
