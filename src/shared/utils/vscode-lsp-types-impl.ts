// Restored from ref/webview/assets/main-BDm-p1LA.js
// VSCode Language Server Protocol (LSP) types and utilities.
// This is a vendored subset of the vscode-languageserver-types package.
//
// Semantic implementation — no runtime dependencies.
//

// ------------------------------------------------------------------
// URI
// ------------------------------------------------------------------

export interface DocumentUri {
  is(value: unknown): value is string;
}
export const DocumentUri: DocumentUri = {
  is(value: unknown): value is string {
    return typeof value === "string";
  },
};

// ------------------------------------------------------------------
// URI (alias)
// ------------------------------------------------------------------

export interface URI {
  is(value: unknown): value is string;
}
export const URI: URI = {
  is(value: unknown): value is string {
    return typeof value === "string";
  },
};

// ------------------------------------------------------------------
// Integer
// ------------------------------------------------------------------

export interface Integer {
  MIN_VALUE: number;
  MAX_VALUE: number;
  is(value: unknown): value is number;
}
export const integer: Integer = {
  MIN_VALUE: -2147483648,
  MAX_VALUE: 2147483647,
  is(value: unknown): value is number {
    return (
      typeof value === "number" &&
      integer.MIN_VALUE <= value &&
      value <= integer.MAX_VALUE
    );
  },
};

// ------------------------------------------------------------------
// UInteger
// ------------------------------------------------------------------

export interface UInteger {
  MIN_VALUE: number;
  MAX_VALUE: number;
  is(value: unknown): value is number;
}
export const uinteger: UInteger = {
  MIN_VALUE: 0,
  MAX_VALUE: 2147483647,
  is(value: unknown): value is number {
    return (
      typeof value === "number" &&
      uinteger.MIN_VALUE <= value &&
      value <= uinteger.MAX_VALUE
    );
  },
};

// ------------------------------------------------------------------
// Position
// ------------------------------------------------------------------

export interface Position {
  line: number;
  character: number;
}
export namespace Position {
  export function create(line: number, character: number): Position {
    if (line === Number.MAX_VALUE) line = uinteger.MAX_VALUE;
    if (character === Number.MAX_VALUE) character = uinteger.MAX_VALUE;
    return {
      line,
      character,
    };
  }
  export function is(value: unknown): value is Position {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      uinteger.is(candidate.line) &&
      uinteger.is(candidate.character)
    );
  }
}

// ------------------------------------------------------------------
// Range
// ------------------------------------------------------------------

export interface Range {
  start: Position;
  end: Position;
}
export namespace Range {
  export function create(
    startLine: number,
    startCharacter: number,
    endLine: number,
    endCharacter: number,
  ): Range;
  export function create(start: Position, end: Position): Range;
  export function create(
    startLineOrStart: number | Position,
    startCharacterOrEnd: number | Position,
    endLine?: number,
    endCharacter?: number,
  ): Range {
    if (
      uinteger.is(startLineOrStart) &&
      uinteger.is(startCharacterOrEnd) &&
      uinteger.is(endLine) &&
      uinteger.is(endCharacter)
    ) {
      return {
        start: Position.create(startLineOrStart, startCharacterOrEnd),
        end: Position.create(endLine, endCharacter),
      };
    }
    if (Position.is(startLineOrStart) && Position.is(startCharacterOrEnd)) {
      return {
        start: startLineOrStart,
        end: startCharacterOrEnd,
      };
    }
    throw new Error(
      `Range.create called with invalid arguments[${startLineOrStart}, ${startCharacterOrEnd}, ${endLine}, ${endCharacter}]`,
    );
  }
  export function is(value: unknown): value is Range {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Position.is(candidate.start) &&
      Position.is(candidate.end)
    );
  }
}

// ------------------------------------------------------------------
// Location
// ------------------------------------------------------------------

export interface Location {
  uri: string;
  range: Range;
}
export namespace Location {
  export function create(uri: string, range: Range): Location {
    return {
      uri,
      range,
    };
  }
  export function is(value: unknown): value is Location {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      (typeof candidate.uri === "string" || candidate.uri === undefined)
    );
  }
}

// ------------------------------------------------------------------
// LocationLink
// ------------------------------------------------------------------

export interface LocationLink {
  targetUri: string;
  targetRange: Range;
  targetSelectionRange: Range;
  originSelectionRange?: Range;
}
export namespace LocationLink {
  export function create(
    targetUri: string,
    targetRange: Range,
    targetSelectionRange: Range,
    originSelectionRange?: Range,
  ): LocationLink {
    return {
      targetUri,
      targetRange,
      targetSelectionRange,
      originSelectionRange,
    };
  }
  export function is(value: unknown): value is LocationLink {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.targetRange) &&
      typeof candidate.targetUri === "string" &&
      Range.is(candidate.targetSelectionRange) &&
      (Range.is(candidate.originSelectionRange) ||
        candidate.originSelectionRange === undefined)
    );
  }
}

// ------------------------------------------------------------------
// Color
// ------------------------------------------------------------------

export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
export namespace Color {
  export function create(
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ): Color {
    return {
      red,
      green,
      blue,
      alpha,
    };
  }
  export function is(value: unknown): value is Color {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.red === "number" &&
      candidate.red >= 0 &&
      candidate.red <= 1 &&
      typeof candidate.green === "number" &&
      candidate.green >= 0 &&
      candidate.green <= 1 &&
      typeof candidate.blue === "number" &&
      candidate.blue >= 0 &&
      candidate.blue <= 1 &&
      typeof candidate.alpha === "number" &&
      candidate.alpha >= 0 &&
      candidate.alpha <= 1
    );
  }
}

// ------------------------------------------------------------------
// ColorInformation
// ------------------------------------------------------------------

export interface ColorInformation {
  range: Range;
  color: Color;
}
export namespace ColorInformation {
  export function create(range: Range, color: Color): ColorInformation {
    return {
      range,
      color,
    };
  }
  export function is(value: unknown): value is ColorInformation {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      Color.is(candidate.color)
    );
  }
}

// ------------------------------------------------------------------
// ColorPresentation
// ------------------------------------------------------------------

export interface ColorPresentation {
  label: string;
  textEdit?: TextEdit;
  additionalTextEdits?: TextEdit[];
}
export namespace ColorPresentation {
  export function create(
    label: string,
    textEdit?: TextEdit,
    additionalTextEdits?: TextEdit[],
  ): ColorPresentation {
    return {
      label,
      textEdit,
      additionalTextEdits,
    };
  }
  export function is(value: unknown): value is ColorPresentation {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.label === "string" &&
      (candidate.textEdit === undefined || TextEdit.is(candidate.textEdit)) &&
      (candidate.additionalTextEdits === undefined ||
        (Array.isArray(candidate.additionalTextEdits) &&
          candidate.additionalTextEdits.every(TextEdit.is)))
    );
  }
}

// ------------------------------------------------------------------
// FoldingRangeKind
// ------------------------------------------------------------------

export type FoldingRangeKind = "comment" | "imports" | "region";
export namespace FoldingRangeKind {
  export const Comment: FoldingRangeKind = "comment";
  export const Imports: FoldingRangeKind = "imports";
  export const Region: FoldingRangeKind = "region";
}

// ------------------------------------------------------------------
// FoldingRange
// ------------------------------------------------------------------

export interface FoldingRange {
  startLine: number;
  endLine: number;
  startCharacter?: number;
  endCharacter?: number;
  kind?: string;
  collapsedText?: string;
}
export namespace FoldingRange {
  export function create(
    startLine: number,
    endLine: number,
    startCharacter?: number,
    endCharacter?: number,
    kind?: string,
    collapsedText?: string,
  ): FoldingRange {
    const result: FoldingRange = {
      startLine,
      endLine,
    };
    if (startCharacter !== undefined) result.startCharacter = startCharacter;
    if (endCharacter !== undefined) result.endCharacter = endCharacter;
    if (kind !== undefined) result.kind = kind;
    if (collapsedText !== undefined) result.collapsedText = collapsedText;
    return result;
  }
  export function is(value: unknown): value is FoldingRange {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      uinteger.is(candidate.startLine) &&
      uinteger.is(candidate.endLine) &&
      (candidate.startCharacter === undefined ||
        uinteger.is(candidate.startCharacter)) &&
      (candidate.endCharacter === undefined ||
        uinteger.is(candidate.endCharacter)) &&
      (candidate.kind === undefined || typeof candidate.kind === "string")
    );
  }
}

// ------------------------------------------------------------------
// DiagnosticRelatedInformation
// ------------------------------------------------------------------

export interface DiagnosticRelatedInformation {
  location: Location;
  message: string;
}
export namespace DiagnosticRelatedInformation {
  export function create(
    location: Location,
    message: string,
  ): DiagnosticRelatedInformation {
    return {
      location,
      message,
    };
  }
  export function is(value: unknown): value is DiagnosticRelatedInformation {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Location.is(candidate.location) &&
      typeof candidate.message === "string"
    );
  }
}

// ------------------------------------------------------------------
// DiagnosticSeverity
// ------------------------------------------------------------------

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

// ------------------------------------------------------------------
// DiagnosticTag
// ------------------------------------------------------------------

export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2,
}

// ------------------------------------------------------------------
// CodeDescription
// ------------------------------------------------------------------

export interface CodeDescription {
  href: string;
}
export namespace CodeDescription {
  export function is(value: unknown): value is CodeDescription {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.href === "string"
    );
  }
}

