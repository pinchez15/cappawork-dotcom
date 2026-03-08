import { getProspects, getProspectStats } from "@/server/repos/prospects";
import { getVerticals } from "@/server/repos/verticals";
import { ProspectDashboard } from "@/components/admin/prospect-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProspectsPage() {
  const [{ prospects }, stats, verticals] = await Promise.all([
    getProspects({ limit: 100 }),
    getProspectStats(),
    getVerticals(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProspectDashboard
        initialProspects={prospects}
        stats={stats}
        verticals={verticals}
      />
    </div>
  );
}
