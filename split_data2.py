#!/usr/bin/env python3
"""
Transform onboarding-plugin-suggestions auto-polished.tsx into proper TypeScript
with semantic names, then split into files under 1000 lines each.
"""

import re
import os

BASE_DIR = "/Users/stvlynn/code/codex-reverse/.deobfuscate-javascript/_full/files/onboarding-plugin-suggestions-DbMYi-zc/candidate"

def read_file(path):
    with open(path, "r") as f:
        return f.read()

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)
    line_count = content.count('\n') + (1 if content and not content.endswith('\n') else 0)
    print(f"Wrote {line_count} lines to {os.path.basename(path)}")

def main():
    src = read_file("/Users/stvlynn/code/codex-reverse/.deobfuscate-javascript/_full/files/onboarding-plugin-suggestions-DbMYi-zc/auto-polished.tsx")

    # Step 1: Fix imports
    src = src.replace('import { libR } from "./lib-BWT6A3Q0";',
                        'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";')
    src = src.replace('import { onboardingMailProviderR } from "./onboarding-mail-provider-DwX9H-oo";',
                        'import { resolveMailProvider } from "../../utils/onboarding-mail-provider";')

    # Step 2: Replace all libR calls with defineMessage
    src = src.replace('libR(', 'defineMessage(')

    # Step 3: Replace onboardingMailProviderR with resolveMailProvider
    src = src.replace('onboardingMailProviderR(', 'resolveMailProvider(')

    # Step 4: Split chained var declarations into separate const declarations
    # Pattern: var name1 = expr1,
    #   name2 = expr2,
    #   nameN = exprN;
    # We need to find these and convert each to const

    # First, handle the simple case: var name = value, name2 = value2;
    # This is complex with regex, so let's do it line by line

    lines = src.split('\n')
    new_lines = []
    in_chained_var = False
    var_indent = ""
    declarations = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # Check if this starts a chained var declaration
        var_match = re.match(r'^(\s*)var\s+(\w+)\s*=\s*(.+)$', line)
        if var_match and not in_chained_var:
            # Check if next non-empty line starts with indent + name =
            # or if this line ends with comma (indicating chain)
            if line.rstrip().endswith(','):
                in_chained_var = True
                var_indent = var_match.group(1)
                decl_name = var_match.group(2)
                decl_value = var_match.group(3)
                # Remove trailing comma
                decl_value = decl_value.rstrip()[:-1] if decl_value.rstrip().endswith(',') else decl_value
                declarations.append((decl_name, decl_value))
                i += 1
                continue

        if in_chained_var:
            # Check if this is a continuation:   name = value,
            cont_match = re.match(r'^(\s+)(\w+)\s*=\s*(.+)$', line)
            if cont_match:
                decl_name = cont_match.group(2)
                decl_value = cont_match.group(3)
                # Remove trailing comma
                if decl_value.rstrip().endswith(','):
                    decl_value = decl_value.rstrip()[:-1]
                declarations.append((decl_name, decl_value))
                i += 1
                continue
            else:
                # This line doesn't match, so the chain ended
                # Check if it's a closing bracket that belongs to the last declaration
                # or if it's the end of the var block
                # Actually, let's check if the last declaration ended with a semicolon
                if declarations:
                    last_name, last_value = declarations[-1]
                    if last_value.rstrip().endswith(';'):
                        # Remove semicolon from value
                        declarations[-1] = (last_name, last_value.rstrip()[:-1])
                        # Output all declarations
                        for name, value in declarations:
                            new_lines.append(f'{var_indent}const {name} = {value};')
                        in_chained_var = False
                        declarations = []
                        # Don't increment i, process this line again
                        continue
                    else:
                        # The chain might continue - this line might be part of the value
                        # Append to last declaration
                        last_name, last_value = declarations[-1]
                        declarations[-1] = (last_name, last_value + '\n' + line)
                        i += 1
                        continue

        # Check for end of file with unclosed chain
        if in_chained_var and i == len(lines) - 1:
            if declarations:
                last_name, last_value = declarations[-1]
                if last_value.rstrip().endswith(';'):
                    declarations[-1] = (last_name, last_value.rstrip()[:-1])
                for name, value in declarations:
                    new_lines.append(f'{var_indent}const {name} = {value};')
                in_chained_var = False
                declarations = []

        new_lines.append(line)
        i += 1

    src = '\n'.join(new_lines)

    # Step 5: Rename variables to semantic names
    renames = {
        'onboardingPluginSuggestionsN': 'connectAppsRowMessage',
        'onboardingPluginSuggestionsValue2': 'welcomeV2SuggestionsByRole',
        'onboardingPluginSuggestionsValue3': 'connectMessagesTitle',
        'onboardingPluginSuggestionsValue4': 'connectMessagesTitleV2',
        'onboardingPluginSuggestionsValue5': 'connectEmailTitle',
        'onboardingPluginSuggestionsValue6': 'connectFilesTitle',
        'onboardingPluginSuggestionsValue7': 'connectCalendarTitle',
        'onboardingPluginSuggestionsValue8': 'engineeringPluginSuggestions',
        'onboardingPluginSuggestionsValue9': 'productManagementPluginSuggestions',
        'onboardingPluginSuggestionsValue10': 'financePluginSuggestions',
        'onboardingPluginSuggestionsValue11': 'dataSciencePluginSuggestions',
        'onboardingPluginSuggestionsValue12': 'salesPluginSuggestions',
        'onboardingPluginSuggestionsValue13': 'designPluginSuggestions',
        'onboardingPluginSuggestionsValue14': 'operationsPluginSuggestions',
        'onboardingPluginSuggestionsValue15': 'marketingPluginSuggestions',
        'onboardingPluginSuggestionsValue16': 'peopleHrPluginSuggestions',
        'onboardingPluginSuggestionsValue17': 'legalPluginSuggestions',
        'onboardingPluginSuggestionsValue18': 'hrPluginSuggestions',
        'onboardingPluginSuggestionsValue19': 'studentPluginSuggestions',
        'onboardingPluginSuggestionsValue20': 'somethingElsePluginSuggestions',
        'onboardingPluginSuggestionsR': 'getOnboardingSuggestionSummary',
        'onboardingPluginSuggestionsParam': 'suggestionsParam',
        'onboardingPluginSuggestionsValue': 'normalizedRoles',
        'onboardingPluginSuggestionsValue21': 'rolesParam',
        'onboardingPluginSuggestionsValue22': 'uniqueRolesSet',
        'onboardingPluginSuggestionsValue23': 'somethingElseStudentSuggestions',
        'onboardingPluginSuggestionsValue24': 'allRoles',
        'onboardingPluginSuggestionsValue25': 'resolvedProvider',
        'onboardingPluginSuggestionsValue26': 'uniqueRoles',
        'onboardingPluginSuggestionsValue27': 'firstRoleNormalized',
        'onboardingPluginSuggestionsValue28': 'secondRoleNormalized',
        'onboardingPluginSuggestionsValue29': 'defaultRoles',
        'onboardingPluginSuggestionsValue30': 'firstRole',
        'onboardingPluginSuggestionsValue31': 'secondRole',
        'onboardingPluginSuggestionsValue32': 'roleIndex',
        'onboardingPluginSuggestionsValue33': 'primaryRole',
        'onboardingPluginSuggestionsValue34': 'matchedPlugin',
        'onboardingPluginSuggestionsValue35': '_item',
        'onboardingPluginSuggestionsValue36': 'item',
        'onboardingPluginSuggestionsValue37': 'plan',
        'onboardingPluginSuggestionsValue38': 'plugins',
        'onboardingPluginSuggestionsValue39': 'roles',
        'onboardingPluginSuggestionsValue40': 'intl',
        'onboardingPluginSuggestionsValue41': 'mailProvider',
    }

    for old, new in renames.items():
        src = src.replace(old, new)

    # Step 6: Fix parameter types in exported functions
    # getOnboardingSuggestionSummary({ roles }) -> add types
    src = src.replace(
        'export function getOnboardingSuggestionSummary({\n  roles,\n}) {',
        'export function getOnboardingSuggestionSummary({\n  roles,\n}: {\n  roles: string[];\n}) {'
    )

    # getOnboardingPluginSuggestions({ intl, mailProvider, plan, plugins, roles }) -> add types
    src = src.replace(
        'export function getOnboardingPluginSuggestions({\n  intl,\n  mailProvider,\n  plan,\n  plugins,\n  roles,\n}) {',
        'export function getOnboardingPluginSuggestions({\n  intl,\n  mailProvider,\n  plan,\n  plugins,\n  roles,\n}: {\n  intl: { formatMessage: (descriptor: { id: string; defaultMessage: string; description?: string }) => string };\n  mailProvider: string;\n  plan: number | null;\n  plugins: Array<{ name: string }>;\n  roles: string[];\n}) {'
    )

    # Step 7: Fix normalizeRole and getUniqueRoles parameter types
    src = src.replace(
        'function normalizeRole(suggestionsParam) {',
        'function normalizeRole(suggestionsParam: string) {'
    )
    src = src.replace(
        'function getUniqueRoles(rolesParam) {',
        'function getUniqueRoles(rolesParam: string[]) {'
    )
    src = src.replace(
        'function getSuggestionPrompts({\n  roles,\n  promptsByRole,\n  limit,\n}) {',
        'function getSuggestionPrompts({\n  roles,\n  promptsByRole,\n  limit,\n}: {\n  roles: string[];\n  promptsByRole: Record<string, unknown[]>;\n  limit?: number;\n}) {'
    )

    # Step 8: Fix the default parameter syntax
    src = src.replace('limit: plan = 3,', 'limit: plan = 3,')
    src = src.replace('plan: plan = null,', 'plan = null,')

    # Now split into files
    all_lines = src.split('\n')

    # Find key boundaries
    # Line 1-4: imports
    # Line 5-557: connectAppsRowMessage + welcomeV2SuggestionsByRole
    # Line 558-667: helper functions
    # Line 668-807: shared titles + engineeringPluginSuggestions
    # Line 808-938: productManagementPluginSuggestions
    # Line 939-1085: financePluginSuggestions
    # Line 1086-1217: dataSciencePluginSuggestions
    # Line 1218-1361: salesPluginSuggestions
    # Line 1362-1506: designPluginSuggestions
    # Line 1507-1651: operationsPluginSuggestions
    # Line 1652-1796: marketingPluginSuggestions
    # Line 1797-1927: peopleHrPluginSuggestions
    # Line 1928-2054: legalPluginSuggestions
    # Line 2055-2178: hrPluginSuggestions
    # Line 2179-2338: studentPluginSuggestions + somethingElsePluginSuggestions + allRoleSuggestions
    # Line 2339-2382: getOnboardingPluginSuggestions + exports

    # File 1: welcome-v2-data.ts (lines 1-557, but with proper const declarations)
    # Actually since we already converted var to const, the lines are the same
    # But we need to make sure connectAppsRowMessage is exported

    # Let's just use the line numbers from the original structure
    # The auto-polished has same structure as data.ts we created earlier

    # File 1: welcome-v2-data.ts
    file1 = all_lines[:557]  # includes header + imports + connectAppsRowMessage + welcomeV2
    # Add export at end
    file1.append('')
    file1.append('export { connectAppsRowMessage };')
    write_file(os.path.join(BASE_DIR, "welcome-v2-data.ts"), '\n'.join(file1))

    # File 2: helpers.ts
    file2 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Helper functions for onboarding plugin suggestions.',
             '',
             'import { welcomeV2SuggestionsByRole } from "./welcome-v2-data";',
             '']
    # Add type imports
    file2.append('import type { UserRole } from "./types";')
    file2.append('')

    # Lines 558-667 from original (helper functions)
    # We need to add type annotations
    # normalizeRole
    file2.append('function normalizeRole(suggestionsParam: string | UserRole): UserRole {')
    file2.extend(all_lines[559:564])  # body
    file2.append('}')
    file2.append('')
    # getUniqueRoles
    file2.append('function getUniqueRoles(rolesParam: UserRole[]): UserRole[] {')
    file2.extend(all_lines[566:577])  # body
    file2.append('}')
    file2.append('')
    # getOnboardingSuggestionSummary
    file2.append('export function getOnboardingSuggestionSummary({')
    file2.append('  roles,')
    file2.append('}: {')
    file2.append('  roles: UserRole[];')
    file2.append('}) {')
    file2.extend(all_lines[579:587])  # body
    file2.append('}')
    file2.append('')
    # getSuggestionPrompts
    file2.append('export function getSuggestionPrompts({')
    file2.append('  roles,')
    file2.append('  promptsByRole,')
    file2.append('  limit,')
    file2.append('}: {')
    file2.append('  roles: UserRole[];')
    file2.append('  promptsByRole: Record<string, unknown[]>;')
    file2.append('  limit?: number;')
    file2.append('}) {')
    file2.extend(all_lines[589:667])  # body
    file2.append('}')
    write_file(os.path.join(BASE_DIR, "helpers.ts"), '\n'.join(file2))

    # File 3: plugin-suggestions-eng-prod.ts (shared titles + eng + prod)
    file3 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Plugin suggestion data for engineering and product management roles.',
             '',
             'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";',
             '']
    # Lines 668-938: shared titles + eng + prod
    file3.extend(all_lines[667:938])
    file3.append('')
    file3.append('export {')
    file3.append('  connectMessagesTitle,')
    file3.append('  connectMessagesTitleV2,')
    file3.append('  connectEmailTitle,')
    file3.append('  connectFilesTitle,')
    file3.append('  connectCalendarTitle,')
    file3.append('  engineeringPluginSuggestions,')
    file3.append('  productManagementPluginSuggestions,')
    file3.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-eng-prod.ts"), '\n'.join(file3))

    # File 4: plugin-suggestions-finance-sales.ts (finance + dataScience + sales)
    file4 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Plugin suggestion data for finance, data science, and sales roles.',
             '',
             'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";',
             'import {',
             '  connectMessagesTitle,',
             '  connectMessagesTitleV2,',
             '  connectEmailTitle,',
             '  connectFilesTitle,',
             '  connectCalendarTitle,',
             '} from "./plugin-suggestions-eng-prod";',
             '']
    # Lines 939-1361: finance + dataScience + sales
    file4.extend(all_lines[938:1361])
    file4.append('')
    file4.append('export {')
    file4.append('  financePluginSuggestions,')
    file4.append('  dataSciencePluginSuggestions,')
    file4.append('  salesPluginSuggestions,')
    file4.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-finance-sales.ts"), '\n'.join(file4))

    # File 5: plugin-suggestions-design-ops.ts (design + operations + marketing + peopleHr)
    file5 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Plugin suggestion data for design, operations, marketing, and people/HR roles.',
             '',
             'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";',
             'import {',
             '  connectMessagesTitle,',
             '  connectMessagesTitleV2,',
             '  connectEmailTitle,',
             '  connectFilesTitle,',
             '  connectCalendarTitle,',
             '} from "./plugin-suggestions-eng-prod";',
             '']
    # Lines 1362-1927: design + operations + marketing + peopleHr
    file5.extend(all_lines[1361:1927])
    file5.append('')
    file5.append('export {')
    file5.append('  designPluginSuggestions,')
    file5.append('  operationsPluginSuggestions,')
    file5.append('  marketingPluginSuggestions,')
    file5.append('  peopleHrPluginSuggestions,')
    file5.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-design-ops.ts"), '\n'.join(file5))

    # File 6: plugin-suggestions-legal-student.ts (legal + hr + student + somethingElse)
    file6 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Plugin suggestion data for legal, HR, student, and fallback roles.',
             '',
             'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";',
             'import {',
             '  connectMessagesTitle,',
             '  connectMessagesTitleV2,',
             '  connectEmailTitle,',
             '  connectFilesTitle,',
             '  connectCalendarTitle,',
             '} from "./plugin-suggestions-eng-prod";',
             '']
    # Lines 1928-2338: legal + hr + student + somethingElse
    file6.extend(all_lines[1927:2338])
    file6.append('')
    file6.append('export {')
    file6.append('  legalPluginSuggestions,')
    file6.append('  hrPluginSuggestions,')
    file6.append('  studentPluginSuggestions,')
    file6.append('  somethingElsePluginSuggestions,')
    file6.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-legal-student.ts"), '\n'.join(file6))

    # File 7: main.ts (exported function + re-exports)
    file7 = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
             '// Main entry point for onboarding plugin suggestions.',
             '',
             'import type { IntlShape, OnboardingPluginSuggestion, UserRole } from "./types";',
             'import { resolveMailProvider } from "../../utils/onboarding-mail-provider";',
             'import { connectAppsRowMessage } from "./welcome-v2-data";',
             'import { getUniqueRoles } from "./helpers";',
             'import { somethingElsePluginSuggestions } from "./plugin-suggestions-legal-student";',
             '']
    # Lines 2339-2381: getOnboardingPluginSuggestions
    file7.append('export function getOnboardingPluginSuggestions({')
    file7.append('  intl,')
    file7.append('  mailProvider,')
    file7.append('  plan,')
    file7.append('  plugins,')
    file7.append('  roles,')
    file7.append('}: {')
    file7.append('  intl: IntlShape;')
    file7.append('  mailProvider: string;')
    file7.append('  plan: number | null;')
    file7.append('  plugins: Array<{ name: string }>;')
    file7.append('  roles: UserRole[];')
    file7.append('}): OnboardingPluginSuggestion[] {')
    file7.extend(all_lines[2346:2381])  # body
    file7.append('}')
    file7.append('')
    file7.append('export { connectAppsRowMessage, resolveMailProvider };')
    write_file(os.path.join(BASE_DIR, "main.ts"), '\n'.join(file7))

    print("\nDone! All files written successfully.")

if __name__ == "__main__":
    main()
