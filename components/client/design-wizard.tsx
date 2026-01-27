"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { upsertDesign } from "@/server/repos/design";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Theme {
  id: string;
  name: string;
  description: string | null;
  preview_colors: string[] | null;
}

interface DesignWizardProps {
  projectId: string;
  themes: Theme[];
  initialDesign: any;
}

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Merriweather",
];

const CORNER_RADIUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra Large" },
  { value: "full", label: "Fully Rounded" },
];

export function DesignWizard({ projectId, themes, initialDesign }: DesignWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [design, setDesign] = useState({
    theme_id: initialDesign?.theme_id || "",
    primary_color: initialDesign?.primary_color || "",
    accent_color: initialDesign?.accent_color || "",
    heading_font: initialDesign?.heading_font || "",
    body_font: initialDesign?.body_font || "",
    corner_radius: initialDesign?.corner_radius || "md",
  });

  const handleNext = () => {
    if (step === 1 && !design.theme_id) {
      toast.error("Please select a theme");
      return;
    }
    if (step === 2 && (!design.primary_color || !design.accent_color)) {
      toast.error("Please select both primary and accent colors");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      await upsertDesign(projectId, {
        ...design,
        onboarding_completed: true,
      });
      toast.success("Design preferences saved!");
      router.push(`/projects/${projectId}`);
    } catch (error) {
      toast.error("Failed to save design preferences");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2">
          Design Selection
        </h1>
        <p className="text-stone-600">
          Step {step} of 3: {step === 1 && "Choose Theme"}
          {step === 2 && "Customize Colors & Fonts"}
          {step === 3 && "Review & Confirm"}
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Choose a Base Theme
                </Label>
                <RadioGroup
                  value={design.theme_id}
                  onValueChange={(value) =>
                    setDesign({ ...design, theme_id: value })
                  }
                  className="space-y-3"
                >
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className="flex items-start space-x-3 border border-stone-200 rounded-lg p-4 hover:border-stone-300 cursor-pointer"
                    >
                      <RadioGroupItem value={theme.id} id={theme.id} />
                      <Label
                        htmlFor={theme.id}
                        className="flex-1 cursor-pointer space-y-2"
                      >
                        <div className="font-medium">{theme.name}</div>
                        {theme.description && (
                          <div className="text-sm text-stone-600">
                            {theme.description}
                          </div>
                        )}
                        {theme.preview_colors && (
                          <div className="flex gap-2 mt-2">
                            {theme.preview_colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-8 h-8 rounded border border-stone-200"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Colors</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={design.primary_color || "#000000"}
                        onChange={(e) =>
                          setDesign({ ...design, primary_color: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={design.primary_color}
                        onChange={(e) =>
                          setDesign({ ...design, primary_color: e.target.value })
                        }
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={design.accent_color || "#3B82F6"}
                        onChange={(e) =>
                          setDesign({ ...design, accent_color: e.target.value })
                        }
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={design.accent_color}
                        onChange={(e) =>
                          setDesign({ ...design, accent_color: e.target.value })
                        }
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Typography</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="heading_font">Heading Font</Label>
                    <Select
                      value={design.heading_font}
                      onValueChange={(value) =>
                        setDesign({ ...design, heading_font: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
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
                    <Label htmlFor="body_font">Body Font</Label>
                    <Select
                      value={design.body_font}
                      onValueChange={(value) =>
                        setDesign({ ...design, body_font: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
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
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">
                  Corner Radius Preference
                </Label>
                <Select
                  value={design.corner_radius}
                  onValueChange={(value) =>
                    setDesign({ ...design, corner_radius: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CORNER_RADIUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Review Your Selections
                </Label>
              </div>
              <div className="space-y-4 border border-stone-200 rounded-lg p-4">
                <div>
                  <div className="text-sm font-medium text-stone-700">Theme</div>
                  <div className="text-stone-900">
                    {themes.find((t) => t.id === design.theme_id)?.name || "Not selected"}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-stone-700">Colors</div>
                  <div className="flex gap-4 mt-2">
                    {design.primary_color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-stone-200"
                          style={{ backgroundColor: design.primary_color }}
                        />
                        <span className="text-sm">{design.primary_color}</span>
                      </div>
                    )}
                    {design.accent_color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-stone-200"
                          style={{ backgroundColor: design.accent_color }}
                        />
                        <span className="text-sm">{design.accent_color}</span>
                      </div>
                    )}
                  </div>
                </div>
                {(design.heading_font || design.body_font) && (
                  <div>
                    <div className="text-sm font-medium text-stone-700">Typography</div>
                    <div className="text-stone-900">
                      {design.heading_font && `Heading: ${design.heading_font}`}
                      {design.heading_font && design.body_font && " • "}
                      {design.body_font && `Body: ${design.body_font}`}
                    </div>
                  </div>
                )}
                {design.corner_radius && (
                  <div>
                    <div className="text-sm font-medium text-stone-700">Corner Radius</div>
                    <div className="text-stone-900 capitalize">{design.corner_radius}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Confirm & Save
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

