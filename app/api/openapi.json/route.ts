import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

/**
 * Minimal OpenAPI 3.0 document for public HTTP APIs (service-desc in API catalog).
 */
export async function GET() {
  const base = getSiteUrl()
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "CappaWork public HTTP API",
      version: "1.0.0",
      description:
        "Machine-readable index of selected public endpoints. Authenticated admin and portal APIs are not listed here.",
    },
    servers: [{ url: `${base}/api` }],
    paths: {
      "/health": {
        get: {
          summary: "Service health",
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      ok: { type: "boolean" },
                      service: { type: "string" },
                      timestamp: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/service-inquiry": {
        post: {
          summary: "Submit a service inquiry (lead form)",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true },
              },
            },
          },
          responses: {
            "200": { description: "Accepted" },
            "400": { description: "Bad request" },
          },
        },
      },
    },
  }

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
