import { getGtmAccounts, getGtmStats } from "@/server/repos/gtm-accounts";
import { getVerticals } from "@/server/repos/verticals";
import { CrmDashboard } from "@/components/admin/crm/crm-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const [{ accounts }, stats, verticals] = await Promise.all([
    getGtmAccounts({ limit: 200 }),
    getGtmStats(),
    getVerticals(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CrmDashboard initialAccounts={accounts} stats={stats} verticals={verticals} />
    </div>
  );
}
