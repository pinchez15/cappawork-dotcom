import { type Dimension, DIMENSION_LABELS, QUESTIONS } from "./questions";

export type DimensionScore = {
  key: Dimension;
  label: string;
  score: number; // 0–100
  grade: string;
};

export type ScorecardResult = {
  overall: number; // 0–100
  grade: string;
  categories: DimensionScore[];
  topLeaks: DimensionScore[];
};

/** Map a 0–100 score to a letter grade. */
export function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

/** Compute per-dimension scores from raw answers (question id → selected option index). */
export function computeScores(
  answers: Record<number, number>
): ScorecardResult {
  const dimensions: Dimension[] = [
    "pricing",
    "frequency",
    "aov",
    "concentration",
    "overhead",
    "retention",
  ];

  const categories: DimensionScore[] = dimensions.map((dim) => {
    const dimQuestions = QUESTIONS.filter((q) => q.dimension === dim);
    let total = 0;
    let count = 0;

    for (const q of dimQuestions) {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined && q.options[selectedIndex]) {
        total += q.options[selectedIndex].score;
        count++;
      }
    }

    // Scale from 1–4 average to 0–100
    const avg = count > 0 ? total / count : 1;
    const score = Math.round(((avg - 1) / 3) * 100);

    return {
      key: dim,
      label: DIMENSION_LABELS[dim],
      score,
      grade: scoreToGrade(score),
    };
  });

  const overall =
    categories.length > 0
      ? Math.round(
          categories.reduce((sum, c) => sum + c.score, 0) / categories.length
        )
      : 0;

  const topLeaks = [...categories].sort((a, b) => a.score - b.score);

  return {
    overall,
    grade: scoreToGrade(overall),
    categories,
    topLeaks,
  };
}
