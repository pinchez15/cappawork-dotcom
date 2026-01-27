import { redirect } from "next/navigation";
import { createBlogPost } from "@/server/repos/blog";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const runtime = "nodejs";

export default function NewBlogPostPage() {
  async function createPostAction(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";

    if (!title || !slug || !content) {
      throw new Error("Title, slug, and content are required");
    }

    let contentJson;
    try {
      contentJson = JSON.parse(content);
    } catch {
      // If not JSON, create a simple paragraph structure
      contentJson = {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: content }],
          },
        ],
      };
    }

    const post = await createBlogPost({
      title,
      slug,
      description: description || undefined,
      content: contentJson,
      published,
    });

    redirect(`/admin/blog/${post.id}/edit`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-stone-900 mb-8">
        Create New Blog Post
      </h1>
      <BlogPostForm action={createPostAction} />
    </div>
  );
}

