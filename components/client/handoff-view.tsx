"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { getDecryptedSecret } from "@/server/repos/secrets";
import { toast } from "sonner";
import Link from "next/link";

interface HandoffViewProps {
  project: any;
  secrets: any[];
  urls: any[];
}

export function HandoffView({ project, secrets, urls }: HandoffViewProps) {
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, string>>({});
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2">
          Project Handoff
        </h1>
        <p className="text-stone-600">
          All credentials and resources for {project.name}
        </p>
      </div>

      <div className="space-y-6">
        {secrets.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Credentials & API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {secrets.map((secret) => (
                  <div
                    key={secret.id}
                    className="border border-stone-200 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-stone-900">{secret.name}</div>
                        <div className="text-sm text-stone-500 capitalize">
                          {secret.type}
                        </div>
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
            </CardContent>
          </Card>
        )}

        {urls.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Project URLs</CardTitle>
            </CardHeader>
            <CardContent>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {secrets.length === 0 && urls.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-stone-500">
                Handoff materials are being prepared. Check back soon.
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline">Back to Project</Button>
        </Link>
      </div>
    </div>
  );
}

