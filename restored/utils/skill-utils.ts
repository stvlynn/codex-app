// Restored from ref/webview/assets/skill-utils-CHI5umVz.js
// Skill utility functions restored from the Codex webview bundle.

export interface Skill {
  name: string;
  path?: string;
  interface?: {
    displayName?: string;
    defaultPrompt?: string;
  };
}

export interface SkillGroup {
  skills: Skill[];
}

export interface SkillsData {
  data: SkillGroup[];
}

function camelCaseToTitle(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function getSkillDisplayName(skill: Skill): string {
  return skill.interface?.displayName?.trim() || camelCaseToTitle(skill.name);
}

function getSkillDefaultPrompt(skill: Skill): string | null {
  const prompt = skill.interface?.defaultPrompt;
  if (!prompt) return null;

  const trimmed = prompt.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function sanitizeUrl(url: string): string {
  return url.replace(/[<>'"]/g, "");
}

function formatSkillMention(skill: Skill): string {
  const { name, path } = skill;
  return path ? `[$${name}](${sanitizeUrl(path)})` : `$${name}`;
}

export function findSkillByName(
  skillsData: SkillsData,
  name: string,
): Skill | null {
  const lowerName = name.toLowerCase();
  const matches: Skill[] = [];

  for (const group of skillsData.data) {
    const exactMatch = group.skills.find(
      (skill) => skill.name.toLowerCase() === lowerName,
    );
    if (exactMatch != null) return exactMatch;

    matches.push(
      ...group.skills.filter((skill) =>
        skill.name.toLowerCase().endsWith(`:${lowerName}`),
      ),
    );
  }

  return matches.length === 1 ? matches[0] : null;
}

function ensureTrailingSpace(text: string): string {
  return text.endsWith(" ") ? text : `${text} `;
}

export function getSkillPromptWithMention(skill: Skill): string {
  const defaultPrompt = getSkillDefaultPrompt(skill);
  const mention = formatSkillMention(skill);

  if (!defaultPrompt) return ensureTrailingSpace(mention);

  const lowerPrompt = defaultPrompt.toLowerCase();
  const lowerMention = `[$${skill.name.toLowerCase()}](`;

  if (lowerPrompt.includes(lowerMention)) {
    return ensureTrailingSpace(defaultPrompt);
  }

  const bareMention = `$${skill.name.toLowerCase()}`;
  if (!skill.path && lowerPrompt.includes(bareMention)) {
    return ensureTrailingSpace(defaultPrompt);
  }

  return ensureTrailingSpace(`${defaultPrompt} ${mention}`);
}

export { formatSkillMention };
