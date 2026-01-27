"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Type,
  Square,
  Check,
  Sparkles,
  Eye,
  Save,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Design system presets
const DESIGN_SYSTEMS = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple with lots of white space",
    primaryColor: "#18181B",
    accentColor: "#71717A",
    headingFont: "Inter",
    bodyFont: "Inter",
    cornerRadius: "md" as const,
    preview: {
      bg: "#FFFFFF",
      card: "#FAFAFA",
    },
  },
  {
    id: "neo_brutalist",
    name: "Neo Brutalist",
    description: "Bold borders, high contrast, playful design with cyan and magenta",
    primaryColor: "#00D4FF",
    accentColor: "#FF00FF",
    headingFont: "Space Grotesk",
    bodyFont: "Inter",
    cornerRadius: "none" as const,
    preview: {
      bg: "#FFFEF0",
      card: "#FFFFFF",
    },
  },
  {
    id: "soft_corporate",
    name: "Soft Corporate",
    description: "Professional with soft edges and trust-building colors",
    primaryColor: "#3B82F6",
    accentColor: "#10B981",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    cornerRadius: "lg" as const,
    preview: {
      bg: "#F8FAFC",
      card: "#FFFFFF",
    },
  },
  {
    id: "dark_mode",
    name: "Dark Mode",
    description: "Sleek dark interface for modern SaaS apps",
    primaryColor: "#818CF8",
    accentColor: "#34D399",
    headingFont: "Geist",
    bodyFont: "Geist",
    cornerRadius: "md" as const,
    preview: {
      bg: "#0F172A",
      card: "#1E293B",
    },
  },
  {
    id: "warm_friendly",
    name: "Warm & Friendly",
    description: "Inviting colors with rounded edges for consumer apps",
    primaryColor: "#F97316",
    accentColor: "#EC4899",
    headingFont: "Poppins",
    bodyFont: "Open Sans",
    cornerRadius: "xl" as const,
    preview: {
      bg: "#FFFBEB",
      card: "#FFFFFF",
    },
  },
  {
    id: "canvas_platform",
    name: "Canvas Platform",
    description: "Neutral canvas style perfect for creative tools",
    primaryColor: "#6366F1",
    accentColor: "#F59E0B",
    headingFont: "DM Sans",
    bodyFont: "DM Sans",
    cornerRadius: "sm" as const,
    preview: {
      bg: "#F5F5F4",
      card: "#FFFFFF",
    },
  },
];

const FONT_OPTIONS = [
  "Inter",
  "Space Grotesk",
  "Plus Jakarta Sans",
  "Geist",
  "Poppins",
  "Open Sans",
  "DM Sans",
  "Roboto",
  "Lato",
  "Montserrat",
];

const CORNER_OPTIONS = [
  { value: "none", label: "None (Sharp)", description: "0px" },
  { value: "sm", label: "Small", description: "4px" },
  { value: "md", label: "Medium", description: "8px" },
  { value: "lg", label: "Large", description: "12px" },
  { value: "xl", label: "Extra Large", description: "16px" },
  { value: "full", label: "Full (Pill)", description: "9999px" },
];

interface DesignSpecProps {
  projectId: string;
  initialDesign: any;
}

