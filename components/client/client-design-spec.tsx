"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClientDesignSpecProps {
  design: any;
}

export function ClientDesignSpec({ design }: ClientDesignSpecProps) {
  if (!design) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-stone-500">
            Design specifications not available.
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
        {design.theme_id && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Theme</div>
            <Badge>{design.theme_id}</Badge>
          </div>
        )}

        {(design.primary_color || design.accent_color) && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Colors</div>
            <div className="flex gap-4">
              {design.primary_color && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Primary</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-stone-200"
                      style={{ backgroundColor: design.primary_color }}
                    />
                    <span className="text-sm font-mono">{design.primary_color}</span>
                  </div>
                </div>
              )}
              {design.accent_color && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Accent</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-stone-200"
                      style={{ backgroundColor: design.accent_color }}
                    />
                    <span className="text-sm font-mono">{design.accent_color}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(design.heading_font || design.body_font) && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Typography</div>
            <div className="space-y-2">
              {design.heading_font && (
                <div>
                  <div className="text-xs text-stone-500">Heading</div>
                  <div className="text-sm">{design.heading_font}</div>
                </div>
              )}
              {design.body_font && (
                <div>
                  <div className="text-xs text-stone-500">Body</div>
                  <div className="text-sm">{design.body_font}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {design.corner_radius && (
          <div>
            <div className="text-sm font-medium text-stone-700 mb-2">Corner Radius</div>
            <Badge variant="outline">{design.corner_radius}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

