import { OutreachTracker } from "@/components/admin/outreach-tracker";

export const runtime = "nodejs";

export default function OutreachPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <OutreachTracker />
    </div>
  );
}
