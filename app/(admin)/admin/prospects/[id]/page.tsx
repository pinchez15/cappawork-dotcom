import { notFound } from "next/navigation";
import { getProspect } from "@/server/repos/prospects";
import { getActivitiesForProspect } from "@/server/repos/outreach-activities";
import { getSignalsForProspect } from "@/server/repos/signal-events";
import { ProspectDetail } from "@/components/admin/prospect-detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [prospect, activities, signals] = await Promise.all([
    getProspect(id),
    getActivitiesForProspect(id),
    getSignalsForProspect(id),
  ]);

  if (!prospect) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProspectDetail
        prospect={prospect}
        activities={activities}
        signals={signals}
      />
    </div>
  );
}
