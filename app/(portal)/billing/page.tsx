import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import { getBillingLinksForOrganization } from "@/server/repos/billing-links";
import { ClientBillingLinksView } from "@/components/client/client-billing-links-view";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getProfileByClerkId(userId);

  if (!profile) {
    redirect("/projects");
  }

  if (profile.is_admin) {
    redirect("/admin");
  }

  // Find user's organization
  const { data: orgMember } = await supabaseAdmin
    .from("organization_members")
    .select("organization_id")
    .eq("profile_id", profile.id)
    .limit(1)
    .maybeSingle();

  if (!orgMember) {
    redirect("/projects");
  }

  const billingLinks = await getBillingLinksForOrganization(
    orgMember.organization_id
  );

  return (
    <div className="light min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-navy sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white font-display">
                  CappaWork
                </span>
                <span className="text-xs text-white/60 -mt-1">
                  Client Portal
                </span>
              </div>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-semibold text-stone-900">Billing</h1>
          <p className="text-stone-500 mt-1">
            View invoices and subscription details
          </p>
        </div>

        <ClientBillingLinksView billingLinks={billingLinks} />
      </main>
    </div>
  );
}
