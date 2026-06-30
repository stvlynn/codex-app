#!/usr/bin/env python3
"""Split onboarding-plugin-suggestions data.ts into files under 1000 lines each."""

import os

BASE_DIR = "/Users/stvlynn/code/codex-reverse/.deobfuscate-javascript/_full/files/onboarding-plugin-suggestions-DbMYi-zc/candidate"

def read_lines(path):
    with open(path, "r") as f:
        return f.readlines()

def write_file(path, lines):
    with open(path, "w") as f:
        f.writelines(lines)
    print(f"Wrote {len(lines)} lines to {path}")

def main():
    data_path = os.path.join(BASE_DIR, "data.ts")
    lines = read_lines(data_path)
    total = len(lines)
    print(f"Total lines in data.ts: {total}")

    # Header comment for all files
    header = "// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js\n"

    # File 1: welcome-v2-data.ts - lines 1-557 (imports + welcomeV2 data + connectAppsRowMessage)
    # Need to add export for connectAppsRowMessage since it's used elsewhere
    file1_lines = [header]
    file1_lines.append("// Welcome V2 onboarding suggestion data by role.\n")
    file1_lines.append('\nimport { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";\n')
    file1_lines.append('\n')
    # Lines 5-557 from original (0-indexed: 4-556)
    file1_lines.extend(lines[4:557])  # connectAppsRowMessage + welcomeV2SuggestionsByRole
    file1_lines.append('\nexport { connectAppsRowMessage };\n')
    write_file(os.path.join(BASE_DIR, "welcome-v2-data.ts"), file1_lines)

    # File 2: helpers.ts - lines 558-667 (helper functions)
    file2_lines = [header]
    file2_lines.append("// Helper functions for onboarding plugin suggestions.\n")
    file2_lines.append('\nimport type { UserRole } from "./types";\n')
    file2_lines.append('import { welcomeV2SuggestionsByRole } from "./welcome-v2-data";\n')
    file2_lines.append('\n')
    # Lines 558-667 from original (0-indexed: 557-666)
    # Add type annotations to functions
    file2_lines.append('export function normalizeRole(suggestionsParam: string | UserRole): UserRole {\n')
    file2_lines.extend(lines[559:564])  # body of normalizeRole (skip first line which is function signature)
    file2_lines.append('}\n\n')
    file2_lines.append('export function getUniqueRoles(rolesParam: UserRole[]): UserRole[] {\n')
    file2_lines.extend(lines[566:577])  # body
    file2_lines.append('}\n\n')
    file2_lines.append('export function getOnboardingSuggestionSummary({\n  roles,\n}: {\n  roles: UserRole[];\n}) {\n')
    file2_lines.extend(lines[579:587])  # body
    file2_lines.append('}\n\n')
    file2_lines.append('export function getSuggestionPrompts({\n  roles,\n  promptsByRole,\n  limit,\n}: {\n  roles: UserRole[];\n  promptsByRole: Record<string, unknown[]>;\n  limit?: number;\n}) {\n')
    file2_lines.extend(lines[589:667])  # body
    file2_lines.append('}\n')
    write_file(os.path.join(BASE_DIR, "helpers.ts"), file2_lines)

    # File 3: plugin-suggestions-data.ts - lines 668-2338 (all plugin suggestion arrays + allRoleSuggestions map)
    # This is still ~1670 lines, need to split further

    # File 3a: plugin-suggestions-eng-prod.ts - engineering + productManagement (lines 668-938)
    file3a_lines = [header]
    file3a_lines.append("// Plugin suggestion data for engineering and product management roles.\n")
    file3a_lines.append('\nimport { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";\n')
    file3a_lines.append('\n')
    # Lines 668-807: shared titles + engineering (0-indexed: 667-806)
    file3a_lines.extend(lines[667:807])
    file3a_lines.append('\n')
    # Lines 808-938: productManagement (0-indexed: 807-937)
    file3a_lines.extend(lines[807:938])
    file3a_lines.append('\nexport {\n  connectMessagesTitle,\n  connectMessagesTitleV2,\n  connectEmailTitle,\n  connectFilesTitle,\n  connectCalendarTitle,\n  engineeringPluginSuggestions,\n  productManagementPluginSuggestions,\n};\n')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-eng-prod.ts"), file3a_lines)

    # File 3b: plugin-suggestions-finance-sales.ts - finance + dataScience + sales (lines 939-1361)
    file3b_lines = [header]
    file3b_lines.append("// Plugin suggestion data for finance, data science, and sales roles.\n")
    file3b_lines.append('\nimport { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";\n')
    file3b_lines.append('import {\n  connectMessagesTitle,\n  connectMessagesTitleV2,\n  connectEmailTitle,\n  connectFilesTitle,\n  connectCalendarTitle,\n} from "./plugin-suggestions-eng-prod";\n')
    file3b_lines.append('\n')
    # Lines 939-1085: finance (0-indexed: 938-1084)
    file3b_lines.extend(lines[938:1085])
    file3b_lines.append('\n')
    # Lines 1086-1217: dataScience (0-indexed: 1085-1216) - NOTE: this is mislabeled in original as marketing
    file3b_lines.extend(lines[1085:1217])
    file3b_lines.append('\n')
    # Lines 1218-1361: sales (0-indexed: 1217-1360)
    file3b_lines.extend(lines[1217:1361])
    file3b_lines.append('\nexport {\n  financePluginSuggestions,\n  dataSciencePluginSuggestions,\n  salesPluginSuggestions,\n};\n')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-finance-sales.ts"), file3b_lines)

    # File 3c: plugin-suggestions-design-ops.ts - design + operations + marketing + people_hr (lines 1362-1651)
    file3c_lines = [header]
    file3c_lines.append("// Plugin suggestion data for design, operations, marketing, and people/HR roles.\n")
    file3c_lines.append('\nimport { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";\n')
    file3c_lines.append('import {\n  connectMessagesTitle,\n  connectMessagesTitleV2,\n  connectEmailTitle,\n  connectFilesTitle,\n  connectCalendarTitle,\n} from "./plugin-suggestions-eng-prod";\n')
    file3c_lines.append('\n')
    # Lines 1362-1506: design (mislabeled as operations in original) (0-indexed: 1361-1505)
    file3c_lines.extend(lines[1361:1506])
    file3c_lines.append('\n')
    # Lines 1507-1651: operations (mislabeled as peopleHr in original) (0-indexed: 1506-1650)
    file3c_lines.extend(lines[1506:1651])
    file3c_lines.append('\nexport {\n  designPluginSuggestions,\n  operationsPluginSuggestions,\n};\n')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-design-ops.ts"), file3c_lines)

    # File 3d: plugin-suggestions-legal-student.ts - legal + hr + student + somethingElse + allRoleSuggestions (lines 1652-2338)
    file3d_lines = [header]
    file3d_lines.append("// Plugin suggestion data for legal, HR, student, and fallback roles.\n")
    file3d_lines.append('\nimport { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";\n')
    file3d_lines.append('import {\n  connectMessagesTitle,\n  connectMessagesTitleV2,\n  connectEmailTitle,\n  connectFilesTitle,\n  connectCalendarTitle,\n} from "./plugin-suggestions-eng-prod";\n')
    file3d_lines.append('\n')
    # Lines 1652-1796: legal (mislabeled as legal in original) (0-indexed: 1651-1795)
    file3d_lines.extend(lines[1651:1796])
    file3d_lines.append('\n')
    # Lines 1797-1927: hr (mislabeled as dataScience in original) (0-indexed: 1796-1926)
    file3d_lines.extend(lines[1796:1927])
    file3d_lines.append('\n')
    # Lines 1928-2054: student (mislabeled as design in original) (0-indexed: 1927-2053)
    file3d_lines.extend(lines[1927:2054])
    file3d_lines.append('\n')
    # Lines 2055-2338: somethingElse + allRoleSuggestions (0-indexed: 2054-2337)
    file3d_lines.extend(lines[2054:2338])
    file3d_lines.append('\nexport {\n  legalPluginSuggestions,\n  hrPluginSuggestions,\n  studentPluginSuggestions,\n  somethingElsePluginSuggestions,\n};\n')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-legal-student.ts"), file3d_lines)

    # File 4: main.ts - lines 2339-2384 (exported function + re-exports)
    file4_lines = [header]
    file4_lines.append("// Main entry point for onboarding plugin suggestions.\n")
    file4_lines.append('\nimport type { IntlShape, OnboardingPluginSuggestion, UserRole } from "./types";\n')
    file4_lines.append('import { resolveMailProvider } from "../../utils/onboarding-mail-provider";\n')
    file4_lines.append('import { connectAppsRowMessage } from "./welcome-v2-data";\n')
    file4_lines.append('import { getUniqueRoles } from "./helpers";\n')
    file4_lines.append('import { somethingElsePluginSuggestions } from "./plugin-suggestions-legal-student";\n')
    file4_lines.append('\n')
    # Lines 2339-2381: getOnboardingPluginSuggestions function (0-indexed: 2338-2380)
    file4_lines.append('export function getOnboardingPluginSuggestions({\n')
    file4_lines.append('  intl,\n')
    file4_lines.append('  mailProvider,\n')
    file4_lines.append('  plan,\n')
    file4_lines.append('  plugins,\n')
    file4_lines.append('  roles,\n')
    file4_lines.append('}: {\n')
    file4_lines.append('  intl: IntlShape;\n')
    file4_lines.append('  mailProvider: string;\n')
    file4_lines.append('  plan: number | null;\n')
    file4_lines.append('  plugins: Array<{ name: string }>;\n')
    file4_lines.append('  roles: UserRole[];\n')
    file4_lines.append('}): OnboardingPluginSuggestion[] {\n')
    file4_lines.extend(lines[2346:2381])  # body
    file4_lines.append('}\n')
    file4_lines.append('\nexport { connectAppsRowMessage, resolveMailProvider };\n')
    write_file(os.path.join(BASE_DIR, "main.ts"), file4_lines)

    # Remove old data.ts
    os.remove(data_path)
    print(f"Removed old {data_path}")

    print("\nDone! Split complete.")

if __name__ == "__main__":
    main()
