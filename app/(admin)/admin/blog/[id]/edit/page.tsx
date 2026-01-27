import { redirect } from "next/navigation";
import { getBlogPostById } from "@/server/repos/blog";
import { BlogPostEditor } from "@/components/admin/blog-post-editor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TODO: Re-add Clerk auth protection after reinstall
export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getBlogPostById(id);

  if (!post) {
    redirect("/admin/blog");
  }

  return <BlogPostEditor post={post} />;
}
