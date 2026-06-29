// Restored from ref/webview/assets/parsePatchFiles-Dm7PKlLE.js
// ParsePatchFiles chunk restored from the Codex webview bundle.
export const parsePatchFilesF = `diffs-container`;
(() => {
  try {
    return !1;
  } catch {
    return !1;
  }
})();
var parsePatchFilesValue1 = /(?=^From [a-f0-9]+ .+$)/m,
  parsePatchFilesValue2 = /(?=^diff --git)/gm,
  parsePatchFilesValue3 = /(?=^---\s+\S)/gm,
  parsePatchFilesValue4 = /^(---|\+\+\+)\s+([^\t\r\n]+)/,
  parsePatchFilesValue5 = /^(---|\+\+\+)\s+[ab]\/([^\t\r\n]+)/,
  parsePatchFilesValue6 =
    /^diff --git (?:"a\/(.+?)"|a\/(.+?)) (?:"b\/(.+?)"|b\/(.+?))$/,
  parsePatchFilesValue7 = /^index ([0-9a-f]+)\.\.([0-9a-f]+)(?: (\d+))?$/i,
  parsePatchFilesL = {
    hunkLineCount: 50,
    lineHeight: 20,
    diffHeaderHeight: 44,
    spacing: 8,
  };
export const parsePatchFilesU = `--diffs-scrollbar-gutter-measured`;
export const parsePatchFilesS = {
  dark: `pierre-dark`,
  light: `pierre-light`,
};
export const parsePatchFilesM = `header-metadata`;
export const parsePatchFilesI = `header-custom`;
export const parsePatchFilesH = `header-prefix`;
export const parsePatchFilesG = `data-theme-css`;
export const parsePatchFilesD = `data-diffs-scrollbar-measure`;
export const parsePatchFilesC = 1e5;
export const parsePatchFilesUnderscore = `data-unsafe-css`;
({
  ...parsePatchFilesL,
});
export const parsePatchFilesP = {
  startingLine: 0,
  totalLines: 0,
  bufferBefore: 0,
  bufferAfter: 0,
};
export const parsePatchFilesO = {
  startingLine: 0,
  totalLines: 1 / 0,
  bufferBefore: 0,
  bufferAfter: 0,
};
export const parsePatchFilesA = Object.freeze({
  fromStart: 0,
  fromEnd: 0,
});
function parsePatchFilesR(_parsePatchFilesF) {
  let parsePatchFilesValue54 = _parsePatchFilesF.length;
  return (
    _parsePatchFilesF.charCodeAt(parsePatchFilesValue54 - 1) === 10 &&
      (parsePatchFilesValue54--,
      _parsePatchFilesF.charCodeAt(parsePatchFilesValue54 - 1) === 13 &&
        parsePatchFilesValue54--),
    _parsePatchFilesF.slice(0, parsePatchFilesValue54)
  );
}
var parsePatchFilesValue8 = new TextEncoder(),
  parsePatchFilesValue9 = new TextDecoder(`utf-8`, {
    ignoreBOM: !0,
  }),
  parsePatchFilesValue10 = /[\uD800-\uDFFF]/,
  parsePatchFilesValue11 = 1024,
  parsePatchFilesValue12 = new Uint8Array(parsePatchFilesValue11);
