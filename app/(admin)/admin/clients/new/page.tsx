import { redirect } from "next/navigation";
import { createClientOrganization } from "@/server/actions/organizations";
import { ClientForm } from "@/components/admin/client-form";

export const runtime = "nodejs";

export default function NewClientPage() {
  async function createClientAction(formData: FormData) {
    "use server";
    const result = await createClientOrganization(formData);
    redirect(`/admin/clients/${result.organizationId}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-stone-900 mb-8">
        Add New Client
      </h1>
      <ClientForm action={createClientAction} />
    </div>
  );
}
