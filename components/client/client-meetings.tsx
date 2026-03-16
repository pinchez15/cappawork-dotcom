"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calendar,
  Video,
  ChevronDown,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_url: string | null;
  status: string;
  invitee_name: string | null;
  invitee_email: string | null;
  event_type_name: string | null;
  calendly_cancel_url: string | null;
}

interface ClientMeetingsProps {
  projectId: string;
  meetings: Meeting[];
  currentUserName?: string;
  currentUserEmail?: string;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ClientMeetings({
  projectId,
  meetings,
  currentUserName = "",
  currentUserEmail = "",
}: ClientMeetingsProps) {
  const [pastOpen, setPastOpen] = useState(false);

  // Load Calendly widget script
  useEffect(() => {
    if (document.querySelector('script[src*="calendly.com/assets/external/widget.js"]')) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const now = new Date();
  const upcoming = meetings
    .filter((m) => m.status === "scheduled" && new Date(m.start_time) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  const past = meetings
    .filter((m) => m.status !== "scheduled" || new Date(m.start_time) < now)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

  // Build prefill query params for the Calendly embed
  const prefillParams = new URLSearchParams();
  if (currentUserName) prefillParams.set("name", currentUserName);
  if (currentUserEmail) prefillParams.set("email", currentUserEmail);
  const calendlyUrl = `https://calendly.com/cappawork/product-development-meeting-1${
    prefillParams.toString() ? `?${prefillParams.toString()}` : ""
  }`;

  return (
    <div className="space-y-6">
      {/* Book a Meeting — Calendly Embed */}
      <Card>
        <CardContent className="p-0">
          <div
            className="calendly-inline-widget"
            data-url={calendlyUrl}
            style={{ minWidth: "320px", height: "700px" }}
          />
        </CardContent>
      </Card>

      {/* Past Meetings */}
      {past.length > 0 && (
        <Collapsible open={pastOpen} onOpenChange={setPastOpen}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors w-full">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  pastOpen ? "rotate-180" : ""
                }`}
              />
              Past Meetings ({past.length})
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 mt-3">
              {past.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-3 px-4 border rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-stone-700">
                      {m.title}
                    </div>
                    <div className="text-xs text-stone-500">
                      {formatDateTime(m.start_time)}
                    </div>
                  </div>
                  <Badge
                    className={
                      m.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : m.status === "cancelled"
                        ? "bg-stone-100 text-stone-500"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
