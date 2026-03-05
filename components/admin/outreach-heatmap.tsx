"use client";

import { useMemo } from "react";
import type { OutreachEntry, OutreachCounts } from "@/server/repos/outreach";

type Props = {
  entries: OutreachEntry[];
  startDate: string;
  endDate: string;
};

function getTotalActions(counts: OutreachCounts): number {
  return Object.values(counts).reduce((sum, v) => sum + (v || 0), 0);
}

function getIntensityClass(total: number): string {
  if (total === 0) return "bg-stone-100";
  if (total <= 10) return "bg-blue-100";
  if (total <= 25) return "bg-blue-300";
  if (total <= 40) return "bg-blue-500";
  return "bg-blue-700";
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function OutreachHeatmap({ entries, startDate, endDate }: Props) {
  const { grid, weeks } = useMemo(() => {
    const entryMap = new Map<string, number>();
    for (const entry of entries) {
      entryMap.set(entry.entry_date, getTotalActions(entry.counts as OutreachCounts));
    }

    // Build weekday grid: rows = Mon-Fri, columns = weeks
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    // Find the Monday of the start week
    const startDay = start.getDay(); // 0=Sun
    const mondayOffset = startDay === 0 ? 1 : startDay === 1 ? 0 : -(startDay - 1);
    const firstMonday = new Date(start);
    firstMonday.setDate(firstMonday.getDate() + mondayOffset);

    const weeks: string[][] = []; // weeks[weekIdx] = [mon, tue, wed, thu, fri] dates
    const current = new Date(firstMonday);

    while (current <= end) {
      const week: string[] = [];
      for (let d = 0; d < 5; d++) {
        const dateStr = current.toISOString().slice(0, 10);
        if (current >= start && current <= end) {
          week.push(dateStr);
        } else {
          week.push("");
        }
        current.setDate(current.getDate() + 1);
      }
      // Skip weekend
      current.setDate(current.getDate() + 2);
      weeks.push(week);
    }

    return { grid: entryMap, weeks };
  }, [entries, startDate, endDate]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="h-4 w-8 text-[10px] text-muted-foreground flex items-center"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {week.map((dateStr, dayIdx) => {
              if (!dateStr) {
                return (
                  <div key={dayIdx} className="h-4 w-4 rounded-sm bg-transparent" />
                );
              }
              const total = grid.get(dateStr) || 0;
              const today = new Date().toISOString().slice(0, 10);
              const isToday = dateStr === today;

              return (
                <div
                  key={dayIdx}
                  className={`h-4 w-4 rounded-sm ${getIntensityClass(total)} ${
                    isToday ? "ring-2 ring-blue-600 ring-offset-1" : ""
                  } group relative cursor-default`}
                  title={`${dateStr}: ${total} actions`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10 whitespace-nowrap rounded bg-stone-900 px-2 py-1 text-[10px] text-white shadow-lg pointer-events-none">
                    {new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    : {total} actions
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-stone-100" />
        <div className="h-3 w-3 rounded-sm bg-blue-100" />
        <div className="h-3 w-3 rounded-sm bg-blue-300" />
        <div className="h-3 w-3 rounded-sm bg-blue-500" />
        <div className="h-3 w-3 rounded-sm bg-blue-700" />
        <span>More</span>
      </div>
    </div>
  );
}
