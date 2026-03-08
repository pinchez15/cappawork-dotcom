import { getVerticalsWithCounts } from "@/server/repos/verticals";
import { VerticalsView } from "@/components/admin/verticals-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function VerticalsPage() {
  const verticals = await getVerticalsWithCounts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <VerticalsView verticals={verticals} />
    </div>
  );
}
