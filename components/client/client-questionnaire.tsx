"use client";

import { useState, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb, Save, Send } from "lucide-react";

const QUESTIONS = [
  {
    id: "inspiration_sites",
    label: "What websites or apps really inspire you?",
    hint: "Drop 2-3 links. These help us understand the look, feel, and experience you gravitate toward.",
    type: "textarea" as const,
  },
  {
    id: "dream_outcome",
    label:
      "If money were no object, what would you dream this product could accomplish?",
    hint: "Think big. We want to know where your ambition lives — even if v1 is smaller.",
    type: "textarea" as const,
  },
  {
    id: "biggest_frustration",
    label:
      "What's the single biggest frustration in how your team works today?",
    hint: "The bottleneck, the thing that makes you say 'there has to be a better way.'",
    type: "textarea" as const,
  },
  {
    id: "audience",
    label: "Who is this product for — and what do they care about most?",
    hint: "Your customers, your team, or both? What matters to them when they interact with your business?",
    type: "textarea" as const,
  },
  {
    id: "success_metric",
    label:
      "Six months from now, what would make you say 'this was worth every dollar'?",
    hint: "A number, a feeling, a specific outcome — whatever 'success' looks like to you.",
    type: "textarea" as const,
  },
  {
    id: "brand_words",
    label: "Pick 3 words that describe how your brand should feel.",
    hint: "Examples: bold, approachable, premium, minimal, playful, authoritative, warm, technical.",
    type: "input" as const,
  },
  {
    id: "anything_else",
    label: "Anything else on your mind heading into our call?",
    hint: "Concerns, ideas, context — whatever helps us hit the ground running.",
    type: "textarea" as const,
  },
];

interface Props {
  projectId: string;
  questionnaire: {
    responses: Record<string, string>;
    submitted_at: string | null;
  } | null;
}

export function ClientQuestionnaire({ projectId, questionnaire }: Props) {
  const [responses, setResponses] = useState<Record<string, string>>(
    questionnaire?.responses || {}
  );
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const isSubmitted = !!questionnaire?.submitted_at;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToServer = useCallback(
    async (data: Record<string, string>, submit = false) => {
      const fn = submit ? setSubmitting : setSaving;
      fn(true);
      try {
        const res = await fetch(
          `/api/projects/${projectId}/questionnaire`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ responses: data, submit }),
          }
        );
        if (res.ok) {
          setLastSaved(new Date().toLocaleTimeString());
          if (submit) {
            window.location.reload();
          }
        }
      } finally {
        fn(false);
      }
    },
    [projectId]
  );

  function updateResponse(id: string, value: string) {
    const next = { ...responses, [id]: value };
    setResponses(next);

    // Auto-save after 2 seconds of inactivity
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveToServer(next), 2000);
  }

  function handleSubmit() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const filled = QUESTIONS.filter(
      (q) => responses[q.id]?.trim()
    ).length;

    if (filled < 3) {
      alert("Please answer at least 3 questions before submitting.");
      return;
    }

    if (
      !confirm(
        "Once submitted, your answers will be locked in for our call. Ready to submit?"
      )
    )
      return;

    saveToServer(responses, true);
  }

  const filledCount = QUESTIONS.filter(
    (q) => responses[q.id]?.trim()
  ).length;

  // Submitted state
  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Vision Questionnaire
          </h2>
          <p className="text-muted-foreground mt-1">
            Your pre-meeting responses
          </p>
        </div>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  Submitted{" "}
                  {new Date(questionnaire!.submitted_at!).toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" }
                  )}
                </p>
                <p className="text-sm text-green-700">
                  We&apos;ll review your answers before our call.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {QUESTIONS.map((q) => {
          const answer = responses[q.id];
          if (!answer?.trim()) return null;
          return (
            <Card key={q.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  {q.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-700 whitespace-pre-line">
                  {answer}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Editable state
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Vision Questionnaire
        </h2>
        <p className="text-muted-foreground mt-1">
          Help us prepare for your onboarding call
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Take 10 minutes to answer these before our first call.
              </p>
              <p className="text-sm text-blue-700 mt-1">
                There are no wrong answers. Think big, be honest, and give us
                the raw material to build something that actually fits your
                business. Your progress saves automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <Card key={q.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-foreground">
                    <span className="text-muted-foreground mr-2">
                      {idx + 1}.
                    </span>
                    {q.label}
                  </CardTitle>
                  <CardDescription className="mt-1">{q.hint}</CardDescription>
                </div>
                {responses[q.id]?.trim() && (
                  <Badge className="bg-green-100 text-green-800 text-xs shrink-0 ml-2">
                    Done
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {q.type === "textarea" ? (
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                  placeholder="Your answer..."
                  value={responses[q.id] || ""}
                  onChange={(e) => updateResponse(q.id, e.target.value)}
                />
              ) : (
                <Input
                  placeholder="Your answer..."
                  value={responses[q.id] || ""}
                  onChange={(e) => updateResponse(q.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {filledCount}
              </span>{" "}
              of {QUESTIONS.length} answered
              {lastSaved && (
                <span className="ml-3 text-xs">
                  Last saved {lastSaved}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (saveTimerRef.current)
                    clearTimeout(saveTimerRef.current);
                  saveToServer(responses);
                }}
                disabled={saving}
              >
                <Save className="mr-1 h-3 w-3" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitting || filledCount < 3}
              >
                <Send className="mr-1 h-3 w-3" />
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
