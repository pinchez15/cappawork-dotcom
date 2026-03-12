"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

type Props = {
  active: boolean;
  dealName?: string;
  onComplete: () => void;
};

// Gold, green, blue, white, amber, pink — victory colors
const COLORS = ["#FFD700", "#22c55e", "#3b82f6", "#ffffff", "#f59e0b", "#ec4899"];
const GOLD = ["#FFD700", "#f59e0b", "#ffffff"];
const NEON = ["#00ff87", "#60efff", "#ff00e5", "#ffd700", "#ff3d00"];

// ─── Confetti helpers ───────────────────────────────────────────────

function fireCannons() {
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: COLORS, scalar: 1.2 });
  confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: COLORS });
  confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: COLORS });
}

function fireStars() {
  confetti({
    particleCount: 30, spread: 360, ticks: 100, gravity: 0, decay: 0.94,
    startVelocity: 20, shapes: ["star"], colors: GOLD, scalar: 1.5,
    origin: { x: Math.random(), y: Math.random() * 0.5 },
  });
}

function fireRain() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 40, startVelocity: 0, ticks: 300,
        origin: { x: Math.random(), y: -0.1 }, colors: COLORS,
        gravity: 0.6, scalar: 0.8, drift: (Math.random() - 0.5) * 2,
      });
    }, i * 200);
  }
}

// THE DROP — absolute chaos
function fireMegaDrop() {
  // Massive center explosion
  confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 }, colors: NEON, scalar: 1.8, startVelocity: 60 });
  // Double side cannons
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0, y: 0.5 + i * 0.15 }, colors: NEON, startVelocity: 55 });
      confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1, y: 0.5 + i * 0.15 }, colors: NEON, startVelocity: 55 });
    }, i * 150);
  }
  // Star shower
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 50, spread: 360, ticks: 120, gravity: 0.3, decay: 0.92,
        startVelocity: 35, shapes: ["star"], colors: GOLD, scalar: 2,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
      });
    }, i * 100);
  }
  // Top rain burst
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 60, startVelocity: 5, ticks: 400,
        origin: { x: i / 10, y: -0.1 }, colors: NEON,
        gravity: 0.8, scalar: 1.2,
      });
    }, i * 80);
  }
}

// Firework burst at random position
function fireFirework() {
  const x = 0.1 + Math.random() * 0.8;
  const y = 0.1 + Math.random() * 0.4;
  confetti({
    particleCount: 80, spread: 360, ticks: 80, gravity: 0.4,
    decay: 0.95, startVelocity: 25, colors: NEON, scalar: 1.2,
    origin: { x, y },
  });
}

// Spiraling confetti
function fireSpiral() {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const angle = (i / 20) * 360;
      const rad = (angle * Math.PI) / 180;
      confetti({
        particleCount: 15, spread: 30, startVelocity: 30,
        origin: { x: 0.5 + Math.cos(rad) * 0.3, y: 0.5 + Math.sin(rad) * 0.3 },
        angle: angle + 90, colors: NEON, scalar: 1,
      });
    }, i * 60);
  }
}

// Fountain effect from bottom
function fireFountain() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 50, angle: 90, spread: 40, startVelocity: 55,
        origin: { x: 0.3 + i * 0.08, y: 1 }, colors: GOLD, gravity: 1.2, scalar: 0.9,
      });
    }, i * 100);
  }
}

// ─── Phase definitions ──────────────────────────────────────────────

type Phase = "intro" | "drop" | "groove" | "build" | "finale" | "outro";

const PHASE_TIMINGS: { phase: Phase; startMs: number }[] = [
  { phase: "intro", startMs: 0 },
  { phase: "drop", startMs: 14500 },     // THE DROP at 15s
  { phase: "groove", startMs: 30000 },    // Riding the beat
  { phase: "build", startMs: 90000 },     // Building energy
  { phase: "finale", startMs: 150000 },   // Grand finale
  { phase: "outro", startMs: 170000 },    // Cool down
];

