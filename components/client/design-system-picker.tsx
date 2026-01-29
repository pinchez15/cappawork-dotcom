"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import gsap from "gsap";

// Design system definitions
export interface DesignSystem {
  id: string;
  name: string;
  description: string;
  tokens: {
    // Colors
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    // Effects
    borderRadius: string;
    borderWidth: string;
    shadow: string;
    // Typography
    fontHeading: string;
    fontBody: string;
  };
}

export const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    id: "base",
    name: "Base",
    description: "Clean foundation with neutral tones",
    tokens: {
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#171717",
      cardForeground: "#fafafa",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#27272a",
      secondaryForeground: "#fafafa",
      accent: "#22c55e",
      accentForeground: "#ffffff",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      border: "#27272a",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
  },
  {
    id: "mono",
    name: "Mono",
    description: "Monochromatic with crisp typography",
    tokens: {
      background: "#0f0f0f",
      foreground: "#e5e5e5",
      card: "#1a1a1a",
      cardForeground: "#e5e5e5",
      primary: "#ffffff",
      primaryForeground: "#000000",
      secondary: "#262626",
      secondaryForeground: "#e5e5e5",
      accent: "#737373",
      accentForeground: "#ffffff",
      muted: "#262626",
      mutedForeground: "#737373",
      border: "#262626",
      borderRadius: "4px",
      borderWidth: "1px",
      shadow: "none",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
    },
  },
  {
    id: "cosmic_night",
    name: "Cosmic Night",
    description: "Deep purple gradients with neon accents",
    tokens: {
      background: "#0c0a1d",
      foreground: "#e4e2f5",
      card: "#1a1735",
      cardForeground: "#e4e2f5",
      primary: "#a855f7",
      primaryForeground: "#ffffff",
      secondary: "#1e1b4b",
      secondaryForeground: "#e4e2f5",
      accent: "#f0abfc",
      accentForeground: "#0c0a1d",
      muted: "#1e1b4b",
      mutedForeground: "#a78bfa",
      border: "#2e2a5e",
      borderRadius: "12px",
      borderWidth: "1px",
      shadow: "0 4px 20px rgba(168, 85, 247, 0.15)",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "Inter",
    },
  },
  {
    id: "soft_pop",
    name: "Soft Pop",
    description: "Warm pastels with playful energy",
    tokens: {
      background: "#1c1917",
      foreground: "#fafaf9",
      card: "#292524",
      cardForeground: "#fafaf9",
      primary: "#fbbf24",
      primaryForeground: "#1c1917",
      secondary: "#44403c",
      secondaryForeground: "#fafaf9",
      accent: "#fb923c",
      accentForeground: "#1c1917",
      muted: "#44403c",
      mutedForeground: "#a8a29e",
      border: "#44403c",
      borderRadius: "16px",
      borderWidth: "1px",
      shadow: "0 2px 8px rgba(0,0,0,0.2)",
      fontHeading: "Poppins",
      fontBody: "Inter",
    },
  },
  {
    id: "neo_brutalist",
    name: "Neobrutalist",
    description: "Bold borders, high contrast, playful chaos",
    tokens: {
      background: "#fffef0",
      foreground: "#000000",
      card: "#ffffff",
      cardForeground: "#000000",
      primary: "#ff3366",
      primaryForeground: "#ffffff",
      secondary: "#00d4ff",
      secondaryForeground: "#000000",
      accent: "#ffcc00",
      accentForeground: "#000000",
      muted: "#f5f5dc",
      mutedForeground: "#666666",
      border: "#000000",
      borderRadius: "0px",
      borderWidth: "3px",
      shadow: "4px 4px 0px #000000",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
    },
  },
  {
    id: "neumorphic",
    name: "Neumorphic",
    description: "Soft shadows with tactile depth",
    tokens: {
      background: "#e0e5ec",
      foreground: "#2d3748",
      card: "#e0e5ec",
      cardForeground: "#2d3748",
      primary: "#6366f1",
      primaryForeground: "#ffffff",
      secondary: "#d1d5db",
      secondaryForeground: "#374151",
      accent: "#8b5cf6",
      accentForeground: "#ffffff",
      muted: "#d1d5db",
      mutedForeground: "#6b7280",
      border: "transparent",
      borderRadius: "20px",
      borderWidth: "0px",
      shadow: "8px 8px 16px #b8bcc2, -8px -8px 16px #ffffff",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "Inter",
    },
  },
];

interface DesignSystemPickerProps {
  selectedId?: string;
  onSelect?: (system: DesignSystem) => void;
  readOnly?: boolean;
}

