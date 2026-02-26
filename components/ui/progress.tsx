"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import gsap from "gsap"

import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  variant?: "default" | "success" | "warning" | "tier-internal" | "tier-scale" | "tier-commercial";
  showPulse?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  default: "bg-primary",
  success: "bg-phase-completed",
  warning: "bg-yellow-500",
  "tier-internal": "bg-tier-internal",
  "tier-scale": "bg-tier-scale",
  "tier-commercial": "bg-tier-commercial",
};

const sizeStyles = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
};

// Auto-select variant based on percentage
function getAutoVariant(value: number | undefined): "default" | "success" | "warning" {
  if (!value) return "default";
  if (value >= 100) return "success";
  if (value >= 75) return "default";
  return "default";
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, showPulse = false, animated = true, size = "md", ...props }, ref) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  // Animate the value change
  React.useEffect(() => {
    if (!animated) {
      setDisplayValue(value || 0);
      return;
    }

    // Animate to new value
    const timer = setTimeout(() => {
      setDisplayValue(value || 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [value, animated]);

  const resolvedVariant = variant || getAutoVariant(value);
  const isComplete = (value || 0) >= 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-secondary",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out",
          variantStyles[resolvedVariant],
          showPulse && !isComplete && "animate-pulse-subtle",
          isComplete && "animate-task-complete"
        )}
        style={{ transform: `translateX(-${100 - displayValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

// Radial progress for dashboard hero
interface RadialProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "tier-internal" | "tier-scale" | "tier-commercial";
  showLabel?: boolean;
  className?: string;
}

const radialGradients: Record<string, [string, string]> = {
  default: ["#3B82F6", "#60A5FA"],
  "tier-internal": ["#2563EB", "#60A5FA"],
  "tier-scale": ["#4F46E5", "#818CF8"],
  "tier-commercial": ["#7C3AED", "#A78BFA"],
};

function RadialProgress({
  value,
  size = 120,
  strokeWidth = 12,
  variant = "default",
  showLabel = true,
  className,
}: RadialProgressProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const progressRef = React.useRef<SVGCircleElement>(null);
  const counterRef = React.useRef<HTMLSpanElement>(null);
  const hasAnimated = React.useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const gradientId = `radial-gradient-${React.useId().replace(/:/g, "")}`;
  const [startColor, endColor] = radialGradients[variant] || radialGradients.default;

  React.useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const target = { value: 0 };
    const offset = circumference;

    // Set initial state
    if (progressRef.current) {
      gsap.set(progressRef.current, { strokeDashoffset: offset });
    }

    // Animate the ring and counter together
    gsap.to(target, {
      value,
      duration: 1.2,
      delay: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        if (progressRef.current) {
          const newOffset = circumference - (target.value / 100) * circumference;
          progressRef.current.style.strokeDashoffset = String(newOffset);
        }
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(target.value)}%`;
        }
      },
    });

    // Fade in the whole SVG
    if (svgRef.current) {
      gsap.fromTo(
        svgRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
      );
    }
  }, [value, circumference]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg ref={svgRef} width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-100"
        />
        {/* Progress circle */}
        <circle
          ref={progressRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span ref={counterRef} className="text-3xl font-bold text-stone-900 tabular-nums">
            0%
          </span>
          {value === 0 && (
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mt-0.5">
              Kickoff
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Progress, RadialProgress }
