import { notFound } from "next/navigation";
import { getList } from "@/server/repos/lists";
import { getAccountsForList } from "@/server/repos/list-memberships";
import { getRunsForList } from "@/server/repos/list-runs";
import { ListReviewTable } from "@/components/admin/list-builder/list-review-table";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ listId: string }> };

export default async function ListDetailPage({ params }: Props) {
  const { listId } = await params;
  const [list, accounts, runs] = await Promise.all([
    getList(listId),
    getAccountsForList(listId),
    getRunsForList(listId),
  ]);

  if (!list) notFound();

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ListReviewTable list={list} initialAccounts={accounts} runs={runs} />
    </div>
  );
}
