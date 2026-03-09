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

      const validProspects = parsed.filter((r) => r.company_name || r.company || r.name);
      setPreview({
        verticals: new Set(validProspects.map((r) => r.vertical || r.primary_industry).filter(Boolean)).size,
        prospects: validProspects.length,
        sample: validProspects.slice(0, 5).map((r) => r.company_name || r.company || r.name || "unknown"),
      });
    } catch (err) {
      console.error("Parse error:", err);
      setError("Could not parse file. Supported: .xlsx, .xls, .csv");
    }
  }

  function parseExcel(buffer: ArrayBuffer): Record<string, string>[] {
    const workbook = XLSX.read(buffer, { type: "array" });

    // Try to find a prospect/company sheet
    const prospectSheet =
      workbook.SheetNames.find((n: string) => n.toLowerCase().includes("prospect")) ||
      workbook.SheetNames.find((n: string) => n.toLowerCase().includes("company")) ||
      workbook.SheetNames[0];

    const sheet = workbook.Sheets[prospectSheet];
    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 }) as unknown[][];

    // Find the header row — look for a row containing "Company" or "company_name"
    let headerIdx = 0;
    for (let i = 0; i < Math.min(10, rawRows.length); i++) {
      const row = rawRows[i];
      if (!row) continue;
      const joined = row.map((c) => String(c || "").toLowerCase()).join(" ");
      if (joined.includes("company") && (joined.includes("vertical") || joined.includes("revenue") || joined.includes("location"))) {
        headerIdx = i;
        break;
      }
    }

    const headers = (rawRows[headerIdx] || []).map((h) =>
      String(h || "")
        .trim()
        .toLowerCase()
        .replace(/\n/g, " ")
        .replace(/\s+/g, "_")
        .replace(/[()]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
    );

    // Column name mapping — map spreadsheet columns to our field names
    // Supports native format, Clay exports, and LinkedIn Sales Nav exports
    const columnMap: Record<string, string> = {
      "#": "_index",
      find_companies: "_skip",
      enrich_company: "_skip",
      research_company_icp_with_ai: "_skip",
      find_open_jobs: "_skip",
      find_active_job_openings: "_skip",
      job_openings: "_skip",
      follower_count: "_skip",
      // Company name
      company_name: "company_name",
      company: "company_name",
      name: "company_name",
      business_name: "company_name",
      // Vertical / Industry
      vertical: "vertical",
      vertical_name: "vertical",
      industry: "vertical",
      primary_industry: "vertical",
      // Revenue / Size
      "est._revenue": "estimated_revenue",
      est_revenue: "estimated_revenue",
      estimated_revenue: "estimated_revenue",
      revenue: "estimated_revenue",
      annual_revenue: "estimated_revenue",
      size: "estimated_revenue",
      // Location
      location: "location",
      city_state: "location",
      city: "location",
      // Website
      website: "website",
      url: "website",
      domain: "website",
      // Description
      description: "description",
      // Company type / metadata
      type: "_type",
      country: "_country",
      founded: "_founded",
      employee_count: "employee_count",
      // Decision maker
      decision_maker_name: "decision_maker_name",
      decision_maker: "decision_maker_name",
      contact_name: "decision_maker_name",
      ceo: "decision_maker_name",
      owner: "decision_maker_name",
      // Title
      decision_maker_title: "decision_maker_title",
      contact_title: "decision_maker_title",
      title: "decision_maker_title",
      // LinkedIn
      linkedin_url: "linkedin_url",
      linkedin: "linkedin_url",
      // Pain / Close
      key_pain_point: "key_pain_point",
      pain_point: "key_pain_point",
      why_they_close_fast: "why_closes_fast",
      why_closes_fast: "why_closes_fast",
      // Sales tools
      linkedin_sales_nav_search_tip: "sales_nav_search_tip",
      sales_nav_search_tip: "sales_nav_search_tip",
      cold_email_hook: "cold_email_hook",
      email_hook: "cold_email_hook",
      // Status
      status: "_status",
      // Email
      email_verified: "email_verified",
      email: "email_verified",
      // Triggers / Signals
      trigger_event_buying_signal: "trigger_event",
      trigger_event: "trigger_event",
      buying_signal: "trigger_event",
      tech_stack_signal: "tech_stack_signal",
      tech_stack: "tech_stack_signal",
      // Score
      "priority_score_1-100": "priority_score",
      priority_score: "priority_score",
      // Outreach
      personalized_first_line: "personalized_first_line",
      first_line: "personalized_first_line",
      // Stage
      sequence_stage: "sequence_stage",
      stage: "sequence_stage",
      // Tier
      tier: "tier",
    };

    const results: Record<string, string>[] = [];
    for (let i = headerIdx + 1; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length === 0) continue;

      const record: Record<string, string> = {};
      headers.forEach((h, idx) => {
        const mappedKey = columnMap[h] || h;
        if (mappedKey.startsWith("_")) return; // Skip internal cols
        const val = row[idx];
        // Skip placeholder values like [Find via Sales Nav]
        if (val != null && !String(val).startsWith("[")) {
          record[mappedKey] = String(val);
        }
      });

      // Only include rows that have a company name
      if (record.company_name) {
        results.push(record);
      }
    }

    return results;
  }

  function parseExcelFull(buffer: ArrayBuffer): {
    verticals: Record<string, unknown>[];
    templates: Record<string, unknown>[];
  } {
    const workbook = XLSX.read(buffer, { type: "array" });
    const verticals: Record<string, unknown>[] = [];
    const templates: Record<string, unknown>[] = [];

    // Parse Vertical Rankings sheet
    const vSheetName = workbook.SheetNames.find((n: string) =>
      n.toLowerCase().includes("vertical")
    );
    if (vSheetName) {
      const vSheet = workbook.Sheets[vSheetName];
      const vRows = XLSX.utils.sheet_to_json<unknown[]>(vSheet, { header: 1 }) as unknown[][];

      // Find header row (contains "Vertical" and "Tier")
      let hIdx = 0;
      for (let i = 0; i < Math.min(10, vRows.length); i++) {
        const joined = (vRows[i] || []).map((c) => String(c || "").toLowerCase()).join(" ");
        if (joined.includes("vertical") && joined.includes("tier")) {
          hIdx = i;
          break;
        }
      }

      for (let i = hIdx + 1; i < vRows.length; i++) {
        const r = vRows[i];
        if (!r || !r[1] || typeof r[1] !== "string") continue;
        const tierStr = String(r[2] || "");
        const tier = tierStr.includes("1") ? 1 : tierStr.includes("2") ? 2 : tierStr.includes("3") ? 3 : 2;
        if (typeof r[3] !== "number" && typeof r[3] !== "undefined") continue; // Skip summary rows
        verticals.push({
          name: r[1],
          tier,
          close_speed: typeof r[3] === "number" ? r[3] : 5,
          ai_awareness: typeof r[4] === "number" ? r[4] : 5,
          automation_pain: typeof r[5] === "number" ? r[5] : 5,
          rationale: r[7] || null,
        });
      }
    }

    // Parse Outreach Sequences sheet
    const oSheetName = workbook.SheetNames.find((n: string) =>
      n.toLowerCase().includes("outreach") || n.toLowerCase().includes("sequence")
    );
    if (oSheetName) {
      const oSheet = workbook.Sheets[oSheetName];
      const oRows = XLSX.utils.sheet_to_json<unknown[]>(oSheet, { header: 1 }) as unknown[][];

      let currentTier = 1;
      for (let i = 3; i < oRows.length; i++) {
        const r = oRows[i];
        if (!r) continue;
        const first = String(r[0] || "");
        if (first.includes("TIER 1")) { currentTier = 1; continue; }
        if (first.includes("TIER 2")) { currentTier = 2; continue; }
        if (first.includes("TIER 3")) { currentTier = 3; continue; }
        if (!r[2] || !r[3]) continue;

        const ch = String(r[2] || "").toLowerCase();
        let channel = "other";
        if (ch.includes("dm")) channel = "linkedin_dm";
        else if (ch.includes("linkedin")) channel = "linkedin_engage";
        else if (ch.includes("email")) channel = "email";

        templates.push({
          sequence_tier: currentTier,
          step_number: parseInt(String(r[0])) || i,
          channel,
          template_name: `Tier ${currentTier} - Step ${r[0]} - ${r[2]}`,
          body_template: String(r[3]),
          is_active: true,
        });
      }
    }

    return { verticals, templates };
  }

  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];

    // Parse header — handle both comma and tab delimited
    const delimiter = lines[0].includes("\t") ? "\t" : ",";
    const rawHeaders = parseLine(lines[0], delimiter).map((h) =>
      h.trim().toLowerCase().replace(/\s+/g, "_").replace(/[()]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, "")
    );

    // Apply same column mapping as Excel parser for consistency
    const csvColumnMap: Record<string, string> = {
      name: "company_name",
      company: "company_name",
      company_name: "company_name",
      business_name: "company_name",
      primary_industry: "vertical",
      industry: "vertical",
      vertical: "vertical",
      vertical_name: "vertical",
      size: "size",
      employee_count: "employee_count",
      domain: "domain",
      website: "website",
      url: "website",
      linkedin_url: "linkedin_url",
      linkedin: "linkedin_url",
      location: "location",
      city_state: "location",
      city: "location",
      country: "_country",
      type: "_type",
      founded: "_founded",
      description: "description",
      estimated_revenue: "estimated_revenue",
      revenue: "estimated_revenue",
      annual_revenue: "estimated_revenue",
      decision_maker_name: "decision_maker_name",
      contact_name: "decision_maker_name",
      decision_maker_title: "decision_maker_title",
      contact_title: "decision_maker_title",
      title: "decision_maker_title",
      key_pain_point: "key_pain_point",
      pain_point: "key_pain_point",
      trigger_event: "trigger_event",
      tech_stack_signal: "tech_stack_signal",
      tech_stack: "tech_stack_signal",
      sequence_stage: "sequence_stage",
      stage: "sequence_stage",
      tier: "tier",
    };

    const headers = rawHeaders.map((h) => csvColumnMap[h] || h);

    return lines.slice(1).map((line) => {
      const values = parseLine(line, delimiter);
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        if (h.startsWith("_")) return; // Skip internal columns
        const val = (values[i] || "").trim();
        if (val) row[h] = val;
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
      let verticals: Record<string, unknown>[] = [];
      let templates: Record<string, unknown>[] = [];

      if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const buffer = await file.arrayBuffer();
        rows = parseExcel(buffer);

        // Also extract verticals and templates from other sheets
        const parsed = parseExcelFull(buffer);
        verticals = parsed.verticals;
        templates = parsed.templates;
      } else {
        const text = await file.text();
        rows = parseCSV(text);

        // For CSV, extract verticals from the data itself
        const verticalNames = [
          ...new Set(rows.map((r) => r.vertical || r.primary_industry).filter(Boolean)),
        ];
        verticals = verticalNames.map((name) => {
          const sample = rows.find((r) => (r.vertical || r.primary_industry) === name);
          return {
            name,
            tier: parseInt(sample?.tier || "2") || 2,
          };
        });
      }

      // Map column names — be flexible with common variations
      // Handles native format, Clay exports, and LinkedIn Sales Nav exports
      const prospects = rows.map((r) => {
        // Normalize website: if it's a bare domain, add https://
        let website = r.website || r.url || r.domain || null;
        if (website && !website.startsWith("http")) {
          website = `https://${website}`;
        }

        // Normalize employee-count-based revenue estimate
        let revenue = r.estimated_revenue || r.revenue || r.annual_revenue || null;
        if (!revenue && r.size) {
          // Map Clay "Size" field (e.g. "11-50 employees") to revenue estimate
          const sizeStr = r.size.toLowerCase();
          if (sizeStr.includes("11-50")) revenue = "$3M-$10M";
          else if (sizeStr.includes("51-200")) revenue = "$10M-$50M";
          else if (sizeStr.includes("201-500")) revenue = "$50M+";
          else if (sizeStr.includes("1-10") || sizeStr.includes("2-10")) revenue = "$1M-$3M";
        }
        if (!revenue && r.employee_count) {
          const count = parseInt(r.employee_count);
          if (count > 200) revenue = "$50M+";
          else if (count > 50) revenue = "$10M-$50M";
          else if (count > 10) revenue = "$3M-$10M";
          else if (count > 0) revenue = "$1M-$3M";
        }

        return {
          company_name:
            r.company_name || r.company || r.name || r.business_name || "",
          vertical: r.vertical || r.vertical_name || r.industry || r.primary_industry || "",
          estimated_revenue: revenue,
          location: r.location || r.city_state || r.city || null,
          website,
          description: r.description || null,
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
        };
      });

      const res = await fetch("/api/admin/prospects/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verticals, prospects, templates }),
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
