import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getBlogPostById } from "@/server/repos/blog";
import { BlogPostEditor } from "@/components/admin/blog-post-editor";

export const runtime = "nodejs";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const post = await getBlogPostById(id);

  if (!post) {
    redirect("/admin/blog");
  }

  return <BlogPostEditor post={post} />;
}

