// Restored from ref/webview/assets/thread-handoff-store-sg9zWCDG.js

import { useCallback, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom, atom } from "jotai";
import { threadContextInputsKa } from "../../app/thread-context-inputs";
import { v4 as uuidv4 } from "uuid";
export type HandoffDirection = "to-worktree" | "to-local" | "to-host-worktree";
export type HandoffStepStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed";
export interface HandoffStep {
  id: string;
  status: HandoffStepStatus;
}
export interface HandoffOperation {
  id: string;
  direction: HandoffDirection;
  status: "queued" | "in-progress" | "completed" | "failed";
  sourceConversationId: string;
  targetConversationId: string | null;
  sourceBranch: string | null;
  localBranch: string | null;
  worktreeBranch: string | null;
  stepIds: string[];
  steps: HandoffStep[];
  request: string;
  errorMessage: string | null;
  warningMessage: string | null;
  execOutput: string | null;
  hasUnseenTerminalState: boolean;
  composerViewState: unknown;
}
export interface HandoffStoreState {
  activeOperationId: string | null;
  operations: HandoffOperation[];
}
export interface CreateHandoffOperationInput {
  sourceConversationId: string;
  sourceBranch: string | null;
  localBranch: string | null;
  worktreeBranch: string | null;
  stepIds: string[];
  request: string;
  composerViewState: unknown;
}
const handoffStoreAtom = atom<HandoffStoreState>({
  activeOperationId: null,
  operations: [],
});
export function createHandoffOperation(
  input: CreateHandoffOperationInput,
): HandoffOperation {
  return {
    ...input,
    id: uuidv4(),
    status: "queued",
    targetConversationId: null,
    steps: input.stepIds.map((stepId) => ({
      id: stepId,
      status: "pending",
    })),
    errorMessage: null,
    warningMessage: null,
    execOutput: null,
    hasUnseenTerminalState: false,
  };
}
export function useThreadHandoffStoreValue(): HandoffStoreState {
  return useAtomValue(handoffStoreAtom);
}
export function findThreadHandoffOperationByConversationId(
  operations: HandoffOperation[],
  conversationId: string | null,
): HandoffOperation | null {
  if (conversationId == null) return null;
  for (let index = operations.length - 1; index >= 0; index--) {
    const operation = operations[index];
    if (
      operation.sourceConversationId === conversationId ||
      operation.targetConversationId === conversationId
    ) {
      return operation;
    }
  }
  return null;
}
export interface ThreadHandoffStoreActions {
  addToWorktreeOperation: (
    input: CreateHandoffOperationInput,
  ) => HandoffOperation;
  addToLocalOperation: (input: CreateHandoffOperationInput) => HandoffOperation;
  addToHostWorktreeOperation: (
    input: CreateHandoffOperationInput,
  ) => HandoffOperation;
  updateOperation: (
    operationId: string,
    update: Partial<HandoffOperation>,
  ) => void;
  removeOperation: (operationId: string) => void;
  openOperation: (operationId: string) => void;
  closeActiveOperation: () => void;
}
export function useThreadHandoffStore(): ThreadHandoffStoreActions {
  const [, setState] = useAtom(handoffStoreAtom);
  const addToWorktreeOperation = useCallback(
    (input: CreateHandoffOperationInput): HandoffOperation => {
      const operation = createHandoffOperation({
        ...input,
        direction: "to-worktree",
      });
      setState((state) => ({
        activeOperationId: null,
        operations: [...state.operations, operation],
      }));
      return operation;
    },
    [setState],
  );
  const addToLocalOperation = useCallback(
    (input: CreateHandoffOperationInput): HandoffOperation => {
      const operation = createHandoffOperation({
        ...input,
        direction: "to-local",
        worktreeBranch: null,
      });
      setState((state) => ({
        activeOperationId: null,
        operations: [...state.operations, operation],
      }));
      return operation;
    },
    [setState],
  );
  const addToHostWorktreeOperation = useCallback(
    (input: CreateHandoffOperationInput): HandoffOperation => {
      const operation = createHandoffOperation({
        ...input,
        direction: "to-host-worktree",
        localBranch: null,
        worktreeBranch: null,
      });
      setState((state) => ({
        activeOperationId: null,
        operations: [...state.operations, operation],
      }));
      return operation;
    },
    [setState],
  );
  const updateOperation = useCallback(
    (operationId: string, update: Partial<HandoffOperation>): void => {
      setState((state) => ({
        ...state,
        operations: state.operations.map((operation) =>
          operation.id === operationId
            ? (threadContextInputsKa(operation, update) as HandoffOperation)
            : operation,
        ),
      }));
    },
    [setState],
  );
  const removeOperation = useCallback(
    (operationId: string): void => {
      setState((state) => ({
        activeOperationId:
          state.activeOperationId === operationId
            ? null
            : state.activeOperationId,
        operations: state.operations.filter(
          (operation) => operation.id !== operationId,
        ),
      }));
    },
    [setState],
  );
  const openOperation = useCallback(
    (operationId: string): void => {
      setState((state) => ({
        activeOperationId: operationId,
        operations: state.operations.map((operation) =>
          operation.id === operationId
            ? {
                ...operation,
                hasUnseenTerminalState: false,
              }
            : operation,
        ),
      }));
    },
    [setState],
  );
  const closeActiveOperation = useCallback((): void => {
    setState((state) => ({
      ...state,
      activeOperationId: null,
    }));
  }, [setState]);
  return useMemo(
    () => ({
      addToWorktreeOperation,
      addToLocalOperation,
      addToHostWorktreeOperation,
      updateOperation,
      removeOperation,
      openOperation,
      closeActiveOperation,
    }),
    [
      addToWorktreeOperation,
      addToLocalOperation,
      addToHostWorktreeOperation,
      updateOperation,
      removeOperation,
      openOperation,
      closeActiveOperation,
    ],
  );
}
