"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  Unlock,
  User,
  Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DesignSystemPicker, DESIGN_SYSTEMS, DesignSystem } from "@/components/client/design-system-picker";
import gsap from "gsap";

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
  { value: "none", label: "None (Sharp)", description: "0px", px: "0" },
  { value: "sm", label: "Small", description: "4px", px: "4px" },
  { value: "md", label: "Medium", description: "8px", px: "8px" },
  { value: "lg", label: "Large", description: "12px", px: "12px" },
  { value: "xl", label: "Extra Large", description: "16px", px: "16px" },
  { value: "full", label: "Full (Pill)", description: "9999px", px: "9999px" },
];

const SHADOW_OPTIONS = [
  { value: "none", label: "None", css: "none" },
  { value: "sm", label: "Small", css: "0 1px 2px rgba(0,0,0,0.05)" },
  { value: "md", label: "Medium", css: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  { value: "lg", label: "Large", css: "0 10px 15px -3px rgba(0,0,0,0.1)" },
  { value: "xl", label: "Extra Large", css: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  { value: "brutal", label: "Brutal", css: "4px 4px 0 #000000" },
];

const BUTTON_STYLES = [
  { value: "solid", label: "Solid", description: "Filled background" },
  { value: "outline", label: "Outline", description: "Border only" },
  { value: "ghost", label: "Ghost", description: "Transparent with hover" },
  { value: "brutal", label: "Brutal", description: "Bold shadow offset" },
];

interface DesignSpecProps {
  projectId: string;
  initialDesign: any;
}

export function DesignSpec({ projectId, initialDesign }: DesignSpecProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  // Form state
  const [selectedSystem, setSelectedSystem] = useState<string>(initialDesign?.theme_id || "");
  const [primaryColor, setPrimaryColor] = useState(initialDesign?.primary_color || "#3B82F6");
  const [accentColor, setAccentColor] = useState(initialDesign?.accent_color || "#10B981");
  const [headingFont, setHeadingFont] = useState(initialDesign?.heading_font || "Inter");
  const [bodyFont, setBodyFont] = useState(initialDesign?.body_font || "Inter");
  const [cornerRadius, setCornerRadius] = useState(initialDesign?.corner_radius || "md");
  const [shadowStyle, setShadowStyle] = useState(initialDesign?.shadow_style || "md");
  const [buttonStyle, setButtonStyle] = useState(initialDesign?.button_style || "solid");
  const [borderWidth, setBorderWidth] = useState(initialDesign?.border_width || 1);
  const [isFinalized, setIsFinalized] = useState(initialDesign?.onboarding_completed || false);

  // Client's recommendation (from their selection)
  const clientRecommendation = initialDesign?.theme_id;
  const hasClientRecommendation = !!clientRecommendation && !isFinalized;

  // GSAP animation when preview updates
  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { opacity: 0.7, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [selectedSystem, primaryColor, accentColor, cornerRadius, shadowStyle, buttonStyle]);

  // Apply preset from design system picker
  const handleSystemSelect = (system: DesignSystem) => {
    setSelectedSystem(system.id);
    setPrimaryColor(system.tokens.primary);
    setAccentColor(system.tokens.accent);
    setHeadingFont(system.tokens.fontHeading);
    setBodyFont(system.tokens.fontBody);

    // Map border radius
    const radiusMap: Record<string, string> = {
      "0px": "none",
      "4px": "sm",
      "8px": "md",
      "12px": "lg",
      "16px": "xl",
      "20px": "xl",
    };
    setCornerRadius(radiusMap[system.tokens.borderRadius] || "md");

    // Detect shadow style
    if (system.tokens.shadow.includes("4px 4px 0")) {
      setShadowStyle("brutal");
      setButtonStyle("brutal");
    } else if (system.tokens.shadow === "none") {
      setShadowStyle("none");
    } else {
      setShadowStyle("md");
    }

    // Animate the selection
    gsap.fromTo(
      ".design-system-card",
      { scale: 1 },
      { scale: 1.02, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );
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
            shadow_style: shadowStyle,
            button_style: buttonStyle,
            border_width: borderWidth,
            onboarding_completed: finalize,
          }),
        });

        if (!response.ok) throw new Error("Failed to save design");

        setIsFinalized(finalize);

        toast({
          title: finalize ? "Design Locked" : "Design Saved",
          description: finalize
            ? "The design is now locked and visible to the client."
            : "Design changes saved successfully.",
        });

        router.refresh();
      } catch {
        toast({
          title: "Error",
          description: "Failed to save design. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  // Unlock design
  const handleUnlock = async () => {
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
            shadow_style: shadowStyle,
            button_style: buttonStyle,
            border_width: borderWidth,
            onboarding_completed: false,
          }),
        });

        if (!response.ok) throw new Error("Failed to unlock design");

        setIsFinalized(false);

        toast({
          title: "Design Unlocked",
          description: "The client can now make changes to their design selection.",
        });

        router.refresh();
      } catch {
        toast({
          title: "Error",
          description: "Failed to unlock design. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const getRadiusValue = (radius: string) => {
    return CORNER_OPTIONS.find(o => o.value === radius)?.px || "8px";
  };

  const getShadowValue = (shadow: string) => {
    return SHADOW_OPTIONS.find(o => o.value === shadow)?.css || "none";
  };

  return (
    <div className="space-y-6">
      {/* Client Recommendation Banner */}
      {hasClientRecommendation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <span className="font-medium text-blue-800">Client Recommendation: </span>
                <Badge className="ml-2 bg-blue-100 text-blue-800">
                  {DESIGN_SYSTEMS.find(s => s.id === clientRecommendation)?.name || clientRecommendation}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const system = DESIGN_SYSTEMS.find(s => s.id === clientRecommendation);
                  if (system) handleSystemSelect(system);
                }}
                className="text-blue-600 border-blue-300"
              >
                Apply Recommendation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                {isFinalized ? "Design Locked - Visible to Client" : "Draft - Not Visible to Client"}
              </span>
            </div>
            <div className="flex gap-2">
              {isFinalized ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleUnlock}
                  disabled={isPending}
                  className="text-amber-600 border-amber-300 hover:bg-amber-100"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock Design
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleSave(true)}
                  disabled={isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock for Client
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="systems" className="space-y-6">
        <TabsList>
          <TabsTrigger value="systems">
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
        <TabsContent value="systems">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Design System</CardTitle>
              <CardDescription>
                Select a preset or use the client&apos;s recommendation as a starting point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DesignSystemPicker
                selectedId={selectedSystem}
                onSelect={handleSystemSelect}
                readOnly={false}
              />
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

            {/* Button Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Button Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {BUTTON_STYLES.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setButtonStyle(style.value)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        buttonStyle === style.value
                          ? "border-primary bg-primary/5"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div className="font-medium text-sm">{style.label}</div>
                      <div className="text-xs text-stone-500">{style.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shadow Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  Shadow Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {SHADOW_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setShadowStyle(option.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        shadowStyle === option.value
                          ? "border-primary bg-primary/5"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-lg bg-white border border-stone-200"
                        style={{ boxShadow: option.css }}
                      />
                      <div className="font-medium text-xs">{option.label}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Corner Radius & Border */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Square className="h-5 w-5" />
                  Corner Radius & Border
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Corner Radius</Label>
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
                          style={{ borderRadius: option.px }}
                        />
                        <div className="text-left">
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs text-stone-500">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Border Width: {borderWidth}px</Label>
                  <Slider
                    value={[borderWidth]}
                    onValueChange={(v) => setBorderWidth(v[0])}
                    min={0}
                    max={4}
                    step={1}
                    className="w-full max-w-md"
                  />
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
                ref={previewRef}
                className="rounded-lg border p-8 transition-all"
                style={{
                  backgroundColor: DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.background || "#FFFFFF",
                }}
              >
                <div
                  className="rounded-lg p-6"
                  style={{
                    backgroundColor: DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.card || "#FFFFFF",
                    borderRadius: getRadiusValue(cornerRadius),
                    border: `${borderWidth}px solid ${DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.border || "#e5e5e5"}`,
                    boxShadow: getShadowValue(shadowStyle),
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
                    className="mb-6"
                    style={{
                      color: DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.mutedForeground || "#666",
                      fontFamily: bodyFont,
                    }}
                  >
                    This is how content will appear with your selected design system.
                  </p>

                  <div className="flex gap-3 mb-6">
                    {/* Primary Button */}
                    <button
                      className="px-6 py-2.5 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: buttonStyle === "solid" || buttonStyle === "brutal" ? primaryColor : "transparent",
                        color: buttonStyle === "solid" || buttonStyle === "brutal"
                          ? "#ffffff"
                          : primaryColor,
                        borderRadius: getRadiusValue(cornerRadius),
                        border: buttonStyle === "outline" || buttonStyle === "ghost"
                          ? `2px solid ${primaryColor}`
                          : buttonStyle === "brutal"
                            ? `${borderWidth}px solid #000`
                            : "none",
                        boxShadow: buttonStyle === "brutal" ? "4px 4px 0 #000" : "none",
                        fontFamily: bodyFont,
                      }}
                    >
                      Primary Action
                    </button>
                    {/* Secondary Button */}
                    <button
                      className="px-6 py-2.5 text-sm font-medium transition-all"
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

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Revenue", value: "$15,231", color: primaryColor },
                      { label: "Users", value: "2,350", color: accentColor },
                      { label: "Growth", value: "+12%", color: primaryColor },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="p-4"
                        style={{
                          backgroundColor: DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.background || "#F5F5F5",
                          borderRadius: getRadiusValue(cornerRadius),
                          border: `${borderWidth}px solid ${DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.border || "#e5e5e5"}`,
                          boxShadow: getShadowValue(shadowStyle),
                        }}
                      >
                        <div
                          className="text-xs mb-1"
                          style={{
                            color: DESIGN_SYSTEMS.find((s) => s.id === selectedSystem)?.tokens.mutedForeground || "#666",
                          }}
                        >
                          {stat.label}
                        </div>
                        <div
                          className="text-xl font-bold"
                          style={{ color: stat.color, fontFamily: headingFont }}
                        >
                          {stat.value}
                        </div>
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
          {isPending ? "Saving..." : "Save Draft"}
        </Button>
      </div>
    </div>
  );
}
