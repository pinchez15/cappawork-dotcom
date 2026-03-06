import { OutreachPlanner } from "@/components/admin/outreach-planner";
import {
  getActiveGoal,
  getEntryByDate,
  getEntriesForRange,
} from "@/server/repos/outreach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function OutreachPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentDate = params.date || new Date().toISOString().slice(0, 10);

  const [goal, entry] = await Promise.all([
    getActiveGoal(),
    getEntryByDate(currentDate),
  ]);

  // Fetch entries for the goal range (or last 90 days if no goal)
  const rangeStart =
    goal?.start_date ||
    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const rangeEnd =
    goal?.end_date || new Date().toISOString().slice(0, 10);

  const entries = await getEntriesForRange(rangeStart, rangeEnd);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <OutreachPlanner
        goal={goal}
        entry={entry}
        entries={entries}
        currentDate={currentDate}
      />
    </div>
  );
}