// ------------------------------------------------------------------
// Diagnostic
// ------------------------------------------------------------------

export interface Diagnostic {
  range: Range;
  message: string;
  severity?: DiagnosticSeverity;
  code?: number | string;
  source?: string;
  relatedInformation?: DiagnosticRelatedInformation[];
}
export namespace Diagnostic {
  export function create(
    range: Range,
    message: string,
    severity?: DiagnosticSeverity,
    code?: number | string,
    source?: string,
    relatedInformation?: DiagnosticRelatedInformation[],
  ): Diagnostic {
    const result: Diagnostic = {
      range,
      message,
    };
    if (severity !== undefined) result.severity = severity;
    if (code !== undefined) result.code = code;
    if (source !== undefined) result.source = source;
    if (relatedInformation !== undefined)
      result.relatedInformation = relatedInformation;
    return result;
  }
  export function is(value: unknown): value is Diagnostic {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      typeof candidate.message === "string" &&
      (typeof candidate.severity === "number" ||
        candidate.severity === undefined) &&
      (typeof candidate.code === "number" ||
        typeof candidate.code === "string" ||
        candidate.code === undefined) &&
      (candidate.codeDescription === undefined ||
        CodeDescription.is(candidate.codeDescription)) &&
      (typeof candidate.source === "string" ||
        candidate.source === undefined) &&
      (candidate.relatedInformation === undefined ||
        (Array.isArray(candidate.relatedInformation) &&
          candidate.relatedInformation.every(DiagnosticRelatedInformation.is)))
    );
  }
}

// ------------------------------------------------------------------
// Command
// ------------------------------------------------------------------

export interface Command {
  title: string;
  command: string;
  arguments?: unknown[];
}
export namespace Command {
  export function create(
    title: string,
    command: string,
    ...args: unknown[]
  ): Command {
    const result: Command = {
      title,
      command,
    };
    if (args.length > 0) result.arguments = args;
    return result;
  }
  export function is(value: unknown): value is Command {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.title === "string" &&
      typeof candidate.command === "string"
    );
  }
}

// ------------------------------------------------------------------
// TextEdit
// ------------------------------------------------------------------

export interface TextEdit {
  range: Range;
  newText: string;
}
export namespace TextEdit {
  export function replace(range: Range, newText: string): TextEdit {
    return {
      range,
      newText,
    };
  }
  export function insert(position: Position, newText: string): TextEdit {
    return {
      range: {
        start: position,
        end: position,
      },
      newText,
    };
  }
  export function del(range: Range): TextEdit {
    return {
      range,
      newText: "",
    };
  }
  export function is(value: unknown): value is TextEdit {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.newText === "string" &&
      Range.is(candidate.range)
    );
  }
}

// ------------------------------------------------------------------
// ChangeAnnotation
// ------------------------------------------------------------------

export interface ChangeAnnotation {
  label: string;
  needsConfirmation?: boolean;
  description?: string;
}
export namespace ChangeAnnotation {
  export function create(
    label: string,
    needsConfirmation?: boolean,
    description?: string,
  ): ChangeAnnotation {
    const result: ChangeAnnotation = {
      label,
    };
    if (needsConfirmation !== undefined)
      result.needsConfirmation = needsConfirmation;
    if (description !== undefined) result.description = description;
    return result;
  }
  export function is(value: unknown): value is ChangeAnnotation {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.label === "string" &&
      (typeof candidate.needsConfirmation === "boolean" ||
        candidate.needsConfirmation === undefined) &&
      (typeof candidate.description === "string" ||
        candidate.description === undefined)
    );
  }
}

// ------------------------------------------------------------------
// ChangeAnnotationIdentifier
// ------------------------------------------------------------------

export type ChangeAnnotationIdentifier = string;
export namespace ChangeAnnotationIdentifier {
  export function is(value: unknown): value is ChangeAnnotationIdentifier {
    return typeof value === "string";
  }
}

// ------------------------------------------------------------------
// AnnotatedTextEdit
// ------------------------------------------------------------------

export interface AnnotatedTextEdit {
  range: Range;
  newText: string;
  annotationId: ChangeAnnotationIdentifier;
}
export namespace AnnotatedTextEdit {
  export function replace(
    range: Range,
    newText: string,
    annotationId: ChangeAnnotationIdentifier,
  ): AnnotatedTextEdit {
    return {
      range,
      newText,
      annotationId,
    };
  }
  export function insert(
    position: Position,
    newText: string,
    annotationId: ChangeAnnotationIdentifier,
  ): AnnotatedTextEdit {
    return {
      range: {
        start: position,
        end: position,
      },
      newText,
      annotationId,
    };
  }
  export function del(
    range: Range,
    annotationId: ChangeAnnotationIdentifier,
  ): AnnotatedTextEdit {
    return {
      range,
      newText: "",
      annotationId,
    };
  }
  export function is(value: unknown): value is AnnotatedTextEdit {
    return (
      TextEdit.is(value) &&
      (ChangeAnnotationIdentifier.is(
        (value as AnnotatedTextEdit).annotationId,
      ) ||
        ChangeAnnotation.is((value as AnnotatedTextEdit).annotationId))
    );
  }
}

// ------------------------------------------------------------------
// TextDocumentEdit
// ------------------------------------------------------------------

export interface TextDocumentEdit {
  textDocument: OptionalVersionedTextDocumentIdentifier;
  edits: (TextEdit | AnnotatedTextEdit)[];
}
export namespace TextDocumentEdit {
  export function create(
    textDocument: OptionalVersionedTextDocumentIdentifier,
    edits: (TextEdit | AnnotatedTextEdit)[],
  ): TextDocumentEdit {
    return {
      textDocument,
      edits,
    };
  }
  export function is(value: unknown): value is TextDocumentEdit {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) &&
      Array.isArray(candidate.edits)
    );
  }
}

// ------------------------------------------------------------------
// CreateFile
// ------------------------------------------------------------------

export interface CreateFile {
  kind: "create";
  uri: string;
  options?: {
    overwrite?: boolean;
    ignoreIfExists?: boolean;
  };
  annotationId?: ChangeAnnotationIdentifier;
}
export namespace CreateFile {
  export function create(
    uri: string,
    options?: {
      overwrite?: boolean;
      ignoreIfExists?: boolean;
    },
    annotationId?: ChangeAnnotationIdentifier,
  ): CreateFile {
    const result: CreateFile = {
      kind: "create",
      uri,
    };
    if (
      options !== undefined &&
      (options.overwrite !== undefined || options.ignoreIfExists !== undefined)
    ) {
      result.options = options;
    }
    if (annotationId !== undefined) result.annotationId = annotationId;
    return result;
  }
  export function is(value: unknown): value is CreateFile {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      candidate.kind === "create" &&
      typeof candidate.uri === "string" &&
      (candidate.options === undefined ||
        (((candidate.options as Record<string, unknown>).overwrite ===
          undefined ||
          typeof (candidate.options as Record<string, unknown>).overwrite ===
            "boolean") &&
          ((candidate.options as Record<string, unknown>).ignoreIfExists ===
            undefined ||
            typeof (candidate.options as Record<string, unknown>)
              .ignoreIfExists === "boolean"))) &&
      (candidate.annotationId === undefined ||
        ChangeAnnotationIdentifier.is(candidate.annotationId))
    );
  }
}

// ------------------------------------------------------------------
// RenameFile
// ------------------------------------------------------------------

export interface RenameFile {
  kind: "rename";
  oldUri: string;
  newUri: string;
  options?: {
    overwrite?: boolean;
    ignoreIfExists?: boolean;
  };
  annotationId?: ChangeAnnotationIdentifier;
}
export namespace RenameFile {
  export function create(
    oldUri: string,
    newUri: string,
    options?: {
      overwrite?: boolean;
      ignoreIfExists?: boolean;
    },
    annotationId?: ChangeAnnotationIdentifier,
  ): RenameFile {
    const result: RenameFile = {
      kind: "rename",
      oldUri,
      newUri,
    };
    if (
      options !== undefined &&
      (options.overwrite !== undefined || options.ignoreIfExists !== undefined)
    ) {
      result.options = options;
    }
    if (annotationId !== undefined) result.annotationId = annotationId;
    return result;
  }
  export function is(value: unknown): value is RenameFile {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      candidate.kind === "rename" &&
      typeof candidate.oldUri === "string" &&
      typeof candidate.newUri === "string" &&
      (candidate.options === undefined ||
        (((candidate.options as Record<string, unknown>).overwrite ===
          undefined ||
          typeof (candidate.options as Record<string, unknown>).overwrite ===
            "boolean") &&
          ((candidate.options as Record<string, unknown>).ignoreIfExists ===
            undefined ||
            typeof (candidate.options as Record<string, unknown>)
              .ignoreIfExists === "boolean"))) &&
      (candidate.annotationId === undefined ||
        ChangeAnnotationIdentifier.is(candidate.annotationId))
    );
  }
}

// ------------------------------------------------------------------
// DeleteFile
// ------------------------------------------------------------------

