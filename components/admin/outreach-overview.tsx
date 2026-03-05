"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OutreachHeatmap } from "@/components/admin/outreach-heatmap";
import type {
  OutreachGoal,
  OutreachEntry,
  OutreachCounts,
  OutreachTarget,
} from "@/server/repos/outreach";
import {
  Activity,
  TrendingUp,
  Zap,
  Flame,
  Calendar,
  CheckCircle2,
} from "lucide-react";

type Props = {
  goal: OutreachGoal | null;
  entries: OutreachEntry[];
};

function getTotalActions(counts: OutreachCounts): number {
  return Object.values(counts).reduce((sum, v) => sum + (v || 0), 0);
}

export function OutreachOverview({ goal, entries }: Props) {
  const stats = useMemo(() => {
    const totalActions = entries.reduce(
      (sum, e) => sum + getTotalActions(e.counts as OutreachCounts),
      0
    );

    const daysWithActivity = entries.filter(
      (e) => getTotalActions(e.counts as OutreachCounts) > 0
    ).length;

    const avgPerDay =
      daysWithActivity > 0 ? Math.round(totalActions / daysWithActivity) : 0;

    const bestDay = entries.reduce(
      (best, e) => {
        const total = getTotalActions(e.counts as OutreachCounts);
        return total > best.total ? { date: e.entry_date, total } : best;
      },
      { date: "", total: 0 }
    );

    // Current streak (consecutive days with activity, counting back from today)
    const today = new Date().toISOString().slice(0, 10);
    const sortedDates = entries
      .filter((e) => getTotalActions(e.counts as OutreachCounts) > 0)
      .map((e) => e.entry_date)
      .sort()
      .reverse();

    let streak = 0;
    const checkDate = new Date(today + "T12:00:00");
    for (const dateStr of sortedDates) {
      const expected = checkDate.toISOString().slice(0, 10);
      if (dateStr === expected) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        // Skip weekends
        if (checkDate.getDay() === 0) checkDate.setDate(checkDate.getDate() - 2);
        if (checkDate.getDay() === 6) checkDate.setDate(checkDate.getDate() - 1);
      } else if (dateStr < expected) {
        break;
      }
    }

    // Days remaining in goal
    const daysRemaining = goal
      ? Math.max(
          0,
          Math.ceil(
            (new Date(goal.end_date + "T00:00:00").getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

    // Target completion rate
    const entriesWithTargets = entries.filter(
      (e) => (e.targets as OutreachTarget[])?.length > 0
    );
    const completedTargets = entriesWithTargets.reduce((sum, e) => {
      const targets = e.targets as OutreachTarget[];
      return sum + targets.filter((t) => t.completed).length;
    }, 0);
    const totalTargets = entriesWithTargets.reduce((sum, e) => {
      const targets = e.targets as OutreachTarget[];
      return sum + targets.length;
    }, 0);
    const targetRate =
      totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;

    return {
      totalActions,
      avgPerDay,
      bestDay,
      streak,
      daysRemaining,
      targetRate,
      daysWithActivity,
    };
  }, [entries, goal]);

  const statCards = [
    {
      label: "Total Actions",
      value: stats.totalActions.toLocaleString(),
      icon: Activity,
    },
    {
      label: "Avg / Active Day",
      value: String(stats.avgPerDay),
      icon: TrendingUp,
    },
    {
      label: "Best Day",
      value: stats.bestDay.date
        ? `${stats.bestDay.total} (${new Date(stats.bestDay.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
        : "—",
      icon: Zap,
    },
    {
      label: "Current Streak",
      value: `${stats.streak} day${stats.streak !== 1 ? "s" : ""}`,
      icon: Flame,
    },
    {
      label: "Days Remaining",
      value: goal ? String(stats.daysRemaining) : "—",
      icon: Calendar,
    },
    {
      label: "Target Completion",
      value: `${stats.targetRate}%`,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Goal info */}
      {goal && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">
              90-Day Goal ({goal.start_date} to {goal.end_date})
            </p>
            <p className="text-lg font-semibold text-foreground">
              {goal.goal_text}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-4 pb-4 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Heatmap */}
      {goal && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-foreground mb-4">
              Activity Heatmap (Weekdays)
            </p>
            <OutreachHeatmap
              entries={entries}
              startDate={goal.start_date}
              endDate={goal.end_date}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