function parsePatchFilesHelper1() {
  parsePatchFilesValue12.length !== parsePatchFilesValue11 &&
    (parsePatchFilesValue12 = new Uint8Array(parsePatchFilesValue11));
}
function parsePatchFilesHelper2(_parsePatchFilesF) {
  if (_parsePatchFilesF.length === 0) return _parsePatchFilesF;
  if (parsePatchFilesValue10.test(_parsePatchFilesF))
    return JSON.parse(JSON.stringify(_parsePatchFilesF));
  let parsePatchFilesValue42 = _parsePatchFilesF.length * 3;
  parsePatchFilesValue12.length < parsePatchFilesValue42 &&
    (parsePatchFilesValue12 = new Uint8Array(parsePatchFilesValue42));
  let { written: written } = parsePatchFilesValue8.encodeInto(
    _parsePatchFilesF,
    parsePatchFilesValue12,
  );
  return parsePatchFilesValue9.decode(
    parsePatchFilesValue12.subarray(0, written),
  );
}
function parsePatchFilesHelper3(
  _parsePatchFilesF,
  parsePatchFilesParam11,
  parsePatchFilesParam12,
) {
  try {
    return parsePatchFilesHelper4(
      _parsePatchFilesF,
      parsePatchFilesParam11,
      parsePatchFilesParam12,
    );
  } finally {
    parsePatchFilesHelper1();
  }
}
function parsePatchFilesHelper4(
  _parsePatchFilesF,
  parsePatchFilesParam1,
  parsePatchFilesParam2 = !1,
) {
  let parsePatchFilesValue29 = parsePatchFilesHelper12(_parsePatchFilesF),
    parsePatchFilesValue30 = parsePatchFilesValue29
      ? parsePatchFilesHelper13(_parsePatchFilesF, `diff --git`)
      : _parsePatchFilesF.split(parsePatchFilesValue3),
    parsePatchFilesValue31,
    _parsePatchFilesH = [];
  for (let __parsePatchFilesF of parsePatchFilesValue30) {
    if (
      parsePatchFilesValue29 &&
      !parsePatchFilesValue2.test(__parsePatchFilesF)
    ) {
      if (parsePatchFilesValue31 == null)
        parsePatchFilesValue31 = parsePatchFilesHelper2(__parsePatchFilesF);
      else if (parsePatchFilesParam2)
        throw Error(`parsePatchContent: unknown file blob`);
      else
        console.error(
          `parsePatchContent: unknown file blob:`,
          __parsePatchFilesF,
        );
      continue;
    } else if (
      !parsePatchFilesValue29 &&
      !parsePatchFilesValue3.test(__parsePatchFilesF)
    ) {
      if (parsePatchFilesValue31 == null)
        parsePatchFilesValue31 = parsePatchFilesHelper2(__parsePatchFilesF);
      else if (parsePatchFilesParam2)
        throw Error(`parsePatchContent: unknown file blob`);
      else
        console.error(
          `parsePatchContent: unknown file blob:`,
          __parsePatchFilesF,
        );
      continue;
    }
    let parsePatchFilesValue32 = parsePatchFilesHelper5(__parsePatchFilesF, {
      cacheKey:
        parsePatchFilesParam1 == null
          ? void 0
          : `${parsePatchFilesParam1}-${_parsePatchFilesH.length}`,
      isGitDiff: parsePatchFilesValue29,
      throwOnError: parsePatchFilesParam2,
    });
    parsePatchFilesValue32 != null &&
      _parsePatchFilesH.push(parsePatchFilesValue32);
  }
  return {
    patchMetadata: parsePatchFilesValue31,
    files: _parsePatchFilesH,
  };
}
export function parsePatchFilesN(_parsePatchFilesF, parsePatchFilesParam13) {
  try {
    return parsePatchFilesHelper5(_parsePatchFilesF, parsePatchFilesParam13);
  } finally {
    parsePatchFilesHelper1();
  }
}
function parsePatchFilesHelper5(
  _parsePatchFilesF,
  {
    cacheKey: cacheKey,
    isGitDiff = parsePatchFilesValue2.test(_parsePatchFilesF),
    oldFile: _parsePatchFilesH,
    newFile: _parsePatchFilesM,
    throwOnError: _parsePatchFilesI = !1,
  } = {},
) {
  let _parsePatchFilesS = 0,
    _parsePatchFilesG = parsePatchFilesHelper13(_parsePatchFilesF, `@@ `),
    _parsePatchFilesUnderscore,
    _parsePatchFilesD = _parsePatchFilesH == null || _parsePatchFilesM == null,
    _parsePatchFilesU = 0,
    _parsePatchFilesC = 0;
  for (let __parsePatchFilesF of _parsePatchFilesG) {
    let parsePatchFilesValue13 = parsePatchFilesHelper8(__parsePatchFilesF),
      __parsePatchFilesG = parsePatchFilesValue13[0];
    if (__parsePatchFilesG == null) {
      if (_parsePatchFilesI) throw Error(`parsePatchContent: invalid hunk`);
      console.error(`parsePatchContent: invalid hunk`, __parsePatchFilesF);
      continue;
    }
    let _parsePatchFilesL = parsePatchFilesHelper9(__parsePatchFilesG),
      _parsePatchFilesA = 0,
      _parsePatchFilesO = 0;
    if (_parsePatchFilesL == null || _parsePatchFilesUnderscore == null) {
      if (_parsePatchFilesUnderscore != null) {
        if (_parsePatchFilesI) throw Error(`parsePatchContent: Invalid hunk`);
        console.error(`parsePatchContent: Invalid hunk`, __parsePatchFilesF);
        continue;
      }
      ((_parsePatchFilesUnderscore = {
        name: ``,
        type: `change`,
        hunks: [],
        splitLineCount: 0,
        unifiedLineCount: 0,
        isPartial: _parsePatchFilesD,
        additionLines:
          !_parsePatchFilesD &&
          _parsePatchFilesH != null &&
          _parsePatchFilesM != null
            ? parsePatchFilesHelper7(_parsePatchFilesM.contents)
            : [],
        deletionLines:
          !_parsePatchFilesD &&
          _parsePatchFilesH != null &&
          _parsePatchFilesM != null
            ? parsePatchFilesHelper7(_parsePatchFilesH.contents)
            : [],
        cacheKey: parsePatchFilesHelper15(cacheKey),
      }),
        _parsePatchFilesUnderscore.additionLines.length === 1 &&
          _parsePatchFilesM?.contents === `` &&
          (_parsePatchFilesUnderscore.additionLines.length = 0),
        _parsePatchFilesUnderscore.deletionLines.length === 1 &&
          _parsePatchFilesH?.contents === `` &&
          (_parsePatchFilesUnderscore.deletionLines.length = 0));
      for (let ___parsePatchFilesF of parsePatchFilesValue13) {
        if (___parsePatchFilesF.startsWith(`diff --git`)) {
          let parsePatchFilesValue33 = ___parsePatchFilesF
              .trim()
              .match(parsePatchFilesValue6),
            parsePatchFilesValue34 =
              parsePatchFilesValue33?.[1] ?? parsePatchFilesValue33?.[2],
            parsePatchFilesValue35 =
              parsePatchFilesValue33?.[3] ?? parsePatchFilesValue33?.[4];
          if (
            parsePatchFilesValue34 == null ||
            parsePatchFilesValue35 == null
          ) {
            if (_parsePatchFilesI)
              throw Error(`parsePatchContent: invalid git diff header`);
            console.error(
              `parsePatchContent: invalid git diff header`,
              ___parsePatchFilesF,
            );
            continue;
          }
          ((_parsePatchFilesUnderscore.name = parsePatchFilesHelper2(
            parsePatchFilesValue35.trim(),
          )),
            parsePatchFilesValue34 !== parsePatchFilesValue35 &&
              (_parsePatchFilesUnderscore.prevName = parsePatchFilesHelper2(
                parsePatchFilesValue34.trim(),
              )));
          continue;
        }
        let parsePatchFilesValue21 =
          ___parsePatchFilesF.startsWith(`---`) ||
          ___parsePatchFilesF.startsWith(`+++`)
            ? ___parsePatchFilesF.match(
                isGitDiff ? parsePatchFilesValue5 : parsePatchFilesValue4,
              )
            : null;
        if (parsePatchFilesValue21 != null) {
          let [, ____parsePatchFilesF, parsePatchFilesValue45] =
            parsePatchFilesValue21;
          if (
            ____parsePatchFilesF === `---` &&
            parsePatchFilesValue45 !== `/dev/null`
          ) {
            let _____parsePatchFilesF = parsePatchFilesHelper2(
              parsePatchFilesValue45.trim(),
            );
            ((_parsePatchFilesUnderscore.prevName = _____parsePatchFilesF),
              (_parsePatchFilesUnderscore.name = _____parsePatchFilesF));
          } else
            ____parsePatchFilesF === `+++` &&
              parsePatchFilesValue45 !== `/dev/null` &&
              (_parsePatchFilesUnderscore.name = parsePatchFilesHelper2(
                parsePatchFilesValue45.trim(),
              ));
        } else if (isGitDiff) {
          if (
            (___parsePatchFilesF.startsWith(`new mode `) &&
              (_parsePatchFilesUnderscore.mode = parsePatchFilesHelper2(
                ___parsePatchFilesF.slice(8).trim(),
              )),
            ___parsePatchFilesF.startsWith(`old mode `) &&
              (_parsePatchFilesUnderscore.prevMode = parsePatchFilesHelper2(
                ___parsePatchFilesF.slice(8).trim(),
              )),
            ___parsePatchFilesF.startsWith(`new file mode`) &&
              ((_parsePatchFilesUnderscore.type = `new`),
              (_parsePatchFilesUnderscore.mode = parsePatchFilesHelper2(
                ___parsePatchFilesF.slice(13).trim(),
              ))),
            ___parsePatchFilesF.startsWith(`deleted file mode`) &&
              ((_parsePatchFilesUnderscore.type = `deleted`),
              (_parsePatchFilesUnderscore.mode = parsePatchFilesHelper2(
                ___parsePatchFilesF.slice(17).trim(),
              ))),
            ___parsePatchFilesF.startsWith(`similarity index`) &&
              (___parsePatchFilesF.startsWith(`similarity index 100%`)
                ? (_parsePatchFilesUnderscore.type = `rename-pure`)
                : (_parsePatchFilesUnderscore.type = `rename-changed`)),
            ___parsePatchFilesF.startsWith(`index `))
          ) {
            let [
              ,
              parsePatchFilesValue49,
              parsePatchFilesValue50,
              parsePatchFilesValue51,
            ] = ___parsePatchFilesF.trim().match(parsePatchFilesValue7) ?? [];
            (parsePatchFilesValue49 != null &&
              (_parsePatchFilesUnderscore.prevObjectId = parsePatchFilesHelper2(
                parsePatchFilesValue49,
              )),
              parsePatchFilesValue50 != null &&
                (_parsePatchFilesUnderscore.newObjectId =
                  parsePatchFilesHelper2(parsePatchFilesValue50)),
              parsePatchFilesValue51 != null &&
                (_parsePatchFilesUnderscore.mode = parsePatchFilesHelper2(
                  parsePatchFilesValue51,
                )));
          }
          (___parsePatchFilesF.startsWith(`rename from `) &&
            (_parsePatchFilesUnderscore.prevName = parsePatchFilesHelper2(
              ___parsePatchFilesF.slice(12).trim(),
            )),
            ___parsePatchFilesF.startsWith(`rename to `) &&
              (_parsePatchFilesUnderscore.name = parsePatchFilesHelper2(
                ___parsePatchFilesF.slice(10).trim(),
              )));
        }
      }
      continue;
    }
    let _parsePatchFilesP, parsePatchFilesValue14;
    for (
      ;
      parsePatchFilesValue13.length > 0 &&
      (parsePatchFilesValue13[parsePatchFilesValue13.length - 1] ===
        `
` ||
        parsePatchFilesValue13[parsePatchFilesValue13.length - 1] === `\r` ||
        parsePatchFilesValue13[parsePatchFilesValue13.length - 1] ===
          `\r
` ||
        parsePatchFilesValue13[parsePatchFilesValue13.length - 1] === ``);
    )
      parsePatchFilesValue13.pop();
    let { additionStart: additionStart, deletionStart: deletionStart } =
      _parsePatchFilesL;
    ((_parsePatchFilesU = _parsePatchFilesD
      ? _parsePatchFilesU
      : deletionStart - 1),
      (_parsePatchFilesC = _parsePatchFilesD
        ? _parsePatchFilesC
        : additionStart - 1));
    let parsePatchFilesValue15 = {
        collapsedBefore: 0,
        splitLineCount: 0,
        splitLineStart: 0,
        unifiedLineCount: 0,
        unifiedLineStart: 0,
        additionCount: _parsePatchFilesL.additionCount,
        additionStart: additionStart,
        additionLines: _parsePatchFilesA,
        deletionCount: _parsePatchFilesL.deletionCount,
        deletionStart: deletionStart,
        deletionLines: _parsePatchFilesO,
        deletionLineIndex: _parsePatchFilesU,
        additionLineIndex: _parsePatchFilesC,
        hunkContent: [],
        hunkContext: parsePatchFilesHelper15(_parsePatchFilesL.hunkContext),
        hunkSpecs: parsePatchFilesHelper2(__parsePatchFilesG),
        noEOFCRAdditions: !1,
        noEOFCRDeletions: !1,
      },
      parsePatchFilesValue16 = 0,
      parsePatchFilesValue17 = 0;
    for (
      let ___parsePatchFilesF = 1;
      ___parsePatchFilesF < parsePatchFilesValue13.length;
      ___parsePatchFilesF++
    ) {
      let parsePatchFilesValue18 = parsePatchFilesValue13[___parsePatchFilesF];
      if (
        parsePatchFilesValue16 >= parsePatchFilesValue15.additionCount &&
        parsePatchFilesValue17 >= parsePatchFilesValue15.deletionCount &&
        !parsePatchFilesValue18.startsWith(`\\`)
      )
        break;
      let parsePatchFilesValue19 = parsePatchFilesValue18[0];
      if (
        parsePatchFilesValue19 !== `+` &&
        parsePatchFilesValue19 !== `-` &&
        parsePatchFilesValue19 !== ` ` &&
        parsePatchFilesValue19 !== `\\`
      ) {
        (console.error(
          `parseLineType: Invalid firstChar: "${parsePatchFilesValue19}", full line: "${parsePatchFilesValue18}"`,
        ),
          console.error(
            `processFile: invalid rawLine:`,
            parsePatchFilesValue18,
          ));
        continue;
      }
      let parsePatchFilesValue20 = parsePatchFilesHelper16(
        parsePatchFilesValue19,
      );
      if (parsePatchFilesValue20 === `addition`) {
        let ____parsePatchFilesF = parsePatchFilesHelper17(
          parsePatchFilesValue18,
        );
        ((_parsePatchFilesP == null || _parsePatchFilesP.type !== `change`) &&
          ((_parsePatchFilesP = parsePatchFilesHelper18(
            `change`,
            _parsePatchFilesU,
            _parsePatchFilesC,
          )),
          parsePatchFilesValue15.hunkContent.push(_parsePatchFilesP)),
          _parsePatchFilesC++,
          parsePatchFilesValue16++,
          _parsePatchFilesD &&
            _parsePatchFilesUnderscore.additionLines.push(____parsePatchFilesF),
          _parsePatchFilesP.additions++,
          _parsePatchFilesA++,
          (parsePatchFilesValue14 = `addition`));
      } else if (parsePatchFilesValue20 === `deletion`) {
        let ____parsePatchFilesF = parsePatchFilesHelper17(
          parsePatchFilesValue18,
        );
        ((_parsePatchFilesP == null || _parsePatchFilesP.type !== `change`) &&
          ((_parsePatchFilesP = parsePatchFilesHelper18(
            `change`,
            _parsePatchFilesU,
            _parsePatchFilesC,
          )),
          parsePatchFilesValue15.hunkContent.push(_parsePatchFilesP)),
          _parsePatchFilesU++,
          parsePatchFilesValue17++,
          _parsePatchFilesD &&
            _parsePatchFilesUnderscore.deletionLines.push(____parsePatchFilesF),
          _parsePatchFilesP.deletions++,
          _parsePatchFilesO++,
          (parsePatchFilesValue14 = `deletion`));
      } else if (parsePatchFilesValue20 === `context`) {
        let ____parsePatchFilesF = parsePatchFilesHelper17(
          parsePatchFilesValue18,
        );
        ((_parsePatchFilesP == null || _parsePatchFilesP.type !== `context`) &&
          ((_parsePatchFilesP = parsePatchFilesHelper18(
            `context`,
            _parsePatchFilesU,
            _parsePatchFilesC,
          )),
          parsePatchFilesValue15.hunkContent.push(_parsePatchFilesP)),
          _parsePatchFilesC++,
          _parsePatchFilesU++,
          parsePatchFilesValue16++,
          parsePatchFilesValue17++,
          _parsePatchFilesD &&
            (_parsePatchFilesUnderscore.deletionLines.push(
              ____parsePatchFilesF,
            ),
            _parsePatchFilesUnderscore.additionLines.push(
              ____parsePatchFilesF,
            )),
          _parsePatchFilesP.lines++,
          (parsePatchFilesValue14 = `context`));
      } else if (
        parsePatchFilesValue20 === `metadata` &&
        _parsePatchFilesP != null
      ) {
        if (
          (_parsePatchFilesP.type === `context`
            ? ((parsePatchFilesValue15.noEOFCRAdditions = !0),
              (parsePatchFilesValue15.noEOFCRDeletions = !0))
            : parsePatchFilesValue14 === `deletion`
              ? (parsePatchFilesValue15.noEOFCRDeletions = !0)
              : parsePatchFilesValue14 === `addition` &&
                (parsePatchFilesValue15.noEOFCRAdditions = !0),
          _parsePatchFilesD &&
            (parsePatchFilesValue14 === `addition` ||
              parsePatchFilesValue14 === `context`))
        ) {
          let ____parsePatchFilesF =
            _parsePatchFilesUnderscore.additionLines.length - 1;
          ____parsePatchFilesF >= 0 &&
            (_parsePatchFilesUnderscore.additionLines[____parsePatchFilesF] =
              parsePatchFilesR(
                _parsePatchFilesUnderscore.additionLines[____parsePatchFilesF],
              ));
        }
        if (
          _parsePatchFilesD &&
          (parsePatchFilesValue14 === `deletion` ||
            parsePatchFilesValue14 === `context`)
        ) {
          let ____parsePatchFilesF =
            _parsePatchFilesUnderscore.deletionLines.length - 1;
          ____parsePatchFilesF >= 0 &&
            (_parsePatchFilesUnderscore.deletionLines[____parsePatchFilesF] =
              parsePatchFilesR(
                _parsePatchFilesUnderscore.deletionLines[____parsePatchFilesF],
              ));
        }
      }
    }
    ((parsePatchFilesValue15.additionLines = _parsePatchFilesA),
      (parsePatchFilesValue15.deletionLines = _parsePatchFilesO),
      (parsePatchFilesValue15.collapsedBefore = Math.max(
        parsePatchFilesValue15.additionStart - 1 - _parsePatchFilesS,
        0,
      )),
      _parsePatchFilesUnderscore.hunks.push(parsePatchFilesValue15),
      (_parsePatchFilesS =
        parsePatchFilesValue15.additionStart +
        parsePatchFilesValue15.additionCount -
        1));
    for (let ___parsePatchFilesF of parsePatchFilesValue15.hunkContent)
      ___parsePatchFilesF.type === `context`
        ? ((parsePatchFilesValue15.splitLineCount += ___parsePatchFilesF.lines),
          (parsePatchFilesValue15.unifiedLineCount +=
            ___parsePatchFilesF.lines))
        : ((parsePatchFilesValue15.splitLineCount += Math.max(
            ___parsePatchFilesF.additions,
            ___parsePatchFilesF.deletions,
          )),
          (parsePatchFilesValue15.unifiedLineCount +=
            ___parsePatchFilesF.deletions + ___parsePatchFilesF.additions));
    ((parsePatchFilesValue15.splitLineStart =
      _parsePatchFilesUnderscore.splitLineCount +
      parsePatchFilesValue15.collapsedBefore),
      (parsePatchFilesValue15.unifiedLineStart =
        _parsePatchFilesUnderscore.unifiedLineCount +
        parsePatchFilesValue15.collapsedBefore),
      (_parsePatchFilesUnderscore.splitLineCount +=
        parsePatchFilesValue15.collapsedBefore +
        parsePatchFilesValue15.splitLineCount),
      (_parsePatchFilesUnderscore.unifiedLineCount +=
        parsePatchFilesValue15.collapsedBefore +
        parsePatchFilesValue15.unifiedLineCount));
  }
  if (_parsePatchFilesUnderscore != null) {
    if (
      _parsePatchFilesUnderscore.hunks.length > 0 &&
      !_parsePatchFilesD &&
      _parsePatchFilesUnderscore.additionLines.length > 0 &&
      _parsePatchFilesUnderscore.deletionLines.length > 0
    ) {
      let __parsePatchFilesF =
          _parsePatchFilesUnderscore.hunks[
            _parsePatchFilesUnderscore.hunks.length - 1
          ],
        parsePatchFilesValue46 =
          __parsePatchFilesF.additionStart +
          __parsePatchFilesF.additionCount -
          1,
        parsePatchFilesValue47 =
          _parsePatchFilesUnderscore.additionLines.length,
        parsePatchFilesValue48 = Math.max(
          parsePatchFilesValue47 - parsePatchFilesValue46,
          0,
        );
      ((_parsePatchFilesUnderscore.splitLineCount += parsePatchFilesValue48),
        (_parsePatchFilesUnderscore.unifiedLineCount +=
          parsePatchFilesValue48));
    }
    return (
      isGitDiff ||
        (_parsePatchFilesUnderscore.prevName != null &&
        _parsePatchFilesUnderscore.name !== _parsePatchFilesUnderscore.prevName
          ? _parsePatchFilesUnderscore.hunks.length > 0
            ? (_parsePatchFilesUnderscore.type = `rename-changed`)
            : (_parsePatchFilesUnderscore.type = `rename-pure`)
          : (_parsePatchFilesH == null || _parsePatchFilesH.contents === ``) &&
              _parsePatchFilesM != null &&
              _parsePatchFilesM.contents !== ``
            ? (_parsePatchFilesUnderscore.type = `new`)
            : _parsePatchFilesH != null &&
              _parsePatchFilesH.contents !== `` &&
              (_parsePatchFilesM == null ||
                _parsePatchFilesM.contents === ``) &&
              (_parsePatchFilesUnderscore.type = `deleted`)),
      _parsePatchFilesUnderscore.type !== `rename-pure` &&
        _parsePatchFilesUnderscore.type !== `rename-changed` &&
        (_parsePatchFilesUnderscore.prevName = void 0),
      _parsePatchFilesUnderscore
    );
  }
}
export function parsePatchFilesT(
  _parsePatchFilesF,
  parsePatchFilesParam6,
  parsePatchFilesParam7 = !1,
) {
  let parsePatchFilesValue43 = [],
    parsePatchFilesValue44 = parsePatchFilesHelper6(_parsePatchFilesF)
      ? _parsePatchFilesF.split(parsePatchFilesValue1)
      : [_parsePatchFilesF];
  for (let __parsePatchFilesF of parsePatchFilesValue44)
    try {
      parsePatchFilesValue43.push(
        parsePatchFilesHelper3(
          __parsePatchFilesF,
          parsePatchFilesParam6 == null
            ? void 0
            : `${parsePatchFilesParam6}-${parsePatchFilesValue43.length}`,
          parsePatchFilesParam7,
        ),
      );
    } catch (___parsePatchFilesF) {
      if (parsePatchFilesParam7) throw ___parsePatchFilesF;
      console.error(___parsePatchFilesF);
    }
  return parsePatchFilesValue43;
}
function parsePatchFilesHelper6(_parsePatchFilesF) {
  return (
    _parsePatchFilesF.startsWith(`From `) ||
    _parsePatchFilesF.includes(`
From `)
  );
}
function parsePatchFilesHelper7(_parsePatchFilesF) {
  let parsePatchFilesValue56 = parsePatchFilesHelper8(_parsePatchFilesF);
  for (
    let __parsePatchFilesF = 0;
    __parsePatchFilesF < parsePatchFilesValue56.length;
    __parsePatchFilesF++
  )
    parsePatchFilesValue56[__parsePatchFilesF] = parsePatchFilesHelper2(
      parsePatchFilesValue56[__parsePatchFilesF],
    );
  return parsePatchFilesValue56;
}
function parsePatchFilesHelper8(_parsePatchFilesF) {
  if (_parsePatchFilesF.length === 0) return [``];
  let parsePatchFilesValue40 = [],
    parsePatchFilesValue41 = 0;
  for (;;) {
    let parsePatchFilesValue55 = _parsePatchFilesF.indexOf(
      `
`,
      parsePatchFilesValue41,
    );
    if (parsePatchFilesValue55 === -1) break;
    (parsePatchFilesValue40.push(
      _parsePatchFilesF.slice(
        parsePatchFilesValue41,
        parsePatchFilesValue55 + 1,
      ),
    ),
      (parsePatchFilesValue41 = parsePatchFilesValue55 + 1));
  }
  return (
    parsePatchFilesValue41 < _parsePatchFilesF.length &&
      parsePatchFilesValue40.push(
        _parsePatchFilesF.slice(parsePatchFilesValue41),
      ),
    parsePatchFilesValue40
  );
}
function parsePatchFilesHelper9(_parsePatchFilesF) {
  if (!_parsePatchFilesF.startsWith(`@@ -`)) return;
  let parsePatchFilesValue22 = 4,
    parsePatchFilesValue23 = parsePatchFilesHelper10(
      _parsePatchFilesF,
      parsePatchFilesValue22,
    );
  if (parsePatchFilesValue23 == null) return;
  let parsePatchFilesValue24 = parsePatchFilesValue23.value;
  parsePatchFilesValue22 = parsePatchFilesValue23.endIndex;
  let parsePatchFilesValue25 = 1;
  if (_parsePatchFilesF[parsePatchFilesValue22] === `,`) {
    let parsePatchFilesValue57 = parsePatchFilesHelper10(
      _parsePatchFilesF,
      parsePatchFilesValue22 + 1,
    );
    if (parsePatchFilesValue57 == null) return;
    ((parsePatchFilesValue25 = parsePatchFilesValue57.value),
      (parsePatchFilesValue22 = parsePatchFilesValue57.endIndex));
  }
  if (
    _parsePatchFilesF[parsePatchFilesValue22] !== ` ` ||
    _parsePatchFilesF[parsePatchFilesValue22 + 1] !== `+`
  )
    return;
  parsePatchFilesValue22 += 2;
  let parsePatchFilesValue26 = parsePatchFilesHelper10(
    _parsePatchFilesF,
    parsePatchFilesValue22,
  );
  if (parsePatchFilesValue26 == null) return;
  let parsePatchFilesValue27 = parsePatchFilesValue26.value;
  parsePatchFilesValue22 = parsePatchFilesValue26.endIndex;
  let parsePatchFilesValue28 = 1;
  if (_parsePatchFilesF[parsePatchFilesValue22] === `,`) {
    let parsePatchFilesValue58 = parsePatchFilesHelper10(
      _parsePatchFilesF,
      parsePatchFilesValue22 + 1,
    );
    if (parsePatchFilesValue58 == null) return;
    ((parsePatchFilesValue28 = parsePatchFilesValue58.value),
      (parsePatchFilesValue22 = parsePatchFilesValue58.endIndex));
  }
  if (
    _parsePatchFilesF[parsePatchFilesValue22] !== ` ` ||
    _parsePatchFilesF[parsePatchFilesValue22 + 1] !== `@` ||
    _parsePatchFilesF[parsePatchFilesValue22 + 2] !== `@`
  )
    return;
  let _parsePatchFilesH,
    _parsePatchFilesM = parsePatchFilesValue22 + 3;
  return (
    _parsePatchFilesF[_parsePatchFilesM] === ` ` &&
      (_parsePatchFilesH = parsePatchFilesHelper11(
        _parsePatchFilesF.slice(_parsePatchFilesM + 1),
      )),
    {
      additionCount: parsePatchFilesValue28,
      additionStart: parsePatchFilesValue27,
      deletionCount: parsePatchFilesValue25,
      deletionStart: parsePatchFilesValue24,
      hunkContext: _parsePatchFilesH,
    }
  );
}
function parsePatchFilesHelper10(_parsePatchFilesF, parsePatchFilesParam8) {
  let parsePatchFilesValue52 = parsePatchFilesParam8,
    parsePatchFilesValue53 = 0;
  for (
    ;
    parsePatchFilesValue52 < _parsePatchFilesF.length;
    parsePatchFilesValue52++
  ) {
    let parsePatchFilesValue61 =
      _parsePatchFilesF.charCodeAt(parsePatchFilesValue52) - 48;
    if (parsePatchFilesValue61 < 0 || parsePatchFilesValue61 > 9) break;
    parsePatchFilesValue53 =
      parsePatchFilesValue53 * 10 + parsePatchFilesValue61;
  }
  if (parsePatchFilesValue52 !== parsePatchFilesParam8)
    return {
      value: parsePatchFilesValue53,
      endIndex: parsePatchFilesValue52,
    };
}
function parsePatchFilesHelper11(_parsePatchFilesF) {
  return _parsePatchFilesF.endsWith(`\r
`)
    ? _parsePatchFilesF.slice(0, -2)
    : _parsePatchFilesF.endsWith(`
`)
      ? _parsePatchFilesF.slice(0, -1)
      : _parsePatchFilesF;
}
function parsePatchFilesHelper12(_parsePatchFilesF) {
  return (
    _parsePatchFilesF.startsWith(`diff --git`) ||
    _parsePatchFilesF.includes(`
diff --git`)
  );
}
function parsePatchFilesHelper13(_parsePatchFilesF, parsePatchFilesParam3) {
  if (_parsePatchFilesF.length === 0) return [``];
  let parsePatchFilesValue36 = `\n${parsePatchFilesParam3}`,
    parsePatchFilesValue37 = _parsePatchFilesF.startsWith(parsePatchFilesParam3)
      ? 0
      : parsePatchFilesHelper14(_parsePatchFilesF, parsePatchFilesValue36, 0);
  if (parsePatchFilesValue37 === -1) return [_parsePatchFilesF];
  let parsePatchFilesValue38 = [];
  parsePatchFilesValue37 > 0 &&
    parsePatchFilesValue38.push(
      _parsePatchFilesF.slice(0, parsePatchFilesValue37),
    );
  let parsePatchFilesValue39 = parsePatchFilesValue37;
  for (;;) {
    let parsePatchFilesValue59 = parsePatchFilesHelper14(
      _parsePatchFilesF,
      parsePatchFilesValue36,
      parsePatchFilesValue39 + 1,
    );
    if (parsePatchFilesValue59 === -1) break;
    (parsePatchFilesValue38.push(
      _parsePatchFilesF.slice(parsePatchFilesValue39, parsePatchFilesValue59),
    ),
      (parsePatchFilesValue39 = parsePatchFilesValue59));
  }
  return (
    parsePatchFilesValue38.push(
      _parsePatchFilesF.slice(parsePatchFilesValue39),
    ),
    parsePatchFilesValue38
  );
}
function parsePatchFilesHelper14(
  _parsePatchFilesF,
  parsePatchFilesParam9,
  parsePatchFilesParam10,
) {
  let parsePatchFilesValue62 = _parsePatchFilesF.indexOf(
    parsePatchFilesParam9,
    parsePatchFilesParam10,
  );
  return parsePatchFilesValue62 === -1 ? -1 : parsePatchFilesValue62 + 1;
}
function parsePatchFilesHelper15(_parsePatchFilesF) {
  return _parsePatchFilesF == null
    ? _parsePatchFilesF
    : parsePatchFilesHelper2(_parsePatchFilesF);
}
function parsePatchFilesHelper16(_parsePatchFilesF) {
  return _parsePatchFilesF === ` `
    ? `context`
    : _parsePatchFilesF === `\\`
      ? `metadata`
      : _parsePatchFilesF === `+`
        ? `addition`
        : `deletion`;
}
function parsePatchFilesHelper17(_parsePatchFilesF) {
  let parsePatchFilesValue60 = _parsePatchFilesF.slice(1);
  return parsePatchFilesHelper2(
    parsePatchFilesValue60 === ``
      ? `
`
      : parsePatchFilesValue60,
  );
}
function parsePatchFilesHelper18(
  _parsePatchFilesF,
  parsePatchFilesParam4,
  parsePatchFilesParam5,
) {
  return _parsePatchFilesF === `change`
    ? {
        type: `change`,
        additions: 0,
        deletions: 0,
        additionLineIndex: parsePatchFilesParam5,
        deletionLineIndex: parsePatchFilesParam4,
      }
    : {
        type: `context`,
        lines: 0,
        additionLineIndex: parsePatchFilesParam5,
        deletionLineIndex: parsePatchFilesParam4,
      };
}
export { parsePatchFilesL, parsePatchFilesR };

// Aliases used by consumer checkpoints
export declare const parsePatchFilesN: any;
export declare const parsePatchFilesT: any;
