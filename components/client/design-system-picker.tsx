"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import gsap from "gsap";

// Load Google Fonts used by design system presets
const GOOGLE_FONTS = [
  "DM+Sans:wght@400;500;700",
  "Space+Grotesk:wght@400;500;700",
  "Lato:wght@400;700",
  "Open+Sans:wght@400;600",
  "Geist:wght@400;500;700",
  "Poppins:wght@400;500;600;700",
  "Plus+Jakarta+Sans:wght@400;500;600;700",
];
const GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS.map((f) => `family=${f}`).join("&")}&display=swap`;

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
    id: "executive",
    name: "Executive",
    description: "Navy and gold — authoritative and polished",
    tokens: {
      background: "#FFFFFF",
      foreground: "#1E293B",
      card: "#F8FAFC",
      cardForeground: "#1E293B",
      primary: "#1E3A5F",
      primaryForeground: "#FFFFFF",
      secondary: "#F1F5F9",
      secondaryForeground: "#1E3A5F",
      accent: "#D4A853",
      accentForeground: "#1E3A5F",
      muted: "#F1F5F9",
      mutedForeground: "#64748B",
      border: "#E2E8F0",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.08)",
      fontHeading: "DM Sans",
      fontBody: "Inter",
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool gray and blue — modern corporate",
    tokens: {
      background: "#F8FAFC",
      foreground: "#0F172A",
      card: "#FFFFFF",
      cardForeground: "#0F172A",
      primary: "#334155",
      primaryForeground: "#FFFFFF",
      secondary: "#F1F5F9",
      secondaryForeground: "#334155",
      accent: "#3B82F6",
      accentForeground: "#FFFFFF",
      muted: "#F1F5F9",
      mutedForeground: "#64748B",
      border: "#E2E8F0",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 2px rgba(0,0,0,0.05)",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
    },
  },
  {
    id: "evergreen",
    name: "Evergreen",
    description: "Forest and warm neutrals — trusted advisory",
    tokens: {
      background: "#FEFDF8",
      foreground: "#1C1917",
      card: "#FFFFFF",
      cardForeground: "#1C1917",
      primary: "#1B4332",
      primaryForeground: "#FFFFFF",
      secondary: "#F5F5F0",
      secondaryForeground: "#1B4332",
      accent: "#2D6A4F",
      accentForeground: "#FFFFFF",
      muted: "#F5F5F0",
      mutedForeground: "#78716C",
      border: "#E7E5E4",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.06)",
      fontHeading: "Lato",
      fontBody: "Open Sans",
    },
  },
  {
    id: "charcoal",
    name: "Charcoal",
    description: "Dark mode — minimal and focused",
    tokens: {
      background: "#09090B",
      foreground: "#FAFAFA",
      card: "#18181B",
      cardForeground: "#FAFAFA",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#27272A",
      secondaryForeground: "#FAFAFA",
      accent: "#3B82F6",
      accentForeground: "#FFFFFF",
      muted: "#27272A",
      mutedForeground: "#A1A1AA",
      border: "#27272A",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      fontHeading: "Geist",
      fontBody: "Inter",
    },
  },
  {
    id: "sandstone",
    name: "Sandstone",
    description: "Warm earth tones — approachable and grounded",
    tokens: {
      background: "#FFFBEB",
      foreground: "#1C1917",
      card: "#FFFFFF",
      cardForeground: "#1C1917",
      primary: "#78350F",
      primaryForeground: "#FFFFFF",
      secondary: "#FEF3C7",
      secondaryForeground: "#78350F",
      accent: "#D97706",
      accentForeground: "#FFFFFF",
      muted: "#FEF3C7",
      mutedForeground: "#92400E",
      border: "#FDE68A",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.06)",
      fontHeading: "Poppins",
      fontBody: "Lato",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark navy and emerald — finance and ops",
    tokens: {
      background: "#020617",
      foreground: "#F8FAFC",
      card: "#0F172A",
      cardForeground: "#F8FAFC",
      primary: "#10B981",
      primaryForeground: "#FFFFFF",
      secondary: "#1E293B",
      secondaryForeground: "#F8FAFC",
      accent: "#10B981",
      accentForeground: "#FFFFFF",
      muted: "#1E293B",
      mutedForeground: "#94A3B8",
      border: "#1E293B",
      borderRadius: "8px",
      borderWidth: "1px",
      shadow: "0 1px 3px rgba(0,0,0,0.4)",
      fontHeading: "Plus Jakarta Sans",
      fontBody: "DM Sans",
    },
  },
];

interface DesignSystemPickerProps {
  selectedId?: string;
  onSelect?: (system: DesignSystem) => void;
  readOnly?: boolean;
}

export function DesignSystemPicker({
  selectedId = "executive",
  onSelect,
  readOnly = false,
}: DesignSystemPickerProps) {
  const [activeSystem, setActiveSystem] = useState<DesignSystem>(
    DESIGN_SYSTEMS.find((s) => s.id === selectedId) || DESIGN_SYSTEMS[0]
  );
  const previewRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Load Google Fonts for previews
  useEffect(() => {
    const id = "design-system-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }, []);

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
                    : "border-border hover:border-border/80 bg-card",
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
          $4.2M
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
      {/* Margin Card */}
      <div
        className="flex-1 p-1.5 text-[6px]"
        style={{
          backgroundColor: t.card,
          borderRadius: t.borderRadius,
          border: `${t.borderWidth} solid ${t.border}`,
          boxShadow: t.shadow,
        }}
      >
        <div style={{ color: t.mutedForeground }}>Margin</div>
        <div className="font-bold" style={{ color: t.accent, fontSize: "8px" }}>
          34.2%
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
          Operations Dashboard
        </h1>
        <p style={{ color: t.mutedForeground }} className="text-sm">
          Q4 performance — trailing 90 days
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          system={system}
          label="Revenue"
          value="$4.2M"
          change="+12.3% vs. prior quarter"
          positive
        />
        <StatCard
          system={system}
          label="Gross Margin"
          value="34.2%"
          change="+2.1pp from baseline"
          positive
          useAccent
        />
        <StatCard
          system={system}
          label="Utilization"
          value="78%"
          change="Target: 85%"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Data Table */}
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
            Revenue by Service Line
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                <th className="text-left pb-2 font-medium" style={{ color: t.mutedForeground }}>Service</th>
                <th className="text-right pb-2 font-medium" style={{ color: t.mutedForeground }}>Revenue</th>
                <th className="text-right pb-2 font-medium" style={{ color: t.mutedForeground }}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: "Consulting", revenue: "$1.8M", margin: "42%" },
                { service: "Implementation", revenue: "$1.4M", margin: "31%" },
                { service: "Managed Services", revenue: "$680K", margin: "28%" },
                { service: "Training", revenue: "$320K", margin: "51%" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td className="py-2" style={{ color: t.cardForeground }}>{row.service}</td>
                  <td className="py-2 text-right font-medium" style={{ color: t.primary }}>{row.revenue}</td>
                  <td className="py-2 text-right" style={{ color: t.accent }}>{row.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* KPI Summary */}
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
            Key Metrics
          </h3>
          <div className="space-y-3">
            {[
              { label: "Revenue per Employee", value: "$210K", target: "$250K" },
              { label: "Client Retention", value: "94%", target: "95%" },
              { label: "Avg. Project Margin", value: "36%", target: "40%" },
              { label: "Pipeline Coverage", value: "3.2x", target: "3.0x" },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: t.mutedForeground }}>{metric.label}</span>
                  <span style={{ color: t.cardForeground }} className="font-medium">{metric.value}</span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: t.muted }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${60 + i * 10}%`,
                      backgroundColor: t.primary,
                    }}
                  />
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: t.mutedForeground }}>
                  Target: {metric.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
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
          <span className="font-medium">Phase 2 Active</span>
          <span className="opacity-80">Week 6 of 12</span>
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
