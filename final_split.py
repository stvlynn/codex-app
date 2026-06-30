#!/usr/bin/env python3
"""
Final approach: Parse var chains with nesting tracking, apply module-level renames,
add type annotations, then split into files under 1000 lines.
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

def parse_var_chains(text):
    """Find all var chains and convert them to const declarations."""
    lines = text.split('\n')
    result = []
    i = 0

    while i < len(lines):
        line = lines[i]

        var_match = re.match(r'^(\s*)var\s+(\w+)\s*=\s*(.*)$', line)
        if not var_match:
            result.append(line)
            i += 1
            continue

        indent = var_match.group(1)
        name = var_match.group(2)
        value_start = var_match.group(3)

        value_lines = [value_start]
        i += 1

        nesting = 0
        for c in value_start:
            if c in '({[':
                nesting += 1
            elif c in ')}]':
                nesting -= 1

        in_string = False
        string_char = None
        escape_next = False

        while i < len(lines):
            next_line = lines[i]

            if not in_string and nesting == 0:
                cont_match = re.match(r'^(\s{2,})(\w+)\s*=\s*(.*)$', next_line)
                if cont_match:
                    prev_val = '\n'.join(value_lines).rstrip()
                    if prev_val.endswith(','):
                        prev_val = prev_val[:-1]
                        result.append(f'{indent}const {name} = {prev_val};')
                        name = cont_match.group(2)
                        value_lines = [cont_match.group(3)]
                        nesting = 0
                        for c in cont_match.group(3):
                            if c in '({[':
                                nesting += 1
                            elif c in ')}]':
                                nesting -= 1
                        i += 1
                        continue

            value_lines.append(next_line)
            i += 1

            for c in next_line:
                if escape_next:
                    escape_next = False
                    continue
                if in_string:
                    if c == '\\':
                        escape_next = True
                    elif c == string_char:
                        in_string = False
                        string_char = None
                else:
                    if c in '"\'':
                        in_string = True
                        string_char = c
                    elif c in '({[':
                        nesting += 1
                    elif c in ')}]':
                        nesting -= 1

            if not in_string and nesting == 0:
                full_val = '\n'.join(value_lines).rstrip()
                if full_val.endswith(';'):
                    last_nonempty = [l for l in value_lines if l.strip()][-1]
                    if re.match(r'^(\s*)[}\]];\s*$', last_nonempty):
                        if full_val.endswith(','):
                            full_val = full_val[:-1]
                        elif full_val.endswith(';'):
                            full_val = full_val[:-1]
                        result.append(f'{indent}const {name} = {full_val};')
                        break
        else:
            prev_val = '\n'.join(value_lines).rstrip()
            if prev_val.endswith(','):
                prev_val = prev_val[:-1]
            elif prev_val.endswith(';'):
                prev_val = prev_val[:-1]
            result.append(f'{indent}const {name} = {prev_val};')

    return '\n'.join(result)

def main():
    src = read_file("/Users/stvlynn/code/codex-reverse/.deobfuscate-javascript/_full/files/onboarding-plugin-suggestions-DbMYi-zc/auto-polished.tsx")

    # Step 1: Fix imports
    src = src.replace('import { libR } from "./lib-BWT6A3Q0";',
                        'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";')
    src = src.replace('import { onboardingMailProviderR } from "./onboarding-mail-provider-DwX9H-oo";',
                        'import { resolveMailProvider } from "../../utils/onboarding-mail-provider";')
    src = src.replace('libR(', 'defineMessage(')
    src = src.replace('onboardingMailProviderR(', 'resolveMailProvider(')

    # Step 2: Convert var chains to const
    src = parse_var_chains(src)

    # Step 3: Apply module-level renames (only for top-level declarations)
    # We do this by matching declaration patterns at the start of lines
    decl_renames = {
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
        'onboardingPluginSuggestionsHelper1': 'normalizeRole',
        'onboardingPluginSuggestionsHelper2': 'getUniqueRoles',
        'onboardingPluginSuggestionsHelper3': 'getSuggestionPrompts',
        'onboardingPluginSuggestionsT': 'getOnboardingPluginSuggestions',
    }

    # Apply renames to the entire text (they're unique enough that scope doesn't matter)
    for old, new in decl_renames.items():
        src = src.replace(old, new)

    # Step 4: Fix function parameter types
    src = src.replace(
        'export function getOnboardingSuggestionSummary({\n  roles,\n}) {',
        'export function getOnboardingSuggestionSummary({\n  roles,\n}: {\n  roles: string[];\n}) {'
    )
    src = src.replace(
        'function normalizeRole(onboardingPluginSuggestionsParam2) {',
        'function normalizeRole(onboardingPluginSuggestionsParam2: string) {'
    )
    src = src.replace(
        'function getUniqueRoles(onboardingPluginSuggestionsParam1) {',
        'function getUniqueRoles(onboardingPluginSuggestionsParam1: string[]) {'
    )
    src = src.replace(
        'function getSuggestionPrompts({\n  roles,\n  promptsByRole,\n  limit,\n}) {',
        'function getSuggestionPrompts({\n  roles,\n  promptsByRole,\n  limit,\n}: {\n  roles: string[];\n  promptsByRole: Record<string, unknown[]>;\n  limit?: number;\n}) {'
    )
    src = src.replace(
        'export function getOnboardingPluginSuggestions({\n  intl,\n  mailProvider,\n  plan,\n  plugins,\n  roles,\n}) {',
        'export function getOnboardingPluginSuggestions({\n  intl,\n  mailProvider,\n  plan,\n  plugins,\n  roles,\n}: {\n  intl: { formatMessage: (descriptor: { id: string; defaultMessage: string; description?: string }) => string };\n  mailProvider: string;\n  plan: number | null;\n  plugins: Array<{ name: string }>;\n  roles: string[];\n}) {'
    )

    # Step 5: Fix the default parameter syntax
    # In getSuggestionPrompts: limit: _connectAppsRowMessage = 3 -> limit: plan = 3
    # But we renamed onboardingPluginSuggestionsN to connectAppsRowMessage, so
    # the parameter default _onboardingPluginSuggestionsN became _connectAppsRowMessage
    # We need to change it to a generic name
    src = src.replace('limit: _connectAppsRowMessage = 3,', 'limit: plan = 3,')
    src = src.replace('plan: _connectAppsRowMessage = null,', 'plan = null,')

    # Now split into files
    all_lines = src.split('\n')

    # Find boundaries by looking for const/function declarations at module level
    boundaries = {}
    for i, line in enumerate(all_lines):
        stripped = line.strip()
        if stripped.startswith('const '):
            name_match = re.match(r'^\s*const\s+(\w+)\s*=', line)
            if name_match:
                boundaries[name_match.group(1)] = i
        elif stripped.startswith('function ') or stripped.startswith('export function '):
            name_match = re.match(r'^(?:\s*export\s+)?function\s+(\w+)', stripped)
            if name_match:
                boundaries[name_match.group(1)] = i

    print("Boundaries found:")
    for name, line in sorted(boundaries.items(), key=lambda x: x[1]):
        print(f"  {name}: line {line}")

    # File 1: welcome-v2-data.ts (header + imports + connectAppsRowMessage + welcomeV2SuggestionsByRole)
    file1_end = boundaries.get('connectMessagesTitle', len(all_lines))
    file1_lines = all_lines[:file1_end]
    file1_lines.append('')
    file1_lines.append('export { connectAppsRowMessage };')
    write_file(os.path.join(BASE_DIR, "welcome-v2-data.ts"), '\n'.join(file1_lines))

    # File 2: helpers.ts (normalizeRole, getUniqueRoles, getOnboardingSuggestionSummary, getSuggestionPrompts)
    file2_start = boundaries.get('normalizeRole', file1_end)
    file2_end = boundaries.get('connectMessagesTitle', len(all_lines))
    file2_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
                   '// Helper functions for onboarding plugin suggestions.',
                   '',
                   'import { welcomeV2SuggestionsByRole } from "./welcome-v2-data";',
                   '']
    file2_lines.extend(all_lines[file2_start:file2_end])
    write_file(os.path.join(BASE_DIR, "helpers.ts"), '\n'.join(file2_lines))

    # File 3: plugin-suggestions-eng-prod.ts (shared titles + eng + productManagement)
    file3_start = file2_end
    file3_end = boundaries.get('financePluginSuggestions', len(all_lines))
    file3_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
                   '// Plugin suggestion data for engineering and product management roles.',
                   '',
                   'import { r as defineMessage } from "../../boundaries/lib-b-w-t6-a3-q0";',
                   '']
    file3_lines.extend(all_lines[file3_start:file3_end])
    file3_lines.append('')
    file3_lines.append('export {')
    file3_lines.append('  connectMessagesTitle,')
    file3_lines.append('  connectMessagesTitleV2,')
    file3_lines.append('  connectEmailTitle,')
    file3_lines.append('  connectFilesTitle,')
    file3_lines.append('  connectCalendarTitle,')
    file3_lines.append('  engineeringPluginSuggestions,')
    file3_lines.append('  productManagementPluginSuggestions,')
    file3_lines.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-eng-prod.ts"), '\n'.join(file3_lines))

    # File 4: plugin-suggestions-finance-sales.ts (finance + dataScience + sales)
    file4_start = file3_end
    file4_end = boundaries.get('designPluginSuggestions', len(all_lines))
    file4_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
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
    file4_lines.extend(all_lines[file4_start:file4_end])
    file4_lines.append('')
    file4_lines.append('export {')
    file4_lines.append('  financePluginSuggestions,')
    file4_lines.append('  dataSciencePluginSuggestions,')
    file4_lines.append('  salesPluginSuggestions,')
    file4_lines.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-finance-sales.ts"), '\n'.join(file4_lines))

    # File 5: plugin-suggestions-design-ops.ts (design + operations + marketing + peopleHr)
    file5_start = file4_end
    file5_end = boundaries.get('legalPluginSuggestions', len(all_lines))
    file5_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
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
    file5_lines.extend(all_lines[file5_start:file5_end])
    file5_lines.append('')
    file5_lines.append('export {')
    file5_lines.append('  designPluginSuggestions,')
    file5_lines.append('  operationsPluginSuggestions,')
    file5_lines.append('  marketingPluginSuggestions,')
    file5_lines.append('  peopleHrPluginSuggestions,')
    file5_lines.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-design-ops.ts"), '\n'.join(file5_lines))

    # File 6: plugin-suggestions-legal-student.ts (legal + hr + student + somethingElse)
    file6_start = file5_end
    file6_end = boundaries.get('getOnboardingPluginSuggestions', len(all_lines))
    file6_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
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
    file6_lines.extend(all_lines[file6_start:file6_end])
    file6_lines.append('')
    file6_lines.append('export {')
    file6_lines.append('  legalPluginSuggestions,')
    file6_lines.append('  hrPluginSuggestions,')
    file6_lines.append('  studentPluginSuggestions,')
    file6_lines.append('  somethingElsePluginSuggestions,')
    file6_lines.append('};')
    write_file(os.path.join(BASE_DIR, "plugin-suggestions-legal-student.ts"), '\n'.join(file6_lines))

    # File 7: main.ts (getOnboardingPluginSuggestions + exports)
    file7_start = file6_end
    file7_lines = ['// Restored from ref/webview/assets/onboarding-plugin-suggestions-DbMYi-zc.js',
                   '// Main entry point for onboarding plugin suggestions.',
                   '',
                   'import type { IntlShape, OnboardingPluginSuggestion, UserRole } from "./types";',
                   'import { resolveMailProvider } from "../../utils/onboarding-mail-provider";',
                   'import { connectAppsRowMessage } from "./welcome-v2-data";',
                   'import { getUniqueRoles } from "./helpers";',
                   'import { somethingElsePluginSuggestions } from "./plugin-suggestions-legal-student";',
                   '']
    file7_lines.extend(all_lines[file7_start:])
    file7_lines.append('')
    file7_lines.append('export { connectAppsRowMessage, resolveMailProvider };')
    write_file(os.path.join(BASE_DIR, "main.ts"), '\n'.join(file7_lines))

    print("\nDone! All files written successfully.")

if __name__ == "__main__":
    main()
