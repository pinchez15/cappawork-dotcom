import {
  getCatalystsWithStats,
  getCatalystsDueForContact,
} from "@/server/repos/bd-catalysts";
import { CatalystsView } from "@/components/admin/catalysts-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function CatalystsPage() {
  const [catalysts, due] = await Promise.all([
    getCatalystsWithStats(),
    getCatalystsDueForContact(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CatalystsView catalysts={catalysts} due={due} />
    </div>
  );
}
