import { supabaseAdmin, supabasePublic } from "@/lib/db/client";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: any; // TipTap JSON
  featured_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function createBlogPost(data: {
  slug: string;
  title: string;
  description?: string;
  content: any;
  featured_image_url?: string;
  published?: boolean;
}) {
  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug: data.slug,
      title: data.title,
      description: data.description || null,
      content: data.content,
      featured_image_url: data.featured_image_url || null,
      published: data.published || false,
      published_at: data.published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

export async function getBlogPostBySlug(slug: string, publishedOnly = false) {
  const client = publishedOnly ? supabasePublic : supabaseAdmin;
  let query = client.from("blog_posts").select("*").eq("slug", slug);

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getAllBlogPosts(publishedOnly = false) {
  const client = publishedOnly ? supabasePublic : supabaseAdmin;
  let query = client
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function updateBlogPost(
  id: string,
  updates: Partial<{
    slug: string;
    title: string;
    description: string;
    content: any;
    featured_image_url: string;
    published: boolean;
  }>
) {
  const updateData: any = { ...updates };
  if (updates.published !== undefined) {
    updateData.published_at = updates.published
      ? new Date().toISOString()
      : null;
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabaseAdmin
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

