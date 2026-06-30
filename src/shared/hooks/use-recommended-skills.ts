// Restored from ref/webview/assets/use-recommended-skills-Dpf-Uwom.js
// useRecommendedSkills hook restored from the Codex webview bundle.

export interface RecommendedSkill {
  id: string;
  name: string;
  repoPath?: string;
}
export interface RecommendedSkillsResponse {
  skills: RecommendedSkill[];
  error?: string;
}
export interface InstallSkillOptions {
  skill: RecommendedSkill;
  installRoot?: string | null;
}
export interface SkillStatsigOverrides {
  [skillId: string]: string;
}
export function getSkillOverride(
  overrides: SkillStatsigOverrides,
  skillId: string,
): string | undefined {
  return overrides[skillId];
}
export interface UseRecommendedSkillsOptions {
  hostId: string;
  loadOnMount?: boolean;
  vscodeApi: {
    call: (method: string, params: Record<string, unknown>) => Promise<unknown>;
  } | null;
  statsigOverrides: SkillStatsigOverrides;
}
export interface UseRecommendedSkillsResult {
  data: RecommendedSkillsResponse | null;
  errorMessage: string | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  ensureSkillByName: (name: string) => Promise<RecommendedSkill | null>;
  installSkill: (options: InstallSkillOptions) => Promise<unknown>;
}
export function useRecommendedSkills(
  options: UseRecommendedSkillsOptions,
): UseRecommendedSkillsResult {
  const { hostId, loadOnMount = true, vscodeApi, statsigOverrides } = options;

  // This is a simplified version that returns the structure.
  // In the actual app, this would use TanStack Query's useQuery and useMutation.
  const data: RecommendedSkillsResponse | null = null;
  const isLoading = loadOnMount;
  const errorMessage = null;
  const refresh = async (): Promise<void> => {
    if (!vscodeApi) return;
    await vscodeApi.call("recommended-skills", {
      hostId,
      refresh: true,
    });
  };
  const ensureSkillByName = async (
    name: string,
  ): Promise<RecommendedSkill | null> => {
    const skills = data?.skills ?? [];
    const match = findSkillByName(skills, name);
    if (match) return match;
    if (!vscodeApi) return null;
    const refreshed = (await vscodeApi.call("recommended-skills", {
      hostId,
      refresh: false,
    })) as RecommendedSkillsResponse;
    return findSkillByName(refreshed.skills, name);
  };
  const installSkill = async (
    installOptions: InstallSkillOptions,
  ): Promise<unknown> => {
    if (!vscodeApi) {
      throw new Error("VSCode API is not available");
    }
    return vscodeApi.call("install-recommended-skill", {
      hostId,
      skillId: installOptions.skill.id,
      repoPath: installOptions.skill.repoPath,
      installRoot: installOptions.installRoot,
      skillStatsigOverride: getSkillOverride(
        statsigOverrides,
        installOptions.skill.id,
      ),
    });
  };
  return {
    data,
    errorMessage,
    isLoading,
    refresh,
    ensureSkillByName,
    installSkill,
  };
}
function findSkillByName(
  skills: RecommendedSkill[],
  name: string,
): RecommendedSkill | null {
  const lowerName = name.toLowerCase();
  return (
    skills.find((skill) => {
      const lowerSkillName = skill.name.toLowerCase();
      const lowerSkillId = skill.id.toLowerCase();
      return lowerSkillName === lowerName || lowerSkillId === lowerName;
    }) ?? null
  );
}
