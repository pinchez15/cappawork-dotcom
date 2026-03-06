import { getDealsByStage, getPipelineStats } from "@/server/repos/bd-deals";
import { PipelineBoard } from "@/components/admin/pipeline-board";
import { PipelineChat } from "@/components/admin/pipeline-chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [stages, stats] = await Promise.all([
    getDealsByStage(),
    getPipelineStats(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Pipeline</h1>
          <p className="text-stone-600 mt-1">
            {stats.active} active · {stats.wonCount} won · $
            {stats.wonValue.toLocaleString()} closed
          </p>
        </div>
      </div>

      <div className="mb-6 max-w-2xl">
        <PipelineChat />
      </div>

      <PipelineBoard initialStages={stages} />
    </div>
  );
}
