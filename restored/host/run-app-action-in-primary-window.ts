// Restored from ref/webview/assets/run-app-action-in-primary-window-Dxpy-IOL.js
//
// Helpers for running app actions in the primary window and for the
// "complete_conversational_onboarding_task" tool used during onboarding.

import path from "path";
import {
  Aa as zString,
  Ia as zodToJsonSchema,
  Mr as isAbsolutePath,
  ka as zObject,
  la as zEnum,
  xa as zLiteral,
} from "../boundaries/src-l0hb-m-z-p";
import { I as toPosixPath, n as appActionsBridge } from "../boundaries/rpc";
export const ONBOARDING_TASK_NAME = "complete_conversational_onboarding_task";
const onboardingTaskOutputSchema = zObject({
  outputType: zEnum(["file", "text"]).describe(
    "Whether the result is a local file or a text answer.",
  ),
  output: zString()
    .trim()
    .min(1)
    .describe(
      "The absolute local file path for file results, or the concise answer for text results.",
    ),
}).refine(
  ({ output, outputType }) => outputType === "text" || isAbsolutePath(output),
  {
    message: "File output must be an absolute path.",
    path: ["output"],
  },
);
const onboardingResultWrapperSchema = zObject({
  accepted: zLiteral(true),
  result: onboardingTaskOutputSchema,
});
export interface OnboardingTaskToolDefinition {
  name: string;
  description: string;
  inputSchema: unknown;
}
export const onboardingTaskToolDefinition: OnboardingTaskToolDefinition = {
  name: ONBOARDING_TASK_NAME,
  description:
    "Report the completed conversational onboarding task before the final response. Use file with the absolute path for a created local file, or text with the concise answer for a calendar or messaging task.",
  inputSchema: zodToJsonSchema(onboardingTaskOutputSchema),
};
interface OnboardingTask {
  outputType: "file" | "text";
  approvedRoot: string;
  fileExtension: string;
}
const registeredTasks = new Map<string, OnboardingTask>();
const pendingConversations = new Set<string>();
const completedConversations = new Set<string>();
export interface RegisterOnboardingTaskOptions {
  conversationId: string;
  task: OnboardingTask;
}
export function registerOnboardingTask({
  conversationId,
  task,
}: RegisterOnboardingTaskOptions): void {
  registeredTasks.set(conversationId, task);
}
export function invalidateOnboardingTask(conversationId: string): void {
  registeredTasks.delete(conversationId);
  completedConversations.add(conversationId);
}
export interface CanonicalPathMetadata {
  canonicalPath: string;
  isFile: boolean;
  isDirectory: boolean;
}
export interface ExecuteOnboardingTaskOptions {
  argumentsValue: unknown;
  conversationId: string;
  getCanonicalPathMetadata: (args: {
    path: string;
  }) => Promise<CanonicalPathMetadata>;
}
export interface OnboardingTaskOutput {
  outputType: "file" | "text";
  output: string;
}
export async function executeOnboardingTask({
  argumentsValue,
  conversationId,
  getCanonicalPathMetadata,
}: ExecuteOnboardingTaskOptions): Promise<OnboardingTaskOutput | null> {
  if (completedConversations.has(conversationId)) return null;
  const task = registeredTasks.get(conversationId);
  if (task == null || pendingConversations.has(conversationId)) return null;
  const parseResult = onboardingTaskOutputSchema.safeParse(argumentsValue);
  if (!parseResult.success || parseResult.data.outputType !== task.outputType) {
    return null;
  }
  pendingConversations.add(conversationId);
  try {
    let result: OnboardingTaskOutput = parseResult.data;
    if (task.outputType === "file") {
      const metadataPair = await Promise.all([
        getCanonicalPathMetadata({
          path: parseResult.data.output,
        }),
        getCanonicalPathMetadata({
          path: task.approvedRoot,
        }),
      ]).catch(() => null);
      if (metadataPair == null) return null;
      const [outputMetadata, rootMetadata] = metadataPair;
      const outputPosixPath = toPosixPath(outputMetadata.canonicalPath);
      const rootPosixPath = toPosixPath(rootMetadata.canonicalPath);
      const outputDir = normalizePosixDirectory(
        path.posix.dirname(outputPosixPath),
      );
      const rootDir = normalizePosixDirectory(rootPosixPath);
      if (
        !outputMetadata.isFile ||
        !rootMetadata.isDirectory ||
        outputDir !== rootDir ||
        path.posix.extname(outputPosixPath).toLowerCase() !== task.fileExtension
      ) {
        return null;
      }
      result = {
        outputType: "file",
        output: outputMetadata.canonicalPath,
      };
    }
    if (registeredTasks.get(conversationId) === task) {
      registeredTasks.delete(conversationId);
      completedConversations.add(conversationId);
      return result;
    }
    return null;
  } finally {
    pendingConversations.delete(conversationId);
  }
}
function normalizePosixDirectory(dirPath: string): string {
  const normalized = path.posix.normalize(dirPath);
  return /^[A-Za-z]:$/.test(normalized) ? `${normalized}/` : normalized;
}
export interface AppActionMessage {
  type: string;
  text?: string;
}
export function parseToolOutputFromMessages(
  messages: AppActionMessage[] | undefined,
): OnboardingTaskOutput | null {
  const text = messages?.find((message) => message.type === "inputText")?.text;
  if (text == null) return null;
  try {
    const parsed = JSON.parse(text);
    const wrapperResult = onboardingResultWrapperSchema.safeParse(parsed);
    return wrapperResult.success ? wrapperResult.data.result : null;
  } catch {
    return null;
  }
}
export interface RunAppActionInPrimaryWindowOptions {
  sourceHostId?: string;
  sourceThreadId?: string;
}
export async function runAppActionInPrimaryWindow(
  action: string,
  { sourceHostId, sourceThreadId }: RunAppActionInPrimaryWindowOptions = {},
): Promise<unknown> {
  const appActions = appActionsBridge.appActions;
  if (appActions == null) {
    throw new Error("App actions are unavailable in this host");
  }
  return appActions.runInPrimaryWindow({
    action,
    sourceHostId,
    sourceThreadId,
  });
}
