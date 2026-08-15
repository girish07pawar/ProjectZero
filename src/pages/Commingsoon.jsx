import React from "react";
import { useAuth } from "../context/AuthContext";
import { C } from "../components/AuthLayout";

export default function ComingSoon() {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: C.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes pz-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(108,99,255,0.16), transparent)`,
        }}
      />

      <div className="relative text-center max-w-lg">
        <div
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] mb-6 px-3 py-1 rounded-full"
          style={{ color: C.accent, border: `1px solid ${C.border}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: C.accent,
              animation: "pz-pulse 1.6s ease infinite",
            }}
          />
          CHAPTER 2 · LOADING
        </div>

        <h1
          style={{ fontFamily: "Orbitron", color: C.text }}
          className="text-3xl md:text-4xl font-black mb-4"
        >
          Welcome in, {user?.displayName || user?.username || "Player"}.
        </h1>
        <p className="text-sm md:text-base mb-10" style={{ color: C.textDim }}>
          Level {user?.level ?? 1} · {user?.experiencePoints ?? 0} XP ·{" "}
          {user?.storyProgress || "Chapter 1"}
          <br />
          The quest log isn't live yet — this chapter is still being built.
        </p>

        <button
          onClick={logout}
          className="px-5 py-2.5 rounded text-sm font-medium"
          style={{ border: `1px solid ${C.border}`, color: C.text }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
