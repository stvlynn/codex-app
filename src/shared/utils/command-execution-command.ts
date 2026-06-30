// Restored from ref/webview/assets/command-execution-command-OqCVdN_Y.js
// CommandExecutionCommand chunk restored from the Codex webview bundle.

export interface CommandAction {
  command: string;
}

export interface CommandExecutionContext {
  command: string;
  commandActions: CommandAction[];
}

const SHELL_COMMAND_PATTERN =
  /^(?:.*[/\\])?(?:bash|cmd(?:\.exe)?|fish|powershell(?:\.exe)?|pwsh(?:\.exe)?|sh|zsh)(?:\s|$)/iu;

/**
 * Extracts the most relevant command from a command execution context.
 * Prefers the last non-empty, non-shell command action; falls back to the
 * top-level command if no action matches.
 */
export function getCommandExecutionCommand(
  context: CommandExecutionContext,
): string {
  for (
    let actionIndex = context.commandActions.length - 1;
    actionIndex >= 0;
    --actionIndex
  ) {
    const actionCommand =
      context.commandActions[actionIndex]?.command.trim() ?? "";
    if (actionCommand.length > 0 && !isShellCommand(actionCommand)) {
      return actionCommand;
    }
  }
  const topLevelCommand = context.command.trim();
  return isShellCommand(topLevelCommand) ? "" : topLevelCommand;
}

function isShellCommand(command: string): boolean {
  return SHELL_COMMAND_PATTERN.test(command);
}
