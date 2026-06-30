// Restored from ref/webview/assets/preview-DvaTfwxN.js
// PDB file preview: fetches a PDB file, parses models, and renders a 3Dmol viewer.

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "../../ui/ui/button.tsx";
import { CheckMdIcon } from "../../icons/check-md-icon";
import { ChevronIcon } from "../../icons/chevron-icon";
import { useResizeObserver } from "../../utils/use-resize-observer";
import { Dropdown, DropdownComponents } from "../../ui/ui/dropdown-ctb-ro-adh/item.tsx";
import {
  RichPreviewCaption,
  RichPreviewLoading,
} from "../../ui/ui/rich-preview-primitives";
import { O as useVscodeApi } from "../../boundaries/vscode-api";
import { parsePdbModels } from "./pdb-parser";
import type { PdbModel, PdbResidueChain } from "./pdb-types";
import { PdbSequenceStrip } from "./pdb-sequence-strip";
import {
  applyPdbStyles,
  build3dmolSelection,
  cleanupViewer,
  createPdbViewer,
  formatScore,
  getFileName,
  getResiduesInRange,
  type PdbSelectionRange,
  type PdbViewerApi,
} from "./pdb-viewer-utils";
export interface PdbPreviewProps {
  className?: string;
  fallback?: ReactNode;
  hostId?: string;
  path?: string;
  showFileName?: boolean;
}
const EMPTY_ARRAY: PdbSelectionRange[] = [];
export function Preview({
  className,
  fallback,
  hostId,
  path = "",
  showFileName = false,
}: PdbPreviewProps): ReactNode {
  const hasPath = path != null && path.length > 0;
  const params = {
    path,
    ...(hostId != null
      ? {
          hostId,
        }
      : {}),
  };
  const { data, isError, isLoading } = useVscodeApi("read-file", {
    params,
    queryConfig: {
      enabled: hasPath,
    },
  });
  if (!hasPath) return fallback ?? null;
  if (isLoading) {
    return (
      <div
        className={clsx(
          "flex h-full items-center justify-center bg-token-main-surface-primary",
          className,
        )}
      >
        <RichPreviewLoading className="text-sm" />
      </div>
    );
  }
  if (isError || data == null) return fallback ?? null;
  const fileName = showFileName ? (path ?? undefined) : undefined;
  return (
    <PdbPreviewContent
      className={className}
      contents={data.contents}
      filePath={fileName}
    />
  );
}
interface PdbPreviewContentProps {
  className?: string;
  contents: string;
  filePath?: string;
}
function PdbPreviewContent({
  className,
  contents,
  filePath,
}: PdbPreviewContentProps): JSX.Element {
  const intl = useIntl();
  const parsed = useMemo(() => parsePdbModels(contents), [contents]);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [viewerContainer, setViewerContainer] = useState<HTMLElement | null>(
    null,
  );
  const [viewerLoadState, setViewerLoadState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [viewerResetKey, setViewerResetKey] = useState(0);
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [committedSelection, setCommittedSelection] =
    useState<PdbSelectionRange | null>(null);
  const [pendingSelection, setPendingSelection] =
    useState<PdbSelectionRange | null>(null);
  const viewerRef = useRef<PdbViewerApi | null>(null);
  const models = parsed.models;
  const selectedModel = models[selectedModelIndex] ?? null;
  const modelContents = selectedModel?.contents ?? null;
  const residueChains = selectedModel?.residueChains ?? EMPTY_ARRAY;
  const selectedChain =
    residueChains.find((chain) => chain.chainId === selectedChainId) ??
    residueChains[0] ??
    null;
  const committedResidues = useMemo(
    () => getResiduesInRange(selectedChain, committedSelection),
    [selectedChain, committedSelection],
  );
  const committedSelectionSpec = useMemo(
    () =>
      committedResidues.length > 0
        ? build3dmolSelection(committedResidues)
        : null,
    [committedResidues],
  );
  const pendingResidues = useMemo(
    () => getResiduesInRange(selectedChain, pendingSelection),
    [selectedChain, pendingSelection],
  );
  const pendingSelectionSpec = useMemo(
    () =>
      pendingResidues.length > 0 ? build3dmolSelection(pendingResidues) : null,
    [pendingResidues],
  );
  const setSelection = useCallback((range: PdbSelectionRange | null) => {
    setPendingSelection(range);
  }, []);
  useEffect(() => {
    if (selectedModelIndex >= models.length) setSelectedModelIndex(0);
  }, [selectedModelIndex, models.length]);
  const setResizeRef = useResizeObserver(() => {
    viewerRef.current?.resize();
    viewerRef.current?.render();
  });
  const containerRef = useCallback(
    (element: HTMLElement | null) => {
      setViewerContainer(element);
      setResizeRef(element as Parameters<typeof setResizeRef>[0]);
    },
    [setResizeRef],
  );
  const resetView = useCallback(() => {
    setSelection(null);
    setSelectionStart(null);
    setCommittedSelection(null);
    setViewerResetKey((key) => key + 1);
  }, [setSelection]);
  const handleChainChange = useCallback(
    (chainId: string) => {
      setSelectedChainId(chainId);
      setSelection(null);
      setCommittedSelection(null);
      setSelectionStart(null);
    },
    [setSelection],
  );
  const handleSelectionStart = useCallback(
    (index: number) => {
      if (selectedChain == null) return;
      setSelectionStart(index);
      setSelection({
        chainId: selectedChain.chainId,
        endIndex: index,
        modelIndex: selectedModelIndex,
        startIndex: index,
      });
    },
    [selectedChain, selectedModelIndex, setSelection],
  );
  const handleSelectionMove = useCallback(
    (index: number) => {
      if (selectionStart == null || selectedChain == null) return;
      setSelection({
        chainId: selectedChain.chainId,
        endIndex: Math.max(selectionStart, index),
        modelIndex: selectedModelIndex,
        startIndex: Math.min(selectionStart, index),
      });
    },
    [selectionStart, selectedChain, selectedModelIndex, setSelection],
  );
  const handleSelectionCommit = useCallback(() => {
    const current = pendingSelection;
    setSelectionStart(null);
    setCommittedSelection(current);
    setPendingSelection(null);
  }, [pendingSelection]);
  const handleSelectionSelect = useCallback(
    (index: number) => {
      if (selectedChain == null) return;
      const range: PdbSelectionRange = {
        chainId: selectedChain.chainId,
        endIndex: index,
        modelIndex: selectedModelIndex,
        startIndex: index,
      };
      setSelectionStart(null);
      setCommittedSelection(range);
      setPendingSelection(range);
    },
    [selectedChain, selectedModelIndex, setSelection],
  );

  // Load / reload the 3Dmol viewer when the model contents or reset key changes.
  useEffect(() => {
    if (viewerContainer == null || modelContents == null) return;
    let isActive = true;
    setViewerLoadState("loading");
    const run = async () => {
      try {
        cleanupViewer(viewerContainer, viewerRef.current);
        const createViewer = await createPdbViewer();
        if (!isActive) return;
        const viewer = createViewer(viewerContainer, {
          backgroundColor: "white",
          disableFog: true,
        });
        viewerRef.current = viewer;
        viewer.addModel(modelContents, "pdb");
        applyPdbStyles(viewer, null);
        viewer.zoomTo();
        viewer.setBackgroundColor("white");
        viewer.resize();
        viewer.render();
        setViewerLoadState("idle");
      } catch {
        if (!isActive) return;
        cleanupViewer(viewerContainer, viewerRef.current);
        viewerRef.current = null;
        setViewerLoadState("error");
      }
    };
    void run();
    return () => {
      isActive = false;
      cleanupViewer(viewerContainer, viewerRef.current);
      viewerRef.current = null;
    };
  }, [modelContents, viewerResetKey, viewerContainer]);

  // Apply styles when the committed selection changes.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer == null || viewerLoadState !== "idle") return;
    applyPdbStyles(viewer, committedResidues);
    viewer.render();
  }, [committedResidues, viewerLoadState]);

  // Zoom to the pending selection while the user is dragging.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (
      viewer == null ||
      viewerLoadState !== "idle" ||
      pendingSelection == null ||
      pendingSelectionSpec == null
    )
      return;
    viewer.zoomTo(pendingSelectionSpec, 350, true);
    viewer.render();
  }, [pendingSelection, pendingSelectionSpec, viewerLoadState]);
  if (models.length === 0 || selectedModel == null) {
    return (
      <PdbPreviewLayout className={className} filePath={filePath}>
        <div className="flex h-full items-center justify-center">
          <RichPreviewCaption>
            <FormattedMessage
              id="codex.filePreview.pdb.empty"
              defaultMessage="No PDB atoms found"
              description="Placeholder text when a PDB file cannot be parsed into atom records."
            />
          </RichPreviewCaption>
        </div>
      </PdbPreviewLayout>
    );
  }
  return (
    <PdbPreviewLayout className={className} filePath={filePath}>
      <div className="flex flex-wrap items-center gap-2 border-b border-token-border px-3 py-2">
        {models.length > 1 ? (
          <Dropdown
            align="end"
            contentWidth="xs"
            triggerButton={
              <Button
                aria-label={intl.formatMessage({
                  id: "codex.filePreview.pdb.modelSelectLabel",
                  defaultMessage: "Select PDB model",
                  description:
                    "Accessible label for selecting a model inside a multi-model PDB file.",
                })}
                color="ghost"
                size="toolbar"
                className="!h-6 shrink-0 gap-1 rounded-md px-1.5 text-sm text-token-text-tertiary hover:text-token-text-primary"
              >
                <span className="text-token-text-primary tabular-nums">
                  {intl.formatMessage(
                    {
                      id: "codex.filePreview.pdb.modelOption",
                      defaultMessage: "Model {modelNumber}",
                      description:
                        "Dropdown option label for selecting a model inside a multi-model PDB file.",
                    },
                    {
                      modelNumber: selectedModel.modelNumber,
                    },
                  )}
                </span>
                <ChevronIcon className="icon-2xs opacity-65" />
              </Button>
            }
          >
            {models.map((model, index) => (
              <DropdownComponents.Item
                key={`${model.modelNumber}-${index}`}
                RightIcon={
                  index === selectedModelIndex ? CheckMdIcon : undefined
                }
                onSelect={() => setSelectedModelIndex(index)}
                className="text-token-text-primary"
              >
                {intl.formatMessage(
                  {
                    id: "codex.filePreview.pdb.modelOption",
                    defaultMessage: "Model {modelNumber}",
                    description:
                      "Dropdown option label for selecting a model inside a multi-model PDB file.",
                  },
                  {
                    modelNumber: model.modelNumber,
                  },
                )}
              </DropdownComponents.Item>
            ))}
          </Dropdown>
        ) : null}

        <Button
          color="outline"
          size="toolbar"
          className="!h-6 shrink-0 rounded-md !border-token-border-default bg-token-main-surface-primary text-sm text-token-text-primary hover:text-token-text-primary"
          onClick={resetView}
        >
          <FormattedMessage
            id="codex.filePreview.pdb.resetView"
            defaultMessage="Reset view"
            description="Button label for resetting PDB viewer rotation and zoom."
          />
        </Button>

        <div className="ml-auto flex flex-wrap gap-x-4 gap-y-1 text-xs text-token-text-secondary">
          <span>
            <FormattedMessage
              id="codex.filePreview.pdb.residueCount"
              defaultMessage="{count, number} residues"
              description="Summary count of residues parsed from a PDB file."
              values={{
                count: selectedModel.stats.residueCount,
              }}
            />
          </span>
          <span>
            <FormattedMessage
              id="codex.filePreview.pdb.atomCount"
              defaultMessage="{count, number} atoms"
              description="Summary count of atoms parsed from a PDB file."
              values={{
                count: selectedModel.stats.atomCount,
              }}
            />
          </span>
          <span>
            <FormattedMessage
              id="codex.filePreview.pdb.scoreSummary"
              defaultMessage="B-factor/pLDDT {mean}"
              description="Summary of the mean B-factor or AlphaFold pLDDT score in a PDB file."
              values={{
                mean: formatScore(selectedModel.stats.meanScore),
              }}
            />
          </span>
        </div>
      </div>

      {selectedChain != null && (
        <PdbSequenceStrip
          chains={residueChains}
          selectedChain={selectedChain}
          selectedRange={committedSelection ?? pendingSelection}
          selectedResidues={
            pendingSelection != null ? pendingResidues : committedResidues
          }
          onChainChange={handleChainChange}
          onResidueSelectionCommit={handleSelectionCommit}
          onResidueSelectionMove={handleSelectionMove}
          onResidueSelectionSelect={handleSelectionSelect}
          onResidueSelectionStart={handleSelectionStart}
        />
      )}

      <div className="relative min-h-0 flex-1 bg-white">
        <div
          ref={containerRef}
          className="h-full w-full overflow-hidden"
          aria-label={intl.formatMessage({
            id: "codex.filePreview.pdb.viewerLabel",
            defaultMessage: "Interactive PDB structure viewer",
            description: "Accessible label for the PDB structure viewer.",
          })}
        />
        {viewerLoadState === "loading" ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70">
            <RichPreviewLoading className="text-sm" />
          </div>
        ) : null}
        {viewerLoadState === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-token-main-surface-primary">
            <RichPreviewCaption>
              <FormattedMessage
                id="codex.filePreview.pdb.viewerLoadError"
                defaultMessage="Unable to load the 3Dmol PDB viewer"
                description="Error text when the 3Dmol PDB viewer cannot be loaded."
              />
            </RichPreviewCaption>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-token-border px-3 py-2 text-xs text-token-text-secondary">
        <PdbLegendItem className="bg-[#0053d6]">
          <FormattedMessage
            id="codex.filePreview.pdb.legendVeryHigh"
            defaultMessage="90+"
            description="PDB confidence legend label for very high scores."
          />
        </PdbLegendItem>
        <PdbLegendItem className="bg-[#65cbf3]">
          <FormattedMessage
            id="codex.filePreview.pdb.legendConfident"
            defaultMessage="70-90"
            description="PDB confidence legend label for confident scores."
          />
        </PdbLegendItem>
        <PdbLegendItem className="bg-[#ffdb13]">
          <FormattedMessage
            id="codex.filePreview.pdb.legendLow"
            defaultMessage="50-70"
            description="PDB confidence legend label for low scores."
          />
        </PdbLegendItem>
        <PdbLegendItem className="bg-[#ff7d45]">
          <FormattedMessage
            id="codex.filePreview.pdb.legendVeryLow"
            defaultMessage="<50"
            description="PDB confidence legend label for very low scores."
          />
        </PdbLegendItem>
        <span className="ml-auto">
          <FormattedMessage
            id="codex.filePreview.pdb.interactionHint"
            defaultMessage="Drag to rotate. Scroll to zoom."
            description="Interaction hint for the PDB structure viewer."
          />
        </span>
      </div>
    </PdbPreviewLayout>
  );
}
interface PdbPreviewLayoutProps {
  children: ReactNode;
  className?: string;
  filePath?: string;
}
function PdbPreviewLayout({
  children,
  className,
  filePath,
}: PdbPreviewLayoutProps): JSX.Element {
  const fileName = filePath != null ? getFileName(filePath) : null;
  return (
    <div
      className={clsx(
        "flex h-full min-h-0 flex-col bg-token-main-surface-primary",
        className,
      )}
    >
      {fileName != null ? (
        <div className="border-b border-token-border px-3 py-2 text-sm font-medium text-token-text-primary">
          {fileName}
        </div>
      ) : null}
      {children}
    </div>
  );
}
interface PdbLegendItemProps {
  children: ReactNode;
  className?: string;
}
function PdbLegendItem({
  children,
  className,
}: PdbLegendItemProps): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={clsx("h-2.5 w-2.5 rounded-sm", className)} />
      {children}
    </span>
  );
}
