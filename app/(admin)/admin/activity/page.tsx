import { getRecentActivity } from "@/server/repos/activity";
import {
  getCalculatorLeadCount,
  getRecentCalculatorLeads,
} from "@/server/repos/calculator-leads";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityTable } from "@/components/admin/activity-table";
import { CalculatorLeadsTable } from "@/components/admin/calculator-leads-table";
import { Calculator, Users, Activity as ActivityIcon } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const [events, leadCount, recentLeads] = await Promise.all([
    getRecentActivity({ limit: 100 }),
    getCalculatorLeadCount(),
    getRecentCalculatorLeads(20),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">
          Site Activity
        </h1>
        <p className="text-stone-600 mt-1">
          Recent client activity and calculator leads
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <ActivityIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">
                  {events.length}
                </div>
                <div className="text-xs text-stone-500">Recent Events</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Calculator className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">
                  {leadCount}
                </div>
                <div className="text-xs text-stone-500">Calculator Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-900">
                  {new Set(events.map((e) => e.profile?.id).filter(Boolean)).size}
                </div>
                <div className="text-xs text-stone-500">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculator Leads */}
      {recentLeads.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Calculator Leads</CardTitle>
            <CardDescription>
              People who completed the AI Capacity Calculator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalculatorLeadsTable leads={recentLeads} />
          </CardContent>
        </Card>
      )}

      {/* Activity Events */}
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
