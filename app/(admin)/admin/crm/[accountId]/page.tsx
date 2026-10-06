import { notFound } from "next/navigation";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";
import { CrmAccountDetail } from "@/components/admin/crm/crm-account-detail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ accountId: string }> };

export default async function CrmAccountPage({ params }: Props) {
  const { accountId } = await params;
  const account = await getGtmAccountDetail(accountId);
  if (!account) notFound();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CrmAccountDetail account={account as Parameters<typeof CrmAccountDetail>[0]["account"]} />
    </div>
  );
}
