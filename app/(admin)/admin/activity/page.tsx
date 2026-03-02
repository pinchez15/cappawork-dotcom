import { getRecentActivity } from "@/server/repos/activity";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    page_view: {
      label: "Page View",
      className: "bg-blue-100 text-blue-800",
    },
    login: {
      label: "Login",
      className: "bg-green-100 text-green-800",
    },
    file_download: {
      label: "Download",
      className: "bg-purple-100 text-purple-800",
    },
  };

  const { label, className } = config[type] || {
    label: type,
    className: "bg-stone-100 text-stone-800",
  };

  return <Badge className={className}>{label}</Badge>;
}

export default async function ActivityPage() {
  const events = await getRecentActivity({ limit: 100 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">
          Activity Log
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
          {events.length === 0 ? (
            <p className="text-sm text-stone-500">No activity recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 pr-4 font-medium text-stone-600">
                      Timestamp
                    </th>
                    <th className="pb-3 pr-4 font-medium text-stone-600">
                      User
                    </th>
                    <th className="pb-3 pr-4 font-medium text-stone-600">
                      Event
                    </th>
                    <th className="pb-3 pr-4 font-medium text-stone-600">
                      Project
                    </th>
                    <th className="pb-3 font-medium text-stone-600">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {events.map(
                    (event: {
                      id: string;
                      created_at: string;
                      event_type: string;
                      metadata: Record<string, unknown>;
                      profile: { name: string | null; email: string } | null;
                      project: { name: string } | null;
                    }) => (
                      <tr key={event.id} className="hover:bg-stone-50">
                        <td className="py-3 pr-4 text-stone-600 whitespace-nowrap">
                          {formatDate(event.created_at)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-stone-900">
                            {event.profile?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-stone-500">
                            {event.profile?.email}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <EventTypeBadge type={event.event_type} />
                        </td>
                        <td className="py-3 pr-4 text-stone-700">
                          {event.project?.name || "—"}
                        </td>
                        <td className="py-3 text-stone-500">
                          {(event.metadata as Record<string, unknown>)?.path
                            ? String(
                                (event.metadata as Record<string, unknown>).path
                              )
                            : "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
