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
import { Plus, Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { createSecret, getDecryptedSecret, deleteSecret } from "@/server/repos/secrets";
import { toast } from "sonner";

interface Secret {
  id: string;
  name: string;
  type: string;
  created_at: string;
}

interface SecretsVaultProps {
  projectId: string;
  initialSecrets: Secret[];
}

export function SecretsVault({
  projectId,
  initialSecrets,
}: SecretsVaultProps) {
  const [secrets, setSecrets] = useState(initialSecrets);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReveal = async (secretId: string) => {
    if (revealedSecrets[secretId]) {
      setRevealedSecrets((prev) => {
        const next = { ...prev };
        delete next[secretId];
        return next;
      });
      return;
    }

    setIsLoading(true);
    try {
      const decrypted = await getDecryptedSecret(secretId);
      if (decrypted) {
        setRevealedSecrets((prev) => ({
          ...prev,
          [secretId]: decrypted.value,
        }));
      }
    } catch (error) {
      toast.error("Failed to decrypt secret");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const handleDelete = async (secretId: string) => {
    if (!confirm("Are you sure you want to delete this secret?")) return;

    try {
      await deleteSecret(secretId);
      setSecrets((prev) => prev.filter((s) => s.id !== secretId));
      setRevealedSecrets((prev) => {
        const next = { ...prev };
        delete next[secretId];
        return next;
      });
      toast.success("Secret deleted");
    } catch (error) {
      toast.error("Failed to delete secret");
    }
  };

  const handleCreate = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const value = formData.get("value") as string;
    const type = (formData.get("type") as string) || "api_key";

    if (!name || !value) {
      toast.error("Name and value are required");
      return;
    }

    try {
      const secret = await createSecret(projectId, { name, value, type: type as any });
      setSecrets((prev) => [secret, ...prev]);
      setIsDialogOpen(false);
      toast.success("Secret created");
    } catch (error) {
      toast.error("Failed to create secret");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Secrets Vault</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Secret
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Secret</DialogTitle>
                <DialogDescription>
                  Store API keys, passwords, and other sensitive credentials securely.
                </DialogDescription>
              </DialogHeader>
              <form action={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Stripe API Key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="api_key">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="token">Token</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    name="value"
                    type="password"
                    required
                    placeholder="Enter secret value"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {secrets.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            No secrets yet. Add your first secret to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {secrets.map((secret) => (
              <div
                key={secret.id}
                className="border border-stone-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-stone-900">{secret.name}</div>
                    <div className="text-sm text-stone-500 capitalize">{secret.type}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReveal(secret.id)}
                      disabled={isLoading}
                    >
                      {revealedSecrets[secret.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    {revealedSecrets[secret.id] && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(revealedSecrets[secret.id])}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(secret.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {revealedSecrets[secret.id] && (
                  <div className="bg-stone-50 p-3 rounded font-mono text-sm break-all">
                    {revealedSecrets[secret.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

