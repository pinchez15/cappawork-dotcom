"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface ClientURLsProps {
  urls: any[];
}

export function ClientURLs({ urls }: ClientURLsProps) {
  if (urls.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-stone-500">
            No URLs available yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
}

