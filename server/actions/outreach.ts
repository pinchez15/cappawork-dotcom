"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  createGoal,
  updateGoal,
  getEntryByDate,
  upsertEntry,
  type OutreachTarget,
  type OutreachCounts,
  type OutreachEodChecks,
} from "@/server/repos/outreach";

const OUTREACH_PATH = "/admin/outreach";

export async function createGoalAction(goalText: string) {
  await requireAdmin();
  const startDate = new Date().toISOString().slice(0, 10);
  const goal = await createGoal(goalText, startDate);
  revalidatePath(OUTREACH_PATH);
  return goal;
}

export async function updateGoalAction(goalId: string, goalText: string) {
  await requireAdmin();
  const goal = await updateGoal(goalId, { goal_text: goalText });
  revalidatePath(OUTREACH_PATH);
  return goal;
}

export async function updateCounterAction(
  date: string,
  counterId: string,
  value: number
) {
  await requireAdmin();
  const existing = await getEntryByDate(date);
  const counts: OutreachCounts = (existing?.counts as OutreachCounts) || {};
  counts[counterId] = value;
  await upsertEntry(date, { counts });
  revalidatePath(OUTREACH_PATH);
}

export async function updateTargetsAction(
  date: string,
  targets: OutreachTarget[]
) {
  await requireAdmin();
  await upsertEntry(date, { targets });
  revalidatePath(OUTREACH_PATH);
}

export async function toggleEodCheckAction(
  date: string,
  checkIndex: number,
  checked: boolean
) {
  await requireAdmin();
  const existing = await getEntryByDate(date);
  const eodChecks: OutreachEodChecks =
    (existing?.eod_checks as OutreachEodChecks) || {};
  eodChecks[String(checkIndex)] = checked;
  await upsertEntry(date, { eod_checks: eodChecks });
  revalidatePath(OUTREACH_PATH);
}

export async function updateNotesAction(date: string, notes: string) {
  await requireAdmin();
  await upsertEntry(date, { notes });
  revalidatePath(OUTREACH_PATH);
}

export async function updateGratitudeAction(date: string, gratitude: string[]) {
  await requireAdmin();
  await upsertEntry(date, { gratitude });
  revalidatePath(OUTREACH_PATH);
}
