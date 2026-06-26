// Restored from ref/webview/assets/preview-DvaTfwxN.js
// PDB chain sequence strip with residue selection.

import React, { useRef } from "react";
import clsx from "clsx";
import { FormattedMessage, useIntl } from "react-intl";
import { ChevronIcon } from "../../icons/chevron-icon";
import { Dropdown, DropdownComponents } from "../../ui/dropdown-ctb-ro-adh";
import { Button } from "../../ui/button";
import type {
  PdbResidue,
  PdbResidueChain,
  PdbSelectionRange,
} from "./pdb-types";
import {
  formatChainId,
  formatResidueNumber,
  formatResidueRange,
} from "./pdb-viewer-utils";
export interface PdbSequenceStripProps {
  chains: PdbResidueChain[];
  onChainChange: (chainId: string) => void;
  onResidueSelectionCommit: () => void;
  onResidueSelectionMove: (index: number) => void;
  onResidueSelectionSelect: (index: number) => void;
  onResidueSelectionStart: (index: number) => void;
  selectedChain: PdbResidueChain;
  selectedRange: PdbSelectionRange | null;
  selectedResidues: PdbResidue[];
}
export function PdbSequenceStrip({
  chains,
  onChainChange,
  onResidueSelectionCommit,
  onResidueSelectionMove,
  onResidueSelectionSelect,
  onResidueSelectionStart,
  selectedChain,
  selectedRange,
  selectedResidues,
}: PdbSequenceStripProps): JSX.Element {
  const intl = useIntl();
  const stripRef = useRef<HTMLDivElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const effectiveRange =
    selectedRange?.chainId === selectedChain.chainId ? selectedRange : null;
  const resolveResidueIndex = (target: Element): number | null => {
    if (!(target instanceof Element)) return null;
    const strip = stripRef.current;
    const residueElement = target.closest("[data-pdb-residue-index]");
    if (
      strip == null ||
      !(residueElement instanceof HTMLElement) ||
      !strip.contains(residueElement)
    )
      return null;
    const index = Number(residueElement.dataset.pdbResidueIndex);
    return Number.isInteger(index) ? index : null;
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    activePointerIdRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onResidueSelectionCommit();
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const index = resolveResidueIndex(event.target as Element);
    if (index == null) return;
    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    onResidueSelectionStart(index);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== event.pointerId) return;
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const index = element != null ? resolveResidueIndex(element) : null;
    if (index != null) onResidueSelectionMove(index);
  };
  const chainSelector =
    chains.length > 1 ? (
      <Dropdown
        align="start"
        contentWidth="xs"
        triggerButton={
          <Button
            aria-label={intl.formatMessage({
              id: "codex.filePreview.pdb.chainSelectLabel",
              defaultMessage: "Select PDB chain",
              description:
                "Accessible label for selecting a chain in a PDB sequence preview.",
            })}
            color="ghost"
            size="toolbar"
            className="!h-6 shrink-0 gap-1 rounded-md px-1.5 text-xs text-token-text-tertiary hover:text-token-text-primary"
          >
            <span className="text-token-text-primary">
              <FormattedMessage
                id="codex.filePreview.pdb.chainLabel"
                defaultMessage="Chain {chainId}"
                description="Label for the active chain in a PDB sequence chain."
                values={{
                  chainId: formatChainId(selectedChain.chainId),
                }}
              />
            </span>
            <ChevronIcon className="icon-2xs opacity-65" />
          </Button>
        }
      >
        {chains.map((chain) => (
          <DropdownComponents.Item
            key={chain.chainId}
            onSelect={() => onChainChange(chain.chainId)}
            className="text-token-text-primary"
          >
            <FormattedMessage
              id="codex.filePreview.pdb.chainOption"
              defaultMessage="Chain {chainId} ({count, number} residues)"
              description="Dropdown option for a PDB chain sequence."
              values={{
                chainId: formatChainId(chain.chainId),
                count: chain.residues.length,
              }}
            />
          </DropdownComponents.Item>
        ))}
      </Dropdown>
    ) : (
      <span className="font-medium text-token-text-primary">
        <FormattedMessage
          id="codex.filePreview.pdb.chainLabel"
          defaultMessage="Chain {chainId}"
          description="Label for the active chain in a PDB sequence chain."
          values={{
            chainId: formatChainId(selectedChain.chainId),
          }}
        />
      </span>
    );
  const residueCountLabel = (
    <span className="tabular-nums">
      <FormattedMessage
        id="codex.filePreview.pdb.sequenceResidueCount"
        defaultMessage="{count, number} coordinate residues"
        description="Coordinate residue count for the current PDB sequence chain."
        values={{
          count: selectedChain.residues.length,
        }}
      />
    </span>
  );
  const selectionLabel =
    selectedResidues.length > 0 ? (
      <span className="ml-auto font-medium text-token-text-primary">
        <FormattedMessage
          id="codex.filePreview.pdb.selectedResidues"
          defaultMessage="Selected {range}"
          description="Summary of the selected PDB residue range."
          values={{
            range: formatResidueRange(selectedResidues),
          }}
        />
      </span>
    ) : null;
  return (
    <div className="border-b border-token-border bg-token-main-surface-primary">
      <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 text-xs text-token-text-secondary">
        {chainSelector}
        {residueCountLabel}
        {selectionLabel}
      </div>
      <div
        ref={stripRef}
        aria-label={intl.formatMessage({
          id: "codex.filePreview.pdb.sequenceLabel",
          defaultMessage: "PDB chain sequence",
          description: "Accessible label for the PDB chain sequence row.",
        })}
        className="max-h-24 overflow-auto border-t border-token-border px-3 py-2 font-mono text-[11px] leading-5"
        onPointerCancel={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {selectedChain.residues.map((residue, index) => {
          const isInRange =
            effectiveRange != null &&
            index >= effectiveRange.startIndex &&
            index <= effectiveRange.endIndex;
          const isStart = isInRange && index === effectiveRange?.startIndex;
          const isEnd = isInRange && index === effectiveRange?.endIndex;
          return (
            <button
              key={`${residue.chainId}:${residue.residueNumber}:${residue.insertionCode}:${residue.residueName}:${index}`}
              data-pdb-residue-index={index}
              type="button"
              aria-label={intl.formatMessage(
                {
                  id: "codex.filePreview.pdb.residueLabel",
                  defaultMessage:
                    "{residueName} {residueNumber} in chain {chainId}",
                  description:
                    "Accessible label for a residue in the PDB sequence strip.",
                },
                {
                  chainId: formatChainId(residue.chainId),
                  residueName: residue.residueName,
                  residueNumber: formatResidueNumber(residue),
                },
              )}
              aria-pressed={isInRange}
              className={clsx(
                "cursor-interaction inline-flex h-5 min-w-[1.35ch] select-none items-center justify-center rounded-none px-0 text-token-text-secondary",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-token-text-primary",
                !isInRange &&
                  "hover:rounded-sm hover:bg-token-main-surface-secondary hover:text-token-text-primary",
                isInRange && "bg-orange-100 text-orange-800",
                isStart && "rounded-l-sm",
                isEnd && "rounded-r-sm",
                isStart && isEnd && "rounded-sm ring-1 ring-orange-300",
              )}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onResidueSelectionSelect(index);
              }}
              title={intl.formatMessage(
                {
                  id: "codex.filePreview.pdb.residueTitle",
                  defaultMessage: "{residueName} {residueNumber}",
                  description:
                    "Tooltip title for a residue in the PDB sequence strip.",
                },
                {
                  residueName: residue.residueName,
                  residueNumber: formatResidueNumber(residue),
                },
              )}
            >
              {residue.sequenceCode}
            </button>
          );
        })}
      </div>
    </div>
  );
}
