"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICP_TEMPLATES } from "@/lib/list-builder/icp-templates";
import type { Vertical } from "@/server/repos/verticals";
import type { ListSearchCriteria } from "@/lib/validators/list-builder";

type Props = {
  verticals: Vertical[];
};

const STEPS = [
  "ICP Template",
  "Company Filters",
  "Contact Filters",
  "Source & Depth",
  "Review & Run",
];

const DEFAULT_CRITERIA: ListSearchCriteria = {
  industries: [],
  geographies: [],
  company_keywords: [],
  excluded_keywords: [],
  technologies: [],
  job_titles: ["founder", "ceo", "coo", "owner"],
  seniority_levels: ["owner", "c_suite", "vp", "director"],
  departments: ["operations", "executive"],
  website_keywords: [],
  signals_required: [],
  signals_excluded: [],
  max_records: 100,
  enrichment_depth: "standard",
};

export function CreateListWizard({ verticals }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [verticalId, setVerticalId] = useState<string>("");
  const [icpTemplate, setIcpTemplate] = useState<string>("");
  const [sourceProvider, setSourceProvider] = useState<"apollo" | "csv" | "manual">("apollo");
  const [criteria, setCriteria] = useState<ListSearchCriteria>(DEFAULT_CRITERIA);

  function applyTemplate(templateId: string) {
    const template = ICP_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setIcpTemplate(templateId);
    setName(template.name);
    setDescription(template.description);
    setCriteria(template.criteria);
    const match = verticals.find(
      (v) => v.name.toLowerCase().includes(template.vertical_hint.toLowerCase().split(" ")[0])
    );
    if (match) setVerticalId(match.id);
  }

  function updateCriteria(key: keyof ListSearchCriteria, value: unknown) {
    setCriteria((prev) => ({ ...prev, [key]: value }));
  }

  function parseArrayInput(value: string): string[] {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleCreate(runImmediately: boolean) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          vertical_id: verticalId || null,
          icp_template: icpTemplate || null,
          source_provider: sourceProvider,
          criteria,
        }),
      });

      const list = await res.json();
      if (!res.ok) throw new Error(list.error || "Failed to create");

      if (runImmediately && sourceProvider === "apollo") {
        await fetch(`/api/admin/lists/${list.id}/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "generate" }),
        });
      }

      router.push(`/admin/list-builder/${list.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create list");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create List</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <div className="flex gap-1 mt-3">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {ICP_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  icpTemplate === template.id
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-muted-foreground/30"
                }`}
                onClick={() => applyTemplate(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    {icpTemplate === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {template.proof_projects.map((p) => (
                      <Badge key={p} variant="outline" className="text-[10px]">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" onClick={() => { setIcpTemplate(""); setCriteria(DEFAULT_CRITERIA); }}>
            Start from blank
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>List Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Healthcare Services — Southeast" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Vertical</Label>
            <Select value={verticalId} onValueChange={setVerticalId}>
              <SelectTrigger><SelectValue placeholder="Select vertical" /></SelectTrigger>
              <SelectContent>
                {verticals.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Industries (comma-separated)</Label>
            <Input
              value={criteria.industries.join(", ")}
              onChange={(e) => updateCriteria("industries", parseArrayInput(e.target.value))}
            />
          </div>
          <div>
            <Label>Geographies (comma-separated)</Label>
            <Input
              value={criteria.geographies.join(", ")}
              onChange={(e) => updateCriteria("geographies", parseArrayInput(e.target.value))}
              placeholder="Georgia, Florida, Southeast"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Employees</Label>
              <Input
                type="number"
                value={criteria.employee_min || ""}
                onChange={(e) => updateCriteria("employee_min", parseInt(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Label>Max Employees</Label>
              <Input
                type="number"
                value={criteria.employee_max || ""}
                onChange={(e) => updateCriteria("employee_max", parseInt(e.target.value) || undefined)}
              />
            </div>
          </div>
          <div>
            <Label>Company Keywords</Label>
            <Input
              value={criteria.company_keywords.join(", ")}
              onChange={(e) => updateCriteria("company_keywords", parseArrayInput(e.target.value))}
            />
          </div>
          <div>
            <Label>Excluded Keywords</Label>
            <Input
              value={criteria.excluded_keywords.join(", ")}
              onChange={(e) => updateCriteria("excluded_keywords", parseArrayInput(e.target.value))}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>Job Titles to Find</Label>
            <Input
              value={criteria.job_titles.join(", ")}
              onChange={(e) => updateCriteria("job_titles", parseArrayInput(e.target.value))}
            />
          </div>
          <div>
            <Label>Seniority Levels</Label>
            <Input
              value={criteria.seniority_levels.join(", ")}
              onChange={(e) => updateCriteria("seniority_levels", parseArrayInput(e.target.value))}
            />
          </div>
          <div>
            <Label>Departments</Label>
            <Input
              value={criteria.departments.join(", ")}
              onChange={(e) => updateCriteria("departments", parseArrayInput(e.target.value))}
            />
          </div>
          <div>
            <Label>Website Keywords (pain signals)</Label>
            <Input
              value={criteria.website_keywords.join(", ")}
              onChange={(e) => updateCriteria("website_keywords", parseArrayInput(e.target.value))}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <Label>Data Source</Label>
            <Select value={sourceProvider} onValueChange={(v) => setSourceProvider(v as typeof sourceProvider)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apollo">Apollo (recommended)</SelectItem>
                <SelectItem value="csv">CSV Import</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Max Records</Label>
            <Input
              type="number"
              value={criteria.max_records}
              onChange={(e) => updateCriteria("max_records", parseInt(e.target.value) || 100)}
              min={1}
              max={500}
            />
          </div>
          <div>
            <Label>Enrichment Depth</Label>
            <Select
              value={criteria.enrichment_depth}
              onValueChange={(v) => updateCriteria("enrichment_depth", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal (company only)</SelectItem>
                <SelectItem value="standard">Standard (company + contacts)</SelectItem>
                <SelectItem value="deep">Deep (full enrichment + signals)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {step === 4 && (
        <Card>
          <CardContent className="pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source</span>
              <span className="capitalize">{sourceProvider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Records</span>
              <span>{criteria.max_records}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Industries</span>
              <span className="text-right max-w-[200px] truncate">
                {criteria.industries.join(", ") || "Any"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employees</span>
              <span>
                {criteria.employee_min || "?"}–{criteria.employee_max || "?"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact Titles</span>
              <span className="text-right max-w-[200px] truncate">
                {criteria.job_titles.join(", ")}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !name && !icpTemplate}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={submitting || !name}
              onClick={() => handleCreate(false)}
            >
              Save Draft
            </Button>
            <Button
              disabled={submitting || !name}
              onClick={() => handleCreate(true)}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Create & Generate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
