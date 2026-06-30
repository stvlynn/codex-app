// Restored from ref/webview/assets/home-use-cases-data-xcv4huMO.js

import { defineMessages } from "react-intl";

export interface UseCase {
  id: string;
  promptMessage: string;
  iconName: string;
  mode: "worktree" | "local";
  initialCollaborationMode?: string;
  isAutomation?: boolean;
  automationPromptMessage?: string;
}

function msg(id: string, defaultMessage: string, description: string) {
  return defineMessages({ [id]: { id, defaultMessage, description } })[id];
}

export const USE_CASES: UseCase[] = [
  {
    id: "snake-game",
    promptMessage: msg(
      "home.useCases.snakeGame.prompt",
      "Build a classic Snake game in this repo.\n\nScope & constraints:\n- Implement ONLY the classic Snake loop: grid movement, growing snake, food spawn, score, game-over, restart.\n- Reuse existing project tooling/frameworks; do NOT add new dependencies unless truly required.\n- Keep UI minimal and consistent with the repo's existing styles (no new design systems, no extra animations).\n\nImplementation plan:\n1) Inspect the repo to find the right place to add a small interactive game (existing pages/routes/components).\n2) Implement game state (snake positions, direction, food, score, tick timer) with deterministic, testable logic.\n3) Render: simple grid + snake + food; support keyboard controls (arrow keys/WASD) and on-screen controls if mobile is present in the repo.\n4) Add basic tests for the core game logic (movement, collisions, growth, food placement) if the repo has a test runner.\n\nDeliverables:\n- A small set of files/changes with clear names.\n- Short run instructions (how to start dev server + where to navigate).\n- A brief checklist of what to manually verify (controls, pause/restart, boundaries).",
      "Prompt for creating a classic snake game",
    ),
    iconName: "game-controller",
    mode: "worktree",
  },
  {
    id: "one-page-pdf",
    promptMessage: msg(
      "home.useCases.onePagePdf.prompt",
      "Create a one-page $pdf that summarizes this app.\n\nContent requirements (1 page total):\n- What it is: 1–2 sentence description.\n- Who it's for: primary user/persona.\n- What it does: 5–7 crisp bullets of key features.\n- How it works: a compact architecture overview (components/services/data flow) based ONLY on repo evidence.\n- How to run: the minimal 'getting started' steps.\n\nFormatting constraints:\n- Must fit on a single page (no overflow).\n- Prefer a clean, scannable layout: headings + bullets; avoid long paragraphs.\n- If the repo lacks key info, explicitly mark those items as 'Not found in repo.'\n\nDeliverable:\n- Output a generated $pdf and include its filename/path.",
      "Prompt for creating a one-page PDF summary",
    ),
    iconName: "pdf-document",
    mode: "local",
  },
  {
    id: "create-plan",
    promptMessage: msg(
      "home.useCases.createPlan.prompt",
      "Create a plan to…",
      "Prompt for creating a plan before implementation",
    ),
    iconName: "pencil",
    mode: "worktree",
    initialCollaborationMode: "plan",
  },
  {
    id: "daily-bug-scan",
    promptMessage: msg(
      "home.useCases.dailyBugScan.prompt",
      "Scan recent commits for likely bugs and propose minimal fixes.",
      "Prompt for a daily bug scan at 9am",
    ),
    automationPromptMessage: msg(
      "home.useCases.dailyBugScan.automationPrompt",
      "Scan recent commits (since the last run, or last 24h) for likely bugs and propose minimal fixes.\n\nGrounding rules:\n- Use ONLY concrete repo evidence (commit SHAs, PRs, file paths, diffs, failing tests, CI signals).\n- Do NOT invent bugs; if evidence is weak, say so and skip.\n- Prefer the smallest safe fix; avoid refactors and unrelated cleanup.",
      "Automation prompt for a daily bug scan at 9am",
    ),
    iconName: "ladybug",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "weekly-release-notes",
    promptMessage: msg(
      "home.useCases.weeklyReleaseNotes.prompt",
      "Draft release notes from merged PRs.",
      "Prompt for drafting weekly release notes",
    ),
    automationPromptMessage: msg(
      "home.useCases.weeklyReleaseNotes.automationPrompt",
      "Draft weekly release notes from merged PRs (include links when available).\n\nScope & grounding:\n- Stay strictly within the repo history for the week; do not add extra sections beyond what the data supports.\n- Use PR numbers/titles; avoid claims about impact unless supported by PR description/tests/metrics in repo.",
      "Automation prompt for drafting weekly release notes",
    ),
    iconName: "book-open",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "daily-standup",
    promptMessage: msg(
      "home.useCases.dailyStandup.prompt",
      "Summarize yesterday's git activity for standup.",
      "Prompt for a daily standup summary",
    ),
    automationPromptMessage: msg(
      "home.useCases.dailyStandup.automationPrompt",
      "Summarize yesterday's git activity for standup.\n\nGrounding rules:\n- Anchor statements to commits/PRs/files; do not speculate about intent or future work.\n- Keep it scannable and team-ready.",
      "Automation prompt for a daily standup summary",
    ),
    iconName: "bubble-on-bubble",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "nightly-ci-report",
    promptMessage: msg(
      "home.useCases.nightlyCiReport.prompt",
      "Summarize CI failures and flaky tests.",
      "Prompt for a nightly CI summary",
    ),
    automationPromptMessage: msg(
      "home.useCases.nightlyCiReport.automationPrompt",
      "Summarize CI failures and flaky tests from the last CI window; suggest top fixes.\n\nGrounding rules:\n- Cite specific jobs, tests, error messages, or log snippets when available.\n- Avoid overconfident root-cause claims; separate 'observed' vs 'suspected.'",
      "Automation prompt for a nightly CI summary",
    ),
    iconName: "radar",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "daily-classic-game",
    promptMessage: msg(
      "home.useCases.dailyClassicGame.prompt",
      "Create a small classic game with minimal scope.",
      "Prompt for creating a daily classic game at 2pm",
    ),
    automationPromptMessage: msg(
      "home.useCases.dailyClassicGame.automationPrompt",
      "Create a small classic game with minimal scope.\n\nConstraints:\n- Do NOT add extra features, styling systems, content, or new dependencies unless required.\n- Reuse existing repo tooling and patterns.",
      "Automation prompt for creating a daily classic game",
    ),
    iconName: "star-app",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "skill-progression-map",
    promptMessage: msg(
      "home.useCases.skillProgressionMap.prompt",
      "Suggest next skills to deepen from recent PRs and reviews.",
      "Prompt for a weekly skill progression map based on recent PRs and reviews",
    ),
    automationPromptMessage: msg(
      "home.useCases.skillProgressionMap.automationPrompt",
      "From recent PRs and reviews, suggest next skills to deepen.\n\nGrounding rules:\n- Anchor each suggestion to concrete evidence (PR themes, review comments, recurring issues).\n- Avoid generic advice; make each recommendation actionable and specific.",
      "Automation prompt for a skill progression map",
    ),
    iconName: "hierarchy",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "weekly-engineering-summary",
    promptMessage: msg(
      "home.useCases.weeklyEngineeringSummary.prompt",
      "Synthesize this week's PRs, rollouts, incidents, and reviews.",
      "Prompt for a weekly engineering summary across projects",
    ),
    automationPromptMessage: msg(
      "home.useCases.weeklyEngineeringSummary.automationPrompt",
      "Synthesize this week's PRs, rollouts, incidents, and reviews into a weekly update.\n\nGrounding rules:\n- Do not invent events; if data is missing, say that briefly.\n- Prefer concrete references (PR #, incident ID, rollout note, file path) where available.",
      "Automation prompt for a weekly engineering summary",
    ),
    iconName: "figure-text-document",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "performance-regression-watch",
    promptMessage: msg(
      "home.useCases.performanceRegressionWatch.prompt",
      "Watch for performance regressions in recent changes.",
      "Prompt for a daily performance regression watch",
    ),
    automationPromptMessage: msg(
      "home.useCases.performanceRegressionWatch.automationPrompt",
      "Compare recent changes to benchmarks or traces and flag regressions early.\n\nGrounding rules:\n- Ground claims in measurable signals (benchmarks, traces, timings, flamegraphs).\n- If measurements are unavailable, state 'No measurements found' rather than guessing.",
      "Automation prompt for a performance regression watch",
    ),
    iconName: "bar-chart",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "dependency-sdk-drift",
    promptMessage: msg(
      "home.useCases.dependencySdkDrift.prompt",
      "Detect dependency and SDK drift; propose alignment.",
      "Prompt for a daily dependency and SDK drift check",
    ),
    automationPromptMessage: msg(
      "home.useCases.dependencySdkDrift.automationPrompt",
      "Detect dependency and SDK drift and propose a minimal alignment plan.\n\nGrounding rules:\n- Cite current and target versions from the repo when possible (lockfiles, package manifests).\n- Do not guess versions; if targets are unclear, propose options and label them as suggestions.",
      "Automation prompt for a dependency and SDK drift check",
    ),
    iconName: "checkmark-circle",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "test-gap-detection",
    promptMessage: msg(
      "home.useCases.testGapDetection.prompt",
      "Find test gaps from recent changes; create draft PRs.",
      "Prompt for a daily test gap detection automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.testGapDetection.automationPrompt",
      "Identify untested paths from recent changes; add focused tests and use $yeet for draft PRs.\n\nConstraints:\n- Keep scope tight to the changed areas; avoid broad refactors.\n- Prefer small, reliable tests that fail before and pass after.",
      "Automation prompt for a test gap detection run",
    ),
    iconName: "puzzle",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "pre-release-check",
    promptMessage: msg(
      "home.useCases.preReleaseCheck.prompt",
      "Run a pre-release checklist before tagging.",
      "Prompt for a pre-release checklist automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.preReleaseCheck.automationPrompt",
      "Before tagging, verify changelog, migrations, feature flags, and tests.\n\nGrounding rules:\n- Report ONLY what you can confirm from the repo and CI context.\n- If a check cannot be verified, mark it explicitly as 'Unknown.'",
      "Automation prompt for a pre-release checklist",
    ),
    iconName: "checkmark-circle",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "agents-docs-sync",
    promptMessage: msg(
      "home.useCases.agentsDocsSync.prompt",
      "Update AGENTS.md with new workflows and commands.",
      "Prompt for a weekly AGENTS.md update automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.agentsDocsSync.automationPrompt",
      "Update AGENTS.md with newly discovered workflows and commands.\n\nConstraints:\n- Keep edits minimal, accurate, and grounded in repo usage.\n- Do not touch unrelated sections or auto-generated files.\n- If you are unsure, prefer adding a TODO with a short note rather than inventing.",
      "Automation prompt for updating AGENTS.md",
    ),
    iconName: "text-document",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "weekly-pr-summary",
    promptMessage: msg(
      "home.useCases.weeklyPrSummary.prompt",
      "Summarize last week's PRs by teammate and theme.",
      "Prompt for a weekly PR summary automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.weeklyPrSummary.automationPrompt",
      "Summarize last week's PRs by teammate and theme; highlight risks.\n\nGrounding rules:\n- Use PR numbers/titles when available.\n- Avoid speculation about impact; stick to what the PR changed.",
      "Automation prompt for a weekly PR summary",
    ),
    iconName: "newspaper",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "issue-triage",
    promptMessage: msg(
      "home.useCases.issueTriage.prompt",
      "Triage new issues and suggest owners and priority.",
      "Prompt for a daily issue triage automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.issueTriage.automationPrompt",
      "Triage new issues; suggest owner, priority, and labels.\n\nGrounding rules:\n- Base recommendations on issue content + repo context (CODEOWNERS, touched areas, prior similar issues).\n- Do not guess owners without signals; if unclear, say 'Owner: Unknown' and suggest a team instead.",
      "Automation prompt for issue triage",
    ),
    iconName: "exclamationmark-bubble",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "ci-monitor",
    promptMessage: msg(
      "home.useCases.ciMonitor.prompt",
      "Check CI failures; group likely root causes.",
      "Prompt for a CI monitoring automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.ciMonitor.automationPrompt",
      "Check CI failures; group by likely root cause and suggest minimal fixes.\n\nGrounding rules:\n- Cite jobs, tests, errors, and log evidence.\n- Avoid overconfident root-cause claims; label uncertain items as 'Suspected.'",
      "Automation prompt for CI monitoring",
    ),
    iconName: "terminal",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "dependency-sweep",
    promptMessage: msg(
      "home.useCases.dependencySweep.prompt",
      "Scan outdated dependencies and propose safe upgrades.",
      "Prompt for a dependency sweep automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.dependencySweep.automationPrompt",
      "Scan outdated dependencies; propose safe upgrades with minimal changes.\n\nRules:\n- Prefer the smallest viable upgrade set.\n- Explicitly call out breaking-change risks and required migrations.\n- Do not propose upgrades without identifying current versions from the repo.",
      "Automation prompt for a dependency sweep",
    ),
    iconName: "block-stack, skills",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "performance-audit",
    promptMessage: msg(
      "home.useCases.performanceAudit.prompt",
      "Audit performance regressions; propose fixes.",
      "Prompt for a weekly performance audit automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.performanceAudit.automationPrompt",
      "Audit performance regressions and propose highest-leverage fixes.\n\nGrounding rules:\n- Ground claims in measurements/traces when available.\n- If evidence is missing, state uncertainty briefly and suggest what to measure next.",
      "Automation prompt for a performance audit",
    ),
    iconName: "compass",
    mode: "worktree",
    isAutomation: true,
  },
  {
    id: "changelog-update",
    promptMessage: msg(
      "home.useCases.changelogUpdate.prompt",
      "Update the changelog with this week's highlights.",
      "Prompt for a weekly changelog update automation",
    ),
    automationPromptMessage: msg(
      "home.useCases.changelogUpdate.automationPrompt",
      "Update the changelog with this week's highlights and key PR links.\n\nConstraints:\n- Only include items supported by repo history.\n- Keep structure simple and consistent with existing changelog format.",
      "Automation prompt for updating the changelog",
    ),
    iconName: "pencil",
    mode: "worktree",
    isAutomation: true,
  },
];

export function getAutomationUseCases(): UseCase[] {
  return USE_CASES.filter((item) => item.isAutomation === true);
}
