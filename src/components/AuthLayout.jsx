import React from "react";

export const C = {
  bg: "#0B0F19",
  bgPanel: "#10152A",
  bgPanelLight: "#161C36",
  primary: "#6C63FF",
  accent: "#00E5FF",
  success: "#22C55E",
  danger: "#EF4444",
  text: "#F8FAFC",
  textDim: "#94A3B8",
  border: "rgba(148,163,184,0.14)",
};

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{ background: C.bg }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,99,255,0.16), transparent)`,
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          {eyebrow && (
            <p
              className="text-[11px] tracking-[0.25em] mb-3"
              style={{ color: C.accent }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            style={{ fontFamily: "Orbitron", color: C.text }}
            className="text-2xl md:text-3xl font-bold"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: C.textDim }}>
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="relative rounded-lg p-7"
          style={{
            background: `linear-gradient(180deg, ${C.bgPanelLight}, ${C.bgPanel})`,
            border: `1px solid ${C.border}`,
            boxShadow: `0 20px 60px -20px rgba(108,99,255,0.35)`,
          }}
        >
          <span
            className="absolute top-[-1px] left-[-1px] w-4 h-4"
            style={{
              borderTop: `2px solid ${C.primary}`,
              borderLeft: `2px solid ${C.primary}`,
            }}
          />
          <span
            className="absolute top-[-1px] right-[-1px] w-4 h-4"
            style={{
              borderTop: `2px solid ${C.primary}`,
              borderRight: `2px solid ${C.primary}`,
            }}
          />
          <span
            className="absolute bottom-[-1px] left-[-1px] w-4 h-4"
            style={{
              borderBottom: `2px solid ${C.primary}`,
              borderLeft: `2px solid ${C.primary}`,
            }}
          />
          <span
            className="absolute bottom-[-1px] right-[-1px] w-4 h-4"
            style={{
              borderBottom: `2px solid ${C.primary}`,
              borderRight: `2px solid ${C.primary}`,
            }}
          />
          {children}
        </div>

        {footer && <div className="text-center mt-6 text-sm">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span
        className="block text-[11px] tracking-wide mb-1.5"
        style={{ color: C.textDim }}
      >
        {label}
      </span>
      <input
        {...props}
        className="w-full px-3.5 py-2.5 rounded text-sm outline-none transition-colors"
        style={{
          background: "rgba(148,163,184,0.06)",
          border: `1px solid ${C.border}`,
          color: C.text,
        }}
        onFocus={(e) => (e.target.style.borderColor = C.accent)}
        onBlur={(e) => (e.target.style.borderColor = C.border)}
      />
    </label>
  );
}

export function SubmitButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="w-full flex items-center justify-center gap-2 py-3 rounded font-medium text-sm mt-2 transition-opacity disabled:opacity-60"
      style={{
        background: C.primary,
        color: "#fff",
        boxShadow: `0 0 24px -8px ${C.primary}`,
      }}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      className="mb-4 px-3.5 py-2.5 rounded text-sm"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: `1px solid ${C.danger}`,
        color: C.danger,
      }}
    >
      {message}
    </div>
  );
}
