// Restored from ref/webview/assets/recommended-skill-statsig-overrides-fCzT8bPX.js
// recommended-skill-statsig-overrides-fCzT8bPX chunk restored from the Codex webview bundle.
import { useMemoCache as useReactMemoCache } from "react";
import { useStatsigValue } from "@statsig/js-client";
import { z } from "zod";
const STATSIG_EXPERIMENT_KEY = "1852350085";
const nonEmptyString = z.string().refine((val) => val.trim().length > 0);
const skillOverridesSchema = z
  .object({
    skill_markdown_by_id: z.record(z.string(), nonEmptyString).optional(),
  })
  .catch({
    skill_markdown_by_id: {},
  });
export interface SkillStatsigOverrides {
  [skillId: string]: string;
}
export function useRecommendedSkillStatsigOverrides(): SkillStatsigOverrides {
  const scope = useReactMemoCache(2);
  const { value: rawValue } = useStatsigValue(STATSIG_EXPERIMENT_KEY);
  let result: SkillStatsigOverrides;
  if (scope[0] === rawValue) {
    result = scope[1];
  } else {
    result = parseSkillOverrides(rawValue);
    scope[0] = rawValue;
    scope[1] = result;
  }
  return result;
}
function parseSkillOverrides(rawValue: unknown): SkillStatsigOverrides {
  const overrides: SkillStatsigOverrides = {};
  const parsed = skillOverridesSchema.parse(rawValue);
  for (const [skillId, markdown] of Object.entries(
    parsed.skill_markdown_by_id ?? {},
  )) {
    const safeResult = nonEmptyString.safeParse(markdown);
    if (safeResult.success) {
      overrides[skillId] = safeResult.data;
    }
  }
  return overrides;
}
export function getSkillOverride(
  overrides: SkillStatsigOverrides,
  skillId: string,
): string | undefined {
  return overrides[skillId];
}
