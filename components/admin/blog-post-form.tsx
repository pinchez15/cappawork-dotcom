"use client";

import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface BlogPostFormProps {
  action: (formData: FormData) => Promise<void>;
}

export function BlogPostForm({ action }: BlogPostFormProps) {
  const [state, formAction] = useFormState(async (prev: any, formData: FormData) => {
    try {
      await action(formData);
    } catch (error: any) {
      return { error: error.message || "Failed to create post" };
    }
  }, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required placeholder="Post title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              required
              placeholder="url-friendly-slug"
            />
            <p className="text-xs text-stone-500">
              Used in the URL: /blog/url-friendly-slug
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Brief description for preview..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              name="content"
              rows={10}
              required
              placeholder="Post content (will be converted to rich text)"
            />
            <p className="text-xs text-stone-500">
              You can edit this with the rich text editor after creation
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="published" name="published" value="true" />
            <Label htmlFor="published">Publish immediately</Label>
          </div>

          {state?.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {state.error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit">Create Post</Button>
            <Button type="button" variant="outline" asChild>
              <a href="/admin/blog">Cancel</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

