"use client";

import { DesignPreview } from "./design-preview";

interface ClientDesignSpecProps {
  design: any;
}

export function ClientDesignSpec({ design }: ClientDesignSpecProps) {
  return <DesignPreview design={design} />;
}
