"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Sparkles, Save } from "lucide-react";
import { DesignSystemPicker, DESIGN_SYSTEMS, DesignSystem } from "./design-system-picker";
import { animations } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

interface ClientDesignSpecProps {
  design: any;
  projectId: string;
}

export function ClientDesignSpec({ design, projectId }: ClientDesignSpecProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<DesignSystem | null>(
    design?.theme_id ? DESIGN_SYSTEMS.find(s => s.id === design.theme_id) || null : null
  );

  const isConfigured = design && (design.theme_id || design.primary_color);
  const isFinalized = design?.onboarding_completed;

  const handleSelect = (system: DesignSystem) => {
    setSelectedSystem(system);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedSystem) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/design`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme_id: selectedSystem.id,
            primary_color: selectedSystem.tokens.primary,
            accent_color: selectedSystem.tokens.accent,
            heading_font: selectedSystem.tokens.fontHeading,
            body_font: selectedSystem.tokens.fontBody,
            corner_radius: getCornerRadiusValue(selectedSystem.tokens.borderRadius),
          }),
        });

        if (!response.ok) throw new Error("Failed to save design");

        setHasChanges(false);
        toast({
          title: "Design Saved",
          description: `Your ${selectedSystem.name} design preference has been saved.`,
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

  // Convert pixel radius to our corner radius values
  function getCornerRadiusValue(radius: string): string {
    if (radius === "0px") return "none";
    if (radius === "4px") return "sm";
    if (radius === "8px") return "md";
    if (radius === "12px" || radius === "16px") return "lg";
    if (radius === "20px") return "xl";
    return "md";
  }

  // Not configured yet - show waiting state
  if (!isConfigured && !selectedSystem) {
    return (
      <div className={`space-y-6 ${animations.fadeIn}`}>
        {/* Intro Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-1">
                  Choose Your Design Style
                </h3>
                <p className="text-stone-600">
                  Select a design system that matches your vision. Each style includes colors,
                  typography, and component styling that will be applied throughout your project.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Design System Picker */}
        <Card>
          <CardContent className="pt-6">
            <DesignSystemPicker
              selectedId={undefined}
              onSelect={handleSelect}
              readOnly={false}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        {selectedSystem && (
          <div className="flex justify-end gap-3">
            <Button onClick={handleSave} disabled={isPending}>
              <Save className="h-4 w-4 mr-2" />
              {isPending ? "Saving..." : "Save Selection"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${animations.fadeIn}`}>
      {/* Status Banner */}
      <Card className={isFinalized ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isFinalized ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Sparkles className="h-5 w-5 text-blue-600" />
              )}
              <div>
                <span className={`font-medium ${isFinalized ? "text-green-800" : "text-blue-800"}`}>
                  {isFinalized ? "Design Finalized" : "Design Selected"}
                </span>
                <span className={`ml-2 text-sm ${isFinalized ? "text-green-600" : "text-blue-600"}`}>
                  {isFinalized
                    ? "Your design is locked in and being implemented."
                    : "You can still change your selection before the project begins."}
                </span>
              </div>
            </div>
            {hasChanges && !isFinalized && (
              <Button size="sm" onClick={handleSave} disabled={isPending}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Selection Info */}
      {selectedSystem && (
        <Card className="border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary px-3 py-1 text-sm">
                  {selectedSystem.name}
                </Badge>
                <span className="text-stone-600 text-sm">{selectedSystem.description}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Design System Picker */}
      <Card>
        <CardContent className="pt-6">
          <DesignSystemPicker
            selectedId={selectedSystem?.id || design?.theme_id || "base"}
            onSelect={handleSelect}
            readOnly={isFinalized}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && !isFinalized && (
        <div className="flex justify-end gap-3">
          <Button onClick={handleSave} disabled={isPending}>
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Save Selection"}
          </Button>
        </div>
      )}
    </div>
  );
}
