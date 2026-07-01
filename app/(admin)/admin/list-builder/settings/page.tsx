import { getAllProviderSettings } from "@/server/repos/provider-settings";
import { ProviderSettingsView } from "@/components/admin/list-builder/provider-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProviderSettingsPage() {
  const settings = await getAllProviderSettings();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProviderSettingsView settings={settings} />
    </div>
  );
}
