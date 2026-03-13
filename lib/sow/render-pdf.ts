import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { SowPdfDocument } from "./pdf-template";
import type { SowData } from "@/server/repos/sow";

export async function renderSowPdf(
  sowData: SowData,
  options?: {
    signatureDataUrl?: string | null;
    signedByName?: string | null;
    signedAt?: string | null;
  }
): Promise<Buffer> {
  const element = React.createElement(SowPdfDocument, {
    sowData,
    signatureDataUrl: options?.signatureDataUrl ?? null,
    signedByName: options?.signedByName ?? null,
    signedAt: options?.signedAt ?? null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any);
  return Buffer.from(buffer);
}
