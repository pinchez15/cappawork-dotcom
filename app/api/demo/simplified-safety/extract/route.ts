import { NextResponse } from "next/server";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { buildSimulatedExtraction, getSample } from "@/lib/demo/simplified-safety/samples";
import type { ExtractionResult, RoofFeature } from "@/lib/demo/simplified-safety/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const FeatureSchema = z.object({
  id: z.string(),
  kind: z.enum(["edge", "hatch", "skylight", "hvac", "access", "parapet"]),
  label: z.string(),
  bbox: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }),
  lengthFt: z.number().optional(),
  widthFt: z.number().optional(),
  heightIn: z.number().optional(),
  notes: z.string().optional(),
  confidence: z.number(),
});

const ExtractionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  assumptions: z.array(z.string()),
  roofOutline: z.array(z.object({ x: z.number(), y: z.number() })),
  perimeterFt: z.number(),
  edgeLengthsFt: z.array(z.number()),
  estimatedAreaSqFt: z.number(),
  scale: z.object({
    pixelsPerFoot: z.number(),
    basis: z.string(),
  }),
  features: z.array(FeatureSchema),
});

function parseJsonText(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Model returned no JSON object");
  return JSON.parse(text.slice(start, end + 1));
}

const SYSTEM = `You are a rooftop fall-protection takeoff assistant for Simplified Safety (Kee Safety).
Given a satellite roof photo or a roof plan / blueprint image, extract:
- roof outline as normalized polygon points (x,y in 0–1)
- edge lengths in feet and total perimeter
- features: edges, parapets, hatches, skylights, HVAC units, roof access points
- each feature needs id, kind, label, bbox {x,y,w,h} normalized 0–1, confidence 0–1
- clear assumptions when scale is unknown

Reply with ONE JSON object matching the schema. No prose, no markdown fences.
If scale is unknown, assume a typical commercial roof and state that in assumptions.
Prefer under-counting features over inventing them.`;

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Preloaded sample shortcut
    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (body?.sampleId) {
        const sample = getSample(String(body.sampleId));
        if (!sample) {
          return NextResponse.json({ error: "Unknown sample" }, { status: 404 });
        }
        return NextResponse.json({ extraction: sample.extraction, mode: "precomputed" });
      }
    }

    const form = await req.formData();
    const file = form.get("image");
    const sampleId = form.get("sampleId");

    if (typeof sampleId === "string" && sampleId) {
      const sample = getSample(sampleId);
      if (!sample) {
        return NextResponse.json({ error: "Unknown sample" }, { status: 404 });
      }
      return NextResponse.json({ extraction: sample.extraction, mode: "precomputed" });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "image file or sampleId required" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const mediaType = file.type || "image/png";
    const dataUrl = `data:${mediaType};base64,${bytes.toString("base64")}`;

    const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

    if (!hasAnthropic && !hasOpenAI) {
      const extraction = buildSimulatedExtraction(file.name);
      return NextResponse.json({
        extraction,
        mode: "simulated",
        notice:
          "No ANTHROPIC_API_KEY or OPENAI_API_KEY set. Returning a clearly labeled simulated extraction.",
      });
    }

    if (hasAnthropic) {
      const result = await generateText({
        model: anthropic("claude-sonnet-4-5"),
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract the rooftop takeoff JSON for this image (${file.name}). Schema keys: title, summary, assumptions[], roofOutline[{x,y}], perimeterFt, edgeLengthsFt[], estimatedAreaSqFt, scale{pixelsPerFoot,basis}, features[{id,kind,label,bbox{x,y,w,h},lengthFt?,widthFt?,heightIn?,notes?,confidence}].`,
              },
              {
                type: "image",
                image: dataUrl,
              },
            ],
          },
        ],
        maxOutputTokens: 4000,
      });

      const parsed = ExtractionSchema.parse(parseJsonText(result.text));
      const extraction: ExtractionResult = {
        source: "live_ai",
        ...parsed,
        features: parsed.features as RoofFeature[],
      };
      return NextResponse.json({ extraction, mode: "live_ai", provider: "anthropic" });
    }

    // OpenAI fallback via fetch (no openai SDK in package.json)
    const b64 = bytes.toString("base64");
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Extract the rooftop takeoff JSON for this image (${file.name}).`,
              },
              {
                type: "image_url",
                image_url: { url: `data:${mediaType};base64,${b64}` },
              },
            ],
          },
        ],
        max_tokens: 4000,
      }),
    });

    if (!openaiRes.ok) {
      const extraction = buildSimulatedExtraction(file.name);
      return NextResponse.json({
        extraction,
        mode: "simulated",
        notice: `OpenAI call failed (${openaiRes.status}); using simulated extraction.`,
      });
    }

    const openaiJson = (await openaiRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = openaiJson.choices?.[0]?.message?.content ?? "";
    const parsed = ExtractionSchema.parse(parseJsonText(text));
    const extraction: ExtractionResult = {
      source: "live_ai",
      ...parsed,
      features: parsed.features as RoofFeature[],
    };
    return NextResponse.json({ extraction, mode: "live_ai", provider: "openai" });
  } catch (err) {
    console.error("[simplified-safety extract]", err);
    const extraction = buildSimulatedExtraction("upload");
    return NextResponse.json({
      extraction,
      mode: "simulated",
      notice: `Extraction error — falling back to simulated result. ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    });
  }
}
