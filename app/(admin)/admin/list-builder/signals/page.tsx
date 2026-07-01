import { getPendingSignals } from "@/server/repos/gtm-signals";
import { SignalInbox } from "@/components/admin/list-builder/signal-inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SignalInboxPage() {
  const signals = await getPendingSignals();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SignalInbox initialSignals={signals} />
    </div>
  );
}
