import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { getDeal, STAGES } from "@/server/repos/bd-deals";
import { getDiscoveryView } from "@/server/repos/discovery";
import { DiscoveryTab } from "@/components/admin/discovery/discovery-tab";
import { Badge } from "@/components/ui/badge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ dealId: string }> };

export default async function PipelineDealDiscoveryPage({ params }: Props) {
  await requireAdmin();
  const { dealId } = await params;
  const [deal, discovery] = await Promise.all([getDeal(dealId), getDiscoveryView(dealId)]);
  if (!deal) notFound();

  const stage = STAGES.find((s) => s.id === deal.stage);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin/pipeline"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 mb-4"
      >
        <ChevronLeft className="h-4 w-4" /> Pipeline
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-stone-900">{deal.name}</h1>
          {stage && <Badge className={`${stage.color} text-stone-700`}>{stage.label}</Badge>}
        </div>
        <p className="text-stone-500 mt-1">
          {[
            deal.company,
            deal.contact_name && `${deal.contact_name}${deal.contact_title ? `, ${deal.contact_title}` : ""}`,
            deal.value && `$${deal.value.toLocaleString("en-US")}`,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <DiscoveryTab dealId={dealId} companyName={deal.company || deal.name} initialView={discovery} />
    </div>
  );
}
