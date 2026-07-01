"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Key, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProviderInfo = {
  id: string;
  provider: string;
  is_active: boolean;
  has_key: boolean;
};

type Props = {
  settings: ProviderInfo[];
};

const PROVIDERS = [
  {
    id: "apollo",
    name: "Apollo",
    description: "Organization search, people search, and enrichment.",
    envVar: "APOLLO_API_KEY",
  },
  {
    id: "whitewhale",
    name: "WhiteWhale",
    description: "Buying signal monitoring (V2 integration).",
    envVar: null,
  },
  {
    id: "clay",
    name: "Clay",
    description: "CSV import/export for experimental enrichment.",
    envVar: null,
  },
];

export function ProviderSettingsView({ settings: initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function saveKey(provider: string) {
    const key = apiKeys[provider];
    if (!key) return;
    setSaving(provider);
    try {
      const res = await fetch("/api/admin/provider-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, api_key: key, is_active: true }),
      });
      if (res.ok) {
        setSaved(provider);
        setSettings((prev) => {
          const existing = prev.find((s) => s.provider === provider);
          if (existing) {
            return prev.map((s) =>
              s.provider === provider ? { ...s, has_key: true } : s
            );
          }
          return [...prev, { id: provider, provider, is_active: true, has_key: true }];
        });
        setTimeout(() => setSaved(null), 2000);
      }
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/list-builder">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Provider Settings</h1>
          <p className="text-sm text-muted-foreground">
            API keys are stored server-side and never exposed to the client.
          </p>
        </div>
      </div>

      {PROVIDERS.map((provider) => {
        const setting = settings.find((s) => s.provider === provider.id);
        return (
          <Card key={provider.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{provider.name}</CardTitle>
                {setting?.has_key ? (
                  <Badge className="bg-green-100 text-green-700 text-[10px]">Configured</Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Not configured</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{provider.description}</p>
              {provider.envVar && (
                <p className="text-xs text-muted-foreground">
                  Or set <code className="text-[10px] bg-muted px-1 rounded">{provider.envVar}</code> env var
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">API Key</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="password"
                    placeholder={setting?.has_key ? "••••••••••••" : "Enter API key"}
                    value={apiKeys[provider.id] || ""}
                    onChange={(e) =>
                      setApiKeys((prev) => ({ ...prev, [provider.id]: e.target.value }))
                    }
                  />
                  <Button
                    size="sm"
                    disabled={!apiKeys[provider.id] || saving === provider.id}
                    onClick={() => saveKey(provider.id)}
                  >
                    {saving === provider.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : saved === provider.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Key className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