export interface DeleteFile {
  kind: "delete";
  uri: string;
  options?: {
    recursive?: boolean;
    ignoreIfNotExists?: boolean;
  };
  annotationId?: ChangeAnnotationIdentifier;
}
export namespace DeleteFile {
  export function create(
    uri: string,
    options?: {
      recursive?: boolean;
      ignoreIfNotExists?: boolean;
    },
    annotationId?: ChangeAnnotationIdentifier,
  ): DeleteFile {
    const result: DeleteFile = {
      kind: "delete",
      uri,
    };
    if (
      options !== undefined &&
      (options.recursive !== undefined ||
        options.ignoreIfNotExists !== undefined)
    ) {
      result.options = options;
    }
    if (annotationId !== undefined) result.annotationId = annotationId;
    return result;
  }
  export function is(value: unknown): value is DeleteFile {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      candidate.kind === "delete" &&
      typeof candidate.uri === "string" &&
      (candidate.options === undefined ||
        (((candidate.options as Record<string, unknown>).recursive ===
          undefined ||
          typeof (candidate.options as Record<string, unknown>).recursive ===
            "boolean") &&
          ((candidate.options as Record<string, unknown>).ignoreIfNotExists ===
            undefined ||
            typeof (candidate.options as Record<string, unknown>)
              .ignoreIfNotExists === "boolean"))) &&
      (candidate.annotationId === undefined ||
        ChangeAnnotationIdentifier.is(candidate.annotationId))
    );
  }
}

// ------------------------------------------------------------------
// WorkspaceEdit
// ------------------------------------------------------------------

export interface WorkspaceEdit {
  changes?: Record<string, TextEdit[]>;
  documentChanges?: (TextDocumentEdit | CreateFile | RenameFile | DeleteFile)[];
  changeAnnotations?: Record<string, ChangeAnnotation>;
}
export namespace WorkspaceEdit {
  export function is(value: unknown): value is WorkspaceEdit {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      (candidate.changes !== undefined ||
        candidate.documentChanges !== undefined) &&
      (candidate.documentChanges === undefined ||
        (Array.isArray(candidate.documentChanges) &&
          candidate.documentChanges.every((item) =>
            typeof (item as Record<string, unknown>).kind === "string"
              ? CreateFile.is(item) ||
                RenameFile.is(item) ||
                DeleteFile.is(item)
              : TextDocumentEdit.is(item),
          )))
    );
  }
}

// ------------------------------------------------------------------
// TextEditChange
// ------------------------------------------------------------------

class TextEditChangeImpl {
  private edits: (TextEdit | AnnotatedTextEdit)[];
  private changeAnnotations?: ChangeAnnotations;
  constructor(
    edits: (TextEdit | AnnotatedTextEdit)[],
    changeAnnotations?: ChangeAnnotations,
  ) {
    this.edits = edits;
    this.changeAnnotations = changeAnnotations;
  }
  insert(
    position: Position,
    newText: string,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    let edit: TextEdit | AnnotatedTextEdit;
    let id: ChangeAnnotationIdentifier | undefined;
    if (annotation === undefined) {
      edit = TextEdit.insert(position, newText);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.insert(position, newText, annotation);
    } else {
      this.assertChangeAnnotations();
      id = this.changeAnnotations!.manage(annotation);
      edit = AnnotatedTextEdit.insert(position, newText, id);
    }
    this.edits.push(edit);
    return id;
  }
  replace(
    range: Range,
    newText: string,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    let edit: TextEdit | AnnotatedTextEdit;
    let id: ChangeAnnotationIdentifier | undefined;
    if (annotation === undefined) {
      edit = TextEdit.replace(range, newText);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.replace(range, newText, annotation);
    } else {
      this.assertChangeAnnotations();
      id = this.changeAnnotations!.manage(annotation);
      edit = AnnotatedTextEdit.replace(range, newText, id);
    }
    this.edits.push(edit);
    return id;
  }
  delete(
    range: Range,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    let edit: TextEdit | AnnotatedTextEdit;
    let id: ChangeAnnotationIdentifier | undefined;
    if (annotation === undefined) {
      edit = TextEdit.del(range);
    } else if (ChangeAnnotationIdentifier.is(annotation)) {
      id = annotation;
      edit = AnnotatedTextEdit.del(range, annotation);
    } else {
      this.assertChangeAnnotations();
      id = this.changeAnnotations!.manage(annotation);
      edit = AnnotatedTextEdit.del(range, id);
    }
    this.edits.push(edit);
    return id;
  }
  add(edit: TextEdit | AnnotatedTextEdit): void {
    this.edits.push(edit);
  }
  all(): (TextEdit | AnnotatedTextEdit)[] {
    return this.edits;
  }
  clear(): void {
    this.edits.splice(0, this.edits.length);
  }
  private assertChangeAnnotations(): void {
    if (this.changeAnnotations === undefined) {
      throw new Error(
        "Text edit change is not configured to manage change annotations.",
      );
    }
  }
}
export type TextEditChange = TextEditChangeImpl;

// ------------------------------------------------------------------
// ChangeAnnotations
// ------------------------------------------------------------------

class ChangeAnnotationsImpl {
  private _annotations: Record<string, ChangeAnnotation>;
  private _counter = 0;
  private _size = 0;
  constructor(annotations?: Record<string, ChangeAnnotation>) {
    this._annotations =
      annotations === undefined ? Object.create(null) : annotations;
  }
  all(): Record<string, ChangeAnnotation> {
    return this._annotations;
  }
  get size(): number {
    return this._size;
  }
  manage(
    id: ChangeAnnotation | ChangeAnnotationIdentifier,
    annotation?: ChangeAnnotation,
  ): ChangeAnnotationIdentifier {
    let resultId: ChangeAnnotationIdentifier;
    if (ChangeAnnotationIdentifier.is(id)) {
      resultId = id;
    } else {
      resultId = this.nextId();
      annotation = id;
    }
    if (this._annotations[resultId] !== undefined) {
      throw new Error(`Id ${resultId} is already in use.`);
    }
    if (annotation === undefined) {
      throw new Error(`No annotation provided for id ${resultId}`);
    }
    this._annotations[resultId] = annotation;
    this._size++;
    return resultId;
  }
  private nextId(): ChangeAnnotationIdentifier {
    this._counter++;
    return this._counter.toString();
  }
}
export type ChangeAnnotations = ChangeAnnotationsImpl;

// ------------------------------------------------------------------
// WorkspaceChange
// ------------------------------------------------------------------

