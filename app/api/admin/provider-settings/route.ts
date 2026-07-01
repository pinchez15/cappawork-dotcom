import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getAllProviderSettings,
  upsertProviderSetting,
} from "@/server/repos/provider-settings";
import { ProviderSettingsSchema } from "@/lib/validators/list-builder";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getAllProviderSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = ProviderSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const setting = await upsertProviderSetting(
      parsed.data.provider,
      parsed.data.api_key,
      parsed.data.config
    );

    return NextResponse.json({
      provider: setting.provider,
      is_active: setting.is_active,
      has_key: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
