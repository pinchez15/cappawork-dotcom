import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { blogPosts } from "@/lib/blog/posts";
import { getBlogPostBySlug } from "@/server/repos/blog";
import { supabaseAdmin } from "@/lib/db/client";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileByClerkId(userId);
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let seeded = 0;
  const errors: string[] = [];

  for (const post of blogPosts) {
    try {
      const existing = await getBlogPostBySlug(post.slug);
      if (existing) continue;

      const { error } = await supabaseAdmin.from("blog_posts").insert({
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
        published: post.published,
        published_at: post.published ? post.date : null,
      });

      if (error) throw error;
      seeded++;
    } catch (err) {
      errors.push(`Failed to seed "${post.slug}": ${err}`);
    }
  }

  return NextResponse.json({ seeded, errors });
}