export class WorkspaceChange {
  private _workspaceEdit: WorkspaceEdit;
  private _textEditChanges: Record<string, TextEditChange> =
    Object.create(null);
  private _changeAnnotations?: ChangeAnnotations;
  constructor(workspaceEdit?: WorkspaceEdit) {
    if (workspaceEdit === undefined) {
      this._workspaceEdit = {};
    } else {
      this._workspaceEdit = workspaceEdit;
      if (workspaceEdit.documentChanges) {
        this._changeAnnotations = new ChangeAnnotationsImpl(
          workspaceEdit.changeAnnotations,
        );
        workspaceEdit.changeAnnotations = this._changeAnnotations.all();
        workspaceEdit.documentChanges.forEach((item) => {
          if (TextDocumentEdit.is(item)) {
            const textEditChange = new TextEditChangeImpl(
              item.edits,
              this._changeAnnotations,
            );
            this._textEditChanges[item.textDocument.uri] = textEditChange;
          }
        });
      } else if (workspaceEdit.changes) {
        Object.keys(workspaceEdit.changes).forEach((key) => {
          const textEditChange = new TextEditChangeImpl(
            workspaceEdit.changes![key],
          );
          this._textEditChanges[key] = textEditChange;
        });
      }
    }
  }
  get edit(): WorkspaceEdit {
    this.initDocumentChanges();
    if (this._changeAnnotations !== undefined) {
      if (this._changeAnnotations.size === 0) {
        this._workspaceEdit.changeAnnotations = undefined;
      } else {
        this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
      }
    }
    return this._workspaceEdit;
  }
  getTextEditChange(
    textDocument: OptionalVersionedTextDocumentIdentifier | string,
  ): TextEditChange {
    if (OptionalVersionedTextDocumentIdentifier.is(textDocument)) {
      this.initDocumentChanges();
      if (this._workspaceEdit.documentChanges === undefined) {
        throw new Error(
          "Workspace edit is not configured for document changes.",
        );
      }
      let textEditChange = this._textEditChanges[textDocument.uri];
      if (!textEditChange) {
        const edits: TextEdit[] = [];
        const documentChange: TextDocumentEdit = {
          textDocument: {
            uri: textDocument.uri,
            version: textDocument.version,
          },
          edits,
        };
        this._workspaceEdit.documentChanges.push(documentChange);
        textEditChange = new TextEditChangeImpl(edits, this._changeAnnotations);
        this._textEditChanges[textDocument.uri] = textEditChange;
      }
      return textEditChange;
    } else {
      this.initChanges();
      if (this._workspaceEdit.changes === undefined) {
        throw new Error(
          "Workspace edit is not configured for normal text edit changes.",
        );
      }
      let textEditChange = this._textEditChanges[textDocument];
      if (!textEditChange) {
        const edits: TextEdit[] = [];
        this._workspaceEdit.changes[textDocument] = edits;
        textEditChange = new TextEditChangeImpl(edits);
        this._textEditChanges[textDocument] = textEditChange;
      }
      return textEditChange;
    }
  }
  private initDocumentChanges(): void {
    if (
      this._workspaceEdit.documentChanges === undefined &&
      this._workspaceEdit.changes === undefined
    ) {
      this._changeAnnotations = new ChangeAnnotationsImpl();
      this._workspaceEdit.documentChanges = [];
      this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
    }
  }
  private initChanges(): void {
    if (
      this._workspaceEdit.documentChanges === undefined &&
      this._workspaceEdit.changes === undefined
    ) {
      this._workspaceEdit.changes = Object.create(null);
    }
  }
  createFile(
    uri: string,
    optionsOrAnnotation?:
      | {
          overwrite?: boolean;
          ignoreIfExists?: boolean;
        }
      | ChangeAnnotation
      | ChangeAnnotationIdentifier,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === undefined) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    let options:
      | {
          overwrite?: boolean;
          ignoreIfExists?: boolean;
        }
      | undefined;
    let optionsAnnotation: ChangeAnnotationIdentifier | undefined;
    if (
      ChangeAnnotation.is(optionsOrAnnotation) ||
      ChangeAnnotationIdentifier.is(optionsOrAnnotation)
    ) {
      optionsAnnotation = ChangeAnnotationIdentifier.is(optionsOrAnnotation)
        ? optionsOrAnnotation
        : this._changeAnnotations!.manage(optionsOrAnnotation);
    } else {
      options = optionsOrAnnotation;
    }
    let createFile: CreateFile;
    let resultAnnotation: ChangeAnnotationIdentifier | undefined;
    if (optionsAnnotation === undefined) {
      createFile = CreateFile.create(uri, options);
    } else {
      resultAnnotation = optionsAnnotation;
      createFile = CreateFile.create(uri, options, optionsAnnotation);
    }
    this._workspaceEdit.documentChanges.push(createFile);
    return resultAnnotation;
  }
  renameFile(
    oldUri: string,
    newUri: string,
    optionsOrAnnotation?:
      | {
          overwrite?: boolean;
          ignoreIfExists?: boolean;
        }
      | ChangeAnnotation
      | ChangeAnnotationIdentifier,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === undefined) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    let options:
      | {
          overwrite?: boolean;
          ignoreIfExists?: boolean;
        }
      | undefined;
    let optionsAnnotation: ChangeAnnotationIdentifier | undefined;
    if (
      ChangeAnnotation.is(optionsOrAnnotation) ||
      ChangeAnnotationIdentifier.is(optionsOrAnnotation)
    ) {
      optionsAnnotation = ChangeAnnotationIdentifier.is(optionsOrAnnotation)
        ? optionsOrAnnotation
        : this._changeAnnotations!.manage(optionsOrAnnotation);
    } else {
      options = optionsOrAnnotation;
    }
    let renameFile: RenameFile;
    let resultAnnotation: ChangeAnnotationIdentifier | undefined;
    if (optionsAnnotation === undefined) {
      renameFile = RenameFile.create(oldUri, newUri, options);
    } else {
      resultAnnotation = optionsAnnotation;
      renameFile = RenameFile.create(
        oldUri,
        newUri,
        options,
        optionsAnnotation,
      );
    }
    this._workspaceEdit.documentChanges.push(renameFile);
    return resultAnnotation;
  }
  deleteFile(
    uri: string,
    optionsOrAnnotation?:
      | {
          recursive?: boolean;
          ignoreIfNotExists?: boolean;
        }
      | ChangeAnnotation
      | ChangeAnnotationIdentifier,
    annotation?: ChangeAnnotation | ChangeAnnotationIdentifier,
  ): ChangeAnnotationIdentifier | undefined {
    this.initDocumentChanges();
    if (this._workspaceEdit.documentChanges === undefined) {
      throw new Error("Workspace edit is not configured for document changes.");
    }
    let options:
      | {
          recursive?: boolean;
          ignoreIfNotExists?: boolean;
        }
      | undefined;
    let optionsAnnotation: ChangeAnnotationIdentifier | undefined;
    if (
      ChangeAnnotation.is(optionsOrAnnotation) ||
      ChangeAnnotationIdentifier.is(optionsOrAnnotation)
    ) {
      optionsAnnotation = ChangeAnnotationIdentifier.is(optionsOrAnnotation)
        ? optionsOrAnnotation
        : this._changeAnnotations!.manage(optionsOrAnnotation);
    } else {
      options = optionsOrAnnotation;
    }
    let deleteFile: DeleteFile;
    let resultAnnotation: ChangeAnnotationIdentifier | undefined;
    if (optionsAnnotation === undefined) {
      deleteFile = DeleteFile.create(uri, options);
    } else {
      resultAnnotation = optionsAnnotation;
      deleteFile = DeleteFile.create(uri, options, optionsAnnotation);
    }
    this._workspaceEdit.documentChanges.push(deleteFile);
    return resultAnnotation;
  }
}

// ------------------------------------------------------------------
// TextDocumentIdentifier
// ------------------------------------------------------------------

export interface TextDocumentIdentifier {
  uri: string;
}
export namespace TextDocumentIdentifier {
  export function create(uri: string): TextDocumentIdentifier {
    return {
      uri,
    };
  }
  export function is(value: unknown): value is TextDocumentIdentifier {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string"
    );
  }
}

// ------------------------------------------------------------------
// VersionedTextDocumentIdentifier
// ------------------------------------------------------------------

export interface VersionedTextDocumentIdentifier {
  uri: string;
  version: number;
}
export namespace VersionedTextDocumentIdentifier {
  export function create(
    uri: string,
    version: number,
  ): VersionedTextDocumentIdentifier {
    return {
      uri,
      version,
    };
  }
  export function is(value: unknown): value is VersionedTextDocumentIdentifier {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string" &&
      integer.is(candidate.version)
    );
  }
}

// ------------------------------------------------------------------
// OptionalVersionedTextDocumentIdentifier
// ------------------------------------------------------------------

export interface OptionalVersionedTextDocumentIdentifier {
  uri: string;
  version: number | null;
}
export namespace OptionalVersionedTextDocumentIdentifier {
  export function create(
    uri: string,
    version: number | null,
  ): OptionalVersionedTextDocumentIdentifier {
    return {
      uri,
      version,
    };
  }
  export function is(
    value: unknown,
  ): value is OptionalVersionedTextDocumentIdentifier {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string" &&
      (candidate.version === null || integer.is(candidate.version))
    );
  }
}

// ------------------------------------------------------------------
// TextDocumentItem
// ------------------------------------------------------------------

export interface TextDocumentItem {
  uri: string;
  languageId: string;
  version: number;
  text: string;
}
export namespace TextDocumentItem {
  export function create(
    uri: string,
    languageId: string,
    version: number,
    text: string,
  ): TextDocumentItem {
    return {
      uri,
      languageId,
      version,
      text,
    };
  }
  export function is(value: unknown): value is TextDocumentItem {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string" &&
      typeof candidate.languageId === "string" &&
      integer.is(candidate.version) &&
      typeof candidate.text === "string"
    );
  }
}

// ------------------------------------------------------------------
// MarkupKind
// ------------------------------------------------------------------

export type MarkupKind = "plaintext" | "markdown";
export namespace MarkupKind {
  export const PlainText: MarkupKind = "plaintext";
  export const Markdown: MarkupKind = "markdown";
  export function is(value: unknown): value is MarkupKind {
    return value === PlainText || value === Markdown;
  }
}

// ------------------------------------------------------------------
// MarkupContent
// ------------------------------------------------------------------

export interface MarkupContent {
  kind: MarkupKind;
  value: string;
}
export namespace MarkupContent {
  export function is(value: unknown): value is MarkupContent {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      MarkupKind.is(candidate.kind) &&
      typeof candidate.value === "string"
    );
  }
}

// ------------------------------------------------------------------
// CompletionItemKind
// ------------------------------------------------------------------

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25,
}

// ------------------------------------------------------------------
// InsertTextFormat
// ------------------------------------------------------------------

export enum InsertTextFormat {
  PlainText = 1,
  Snippet = 2,
}

// ------------------------------------------------------------------
// CompletionItemTag
// ------------------------------------------------------------------

export enum CompletionItemTag {
  Deprecated = 1,
}

// ------------------------------------------------------------------
// InsertReplaceEdit
// ------------------------------------------------------------------

export interface InsertReplaceEdit {
  newText: string;
  insert: Range;
  replace: Range;
}
export namespace InsertReplaceEdit {
  export function create(
    newText: string,
    insert: Range,
    replace: Range,
  ): InsertReplaceEdit {
    return {
      newText,
      insert,
      replace,
    };
  }
  export function is(value: unknown): value is InsertReplaceEdit {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.newText === "string" &&
      Range.is(candidate.insert) &&
      Range.is(candidate.replace)
    );
  }
}

// ------------------------------------------------------------------
// InsertTextMode
// ------------------------------------------------------------------

export enum InsertTextMode {
  asIs = 1,
  adjustIndentation = 2,
}

// ------------------------------------------------------------------
// CompletionItemLabelDetails
// ------------------------------------------------------------------

export interface CompletionItemLabelDetails {
  detail?: string;
  description?: string;
}
export namespace CompletionItemLabelDetails {
  export function is(value: unknown): value is CompletionItemLabelDetails {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      (typeof candidate.detail === "string" ||
        candidate.detail === undefined) &&
      (typeof candidate.description === "string" ||
        candidate.description === undefined)
    );
  }
}

// ------------------------------------------------------------------
// CompletionItem
// ------------------------------------------------------------------

export interface CompletionItem {
  label: string;
}
export namespace CompletionItem {
  export function create(label: string): CompletionItem {
    return {
      label,
    };
  }
}

// ------------------------------------------------------------------
// CompletionList
// ------------------------------------------------------------------

export interface CompletionList {
  items: CompletionItem[];
  isIncomplete?: boolean;
}
export namespace CompletionList {
  export function create(
    items?: CompletionItem[],
    isIncomplete?: boolean,
  ): CompletionList {
    return {
      items: items || [],
      isIncomplete: !!isIncomplete,
    };
  }
}

