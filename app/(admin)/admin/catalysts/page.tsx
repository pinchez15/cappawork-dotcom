import {
  getCatalystsWithStats,
  getCatalystsDueForContact,
} from "@/server/repos/bd-catalysts";
import { CatalystsView } from "@/components/admin/catalysts-view";
import { CatalystChat } from "@/components/admin/catalyst-chat";

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
      <div className="mt-8 max-w-2xl">
        <CatalystChat />
      </div>
    </div>
  );
}
