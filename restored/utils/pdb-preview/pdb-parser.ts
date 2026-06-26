// Restored from ref/webview/assets/preview-DvaTfwxN.js
// PDB parsing primitives for the 3Dmol structure preview.

import type {
  PdbAtom,
  PdbModel,
  PdbRawModel,
  PdbResidue,
  PdbResidueChain,
  PdbStats,
} from "./pdb-types";
const RESIDUE_CODE_MAP: Record<string, string> = {
  A: "A",
  ALA: "A",
  ARG: "R",
  ASN: "N",
  ASP: "D",
  ASX: "B",
  C: "C",
  CYS: "C",
  CYM: "C",
  CYX: "C",
  DA: "A",
  DC: "C",
  DG: "G",
  DT: "T",
  DU: "U",
  G: "G",
  GLN: "Q",
  GLU: "E",
  GLX: "Z",
  GLY: "G",
  HIS: "H",
  HSD: "H",
  HSE: "H",
  HSP: "H",
  ILE: "I",
  LEU: "L",
  LYS: "K",
  M: "M",
  MET: "M",
  MSE: "M",
  PHE: "F",
  PRO: "P",
  PYL: "O",
  SEC: "U",
  SEP: "S",
  SER: "S",
  T: "T",
  THR: "T",
  TPO: "T",
  TRP: "W",
  TYR: "Y",
  U: "U",
  VAL: "V",
};
export function getResidueCode(residueName: string): string {
  return RESIDUE_CODE_MAP[residueName.toUpperCase()] ?? "X";
}
export function isKnownResidue(residueName: string): boolean {
  return RESIDUE_CODE_MAP[residueName.toUpperCase()] != null;
}
export function parsePdbModels(contents: string): {
  models: PdbModel[];
} {
  return {
    models: splitPdbModels(contents)
      .map((model) => {
        const atoms = parsePdbAtoms(model.contents);
        const chains = [...new Set(atoms.map((atom) => atom.chainId))].sort();
        const residueChains = buildResidueChains(atoms);
        const trace = getTraceAtoms(atoms);
        return {
          ...model,
          atoms,
          chains,
          residueChains,
          stats: computePdbStats(atoms, trace),
          trace,
        };
      })
      .filter((model) => model.atoms.length > 0),
  };
}
function splitPdbModels(contents: string): PdbRawModel[] {
  const lines = contents.split(/\r?\n/);
  if (!lines.some((line) => line.slice(0, 6).trim() === "MODEL")) {
    return [
      {
        contents,
        modelNumber: 1,
        title: extractPdbTitle(lines),
      },
    ];
  }
  const headerLines: string[] = [];
  const models: PdbRawModel[] = [];
  let currentModel: {
    lines: string[];
    modelNumber: number;
    title: string | null;
  } | null = null;
  let nextModelNumber = 1;
  let sawModel = false;
  for (const line of lines) {
    const recordName = line.slice(0, 6).trim();
    if (recordName === "MODEL") {
      if (currentModel != null) {
        models.push(currentModel);
      }
      sawModel = true;
      currentModel = {
        lines: [line],
        modelNumber: parsePdbInt(line.slice(10, 14)) ?? nextModelNumber,
        title: null,
      };
      nextModelNumber += 1;
      continue;
    }
    if (currentModel == null) {
      if (!sawModel) {
        headerLines.push(line);
      }
      continue;
    }
    currentModel.lines.push(line);
    if (currentModel.title == null && recordName === "REMARK") {
      currentModel.title = getRemarkText(line);
    }
    if (recordName === "ENDMDL") {
      models.push(currentModel);
      currentModel = null;
    }
  }
  if (currentModel != null) {
    models.push(currentModel);
  }
  const sharedTitle = extractPdbTitle(headerLines);
  return models.map((model) => ({
    contents: [...headerLines, ...model.lines].join("\n"),
    modelNumber: model.modelNumber,
    title: model.title ?? sharedTitle,
  }));
}
function parsePdbAtoms(contents: string): PdbAtom[] {
  const atoms: PdbAtom[] = [];
  for (const line of contents.split(/\r?\n/)) {
    const recordName = line.slice(0, 6).trim();
    if (recordName !== "ATOM" && recordName !== "HETATM") continue;
    const atom = parsePdbAtomLine(line);
    if (atom != null) atoms.push(atom);
  }
  return atoms;
}
function parsePdbAtomLine(line: string): PdbAtom | null {
  const x = parsePdbFloat(line.slice(30, 38));
  const y = parsePdbFloat(line.slice(38, 46));
  const z = parsePdbFloat(line.slice(46, 54));
  if (x == null || y == null || z == null) return null;
  const atomName = line.slice(12, 16).trim();
  const recordName = line.slice(0, 6).trim();
  return {
    atomName,
    bFactor: parsePdbFloat(line.slice(60, 66)),
    chainId: line.slice(21, 22).trim() || " ",
    element: line.slice(76, 78).trim() || inferElementFromAtomName(atomName),
    insertionCode: line.slice(26, 27).trim() || " ",
    isHetAtom: recordName === "HETATM",
    residueName: line.slice(17, 20).trim(),
    residueNumber: parsePdbInt(line.slice(22, 26)) ?? 0,
    serial: parsePdbInt(line.slice(6, 11)),
    x,
    y,
    z,
  };
}
function buildResidueChains(atoms: PdbAtom[]): PdbResidueChain[] {
  const chainMap = new Map<string, PdbResidue[]>();
  const residueMap = new Map<string, PdbResidue>();
  for (const atom of atoms) {
    if (atom.isHetAtom && !isKnownResidue(atom.residueName)) continue;
    const key = makeResidueKey(atom);
    let residue = residueMap.get(key);
    if (residue != null) {
      if (atom.serial != null) residue.atomSerials.push(atom.serial);
      continue;
    }
    residue = {
      atomSerials: atom.serial == null ? [] : [atom.serial],
      chainId: atom.chainId,
      insertionCode: atom.insertionCode,
      residueName: atom.residueName,
      residueNumber: atom.residueNumber,
      sequenceCode: getResidueCode(atom.residueName),
    };
    residueMap.set(key, residue);
    const chainResidues = chainMap.get(atom.chainId) ?? [];
    chainResidues.push(residue);
    chainMap.set(atom.chainId, chainResidues);
  }
  return [...chainMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chainId, residues]) => ({
      chainId,
      residues,
      sequence: residues.map((residue) => residue.sequenceCode).join(""),
    }));
}
function makeResidueKey(atom: PdbAtom): string {
  return [
    atom.chainId,
    atom.residueNumber,
    atom.insertionCode,
    atom.residueName,
  ].join(":");
}
function getTraceAtoms(atoms: PdbAtom[]): PdbAtom[] {
  const trace = atoms.filter((atom) => atom.atomName === "CA");
  return trace.length > 0 ? trace : atoms;
}
function computePdbStats(atoms: PdbAtom[], traceAtoms: PdbAtom[]): PdbStats {
  const residueKeys = new Set(
    atoms.map((atom) =>
      [
        atom.chainId,
        atom.residueName,
        atom.residueNumber,
        atom.insertionCode,
      ].join(":"),
    ),
  );
  const scores = (traceAtoms.length > 0 ? traceAtoms : atoms)
    .map((atom) => atom.bFactor)
    .filter((value): value is number => value != null);
  return {
    atomCount: atoms.length,
    chainCount: new Set(atoms.map((atom) => atom.chainId)).size,
    maxScore: scores.length > 0 ? Math.max(...scores) : null,
    meanScore:
      scores.length > 0
        ? scores.reduce((accumulator, current) => accumulator + current, 0) /
          scores.length
        : null,
    minScore: scores.length > 0 ? Math.min(...scores) : null,
    residueCount: residueKeys.size,
  };
}
function inferElementFromAtomName(atomName: string): string {
  const match = atomName
    .match(/[A-Za-z]+/)?.[0]
    ?.slice(0, 2)
    .toUpperCase();
  return match ?? "";
}
function extractPdbTitle(lines: string[]): string | null {
  for (const line of lines) {
    if (line.slice(0, 6).trim() === "REMARK") return getRemarkText(line);
  }
  return null;
}
function getRemarkText(line: string): string | null {
  const text = line.slice(6).trim();
  return text.length > 0 ? text : null;
}
function parsePdbFloat(text: string): number | null {
  const value = Number.parseFloat(text.trim());
  return Number.isFinite(value) ? value : null;
}
function parsePdbInt(text: string): number | null {
  const value = Number.parseInt(text.trim(), 10);
  return Number.isFinite(value) ? value : null;
}
