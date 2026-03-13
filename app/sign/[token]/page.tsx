import { getSowDocumentByToken } from "@/server/repos/sow";
import { SigningView } from "@/components/sow/signing-view";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SignPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const sow = await getSowDocumentByToken(token);

  if (!sow) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Invalid or Expired Link
        </h1>
        <p className="text-stone-500">
          This signing link is no longer valid. Please contact the sender for a
          new link.
        </p>
      </div>
    );
  }

  // Check expiry
  if (
    sow.signing_token_expires_at &&
    new Date(sow.signing_token_expires_at) < new Date()
  ) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">
          Link Expired
        </h1>
        <p className="text-stone-500">
          This signing link has expired. Please contact the sender for a new
          link.
        </p>
      </div>
    );
  }

  return <SigningView sow={sow} token={token} />;
}
