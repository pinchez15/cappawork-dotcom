"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { updateBlogPost } from "@/server/repos/blog";
import { revalidatePath } from "next/cache";

export async function updateBlogPostAction(
  id: string,
  updates: Partial<{
    slug: string;
    title: string;
    description: string | null;
    content: any;
    featured_image_url: string;
    published: boolean;
  }>
) {
  await requireAdmin();
  const post = await updateBlogPost(id, updates as any);
  revalidatePath(`/admin/blog`);
  revalidatePath(`/blog/${post.slug}`);
  return post;
}