export function WinCelebration({ active, dealName, onComplete }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [dropFlash, setDropFlash] = useState(false);
  const [showDollarSigns, setShowDollarSigns] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showWave, setShowWave] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<"light" | "heavy">("light");
  const [lightSpeed, setLightSpeed] = useState<"normal" | "fast" | "strobe">("normal");

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  }, []);

  const addInterval = useCallback((fn: () => void, ms: number) => {
    const i = setInterval(fn, ms);
    intervalsRef.current.push(i);
    return i;
  }, []);

  const clearAll = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current = [];
    timeoutsRef.current = [];
    confetti.reset();
  }, []);

  useEffect(() => {
    if (!active) return;

    // Reset
    setPhase("intro");
    setDropFlash(false);
    setShowDollarSigns(false);
    setShowFireworks(false);
    setShowWave(false);
    setShakeIntensity("light");
    setLightSpeed("normal");

    // ─── PHASE 1: INTRO (0-15s) — Building anticipation ───
    fireCannons();
    addTimeout(fireCannons, 800);
    addTimeout(fireStars, 400);
    const introConfetti = addInterval(fireCannons, 3000);
    const introStars = addInterval(fireStars, 2000);

    // ─── PHASE 2: THE DROP (15s) — ABSOLUTE CHAOS ───
    addTimeout(() => {
      setPhase("drop");
      setDropFlash(true);
      setShakeIntensity("heavy");
      setLightSpeed("strobe");

      // THE BIG ONE
      fireMegaDrop();

      // Rapid-fire for 5 seconds
      clearInterval(introConfetti);
      clearInterval(introStars);
      const dropCannons = addInterval(fireMegaDrop, 2000);
      const dropFireworks = addInterval(fireFirework, 400);
      const dropStars = addInterval(fireStars, 600);

      // Flash off quickly
      addTimeout(() => setDropFlash(false), 400);

      // Ease up after 10s
      addTimeout(() => {
        clearInterval(dropCannons);
        clearInterval(dropFireworks);
        clearInterval(dropStars);
      }, 15000);
    }, 14500);

    // ─── PHASE 3: GROOVE (30s-90s) — Riding the beat ───
    addTimeout(() => {
      setPhase("groove");
      setShakeIntensity("light");
      setLightSpeed("fast");
      setShowDollarSigns(true);

      addInterval(fireCannons, 4000);
      addInterval(fireFirework, 2000);
      addInterval(fireSpiral, 8000);
      addInterval(fireRain, 5000);
    }, 30000);

    // Dollar signs appear/disappear
    addTimeout(() => setShowDollarSigns(false), 45000);
    addTimeout(() => setShowWave(true), 50000);
    addTimeout(() => setShowWave(false), 65000);

    // ─── PHASE 4: BUILD (90s-150s) — Energy rising again ───
    addTimeout(() => {
      setPhase("build");
      setLightSpeed("fast");
      setShowFireworks(true);

      addInterval(fireFirework, 1200);
      addInterval(fireFountain, 4000);
      addInterval(fireStars, 1500);
    }, 90000);

    // ─── PHASE 5: FINALE (150s-170s) — Everything at once ───
    addTimeout(() => {
      setPhase("finale");
      setShakeIntensity("heavy");
      setLightSpeed("strobe");
      setDropFlash(true);
      addTimeout(() => setDropFlash(false), 800);

      fireMegaDrop();
      addInterval(fireMegaDrop, 3000);
      addInterval(fireFirework, 500);
      addInterval(fireSpiral, 4000);
      addInterval(fireFountain, 3000);
    }, 150000);

    // ─── PHASE 6: OUTRO (170s+) — Gentle wind-down ───
    addTimeout(() => {
      setPhase("outro");
      setShakeIntensity("light");
      setLightSpeed("normal");
      setShowFireworks(false);

      // Clear all heavy intervals
      clearAll();

      // Gentle confetti
      addInterval(fireStars, 3000);
      addInterval(fireRain, 6000);
    }, 170000);

    // Play audio
    const audio = new Audio("/audio/Hypercharge Drop.mp3");
    audio.volume = 0.85;
    audio.play().catch(() => {});
    audioRef.current = audio;

    // End when song ends
    audio.addEventListener("ended", onComplete);

    return () => {
      clearAll();
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", onComplete);
        audioRef.current.pause();
        audioRef.current = null;
      }
      confetti.reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto select-none"
      onClick={onComplete}
    >
      {/* Dark backdrop — dims the page so effects pop */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        phase === "outro" ? "bg-black/70" : "bg-black/85"
      }`} />

      {/* Animated party lights on top of backdrop */}
      <div className={`absolute inset-0 ${
        lightSpeed === "strobe" ? "animate-party-lights-strobe" :
        lightSpeed === "fast" ? "animate-party-lights-fast" :
        "animate-party-lights"
      } ${phase === "outro" ? "opacity-30" : "opacity-50"}`} />

      {/* Drop flash — quick bright pulse, not full white */}
      {dropFlash && (
        <div className="absolute inset-0 bg-white/50 animate-flash-out z-10" />
      )}

      {/* Scanning spotlight */}
      <div className={`absolute inset-0 ${
        lightSpeed === "strobe" ? "animate-spotlight-fast" : "animate-spotlight"
      } opacity-20`} />

      {/* Laser beams — visible during drop and finale */}
      {(phase === "drop" || phase === "finale") && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`laser-${i}`}
              className="absolute top-0 h-full animate-laser"
              style={{
                left: `${(i + 1) * 11}%`,
                width: "2px",
                background: `linear-gradient(to bottom, ${NEON[i % NEON.length]}, transparent)`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${0.8 + (i % 3) * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating dollar signs during groove */}
      {showDollarSigns && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`dollar-${i}`}
              className="absolute text-green-400/60 font-black animate-float-up"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${24 + Math.random() * 48}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              $
            </div>
          ))}
        </div>
      )}

      {/* Firework bursts — rendered as expanding rings */}
      {showFireworks && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute rounded-full border-2 animate-firework-ring"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${10 + Math.random() * 50}%`,
                borderColor: NEON[i % NEON.length],
                animationDelay: `${i * 1.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Audio wave visualizer during groove */}
      {showWave && (
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-32 px-8 opacity-40">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`bar-${i}`}
              className="flex-1 bg-gradient-to-t from-blue-500 to-purple-400 rounded-t animate-eq-bar"
              style={{
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${0.3 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Screen shake container */}
      <div className={`absolute inset-0 flex items-center justify-center ${
        shakeIntensity === "heavy" ? "animate-screen-shake-heavy" : "animate-screen-shake"
      }`}>
        {/* Center content — evolves per phase */}
        <div className="text-center animate-bounce-in">
          {/* Trophy */}
          <div className={`leading-none mb-2 select-none transition-all duration-500 ${
            phase === "drop" || phase === "finale"
              ? "text-[160px] md:text-[240px] animate-trophy-spin"
              : phase === "outro"
              ? "text-[100px] md:text-[140px] animate-pulse-glow"
              : "text-[120px] md:text-[180px] animate-pulse-glow"
          }`}>
            🏆
          </div>

          {/* Main text */}
          <div className={`font-black text-white tracking-tight transition-all duration-300 ${
            phase === "drop" || phase === "finale"
              ? "text-5xl md:text-8xl animate-text-glow-intense"
              : "text-4xl md:text-6xl animate-text-glow"
          }`}
            style={{ textShadow: "0 0 30px rgba(255,215,0,0.8)" }}
          >
            {phase === "drop" ? "LET'S GO!!!" :
             phase === "finale" ? "MONEY!!!" :
             phase === "outro" ? "CLOSED." :
             "DEAL WON!"}
          </div>

          {dealName && (
            <div className={`mt-4 font-bold drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-fade-in-up ${
              phase === "drop" ? "text-2xl md:text-4xl text-green-300" :
              phase === "outro" ? "text-lg md:text-xl text-yellow-300/80" :
              "text-xl md:text-2xl text-yellow-300"
            }`}>
              {dealName}
            </div>
          )}

          {/* Rotating hype text during groove */}
          {(phase === "groove" || phase === "build") && (
            <div className="mt-6 text-lg md:text-xl font-bold text-white/70 animate-pulse">
              {phase === "groove" ? "GET THAT BREAD" : "HERE WE GO AGAIN"}
            </div>
          )}

          <div className="mt-8 text-sm text-white/40 animate-fade-in-up">
            Click anywhere to dismiss
          </div>
        </div>
      </div>

      {/* Radial burst rays */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className={`w-[200vmax] h-[200vmax] ${
          phase === "drop" || phase === "finale" ? "animate-spin-fast" : "animate-spin-slow"
        } ${phase === "drop" ? "opacity-25" : "opacity-10"}`}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[3px] h-1/2 origin-bottom"
              style={{
                transform: `rotate(${i * 22.5}deg) translateX(-50%)`,
                background: `linear-gradient(to top, transparent, ${NEON[i % NEON.length]})`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner strobes during drop */}
      {(phase === "drop" || phase === "finale") && (
        <>
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-500/30 to-transparent animate-corner-strobe" />
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-pink-500/30 to-transparent animate-corner-strobe" style={{ animationDelay: "0.2s" }} />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-green-500/30 to-transparent animate-corner-strobe" style={{ animationDelay: "0.4s" }} />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-amber-500/30 to-transparent animate-corner-strobe" style={{ animationDelay: "0.6s" }} />
        </>
      )}

      <style jsx>{`
        @keyframes party-lights {
          0% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.7) 0%, transparent 50%); }
          25% { background: radial-gradient(ellipse at 80% 50%, rgba(245, 158, 11, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139, 92, 246, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, rgba(59, 130, 246, 0.7) 0%, transparent 50%); }
          50% { background: radial-gradient(ellipse at 50% 30%, rgba(236, 72, 153, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 10% 60%, rgba(34, 197, 94, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(245, 158, 11, 0.7) 0%, transparent 50%); }
          75% { background: radial-gradient(ellipse at 30% 80%, rgba(59, 130, 246, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(34, 197, 94, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.7) 0%, transparent 50%); }
          100% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.7) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.7) 0%, transparent 50%); }
        }
        @keyframes party-lights-fast {
          0% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.8) 0%, transparent 50%); }
          33% { background: radial-gradient(ellipse at 80% 70%, rgba(34, 197, 94, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(255, 215, 0, 0.8) 0%, transparent 50%); }
          66% { background: radial-gradient(ellipse at 50% 20%, rgba(139, 92, 246, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(236, 72, 153, 0.8) 0%, transparent 50%); }
          100% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.8) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.8) 0%, transparent 50%); }
        }
        @keyframes party-lights-strobe {
          0%, 49% { background: radial-gradient(ellipse at 30% 40%, rgba(0, 255, 135, 0.9) 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, rgba(255, 0, 229, 0.9) 0%, transparent 40%); }
          50%, 100% { background: radial-gradient(ellipse at 70% 30%, rgba(96, 239, 255, 0.9) 0%, transparent 40%), radial-gradient(ellipse at 30% 70%, rgba(255, 61, 0, 0.9) 0%, transparent 40%); }
        }
        @keyframes spotlight {
          0% { background: radial-gradient(circle 300px at 10% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          25% { background: radial-gradient(circle 300px at 90% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          50% { background: radial-gradient(circle 300px at 50% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          75% { background: radial-gradient(circle 300px at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          100% { background: radial-gradient(circle 300px at 10% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
        }
        @keyframes spotlight-fast {
          0% { background: radial-gradient(circle 400px at 10% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 100%); }
          25% { background: radial-gradient(circle 400px at 90% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 100%); }
          50% { background: radial-gradient(circle 400px at 50% 80%, rgba(255, 255, 255, 0.4) 0%, transparent 100%); }
          75% { background: radial-gradient(circle 400px at 20% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 100%); }
          100% { background: radial-gradient(circle 400px at 10% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 100%); }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, -1px); }
          20% { transform: translate(2px, 1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -1px); }
          50% { transform: translate(0, 0); }
        }
        @keyframes screen-shake-heavy {
          0%, 100% { transform: translate(0, 0); }
          5% { transform: translate(-6px, -4px); }
          10% { transform: translate(6px, 3px); }
          15% { transform: translate(-5px, 5px); }
          20% { transform: translate(4px, -5px); }
          25% { transform: translate(-3px, -3px); }
          30% { transform: translate(5px, 4px); }
          35% { transform: translate(0, 0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
          70% { transform: scale(0.9) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 60px rgba(255, 215, 0, 1)); transform: scale(1.1); }
        }
        @keyframes trophy-spin {
          0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1)); }
          25% { transform: scale(1.15) rotate(5deg); filter: drop-shadow(0 0 80px rgba(255, 0, 229, 1)); }
          50% { transform: scale(1.05) rotate(-3deg); filter: drop-shadow(0 0 60px rgba(0, 255, 135, 1)); }
          75% { transform: scale(1.2) rotate(4deg); filter: drop-shadow(0 0 80px rgba(96, 239, 255, 1)); }
          100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1)); }
        }
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
          50% { text-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 215, 0, 0.3); }
        }
        @keyframes text-glow-intense {
          0%, 100% { text-shadow: 0 0 30px rgba(0, 255, 135, 1), 0 0 60px rgba(96, 239, 255, 0.8), 0 0 100px rgba(255, 0, 229, 0.5); letter-spacing: 0.05em; }
          50% { text-shadow: 0 0 50px rgba(255, 0, 229, 1), 0 0 100px rgba(0, 255, 135, 0.8), 0 0 150px rgba(255, 215, 0, 0.6); letter-spacing: 0.15em; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flash-out {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes laser {
          0%, 100% { opacity: 0; transform: scaleY(0); }
          30%, 70% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(100vh) rotate(0deg); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-20vh) rotate(360deg); }
        }
        @keyframes firework-ring {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 200px; height: 200px; opacity: 0; margin-left: -100px; margin-top: -100px; }
        }
        @keyframes eq-bar {
          0%, 100% { height: 8px; }
          50% { height: ${40 + Math.random() * 80}px; }
        }
        @keyframes corner-strobe {
          0%, 49% { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
        .animate-party-lights { animation: party-lights 3s ease-in-out infinite; }
        .animate-party-lights-fast { animation: party-lights-fast 1.5s ease-in-out infinite; }
        .animate-party-lights-strobe { animation: party-lights-strobe 0.4s steps(1) infinite; }
        .animate-spotlight { animation: spotlight 4s ease-in-out infinite; }
        .animate-spotlight-fast { animation: spotlight-fast 1.5s ease-in-out infinite; }
        .animate-screen-shake { animation: screen-shake 0.5s ease-in-out infinite; }
        .animate-screen-shake-heavy { animation: screen-shake-heavy 0.3s ease-in-out infinite; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-trophy-spin { animation: trophy-spin 1.5s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-text-glow-intense { animation: text-glow-intense 0.8s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.5s both; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-fast { animation: spin-fast 5s linear infinite; }
        .animate-flash-out { animation: flash-out 0.4s ease-out forwards; }
        .animate-laser { animation: laser 0.8s ease-in-out infinite; transform-origin: top; }
        .animate-float-up { animation: float-up 5s ease-out forwards; }
        .animate-firework-ring { animation: firework-ring 1.5s ease-out infinite; }
        .animate-eq-bar { animation: eq-bar 0.4s ease-in-out infinite alternate; }
        .animate-corner-strobe { animation: corner-strobe 0.3s steps(1) infinite; }
      `}</style>
    </div>
  );
}
