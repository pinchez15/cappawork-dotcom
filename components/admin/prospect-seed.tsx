"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, Check, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProspectSeedDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{
    verticals: number;
    prospects: number;
    sample: string[];
  } | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError(null);

    try {
      let parsed: Record<string, string>[];

      if (f.name.endsWith(".xlsx") || f.name.endsWith(".xls")) {
        const buffer = await f.arrayBuffer();
        parsed = parseExcel(buffer);
      } else {
        const text = await f.text();
        parsed = parseCSV(text);
      }

      setPreview({
        verticals: new Set(parsed.map((r) => r.vertical).filter(Boolean)).size,
        prospects: parsed.length,
        sample: parsed.slice(0, 5).map((r) => r.company_name || r.company || "unknown"),
      });
    } catch {
      setError("Could not parse file. Supported: .xlsx, .xls, .csv");
    }
  }

  function parseExcel(buffer: ArrayBuffer): Record<string, string>[] {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    return rows.map((row) => {
      const cleaned: Record<string, string> = {};
      for (const [key, val] of Object.entries(row)) {
        const normalizedKey = key
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_");
        cleaned[normalizedKey] = val != null ? String(val) : "";
      }
      return cleaned;
    });
  }

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];

    // Parse header — handle both comma and tab delimited
    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const headers = parseLine(lines[0], delimiter).map((h) =>
      h.trim().toLowerCase().replace(/\s+/g, "_")
    );

    return lines.slice(1).map((line) => {
      const values = parseLine(line, delimiter);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = (values[i] || "").trim();
      });
      return row;
    });
  }

  function parseLine(line: string, delimiter: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }

  async function handleSeed() {
    if (!file) return;
    setSeeding(true);
    setError(null);

    try {
      let rows: Record<string, string>[];
      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const buffer = await file.arrayBuffer();
        rows = parseExcel(buffer);
      } else {
        const text = await file.text();
        rows = parseCSV(text);
      }

      // Extract unique verticals
      const verticalNames = [
        ...new Set(rows.map((r) => r.vertical).filter(Boolean)),
      ];
      const verticals = verticalNames.map((name) => {
        const sample = rows.find((r) => r.vertical === name);
        return {
          name,
          tier: parseInt(sample?.tier || "2") || 2,
          close_speed: parseInt(sample?.close_speed || "5") || 5,
          ai_awareness: parseInt(sample?.ai_awareness || "5") || 5,
          automation_pain: parseInt(sample?.automation_pain || "5") || 5,
          rationale: sample?.rationale || null,
          sales_nav_boolean: sample?.sales_nav_boolean || null,
        };
      });

      // Map column names — be flexible with common variations
      const prospects = rows.map((r) => ({
        company_name:
          r.company_name || r.company || r.name || r.business_name || "",
        vertical: r.vertical || r.vertical_name || r.industry || "",
        estimated_revenue:
          r.estimated_revenue || r.revenue || r.annual_revenue || null,
        location: r.location || r.city_state || r.city || null,
        website: r.website || r.url || null,
        decision_maker_name:
          r.decision_maker_name || r.contact_name || r.ceo || r.owner || null,
        decision_maker_title:
          r.decision_maker_title || r.contact_title || r.title || null,
        linkedin_url: r.linkedin_url || r.linkedin || null,
        key_pain_point: r.key_pain_point || r.pain_point || null,
        why_closes_fast: r.why_closes_fast || null,
        trigger_event: r.trigger_event || null,
        trigger_event_source: r.trigger_event_source || null,
        tech_stack_signal: r.tech_stack_signal || r.tech_stack || null,
        tech_stack_source: r.tech_stack_source || null,
        personalized_first_line:
          r.personalized_first_line || r.first_line || null,
        cold_email_hook: r.cold_email_hook || r.email_hook || null,
        sales_nav_search_tip:
          r.sales_nav_search_tip || r.sales_nav_tip || null,
        sequence_stage: r.sequence_stage || r.stage || "not_started",
      }));

      const res = await fetch("/api/admin/prospects/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verticals, prospects }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.message);
        router.refresh();
      } else {
        setError(data.error || "Seed failed");
      }
    } catch (err) {
      setError("Failed to process file");
    }

    setSeeding(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Seed Prospects from File</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <p className="text-sm text-stone-500">
            Upload an Excel (.xlsx) or CSV file. Expected columns:
            company_name, vertical, tier, estimated_revenue, location,
            website, decision_maker_name, key_pain_point, trigger_event, etc.
          </p>

          <div
            className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-stone-400 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.tsv,.txt,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-stone-700">
                <FileSpreadsheet className="h-5 w-5 text-blue-500" />
                <span className="font-medium">{file.name}</span>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-500">
                  Click to upload CSV file
                </p>
              </div>
            )}
          </div>

          {preview && (
            <div className="bg-stone-50 rounded-lg p-4 text-sm">
              <div className="font-medium text-stone-700 mb-2">Preview:</div>
              <div className="text-stone-500">
                {preview.verticals} verticals, {preview.prospects} prospects
              </div>
              <div className="mt-2 text-xs text-stone-400">
                First 5: {preview.sample.join(", ")}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 text-green-700 rounded-lg p-3 text-sm flex items-center gap-2">
              <Check className="h-4 w-4" />
              {result}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {result ? "Done" : "Cancel"}
            </Button>
            {!result && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSeed}
                disabled={!file || !preview || seeding}
              >
                {seeding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1" />
                    Seed {preview?.prospects || 0} Prospects
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
