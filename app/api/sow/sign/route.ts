import { NextRequest, NextResponse } from "next/server";
import { signSowAction } from "@/server/actions/sow";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.token || !body.signerName || !body.signerEmail || !body.signatureDataUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get client IP from headers
    const signerIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    await signSowAction({
      token: body.token,
      signerName: body.signerName,
      signerEmail: body.signerEmail,
      signatureDataUrl: body.signatureDataUrl,
      signerIp,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signing failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
