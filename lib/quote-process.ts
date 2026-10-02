/**
 * One request for a quote, scheduled three ways for the homepage timeline.
 * Times are working days. Eight hours to a day.
 */

export type HumanTouch = "truth" | "joy" | "relationships"

export type Phase = {
  /** The step this belongs to. A redo shares its step's id, so AI on the step speeds both. */
  id: string
  name: string
  /** Days the job sits before anyone picks it up, and why. */
  wait: number
  waiting?: string
  /** Days of actual work. */
  work: number
  human?: HumanTouch
  /** Done by software, so it costs no team hours. */
  agent?: boolean
  /** Work that only exists because something came back. */
  redo?: boolean
}

/** A phase, or several branches that run side by side and join back up. */
export type Stage = Phase | Phase[][]

export type SegmentKind = "wait" | "computer" | "human" | "rework"

export type Segment = {
  id: string
  kind: SegmentKind
  /** Nobody is working on it. A rework segment can be a wait too. */
  idle: boolean
  start: number
  end: number
  /** Which of `of` side-by-side tracks this runs on. */
  track: number
  of: number
  label: string
}

export type Schedule = {
  segments: Segment[]
  /** Days from request to quote. */
  lead: number
  /** Team hours per quote. */
  hours: number
  /** Share of those hours spent on Human Work. */
  humanShare: number
}

export type AiStep = {
  id: string
  name: string
  /** The kind of AI you can bolt on to this step. */
  tool: string
  /** How much faster the person gets. They still read it, check it, and send it. */
  boost: number
}

const HOURS_PER_DAY = 8

/** The quote process most firms run. */
export const TODAY: Stage[] = [
  { id: "meet", name: "Set the meeting", wait: 0.5, waiting: "In the associate's inbox", work: 0.06 },
  {
    id: "discovery",
    name: "Discovery call",
    wait: 3,
    waiting: "Waiting for a slot on the partner's calendar",
    work: 0.15,
    human: "relationships",
  },
  { id: "brief", name: "Brief the team", wait: 1, waiting: "In the partner's queue", work: 0.25 },
  [
    [
      { id: "requirements", name: "Pull requirements", wait: 0.5, waiting: "In the analyst's queue", work: 0.5 },
      {
        id: "requirements",
        name: "Redo the requirements",
        wait: 1.5,
        waiting: "Questions go back to the client",
        work: 0.25,
        redo: true,
      },
    ],
    [{ id: "map", name: "Map the work", wait: 1, waiting: "In the consultant's queue", work: 0.5 }],
  ],
  { id: "hours", name: "Measure the hours", wait: 0.5, waiting: "In the estimator's queue", work: 0.375 },
  {
    id: "approve",
    name: "Get approval",
    wait: 1.5,
    waiting: "In the partner's queue",
    work: 0.125,
    human: "truth",
  },
  { id: "hours", name: "Redo the hours", wait: 0.5, waiting: "Sent back with changes", work: 0.2, redo: true },
  {
    id: "approve",
    name: "Approval, second pass",
    wait: 1,
    waiting: "Back in the partner's queue",
    work: 0.06,
    human: "truth",
    redo: true,
  },
  {
    id: "present",
    name: "Client meeting",
    wait: 3,
    waiting: "Waiting for a slot on everyone's calendar",
    work: 0.125,
    human: "relationships",
  },
]

/**
 * What AI can do when the process stays the same: the person's own task, a little faster.
 * They still read it, check it, and send it.
 */
export const AI_STEPS: AiStep[] = [
  {
    id: "meet",
    name: "Set the meeting",
    tool: "Email drafting",
    boost: 1.4,
  },
  {
    id: "discovery",
    name: "Discovery call",
    tool: "Meeting notetaker",
    boost: 1.1,
  },
  {
    id: "brief",
    name: "Brief the team",
    tool: "Call summary",
    boost: 1.5,
  },
  {
    id: "requirements",
    name: "Pull requirements",
    tool: "Research assistant",
    boost: 1.25,
  },
  {
    id: "map",
    name: "Map the work",
    tool: "Drafting copilot",
    boost: 1.3,
  },
  {
    id: "hours",
    name: "Measure the hours",
    tool: "Spreadsheet copilot",
    boost: 1.3,
  },
  {
    id: "approve",
    name: "Get approval",
    tool: "Summary for the approver",
    boost: 1.2,
  },
  {
    id: "present",
    name: "Client meeting",
    tool: "Slide generator",
    boost: 1.2,
  },
]

/**
 * The same quote, redesigned. Everything it needs sits in one shared system that agents can
 * read without waiting on anyone, so nothing sits in a queue. The Computer Work is still done.
 * Agents do it, and people show up three times.
 */
export const REDESIGNED: Stage[] = [
  { id: "compile", name: "Agents compile the sources", wait: 0, work: 0.02, agent: true },
  { id: "conversation", name: "Client conversation", wait: 0, work: 0.125, human: "relationships" },
  { id: "shape", name: "Your expert shapes the approach", wait: 0, work: 0.19, human: "joy" },
  [
    [{ id: "build", name: "Agents build the quote", wait: 0, work: 0.03, agent: true }],
    [{ id: "build", name: "Agents build the quote", wait: 0, work: 0.03, agent: true }],
    [{ id: "build", name: "Agents build the quote", wait: 0, work: 0.03, agent: true }],
  ],
  { id: "checks", name: "Agents check the quote", wait: 0, work: 0.02, agent: true },
  { id: "sign", name: "Your expert confirms and signs off", wait: 0, work: 0.06, human: "truth" },
]

/** Lay the stages out on a clock. `boost` is how much faster the work at a step goes. */
export function schedule(stages: Stage[], boost: (id: string) => number = () => 1): Schedule {
  const segments: Segment[] = []
  let hours = 0
  let humanHours = 0

  const run = (phase: Phase, start: number, track: number, of: number) => {
    let at = start
    if (phase.wait > 0) {
      segments.push({
        id: phase.id,
        kind: phase.redo ? "rework" : "wait",
        idle: true,
        start: at,
        end: at + phase.wait,
        track,
        of,
        label: phase.waiting ?? "Waiting",
      })
      at += phase.wait
    }
    const work = phase.work / boost(phase.id)
    segments.push({
      id: phase.id,
      kind: phase.redo ? "rework" : phase.human ? "human" : "computer",
      idle: false,
      start: at,
      end: at + work,
      track,
      of,
      label: phase.name,
    })
    if (!phase.agent) {
      hours += work * HOURS_PER_DAY
      if (phase.human) humanHours += work * HOURS_PER_DAY
    }
    return at + work
  }

  let clock = 0
  for (const stage of stages) {
    if (Array.isArray(stage)) {
      const ends = stage.map((branch, track) =>
        branch.reduce((at, phase) => run(phase, at, track, stage.length), clock)
      )
      clock = Math.max(...ends)
    } else {
      clock = run(stage, clock, 0, 1)
    }
  }

  return { segments, lead: clock, hours, humanShare: humanHours / hours }
}
