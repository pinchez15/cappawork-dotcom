import { supabaseAdmin } from "@/lib/db/client";

export type OutreachGoal = {
  id: string;
  goal_text: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OutreachTarget = {
  text: string;
  completed: boolean;
};

export type OutreachCounts = Record<string, number>;

export type OutreachEodChecks = Record<string, boolean>;

export type OutreachEntry = {
  id: string;
  goal_id: string | null;
  entry_date: string;
  targets: OutreachTarget[];
  counts: OutreachCounts;
  eod_checks: OutreachEodChecks;
  gratitude: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getActiveGoal(): Promise<OutreachGoal | null> {
  const { data, error } = await supabaseAdmin
    .from("outreach_goals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createGoal(
  goalText: string,
  startDate: string
): Promise<OutreachGoal> {
  // Deactivate any existing active goals
  await supabaseAdmin
    .from("outreach_goals")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("is_active", true);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 90);

  const { data, error } = await supabaseAdmin
    .from("outreach_goals")
    .insert({
      goal_text: goalText,
      start_date: startDate,
      end_date: endDate.toISOString().slice(0, 10),
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(
  goalId: string,
  updates: Partial<Pick<OutreachGoal, "goal_text" | "is_active">>
): Promise<OutreachGoal> {
  const { data, error } = await supabaseAdmin
    .from("outreach_goals")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", goalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEntryByDate(
  date: string
): Promise<OutreachEntry | null> {
  const { data, error } = await supabaseAdmin
    .from("outreach_entries")
    .select("*")
    .eq("entry_date", date)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertEntry(
  date: string,
  entryData: Partial<
    Pick<
      OutreachEntry,
      "goal_id" | "targets" | "counts" | "eod_checks" | "gratitude" | "notes"
    >
  >
): Promise<OutreachEntry> {
  const { data, error } = await supabaseAdmin
    .from("outreach_entries")
    .upsert(
      {
        entry_date: date,
        ...entryData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "entry_date" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEntriesForRange(
  startDate: string,
  endDate: string
): Promise<OutreachEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("outreach_entries")
    .select("*")
    .gte("entry_date", startDate)
    .lte("entry_date", endDate)
    .order("entry_date", { ascending: true });

  if (error) throw error;
  return data || [];
}