export function DesignSpec({ projectId, initialDesign }: DesignSpecProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Form state
  const [selectedSystem, setSelectedSystem] = useState<string>(initialDesign?.theme_id || "");
  const [primaryColor, setPrimaryColor] = useState(initialDesign?.primary_color || "#3B82F6");
  const [accentColor, setAccentColor] = useState(initialDesign?.accent_color || "#10B981");
  const [headingFont, setHeadingFont] = useState(initialDesign?.heading_font || "Inter");
  const [bodyFont, setBodyFont] = useState(initialDesign?.body_font || "Inter");
  const [cornerRadius, setCornerRadius] = useState(initialDesign?.corner_radius || "md");
  const [isFinalized, setIsFinalized] = useState(initialDesign?.onboarding_completed || false);

  // Apply preset
  const applyPreset = (preset: typeof DESIGN_SYSTEMS[0]) => {
    setSelectedSystem(preset.id);
    setPrimaryColor(preset.primaryColor);
    setAccentColor(preset.accentColor);
    setHeadingFont(preset.headingFont);
    setBodyFont(preset.bodyFont);
    setCornerRadius(preset.cornerRadius);
  };

  // Save design
  const handleSave = async (finalize: boolean = false) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}/design`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme_id: selectedSystem,
            primary_color: primaryColor,
            accent_color: accentColor,
            heading_font: headingFont,
            body_font: bodyFont,
            corner_radius: cornerRadius,
            onboarding_completed: finalize,
          }),
        });

        if (!response.ok) throw new Error("Failed to save design");

        if (finalize) setIsFinalized(true);

        toast({
          title: finalize ? "Design Finalized" : "Design Saved",
          description: finalize
            ? "The client can now view their design specifications."
            : "Design changes saved successfully.",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to save design. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const getRadiusValue = (radius: string) => {
    switch (radius) {
      case "none": return "0";
      case "sm": return "4px";
      case "md": return "8px";
      case "lg": return "12px";
      case "xl": return "16px";
      case "full": return "9999px";
      default: return "8px";
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <Card className={isFinalized ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isFinalized ? (
                <Lock className="h-5 w-5 text-green-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-amber-600" />
              )}
              <span className={`font-medium ${isFinalized ? "text-green-800" : "text-amber-800"}`}>
                {isFinalized ? "Design Finalized - Visible to Client" : "Draft - Not Visible to Client"}
              </span>
            </div>
            {!isFinalized && (
              <Button
                size="sm"
                onClick={() => handleSave(true)}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Finalize for Client
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="presets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="presets">
            <Sparkles className="h-4 w-4 mr-2" />
            Design Systems
          </TabsTrigger>
          <TabsTrigger value="customize">
            <Palette className="h-4 w-4 mr-2" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Design Systems Tab */}
        <TabsContent value="presets">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Design System</CardTitle>
              <CardDescription>
                Select a preset that matches the client&apos;s brand and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DESIGN_SYSTEMS.map((system) => (
                  <div
                    key={system.id}
                    onClick={() => applyPreset(system)}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                      selectedSystem === system.id
                        ? "border-primary bg-primary/5"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    {selectedSystem === system.id && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary text-white rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}

                    {/* Preview */}
                    <div
                      className="h-24 rounded-lg mb-3 flex items-end p-2 overflow-hidden"
                      style={{
                        backgroundColor: system.preview.bg,
                        border: system.id === "neo_brutalist" ? "3px solid black" : "1px solid #e5e5e5",
                      }}
                    >
                      <div
                        className="w-full h-12 rounded p-2"
                        style={{
                          backgroundColor: system.preview.card,
                          borderRadius: getRadiusValue(system.cornerRadius),
                          border: system.id === "neo_brutalist" ? "2px solid black" : "none",
                          boxShadow: system.id === "neo_brutalist" ? "3px 3px 0 black" : "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <div className="flex gap-2">
                          <div
                            className="h-3 w-12 rounded"
                            style={{
                              backgroundColor: system.primaryColor,
                              borderRadius: getRadiusValue(system.cornerRadius),
                            }}
                          />
                          <div
                            className="h-3 w-8 rounded"
                            style={{
                              backgroundColor: system.accentColor,
                              borderRadius: getRadiusValue(system.cornerRadius),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium text-stone-900 mb-1">{system.name}</h4>
                    <p className="text-xs text-stone-500">{system.description}</p>

                    <div className="flex gap-2 mt-3">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: system.primaryColor }}
                        title="Primary"
                      />
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: system.accentColor }}
                        title="Accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Select value={headingFont} onValueChange={setHeadingFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Select value={bodyFont} onValueChange={setBodyFont}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Corner Radius */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  Corner Radius
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {CORNER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCornerRadius(option.value)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                        cornerRadius === option.value
                          ? "border-primary bg-primary/5"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div
                        className="w-10 h-10 border-2 border-stone-400 bg-stone-100"
                        style={{ borderRadius: getRadiusValue(option.value) }}
                      />
                      <div className="text-left">
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-stone-500">{option.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how the design will look with your current selections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-lg border p-8"
                style={{
                  backgroundColor:
                    selectedSystem && DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.preview.bg || "#FFFFFF",
                }}
              >
                <div
                  className="rounded-lg p-6 shadow-sm"
                  style={{
                    backgroundColor:
                      selectedSystem && DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.preview.card || "#FFFFFF",
                    borderRadius: getRadiusValue(cornerRadius),
                    border: selectedSystem === "neo_brutalist" ? "3px solid black" : "1px solid #e5e5e5",
                    boxShadow: selectedSystem === "neo_brutalist" ? "6px 6px 0 black" : "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{
                      color: primaryColor,
                      fontFamily: headingFont,
                    }}
                  >
                    Sample Dashboard
                  </h2>
                  <p
                    className="text-stone-600 mb-6"
                    style={{ fontFamily: bodyFont }}
                  >
                    This is how content will appear with your selected design system. The colors,
                    typography, and corner radius all work together to create a cohesive look.
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="px-6 py-2.5 text-sm font-medium text-white"
                      style={{
                        backgroundColor: primaryColor,
                        borderRadius: getRadiusValue(cornerRadius),
                        border: selectedSystem === "neo_brutalist" ? "2px solid black" : "none",
                        boxShadow: selectedSystem === "neo_brutalist" ? "3px 3px 0 black" : "none",
                        fontFamily: bodyFont,
                      }}
                    >
                      Primary Action
                    </button>
                    <button
                      className="px-6 py-2.5 text-sm font-medium"
                      style={{
                        backgroundColor: "transparent",
                        color: accentColor,
                        border: `2px solid ${accentColor}`,
                        borderRadius: getRadiusValue(cornerRadius),
                        fontFamily: bodyFont,
                      }}
                    >
                      Secondary
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-4"
                        style={{
                          backgroundColor:
                            selectedSystem && DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.preview.bg || "#F5F5F5",
                          borderRadius: getRadiusValue(cornerRadius),
                          border: selectedSystem === "neo_brutalist" ? "2px solid black" : "1px solid #e5e5e5",
                        }}
                      >
                        <div
                          className="h-4 w-16 mb-2"
                          style={{
                            backgroundColor: i === 1 ? primaryColor : i === 2 ? accentColor : "#CBD5E1",
                            borderRadius: getRadiusValue(cornerRadius),
                          }}
                        />
                        <div className="h-2 w-full bg-stone-200 rounded mb-1" />
                        <div className="h-2 w-3/4 bg-stone-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => handleSave(false)} disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      </div>
    </div>
  );
}
