import React, { useEffect, useRef, useState } from "react";
import {
  Target,
  Sparkles,
  Trophy,
  BookOpen,
  Users,
  // Github,
  MessageCircle,
  ChevronRight,
  Play,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens (from brief)                                          */
/* ------------------------------------------------------------------ */
const C = {
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

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap');`;

/* ------------------------------------------------------------------ */
/* Particle field canvas                                               */
/* ------------------------------------------------------------------ */
function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h;
    let particles = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(108,99,255,0.55)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - d / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Scroll reveal hook                                                  */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Corner-bracket HUD frame wrapper                                    */
/* ------------------------------------------------------------------ */
function HudFrame({ children, glow = C.primary, style = {} }) {
  const corner = {
    position: "absolute",
    width: 18,
    height: 18,
    borderColor: glow,
  };
  return (
    <div
      className="relative"
      style={{
        background: `linear-gradient(180deg, ${C.bgPanelLight}, ${C.bgPanel})`,
        border: `1px solid ${C.border}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.02), 0 20px 60px -20px rgba(108,99,255,0.35)`,
        ...style,
      }}
    >
      <span
        style={{
          ...corner,
          top: -1,
          left: -1,
          borderTop: `2px solid ${glow}`,
          borderLeft: `2px solid ${glow}`,
        }}
      />
      <span
        style={{
          ...corner,
          top: -1,
          right: -1,
          borderTop: `2px solid ${glow}`,
          borderRight: `2px solid ${glow}`,
        }}
      />
      <span
        style={{
          ...corner,
          bottom: -1,
          left: -1,
          borderBottom: `2px solid ${glow}`,
          borderLeft: `2px solid ${glow}`,
        }}
      />
      <span
        style={{
          ...corner,
          bottom: -1,
          right: -1,
          borderBottom: `2px solid ${glow}`,
          borderRight: `2px solid ${glow}`,
        }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Character Sheet — signature element                                 */
/* ------------------------------------------------------------------ */
function CharacterSheet() {
  const [xpWidth, setXpWidth] = useState(0);
  const targetXp = 12; // 120/1000 -> 12%
  useEffect(() => {
    const t = setTimeout(() => setXpWidth(targetXp), 500);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { label: "SOFTWARE DEV", value: 68 },
    { label: "BUSINESS", value: 22 },
    { label: "FITNESS", value: 41 },
  ];

  return (
    <HudFrame style={{ padding: "22px 22px 24px" }}>
      {/* scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ mixBlendMode: "overlay" }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(180deg, transparent, rgba(0,229,255,0.12), transparent)",
            animation: "pz-scan 5s linear infinite",
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[11px] tracking-[0.2em]"
          style={{ color: C.accent, fontFamily: "Inter" }}
        >
          CHARACTER SHEET
        </span>
        <span
          className="text-[11px] px-2 py-0.5 rounded"
          style={{
            color: C.success,
            border: `1px solid ${C.success}`,
            background: "rgba(34,197,94,0.08)",
          }}
        >
          ● LIVE
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div
            className="text-2xl"
            style={{ fontFamily: "Orbitron", color: C.text, fontWeight: 700 }}
          >
            PLAYER_01
          </div>
          <div className="text-sm mt-1" style={{ color: C.textDim }}>
            Class: <span style={{ color: C.text }}>Software Developer</span>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-3xl leading-none"
            style={{
              fontFamily: "Orbitron",
              color: C.primary,
              fontWeight: 900,
            }}
          >
            LV 1
          </div>
          <div className="text-[11px] mt-1" style={{ color: C.textDim }}>
            Chapter 1 · The Beginning
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div
          className="flex justify-between text-[11px] mb-1"
          style={{ color: C.textDim }}
        >
          <span>CURRENT QUEST</span>
        </div>
        <div
          className="text-sm px-3 py-2 rounded"
          style={{
            background: "rgba(108,99,255,0.08)",
            border: `1px solid ${C.border}`,
            color: C.text,
          }}
        >
          Ship the first working prototype
        </div>
      </div>

      <div className="mt-4">
        <div
          className="flex justify-between text-[11px] mb-1"
          style={{ color: C.textDim }}
        >
          <span>XP</span>
          <span>120 / 1000</span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(148,163,184,0.15)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${xpWidth}%`,
              background: `linear-gradient(90deg, ${C.primary}, ${C.accent})`,
              transition: "width 1.4s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: `0 0 12px ${C.accent}`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className="flex justify-between text-[11px] mb-1"
              style={{ color: C.textDim }}
            >
              <span>{s.label}</span>
              <span>{s.value}%</span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(148,163,184,0.15)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${s.value}%`,
                  background: C.accent,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </HudFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Nav                                                                  */
/* ------------------------------------------------------------------ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      style={{
        background: scrolled ? "rgba(11,15,25,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? `1px solid ${C.border}`
          : "1px solid transparent",
        transition: "all 0.3s ease",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: C.accent, boxShadow: `0 0 10px ${C.accent}` }}
        />
        <span
          style={{
            fontFamily: "Orbitron",
            color: C.text,
            letterSpacing: "0.08em",
          }}
          className="text-sm md:text-base font-bold"
        >
          PROJECT ZERO
        </span>
      </div>
      <div
        className="hidden md:flex items-center gap-8 text-sm"
        style={{ color: C.textDim, fontFamily: "Inter" }}
      >
        {["Story", "Roadmap", "Login"].map((item) => (
          <a key={item} href="#" className="hover:text-white transition-colors">
            {item}
          </a>
        ))}
        <a
          href="#"
          className="px-4 py-2 rounded text-sm font-medium"
          style={{ color: C.bg, background: C.accent }}
        >
          Register
        </a>
      </div>
      <a
        href="#"
        className="md:hidden text-xs px-3 py-1.5 rounded"
        style={{ color: C.bg, background: C.accent }}
      >
        Register
      </a>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-10 pt-28 pb-20">
      <ParticleField />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,99,255,0.18), transparent)`,
        }}
      />
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center w-full">
        <div>
          <div
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] mb-6 px-3 py-1 rounded-full"
            style={{ color: C.accent, border: `1px solid ${C.border}` }}
          >
            <Sparkles size={12} /> THE WORLD'S FIRST REAL-LIFE RPG
          </div>
          <h1
            style={{ fontFamily: "Orbitron", color: C.text, lineHeight: 1.05 }}
            className="text-4xl md:text-6xl font-black"
          >
            One Life.
            <br />
            One Player.
            <br />
            <span style={{ color: C.primary }}>One Mission.</span>
          </h1>
          <p
            className="mt-6 text-base md:text-lg max-w-md"
            style={{ color: C.textDim, fontFamily: "Inter" }}
          >
            A real developer's path to financial freedom, played out in the
            open. Every milestone becomes a quest. Every setback, a boss fight.
            You don't watch this story - you help write it.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded font-medium text-sm"
              style={{
                background: C.primary,
                color: "#fff",
                boxShadow: `0 0 30px -8px ${C.primary}`,
              }}
            >
              Start Journey
              <ChevronRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 rounded font-medium text-sm"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
            >
              <Play size={14} /> Watch Trailer
            </a>
          </div>
        </div>
        <Reveal delay={150}>
          <CharacterSheet />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* What is Project Zero                                                */
/* ------------------------------------------------------------------ */
function WhatIsIt() {
  const rows = [
    "Every real accomplishment becomes XP.",
    "Every real challenge becomes a quest.",
    "Every real milestone unlocks a new chapter.",
  ];
  return (
    <section className="px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <p
            className="text-[11px] tracking-[0.25em] mb-4"
            style={{ color: C.accent }}
          >
            NOT FICTION — A LIVE FEED
          </p>
          <h2
            style={{ fontFamily: "Orbitron", color: C.text }}
            className="text-2xl md:text-4xl font-bold mb-10"
          >
            There is no fictional character here.
          </h2>
        </Reveal>
        <div className="space-y-4">
          {rows.map((r, i) => (
            <Reveal key={r} delay={i * 120}>
              <p
                className="text-lg md:text-xl"
                style={{ color: C.textDim, fontFamily: "Inter" }}
              >
                {r}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                             */
/* ------------------------------------------------------------------ */
function Features() {
  const items = [
    {
      icon: Target,
      title: "Quests",
      desc: "Real objectives — job offers, launches, ships — become missions with real stakes.",
    },
    {
      icon: Sparkles,
      title: "Skill Tree",
      desc: "Software, Business, Finance, Fitness. Skills level up through verified accomplishments.",
    },
    {
      icon: Trophy,
      title: "Achievements",
      desc: "Milestones like funding, releases, and personal records are locked in permanently.",
    },
    {
      icon: BookOpen,
      title: "Story",
      desc: "A living timeline. Every update writes the next page of an unscripted narrative.",
    },
    {
      icon: Users,
      title: "Guild",
      desc: "Join the player's guild. Vote on decisions, mentor, and shape the next chapter.",
    },
  ];
  return (
    <section className="px-6 md:px-10 py-16">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 90}>
            <div
              className="h-full p-5 rounded-lg"
              style={{ background: C.bgPanel, border: `1px solid ${C.border}` }}
            >
              <it.icon size={20} style={{ color: C.accent }} />
              <h3
                className="mt-4 text-sm font-bold tracking-wide"
                style={{ fontFamily: "Orbitron", color: C.text }}
              >
                {it.title.toUpperCase()}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: C.textDim, fontFamily: "Inter" }}
              >
                {it.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap                                                              */
/* ------------------------------------------------------------------ */
function Roadmap() {
  const chapters = [
    {
      n: "01",
      title: "The Beginning",
      desc: "Zero savings. One dream. Ship the first prototype.",
    },
    {
      n: "02",
      title: "The First Victory",
      desc: "First client, first product, first real proof it works.",
    },
    {
      n: "03",
      title: "Building the Empire",
      desc: "Multiple ventures. Real revenue. Real financial freedom.",
    },
    {
      n: "04",
      title: "The Dream House",
      desc: "LA. The mansion. The garage. The legacy chapter.",
    },
  ];
  return (
    <section
      className="px-6 md:px-10 py-24 md:py-32"
      style={{ background: C.bgPanel }}
    >
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <p
            className="text-[11px] tracking-[0.25em] mb-3 text-center"
            style={{ color: C.accent }}
          >
            STORY PROGRESS
          </p>
          <h2
            style={{ fontFamily: "Orbitron", color: C.text }}
            className="text-2xl md:text-4xl font-bold text-center mb-16"
          >
            Roadmap
          </h2>
        </Reveal>
        <div className="relative pl-10">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{
              background: `linear-gradient(180deg, ${C.primary}, transparent)`,
            }}
          />
          {chapters.map((c, i) => (
            <Reveal key={c.n} delay={i * 130}>
              <div className="relative mb-12 last:mb-0">
                <span
                  className="absolute -left-10 top-1 w-3.5 h-3.5 rounded-full"
                  style={{
                    background: i === 0 ? C.accent : C.bg,
                    border: `2px solid ${i === 0 ? C.accent : C.primary}`,
                    boxShadow: i === 0 ? `0 0 12px ${C.accent}` : "none",
                  }}
                />
                <div className="text-[11px] mb-1" style={{ color: C.textDim }}>
                  CHAPTER {c.n}
                </div>
                <h3
                  style={{ fontFamily: "Orbitron", color: C.text }}
                  className="text-lg md:text-xl font-bold"
                >
                  {c.title}
                </h3>
                <p
                  className="mt-1.5 text-sm"
                  style={{ color: C.textDim, fontFamily: "Inter" }}
                >
                  {c.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA + Footer                                                        */
/* ------------------------------------------------------------------ */
function CTA() {
  return (
    <section className="px-6 md:px-10 py-28 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(108,99,255,0.15), transparent)`,
        }}
      />
      <Reveal>
        <p
          className="relative text-[11px] tracking-[0.25em] mb-4"
          style={{ color: C.accent }}
        >
          THOUSANDS OF PLAYERS. ONE STORY.
        </p>
        <h2
          style={{ fontFamily: "Orbitron", color: C.text }}
          className="relative text-3xl md:text-5xl font-black mb-8"
        >
          Ready to witness the journey?
        </h2>
        <a
          href="#"
          className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded font-medium"
          style={{
            background: C.accent,
            color: C.bg,
            boxShadow: `0 0 40px -10px ${C.accent}`,
          }}
        >
          Create Account <ChevronRight size={16} />
        </a>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
      style={{ borderTop: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: C.accent }}
        />
        <span
          style={{ fontFamily: "Orbitron", color: C.textDim }}
          className="text-xs"
        >
          PROJECT ZERO © 2026
        </span>
      </div>
      <div
        className="flex items-center gap-6 text-sm"
        style={{ color: C.textDim, fontFamily: "Inter" }}
      >
        <a
          href="#"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {/* <Github size={14} /> GitHub */}
        </a>
        <a
          href="#"
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <MessageCircle size={14} /> Discord
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-white transition-colors">
          Terms
        </a>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */
export default function ProjectZeroLanding() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        ${FONT_IMPORT}
        * { font-family: 'Inter', sans-serif; }
        @keyframes pz-scan {
          0% { transform: translateY(-120%); }
          100% { transform: translateY(320%); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
      <Nav />
      <Hero />
      <WhatIsIt />
      <Features />
      <Roadmap />
      <CTA />
      <Footer />
    </div>
  );
}
