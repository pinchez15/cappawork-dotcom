"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { createUrl, deleteUrl } from "@/server/repos/urls";
import { toast } from "sonner";
import Link from "next/link";

interface ProjectUrl {
  id: string;
  label: string;
  url: string;
  type: string;
  created_at: string;
}

interface URLsSectionProps {
  projectId: string;
  initialUrls: ProjectUrl[];
}

export function URLsSection({ projectId, initialUrls }: URLsSectionProps) {
  const [urls, setUrls] = useState(initialUrls);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (formData: FormData) => {
    const label = formData.get("label") as string;
    const url = formData.get("url") as string;
    const type = (formData.get("type") as string) || "other";

    if (!label || !url) {
      toast.error("Label and URL are required");
      return;
    }

    try {
      const newUrl = await createUrl(projectId, { label, url, type: type as any });
      setUrls((prev) => [newUrl, ...prev]);
      setIsDialogOpen(false);
      toast.success("URL added");
    } catch (error) {
      toast.error("Failed to add URL");
    }
  };

  const handleDelete = async (urlId: string) => {
    if (!confirm("Are you sure you want to delete this URL?")) return;

    try {
      await deleteUrl(urlId);
      setUrls((prev) => prev.filter((u) => u.id !== urlId));
      toast.success("URL deleted");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Project URLs</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New URL</DialogTitle>
                <DialogDescription>
                  Store links to repos, staging, production, and other resources.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label">Label</Label>
                  <Input id="label" name="label" required placeholder="e.g., GitHub Repo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    required
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="other">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repo">Repository</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="docs">Documentation</SelectItem>
                      <SelectItem value="design">Design Files</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {urls.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            No URLs yet. Add your first URL to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {urls.map((url) => (
              <div
                key={url.id}
                className="border border-stone-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="font-medium text-stone-900">{url.label}</div>
                  <div className="text-sm text-stone-500 capitalize">{url.type}</div>
                  <Link
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    {url.url}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(url.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

