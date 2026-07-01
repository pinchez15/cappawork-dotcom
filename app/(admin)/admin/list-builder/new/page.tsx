import { getVerticals } from "@/server/repos/verticals";
import { CreateListWizard } from "@/components/admin/list-builder/create-list-wizard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function NewListPage() {
  const verticals = await getVerticals();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CreateListWizard verticals={verticals} />
    </div>
  );
}
