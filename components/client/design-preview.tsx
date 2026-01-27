"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { animations } from "@/lib/animations";
import {
  Palette,
  Type,
  Square,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface DesignPreviewProps {
  design: any;
}

// Design system presets for visual reference
const DESIGN_SYSTEM_PRESETS: Record<string, {
  name: string;
  description: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
    card: string;
    radius: string;
  };
}> = {
  minimal: {
    name: "Minimal",
    description: "Clean and simple with lots of white space",
    preview: {
      primary: "#18181B",
      accent: "#71717A",
      background: "#FFFFFF",
      card: "#FAFAFA",
      radius: "8px",
    },
  },
  neo_brutalist: {
    name: "Neo Brutalist",
    description: "Bold borders, high contrast, playful",
    preview: {
      primary: "#00D4FF",
      accent: "#FF00FF",
      background: "#FFFEF0",
      card: "#FFFFFF",
      radius: "0px",
    },
  },
  soft_corporate: {
    name: "Soft Corporate",
    description: "Professional with soft edges and muted colors",
    preview: {
      primary: "#3B82F6",
      accent: "#10B981",
      background: "#F8FAFC",
      card: "#FFFFFF",
      radius: "12px",
    },
  },
  dark_mode: {
    name: "Dark Mode",
    description: "Sleek dark interface for modern apps",
    preview: {
      primary: "#818CF8",
      accent: "#34D399",
      background: "#0F172A",
      card: "#1E293B",
      radius: "8px",
    },
  },
};

export function DesignPreview({ design }: DesignPreviewProps) {
  const isConfigured = design && (design.theme_id || design.primary_color);
  const isFinalzied = design?.onboarding_completed;

  if (!isConfigured) {
    return (
      <Card className={`${animations.fadeIn}`}>
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-stone-100 rounded-full">
              <Clock className="h-8 w-8 text-stone-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-stone-900 mb-1">
                Design Configuration Pending
              </h3>
              <p className="text-stone-500 max-w-md">
                Your design specifications are being configured by the CappaWork team.
                You&apos;ll see a preview here once the design system has been selected.
              </p>
            </div>
            <Badge variant="outline" className="mt-2">
              <Clock className="h-3 w-3 mr-1" />
              Awaiting Configuration
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  const preset = design.theme_id ? DESIGN_SYSTEM_PRESETS[design.theme_id] : null;
  const primaryColor = design.primary_color || preset?.preview.primary || "#3B82F6";
  const accentColor = design.accent_color || preset?.preview.accent || "#10B981";

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Status Banner */}
      <Card className={isFinalzied ? "border-green-200 bg-green-50/50" : "border-amber-200 bg-amber-50/50"}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {isFinalzied ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <Sparkles className="h-5 w-5 text-amber-600" />
            )}
            <div>
              <span className={`font-medium ${isFinalzied ? "text-green-800" : "text-amber-800"}`}>
                {isFinalzied ? "Design Finalized" : "Design In Progress"}
              </span>
              <span className={`ml-2 text-sm ${isFinalzied ? "text-green-600" : "text-amber-600"}`}>
                {isFinalzied
                  ? "Your design specifications are locked in and ready for implementation."
                  : "The CappaWork team is refining your design. Changes may still occur."}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design System Card */}
      {preset && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Design System
              </CardTitle>
              <Badge className="bg-primary/10 text-primary">{preset.name}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-4">{preset.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Visual Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Visual Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Color Palette */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-stone-700 mb-3">Color Palette</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <div
                  className="h-24 rounded-lg border shadow-sm mb-2 flex items-end p-3"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="text-white text-sm font-medium drop-shadow">Primary</span>
                </div>
                <code className="text-xs text-stone-500">{primaryColor}</code>
              </div>
              <div className="flex-1">
                <div
                  className="h-24 rounded-lg border shadow-sm mb-2 flex items-end p-3"
                  style={{ backgroundColor: accentColor }}
                >
                  <span className="text-white text-sm font-medium drop-shadow">Accent</span>
                </div>
                <code className="text-xs text-stone-500">{accentColor}</code>
              </div>
            </div>
          </div>

          {/* Typography */}
          {(design.heading_font || design.body_font) && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography
              </h4>
              <div className="bg-stone-50 rounded-lg p-4 space-y-3">
                {design.heading_font && (
                  <div>
                    <span className="text-xs text-stone-500 block mb-1">Headings</span>
                    <span className="text-2xl font-bold" style={{ fontFamily: design.heading_font }}>
                      {design.heading_font}
                    </span>
                  </div>
                )}
                {design.body_font && (
                  <div>
                    <span className="text-xs text-stone-500 block mb-1">Body Text</span>
                    <span className="text-base" style={{ fontFamily: design.body_font }}>
                      {design.body_font} - The quick brown fox jumps over the lazy dog.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Corner Radius */}
          {design.corner_radius && (
            <div>
              <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
                <Square className="h-4 w-4" />
                Corner Style
              </h4>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 border-2 border-stone-300 bg-stone-100"
                  style={{
                    borderRadius:
                      design.corner_radius === "none"
                        ? "0"
                        : design.corner_radius === "sm"
                        ? "4px"
                        : design.corner_radius === "md"
                        ? "8px"
                        : design.corner_radius === "lg"
                        ? "12px"
                        : design.corner_radius === "xl"
                        ? "16px"
                        : "9999px",
                  }}
                />
                <div>
                  <Badge variant="outline" className="capitalize">
                    {design.corner_radius}
                  </Badge>
                  <p className="text-xs text-stone-500 mt-1">
                    {design.corner_radius === "none" && "Sharp, modern edges"}
                    {design.corner_radius === "sm" && "Subtle rounding"}
                    {design.corner_radius === "md" && "Balanced, friendly feel"}
                    {design.corner_radius === "lg" && "Soft, approachable"}
                    {design.corner_radius === "xl" && "Very rounded, playful"}
                    {design.corner_radius === "full" && "Pill-shaped elements"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Sample UI Preview */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-sm font-medium text-stone-700 mb-4">Sample UI</h4>
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: preset?.preview.background || "#FFFFFF",
                borderRadius: preset?.preview.radius || "8px",
              }}
            >
              <div
                className="rounded-lg p-4 mb-4 shadow-sm"
                style={{
                  backgroundColor: preset?.preview.card || "#FFFFFF",
                  borderRadius: preset?.preview.radius || "8px",
                }}
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: primaryColor,
                    fontFamily: design.heading_font || "inherit",
                  }}
                >
                  Sample Card Title
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{
                    color: "#64748B",
                    fontFamily: design.body_font || "inherit",
                  }}
                >
                  This is how your content will appear with the selected design system.
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-sm font-medium text-white"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: preset?.preview.radius || "8px",
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: "transparent",
                      color: accentColor,
                      border: `2px solid ${accentColor}`,
                      borderRadius: preset?.preview.radius || "8px",
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
