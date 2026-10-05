import { notFound } from "next/navigation";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";
import { getDiscoveryView } from "@/server/repos/discovery";
import { CrmAccountDetail } from "@/components/admin/crm/crm-account-detail";
import { DiscoveryTab } from "@/components/admin/crm/discovery/discovery-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CrmAccountPage({ params, searchParams }: Props) {
  const { accountId } = await params;
  const { tab } = await searchParams;
  const [account, discovery] = await Promise.all([
    getGtmAccountDetail(accountId),
    getDiscoveryView(accountId),
  ]);
  if (!account) notFound();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue={tab === "discovery" ? "discovery" : "overview"}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <CrmAccountDetail account={account as unknown as Parameters<typeof CrmAccountDetail>[0]["account"]} />
        </TabsContent>
        <TabsContent value="discovery">
          <DiscoveryTab accountId={accountId} companyName={account.company_name} initialView={discovery} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
