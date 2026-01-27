// Animation utilities for the client portal
// Uses tailwindcss-animate plugin

export const animations = {
  // Page transitions
  fadeIn: "animate-in fade-in duration-300",
  fadeOut: "animate-out fade-out duration-300",
  slideUp: "animate-in slide-in-from-bottom-4 duration-300",
  slideDown: "animate-in slide-in-from-top-4 duration-300",
  slideLeft: "animate-in slide-in-from-right-4 duration-300",
  slideRight: "animate-in slide-in-from-left-4 duration-300",

  // Scale animations
  scaleIn: "animate-in zoom-in-95 duration-200",
  scaleOut: "animate-out zoom-out-95 duration-200",

  // Combined entrance animations
  fadeInUp: "animate-in fade-in slide-in-from-bottom-4 duration-300",
  fadeInDown: "animate-in fade-in slide-in-from-top-4 duration-300",
  fadeInScale: "animate-in fade-in zoom-in-95 duration-200",

  // Progress animations
  progressFill: "transition-all duration-500 ease-out",
  progressPulse: "animate-pulse",

  // Task completion celebration
  taskComplete: "animate-in zoom-in-50 duration-300",

  // Stagger delays for lists (use with style={{ animationDelay }})
  stagger: {
    1: "delay-[50ms]",
    2: "delay-[100ms]",
    3: "delay-[150ms]",
    4: "delay-[200ms]",
    5: "delay-[250ms]",
    6: "delay-[300ms]",
  },
} as const;

// Helper to combine animation classes
export function combineAnimations(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

// Animation delay style generator for staggered lists
export function getStaggerDelay(index: number, baseMs: number = 50): React.CSSProperties {
  return { animationDelay: `${index * baseMs}ms` };
}

// Tier color mappings
export const tierColors = {
  internal_tool: {
    bg: "bg-tier-internal",
    bgLight: "bg-tier-internal-light",
    text: "text-tier-internal",
    border: "border-tier-internal",
    ring: "ring-tier-internal",
  },
  scale_ready: {
    bg: "bg-tier-scale",
    bgLight: "bg-tier-scale-light",
    text: "text-tier-scale",
    border: "border-tier-scale",
    ring: "ring-tier-scale",
  },
  commercial_product: {
    bg: "bg-tier-commercial",
    bgLight: "bg-tier-commercial-light",
    text: "text-tier-commercial",
    border: "border-tier-commercial",
    ring: "ring-tier-commercial",
  },
} as const;

// Phase color mappings
export const phaseColors = {
  pending: {
    bg: "bg-phase-pending",
    text: "text-phase-pending",
    border: "border-phase-pending",
  },
  active: {
    bg: "bg-phase-active",
    text: "text-phase-active",
    border: "border-phase-active",
  },
  completed: {
    bg: "bg-phase-completed",
    text: "text-phase-completed",
    border: "border-phase-completed",
  },
} as const;

// Get tier display info
export function getTierInfo(tier: string | null) {
  switch (tier) {
    case "internal_tool":
      return {
        label: "Internal Tool",
        price: "$9,900",
        colors: tierColors.internal_tool,
      };
    case "scale_ready":
      return {
        label: "Scale-Ready",
        price: "$14,900",
        colors: tierColors.scale_ready,
      };
    case "commercial_product":
      return {
        label: "Commercial Product",
        price: "$24,900",
        colors: tierColors.commercial_product,
      };
    default:
      return {
        label: "Standard",
        price: "",
        colors: tierColors.internal_tool,
      };
  }
}

export type ServiceTier = "internal_tool" | "scale_ready" | "commercial_product";
export type PhaseStatus = "pending" | "active" | "completed";
