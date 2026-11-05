import { getLiSignalRows, getLiSignalStats } from "@/server/repos/gtm-signals";
import { SignalsBoard } from "@/components/admin/signals/signals-board";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SignalsPage() {
  const [rows, stats] = await Promise.all([
    getLiSignalRows({ include_no_signal: true }),
    getLiSignalStats(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SignalsBoard initialRows={rows} stats={stats} />
    </div>
  );
}
