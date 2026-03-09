import {
  getDealsByStage,
  getPipelineStats,
  getOverdueDeals,
  getTopCatalysts,
} from "@/server/repos/bd-deals";
import { getCatalysts } from "@/server/repos/bd-catalysts";
import { PipelineBoard } from "@/components/admin/pipeline-board";
import { PipelineGoal } from "@/components/admin/pipeline-goal";
import { TopCatalysts } from "@/components/admin/top-catalysts";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Target, TrendingUp } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [stages, stats, overdue, catalysts, topCatalysts] = await Promise.all([
    getDealsByStage(),
    getPipelineStats(),
    getOverdueDeals(),
    getCatalysts(),
    getTopCatalysts(),
  ]);

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-stone-900">Pipeline</h1>
      </div>

      {/* Goal tracker */}
      <PipelineGoal
        activeValue={stats.activeValue}
        weightedValue={stats.weightedValue}
        wonValue={stats.wonValue}
      />

      {/* Stats + Top Catalysts row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <DollarSign className="h-3.5 w-3.5" />
              Total Pipeline
            </div>
            <div className="text-2xl font-bold text-stone-900">
              ${stats.activeValue.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {stats.activeCount} active prospect
              {stats.activeCount !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <Target className="h-3.5 w-3.5" />
              Weighted Value
            </div>
            <div className="text-2xl font-bold text-stone-900">
              ${stats.weightedValue.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Adjusted by stage probability
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Won Business
            </div>
            <div className="text-2xl font-bold text-stone-900">
              ${stats.wonValue.toLocaleString()}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {stats.wonCount} closed deal{stats.wonCount !== 1 ? "s" : ""}{" "}
              (YTD)
            </div>
          </CardContent>
        </Card>

        <TopCatalysts catalysts={topCatalysts} />
      </div>

      <PipelineBoard
        initialStages={stages}
        overdue={overdue}
        catalysts={catalysts}
      />
    </div>
  );
}
