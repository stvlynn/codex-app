// Restored from ref/webview/assets/preview-DvaTfwxN.js
// Helpers for driving the 3Dmol viewer, residue selections, and formatting.

import type {
  PdbResidue,
  PdbResidueChain,
  PdbSelectionRange,
  PdbViewerApi,
} from "./pdb-types";
export type { PdbSelectionRange, PdbViewerApi } from "./pdb-types";
const DEFAULT_CARTOON_STYLE = {
  cartoon: {
    colorscheme: {
      gradient: "roygb",
      max: 100,
      min: 50,
      prop: "b",
    },
  },
} as const;
const DEFAULT_STICK_STYLE = {
  stick: {
    radius: 0.12,
  },
} as const;
const SELECTED_CARTOON_STYLE = {
  cartoon: {
    colorscheme: {
      gradient: "roygb",
      max: 100,
      min: 50,
      prop: "b",
    },
    opacity: 0.34,
  },
} as const;
const HIDDEN_STICK_STYLE = {
  stick: {
    hidden: true,
  },
} as const;
const HIGHLIGHT_STYLE = {
  cartoon: {
    color: "#f97316",
  },
  stick: {
    color: "#f97316",
    radius: 0.12,
  },
} as const;
export async function createPdbViewer(): Promise<PdbViewerApi> {
  const module = await import("3dmol");
  const createViewer =
    typeof module.createViewer === "function"
      ? module.createViewer
      : typeof module.default?.createViewer === "function"
        ? module.default.createViewer
        : null;
  if (typeof createViewer !== "function") {
    throw new Error("3Dmol createViewer export was not found");
  }
  return createViewer as PdbViewerApi;
}
export function applyPdbStyles(
  viewer: PdbViewerApi,
  selectedResidues: PdbResidue[] | null,
): void {
  if (selectedResidues == null || selectedResidues.length === 0) {
    viewer.setStyle({}, DEFAULT_CARTOON_STYLE);
    viewer.addStyle(
      {
        hetflag: false,
      },
      DEFAULT_STICK_STYLE,
    );
    return;
  }
  const inverseSelection = {
    not: selectedResidues,
  };
  viewer.setStyle(inverseSelection, SELECTED_CARTOON_STYLE);
  viewer.addStyle(
    {
      and: [
        inverseSelection,
        {
          hetflag: false,
        },
      ],
    },
    HIDDEN_STICK_STYLE,
  );
  viewer.setStyle(selectedResidues, HIGHLIGHT_STYLE);
}
export function getResiduesInRange(
  chain: PdbResidueChain | null | undefined,
  range: PdbSelectionRange | null | undefined,
): PdbResidue[] {
  if (chain == null || range == null || range.chainId !== chain.chainId)
    return [];
  const start = Math.max(
    0,
    Math.min(range.startIndex, chain.residues.length - 1),
  );
  const end = Math.max(
    start,
    Math.min(range.endIndex, chain.residues.length - 1),
  );
  return chain.residues.slice(start, end + 1);
}
export function build3dmolSelection(residues: PdbResidue[]):
  | {
      serial: number[];
    }
  | {
      or: ReturnType<typeof residueTo3dmolSelector>[];
    } {
  const serials = [
    ...new Set(residues.flatMap((residue) => residue.atomSerials)),
  ];
  if (serials.length > 0)
    return {
      serial: serials,
    };
  return {
    or: residues.map(residueTo3dmolSelector),
  };
}
export function residueTo3dmolSelector(residue: PdbResidue) {
  return {
    chain: residue.chainId,
    icode: residue.insertionCode,
    resi: residue.residueNumber,
    resn: residue.residueName,
  };
}
export function cleanupViewer(
  container: HTMLElement,
  viewer: PdbViewerApi | null,
): void {
  viewer?.removeAllModels();
  viewer?.clear();
  container.replaceChildren();
}
export function formatScore(score: number | null): string {
  return score == null ? "n/a" : score.toFixed(1);
}
export function formatResidueRange(residues: PdbResidue[]): string {
  const first = residues[0];
  const last = residues.at(-1);
  if (first == null || last == null) return "";
  const chainId = formatChainId(first.chainId);
  const firstNumber = formatResidueNumber(first);
  const lastNumber = formatResidueNumber(last);
  return firstNumber === lastNumber
    ? `${chainId}:${firstNumber}`
    : `${chainId}:${firstNumber}-${lastNumber}`;
}
export function formatResidueNumber(residue: PdbResidue): string {
  const insertionCode = residue.insertionCode.trim();
  return insertionCode.length > 0
    ? `${residue.residueNumber}${insertionCode}`
    : String(residue.residueNumber);
}
export function formatChainId(chainId: string): string {
  return chainId.trim().length > 0 ? chainId : "(blank)";
}
export function getFileName(filePath: string): string {
  return filePath.split(/[/\\]+/).at(-1) ?? filePath;
}
