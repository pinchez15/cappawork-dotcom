import { getLists, getListStats } from "@/server/repos/lists";
import { getVerticals } from "@/server/repos/verticals";
import { ListBuilderHome } from "@/components/admin/list-builder/list-builder-home";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ListBuilderPage() {
  const [lists, stats, verticals] = await Promise.all([
    getLists(),
    getListStats(),
    getVerticals(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ListBuilderHome lists={lists} stats={stats} verticals={verticals} />
    </div>
  );
}
