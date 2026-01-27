"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

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

const radialVariantColors = {
  default: "#3B82F6",
  "tier-internal": "#3B82F6",
  "tier-scale": "#6366F1",
  "tier-commercial": "#8B5CF6",
};

function RadialProgress({
  value,
  size = 120,
  strokeWidth = 12,
  variant = "default",
  showLabel = true,
  className,
}: RadialProgressProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayValue / 100) * circumference;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={radialVariantColors[variant]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(displayValue)}%</span>
        </div>
      )}
    </div>
  );
}

export { Progress, RadialProgress }
