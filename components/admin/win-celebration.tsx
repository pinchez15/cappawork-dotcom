"use client";

import { useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

type Props = {
  active: boolean;
  dealName?: string;
  onComplete: () => void;
};

const CELEBRATION_DURATION = 18000; // 18 seconds of pure joy

// Gold, green, blue, white — victory colors
const COLORS = ["#FFD700", "#22c55e", "#3b82f6", "#ffffff", "#f59e0b", "#ec4899"];

export function WinCelebration({ active, dealName, onComplete }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireConfetti = useCallback(() => {
    // Big center burst
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: COLORS,
      scalar: 1.2,
    });

    // Left cannon
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
    });

    // Right cannon
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
    });
  }, []);

  const fireStars = useCallback(() => {
    confetti({
      particleCount: 30,
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 20,
      shapes: ["star"],
      colors: ["#FFD700", "#f59e0b", "#ffffff"],
      scalar: 1.5,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
    });
  }, []);

  const fireRain = useCallback(() => {
    // Confetti rain from the top
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 40,
          startVelocity: 0,
          ticks: 300,
          origin: { x: Math.random(), y: -0.1 },
          colors: COLORS,
          gravity: 0.6,
          scalar: 0.8,
          drift: (Math.random() - 0.5) * 2,
        });
      }, i * 200);
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    // Initial massive burst
    fireConfetti();

    // Keep firing throughout
    const intervals = [
      setInterval(fireConfetti, 2500),
      setInterval(fireStars, 1500),
      setInterval(fireRain, 3000),
    ];

    // Extra burst at 1s for immediate wow
    setTimeout(fireConfetti, 800);
    setTimeout(fireStars, 400);

    // Play celebration music
    const audio = new Audio("/audio/Hypercharge Drop.mp3");
    audio.volume = 0.85;
    audio.play().catch(() => {
      // No local file or autoplay blocked — that's ok, visuals still fire
    });
    audioRef.current = audio;

    // Auto-dismiss
    timerRef.current = setTimeout(() => {
      onComplete();
    }, CELEBRATION_DURATION);

    return () => {
      intervals.forEach(clearInterval);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      confetti.reset();
    };
  }, [active, fireConfetti, fireStars, fireRain, onComplete]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto"
      onClick={onComplete}
    >
      {/* Pulsing light overlay */}
      <div className="absolute inset-0 animate-party-lights opacity-30" />

      {/* Scanning spotlight */}
      <div className="absolute inset-0 animate-spotlight opacity-20" />

      {/* Screen shake container */}
      <div className="absolute inset-0 flex items-center justify-center animate-screen-shake">
        {/* Giant trophy / celebration text */}
        <div className="text-center animate-bounce-in">
          <div className="text-[120px] md:text-[180px] leading-none mb-2 animate-pulse-glow select-none">
            🏆
          </div>
          <div className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-text-glow tracking-tight">
            DEAL WON!
          </div>
          {dealName && (
            <div className="mt-4 text-xl md:text-2xl font-bold text-yellow-300 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-fade-in-up">
              {dealName}
            </div>
          )}
          <div className="mt-6 text-sm text-white/60 animate-fade-in-up">
            Click anywhere to dismiss
          </div>
        </div>
      </div>

      {/* Radial burst rays */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-[200vmax] h-[200vmax] animate-spin-slow opacity-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[3px] h-1/2 bg-gradient-to-t from-transparent to-yellow-300 origin-bottom"
              style={{ transform: `rotate(${i * 30}deg) translateX(-50%)` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes party-lights {
          0% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.6) 0%, transparent 50%), rgba(0, 0, 0, 0.85); }
          25% { background: radial-gradient(ellipse at 80% 50%, rgba(245, 158, 11, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(139, 92, 246, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 50% 20%, rgba(59, 130, 246, 0.6) 0%, transparent 50%), rgba(0, 0, 0, 0.85); }
          50% { background: radial-gradient(ellipse at 50% 30%, rgba(236, 72, 153, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 10% 60%, rgba(34, 197, 94, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(245, 158, 11, 0.6) 0%, transparent 50%), rgba(0, 0, 0, 0.85); }
          75% { background: radial-gradient(ellipse at 30% 80%, rgba(59, 130, 246, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(34, 197, 94, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 215, 0, 0.6) 0%, transparent 50%), rgba(0, 0, 0, 0.85); }
          100% { background: radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236, 72, 153, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(34, 197, 94, 0.6) 0%, transparent 50%), rgba(0, 0, 0, 0.85); }
        }
        @keyframes spotlight {
          0% { background: radial-gradient(circle 300px at 10% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          25% { background: radial-gradient(circle 300px at 90% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          50% { background: radial-gradient(circle 300px at 50% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          75% { background: radial-gradient(circle 300px at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
          100% { background: radial-gradient(circle 300px at 10% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 100%); }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-3px, -2px); }
          20% { transform: translate(3px, 2px); }
          30% { transform: translate(-2px, 3px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: translate(0, 0); }
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
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
          50% { text-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 80px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 215, 0, 0.3); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-party-lights { animation: party-lights 3s ease-in-out infinite; }
        .animate-spotlight { animation: spotlight 4s ease-in-out infinite; }
        .animate-screen-shake { animation: screen-shake 0.5s ease-in-out 0s 3; }
        .animate-bounce-in { animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 2s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out 0.5s both; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
}
