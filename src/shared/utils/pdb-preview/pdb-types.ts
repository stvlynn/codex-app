// Restored from ref/webview/assets/preview-DvaTfwxN.js
// Shared data types for the PDB preview.

export interface PdbRawModel {
  contents: string;
  modelNumber: number;
  title: string | null;
}
export interface PdbModel extends PdbRawModel {
  atoms: PdbAtom[];
  chains: string[];
  residueChains: PdbResidueChain[];
  stats: PdbStats;
  trace: PdbAtom[];
}
export interface PdbAtom {
  atomName: string;
  bFactor: number | null;
  chainId: string;
  element: string;
  insertionCode: string;
  isHetAtom: boolean;
  residueName: string;
  residueNumber: number;
  serial: number | null;
  x: number;
  y: number;
  z: number;
}
export interface PdbResidue {
  atomSerials: number[];
  chainId: string;
  insertionCode: string;
  residueName: string;
  residueNumber: number;
  sequenceCode: string;
}
export interface PdbResidueChain {
  chainId: string;
  residues: PdbResidue[];
  sequence: string;
}
export interface PdbStats {
  atomCount: number;
  chainCount: number;
  maxScore: number | null;
  meanScore: number | null;
  minScore: number | null;
  residueCount: number;
}
export interface PdbSelectionRange {
  chainId: string;
  endIndex: number;
  modelIndex: number;
  startIndex: number;
}
export interface PdbViewerApi {
  addModel(contents: string, format: string): void;
  addStyle(selection: unknown, style: unknown): void;
  clear(): void;
  removeAllModels(): void;
  render(): void;
  resize(): void;
  setBackgroundColor(color: string): void;
  setStyle(selection: unknown, style: unknown): void;
  zoomTo(selection?: unknown, duration?: number, always?: boolean): void;
}
