import { getRecentActivity } from "@/server/repos/activity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTable } from "@/components/admin/activity-table";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const events = await getRecentActivity({ limit: 100 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">
          Site Activity
        </h1>
        <p className="text-stone-600 mt-1">
          Recent client activity across all projects
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
          <CardDescription>
            Showing the last 100 activity events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
