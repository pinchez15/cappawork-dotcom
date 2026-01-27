"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DesignSpecProps {
  projectId: string;
  initialDesign: any;
}

export function DesignSpec({ projectId, initialDesign }: DesignSpecProps) {
  if (!initialDesign) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-stone-500">
            Design selections not yet completed. Client needs to complete onboarding.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {initialDesign.theme_id && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Theme</div>
            <Badge>{initialDesign.theme_id}</Badge>
          </div>
        )}

        {(initialDesign.primary_color || initialDesign.accent_color) && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Colors</div>
            <div className="flex gap-4">
              {initialDesign.primary_color && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Primary</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-stone-200"
                      style={{ backgroundColor: initialDesign.primary_color }}
                    />
                    <span className="text-sm font-mono">{initialDesign.primary_color}</span>
                  </div>
                </div>
              )}
              {initialDesign.accent_color && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Accent</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-stone-200"
                      style={{ backgroundColor: initialDesign.accent_color }}
                    />
                    <span className="text-sm font-mono">{initialDesign.accent_color}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(initialDesign.heading_font || initialDesign.body_font) && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Typography</div>
            <div className="space-y-2">
              {initialDesign.heading_font && (
                <div>
                  <div className="text-xs text-stone-500">Heading</div>
                  <div className="text-sm">{initialDesign.heading_font}</div>
                </div>
              )}
              {initialDesign.body_font && (
                <div>
                  <div className="text-xs text-stone-500">Body</div>
                  <div className="text-sm">{initialDesign.body_font}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {initialDesign.corner_radius && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Corner Radius</div>
            <Badge variant="outline">{initialDesign.corner_radius}</Badge>
          </div>
        )}

        <div>
          <div className="text-sm font-medium text-stone-700 mb-2">Onboarding Status</div>
          <Badge
            className={
              initialDesign.onboarding_completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }
          >
            {initialDesign.onboarding_completed ? "Completed" : "Pending"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

