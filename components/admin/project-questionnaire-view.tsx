"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";

const QUESTION_LABELS: Record<string, string> = {
  inspiration_sites: "What websites or apps really inspire you?",
  dream_outcome: "If money were no object, what would you dream this product could accomplish?",
  biggest_frustration: "What's the single biggest frustration in how your team works today?",
  audience: "Who is this product for — and what do they care about most?",
  success_metric: "Six months from now, what would make you say 'this was worth every dollar'?",
  brand_words: "Pick 3 words that describe how your brand should feel.",
  anything_else: "Anything else on your mind heading into our call?",
};

interface Props {
  questionnaire: {
    responses: Record<string, string>;
    submitted_at: string | null;
    updated_at: string;
  } | null;
}

export function ProjectQuestionnaireView({ questionnaire }: Props) {
  if (!questionnaire) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Lightbulb className="h-5 w-5" />
            <p className="text-sm">
              The client hasn&apos;t started the vision questionnaire yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const responses = questionnaire.responses || {};
  const answeredCount = Object.values(responses).filter(
    (v) => v?.trim()
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {questionnaire.submitted_at ? (
          <Badge className="bg-green-100 text-green-800">
            Submitted{" "}
            {new Date(questionnaire.submitted_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-800">
            Draft — {answeredCount} of {Object.keys(QUESTION_LABELS).length}{" "}
            answered
          </Badge>
        )}
      </div>

      {Object.entries(QUESTION_LABELS).map(([id, label]) => {
        const answer = responses[id];
        if (!answer?.trim()) return null;
        return (
          <Card key={id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-line">
                {answer}
              </p>
            </CardContent>
          </Card>
        );
      })}

      {answeredCount === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              No answers yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