export function DesignSystemPicker({
  selectedId = "base",
  onSelect,
  readOnly = false,
}: DesignSystemPickerProps) {
  const [activeSystem, setActiveSystem] = useState<DesignSystem>(
    DESIGN_SYSTEMS.find((s) => s.id === selectedId) || DESIGN_SYSTEMS[0]
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Animate preview when system changes
  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { opacity: 0.6, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeSystem]);

  const handleSelect = (system: DesignSystem) => {
    if (readOnly) return;

    // Animate the selected card
    const cardEl = cardRefs.current.get(system.id);
    if (cardEl) {
      gsap.fromTo(
        cardEl,
        { scale: 1 },
        { scale: 1.03, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    }

    setActiveSystem(system);
    onSelect?.(system);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel - Style Picker */}
      <div className="lg:w-80 flex-shrink-0 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-3">Design Systems</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {DESIGN_SYSTEMS.map((system) => (
              <button
                key={system.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(system.id, el);
                }}
                onClick={() => handleSelect(system)}
                disabled={readOnly}
                className={cn(
                  "relative text-left rounded-lg border-2 p-3 transition-all design-system-card",
                  activeSystem.id === system.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-stone-200 hover:border-stone-300 bg-white",
                  readOnly && "cursor-default"
                )}
              >
                {activeSystem.id === system.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {/* Mini Preview */}
                <div
                  className="rounded-md overflow-hidden mb-2 h-20"
                  style={{ backgroundColor: system.tokens.background }}
                >
                  <MiniDashboardPreview system={system} />
                </div>
                <div className="font-medium text-sm">{system.name}</div>
                <div className="text-xs text-stone-500 line-clamp-1">
                  {system.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-stone-500 mb-3">Live Preview</h3>
        <div ref={previewRef} className="rounded-xl border border-stone-200 overflow-hidden bg-stone-100">
          <DashboardPreview system={activeSystem} />
        </div>
      </div>
    </div>
  );
}

// Mini preview for the style cards
function MiniDashboardPreview({ system }: { system: DesignSystem }) {
  const t = system.tokens;

  return (
    <div className="p-2 h-full flex gap-1" style={{ backgroundColor: t.background }}>
      {/* Revenue Card */}
      <div
        className="flex-1 p-1.5 text-[6px]"
        style={{
          backgroundColor: t.card,
          borderRadius: t.borderRadius,
          border: `${t.borderWidth} solid ${t.border}`,
          boxShadow: t.shadow,
        }}
      >
        <div style={{ color: t.mutedForeground }}>Revenue</div>
        <div className="font-bold" style={{ color: t.primary, fontSize: "8px" }}>
          $15,231
        </div>
        <div className="mt-1 h-3 flex items-end gap-px">
          {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${h}%`,
                width: "3px",
                backgroundColor: t.primary,
                opacity: 0.7,
                borderRadius: "1px",
              }}
            />
          ))}
        </div>
      </div>
      {/* Subs Card */}
      <div
        className="flex-1 p-1.5 text-[6px]"
        style={{
          backgroundColor: t.card,
          borderRadius: t.borderRadius,
          border: `${t.borderWidth} solid ${t.border}`,
          boxShadow: t.shadow,
        }}
      >
        <div style={{ color: t.mutedForeground }}>Subs</div>
        <div className="font-bold" style={{ color: t.accent, fontSize: "8px" }}>
          +2,350
        </div>
      </div>
    </div>
  );
}

// Full dashboard preview
function DashboardPreview({ system }: { system: DesignSystem }) {
  const t = system.tokens;

  return (
    <div
      className="min-h-[500px] p-6"
      style={{
        backgroundColor: t.background,
        fontFamily: t.fontBody,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ color: t.foreground, fontFamily: t.fontHeading }}
        >
          Dashboard Overview
        </h1>
        <p style={{ color: t.mutedForeground }} className="text-sm">
          Welcome back! Here&apos;s what&apos;s happening with your project.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          system={system}
          label="Total Revenue"
          value="$15,231.89"
          change="+20.1% from last month"
          positive
        />
        <StatCard
          system={system}
          label="Subscriptions"
          value="+2,350"
          change="+180.1% from last month"
          positive
          useAccent
        />
        <StatCard
          system={system}
          label="Active Users"
          value="573"
          change="+201 since last hour"
          positive
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Payment Form */}
        <div
          className="p-4"
          style={{
            backgroundColor: t.card,
            borderRadius: t.borderRadius,
            border: `${t.borderWidth} solid ${t.border}`,
            boxShadow: t.shadow,
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: t.cardForeground, fontFamily: t.fontHeading }}
          >
            Upgrade your subscription
          </h3>
          <p className="text-sm mb-4" style={{ color: t.mutedForeground }}>
            You are currently on the free plan. Upgrade to pro for more features.
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: t.mutedForeground }}>
                Name
              </label>
              <input
                type="text"
                placeholder="First Last"
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: t.background,
                  color: t.foreground,
                  borderRadius: t.borderRadius,
                  border: `${t.borderWidth} solid ${t.border}`,
                }}
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: t.mutedForeground }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 1234 1234 1234"
                className="w-full px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: t.background,
                  color: t.foreground,
                  borderRadius: t.borderRadius,
                  border: `${t.borderWidth} solid ${t.border}`,
                }}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="flex-1 px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: t.background,
                  color: t.foreground,
                  borderRadius: t.borderRadius,
                  border: `${t.borderWidth} solid ${t.border}`,
                }}
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-20 px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: t.background,
                  color: t.foreground,
                  borderRadius: t.borderRadius,
                  border: `${t.borderWidth} solid ${t.border}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <div
          className="p-4"
          style={{
            backgroundColor: t.card,
            borderRadius: t.borderRadius,
            border: `${t.borderWidth} solid ${t.border}`,
            boxShadow: t.shadow,
          }}
        >
          <h3
            className="font-semibold mb-1"
            style={{ color: t.cardForeground, fontFamily: t.fontHeading }}
          >
            Create an account
          </h3>
          <p className="text-sm mb-4" style={{ color: t.mutedForeground }}>
            Enter your email below to create your account
          </p>
          <div className="flex gap-2 mb-3">
            <button
              className="flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: t.secondary,
                color: t.secondaryForeground,
                borderRadius: t.borderRadius,
                border: `${t.borderWidth} solid ${t.border}`,
              }}
            >
              <GithubIcon /> GitHub
            </button>
            <button
              className="flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: t.secondary,
                color: t.secondaryForeground,
                borderRadius: t.borderRadius,
                border: `${t.borderWidth} solid ${t.border}`,
              }}
            >
              <GoogleIcon /> Google
            </button>
          </div>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
            <span className="text-xs" style={{ color: t.mutedForeground }}>
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: t.border }} />
          </div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: t.mutedForeground }}>
              Email
            </label>
            <input
              type="email"
              placeholder="m@example.com"
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                backgroundColor: t.background,
                color: t.foreground,
                borderRadius: t.borderRadius,
                border: `${t.borderWidth} solid ${t.border}`,
              }}
            />
          </div>
          <button
            className="w-full py-2 text-sm font-medium"
            style={{
              backgroundColor: t.primary,
              color: t.primaryForeground,
              borderRadius: t.borderRadius,
              border: `${t.borderWidth} solid ${t.border}`,
              boxShadow: t.shadow,
            }}
          >
            Create account
          </button>
        </div>
      </div>

      {/* Payment Pill */}
      <div className="mt-6 flex justify-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 text-sm"
          style={{
            backgroundColor: t.primary,
            color: t.primaryForeground,
            borderRadius: "9999px",
            boxShadow: t.shadow,
          }}
        >
          <span className="font-medium">Pro Plan</span>
          <span className="opacity-80">$10/month</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  system,
  label,
  value,
  change,
  positive,
  useAccent,
}: {
  system: DesignSystem;
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  useAccent?: boolean;
}) {
  const t = system.tokens;

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: t.card,
        borderRadius: t.borderRadius,
        border: `${t.borderWidth} solid ${t.border}`,
        boxShadow: t.shadow,
      }}
    >
      <div className="text-xs mb-1" style={{ color: t.mutedForeground }}>
        {label}
      </div>
      <div
        className="text-2xl font-bold mb-1"
        style={{
          color: useAccent ? t.accent : t.primary,
          fontFamily: system.tokens.fontHeading,
        }}
      >
        {value}
      </div>
      <div
        className="text-xs"
        style={{ color: positive ? t.accent : t.mutedForeground }}
      >
        {change}
      </div>
      {/* Mini chart */}
      <div className="mt-3 h-8 flex items-end gap-1">
        {[40, 55, 45, 60, 50, 70, 65, 75, 60, 80, 70, 85].map((h, i) => (
          <div
            key={i}
            style={{
              height: `${h}%`,
              flex: 1,
              backgroundColor: useAccent ? t.accent : t.primary,
              opacity: 0.6 + (i * 0.03),
              borderRadius: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
