// Restored from ref/webview/assets/chunk-Cq_f4orQ.js
// Chunk chunk restored from the Codex webview bundle.
var chunkValue1 = Object.create,
  chunkValue2 = Object.defineProperty,
  chunkValue3 = Object.getOwnPropertyDescriptor,
  chunkValue4 = Object.getOwnPropertyNames,
  chunkValue5 = Object.getPrototypeOf,
  chunkValue6 = Object.prototype.hasOwnProperty,
  chunkValue7 = (chunkParam1, chunkParam2, _chunkN, _chunkT) => {
    if (
      (chunkParam2 && typeof chunkParam2 == "object") ||
      typeof chunkParam2 == "function"
    )
      for (
        var _chunkR = chunkValue4(chunkParam2),
          chunkValue8 = 0,
          _chunkI = _chunkR.length,
          _chunkS;
        chunkValue8 < _chunkI;
        chunkValue8++
      ) {
        _chunkS = _chunkR[chunkValue8];
        !chunkValue6.call(chunkParam1, _chunkS) &&
          _chunkS !== _chunkN &&
          chunkValue2(chunkParam1, _chunkS, {
            get: ((chunkParam20) => chunkParam2[chunkParam20]).bind(
              null,
              _chunkS,
            ),
            enumerable:
              !(_chunkT = chunkValue3(chunkParam2, _chunkS)) ||
              _chunkT.enumerable,
          });
      }
    return chunkParam1;
  };
export const chunkT = (chunkParam11, chunkParam12) => () => (
  chunkParam12 ||
    chunkParam11(
      (chunkParam12 = {
        exports: {},
      }).exports,
      chunkParam12,
    ),
  chunkParam12.exports
);
export const chunkS = (chunkParam5, chunkParam6, chunkParam7) => (
  (chunkParam7 =
    chunkParam5 == null ? {} : chunkValue1(chunkValue5(chunkParam5))),
  chunkValue7(
    chunkParam6 || !chunkParam5 || !chunkParam5.__esModule
      ? chunkValue2(chunkParam7, "default", {
          value: chunkParam5,
          enumerable: true,
        })
      : chunkParam7,
    chunkParam5,
  )
);
export const chunkR = (chunkParam8, chunkParam9) => {
  let chunkValue9 = {};
  for (var chunkValue10 in chunkParam8)
    chunkValue2(chunkValue9, chunkValue10, {
      get: chunkParam8[chunkValue10],
      enumerable: true,
    });
  return (
    chunkParam9 ||
      chunkValue2(chunkValue9, Symbol.toStringTag, {
        value: "Module",
      }),
    chunkValue9
  );
};
export const chunkO = (chunkParam10) =>
  chunkValue6.call(chunkParam10, "module.exports")
    ? chunkParam10["module.exports"]
    : chunkValue7(
        chunkValue2({}, "__esModule", {
          value: true,
        }),
        chunkParam10,
      );
export const chunkN = (chunkParam18, chunkParam19) => () => (
  chunkParam18 && (chunkParam19 = chunkParam18((chunkParam18 = 0))),
  chunkParam19
);
export const chunkI = (chunkParam13, chunkParam14, chunkParam15) => (
  chunkValue7(chunkParam13, chunkParam14, "default"),
  chunkParam15 && chunkValue7(chunkParam15, chunkParam14, "default")
);
export const chunkA = ((chunkParam4) =>
  typeof require < "u"
    ? require
    : typeof Proxy < "u"
      ? new Proxy(chunkParam4, {
          get: (chunkParam16, chunkParam17) =>
            (typeof require < "u" ? require : chunkParam16)[chunkParam17],
        })
      : chunkParam4)(function (chunkParam3) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error(
    'Calling `require` for "' +
      chunkParam3 +
      "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.",
  );
});
