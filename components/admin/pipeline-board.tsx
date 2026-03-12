"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STAGES, type BDDeal, type DealsByStage } from "@/server/repos/bd-deals";
import type { BDCatalyst } from "@/server/repos/bd-catalysts";
import { useCommandContext } from "@/components/admin/command-panel/use-command-context";
import { DealCard } from "@/components/admin/deal-card";
import { DealFormDialog } from "@/components/admin/deal-form-dialog";
import { WinCelebration } from "@/components/admin/win-celebration";
import { AlertTriangle, Clock } from "lucide-react";

type Props = {
  initialStages: DealsByStage[];
  overdue: BDDeal[];
  catalysts: BDCatalyst[];
};

function DroppableColumn({
  stageId,
  label,
  color,
  deals,
  onEdit,
  onAddToStage,
}: {
  stageId: string;
  label: string;
  color: string;
  deals: BDDeal[];
  onEdit: (deal: BDDeal) => void;
  onAddToStage: (stageId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: stageId });
  const totalValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border border-stone-200 ${color} min-w-0 flex-1 transition-shadow ${
        isOver ? "ring-2 ring-blue-400 shadow-md" : ""
      }`}
    >
      <div className="px-3 py-3 border-b border-stone-200/60">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="text-sm font-bold text-stone-900">{label}</h3>
          <span className="text-xs font-medium text-stone-400">
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <div className="text-xs text-stone-500">
            ${totalValue.toLocaleString()}
          </div>
        )}
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[120px] overflow-y-auto max-h-[calc(100vh-260px)]">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onEdit={onEdit} />
        ))}
      </div>
      <div className="p-2 border-t border-stone-200/60">
        <button
          onClick={() => onAddToStage(stageId)}
          className="w-full flex items-center justify-center gap-1 text-xs text-stone-400 hover:text-stone-600 py-1.5 rounded-lg hover:bg-white/60 transition-colors"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </div>
    </div>
  );
}

export function PipelineBoard({ initialStages, overdue, catalysts }: Props) {
  const router = useRouter();
  const [stages, setStages] = useState(initialStages);

  const totalDeals = initialStages.reduce((sum, s) => sum + s.deals.length, 0);
  const totalValue = initialStages
    .flatMap((s) => s.deals)
    .reduce((sum, d) => sum + (d.value || 0), 0);
  useCommandContext({
    page: "pipeline",
    summary: `${totalDeals} deals, $${totalValue.toLocaleString()} total value, ${overdue.length} overdue`,
    capabilities: ["create_deal", "query_deals", "move_deal"],
  });
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync when server re-renders with new data (e.g. after chat creates a deal)
  useEffect(() => {
    setStages(initialStages);
  }, [initialStages]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<BDDeal | null>(null);
  const [defaultStage, setDefaultStage] = useState("lead");
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationDealName, setCelebrationDealName] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeDeal = activeId
    ? stages.flatMap((s) => s.deals).find((d) => d.id === activeId)
    : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const dealId = active.id as string;
      const destStageId = over.id as string;

      // Find source stage
      const sourceStage = stages.find((s) =>
        s.deals.some((d) => d.id === dealId)
      );
      if (!sourceStage || sourceStage.stageId === destStageId) return;

      // Optimistic update
      const deal = sourceStage.deals.find((d) => d.id === dealId);
      if (!deal) return;

      setStages((prev) =>
        prev.map((s) => {
          if (s.stageId === sourceStage.stageId) {
            return { ...s, deals: s.deals.filter((d) => d.id !== dealId) };
          }
          if (s.stageId === destStageId) {
            return {
              ...s,
              deals: [...s.deals, { ...deal, stage: destStageId }],
            };
          }
          return s;
        })
      );

      // PARTY TIME — celebrate when a deal is won!
      if (destStageId === "won") {
        setCelebrationDealName(deal.name);
        setCelebrating(true);
      }

      // Persist
      try {
        const destDeals = stages.find((s) => s.stageId === destStageId)?.deals;
        const newOrder = (destDeals?.length ?? 0);

        await fetch(`/api/admin/bd-deals/${dealId}/move`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: destStageId, order: newOrder }),
        });
      } catch {
        // Revert on error
        setStages(initialStages);
      }
    },
    [stages, initialStages]
  );

  const handleEdit = useCallback((deal: BDDeal) => {
    setEditingDeal(deal);
    setDialogOpen(true);
  }, []);

  const handleAddToStage = useCallback((stageId: string) => {
    setDefaultStage(stageId);
    setEditingDeal(null);
    setDialogOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    setDialogOpen(false);
    setEditingDeal(null);
    router.refresh();
  }, [router]);

  const handleDeleted = useCallback(() => {
    setDialogOpen(false);
    setEditingDeal(null);
    router.refresh();
  }, [router]);

  return (
    <>
      {/* Overdue follow-ups */}
      {overdue.length > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            {overdue.length} overdue follow-up{overdue.length !== 1 ? "s" : ""}
          </div>
          <div className="space-y-1.5">
            {overdue.map((deal) => (
              <button
                key={deal.id}
                onClick={() => handleEdit(deal)}
                className="flex items-center gap-3 w-full text-left text-sm hover:bg-amber-100/50 rounded-lg px-2 py-1.5 transition-colors"
              >
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-medium text-stone-900 truncate">
                  {deal.name}
                </span>
                {deal.next_action && (
                  <span className="text-stone-500 truncate flex-1">
                    — {deal.next_action}
                  </span>
                )}
                <span className="text-xs text-amber-600 shrink-0">
                  {deal.follow_up_date}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <Button
          onClick={() => {
            setDefaultStage("lead");
            setEditingDeal(null);
            setDialogOpen(true);
          }}
          className="rounded-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Deal
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-2 pb-4">
          {STAGES.map((stageDef) => {
            const stageData = stages.find((s) => s.stageId === stageDef.id);
            return (
              <DroppableColumn
                key={stageDef.id}
                stageId={stageDef.id}
                label={stageDef.label}
                color={stageDef.color}
                deals={stageData?.deals || []}
                onEdit={handleEdit}
                onAddToStage={handleAddToStage}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <div className="opacity-80 rotate-2">
              <DealCard deal={activeDeal} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <WinCelebration
        active={celebrating}
        dealName={celebrationDealName}
        onComplete={() => setCelebrating(false)}
      />

      <DealFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        deal={editingDeal}
        defaultStage={defaultStage}
        catalysts={catalysts}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </>
  );
}