// ------------------------------------------------------------------
// MarkedString
// ------------------------------------------------------------------

export type MarkedString =
  | string
  | {
      language: string;
      value: string;
    };
export namespace MarkedString {
  export function fromPlainText(plainText: string): string {
    return plainText.replace(/[\\`*_{}[\]()#+-.!]/g, "\\$&");
  }
  export function is(value: unknown): value is MarkedString {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      typeof value === "string" ||
      (!!candidate &&
        typeof candidate === "object" &&
        typeof candidate.language === "string" &&
        typeof candidate.value === "string")
    );
  }
}

// ------------------------------------------------------------------
// Hover
// ------------------------------------------------------------------

export interface Hover {
  contents: MarkupContent | MarkedString | MarkedString[];
  range?: Range;
}
export namespace Hover {
  export function is(value: unknown): value is Hover {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      (MarkupContent.is(candidate.contents) ||
        MarkedString.is(candidate.contents) ||
        (Array.isArray(candidate.contents) &&
          candidate.contents.every(MarkedString.is))) &&
      (candidate.range === undefined || Range.is(candidate.range))
    );
  }
}

// ------------------------------------------------------------------
// ParameterInformation
// ------------------------------------------------------------------

export interface ParameterInformation {
  label: string;
  documentation?: string | MarkupContent;
}
export namespace ParameterInformation {
  export function create(
    label: string,
    documentation?: string | MarkupContent,
  ): ParameterInformation {
    return documentation
      ? {
          label,
          documentation,
        }
      : {
          label,
        };
  }
}

// ------------------------------------------------------------------
// SignatureInformation
// ------------------------------------------------------------------

export interface SignatureInformation {
  label: string;
  documentation?: string | MarkupContent;
  parameters?: ParameterInformation[];
}
export namespace SignatureInformation {
  export function create(
    label: string,
    documentation?: string | MarkupContent,
    ...parameters: ParameterInformation[]
  ): SignatureInformation {
    const result: SignatureInformation = {
      label,
    };
    if (documentation !== undefined) result.documentation = documentation;
    if (parameters.length > 0) {
      result.parameters = parameters;
    } else {
      result.parameters = [];
    }
    return result;
  }
}

// ------------------------------------------------------------------
// DocumentHighlightKind
// ------------------------------------------------------------------

export enum DocumentHighlightKind {
  Text = 1,
  Read = 2,
  Write = 3,
}

// ------------------------------------------------------------------
// DocumentHighlight
// ------------------------------------------------------------------

export interface DocumentHighlight {
  range: Range;
  kind?: number;
}
export namespace DocumentHighlight {
  export function create(range: Range, kind?: number): DocumentHighlight {
    const result: DocumentHighlight = {
      range,
    };
    if (kind !== undefined) result.kind = kind;
    return result;
  }
}

// ------------------------------------------------------------------
// SymbolKind
// ------------------------------------------------------------------

export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26,
}

// ------------------------------------------------------------------
// SymbolTag
// ------------------------------------------------------------------

export enum SymbolTag {
  Deprecated = 1,
}

// ------------------------------------------------------------------
// SymbolInformation
// ------------------------------------------------------------------

export interface SymbolInformation {
  name: string;
  kind: SymbolKind;
  location: Location;
  containerName?: string;
}
export namespace SymbolInformation {
  export function create(
    name: string,
    kind: SymbolKind,
    location: Location,
    containerName?: string,
  ): SymbolInformation {
    const result: SymbolInformation = {
      name,
      kind,
      location,
    };
    if (containerName) result.containerName = containerName;
    return result;
  }
}

// ------------------------------------------------------------------
// WorkspaceSymbol
// ------------------------------------------------------------------

export interface WorkspaceSymbol {
  name: string;
  kind: SymbolKind;
  location:
    | Location
    | {
        uri: string;
        range?: Range;
      };
}
export namespace WorkspaceSymbol {
  export function create(
    name: string,
    kind: SymbolKind,
    location:
      | Location
      | {
          uri: string;
          range?: Range;
        },
    containerName?: string,
  ): WorkspaceSymbol {
    return {
      name,
      kind,
      location,
    };
  }
}

// ------------------------------------------------------------------
// DocumentSymbol
// ------------------------------------------------------------------

export interface DocumentSymbol {
  name: string;
  detail?: string;
  kind: SymbolKind;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
}
export namespace DocumentSymbol {
  export function create(
    name: string,
    detail: string | undefined,
    kind: SymbolKind,
    range: Range,
    selectionRange: Range,
    children?: DocumentSymbol[],
  ): DocumentSymbol {
    const result: DocumentSymbol = {
      name,
      detail,
      kind,
      range,
      selectionRange,
    };
    if (children !== undefined) result.children = children;
    return result;
  }
  export function is(value: unknown): value is DocumentSymbol {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.name === "string" &&
      typeof candidate.kind === "number" &&
      Range.is(candidate.range) &&
      Range.is(candidate.selectionRange) &&
      (candidate.detail === undefined ||
        typeof candidate.detail === "string") &&
      (candidate.deprecated === undefined ||
        typeof candidate.deprecated === "boolean") &&
      (candidate.children === undefined || Array.isArray(candidate.children)) &&
      (candidate.tags === undefined || Array.isArray(candidate.tags))
    );
  }
}

// ------------------------------------------------------------------
// CodeActionKind
// ------------------------------------------------------------------

export namespace CodeActionKind {
  export const Empty = "";
  export const QuickFix = "quickfix";
  export const Refactor = "refactor";
  export const RefactorExtract = "refactor.extract";
  export const RefactorInline = "refactor.inline";
  export const RefactorRewrite = "refactor.rewrite";
  export const Source = "source";
  export const SourceOrganizeImports = "source.organizeImports";
  export const SourceFixAll = "source.fixAll";
}
export type CodeActionKind = string;

// ------------------------------------------------------------------
// CodeActionTriggerKind
// ------------------------------------------------------------------

export enum CodeActionTriggerKind {
  Invoked = 1,
  Automatic = 2,
}

// ------------------------------------------------------------------
// CodeActionContext
// ------------------------------------------------------------------

export interface CodeActionContext {
  diagnostics: Diagnostic[];
  only?: CodeActionKind[];
  triggerKind?: CodeActionTriggerKind;
}
export namespace CodeActionContext {
  export function create(
    diagnostics: Diagnostic[],
    only?: CodeActionKind[],
    triggerKind?: CodeActionTriggerKind,
  ): CodeActionContext {
    const result: CodeActionContext = {
      diagnostics,
    };
    if (only !== undefined) result.only = only;
    if (triggerKind !== undefined) result.triggerKind = triggerKind;
    return result;
  }
  export function is(value: unknown): value is CodeActionContext {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Array.isArray(candidate.diagnostics) &&
      candidate.diagnostics.every(Diagnostic.is) &&
      (candidate.only === undefined ||
        (Array.isArray(candidate.only) &&
          candidate.only.every((item) => typeof item === "string"))) &&
      (candidate.triggerKind === undefined ||
        candidate.triggerKind === CodeActionTriggerKind.Invoked ||
        candidate.triggerKind === CodeActionTriggerKind.Automatic)
    );
  }
}

// ------------------------------------------------------------------
// CodeAction
// ------------------------------------------------------------------

export interface CodeAction {
  title: string;
  kind?: CodeActionKind;
  diagnostics?: Diagnostic[];
  edit?: WorkspaceEdit;
  command?: Command;
  isPreferred?: boolean;
}
export namespace CodeAction {
  export function create(
    title: string,
    kindOrCommand?: CodeActionKind | Command,
    kind?: CodeActionKind,
  ): CodeAction {
    const result: CodeAction = {
      title,
    };
    let hasKind = true;
    if (typeof kindOrCommand === "string") {
      hasKind = false;
      result.kind = kindOrCommand;
    } else if (Command.is(kindOrCommand)) {
      result.command = kindOrCommand;
    } else {
      result.edit = kindOrCommand;
    }
    if (hasKind && kind !== undefined) {
      result.kind = kind;
    }
    return result;
  }
  export function is(value: unknown): value is CodeAction {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.title === "string" &&
      (candidate.diagnostics === undefined ||
        (Array.isArray(candidate.diagnostics) &&
          candidate.diagnostics.every(Diagnostic.is))) &&
      (candidate.kind === undefined || typeof candidate.kind === "string") &&
      (candidate.edit !== undefined || candidate.command !== undefined) &&
      (candidate.command === undefined || Command.is(candidate.command)) &&
      (candidate.isPreferred === undefined ||
        typeof candidate.isPreferred === "boolean") &&
      (candidate.edit === undefined || WorkspaceEdit.is(candidate.edit))
    );
  }
}

// ------------------------------------------------------------------
// CodeLens
// ------------------------------------------------------------------

export interface CodeLens {
  range: Range;
  command?: Command;
  data?: unknown;
}
export namespace CodeLens {
  export function create(
    range: Range,
    command?: Command,
    data?: unknown,
  ): CodeLens {
    const result: CodeLens = {
      range,
    };
    if (command !== undefined) result.command = command;
    if (data !== undefined) result.data = data;
    return result;
  }
  export function is(value: unknown): value is CodeLens {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      (candidate.command === undefined || Command.is(candidate.command))
    );
  }
}

// ------------------------------------------------------------------
// FormattingOptions
// ------------------------------------------------------------------

export interface FormattingOptions {
  tabSize: number;
  insertSpaces: boolean;
}
export namespace FormattingOptions {
  export function create(
    tabSize: number,
    insertSpaces: boolean,
  ): FormattingOptions {
    return {
      tabSize,
      insertSpaces,
    };
  }
  export function is(value: unknown): value is FormattingOptions {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      uinteger.is(candidate.tabSize) &&
      typeof candidate.insertSpaces === "boolean"
    );
  }
}

// ------------------------------------------------------------------
// DocumentLink
// ------------------------------------------------------------------

export interface DocumentLink {
  range: Range;
  target?: string;
  data?: unknown;
}
export namespace DocumentLink {
  export function create(
    range: Range,
    target?: string,
    data?: unknown,
  ): DocumentLink {
    return {
      range,
      target,
      data,
    };
  }
  export function is(value: unknown): value is DocumentLink {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      (candidate.target === undefined || typeof candidate.target === "string")
    );
  }
}

// ------------------------------------------------------------------
// SelectionRange
// ------------------------------------------------------------------

export interface SelectionRange {
  range: Range;
  parent?: SelectionRange;
}
export namespace SelectionRange {
  export function create(
    range: Range,
    parent?: SelectionRange,
  ): SelectionRange {
    return {
      range,
      parent,
    };
  }
  export function is(value: unknown): value is SelectionRange {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      (candidate.parent === undefined || SelectionRange.is(candidate.parent))
    );
  }
}

// ------------------------------------------------------------------
// SemanticTokenTypes
// ------------------------------------------------------------------

export namespace SemanticTokenTypes {
  export const _class = "class";
  export const _enum = "enum";
  export const _interface = "interface";
  export const _struct = "struct";
  export const _function = "function";
  export const _typeof = "typeof";
  export const namespace_ = "namespace";
  export const type_ = "type";
  export const typeParameter = "typeParameter";
  export const parameter = "parameter";
  export const variable = "variable";
  export const property = "property";
  export const enumMember = "enumMember";
  export const event = "event";
  export const method = "method";
  export const macro = "macro";
  export const keyword = "keyword";
  export const modifier = "modifier";
  export const comment = "comment";
  export const string = "string";
  export const number = "number";
  export const regexp = "regexp";
  export const operator = "operator";
  export const decorator = "decorator";
}

// ------------------------------------------------------------------
// SemanticTokenModifiers
// ------------------------------------------------------------------

export namespace SemanticTokenModifiers {
  export const declaration = "declaration";
  export const definition = "definition";
  export const readonly_ = "readonly";
  export const static_ = "static";
  export const deprecated = "deprecated";
  export const abstract_ = "abstract";
  export const async_ = "async";
  export const modification = "modification";
  export const documentation = "documentation";
  export const defaultLibrary = "defaultLibrary";
}

// ------------------------------------------------------------------
// SemanticTokens
// ------------------------------------------------------------------

export interface SemanticTokens {
  resultId?: string;
  data: number[];
}
export namespace SemanticTokens {
  export function is(value: unknown): value is SemanticTokens {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      (candidate.resultId === undefined ||
        typeof candidate.resultId === "string") &&
      Array.isArray(candidate.data) &&
      (candidate.data.length === 0 || typeof candidate.data[0] === "number")
    );
  }
}

// ------------------------------------------------------------------
// InlineValueText
// ------------------------------------------------------------------

export interface InlineValueText {
  range: Range;
  text: string;
}
export namespace InlineValueText {
  export function create(range: Range, text: string): InlineValueText {
    return {
      range,
      text,
    };
  }
  export function is(value: unknown): value is InlineValueText {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      typeof candidate.text === "string"
    );
  }
}

// ------------------------------------------------------------------
// InlineValueVariableLookup
// ------------------------------------------------------------------

export interface InlineValueVariableLookup {
  range: Range;
  variableName?: string;
  caseSensitiveLookup: boolean;
}
export namespace InlineValueVariableLookup {
  export function create(
    range: Range,
    variableName: string | undefined,
    caseSensitiveLookup: boolean,
  ): InlineValueVariableLookup {
    return {
      range,
      variableName,
      caseSensitiveLookup,
    };
  }
  export function is(value: unknown): value is InlineValueVariableLookup {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      typeof candidate.caseSensitiveLookup === "boolean" &&
      (typeof candidate.variableName === "string" ||
        candidate.variableName === undefined)
    );
  }
}

// ------------------------------------------------------------------
// InlineValueEvaluatableExpression
// ------------------------------------------------------------------

export interface InlineValueEvaluatableExpression {
  range: Range;
  expression?: string;
}
export namespace InlineValueEvaluatableExpression {
  export function create(
    range: Range,
    expression?: string,
  ): InlineValueEvaluatableExpression {
    return {
      range,
      expression,
    };
  }
  export function is(
    value: unknown,
  ): value is InlineValueEvaluatableExpression {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is(candidate.range) &&
      (typeof candidate.expression === "string" ||
        candidate.expression === undefined)
    );
  }
}

// ------------------------------------------------------------------
// InlineValueContext
// ------------------------------------------------------------------

export interface InlineValueContext {
  frameId: number;
  stoppedLocation: Range;
}
export namespace InlineValueContext {
  export function create(
    frameId: number,
    stoppedLocation: Range,
  ): InlineValueContext {
    return {
      frameId,
      stoppedLocation,
    };
  }
  export function is(value: unknown): value is InlineValueContext {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      Range.is((candidate as Record<string, unknown>).stoppedLocation)
    );
  }
}

// ------------------------------------------------------------------
// InlayHintKind
// ------------------------------------------------------------------

export enum InlayHintKind {
  Type = 1,
  Parameter = 2,
}
export namespace InlayHintKind {
  export function is(value: unknown): value is InlayHintKind {
    return value === 1 || value === 2;
  }
}

// ------------------------------------------------------------------
// InlayHintLabelPart
// ------------------------------------------------------------------

export interface InlayHintLabelPart {
  value: string;
  tooltip?: string | MarkupContent;
  location?: Location;
  command?: Command;
}
export namespace InlayHintLabelPart {
  export function create(value: string): InlayHintLabelPart {
    return {
      value,
    };
  }
  export function is(value: unknown): value is InlayHintLabelPart {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      (candidate.tooltip === undefined ||
        typeof candidate.tooltip === "string" ||
        MarkupContent.is(candidate.tooltip)) &&
      (candidate.location === undefined || Location.is(candidate.location)) &&
      (candidate.command === undefined || Command.is(candidate.command))
    );
  }
}

// ------------------------------------------------------------------
// InlayHint
// ------------------------------------------------------------------

export interface InlayHint {
  position: Position;
  label: string | InlayHintLabelPart[];
  kind?: InlayHintKind;
  textEdits?: TextEdit[];
  tooltip?: string | MarkupContent;
  paddingLeft?: boolean;
  paddingRight?: boolean;
}
export namespace InlayHint {
  export function create(
    position: Position,
    label: string | InlayHintLabelPart[],
    kind?: InlayHintKind,
  ): InlayHint {
    const result: InlayHint = {
      position,
      label,
    };
    if (kind !== undefined) result.kind = kind;
    return result;
  }
  export function is(value: unknown): value is InlayHint {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      (!!candidate &&
        typeof candidate === "object" &&
        Position.is(candidate.position) &&
        (typeof candidate.label === "string" ||
          (Array.isArray(candidate.label) &&
            candidate.label.every(InlayHintLabelPart.is))) &&
        (candidate.kind === undefined || InlayHintKind.is(candidate.kind)) &&
        candidate.textEdits === undefined) ||
      (Array.isArray(candidate!.textEdits) &&
        candidate!.textEdits.every(TextEdit.is) &&
        (candidate!.tooltip === undefined ||
          typeof candidate!.tooltip === "string" ||
          MarkupContent.is(candidate!.tooltip)) &&
        (candidate!.paddingLeft === undefined ||
          typeof candidate!.paddingLeft === "boolean") &&
        (candidate!.paddingRight === undefined ||
          typeof candidate!.paddingRight === "boolean"))
    );
  }
}

// ------------------------------------------------------------------
// StringValue
// ------------------------------------------------------------------

export namespace StringValue {
  export function createSnippet(value: string): {
    kind: "snippet";
    value: string;
  } {
    return {
      kind: "snippet",
      value,
    };
  }
}

// ------------------------------------------------------------------
// InlineCompletionItem
// ------------------------------------------------------------------

export interface InlineCompletionItem {
  insertText: string;
  filterText?: string;
  range?: Range;
  command?: Command;
}
export namespace InlineCompletionItem {
  export function create(
    insertText: string,
    filterText?: string,
    range?: Range,
    command?: Command,
  ): InlineCompletionItem {
    return {
      insertText,
      filterText,
      range,
      command,
    };
  }
}

// ------------------------------------------------------------------
// InlineCompletionList
// ------------------------------------------------------------------

export interface InlineCompletionList {
  items: InlineCompletionItem[];
}
export namespace InlineCompletionList {
  export function create(items: InlineCompletionItem[]): InlineCompletionList {
    return {
      items,
    };
  }
}

// ------------------------------------------------------------------
// InlineCompletionTriggerKind
// ------------------------------------------------------------------

export enum InlineCompletionTriggerKind {
  Invoked = 0,
  Automatic = 1,
}

// ------------------------------------------------------------------
// SelectedCompletionInfo
// ------------------------------------------------------------------

export interface SelectedCompletionInfo {
  range: Range;
  text: string;
}
export namespace SelectedCompletionInfo {
  export function create(range: Range, text: string): SelectedCompletionInfo {
    return {
      range,
      text,
    };
  }
}

// ------------------------------------------------------------------
// InlineCompletionContext
// ------------------------------------------------------------------

export interface InlineCompletionContext {
  triggerKind: InlineCompletionTriggerKind;
  selectedCompletionInfo?: SelectedCompletionInfo;
}
export namespace InlineCompletionContext {
  export function create(
    triggerKind: InlineCompletionTriggerKind,
    selectedCompletionInfo?: SelectedCompletionInfo,
  ): InlineCompletionContext {
    return {
      triggerKind,
      selectedCompletionInfo,
    };
  }
}

// ------------------------------------------------------------------
// WorkspaceFolder
// ------------------------------------------------------------------

export interface WorkspaceFolder {
  uri: string;
  name: string;
}
export namespace WorkspaceFolder {
  export function is(value: unknown): value is WorkspaceFolder {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string" &&
      typeof candidate.name === "string"
    );
  }
}

// ------------------------------------------------------------------
// EOL
// ------------------------------------------------------------------

export const EOL: string[] = ["\n", "\r\n", "\r"];

// ------------------------------------------------------------------
// TextDocument (full implementation with incremental updates)
// ------------------------------------------------------------------

export interface TextDocument {
  uri: string;
  languageId: string;
  version: number;
  getText(range?: Range): string;
  positionAt(offset: number): Position;
  offsetAt(position: Position): number;
  readonly lineCount: number;
}
class FullTextDocument implements TextDocument {
  private _uri: string;
  private _languageId: string;
  private _version: number;
  private _content: string;
  private _lineOffsets: number[] | undefined;
  constructor(
    uri: string,
    languageId: string,
    version: number,
    content: string,
  ) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = undefined;
  }
  get uri(): string {
    return this._uri;
  }
  get languageId(): string {
    return this._languageId;
  }
  get version(): number {
    return this._version;
  }
  getText(range?: Range): string {
    if (range) {
      const start = this.offsetAt(range.start);
      const end = this.offsetAt(range.end);
      return this._content.substring(start, end);
    }
    return this._content;
  }
  update(
    changes: {
      text: string;
      range?: Range;
      rangeLength?: number;
    }[],
    version: number,
  ): void {
    for (const change of changes) {
      if (isIncremental(change)) {
        const range = normalizeRange(change.range!);
        const startOffset = this.offsetAt(range.start);
        const endOffset = this.offsetAt(range.end);
        this._content =
          this._content.substring(0, startOffset) +
          change.text +
          this._content.substring(endOffset, this._content.length);
        const startLine = Math.max(range.start.line, 0);
        const endLine = Math.max(range.end.line, 0);
        const lineOffsets = this._lineOffsets;
        const newLineOffsets = computeLineOffsets(
          change.text,
          false,
          startOffset,
        );
        if (endLine - startLine === newLineOffsets.length) {
          for (let i = 0; i < newLineOffsets.length; i++) {
            lineOffsets![i + startLine + 1] = newLineOffsets[i];
          }
        } else if (newLineOffsets.length < 10000) {
          lineOffsets!.splice(
            startLine + 1,
            endLine - startLine,
            ...newLineOffsets,
          );
        } else {
          this._lineOffsets = lineOffsets!
            .slice(0, startLine + 1)
            .concat(newLineOffsets, lineOffsets!.slice(endLine + 1));
        }
        const diff = change.text.length - (endOffset - startOffset);
        if (diff !== 0) {
          for (
            let i = startLine + 1 + newLineOffsets.length;
            i < lineOffsets!.length;
            i++
          ) {
            lineOffsets![i] = lineOffsets![i] + diff;
          }
        }
      } else if (isFull(change)) {
        this._content = change.text;
        this._lineOffsets = undefined;
      } else {
        throw new Error("Unknown change event received");
      }
    }
    this._version = version;
  }
  getLineOffsets(): number[] {
    if (this._lineOffsets === undefined) {
      this._lineOffsets = computeLineOffsets(this._content, true);
    }
    return this._lineOffsets;
  }
  positionAt(offset: number): Position {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    const lineOffsets = this.getLineOffsets();
    let low = 0;
    let high = lineOffsets.length;
    if (high === 0) {
      return {
        line: 0,
        character: offset,
      };
    }
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    const line = low - 1;
    return {
      line,
      character: offset - lineOffsets[line],
    };
  }
  offsetAt(position: Position): number {
    const lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    }
    if (position.line < 0) {
      return 0;
    }
    const lineOffset = lineOffsets[position.line];
    const nextLineOffset =
      position.line + 1 < lineOffsets.length
        ? lineOffsets[position.line + 1]
        : this._content.length;
    return Math.max(
      Math.min(lineOffset + position.character, nextLineOffset),
      lineOffset,
    );
  }
  get lineCount(): number {
    return this.getLineOffsets().length;
  }
}
function isIncremental(change: {
  text: string;
  range?: Range;
  rangeLength?: number;
}): boolean {
  return (
    change.range !== undefined &&
    (change.rangeLength === undefined || typeof change.rangeLength === "number")
  );
}
function isFull(change: {
  text: string;
  range?: Range;
  rangeLength?: number;
}): boolean {
  return change.range === undefined && change.rangeLength === undefined;
}
function normalizeRange(range: Range): Range {
  if (
    range.start.line > range.end.line ||
    (range.start.line === range.end.line &&
      range.start.character > range.end.character)
  ) {
    return {
      start: range.end,
      end: range.start,
    };
  }
  return range;
}
function computeLineOffsets(
  text: string,
  isAtLineStart: boolean,
  textOffset = 0,
): number[] {
  const result: number[] = isAtLineStart ? [textOffset] : [];
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    if (ch === 13 || ch === 10) {
      if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
        i++;
      }
      result.push(textOffset + i + 1);
    }
  }
  return result;
}

// ------------------------------------------------------------------
// TextDocument (namespace)
// ------------------------------------------------------------------

export namespace TextDocument {
  export function create(
    uri: string,
    languageId: string,
    version: number,
    content: string,
  ): TextDocument {
    return new FullTextDocument(uri, languageId, version, content);
  }
  export function is(value: unknown): value is TextDocument {
    const candidate = value as Record<string, unknown> | undefined;
    return (
      !!candidate &&
      typeof candidate === "object" &&
      typeof candidate.uri === "string" &&
      (candidate.languageId === undefined ||
        typeof candidate.languageId === "string") &&
      uinteger.is(candidate.lineCount) &&
      typeof candidate.getText === "function" &&
      typeof candidate.positionAt === "function" &&
      typeof candidate.offsetAt === "function"
    );
  }
  export function applyEdits(
    document: TextDocument,
    edits: TextEdit[],
  ): string {
    const text = document.getText();
    const sortedEdits = mergeSort(edits.map(normalizeEdit), (a, b) => {
      const diff = a.range.start.line - b.range.start.line;
      return diff === 0
        ? a.range.start.character - b.range.start.character
        : diff;
    });
    let lastOffset = 0;
    const result: string[] = [];
    for (const edit of sortedEdits) {
      const startOffset = document.offsetAt(edit.range.start);
      if (startOffset < lastOffset) {
        throw new Error("Overlapping edit");
      }
      if (startOffset > lastOffset) {
        result.push(text.substring(lastOffset, startOffset));
      }
      if (edit.newText.length) {
        result.push(edit.newText);
      }
      lastOffset = document.offsetAt(edit.range.end);
    }
    result.push(text.substr(lastOffset));
    return result.join("");
  }
}
function normalizeEdit(edit: TextEdit): TextEdit {
  const range = normalizeRange(edit.range);
  if (range === edit.range) {
    return edit;
  }
  return {
    newText: edit.newText,
    range,
  };
}
function mergeSort<T>(data: T[], compare: (a: T, b: T) => number): T[] {
  if (data.length <= 1) return data;
  const middle = (data.length / 2) | 0;
  const left = data.slice(0, middle);
  const right = data.slice(middle);
  mergeSort(left, compare);
  mergeSort(right, compare);
  let leftIndex = 0;
  let rightIndex = 0;
  let dataIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      data[dataIndex++] = left[leftIndex++];
    } else {
      data[dataIndex++] = right[rightIndex++];
    }
  }
  while (leftIndex < left.length) {
    data[dataIndex++] = left[leftIndex++];
  }
  while (rightIndex < right.length) {
    data[dataIndex++] = right[rightIndex++];
  }
  return data;
}

// ------------------------------------------------------------------
// Runtime abstraction layer
// ------------------------------------------------------------------

let _runtime:
  | {
      console: {
        error: (error: unknown) => void;
      };
    }
  | undefined;
export interface RuntimeAbstractionLayer {
  console: {
    error: (error: unknown) => void;
  };
  timer: {
    setTimeout: (
      fn: () => void,
      delay: number,
    ) => {
      dispose: () => void;
    };
  };
}
export function getRuntimeAbstractionLayer(): RuntimeAbstractionLayer {
  if (_runtime === undefined) {
    throw new Error("No runtime abstraction layer installed");
  }
  return _runtime as RuntimeAbstractionLayer;
}
export function installRuntimeAbstractionLayer(
  runtime: RuntimeAbstractionLayer,
): void {
  _runtime = runtime;
}

// ------------------------------------------------------------------
// Type guards
// ------------------------------------------------------------------

export interface TypeGuards {
  boolean(value: unknown): value is boolean;
  string(value: unknown): value is string;
  number(value: unknown): value is number;
  error(value: unknown): value is Error;
  func(value: unknown): value is (...args: unknown[]) => unknown;
  array(value: unknown): value is unknown[];
  stringArray(value: unknown): value is string[];
}
export const typeGuards: TypeGuards = {
  boolean(value: unknown): value is boolean {
    return value === true || value === false;
  },
  string(value: unknown): value is string {
    return typeof value === "string" || value instanceof String;
  },
  number(value: unknown): value is number {
    return typeof value === "number" || value instanceof Number;
  },
  error(value: unknown): value is Error {
    return value instanceof Error;
  },
  func(value: unknown): value is (...args: unknown[]) => unknown {
    return typeof value === "function";
  },
  array(value: unknown): value is unknown[] {
    return Array.isArray(value);
  },
  stringArray(value: unknown): value is string[] {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "string")
    );
  },
};

// ------------------------------------------------------------------
// Event / Emitter
// ------------------------------------------------------------------

export interface Disposable {
  dispose(): void;
}
export interface Event<T> {
  (
    listener: (e: T) => void,
    thisArgs?: unknown,
    disposables?: Disposable[],
  ): Disposable;
}
export namespace Event {
  const _noneDisposable: Disposable = {
    dispose() {},
  };
  export function None<T>(): Event<T> {
    return () => _noneDisposable;
  }
}
class CallbackList {
  private _callbacks: ((...args: unknown[]) => unknown)[] | undefined;
  private _contexts: unknown[] | undefined;
  add(
    callback: (...args: unknown[]) => unknown,
    context: unknown = null,
    disposables?: Disposable[],
  ): void {
    if (!this._callbacks) {
      this._callbacks = [];
      this._contexts = [];
    }
    this._callbacks.push(callback);
    this._contexts.push(context);
    if (Array.isArray(disposables)) {
      disposables.push({
        dispose: () => this.remove(callback, context),
      });
    }
  }
  remove(
    callback: (...args: unknown[]) => unknown,
    context: unknown = null,
  ): void {
    if (!this._callbacks) return;
    let found = false;
    for (let i = 0, len = this._callbacks.length; i < len; i++) {
      if (this._callbacks[i] === callback) {
        if (this._contexts![i] === context) {
          this._callbacks.splice(i, 1);
          this._contexts!.splice(i, 1);
          return;
        } else {
          found = true;
        }
      }
    }
    if (found) {
      throw new Error(
        "When adding a listener with a context, you should remove it with the same context",
      );
    }
  }
  invoke(...args: unknown[]): unknown[] {
    if (!this._callbacks) return [];
    const result: unknown[] = [];
    const callbacks = this._callbacks.slice(0);
    const contexts = this._contexts!.slice(0);
    for (let i = 0, len = callbacks.length; i < len; i++) {
      try {
        result.push(callbacks[i].apply(contexts[i], args));
      } catch (error) {
        getRuntimeAbstractionLayer().console.error(error);
      }
    }
    return result;
  }
  isEmpty(): boolean {
    return !this._callbacks || this._callbacks.length === 0;
  }
  dispose(): void {
    this._callbacks = undefined;
    this._contexts = undefined;
  }
}
export class Emitter<T> {
  private _options?: {
    onFirstListenerAdd?: (emitter: Emitter<T>) => void;
    onLastListenerRemove?: (emitter: Emitter<T>) => void;
  };
  private _callbacks: CallbackList | undefined;
  private _event: Event<T> | undefined;
  constructor(options?: {
    onFirstListenerAdd?: (emitter: Emitter<T>) => void;
    onLastListenerRemove?: (emitter: Emitter<T>) => void;
  }) {
    this._options = options;
  }
  get event(): Event<T> {
    if (!this._event) {
      this._event = (
        listener: (e: T) => void,
        thisArgs?: unknown,
        disposables?: Disposable[],
      ) => {
        if (!this._callbacks) {
          this._callbacks = new CallbackList();
        }
        if (
          this._options &&
          this._options.onFirstListenerAdd &&
          this._callbacks.isEmpty()
        ) {
          this._options.onFirstListenerAdd(this);
        }
        this._callbacks.add(listener, thisArgs);
        const result: Disposable = {
          dispose: () => {
            if (this._callbacks) {
              this._callbacks.remove(listener, thisArgs);
              result.dispose = Emitter._noop;
              if (
                this._options &&
                this._options.onLastListenerRemove &&
                this._callbacks.isEmpty()
              ) {
                this._options.onLastListenerRemove(this);
              }
            }
          },
        };
        if (Array.isArray(disposables)) {
          disposables.push(result);
        }
        return result;
      };
    }
    return this._event;
  }
  fire(event: T): void {
    if (this._callbacks) {
      this._callbacks.invoke.call(this._callbacks, event);
    }
  }
  dispose(): void {
    if (this._callbacks) {
      this._callbacks.dispose();
      this._callbacks = undefined;
    }
  }
  static _noop(): void {}
}

// ------------------------------------------------------------------
// CancellationToken
// ------------------------------------------------------------------

export interface CancellationToken {
  readonly isCancellationRequested: boolean;
  readonly onCancellationRequested: Event<unknown>;
}
export namespace CancellationToken {
  export const None: CancellationToken = Object.freeze({
    isCancellationRequested: false,
    onCancellationRequested: Event.None(),
  });
  export const Cancelled: CancellationToken = Object.freeze({
    isCancellationRequested: true,
    onCancellationRequested: Event.None(),
  });
  export function is(value: unknown): value is CancellationToken {
    const candidate = value as CancellationToken | undefined;
    return (
      !!candidate &&
      (candidate === None ||
        candidate === Cancelled ||
        (typeof candidate.isCancellationRequested === "boolean" &&
          !!candidate.onCancellationRequested))
    );
  }
}
class CancellationTokenSourceImpl implements CancellationToken {
  private _isCancelled = false;
  private _emitter: Emitter<unknown> | undefined;
  cancel(): void {
    if (!this._isCancelled) {
      this._isCancelled = true;
      if (this._emitter) {
        this._emitter.fire(undefined);
        this.dispose();
      }
    }
  }
  get isCancellationRequested(): boolean {
    return this._isCancelled;
  }
  get onCancellationRequested(): Event<unknown> {
    if (this._isCancelled) {
      return Object.freeze(function (
        callback: () => void,
        context?: unknown,
      ): Disposable {
        const timer = getRuntimeAbstractionLayer().timer.setTimeout(
          callback.bind(context),
          0,
        );
        return {
          dispose() {
            timer.dispose();
          },
        };
      });
    }
    if (!this._emitter) {
      this._emitter = new Emitter();
    }
    return this._emitter.event;
  }
  dispose(): void {
    if (this._emitter) {
      this._emitter.dispose();
      this._emitter = undefined;
    }
  }
}
export class CancellationTokenSource {
  private _token: CancellationToken | undefined;
  get token(): CancellationToken {
    if (!this._token) {
      this._token = new CancellationTokenSourceImpl();
    }
    return this._token;
  }
  cancel(): void {
    if (this._token) {
      if (this._token instanceof CancellationTokenSourceImpl) {
        this._token.cancel();
      }
    } else {
      this._token = CancellationToken.Cancelled;
    }
  }
  dispose(): void {
    if (this._token) {
      if (this._token instanceof CancellationTokenSourceImpl) {
        this._token.dispose();
      }
    } else {
      this._token = CancellationToken.None;
    }
  }
}

// ------------------------------------------------------------------
// Validation helpers
// ------------------------------------------------------------------

export interface ValidationHelpers {
  defined(value: unknown): boolean;
  undefined(value: unknown): boolean;
  boolean(value: unknown): boolean;
  string(value: unknown): boolean;
  number(value: unknown): boolean;
  numberRange(value: unknown, min: number, max: number): boolean;
  integer(value: unknown): boolean;
  uinteger(value: unknown): boolean;
  func(value: unknown): boolean;
  objectLiteral(value: unknown): boolean;
  typedArray<T>(value: unknown, check: (item: unknown) => item is T): boolean;
}
const _objectToString = Object.prototype.toString;
export const validationHelpers: ValidationHelpers = {
  defined(value: unknown): boolean {
    return value !== undefined;
  },
  undefined(value: unknown): boolean {
    return value === undefined;
  },
  boolean(value: unknown): boolean {
    return value === true || value === false;
  },
  string(value: unknown): boolean {
    return _objectToString.call(value) === "[object String]";
  },
  number(value: unknown): boolean {
    return _objectToString.call(value) === "[object Number]";
  },
  numberRange(value: unknown, min: number, max: number): boolean {
    return (
      _objectToString.call(value) === "[object Number]" &&
      min <= (value as number) &&
      (value as number) <= max
    );
  },
  integer(value: unknown): boolean {
    return (
      _objectToString.call(value) === "[object Number]" &&
      -2147483648 <= (value as number) &&
      (value as number) <= 2147483647
    );
  },
  uinteger(value: unknown): boolean {
    return (
      _objectToString.call(value) === "[object Number]" &&
      0 <= (value as number) &&
      (value as number) <= 2147483647
    );
  },
  func(value: unknown): boolean {
    return _objectToString.call(value) === "[object Function]";
  },
  objectLiteral(value: unknown): boolean {
    return typeof value === "object" && !!value;
  },
  typedArray<T>(value: unknown, check: (item: unknown) => item is T): boolean {
    return Array.isArray(value) && value.every(check);
  },
};
