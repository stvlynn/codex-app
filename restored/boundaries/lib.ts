// Restored from ref/webview/assets/lib-BWT6A3Q0.js
// Lib chunk restored from the Codex webview bundle.
import React from "react";
import { chunkS, chunkT } from "../utils/esbuild-runtime-helpers";
import {
  a as libImport2,
  o as libImport3,
  r as libImport4,
  t as libImport5,
} from "tslib";
function libHelper1(libParam204, libParam205) {
  var libValue426 =
      libParam205 && libParam205.cache ? libParam205.cache : libValue3,
    libValue427 =
      libParam205 && libParam205.serializer
        ? libParam205.serializer
        : libValue1;
  return (
    libParam205 && libParam205.strategy ? libParam205.strategy : libHelper6
  )(libParam204, {
    cache: libValue426,
    serializer: libValue427,
  });
}
function libHelper2(libParam260) {
  return (
    libParam260 == null ||
    typeof libParam260 == "number" ||
    typeof libParam260 == "boolean"
  );
}
function libHelper3(libParam235, libParam236, libParam237, libParam238) {
  var libValue453 = libHelper2(libParam238)
      ? libParam238
      : libParam237(libParam238),
    libValue454 = libParam236.get(libValue453);
  return (
    libValue454 === undefined &&
      ((libValue454 = libParam235.call(this, libParam238)),
      libParam236.set(libValue453, libValue454)),
    libValue454
  );
}
function libHelper4(libParam212, libParam213, libParam214) {
  var libValue433 = Array.prototype.slice.call(arguments, 3),
    libValue434 = libParam214(libValue433),
    libValue435 = libParam213.get(libValue434);
  return (
    libValue435 === undefined &&
      ((libValue435 = libParam212.apply(this, libValue433)),
      libParam213.set(libValue434, libValue435)),
    libValue435
  );
}
function libHelper5(
  libParam292,
  libParam293,
  libParam294,
  libParam295,
  libParam296,
) {
  return libParam294.bind(libParam293, libParam292, libParam295, libParam296);
}
function libHelper6(libParam253, libParam254) {
  var libValue462 = libParam253.length === 1 ? libHelper3 : libHelper4;
  return libHelper5(
    libParam253,
    this,
    libValue462,
    libParam254.cache.create(),
    libParam254.serializer,
  );
}
function libHelper7(libParam277, libParam278) {
  return libHelper5(
    libParam277,
    this,
    libHelper4,
    libParam278.cache.create(),
    libParam278.serializer,
  );
}
function libHelper8(libParam279, libParam280) {
  return libHelper5(
    libParam279,
    this,
    libHelper3,
    libParam280.cache.create(),
    libParam280.serializer,
  );
}
var libValue1 = function () {
    return JSON.stringify(arguments);
  },
  libValue2 = (function () {
    function libHelper97() {
      this.cache = Object.create(null);
    }
    return (
      (libHelper97.prototype.get = function (libParam304) {
        return this.cache[libParam304];
      }),
      (libHelper97.prototype.set = function (libParam305, libParam306) {
        this.cache[libParam305] = libParam306;
      }),
      libHelper97
    );
  })(),
  libValue3 = {
    create: function () {
      return new libValue2();
    },
  },
  libValue4 = {
    variadic: libHelper7,
    monadic: libHelper8,
  },
  libValue5;
(function (libParam23) {
  libParam23[(libParam23.EXPECT_ARGUMENT_CLOSING_BRACE = 1)] =
    "EXPECT_ARGUMENT_CLOSING_BRACE";
  libParam23[(libParam23.EMPTY_ARGUMENT = 2)] = "EMPTY_ARGUMENT";
  libParam23[(libParam23.MALFORMED_ARGUMENT = 3)] = "MALFORMED_ARGUMENT";
  libParam23[(libParam23.EXPECT_ARGUMENT_TYPE = 4)] = "EXPECT_ARGUMENT_TYPE";
  libParam23[(libParam23.INVALID_ARGUMENT_TYPE = 5)] = "INVALID_ARGUMENT_TYPE";
  libParam23[(libParam23.EXPECT_ARGUMENT_STYLE = 6)] = "EXPECT_ARGUMENT_STYLE";
  libParam23[(libParam23.INVALID_NUMBER_SKELETON = 7)] =
    "INVALID_NUMBER_SKELETON";
  libParam23[(libParam23.INVALID_DATE_TIME_SKELETON = 8)] =
    "INVALID_DATE_TIME_SKELETON";
  libParam23[(libParam23.EXPECT_NUMBER_SKELETON = 9)] =
    "EXPECT_NUMBER_SKELETON";
  libParam23[(libParam23.EXPECT_DATE_TIME_SKELETON = 10)] =
    "EXPECT_DATE_TIME_SKELETON";
  libParam23[(libParam23.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11)] =
    "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE";
  libParam23[(libParam23.EXPECT_SELECT_ARGUMENT_OPTIONS = 12)] =
    "EXPECT_SELECT_ARGUMENT_OPTIONS";
  libParam23[(libParam23.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13)] =
    "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE";
  libParam23[(libParam23.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14)] =
    "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE";
  libParam23[(libParam23.EXPECT_SELECT_ARGUMENT_SELECTOR = 15)] =
    "EXPECT_SELECT_ARGUMENT_SELECTOR";
  libParam23[(libParam23.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16)] =
    "EXPECT_PLURAL_ARGUMENT_SELECTOR";
  libParam23[(libParam23.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17)] =
    "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT";
  libParam23[(libParam23.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18)] =
    "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT";
  libParam23[(libParam23.INVALID_PLURAL_ARGUMENT_SELECTOR = 19)] =
    "INVALID_PLURAL_ARGUMENT_SELECTOR";
  libParam23[(libParam23.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20)] =
    "DUPLICATE_PLURAL_ARGUMENT_SELECTOR";
  libParam23[(libParam23.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21)] =
    "DUPLICATE_SELECT_ARGUMENT_SELECTOR";
  libParam23[(libParam23.MISSING_OTHER_CLAUSE = 22)] = "MISSING_OTHER_CLAUSE";
  libParam23[(libParam23.INVALID_TAG = 23)] = "INVALID_TAG";
  libParam23[(libParam23.INVALID_TAG_NAME = 25)] = "INVALID_TAG_NAME";
  libParam23[(libParam23.UNMATCHED_CLOSING_TAG = 26)] = "UNMATCHED_CLOSING_TAG";
  libParam23[(libParam23.UNCLOSED_TAG = 27)] = "UNCLOSED_TAG";
})((libValue5 ||= {}));
var libValue6;
(function (libParam131) {
  libParam131[(libParam131.literal = 0)] = "literal";
  libParam131[(libParam131.argument = 1)] = "argument";
  libParam131[(libParam131.number = 2)] = "number";
  libParam131[(libParam131.date = 3)] = "date";
  libParam131[(libParam131.time = 4)] = "time";
  libParam131[(libParam131.select = 5)] = "select";
  libParam131[(libParam131.plural = 6)] = "plural";
  libParam131[(libParam131.pound = 7)] = "pound";
  libParam131[(libParam131.tag = 8)] = "tag";
})((libValue6 ||= {}));
var libValue7;
(function (libParam259) {
  libParam259[(libParam259.number = 0)] = "number";
  libParam259[(libParam259.dateTime = 1)] = "dateTime";
})((libValue7 ||= {}));
function libHelper9(libParam323) {
  return libParam323.type === libValue6.literal;
}
function libHelper10(libParam312) {
  return libParam312.type === libValue6.argument;
}
function libHelper11(libParam324) {
  return libParam324.type === libValue6.number;
}
function libHelper12(libParam337) {
  return libParam337.type === libValue6.date;
}
function libHelper13(libParam338) {
  return libParam338.type === libValue6.time;
}
function libHelper14(libParam325) {
  return libParam325.type === libValue6.select;
}
function libHelper15(libParam326) {
  return libParam326.type === libValue6.plural;
}
function libHelper16(libParam329) {
  return libParam329.type === libValue6.pound;
}
function libHelper17(libParam340) {
  return libParam340.type === libValue6.tag;
}
function libHelper18(libParam267) {
  return !!(
    libParam267 &&
    typeof libParam267 == "object" &&
    libParam267.type === libValue7.number
  );
}
function libHelper19(libParam266) {
  return !!(
    libParam266 &&
    typeof libParam266 == "object" &&
    libParam266.type === libValue7.dateTime
  );
}
var libValue8 = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
  libValue9 =
    /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function libHelper20(libParam8) {
  var libValue116 = {};
  return (
    libParam8.replace(libValue9, function (libParam9) {
      var libValue117 = libParam9.length;
      switch (libParam9[0]) {
        case "G":
          libValue116.era =
            libValue117 === 4 ? "long" : libValue117 === 5 ? "narrow" : "short";
          break;
        case "y":
          libValue116.year = libValue117 === 2 ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw RangeError(
            "`Y/u/U/r` (year) patterns are not supported, use `y` instead",
          );
        case "q":
        case "Q":
          throw RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          libValue116.month = ["numeric", "2-digit", "short", "long", "narrow"][
            libValue117 - 1
          ];
          break;
        case "w":
        case "W":
          throw RangeError("`w/W` (week) patterns are not supported");
        case "d":
          libValue116.day = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw RangeError(
            "`D/F/g` (day) patterns are not supported, use `d` instead",
          );
        case "E":
          libValue116.weekday =
            libValue117 === 4 ? "long" : libValue117 === 5 ? "narrow" : "short";
          break;
        case "e":
          if (libValue117 < 4)
            throw RangeError("`e..eee` (weekday) patterns are not supported");
          libValue116.weekday = ["short", "long", "narrow", "short"][
            libValue117 - 4
          ];
          break;
        case "c":
          if (libValue117 < 4)
            throw RangeError("`c..ccc` (weekday) patterns are not supported");
          libValue116.weekday = ["short", "long", "narrow", "short"][
            libValue117 - 4
          ];
          break;
        case "a":
          libValue116.hour12 = true;
          break;
        case "b":
        case "B":
          throw RangeError(
            "`b/B` (period) patterns are not supported, use `a` instead",
          );
        case "h":
          libValue116.hourCycle = "h12";
          libValue116.hour = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "H":
          libValue116.hourCycle = "h23";
          libValue116.hour = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "K":
          libValue116.hourCycle = "h11";
          libValue116.hour = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "k":
          libValue116.hourCycle = "h24";
          libValue116.hour = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw RangeError(
            "`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead",
          );
        case "m":
          libValue116.minute = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "s":
          libValue116.second = ["numeric", "2-digit"][libValue117 - 1];
          break;
        case "S":
        case "A":
          throw RangeError(
            "`S/A` (second) patterns are not supported, use `s` instead",
          );
        case "z":
          libValue116.timeZoneName = libValue117 < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw RangeError(
            "`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead",
          );
      }
      return "";
    }),
    libValue116
  );
}
var libValue10 = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function libHelper21(libParam65) {
  if (libParam65.length === 0) throw Error("Number skeleton cannot be empty");
  for (
    var libValue242 = libParam65.split(libValue10).filter(function (item) {
        return item.length > 0;
      }),
      libValue243 = [],
      libValue244 = 0,
      libValue245 = libValue242;
    libValue244 < libValue245.length;
    libValue244++
  ) {
    var libValue246 = libValue245[libValue244].split("/");
    if (libValue246.length === 0) throw Error("Invalid number skeleton");
    for (
      var libValue247 = libValue246[0],
        libValue248 = libValue246.slice(1),
        libValue249 = 0,
        libValue250 = libValue248;
      libValue249 < libValue250.length;
      libValue249++
    )
      if (libValue250[libValue249].length === 0)
        throw Error("Invalid number skeleton");
    libValue243.push({
      stem: libValue247,
      options: libValue248,
    });
  }
  return libValue243;
}
function libHelper22(libParam303) {
  return libParam303.replace(/^(.*?)-/, "");
}
var libValue11 = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
  libValue12 = /^(@+)?(\+|#+)?[rs]?$/g,
  libValue13 = /(\*)(0+)|(#+)(0+)|(0+)/g,
  _e = /^(0+)$/;
function libHelper23(libParam51) {
  var libValue223 = {};
  return (
    libParam51[libParam51.length - 1] === "r"
      ? (libValue223.roundingPriority = "morePrecision")
      : libParam51[libParam51.length - 1] === "s" &&
        (libValue223.roundingPriority = "lessPrecision"),
    libParam51.replace(
      libValue12,
      function (libParam66, libParam67, libParam68) {
        return (
          typeof libParam68 == "string"
            ? libParam68 === "+"
              ? (libValue223.minimumSignificantDigits = libParam67.length)
              : libParam67[0] === "#"
                ? (libValue223.maximumSignificantDigits = libParam67.length)
                : ((libValue223.minimumSignificantDigits = libParam67.length),
                  (libValue223.maximumSignificantDigits =
                    libParam67.length +
                    (typeof libParam68 == "string" ? libParam68.length : 0)))
            : ((libValue223.minimumSignificantDigits = libParam67.length),
              (libValue223.maximumSignificantDigits = libParam67.length)),
          ""
        );
      },
    ),
    libValue223
  );
}
function libHelper24(libParam54) {
  switch (libParam54) {
    case "sign-auto":
      return {
        signDisplay: "auto",
      };
    case "sign-accounting":
    case "()":
      return {
        currencySign: "accounting",
      };
    case "sign-always":
    case "+!":
      return {
        signDisplay: "always",
      };
    case "sign-accounting-always":
    case "()!":
      return {
        signDisplay: "always",
        currencySign: "accounting",
      };
    case "sign-except-zero":
    case "+?":
      return {
        signDisplay: "exceptZero",
      };
    case "sign-accounting-except-zero":
    case "()?":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting",
      };
    case "sign-never":
    case "+_":
      return {
        signDisplay: "never",
      };
  }
}
function be(libParam61) {
  var libValue231;
  if (
    (libParam61[0] === "E" && libParam61[1] === "E"
      ? ((libValue231 = {
          notation: "engineering",
        }),
        (libParam61 = libParam61.slice(2)))
      : libParam61[0] === "E" &&
        ((libValue231 = {
          notation: "scientific",
        }),
        (libParam61 = libParam61.slice(1))),
    libValue231)
  ) {
    var libValue232 = libParam61.slice(0, 2);
    if (
      (libValue232 === "+!"
        ? ((libValue231.signDisplay = "always"),
          (libParam61 = libParam61.slice(2)))
        : libValue232 === "+?" &&
          ((libValue231.signDisplay = "exceptZero"),
          (libParam61 = libParam61.slice(2))),
      !_e.test(libParam61))
    )
      throw Error("Malformed concise eng/scientific notation");
    libValue231.minimumIntegerDigits = libParam61.length;
  }
  return libValue231;
}
function libHelper25(libParam342) {
  return libHelper24(libParam342) || {};
}
function libHelper26(libParam2) {
  for (
    var libValue74 = {}, libValue75 = 0, libValue76 = libParam2;
    libValue75 < libValue76.length;
    libValue75++
  ) {
    var libValue77 = libValue76[libValue75];
    switch (libValue77.stem) {
      case "percent":
      case "%":
        libValue74.style = "percent";
        continue;
      case "%x100":
        libValue74.style = "percent";
        libValue74.scale = 100;
        continue;
      case "currency":
        libValue74.style = "currency";
        libValue74.currency = libValue77.options[0];
        continue;
      case "group-off":
      case ",_":
        libValue74.useGrouping = false;
        continue;
      case "precision-integer":
      case ".":
        libValue74.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
      case "unit":
        libValue74.style = "unit";
        libValue74.unit = libHelper22(libValue77.options[0]);
        continue;
      case "compact-short":
      case "K":
        libValue74.notation = "compact";
        libValue74.compactDisplay = "short";
        continue;
      case "compact-long":
      case "KK":
        libValue74.notation = "compact";
        libValue74.compactDisplay = "long";
        continue;
      case "scientific":
        libValue74 = libImport5(
          libImport5(libImport5({}, libValue74), {
            notation: "scientific",
          }),
          libValue77.options.reduce(function (accumulator, current) {
            return libImport5(
              libImport5({}, accumulator),
              libHelper25(current),
            );
          }, {}),
        );
        continue;
      case "engineering":
        libValue74 = libImport5(
          libImport5(libImport5({}, libValue74), {
            notation: "engineering",
          }),
          libValue77.options.reduce(function (accumulator, current) {
            return libImport5(
              libImport5({}, accumulator),
              libHelper25(current),
            );
          }, {}),
        );
        continue;
      case "notation-simple":
        libValue74.notation = "standard";
        continue;
      case "unit-width-narrow":
        libValue74.currencyDisplay = "narrowSymbol";
        libValue74.unitDisplay = "narrow";
        continue;
      case "unit-width-short":
        libValue74.currencyDisplay = "code";
        libValue74.unitDisplay = "short";
        continue;
      case "unit-width-full-name":
        libValue74.currencyDisplay = "name";
        libValue74.unitDisplay = "long";
        continue;
      case "unit-width-iso-code":
        libValue74.currencyDisplay = "symbol";
        continue;
      case "scale":
        libValue74.scale = parseFloat(libValue77.options[0]);
        continue;
      case "rounding-mode-floor":
        libValue74.roundingMode = "floor";
        continue;
      case "rounding-mode-ceiling":
        libValue74.roundingMode = "ceil";
        continue;
      case "rounding-mode-down":
        libValue74.roundingMode = "trunc";
        continue;
      case "rounding-mode-up":
        libValue74.roundingMode = "expand";
        continue;
      case "rounding-mode-half-even":
        libValue74.roundingMode = "halfEven";
        continue;
      case "rounding-mode-half-down":
        libValue74.roundingMode = "halfTrunc";
        continue;
      case "rounding-mode-half-up":
        libValue74.roundingMode = "halfExpand";
        continue;
      case "integer-width":
        if (libValue77.options.length > 1)
          throw RangeError(
            "integer-width stems only accept a single optional option",
          );
        libValue77.options[0].replace(
          libValue13,
          function (
            libParam142,
            libParam143,
            libParam144,
            libParam145,
            libParam146,
            libParam147,
          ) {
            if (libParam143)
              libValue74.minimumIntegerDigits = libParam144.length;
            else if (libParam145 && libParam146)
              throw Error("We currently do not support maximum integer digits");
            else if (libParam147)
              throw Error("We currently do not support exact integer digits");
            return "";
          },
        );
        continue;
    }
    if (_e.test(libValue77.stem)) {
      libValue74.minimumIntegerDigits = libValue77.stem.length;
      continue;
    }
    if (libValue11.test(libValue77.stem)) {
      if (libValue77.options.length > 1)
        throw RangeError(
          "Fraction-precision stems only accept a single optional option",
        );
      libValue77.stem.replace(
        libValue11,
        function (
          libParam73,
          libParam74,
          libParam75,
          libParam76,
          libParam77,
          libParam78,
        ) {
          return (
            libParam75 === "*"
              ? (libValue74.minimumFractionDigits = libParam74.length)
              : libParam76 && libParam76[0] === "#"
                ? (libValue74.maximumFractionDigits = libParam76.length)
                : libParam77 && libParam78
                  ? ((libValue74.minimumFractionDigits = libParam77.length),
                    (libValue74.maximumFractionDigits =
                      libParam77.length + libParam78.length))
                  : ((libValue74.minimumFractionDigits = libParam74.length),
                    (libValue74.maximumFractionDigits = libParam74.length)),
            ""
          );
        },
      );
      var libValue78 = libValue77.options[0];
      libValue78 === "w"
        ? (libValue74 = libImport5(libImport5({}, libValue74), {
            trailingZeroDisplay: "stripIfInteger",
          }))
        : libValue78 &&
          (libValue74 = libImport5(
            libImport5({}, libValue74),
            libHelper23(libValue78),
          ));
      continue;
    }
    if (libValue12.test(libValue77.stem)) {
      libValue74 = libImport5(
        libImport5({}, libValue74),
        libHelper23(libValue77.stem),
      );
      continue;
    }
    var libValue79 = libHelper24(libValue77.stem);
    libValue79 &&
      (libValue74 = libImport5(libImport5({}, libValue74), libValue79));
    var libValue80 = be(libValue77.stem);
    libValue80 &&
      (libValue74 = libImport5(libImport5({}, libValue74), libValue80));
  }
  return libValue74;
}
var libValue14 = {
  "001": ["H", "h"],
  419: ["h", "H", "hB", "hb"],
  AC: ["H", "h", "hb", "hB"],
  AD: ["H", "hB"],
  AE: ["h", "hB", "hb", "H"],
  AF: ["H", "hb", "hB", "h"],
  AG: ["h", "hb", "H", "hB"],
  AI: ["H", "h", "hb", "hB"],
  AL: ["h", "H", "hB"],
  AM: ["H", "hB"],
  AO: ["H", "hB"],
  AR: ["h", "H", "hB", "hb"],
  AS: ["h", "H"],
  AT: ["H", "hB"],
  AU: ["h", "hb", "H", "hB"],
  AW: ["H", "hB"],
  AX: ["H"],
  AZ: ["H", "hB", "h"],
  BA: ["H", "hB", "h"],
  BB: ["h", "hb", "H", "hB"],
  BD: ["h", "hB", "H"],
  BE: ["H", "hB"],
  BF: ["H", "hB"],
  BG: ["H", "hB", "h"],
  BH: ["h", "hB", "hb", "H"],
  BI: ["H", "h"],
  BJ: ["H", "hB"],
  BL: ["H", "hB"],
  BM: ["h", "hb", "H", "hB"],
  BN: ["hb", "hB", "h", "H"],
  BO: ["h", "H", "hB", "hb"],
  BQ: ["H"],
  BR: ["H", "hB"],
  BS: ["h", "hb", "H", "hB"],
  BT: ["h", "H"],
  BW: ["H", "h", "hb", "hB"],
  BY: ["H", "h"],
  BZ: ["H", "h", "hb", "hB"],
  CA: ["h", "hb", "H", "hB"],
  CC: ["H", "h", "hb", "hB"],
  CD: ["hB", "H"],
  CF: ["H", "h", "hB"],
  CG: ["H", "hB"],
  CH: ["H", "hB", "h"],
  CI: ["H", "hB"],
  CK: ["H", "h", "hb", "hB"],
  CL: ["h", "H", "hB", "hb"],
  CM: ["H", "h", "hB"],
  CN: ["H", "hB", "hb", "h"],
  CO: ["h", "H", "hB", "hb"],
  CP: ["H"],
  CR: ["h", "H", "hB", "hb"],
  CU: ["h", "H", "hB", "hb"],
  CV: ["H", "hB"],
  CW: ["H", "hB"],
  CX: ["H", "h", "hb", "hB"],
  CY: ["h", "H", "hb", "hB"],
  CZ: ["H"],
  DE: ["H", "hB"],
  DG: ["H", "h", "hb", "hB"],
  DJ: ["h", "H"],
  DK: ["H"],
  DM: ["h", "hb", "H", "hB"],
  DO: ["h", "H", "hB", "hb"],
  DZ: ["h", "hB", "hb", "H"],
  EA: ["H", "h", "hB", "hb"],
  EC: ["h", "H", "hB", "hb"],
  EE: ["H", "hB"],
  EG: ["h", "hB", "hb", "H"],
  EH: ["h", "hB", "hb", "H"],
  ER: ["h", "H"],
  ES: ["H", "hB", "h", "hb"],
  ET: ["hB", "hb", "h", "H"],
  FI: ["H"],
  FJ: ["h", "hb", "H", "hB"],
  FK: ["H", "h", "hb", "hB"],
  FM: ["h", "hb", "H", "hB"],
  FO: ["H", "h"],
  FR: ["H", "hB"],
  GA: ["H", "hB"],
  GB: ["H", "h", "hb", "hB"],
  GD: ["h", "hb", "H", "hB"],
  GE: ["H", "hB", "h"],
  GF: ["H", "hB"],
  GG: ["H", "h", "hb", "hB"],
  GH: ["h", "H"],
  GI: ["H", "h", "hb", "hB"],
  GL: ["H", "h"],
  GM: ["h", "hb", "H", "hB"],
  GN: ["H", "hB"],
  GP: ["H", "hB"],
  GQ: ["H", "hB", "h", "hb"],
  GR: ["h", "H", "hb", "hB"],
  GT: ["h", "H", "hB", "hb"],
  GU: ["h", "hb", "H", "hB"],
  GW: ["H", "hB"],
  GY: ["h", "hb", "H", "hB"],
  HK: ["h", "hB", "hb", "H"],
  HN: ["h", "H", "hB", "hb"],
  HR: ["H", "hB"],
  HU: ["H", "h"],
  IC: ["H", "h", "hB", "hb"],
  ID: ["H"],
  IE: ["H", "h", "hb", "hB"],
  IL: ["H", "hB"],
  IM: ["H", "h", "hb", "hB"],
  IN: ["h", "H"],
  IO: ["H", "h", "hb", "hB"],
  IQ: ["h", "hB", "hb", "H"],
  IR: ["hB", "H"],
  IS: ["H"],
  IT: ["H", "hB"],
  JE: ["H", "h", "hb", "hB"],
  JM: ["h", "hb", "H", "hB"],
  JO: ["h", "hB", "hb", "H"],
  JP: ["H", "K", "h"],
  KE: ["hB", "hb", "H", "h"],
  KG: ["H", "h", "hB", "hb"],
  KH: ["hB", "h", "H", "hb"],
  KI: ["h", "hb", "H", "hB"],
  KM: ["H", "h", "hB", "hb"],
  KN: ["h", "hb", "H", "hB"],
  KP: ["h", "H", "hB", "hb"],
  KR: ["h", "H", "hB", "hb"],
  KW: ["h", "hB", "hb", "H"],
  KY: ["h", "hb", "H", "hB"],
  KZ: ["H", "hB"],
  LA: ["H", "hb", "hB", "h"],
  LB: ["h", "hB", "hb", "H"],
  LC: ["h", "hb", "H", "hB"],
  LI: ["H", "hB", "h"],
  LK: ["H", "h", "hB", "hb"],
  LR: ["h", "hb", "H", "hB"],
  LS: ["h", "H"],
  LT: ["H", "h", "hb", "hB"],
  LU: ["H", "h", "hB"],
  LV: ["H", "hB", "hb", "h"],
  LY: ["h", "hB", "hb", "H"],
  MA: ["H", "h", "hB", "hb"],
  MC: ["H", "hB"],
  MD: ["H", "hB"],
  ME: ["H", "hB", "h"],
  MF: ["H", "hB"],
  MG: ["H", "h"],
  MH: ["h", "hb", "H", "hB"],
  MK: ["H", "h", "hb", "hB"],
  ML: ["H"],
  MM: ["hB", "hb", "H", "h"],
  MN: ["H", "h", "hb", "hB"],
  MO: ["h", "hB", "hb", "H"],
  MP: ["h", "hb", "H", "hB"],
  MQ: ["H", "hB"],
  MR: ["h", "hB", "hb", "H"],
  MS: ["H", "h", "hb", "hB"],
  MT: ["H", "h"],
  MU: ["H", "h"],
  MV: ["H", "h"],
  MW: ["h", "hb", "H", "hB"],
  MX: ["h", "H", "hB", "hb"],
  MY: ["hb", "hB", "h", "H"],
  MZ: ["H", "hB"],
  NA: ["h", "H", "hB", "hb"],
  NC: ["H", "hB"],
  NE: ["H"],
  NF: ["H", "h", "hb", "hB"],
  NG: ["H", "h", "hb", "hB"],
  NI: ["h", "H", "hB", "hb"],
  NL: ["H", "hB"],
  NO: ["H", "h"],
  NP: ["H", "h", "hB"],
  NR: ["H", "h", "hb", "hB"],
  NU: ["H", "h", "hb", "hB"],
  NZ: ["h", "hb", "H", "hB"],
  OM: ["h", "hB", "hb", "H"],
  PA: ["h", "H", "hB", "hb"],
  PE: ["h", "H", "hB", "hb"],
  PF: ["H", "h", "hB"],
  PG: ["h", "H"],
  PH: ["h", "hB", "hb", "H"],
  PK: ["h", "hB", "H"],
  PL: ["H", "h"],
  PM: ["H", "hB"],
  PN: ["H", "h", "hb", "hB"],
  PR: ["h", "H", "hB", "hb"],
  PS: ["h", "hB", "hb", "H"],
  PT: ["H", "hB"],
  PW: ["h", "H"],
  PY: ["h", "H", "hB", "hb"],
  QA: ["h", "hB", "hb", "H"],
  RE: ["H", "hB"],
  RO: ["H", "hB"],
  RS: ["H", "hB", "h"],
  RU: ["H"],
  RW: ["H", "h"],
  SA: ["h", "hB", "hb", "H"],
  SB: ["h", "hb", "H", "hB"],
  SC: ["H", "h", "hB"],
  SD: ["h", "hB", "hb", "H"],
  SE: ["H"],
  SG: ["h", "hb", "H", "hB"],
  SH: ["H", "h", "hb", "hB"],
  SI: ["H", "hB"],
  SJ: ["H"],
  SK: ["H"],
  SL: ["h", "hb", "H", "hB"],
  SM: ["H", "h", "hB"],
  SN: ["H", "h", "hB"],
  SO: ["h", "H"],
  SR: ["H", "hB"],
  SS: ["h", "hb", "H", "hB"],
  ST: ["H", "hB"],
  SV: ["h", "H", "hB", "hb"],
  SX: ["H", "h", "hb", "hB"],
  SY: ["h", "hB", "hb", "H"],
  SZ: ["h", "hb", "H", "hB"],
  TA: ["H", "h", "hb", "hB"],
  TC: ["h", "hb", "H", "hB"],
  TD: ["h", "H", "hB"],
  TF: ["H", "h", "hB"],
  TG: ["H", "hB"],
  TH: ["H", "h"],
  TJ: ["H", "h"],
  TL: ["H", "hB", "hb", "h"],
  TM: ["H", "h"],
  TN: ["h", "hB", "hb", "H"],
  TO: ["h", "H"],
  TR: ["H", "hB"],
  TT: ["h", "hb", "H", "hB"],
  TW: ["hB", "hb", "h", "H"],
  TZ: ["hB", "hb", "H", "h"],
  UA: ["H", "hB", "h"],
  UG: ["hB", "hb", "H", "h"],
  UM: ["h", "hb", "H", "hB"],
  US: ["h", "hb", "H", "hB"],
  UY: ["h", "H", "hB", "hb"],
  UZ: ["H", "hB", "h"],
  VA: ["H", "h", "hB"],
  VC: ["h", "hb", "H", "hB"],
  VE: ["h", "H", "hB", "hb"],
  VG: ["h", "hb", "H", "hB"],
  VI: ["h", "hb", "H", "hB"],
  VN: ["H", "h"],
  VU: ["h", "H"],
  WF: ["H", "hB"],
  WS: ["h", "H"],
  XK: ["H", "hB", "h"],
  YE: ["h", "hB", "hb", "H"],
  YT: ["H", "hB"],
  ZA: ["H", "h", "hb", "hB"],
  ZM: ["h", "hb", "H", "hB"],
  ZW: ["H", "h"],
  "af-ZA": ["H", "h", "hB", "hb"],
  "ar-001": ["h", "hB", "hb", "H"],
  "ca-ES": ["H", "h", "hB"],
  "en-001": ["h", "hb", "H", "hB"],
  "en-HK": ["h", "hb", "H", "hB"],
  "en-IL": ["H", "h", "hb", "hB"],
  "en-MY": ["h", "hb", "H", "hB"],
  "es-BR": ["H", "h", "hB", "hb"],
  "es-ES": ["H", "h", "hB", "hb"],
  "es-GQ": ["H", "h", "hB", "hb"],
  "fr-CA": ["H", "h", "hB"],
  "gl-ES": ["H", "h", "hB"],
  "gu-IN": ["hB", "hb", "h", "H"],
  "hi-IN": ["hB", "h", "H"],
  "it-CH": ["H", "h", "hB"],
  "it-IT": ["H", "h", "hB"],
  "kn-IN": ["hB", "h", "H"],
  "ml-IN": ["hB", "h", "H"],
  "mr-IN": ["hB", "hb", "h", "H"],
  "pa-IN": ["hB", "hb", "h", "H"],
  "ta-IN": ["hB", "h", "hb", "H"],
  "te-IN": ["hB", "h", "H"],
  "zu-ZA": ["H", "hB", "hb", "h"],
};
function libHelper27(libParam94, libParam95) {
  for (
    var libValue288 = "", libValue289 = 0;
    libValue289 < libParam94.length;
    libValue289++
  ) {
    var libValue290 = libParam94.charAt(libValue289);
    if (libValue290 === "j") {
      for (
        var libValue291 = 0;
        libValue289 + 1 < libParam94.length &&
        libParam94.charAt(libValue289 + 1) === libValue290;
      ) {
        libValue291++;
        libValue289++;
      }
      var libValue292 = 1 + (libValue291 & 1),
        libValue293 = libValue291 < 2 ? 1 : 3 + (libValue291 >> 1),
        libValue294 = "a",
        libValue295 = libHelper28(libParam95);
      for (
        (libValue295 == "H" || libValue295 == "k") && (libValue293 = 0);
        libValue293-- > 0;
      )
        libValue288 += libValue294;
      for (; libValue292-- > 0; ) libValue288 = libValue295 + libValue288;
    } else
      libValue290 === "J" ? (libValue288 += "H") : (libValue288 += libValue290);
  }
  return libValue288;
}
function libHelper28(libParam64) {
  var libValue239 = libParam64.hourCycle;
  if (
    (libValue239 === undefined &&
      libParam64.hourCycles &&
      libParam64.hourCycles.length &&
      (libValue239 = libParam64.hourCycles[0]),
    libValue239)
  )
    switch (libValue239) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw Error("Invalid hourCycle");
    }
  var libValue240 = libParam64.language,
    libValue241;
  return (
    libValue240 !== "root" && (libValue241 = libParam64.maximize().region),
    (libValue14[libValue241 || ""] ||
      libValue14[libValue240 || ""] ||
      libValue14[`${libValue240}-001`] ||
      libValue14["001"])[0]
  );
}
var libValue15 = RegExp(`^${libValue8.source}*`),
  libValue16 = RegExp(`${libValue8.source}*\$`);
function libHelper29(libParam308, libParam309) {
  return {
    start: libParam308,
    end: libParam309,
  };
}
var libValue17 = !!String.prototype.startsWith && "_a".startsWith("a", 1),
  libValue18 = !!String.fromCodePoint,
  libValue19 = !!Object.fromEntries,
  libValue20 = !!String.prototype.codePointAt,
  libValue21 = !!String.prototype.trimStart,
  libValue22 = !!String.prototype.trimEnd,
  libValue23 = Number.isSafeInteger
    ? Number.isSafeInteger
    : function (libParam203) {
        return (
          typeof libParam203 == "number" &&
          isFinite(libParam203) &&
          Math.floor(libParam203) === libParam203 &&
          Math.abs(libParam203) <= 9007199254740991
        );
      },
  libValue24 = true;
try {
  libValue24 =
    libHelper30("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec(
      "a",
    )?.[0] === "a";
} catch {
  libValue24 = false;
}
var libValue25 = libValue17
    ? function (libParam289, libParam290, libParam291) {
        return libParam289.startsWith(libParam290, libParam291);
      }
    : function (libParam281, libParam282, libParam283) {
        return (
          libParam281.slice(libParam283, libParam283 + libParam282.length) ===
          libParam282
        );
      },
  libValue26 = libValue18
    ? String.fromCodePoint
    : function () {
        for (
          var libValue296 = [...arguments],
            libValue297 = "",
            libValue298 = libValue296.length,
            libValue299 = 0,
            libValue300;
          libValue298 > libValue299;
        ) {
          if (
            ((libValue300 = libValue296[libValue299++]), libValue300 > 1114111)
          )
            throw RangeError(libValue300 + " is not a valid code point");
          libValue297 +=
            libValue300 < 65536
              ? String.fromCharCode(libValue300)
              : String.fromCharCode(
                  ((libValue300 -= 65536) >> 10) + 55296,
                  (libValue300 % 1024) + 56320,
                );
        }
        return libValue297;
      },
  libValue27 = libValue19
    ? Object.fromEntries
    : function (libParam208) {
        for (
          var libValue428 = {}, libValue429 = 0, libValue430 = libParam208;
          libValue429 < libValue430.length;
          libValue429++
        ) {
          var libValue431 = libValue430[libValue429],
            libValue432 = libValue431[0];
          libValue428[libValue432] = libValue431[1];
        }
        return libValue428;
      },
  libValue28 = libValue20
    ? function (libParam297, libParam298) {
        return libParam297.codePointAt(libParam298);
      }
    : function (libParam110, libParam111) {
        var libValue320 = libParam110.length;
        if (!(libParam111 < 0 || libParam111 >= libValue320)) {
          var libValue321 = libParam110.charCodeAt(libParam111),
            libValue322;
          return libValue321 < 55296 ||
            libValue321 > 56319 ||
            libParam111 + 1 === libValue320 ||
            (libValue322 = libParam110.charCodeAt(libParam111 + 1)) < 56320 ||
            libValue322 > 57343
            ? libValue321
            : ((libValue321 - 55296) << 10) + (libValue322 - 56320) + 65536;
        }
      },
  libValue29 = libValue21
    ? function (libParam307) {
        return libParam307.trimStart();
      }
    : function (libParam301) {
        return libParam301.replace(libValue15, "");
      },
  libValue30 = libValue22
    ? function (libParam311) {
        return libParam311.trimEnd();
      }
    : function (libParam302) {
        return libParam302.replace(libValue16, "");
      };
function libHelper30(libParam327, libParam328) {
  return new RegExp(libParam327, libParam328);
}
var libValue31;
if (libValue24) {
  var libValue32 = libHelper30(
    "([^\\p{White_Space}\\p{Pattern_Syntax}]*)",
    "yu",
  );
  libValue31 = function (libParam284, libParam285) {
    return (
      (libValue32.lastIndex = libParam285),
      libValue32.exec(libParam284)[1] ?? ""
    );
  };
} else
  libValue31 = function (libParam180, libParam181) {
    for (var libValue408 = []; ; ) {
      var libValue409 = libValue28(libParam180, libParam181);
      if (
        libValue409 === undefined ||
        libHelper34(libValue409) ||
        libHelper35(libValue409)
      )
        break;
      libValue408.push(libValue409);
      libParam181 += libValue409 >= 65536 ? 2 : 1;
    }
    return libValue26.apply(undefined, libValue408);
  };
var libValue33 = (function () {
  function libHelper83(libParam126, libParam127) {
    libParam127 === undefined && (libParam127 = {});
    this.message = libParam126;
    this.position = {
      offset: 0,
      line: 1,
      column: 1,
    };
    this.ignoreTag = !!libParam127.ignoreTag;
    this.locale = libParam127.locale;
    this.requiresOtherClause = !!libParam127.requiresOtherClause;
    this.shouldParseSkeletons = !!libParam127.shouldParseSkeletons;
  }
  return (
    (libHelper83.prototype.parse = function () {
      if (this.offset() !== 0) throw Error("parser can only be used once");
      return this.parseMessage(0, "", false);
    }),
    (libHelper83.prototype.parseMessage = function (
      libParam42,
      libParam43,
      libParam44,
    ) {
      for (var libValue209 = []; !this.isEOF(); ) {
        var libValue210 = this.char();
        if (libValue210 === 123) {
          var libValue211 = this.parseArgument(libParam42, libParam44);
          if (libValue211.err) return libValue211;
          libValue209.push(libValue211.val);
        } else if (libValue210 === 125 && libParam42 > 0) break;
        else if (
          libValue210 === 35 &&
          (libParam43 === "plural" || libParam43 === "selectordinal")
        ) {
          var libValue212 = this.clonePosition();
          this.bump();
          libValue209.push({
            type: libValue6.pound,
            location: libHelper29(libValue212, this.clonePosition()),
          });
        } else if (
          libValue210 === 60 &&
          !this.ignoreTag &&
          this.peek() === 47
        ) {
          if (libParam44) break;
          return this.error(
            libValue5.UNMATCHED_CLOSING_TAG,
            libHelper29(this.clonePosition(), this.clonePosition()),
          );
        } else if (
          libValue210 === 60 &&
          !this.ignoreTag &&
          libHelper31(this.peek() || 0)
        ) {
          var libValue211 = this.parseTag(libParam42, libParam43);
          if (libValue211.err) return libValue211;
          libValue209.push(libValue211.val);
        } else {
          var libValue211 = this.parseLiteral(libParam42, libParam43);
          if (libValue211.err) return libValue211;
          libValue209.push(libValue211.val);
        }
      }
      return {
        val: libValue209,
        err: null,
      };
    }),
    (libHelper83.prototype.parseTag = function (libParam38, libParam39) {
      var libValue184 = this.clonePosition();
      this.bump();
      var libValue185 = this.parseTagName();
      if ((this.bumpSpace(), this.bumpIf("/>")))
        return {
          val: {
            type: libValue6.literal,
            value: `<${libValue185}/>`,
            location: libHelper29(libValue184, this.clonePosition()),
          },
          err: null,
        };
      if (this.bumpIf(">")) {
        var libValue186 = this.parseMessage(libParam38 + 1, libParam39, true);
        if (libValue186.err) return libValue186;
        var libValue187 = libValue186.val,
          libValue188 = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !libHelper31(this.char()))
            return this.error(
              libValue5.INVALID_TAG,
              libHelper29(libValue188, this.clonePosition()),
            );
          var libValue189 = this.clonePosition();
          return libValue185 === this.parseTagName()
            ? (this.bumpSpace(),
              this.bumpIf(">")
                ? {
                    val: {
                      type: libValue6.tag,
                      value: libValue185,
                      children: libValue187,
                      location: libHelper29(libValue184, this.clonePosition()),
                    },
                    err: null,
                  }
                : this.error(
                    libValue5.INVALID_TAG,
                    libHelper29(libValue188, this.clonePosition()),
                  ))
            : this.error(
                libValue5.UNMATCHED_CLOSING_TAG,
                libHelper29(libValue189, this.clonePosition()),
              );
        } else
          return this.error(
            libValue5.UNCLOSED_TAG,
            libHelper29(libValue184, this.clonePosition()),
          );
      } else
        return this.error(
          libValue5.INVALID_TAG,
          libHelper29(libValue184, this.clonePosition()),
        );
    }),
    (libHelper83.prototype.parseTagName = function () {
      var libValue439 = this.offset();
      for (this.bump(); !this.isEOF() && libHelper33(this.char()); )
        this.bump();
      return this.message.slice(libValue439, this.offset());
    }),
    (libHelper83.prototype.parseLiteral = function (libParam62, libParam63) {
      for (var libValue233 = this.clonePosition(), libValue234 = ""; ; ) {
        var libValue235 = this.tryParseQuote(libParam63);
        if (libValue235) {
          libValue234 += libValue235;
          continue;
        }
        var libValue236 = this.tryParseUnquoted(libParam62, libParam63);
        if (libValue236) {
          libValue234 += libValue236;
          continue;
        }
        var libValue237 = this.tryParseLeftAngleBracket();
        if (libValue237) {
          libValue234 += libValue237;
          continue;
        }
        break;
      }
      var libValue238 = libHelper29(libValue233, this.clonePosition());
      return {
        val: {
          type: libValue6.literal,
          value: libValue234,
          location: libValue238,
        },
        err: null,
      };
    }),
    (libHelper83.prototype.tryParseLeftAngleBracket = function () {
      return !this.isEOF() &&
        this.char() === 60 &&
        (this.ignoreTag || !libHelper32(this.peek() || 0))
        ? (this.bump(), "<")
        : null;
    }),
    (libHelper83.prototype.tryParseQuote = function (libParam50) {
      if (this.isEOF() || this.char() !== 39) return null;
      switch (this.peek()) {
        case 39:
          return (this.bump(), this.bump(), "'");
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if (libParam50 === "plural" || libParam50 === "selectordinal") break;
          return null;
        default:
          return null;
      }
      this.bump();
      var libValue221 = [this.char()];
      for (this.bump(); !this.isEOF(); ) {
        var libValue222 = this.char();
        if (libValue222 === 39) {
          if (this.peek() === 39) {
            libValue221.push(39);
            this.bump();
          } else {
            this.bump();
            break;
          }
        } else libValue221.push(libValue222);
        this.bump();
      }
      return libValue26.apply(undefined, libValue221);
    }),
    (libHelper83.prototype.tryParseUnquoted = function (
      libParam157,
      libParam158,
    ) {
      if (this.isEOF()) return null;
      var libValue372 = this.char();
      return libValue372 === 60 ||
        libValue372 === 123 ||
        (libValue372 === 35 &&
          (libParam158 === "plural" || libParam158 === "selectordinal")) ||
        (libValue372 === 125 && libParam157 > 0)
        ? null
        : (this.bump(), libValue26(libValue372));
    }),
    (libHelper83.prototype.parseArgument = function (libParam36, libParam37) {
      var libValue182 = this.clonePosition();
      if ((this.bump(), this.bumpSpace(), this.isEOF()))
        return this.error(
          libValue5.EXPECT_ARGUMENT_CLOSING_BRACE,
          libHelper29(libValue182, this.clonePosition()),
        );
      if (this.char() === 125)
        return (
          this.bump(),
          this.error(
            libValue5.EMPTY_ARGUMENT,
            libHelper29(libValue182, this.clonePosition()),
          )
        );
      var libValue183 = this.parseIdentifierIfPossible().value;
      if (!libValue183)
        return this.error(
          libValue5.MALFORMED_ARGUMENT,
          libHelper29(libValue182, this.clonePosition()),
        );
      if ((this.bumpSpace(), this.isEOF()))
        return this.error(
          libValue5.EXPECT_ARGUMENT_CLOSING_BRACE,
          libHelper29(libValue182, this.clonePosition()),
        );
      switch (this.char()) {
        case 125:
          return (
            this.bump(),
            {
              val: {
                type: libValue6.argument,
                value: libValue183,
                location: libHelper29(libValue182, this.clonePosition()),
              },
              err: null,
            }
          );
        case 44:
          return (
            this.bump(),
            this.bumpSpace(),
            this.isEOF()
              ? this.error(
                  libValue5.EXPECT_ARGUMENT_CLOSING_BRACE,
                  libHelper29(libValue182, this.clonePosition()),
                )
              : this.parseArgumentOptions(
                  libParam36,
                  libParam37,
                  libValue183,
                  libValue182,
                )
          );
        default:
          return this.error(
            libValue5.MALFORMED_ARGUMENT,
            libHelper29(libValue182, this.clonePosition()),
          );
      }
    }),
    (libHelper83.prototype.parseIdentifierIfPossible = function () {
      var libValue382 = this.clonePosition(),
        libValue383 = this.offset(),
        libValue384 = libValue31(this.message, libValue383),
        libValue385 = libValue383 + libValue384.length;
      return (
        this.bumpTo(libValue385),
        {
          value: libValue384,
          location: libHelper29(libValue382, this.clonePosition()),
        }
      );
    }),
    (libHelper83.prototype.parseArgumentOptions = function (
      libParam3,
      libParam4,
      libParam5,
      libParam6,
    ) {
      var libValue81 = this.clonePosition(),
        libValue82 = this.parseIdentifierIfPossible().value,
        libValue83 = this.clonePosition();
      switch (libValue82) {
        case "":
          return this.error(
            libValue5.EXPECT_ARGUMENT_TYPE,
            libHelper29(libValue81, libValue83),
          );
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var libValue84 = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var libValue85 = this.clonePosition(),
              libValue86 = this.parseSimpleArgStyleIfPossible();
            if (libValue86.err) return libValue86;
            var libValue87 = libValue30(libValue86.val);
            if (libValue87.length === 0)
              return this.error(
                libValue5.EXPECT_ARGUMENT_STYLE,
                libHelper29(this.clonePosition(), this.clonePosition()),
              );
            libValue84 = {
              style: libValue87,
              styleLocation: libHelper29(libValue85, this.clonePosition()),
            };
          }
          var libValue88 = this.tryParseArgumentClose(libParam6);
          if (libValue88.err) return libValue88;
          var libValue89 = libHelper29(libParam6, this.clonePosition());
          if (libValue84 && libValue25(libValue84?.style, "::", 0)) {
            var libValue90 = libValue29(libValue84.style.slice(2));
            if (libValue82 === "number") {
              var libValue86 = this.parseNumberSkeletonFromString(
                libValue90,
                libValue84.styleLocation,
              );
              return libValue86.err
                ? libValue86
                : {
                    val: {
                      type: libValue6.number,
                      value: libParam5,
                      location: libValue89,
                      style: libValue86.val,
                    },
                    err: null,
                  };
            } else {
              if (libValue90.length === 0)
                return this.error(
                  libValue5.EXPECT_DATE_TIME_SKELETON,
                  libValue89,
                );
              var libValue91 = libValue90;
              this.locale &&
                (libValue91 = libHelper27(libValue90, this.locale));
              var libValue87 = {
                type: libValue7.dateTime,
                pattern: libValue91,
                location: libValue84.styleLocation,
                parsedOptions: this.shouldParseSkeletons
                  ? libHelper20(libValue91)
                  : {},
              };
              return {
                val: {
                  type: libValue82 === "date" ? libValue6.date : libValue6.time,
                  value: libParam5,
                  location: libValue89,
                  style: libValue87,
                },
                err: null,
              };
            }
          }
          return {
            val: {
              type:
                libValue82 === "number"
                  ? libValue6.number
                  : libValue82 === "date"
                    ? libValue6.date
                    : libValue6.time,
              value: libParam5,
              location: libValue89,
              style: libValue84?.style ?? null,
            },
            err: null,
          };
        case "plural":
        case "selectordinal":
        case "select":
          var libValue92 = this.clonePosition();
          if ((this.bumpSpace(), !this.bumpIf(",")))
            return this.error(
              libValue5.EXPECT_SELECT_ARGUMENT_OPTIONS,
              libHelper29(libValue92, libImport5({}, libValue92)),
            );
          this.bumpSpace();
          var libValue93 = this.parseIdentifierIfPossible(),
            libValue94 = 0;
          if (libValue82 !== "select" && libValue93.value === "offset") {
            if (!this.bumpIf(":"))
              return this.error(
                libValue5.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
                libHelper29(this.clonePosition(), this.clonePosition()),
              );
            this.bumpSpace();
            var libValue86 = this.tryParseDecimalInteger(
              libValue5.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,
              libValue5.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE,
            );
            if (libValue86.err) return libValue86;
            this.bumpSpace();
            libValue93 = this.parseIdentifierIfPossible();
            libValue94 = libValue86.val;
          }
          var libValue95 = this.tryParsePluralOrSelectOptions(
            libParam3,
            libValue82,
            libParam4,
            libValue93,
          );
          if (libValue95.err) return libValue95;
          var libValue88 = this.tryParseArgumentClose(libParam6);
          if (libValue88.err) return libValue88;
          var libValue96 = libHelper29(libParam6, this.clonePosition());
          return libValue82 === "select"
            ? {
                val: {
                  type: libValue6.select,
                  value: libParam5,
                  options: libValue27(libValue95.val),
                  location: libValue96,
                },
                err: null,
              }
            : {
                val: {
                  type: libValue6.plural,
                  value: libParam5,
                  options: libValue27(libValue95.val),
                  offset: libValue94,
                  pluralType: libValue82 === "plural" ? "cardinal" : "ordinal",
                  location: libValue96,
                },
                err: null,
              };
        default:
          return this.error(
            libValue5.INVALID_ARGUMENT_TYPE,
            libHelper29(libValue81, libValue83),
          );
      }
    }),
    (libHelper83.prototype.tryParseArgumentClose = function (libParam164) {
      return this.isEOF() || this.char() !== 125
        ? this.error(
            libValue5.EXPECT_ARGUMENT_CLOSING_BRACE,
            libHelper29(libParam164, this.clonePosition()),
          )
        : (this.bump(),
          {
            val: true,
            err: null,
          });
    }),
    (libHelper83.prototype.parseSimpleArgStyleIfPossible = function () {
      for (
        var libValue213 = 0, libValue214 = this.clonePosition();
        !this.isEOF();
      )
        switch (this.char()) {
          case 39:
            this.bump();
            var libValue215 = this.clonePosition();
            if (!this.bumpUntil("'"))
              return this.error(
                libValue5.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,
                libHelper29(libValue215, this.clonePosition()),
              );
            this.bump();
            break;
          case 123:
            libValue213 += 1;
            this.bump();
            break;
          case 125:
            if (libValue213 > 0) --libValue213;
            else
              return {
                val: this.message.slice(libValue214.offset, this.offset()),
                err: null,
              };
            break;
          default:
            this.bump();
            break;
        }
      return {
        val: this.message.slice(libValue214.offset, this.offset()),
        err: null,
      };
    }),
    (libHelper83.prototype.parseNumberSkeletonFromString = function (
      libParam116,
      libParam117,
    ) {
      var libValue334 = [];
      try {
        libValue334 = libHelper21(libParam116);
      } catch {
        return this.error(libValue5.INVALID_NUMBER_SKELETON, libParam117);
      }
      return {
        val: {
          type: libValue7.number,
          tokens: libValue334,
          location: libParam117,
          parsedOptions: this.shouldParseSkeletons
            ? libHelper26(libValue334)
            : {},
        },
        err: null,
      };
    }),
    (libHelper83.prototype.tryParsePluralOrSelectOptions = function (
      libParam24,
      libParam25,
      libParam26,
      libParam27,
    ) {
      for (
        var libValue151,
          libValue152 = false,
          libValue153 = [],
          libValue154 = new Set(),
          libValue155 = libParam27.value,
          libValue156 = libParam27.location;
        ;
      ) {
        if (libValue155.length === 0) {
          var libValue157 = this.clonePosition();
          if (libParam25 !== "select" && this.bumpIf("=")) {
            var libValue158 = this.tryParseDecimalInteger(
              libValue5.EXPECT_PLURAL_ARGUMENT_SELECTOR,
              libValue5.INVALID_PLURAL_ARGUMENT_SELECTOR,
            );
            if (libValue158.err) return libValue158;
            libValue156 = libHelper29(libValue157, this.clonePosition());
            libValue155 = this.message.slice(libValue157.offset, this.offset());
          } else break;
        }
        if (libValue154.has(libValue155))
          return this.error(
            libParam25 === "select"
              ? libValue5.DUPLICATE_SELECT_ARGUMENT_SELECTOR
              : libValue5.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,
            libValue156,
          );
        libValue155 === "other" && (libValue152 = true);
        this.bumpSpace();
        var libValue159 = this.clonePosition();
        if (!this.bumpIf("{"))
          return this.error(
            libParam25 === "select"
              ? libValue5.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT
              : libValue5.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,
            libHelper29(this.clonePosition(), this.clonePosition()),
          );
        var libValue160 = this.parseMessage(
          libParam24 + 1,
          libParam25,
          libParam26,
        );
        if (libValue160.err) return libValue160;
        var libValue161 = this.tryParseArgumentClose(libValue159);
        if (libValue161.err) return libValue161;
        libValue153.push([
          libValue155,
          {
            value: libValue160.val,
            location: libHelper29(libValue159, this.clonePosition()),
          },
        ]);
        libValue154.add(libValue155);
        this.bumpSpace();
        libValue151 = this.parseIdentifierIfPossible();
        libValue155 = libValue151.value;
        libValue156 = libValue151.location;
      }
      return libValue153.length === 0
        ? this.error(
            libParam25 === "select"
              ? libValue5.EXPECT_SELECT_ARGUMENT_SELECTOR
              : libValue5.EXPECT_PLURAL_ARGUMENT_SELECTOR,
            libHelper29(this.clonePosition(), this.clonePosition()),
          )
        : this.requiresOtherClause && !libValue152
          ? this.error(
              libValue5.MISSING_OTHER_CLAUSE,
              libHelper29(this.clonePosition(), this.clonePosition()),
            )
          : {
              val: libValue153,
              err: null,
            };
    }),
    (libHelper83.prototype.tryParseDecimalInteger = function (
      libParam85,
      libParam86,
    ) {
      var libValue276 = 1,
        libValue277 = this.clonePosition();
      this.bumpIf("+") || (this.bumpIf("-") && (libValue276 = -1));
      for (var libValue278 = false, libValue279 = 0; !this.isEOF(); ) {
        var libValue280 = this.char();
        if (libValue280 >= 48 && libValue280 <= 57) {
          libValue278 = true;
          libValue279 = libValue279 * 10 + (libValue280 - 48);
          this.bump();
        } else break;
      }
      var libValue281 = libHelper29(libValue277, this.clonePosition());
      return libValue278
        ? ((libValue279 *= libValue276),
          libValue23(libValue279)
            ? {
                val: libValue279,
                err: null,
              }
            : this.error(libParam86, libValue281))
        : this.error(libParam85, libValue281);
    }),
    (libHelper83.prototype.offset = function () {
      return this.position.offset;
    }),
    (libHelper83.prototype.isEOF = function () {
      return this.offset() === this.message.length;
    }),
    (libHelper83.prototype.clonePosition = function () {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column,
      };
    }),
    (libHelper83.prototype.char = function () {
      var libValue373 = this.position.offset;
      if (libValue373 >= this.message.length) throw Error("out of bound");
      var libValue374 = libValue28(this.message, libValue373);
      if (libValue374 === undefined)
        throw Error(
          `Offset ${libValue373} is at invalid UTF-16 code unit boundary`,
        );
      return libValue374;
    }),
    (libHelper83.prototype.error = function (libParam247, libParam248) {
      return {
        val: null,
        err: {
          kind: libParam247,
          message: this.message,
          location: libParam248,
        },
      };
    }),
    (libHelper83.prototype.bump = function () {
      if (!this.isEOF()) {
        var libValue342 = this.char();
        libValue342 === 10
          ? ((this.position.line += 1),
            (this.position.column = 1),
            (this.position.offset += 1))
          : ((this.position.column += 1),
            (this.position.offset += libValue342 < 65536 ? 1 : 2));
      }
    }),
    (libHelper83.prototype.bumpIf = function (libParam222) {
      if (libValue25(this.message, libParam222, this.offset())) {
        for (
          var libValue440 = 0;
          libValue440 < libParam222.length;
          libValue440++
        )
          this.bump();
        return true;
      }
      return false;
    }),
    (libHelper83.prototype.bumpUntil = function (libParam202) {
      var libValue421 = this.offset(),
        libValue422 = this.message.indexOf(libParam202, libValue421);
      return libValue422 >= 0
        ? (this.bumpTo(libValue422), true)
        : (this.bumpTo(this.message.length), false);
    }),
    (libHelper83.prototype.bumpTo = function (libParam87) {
      if (this.offset() > libParam87)
        throw Error(
          `targetOffset ${libParam87} must be greater than or equal to the current offset ${this.offset()}`,
        );
      for (libParam87 = Math.min(libParam87, this.message.length); ; ) {
        var libValue282 = this.offset();
        if (libValue282 === libParam87) break;
        if (libValue282 > libParam87)
          throw Error(
            `targetOffset ${libParam87} is at invalid UTF-16 code unit boundary`,
          );
        if ((this.bump(), this.isEOF())) break;
      }
    }),
    (libHelper83.prototype.bumpSpace = function () {
      for (; !this.isEOF() && libHelper34(this.char()); ) this.bump();
    }),
    (libHelper83.prototype.peek = function () {
      if (this.isEOF()) return null;
      var libValue424 = this.char(),
        libValue425 = this.offset();
      return (
        this.message.charCodeAt(libValue425 + (libValue424 >= 65536 ? 2 : 1)) ??
        null
      );
    }),
    libHelper83
  );
})();
function libHelper31(libParam286) {
  return (
    (libParam286 >= 97 && libParam286 <= 122) ||
    (libParam286 >= 65 && libParam286 <= 90)
  );
}
function libHelper32(libParam341) {
  return libHelper31(libParam341) || libParam341 === 47;
}
function libHelper33(libParam60) {
  return (
    libParam60 === 45 ||
    libParam60 === 46 ||
    (libParam60 >= 48 && libParam60 <= 57) ||
    libParam60 === 95 ||
    (libParam60 >= 97 && libParam60 <= 122) ||
    (libParam60 >= 65 && libParam60 <= 90) ||
    libParam60 == 183 ||
    (libParam60 >= 192 && libParam60 <= 214) ||
    (libParam60 >= 216 && libParam60 <= 246) ||
    (libParam60 >= 248 && libParam60 <= 893) ||
    (libParam60 >= 895 && libParam60 <= 8191) ||
    (libParam60 >= 8204 && libParam60 <= 8205) ||
    (libParam60 >= 8255 && libParam60 <= 8256) ||
    (libParam60 >= 8304 && libParam60 <= 8591) ||
    (libParam60 >= 11264 && libParam60 <= 12271) ||
    (libParam60 >= 12289 && libParam60 <= 55295) ||
    (libParam60 >= 63744 && libParam60 <= 64975) ||
    (libParam60 >= 65008 && libParam60 <= 65533) ||
    (libParam60 >= 65536 && libParam60 <= 983039)
  );
}
function libHelper34(libParam226) {
  return (
    (libParam226 >= 9 && libParam226 <= 13) ||
    libParam226 === 32 ||
    libParam226 === 133 ||
    (libParam226 >= 8206 && libParam226 <= 8207) ||
    libParam226 === 8232 ||
    libParam226 === 8233
  );
}
function libHelper35(libParam1) {
  return (
    (libParam1 >= 33 && libParam1 <= 35) ||
    libParam1 === 36 ||
    (libParam1 >= 37 && libParam1 <= 39) ||
    libParam1 === 40 ||
    libParam1 === 41 ||
    libParam1 === 42 ||
    libParam1 === 43 ||
    libParam1 === 44 ||
    libParam1 === 45 ||
    (libParam1 >= 46 && libParam1 <= 47) ||
    (libParam1 >= 58 && libParam1 <= 59) ||
    (libParam1 >= 60 && libParam1 <= 62) ||
    (libParam1 >= 63 && libParam1 <= 64) ||
    libParam1 === 91 ||
    libParam1 === 92 ||
    libParam1 === 93 ||
    libParam1 === 94 ||
    libParam1 === 96 ||
    libParam1 === 123 ||
    libParam1 === 124 ||
    libParam1 === 125 ||
    libParam1 === 126 ||
    libParam1 === 161 ||
    (libParam1 >= 162 && libParam1 <= 165) ||
    libParam1 === 166 ||
    libParam1 === 167 ||
    libParam1 === 169 ||
    libParam1 === 171 ||
    libParam1 === 172 ||
    libParam1 === 174 ||
    libParam1 === 176 ||
    libParam1 === 177 ||
    libParam1 === 182 ||
    libParam1 === 187 ||
    libParam1 === 191 ||
    libParam1 === 215 ||
    libParam1 === 247 ||
    (libParam1 >= 8208 && libParam1 <= 8213) ||
    (libParam1 >= 8214 && libParam1 <= 8215) ||
    libParam1 === 8216 ||
    libParam1 === 8217 ||
    libParam1 === 8218 ||
    (libParam1 >= 8219 && libParam1 <= 8220) ||
    libParam1 === 8221 ||
    libParam1 === 8222 ||
    libParam1 === 8223 ||
    (libParam1 >= 8224 && libParam1 <= 8231) ||
    (libParam1 >= 8240 && libParam1 <= 8248) ||
    libParam1 === 8249 ||
    libParam1 === 8250 ||
    (libParam1 >= 8251 && libParam1 <= 8254) ||
    (libParam1 >= 8257 && libParam1 <= 8259) ||
    libParam1 === 8260 ||
    libParam1 === 8261 ||
    libParam1 === 8262 ||
    (libParam1 >= 8263 && libParam1 <= 8273) ||
    libParam1 === 8274 ||
    libParam1 === 8275 ||
    (libParam1 >= 8277 && libParam1 <= 8286) ||
    (libParam1 >= 8592 && libParam1 <= 8596) ||
    (libParam1 >= 8597 && libParam1 <= 8601) ||
    (libParam1 >= 8602 && libParam1 <= 8603) ||
    (libParam1 >= 8604 && libParam1 <= 8607) ||
    libParam1 === 8608 ||
    (libParam1 >= 8609 && libParam1 <= 8610) ||
    libParam1 === 8611 ||
    (libParam1 >= 8612 && libParam1 <= 8613) ||
    libParam1 === 8614 ||
    (libParam1 >= 8615 && libParam1 <= 8621) ||
    libParam1 === 8622 ||
    (libParam1 >= 8623 && libParam1 <= 8653) ||
    (libParam1 >= 8654 && libParam1 <= 8655) ||
    (libParam1 >= 8656 && libParam1 <= 8657) ||
    libParam1 === 8658 ||
    libParam1 === 8659 ||
    libParam1 === 8660 ||
    (libParam1 >= 8661 && libParam1 <= 8691) ||
    (libParam1 >= 8692 && libParam1 <= 8959) ||
    (libParam1 >= 8960 && libParam1 <= 8967) ||
    libParam1 === 8968 ||
    libParam1 === 8969 ||
    libParam1 === 8970 ||
    libParam1 === 8971 ||
    (libParam1 >= 8972 && libParam1 <= 8991) ||
    (libParam1 >= 8992 && libParam1 <= 8993) ||
    (libParam1 >= 8994 && libParam1 <= 9e3) ||
    libParam1 === 9001 ||
    libParam1 === 9002 ||
    (libParam1 >= 9003 && libParam1 <= 9083) ||
    libParam1 === 9084 ||
    (libParam1 >= 9085 && libParam1 <= 9114) ||
    (libParam1 >= 9115 && libParam1 <= 9139) ||
    (libParam1 >= 9140 && libParam1 <= 9179) ||
    (libParam1 >= 9180 && libParam1 <= 9185) ||
    (libParam1 >= 9186 && libParam1 <= 9254) ||
    (libParam1 >= 9255 && libParam1 <= 9279) ||
    (libParam1 >= 9280 && libParam1 <= 9290) ||
    (libParam1 >= 9291 && libParam1 <= 9311) ||
    (libParam1 >= 9472 && libParam1 <= 9654) ||
    libParam1 === 9655 ||
    (libParam1 >= 9656 && libParam1 <= 9664) ||
    libParam1 === 9665 ||
    (libParam1 >= 9666 && libParam1 <= 9719) ||
    (libParam1 >= 9720 && libParam1 <= 9727) ||
    (libParam1 >= 9728 && libParam1 <= 9838) ||
    libParam1 === 9839 ||
    (libParam1 >= 9840 && libParam1 <= 10087) ||
    libParam1 === 10088 ||
    libParam1 === 10089 ||
    libParam1 === 10090 ||
    libParam1 === 10091 ||
    libParam1 === 10092 ||
    libParam1 === 10093 ||
    libParam1 === 10094 ||
    libParam1 === 10095 ||
    libParam1 === 10096 ||
    libParam1 === 10097 ||
    libParam1 === 10098 ||
    libParam1 === 10099 ||
    libParam1 === 10100 ||
    libParam1 === 10101 ||
    (libParam1 >= 10132 && libParam1 <= 10175) ||
    (libParam1 >= 10176 && libParam1 <= 10180) ||
    libParam1 === 10181 ||
    libParam1 === 10182 ||
    (libParam1 >= 10183 && libParam1 <= 10213) ||
    libParam1 === 10214 ||
    libParam1 === 10215 ||
    libParam1 === 10216 ||
    libParam1 === 10217 ||
    libParam1 === 10218 ||
    libParam1 === 10219 ||
    libParam1 === 10220 ||
    libParam1 === 10221 ||
    libParam1 === 10222 ||
    libParam1 === 10223 ||
    (libParam1 >= 10224 && libParam1 <= 10239) ||
    (libParam1 >= 10240 && libParam1 <= 10495) ||
    (libParam1 >= 10496 && libParam1 <= 10626) ||
    libParam1 === 10627 ||
    libParam1 === 10628 ||
    libParam1 === 10629 ||
    libParam1 === 10630 ||
    libParam1 === 10631 ||
    libParam1 === 10632 ||
    libParam1 === 10633 ||
    libParam1 === 10634 ||
    libParam1 === 10635 ||
    libParam1 === 10636 ||
    libParam1 === 10637 ||
    libParam1 === 10638 ||
    libParam1 === 10639 ||
    libParam1 === 10640 ||
    libParam1 === 10641 ||
    libParam1 === 10642 ||
    libParam1 === 10643 ||
    libParam1 === 10644 ||
    libParam1 === 10645 ||
    libParam1 === 10646 ||
    libParam1 === 10647 ||
    libParam1 === 10648 ||
    (libParam1 >= 10649 && libParam1 <= 10711) ||
    libParam1 === 10712 ||
    libParam1 === 10713 ||
    libParam1 === 10714 ||
    libParam1 === 10715 ||
    (libParam1 >= 10716 && libParam1 <= 10747) ||
    libParam1 === 10748 ||
    libParam1 === 10749 ||
    (libParam1 >= 10750 && libParam1 <= 11007) ||
    (libParam1 >= 11008 && libParam1 <= 11055) ||
    (libParam1 >= 11056 && libParam1 <= 11076) ||
    (libParam1 >= 11077 && libParam1 <= 11078) ||
    (libParam1 >= 11079 && libParam1 <= 11084) ||
    (libParam1 >= 11085 && libParam1 <= 11123) ||
    (libParam1 >= 11124 && libParam1 <= 11125) ||
    (libParam1 >= 11126 && libParam1 <= 11157) ||
    libParam1 === 11158 ||
    (libParam1 >= 11159 && libParam1 <= 11263) ||
    (libParam1 >= 11776 && libParam1 <= 11777) ||
    libParam1 === 11778 ||
    libParam1 === 11779 ||
    libParam1 === 11780 ||
    libParam1 === 11781 ||
    (libParam1 >= 11782 && libParam1 <= 11784) ||
    libParam1 === 11785 ||
    libParam1 === 11786 ||
    libParam1 === 11787 ||
    libParam1 === 11788 ||
    libParam1 === 11789 ||
    (libParam1 >= 11790 && libParam1 <= 11798) ||
    libParam1 === 11799 ||
    (libParam1 >= 11800 && libParam1 <= 11801) ||
    libParam1 === 11802 ||
    libParam1 === 11803 ||
    libParam1 === 11804 ||
    libParam1 === 11805 ||
    (libParam1 >= 11806 && libParam1 <= 11807) ||
    libParam1 === 11808 ||
    libParam1 === 11809 ||
    libParam1 === 11810 ||
    libParam1 === 11811 ||
    libParam1 === 11812 ||
    libParam1 === 11813 ||
    libParam1 === 11814 ||
    libParam1 === 11815 ||
    libParam1 === 11816 ||
    libParam1 === 11817 ||
    (libParam1 >= 11818 && libParam1 <= 11822) ||
    libParam1 === 11823 ||
    (libParam1 >= 11824 && libParam1 <= 11833) ||
    (libParam1 >= 11834 && libParam1 <= 11835) ||
    (libParam1 >= 11836 && libParam1 <= 11839) ||
    libParam1 === 11840 ||
    libParam1 === 11841 ||
    libParam1 === 11842 ||
    (libParam1 >= 11843 && libParam1 <= 11855) ||
    (libParam1 >= 11856 && libParam1 <= 11857) ||
    libParam1 === 11858 ||
    (libParam1 >= 11859 && libParam1 <= 11903) ||
    (libParam1 >= 12289 && libParam1 <= 12291) ||
    libParam1 === 12296 ||
    libParam1 === 12297 ||
    libParam1 === 12298 ||
    libParam1 === 12299 ||
    libParam1 === 12300 ||
    libParam1 === 12301 ||
    libParam1 === 12302 ||
    libParam1 === 12303 ||
    libParam1 === 12304 ||
    libParam1 === 12305 ||
    (libParam1 >= 12306 && libParam1 <= 12307) ||
    libParam1 === 12308 ||
    libParam1 === 12309 ||
    libParam1 === 12310 ||
    libParam1 === 12311 ||
    libParam1 === 12312 ||
    libParam1 === 12313 ||
    libParam1 === 12314 ||
    libParam1 === 12315 ||
    libParam1 === 12316 ||
    libParam1 === 12317 ||
    (libParam1 >= 12318 && libParam1 <= 12319) ||
    libParam1 === 12320 ||
    libParam1 === 12336 ||
    libParam1 === 64830 ||
    libParam1 === 64831 ||
    (libParam1 >= 65093 && libParam1 <= 65094)
  );
}
function libHelper36(libParam130) {
  libParam130.forEach(function (item) {
    if ((delete item.location, libHelper14(item) || libHelper15(item)))
      for (var libValue364 in item.options) {
        delete item.options[libValue364].location;
        libHelper36(item.options[libValue364].value);
      }
    else
      (libHelper11(item) && libHelper18(item.style)) ||
      ((libHelper12(item) || libHelper13(item)) && libHelper19(item.style))
        ? delete item.style.location
        : libHelper17(item) && libHelper36(item.children);
  });
}
function libHelper37(libParam112, libParam113) {
  libParam113 === undefined && (libParam113 = {});
  libParam113 = libImport5(
    {
      shouldParseSkeletons: true,
      requiresOtherClause: true,
    },
    libParam113,
  );
  var libValue323 = new libValue33(libParam112, libParam113).parse();
  if (libValue323.err) {
    var libValue324 = SyntaxError(libValue5[libValue323.err.kind]);
    throw (
      (libValue324.location = libValue323.err.location),
      (libValue324.originalMessage = libValue323.err.message),
      libValue324
    );
  }
  return (
    libParam113?.captureLocation || libHelper36(libValue323.val),
    libValue323.val
  );
}
var libValue34;
(function (libParam231) {
  libParam231.MISSING_VALUE = "MISSING_VALUE";
  libParam231.INVALID_VALUE = "INVALID_VALUE";
  libParam231.MISSING_INTL_API = "MISSING_INTL_API";
})((libValue34 ||= {}));
var libValue35 = (function (libParam148) {
    libImport4(libHelper94, libParam148);
    function libHelper94(libParam249, libParam250, libParam251) {
      var libValue457 = libParam148.call(this, libParam249) || this;
      return (
        (libValue457.code = libParam250),
        (libValue457.originalMessage = libParam251),
        libValue457
      );
    }
    return (
      (libHelper94.prototype.toString = function () {
        return `[formatjs Error: ${this.code}] ${this.message}`;
      }),
      libHelper94
    );
  })(Error),
  libValue36 = (function (libParam151) {
    libImport4(libHelper95, libParam151);
    function libHelper95(libParam165, libParam166, libParam167, libParam168) {
      return (
        libParam151.call(
          this,
          `Invalid values for "${libParam165}": "${libParam166}". Options are "${Object.keys(libParam167).join('", "')}"`,
          libValue34.INVALID_VALUE,
          libParam168,
        ) || this
      );
    }
    return libHelper95;
  })(libValue35),
  libValue37 = (function (libParam163) {
    libImport4(libHelper99, libParam163);
    function libHelper99(libParam198, libParam199, libParam200) {
      return (
        libParam163.call(
          this,
          `Value for "${libParam198}" must be of type ${libParam199}`,
          libValue34.INVALID_VALUE,
          libParam200,
        ) || this
      );
    }
    return libHelper99;
  })(libValue35),
  libValue38 = (function (libParam156) {
    libImport4(libHelper96, libParam156);
    function libHelper96(libParam169, libParam170) {
      return (
        libParam156.call(
          this,
          `The intl string context variable "${libParam169}" was not provided to the string "${libParam170}"`,
          libValue34.MISSING_VALUE,
          libParam170,
        ) || this
      );
    }
    return libHelper96;
  })(libValue35),
  libValue39;
(function (libParam261) {
  libParam261[(libParam261.literal = 0)] = "literal";
  libParam261[(libParam261.object = 1)] = "object";
})((libValue39 ||= {}));
function libHelper38(libParam149) {
  return libParam149.length < 2
    ? libParam149
    : libParam149.reduce(function (accumulator, current) {
        var libValue401 = accumulator[accumulator.length - 1];
        return (
          !libValue401 ||
          libValue401.type !== libValue39.literal ||
          current.type !== libValue39.literal
            ? accumulator.push(current)
            : (libValue401.value += current.value),
          accumulator
        );
      }, []);
}
function libHelper39(libParam310) {
  return typeof libParam310 == "function";
}
function libHelper40(
  libParam10,
  libParam11,
  libParam12,
  libParam13,
  libParam14,
  libParam15,
  libParam16,
) {
  if (libParam10.length === 1 && libHelper9(libParam10[0]))
    return [
      {
        type: libValue39.literal,
        value: libParam10[0].value,
      },
    ];
  for (
    var libValue118 = [], libValue119 = 0, libValue120 = libParam10;
    libValue119 < libValue120.length;
    libValue119++
  ) {
    var libValue121 = libValue120[libValue119];
    if (libHelper9(libValue121)) {
      libValue118.push({
        type: libValue39.literal,
        value: libValue121.value,
      });
      continue;
    }
    if (libHelper16(libValue121)) {
      typeof libParam15 == "number" &&
        libValue118.push({
          type: libValue39.literal,
          value: libParam12.getNumberFormat(libParam11).format(libParam15),
        });
      continue;
    }
    var libValue122 = libValue121.value;
    if (!(libParam14 && libValue122 in libParam14))
      throw new libValue38(libValue122, libParam16);
    var libValue123 = libParam14[libValue122];
    if (libHelper10(libValue121)) {
      (!libValue123 ||
        typeof libValue123 == "string" ||
        typeof libValue123 == "number") &&
        (libValue123 =
          typeof libValue123 == "string" || typeof libValue123 == "number"
            ? String(libValue123)
            : "");
      libValue118.push({
        type:
          typeof libValue123 == "string"
            ? libValue39.literal
            : libValue39.object,
        value: libValue123,
      });
      continue;
    }
    if (libHelper12(libValue121)) {
      var libValue124 =
        typeof libValue121.style == "string"
          ? libParam13.date[libValue121.style]
          : libHelper19(libValue121.style)
            ? libValue121.style.parsedOptions
            : undefined;
      libValue118.push({
        type: libValue39.literal,
        value: libParam12
          .getDateTimeFormat(libParam11, libValue124)
          .format(libValue123),
      });
      continue;
    }
    if (libHelper13(libValue121)) {
      var libValue124 =
        typeof libValue121.style == "string"
          ? libParam13.time[libValue121.style]
          : libHelper19(libValue121.style)
            ? libValue121.style.parsedOptions
            : libParam13.time.medium;
      libValue118.push({
        type: libValue39.literal,
        value: libParam12
          .getDateTimeFormat(libParam11, libValue124)
          .format(libValue123),
      });
      continue;
    }
    if (libHelper11(libValue121)) {
      var libValue124 =
        typeof libValue121.style == "string"
          ? libParam13.number[libValue121.style]
          : libHelper18(libValue121.style)
            ? libValue121.style.parsedOptions
            : undefined;
      libValue124 &&
        libValue124.scale &&
        (libValue123 *= libValue124.scale || 1);
      libValue118.push({
        type: libValue39.literal,
        value: libParam12
          .getNumberFormat(libParam11, libValue124)
          .format(libValue123),
      });
      continue;
    }
    if (libHelper17(libValue121)) {
      var libValue125 = libValue121.children,
        libValue126 = libValue121.value,
        libValue127 = libParam14[libValue126];
      if (!libHelper39(libValue127))
        throw new libValue37(libValue126, "function", libParam16);
      var libValue128 = libValue127(
        libHelper40(
          libValue125,
          libParam11,
          libParam12,
          libParam13,
          libParam14,
          libParam15,
        ).map(function (item) {
          return item.value;
        }),
      );
      Array.isArray(libValue128) || (libValue128 = [libValue128]);
      libValue118.push.apply(
        libValue118,
        libValue128.map(function (item) {
          return {
            type:
              typeof item == "string" ? libValue39.literal : libValue39.object,
            value: item,
          };
        }),
      );
    }
    if (libHelper14(libValue121)) {
      var libValue129 =
        libValue121.options[libValue123] || libValue121.options.other;
      if (!libValue129)
        throw new libValue36(
          libValue121.value,
          libValue123,
          Object.keys(libValue121.options),
          libParam16,
        );
      libValue118.push.apply(
        libValue118,
        libHelper40(
          libValue129.value,
          libParam11,
          libParam12,
          libParam13,
          libParam14,
        ),
      );
      continue;
    }
    if (libHelper15(libValue121)) {
      var libValue129 = libValue121.options[`=${libValue123}`];
      if (!libValue129) {
        if (!Intl.PluralRules)
          throw new libValue35(
            'Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',
            libValue34.MISSING_INTL_API,
            libParam16,
          );
        var libValue130 = libParam12
          .getPluralRules(libParam11, {
            type: libValue121.pluralType,
          })
          .select(libValue123 - (libValue121.offset || 0));
        libValue129 =
          libValue121.options[libValue130] || libValue121.options.other;
      }
      if (!libValue129)
        throw new libValue36(
          libValue121.value,
          libValue123,
          Object.keys(libValue121.options),
          libParam16,
        );
      libValue118.push.apply(
        libValue118,
        libHelper40(
          libValue129.value,
          libParam11,
          libParam12,
          libParam13,
          libParam14,
          libValue123 - (libValue121.offset || 0),
        ),
      );
      continue;
    }
  }
  return libHelper38(libValue118);
}
function libHelper41(libParam172, libParam173) {
  return libParam173
    ? libImport5(
        libImport5(libImport5({}, libParam172 || {}), libParam173 || {}),
        Object.keys(libParam172).reduce(function (accumulator, current) {
          return (
            (accumulator[current] = libImport5(
              libImport5({}, libParam172[current]),
              libParam173[current] || {},
            )),
            accumulator
          );
        }, {}),
      )
    : libParam172;
}
function $e(libParam206, libParam207) {
  return libParam207
    ? Object.keys(libParam206).reduce(
        function (accumulator, current) {
          return (
            (accumulator[current] = libHelper41(
              libParam206[current],
              libParam207[current],
            )),
            accumulator
          );
        },
        libImport5({}, libParam206),
      )
    : libParam206;
}
function libHelper42(libParam174) {
  return {
    create: function () {
      return {
        get: function (libParam330) {
          return libParam174[libParam330];
        },
        set: function (libParam331, libParam332) {
          libParam174[libParam331] = libParam332;
        },
      };
    },
  };
}
function libHelper43(libParam41) {
  return (
    libParam41 === undefined &&
      (libParam41 = {
        number: {},
        dateTime: {},
        pluralRules: {},
      }),
    {
      getNumberFormat: libHelper1(
        function () {
          for (
            var libValue389, libValue390 = [], libValue391 = 0;
            libValue391 < arguments.length;
            libValue391++
          )
            libValue390[libValue391] = arguments[libValue391];
          return new ((libValue389 = Intl.NumberFormat).bind.apply(
            libValue389,
            libImport3([undefined], libValue390, false),
          ))();
        },
        {
          cache: libHelper42(libParam41.number),
          strategy: libValue4.variadic,
        },
      ),
      getDateTimeFormat: libHelper1(
        function () {
          for (
            var libValue386, libValue387 = [], libValue388 = 0;
            libValue388 < arguments.length;
            libValue388++
          )
            libValue387[libValue388] = arguments[libValue388];
          return new ((libValue386 = Intl.DateTimeFormat).bind.apply(
            libValue386,
            libImport3([undefined], libValue387, false),
          ))();
        },
        {
          cache: libHelper42(libParam41.dateTime),
          strategy: libValue4.variadic,
        },
      ),
      getPluralRules: libHelper1(
        function () {
          for (
            var libValue392, libValue393 = [], libValue394 = 0;
            libValue394 < arguments.length;
            libValue394++
          )
            libValue393[libValue394] = arguments[libValue394];
          return new ((libValue392 = Intl.PluralRules).bind.apply(
            libValue392,
            libImport3([undefined], libValue393, false),
          ))();
        },
        {
          cache: libHelper42(libParam41.pluralRules),
          strategy: libValue4.variadic,
        },
      ),
    }
  );
}
var libValue40 = (function () {
    function libHelper86(libParam30, libParam31, libParam32, libParam33) {
      libParam31 === undefined && (libParam31 = libHelper86.defaultLocale);
      var libValue167 = this;
      if (
        ((this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {},
        }),
        (this.format = function (libParam88) {
          var libValue283 = libValue167.formatToParts(libParam88);
          if (libValue283.length === 1) return libValue283[0].value;
          var libValue284 = libValue283.reduce(function (accumulator, current) {
            return (
              !accumulator.length ||
              current.type !== libValue39.literal ||
              typeof accumulator[accumulator.length - 1] != "string"
                ? accumulator.push(current.value)
                : (accumulator[accumulator.length - 1] += current.value),
              accumulator
            );
          }, []);
          return libValue284.length <= 1 ? libValue284[0] || "" : libValue284;
        }),
        (this.formatToParts = function (libParam176) {
          return libHelper40(
            libValue167.ast,
            libValue167.locales,
            libValue167.formatters,
            libValue167.formats,
            libParam176,
            undefined,
            libValue167.message,
          );
        }),
        (this.resolvedOptions = function () {
          return {
            locale:
              libValue167.resolvedLocale?.toString() ||
              Intl.NumberFormat.supportedLocalesOf(libValue167.locales)[0],
          };
        }),
        (this.getAst = function () {
          return libValue167.ast;
        }),
        (this.locales = libParam31),
        (this.resolvedLocale = libHelper86.resolveLocale(libParam31)),
        typeof libParam30 == "string")
      ) {
        if (((this.message = libParam30), !libHelper86.__parse))
          throw TypeError(
            "IntlMessageFormat.__parse must be set to process `message` of type `string`",
          );
        var libValue168 = libParam33 || {};
        libValue168.formatters;
        var libValue169 = libImport2(libValue168, ["formatters"]);
        this.ast = libHelper86.__parse(
          libParam30,
          libImport5(libImport5({}, libValue169), {
            locale: this.resolvedLocale,
          }),
        );
      } else this.ast = libParam30;
      if (!Array.isArray(this.ast))
        throw TypeError("A message must be provided as a String or AST.");
      this.formats = $e(libHelper86.formats, libParam32);
      this.formatters =
        (libParam33 && libParam33.formatters) ||
        libHelper43(this.formatterCache);
    }
    return (
      Object.defineProperty(libHelper86, "defaultLocale", {
        get: function () {
          return (
            (libHelper86.memoizedDefaultLocale ||=
              new Intl.NumberFormat().resolvedOptions().locale),
            libHelper86.memoizedDefaultLocale
          );
        },
        enumerable: false,
        configurable: true,
      }),
      (libHelper86.memoizedDefaultLocale = null),
      (libHelper86.resolveLocale = function (libParam160) {
        if (Intl.Locale !== undefined) {
          var libValue381 = Intl.NumberFormat.supportedLocalesOf(libParam160);
          return libValue381.length > 0
            ? new Intl.Locale(libValue381[0])
            : new Intl.Locale(
                typeof libParam160 == "string" ? libParam160 : libParam160[0],
              );
        }
      }),
      (libHelper86.__parse = libHelper37),
      (libHelper86.formats = {
        number: {
          integer: {
            maximumFractionDigits: 0,
          },
          currency: {
            style: "currency",
          },
          percent: {
            style: "percent",
          },
        },
        date: {
          short: {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
          },
          medium: {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
          long: {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        },
        time: {
          short: {
            hour: "numeric",
            minute: "numeric",
          },
          medium: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
        },
      }),
      libHelper86
    );
  })(),
  libValue41;
(function (libParam161) {
  libParam161.FORMAT_ERROR = "FORMAT_ERROR";
  libParam161.UNSUPPORTED_FORMATTER = "UNSUPPORTED_FORMATTER";
  libParam161.INVALID_CONFIG = "INVALID_CONFIG";
  libParam161.MISSING_DATA = "MISSING_DATA";
  libParam161.MISSING_TRANSLATION = "MISSING_TRANSLATION";
})((libValue41 ||= {}));
var libValue42 = (function (libParam79) {
    libImport4(libHelper92, libParam79);
    function libHelper92(libParam100, libParam101, libParam102) {
      var libValue308 = this,
        libValue309 = libParam102
          ? libParam102 instanceof Error
            ? libParam102
            : Error(String(libParam102))
          : undefined;
      return (
        (libValue308 =
          libParam79.call(
            this,
            `[@formatjs/intl Error ${libParam100}] ${libParam101}
${
  libValue309
    ? `
${libValue309.message}
${libValue309.stack}`
    : ""
}`,
          ) || this),
        (libValue308.code = libParam100),
        typeof Error.captureStackTrace == "function" &&
          Error.captureStackTrace(libValue308, libHelper92),
        libValue308
      );
    }
    return libHelper92;
  })(Error),
  libValue43 = (function (libParam232) {
    libImport4(libHelper100, libParam232);
    function libHelper100(libParam255, libParam256) {
      return (
        libParam232.call(
          this,
          libValue41.UNSUPPORTED_FORMATTER,
          libParam255,
          libParam256,
        ) || this
      );
    }
    return libHelper100;
  })(libValue42),
  libValue44 = (function (libParam243) {
    libImport4(libHelper101, libParam243);
    function libHelper101(libParam263, libParam264) {
      return (
        libParam243.call(
          this,
          libValue41.INVALID_CONFIG,
          libParam263,
          libParam264,
        ) || this
      );
    }
    return libHelper101;
  })(libValue42),
  libValue45 = (function (libParam244) {
    libImport4(libHelper102, libParam244);
    function libHelper102(libParam268, libParam269) {
      return (
        libParam244.call(
          this,
          libValue41.MISSING_DATA,
          libParam268,
          libParam269,
        ) || this
      );
    }
    return libHelper102;
  })(libValue42),
  libValue46 = (function (libParam162) {
    libImport4(libHelper98, libParam162);
    function libHelper98(libParam193, libParam194, libParam195) {
      var libValue416 =
        libParam162.call(
          this,
          libValue41.FORMAT_ERROR,
          `${libParam193}
Locale: ${libParam194}
`,
          libParam195,
        ) || this;
      return ((libValue416.locale = libParam194), libValue416);
    }
    return libHelper98;
  })(libValue42),
  libValue47 = (function (libParam128) {
    libImport4(libHelper93, libParam128);
    function libHelper93(libParam152, libParam153, libParam154, libParam155) {
      var libValue370 =
        libParam128.call(
          this,
          `${libParam152}
MessageID: ${libParam154?.id}
Default Message: ${libParam154?.defaultMessage}
Description: ${libParam154?.description}
`,
          libParam153,
          libParam155,
        ) || this;
      return (
        (libValue370.descriptor = libParam154),
        (libValue370.locale = libParam153),
        libValue370
      );
    }
    return libHelper93;
  })(libValue46),
  at = (function (libParam52) {
    libImport4(libHelper90, libParam52);
    function libHelper90(libParam55, libParam56) {
      var libValue225 =
        libParam52.call(
          this,
          libValue41.MISSING_TRANSLATION,
          `Missing message: "${libParam55.id}" for locale "${libParam56}", using ${
            libParam55.defaultMessage
              ? `default message (${
                  typeof libParam55.defaultMessage == "string"
                    ? libParam55.defaultMessage
                    : libParam55.defaultMessage
                        .map(function (item) {
                          return item.value ?? JSON.stringify(item);
                        })
                        .join()
                })`
              : "id"
          } as fallback.`,
        ) || this;
      return ((libValue225.descriptor = libParam55), libValue225);
    }
    return libHelper90;
  })(libValue42);
function libHelper44(libParam270, libParam271, libParam272) {
  if ((libParam272 === undefined && (libParam272 = Error), !libParam270))
    throw new libParam272(libParam271);
}
function libHelper45(libParam209, libParam210, libParam211) {
  return (
    libParam211 === undefined && (libParam211 = {}),
    libParam210.reduce(function (accumulator, current) {
      return (
        current in libParam209
          ? (accumulator[current] = libParam209[current])
          : current in libParam211 &&
            (accumulator[current] = libParam211[current]),
        accumulator
      );
    }, {})
  );
}
var libValue48 = {
  formats: {},
  messages: {},
  timeZone: undefined,
  defaultLocale: "en",
  defaultFormats: {},
  fallbackOnEmptyString: true,
  onError: function (libParam348) {},
  onWarn: function (libParam349) {},
};
function libHelper46() {
  return {
    dateTime: {},
    number: {},
    message: {},
    relativeTime: {},
    pluralRules: {},
    list: {},
    displayNames: {},
  };
}
function libHelper47(libParam175) {
  return {
    create: function () {
      return {
        get: function (libParam333) {
          return libParam175[libParam333];
        },
        set: function (libParam334, libParam335) {
          libParam175[libParam334] = libParam335;
        },
      };
    },
  };
}
function libHelper48(libParam22) {
  libParam22 === undefined && (libParam22 = libHelper46());
  var libValue145 = Intl.RelativeTimeFormat,
    libValue146 = Intl.ListFormat,
    libValue147 = Intl.DisplayNames,
    libValue148 = libHelper1(
      function () {
        for (
          var libValue395, libValue396 = [], libValue397 = 0;
          libValue397 < arguments.length;
          libValue397++
        )
          libValue396[libValue397] = arguments[libValue397];
        return new ((libValue395 = Intl.DateTimeFormat).bind.apply(
          libValue395,
          libImport3([undefined], libValue396, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.dateTime),
        strategy: libValue4.variadic,
      },
    ),
    libValue149 = libHelper1(
      function () {
        for (
          var libValue398, libValue399 = [], libValue400 = 0;
          libValue400 < arguments.length;
          libValue400++
        )
          libValue399[libValue400] = arguments[libValue400];
        return new ((libValue398 = Intl.NumberFormat).bind.apply(
          libValue398,
          libImport3([undefined], libValue399, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.number),
        strategy: libValue4.variadic,
      },
    ),
    libValue150 = libHelper1(
      function () {
        for (
          var libValue417, libValue418 = [], libValue419 = 0;
          libValue419 < arguments.length;
          libValue419++
        )
          libValue418[libValue419] = arguments[libValue419];
        return new ((libValue417 = Intl.PluralRules).bind.apply(
          libValue417,
          libImport3([undefined], libValue418, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.pluralRules),
        strategy: libValue4.variadic,
      },
    );
  return {
    getDateTimeFormat: libValue148,
    getNumberFormat: libValue149,
    getMessageFormat: libHelper1(
      function (libParam122, libParam123, libParam124, libParam125) {
        return new libValue40(
          libParam122,
          libParam123,
          libParam124,
          libImport5(
            {
              formatters: {
                getNumberFormat: libValue149,
                getDateTimeFormat: libValue148,
                getPluralRules: libValue150,
              },
            },
            libParam125 || {},
          ),
        );
      },
      {
        cache: libHelper47(libParam22.message),
        strategy: libValue4.variadic,
      },
    ),
    getRelativeTimeFormat: libHelper1(
      function () {
        var libValue459 = [...arguments];
        return new (libValue145.bind.apply(
          libValue145,
          libImport3([undefined], libValue459, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.relativeTime),
        strategy: libValue4.variadic,
      },
    ),
    getPluralRules: libValue150,
    getListFormat: libHelper1(
      function () {
        var libValue460 = [...arguments];
        return new (libValue146.bind.apply(
          libValue146,
          libImport3([undefined], libValue460, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.list),
        strategy: libValue4.variadic,
      },
    ),
    getDisplayNames: libHelper1(
      function () {
        var libValue461 = [...arguments];
        return new (libValue147.bind.apply(
          libValue147,
          libImport3([undefined], libValue461, false),
        ))();
      },
      {
        cache: libHelper47(libParam22.displayNames),
        strategy: libValue4.variadic,
      },
    ),
  };
}
function libHelper49(libParam239, libParam240, libParam241, libParam242) {
  var libValue455 = libParam239 && libParam239[libParam240],
    libValue456;
  if ((libValue455 && (libValue456 = libValue455[libParam241]), libValue456))
    return libValue456;
  libParam242(new libValue43(`No ${libParam240} format named: ${libParam241}`));
}
function libHelper50(libParam245, libParam246) {
  return Object.keys(libParam245).reduce(function (accumulator, current) {
    return (
      (accumulator[current] = libImport5(
        {
          timeZone: libParam246,
        },
        libParam245[current],
      )),
      accumulator
    );
  }, {});
}
function libHelper51(libParam227, libParam228) {
  return Object.keys(
    libImport5(libImport5({}, libParam227), libParam228),
  ).reduce(function (accumulator, current) {
    return (
      (accumulator[current] = libImport5(
        libImport5({}, libParam227[current] || {}),
        libParam228[current] || {},
      )),
      accumulator
    );
  }, {});
}
function libHelper52(libParam196, libParam197) {
  if (!libParam197) return libParam196;
  var libValue420 = libValue40.formats;
  return libImport5(libImport5(libImport5({}, libValue420), libParam196), {
    date: libHelper51(
      libHelper50(libValue420.date, libParam197),
      libHelper50(libParam196.date || {}, libParam197),
    ),
    time: libHelper51(
      libHelper50(libValue420.time, libParam197),
      libHelper50(libParam196.time || {}, libParam197),
    ),
  });
}
var libValue49 = function (
    libParam17,
    libParam18,
    libParam19,
    libParam20,
    libParam21,
  ) {
    var libValue131 = libParam17.locale,
      libValue132 = libParam17.formats,
      libValue133 = libParam17.messages,
      libValue134 = libParam17.defaultLocale,
      libValue135 = libParam17.defaultFormats,
      libValue136 = libParam17.fallbackOnEmptyString,
      libValue137 = libParam17.onError,
      libValue138 = libParam17.timeZone,
      libValue139 = libParam17.defaultRichTextElements;
    libParam19 === undefined &&
      (libParam19 = {
        id: "",
      });
    var libValue140 = libParam19.id,
      libValue141 = libParam19.defaultMessage;
    libHelper44(
      !!libValue140,
      "[@formatjs/intl] An `id` must be provided to format a message. You can either:\n1. Configure your build toolchain with [babel-plugin-formatjs](https://formatjs.github.io/docs/tooling/babel-plugin)\nor [@formatjs/ts-transformer](https://formatjs.github.io/docs/tooling/ts-transformer) OR\n2. Configure your `eslint` config to include [eslint-plugin-formatjs](https://formatjs.github.io/docs/tooling/linter#enforce-id)\nto autofix this issue",
    );
    var libValue142 = String(libValue140),
      libValue143 =
        libValue133 &&
        Object.prototype.hasOwnProperty.call(libValue133, libValue142) &&
        libValue133[libValue142];
    if (
      Array.isArray(libValue143) &&
      libValue143.length === 1 &&
      libValue143[0].type === libValue6.literal
    )
      return libValue143[0].value;
    if (
      !libParam20 &&
      libValue143 &&
      typeof libValue143 == "string" &&
      !libValue139
    )
      return libValue143.replace(/'\{(.*?)\}'/gi, "{$1}");
    if (
      ((libParam20 = libImport5(libImport5({}, libValue139), libParam20 || {})),
      (libValue132 = libHelper52(libValue132, libValue138)),
      (libValue135 = libHelper52(libValue135, libValue138)),
      !libValue143)
    ) {
      if (libValue136 === false && libValue143 === "") return libValue143;
      if (
        ((!libValue141 ||
          (libValue131 &&
            libValue131.toLowerCase() !== libValue134.toLowerCase())) &&
          libValue137(new at(libParam19, libValue131)),
        libValue141)
      )
        try {
          var libValue144 = libParam18.getMessageFormat(
            libValue141,
            libValue134,
            libValue135,
            libParam21,
          );
          return libValue144.format(libParam20);
        } catch (libValue343) {
          return (
            libValue137(
              new libValue47(
                `Error formatting default message for: "${libValue142}", rendering default message verbatim`,
                libValue131,
                libParam19,
                libValue343,
              ),
            ),
            typeof libValue141 == "string" ? libValue141 : libValue142
          );
        }
      return libValue142;
    }
    try {
      var libValue144 = libParam18.getMessageFormat(
        libValue143,
        libValue131,
        libValue132,
        libImport5(
          {
            formatters: libParam18,
          },
          libParam21 || {},
        ),
      );
      return libValue144.format(libParam20);
    } catch (libValue415) {
      libValue137(
        new libValue47(
          `Error formatting message: "${libValue142}", using ${libValue141 ? "default message" : "id"} as fallback.`,
          libValue131,
          libParam19,
          libValue415,
        ),
      );
    }
    if (libValue141)
      try {
        var libValue144 = libParam18.getMessageFormat(
          libValue141,
          libValue134,
          libValue135,
          libParam21,
        );
        return libValue144.format(libParam20);
      } catch (libValue402) {
        libValue137(
          new libValue47(
            `Error formatting the default message for: "${libValue142}", rendering message verbatim`,
            libValue131,
            libParam19,
            libValue402,
          ),
        );
      }
    return typeof libValue143 == "string"
      ? libValue143
      : typeof libValue141 == "string"
        ? libValue141
        : libValue142;
  },
  libValue50 = [
    "formatMatcher",
    "timeZone",
    "hour12",
    "weekday",
    "era",
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "timeZoneName",
    "hourCycle",
    "dateStyle",
    "timeStyle",
    "calendar",
    "numberingSystem",
    "fractionalSecondDigits",
  ];
function libHelper53(libParam96, libParam97, libParam98, libParam99) {
  var libValue301 = libParam96.locale,
    libValue302 = libParam96.formats,
    libValue303 = libParam96.onError,
    libValue304 = libParam96.timeZone;
  libParam99 === undefined && (libParam99 = {});
  var libValue305 = libParam99.format,
    libValue306 = libImport5(
      libImport5(
        {},
        libValue304 && {
          timeZone: libValue304,
        },
      ),
      libValue305 &&
        libHelper49(libValue302, libParam97, libValue305, libValue303),
    ),
    libValue307 = libHelper45(libParam99, libValue50, libValue306);
  return (
    libParam97 === "time" &&
      !libValue307.hour &&
      !libValue307.minute &&
      !libValue307.second &&
      !libValue307.timeStyle &&
      !libValue307.dateStyle &&
      (libValue307 = libImport5(libImport5({}, libValue307), {
        hour: "numeric",
        minute: "numeric",
      })),
    libParam98(libValue301, libValue307)
  );
}
function libHelper54(libParam134, libParam135) {
  var libValue344 = [...arguments].slice(2),
    libValue345 = libValue344[0],
    libValue346 = libValue344[1],
    libValue347 = libValue346 === undefined ? {} : libValue346,
    libValue348 =
      typeof libValue345 == "string" ? new Date(libValue345 || 0) : libValue345;
  try {
    return libHelper53(libParam134, "date", libParam135, libValue347).format(
      libValue348,
    );
  } catch (libValue468) {
    libParam134.onError(
      new libValue46("Error formatting date.", libParam134.locale, libValue468),
    );
  }
  return String(libValue348);
}
function libHelper55(libParam136, libParam137) {
  var libValue349 = [...arguments].slice(2),
    libValue350 = libValue349[0],
    libValue351 = libValue349[1],
    libValue352 = libValue351 === undefined ? {} : libValue351,
    libValue353 =
      typeof libValue350 == "string" ? new Date(libValue350 || 0) : libValue350;
  try {
    return libHelper53(libParam136, "time", libParam137, libValue352).format(
      libValue353,
    );
  } catch (libValue469) {
    libParam136.onError(
      new libValue46("Error formatting time.", libParam136.locale, libValue469),
    );
  }
  return String(libValue353);
}
function libHelper56(libParam103, libParam104) {
  var libValue310 = [...arguments].slice(2),
    libValue311 = libValue310[0],
    libValue312 = libValue310[1],
    libValue313 = libValue310[2],
    libValue314 = libValue313 === undefined ? {} : libValue313,
    libValue315 =
      typeof libValue311 == "string" ? new Date(libValue311 || 0) : libValue311,
    libValue316 =
      typeof libValue312 == "string" ? new Date(libValue312 || 0) : libValue312;
  try {
    return libHelper53(
      libParam103,
      "dateTimeRange",
      libParam104,
      libValue314,
    ).formatRange(libValue315, libValue316);
  } catch (libValue464) {
    libParam103.onError(
      new libValue46(
        "Error formatting date time range.",
        libParam103.locale,
        libValue464,
      ),
    );
  }
  return String(libValue315);
}
function libHelper57(libParam138, libParam139) {
  var libValue354 = [...arguments].slice(2),
    libValue355 = libValue354[0],
    libValue356 = libValue354[1],
    libValue357 = libValue356 === undefined ? {} : libValue356,
    libValue358 =
      typeof libValue355 == "string" ? new Date(libValue355 || 0) : libValue355;
  try {
    return libHelper53(
      libParam138,
      "date",
      libParam139,
      libValue357,
    ).formatToParts(libValue358);
  } catch (libValue470) {
    libParam138.onError(
      new libValue46("Error formatting date.", libParam138.locale, libValue470),
    );
  }
  return [];
}
function _t(libParam140, libParam141) {
  var libValue359 = [...arguments].slice(2),
    libValue360 = libValue359[0],
    libValue361 = libValue359[1],
    libValue362 = libValue361 === undefined ? {} : libValue361,
    libValue363 =
      typeof libValue360 == "string" ? new Date(libValue360 || 0) : libValue360;
  try {
    return libHelper53(
      libParam140,
      "time",
      libParam141,
      libValue362,
    ).formatToParts(libValue363);
  } catch (libValue471) {
    libParam140.onError(
      new libValue46("Error formatting time.", libParam140.locale, libValue471),
    );
  }
  return [];
}
var libValue51 = ["style", "type", "fallback", "languageDisplay"];
function libHelper58(libParam105, libParam106, libParam107, libParam108) {
  var libValue317 = libParam105.locale,
    libValue318 = libParam105.onError;
  Intl.DisplayNames ||
    libValue318(
      new libValue35(
        'Intl.DisplayNames is not available in this environment.\nTry polyfilling it using "@formatjs/intl-displaynames"\n',
        libValue34.MISSING_INTL_API,
      ),
    );
  var libValue319 = libHelper45(libParam108, libValue51);
  try {
    return libParam106(libValue317, libValue319).of(libParam107);
  } catch (libValue472) {
    libValue318(
      new libValue46(
        "Error formatting display name.",
        libValue317,
        libValue472,
      ),
    );
  }
}
var libValue52 = ["type", "style"],
  libValue53 = Date.now();
function libHelper59(libParam336) {
  return `${libValue53}_${libParam336}_${libValue53}`;
}
function libHelper60(libParam118, libParam119, libParam120, libParam121) {
  libParam121 === undefined && (libParam121 = {});
  var libValue335 = libHelper61(
    libParam118,
    libParam119,
    libParam120,
    libParam121,
  ).reduce(function (accumulator, current) {
    var libValue423 = current.value;
    return (
      typeof libValue423 == "string" &&
      typeof accumulator[accumulator.length - 1] == "string"
        ? (accumulator[accumulator.length - 1] += libValue423)
        : accumulator.push(libValue423),
      accumulator
    );
  }, []);
  return libValue335.length === 1
    ? libValue335[0]
    : libValue335.length === 0
      ? ""
      : libValue335;
}
function libHelper61(libParam45, libParam46, libParam47, libParam48) {
  var libValue216 = libParam45.locale,
    libValue217 = libParam45.onError;
  libParam48 === undefined && (libParam48 = {});
  Intl.ListFormat ||
    libValue217(
      new libValue35(
        'Intl.ListFormat is not available in this environment.\nTry polyfilling it using "@formatjs/intl-listformat"\n',
        libValue34.MISSING_INTL_API,
      ),
    );
  var libValue218 = libHelper45(libParam48, libValue52);
  try {
    var libValue219 = {},
      libValue220 = Array.from(libParam47).map(function (item, index) {
        if (typeof item == "object" && item) {
          var libValue444 = libHelper59(index);
          return ((libValue219[libValue444] = item), libValue444);
        }
        return String(item);
      });
    return libParam46(libValue216, libValue218)
      .formatToParts(libValue220)
      .map(function (item) {
        return item.type === "literal"
          ? item
          : libImport5(libImport5({}, item), {
              value: libValue219[item.value] || item.value,
            });
      });
  } catch (libValue475) {
    libValue217(
      new libValue46("Error formatting list.", libValue216, libValue475),
    );
  }
  return libParam47;
}
var libValue54 = ["type"];
function libHelper62(libParam90, libParam91, libParam92, libParam93) {
  var libValue285 = libParam90.locale,
    libValue286 = libParam90.onError;
  libParam93 === undefined && (libParam93 = {});
  Intl.PluralRules ||
    libValue286(
      new libValue35(
        'Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n',
        libValue34.MISSING_INTL_API,
      ),
    );
  var libValue287 = libHelper45(libParam93, libValue54);
  try {
    return libParam91(libValue285, libValue287).select(libParam92);
  } catch (libValue474) {
    libValue286(
      new libValue46("Error formatting plural.", libValue285, libValue474),
    );
  }
  return "other";
}
var libValue55 = ["numeric", "style"];
function libHelper63(libParam177, libParam178, libParam179) {
  var libValue403 = libParam177.locale,
    libValue404 = libParam177.formats,
    libValue405 = libParam177.onError;
  libParam179 === undefined && (libParam179 = {});
  var libValue406 = libParam179.format,
    libValue407 =
      (!!libValue406 &&
        libHelper49(libValue404, "relative", libValue406, libValue405)) ||
      {};
  return libParam178(
    libValue403,
    libHelper45(libParam179, libValue55, libValue407),
  );
}
function libHelper64(
  libParam80,
  libParam81,
  libParam82,
  libParam83,
  libParam84,
) {
  libParam84 === undefined && (libParam84 = {});
  libParam83 ||= "second";
  Intl.RelativeTimeFormat ||
    libParam80.onError(
      new libValue35(
        'Intl.RelativeTimeFormat is not available in this environment.\nTry polyfilling it using "@formatjs/intl-relativetimeformat"\n',
        libValue34.MISSING_INTL_API,
      ),
    );
  try {
    return libHelper63(libParam80, libParam81, libParam84).format(
      libParam82,
      libParam83,
    );
  } catch (libValue465) {
    libParam80.onError(
      new libValue46(
        "Error formatting relative time.",
        libParam80.locale,
        libValue465,
      ),
    );
  }
  return String(libParam82);
}
var libValue56 = [
  "style",
  "currency",
  "unit",
  "unitDisplay",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "currencyDisplay",
  "currencySign",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "numberingSystem",
  "trailingZeroDisplay",
  "roundingPriority",
  "roundingIncrement",
  "roundingMode",
];
function libHelper65(libParam182, libParam183, libParam184) {
  var libValue410 = libParam182.locale,
    libValue411 = libParam182.formats,
    libValue412 = libParam182.onError;
  libParam184 === undefined && (libParam184 = {});
  var libValue413 = libParam184.format,
    libValue414 =
      (libValue413 &&
        libHelper49(libValue411, "number", libValue413, libValue412)) ||
      {};
  return libParam183(
    libValue410,
    libHelper45(libParam184, libValue56, libValue414),
  );
}
function libHelper66(libParam185, libParam186, libParam187, libParam188) {
  libParam188 === undefined && (libParam188 = {});
  try {
    return libHelper65(libParam185, libParam186, libParam188).format(
      libParam187,
    );
  } catch (libValue466) {
    libParam185.onError(
      new libValue46(
        "Error formatting number.",
        libParam185.locale,
        libValue466,
      ),
    );
  }
  return String(libParam187);
}
function libHelper67(libParam189, libParam190, libParam191, libParam192) {
  libParam192 === undefined && (libParam192 = {});
  try {
    return libHelper65(libParam189, libParam190, libParam192).formatToParts(
      libParam191,
    );
  } catch (libValue467) {
    libParam189.onError(
      new libValue46(
        "Error formatting number.",
        libParam189.locale,
        libValue467,
      ),
    );
  }
  return [];
}
function libHelper68(libParam265) {
  return (
    typeof (libParam265
      ? libParam265[Object.keys(libParam265)[0]]
      : undefined) == "string"
  );
}
function libHelper69(libParam109) {
  libParam109.onWarn &&
    libParam109.defaultRichTextElements &&
    libHelper68(libParam109.messages || {}) &&
    libParam109.onWarn(
      '[@formatjs/intl] "defaultRichTextElements" was specified but "message" was not pre-compiled. \nPlease consider using "@formatjs/cli" to pre-compile your messages for performance.\nFor more details see https://formatjs.github.io/docs/getting-started/message-distribution',
    );
}
function libHelper70(libParam28, libParam29) {
  var libValue162 = libHelper48(libParam29),
    libValue163 = libImport5(libImport5({}, libValue48), libParam28),
    libValue164 = libValue163.locale,
    libValue165 = libValue163.defaultLocale,
    libValue166 = libValue163.onError;
  return (
    libValue164
      ? !Intl.NumberFormat.supportedLocalesOf(libValue164).length && libValue166
        ? libValue166(
            new libValue45(
              `Missing locale data for locale: "${libValue164}" in Intl.NumberFormat. Using default locale: "${libValue165}" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details`,
            ),
          )
        : !Intl.DateTimeFormat.supportedLocalesOf(libValue164).length &&
          libValue166 &&
          libValue166(
            new libValue45(
              `Missing locale data for locale: "${libValue164}" in Intl.DateTimeFormat. Using default locale: "${libValue165}" as fallback. See https://formatjs.github.io/docs/react-intl#runtime-requirements for more details`,
            ),
          )
      : (libValue166 &&
          libValue166(
            new libValue44(
              `"locale" was not configured, using "${libValue165}" as fallback. See https://formatjs.github.io/docs/react-intl/api#intlshape for more details`,
            ),
          ),
        (libValue163.locale = libValue163.defaultLocale || "en")),
    libHelper69(libValue163),
    libImport5(libImport5({}, libValue163), {
      formatters: libValue162,
      formatNumber: libHelper66.bind(
        null,
        libValue163,
        libValue162.getNumberFormat,
      ),
      formatNumberToParts: libHelper67.bind(
        null,
        libValue163,
        libValue162.getNumberFormat,
      ),
      formatRelativeTime: libHelper64.bind(
        null,
        libValue163,
        libValue162.getRelativeTimeFormat,
      ),
      formatDate: libHelper54.bind(
        null,
        libValue163,
        libValue162.getDateTimeFormat,
      ),
      formatDateToParts: libHelper57.bind(
        null,
        libValue163,
        libValue162.getDateTimeFormat,
      ),
      formatTime: libHelper55.bind(
        null,
        libValue163,
        libValue162.getDateTimeFormat,
      ),
      formatDateTimeRange: libHelper56.bind(
        null,
        libValue163,
        libValue162.getDateTimeFormat,
      ),
      formatTimeToParts: _t.bind(
        null,
        libValue163,
        libValue162.getDateTimeFormat,
      ),
      formatPlural: libHelper62.bind(
        null,
        libValue163,
        libValue162.getPluralRules,
      ),
      formatMessage: libValue49.bind(null, libValue163, libValue162),
      $t: libValue49.bind(null, libValue163, libValue162),
      formatList: libHelper60.bind(
        null,
        libValue163,
        libValue162.getListFormat,
      ),
      formatListToParts: libHelper61.bind(
        null,
        libValue163,
        libValue162.getListFormat,
      ),
      formatDisplayName: libHelper58.bind(
        null,
        libValue163,
        libValue162.getDisplayNames,
      ),
    })
  );
}
function libHelper71(libParam273, libParam274, libParam275) {
  if ((libParam275 === undefined && (libParam275 = Error), !libParam273))
    throw new libParam275(libParam274);
}
function libHelper72(libParam229) {
  libHelper71(
    libParam229,
    "[React Intl] Could not find required `intl` object. <IntlProvider> needs to exist in the component ancestry.",
  );
}
var libValue58 = libImport5(libImport5({}, libValue48), {
    textComponent: React.Fragment,
  }),
  libValue59 = function (libParam257, libParam258) {
    return React.isValidElement(libParam257)
      ? React.cloneElement(libParam257, {
          key: libParam258,
        })
      : libParam257;
  },
  libValue60 = function (libParam299) {
    return React.Children.map(libParam299, libValue59) ?? [];
  };
function libHelper73(libParam288) {
  return function (libParam343) {
    return libParam288(libValue60(libParam343));
  };
}
function libHelper74(libParam132, libParam133) {
  if (libParam132 === libParam133) return true;
  if (!libParam132 || !libParam133) return false;
  var libValue337 = Object.keys(libParam132),
    libValue338 = Object.keys(libParam133),
    libValue339 = libValue337.length;
  if (libValue338.length !== libValue339) return false;
  for (var libValue340 = 0; libValue340 < libValue339; libValue340++) {
    var libValue341 = libValue337[libValue340];
    if (
      libParam132[libValue341] !== libParam133[libValue341] ||
      !Object.prototype.hasOwnProperty.call(libParam133, libValue341)
    )
      return false;
  }
  return true;
}
var libValue61 = chunkT((libParam7) => {
    var libValue97 = typeof Symbol == "function" && Symbol.for,
      libValue98 = libValue97 ? Symbol.for("react.element") : 60103,
      libValue99 = libValue97 ? Symbol.for("react.portal") : 60106,
      libValue100 = libValue97 ? Symbol.for("react.fragment") : 60107,
      libValue101 = libValue97 ? Symbol.for("react.strict_mode") : 60108,
      libValue102 = libValue97 ? Symbol.for("react.profiler") : 60114,
      libValue103 = libValue97 ? Symbol.for("react.provider") : 60109,
      libValue104 = libValue97 ? Symbol.for("react.context") : 60110,
      libValue105 = libValue97 ? Symbol.for("react.async_mode") : 60111,
      libValue106 = libValue97 ? Symbol.for("react.concurrent_mode") : 60111,
      libValue107 = libValue97 ? Symbol.for("react.forward_ref") : 60112,
      libValue108 = libValue97 ? Symbol.for("react.suspense") : 60113,
      libValue109 = libValue97 ? Symbol.for("react.suspense_list") : 60120,
      libValue110 = libValue97 ? Symbol.for("react.memo") : 60115,
      libValue111 = libValue97 ? Symbol.for("react.lazy") : 60116,
      libValue112 = libValue97 ? Symbol.for("react.block") : 60121,
      libValue113 = libValue97 ? Symbol.for("react.fundamental") : 60117,
      libValue114 = libValue97 ? Symbol.for("react.responder") : 60118,
      libValue115 = libValue97 ? Symbol.for("react.scope") : 60119;
    function libHelper84(libParam53) {
      if (typeof libParam53 == "object" && libParam53) {
        var libValue224 = libParam53.$$typeof;
        switch (libValue224) {
          case libValue98:
            switch (((libParam53 = libParam53.type), libParam53)) {
              case libValue105:
              case libValue106:
              case libValue100:
              case libValue102:
              case libValue101:
              case libValue108:
                return libParam53;
              default:
                switch (((libParam53 &&= libParam53.$$typeof), libParam53)) {
                  case libValue104:
                  case libValue107:
                  case libValue111:
                  case libValue110:
                  case libValue103:
                    return libParam53;
                  default:
                    return libValue224;
                }
            }
          case libValue99:
            return libValue224;
        }
      }
    }
    function libHelper85(libParam339) {
      return libHelper84(libParam339) === libValue106;
    }
    libParam7.AsyncMode = libValue105;
    libParam7.ConcurrentMode = libValue106;
    libParam7.ContextConsumer = libValue104;
    libParam7.ContextProvider = libValue103;
    libParam7.Element = libValue98;
    libParam7.ForwardRef = libValue107;
    libParam7.Fragment = libValue100;
    libParam7.Lazy = libValue111;
    libParam7.Memo = libValue110;
    libParam7.Portal = libValue99;
    libParam7.Profiler = libValue102;
    libParam7.StrictMode = libValue101;
    libParam7.Suspense = libValue108;
    libParam7.isAsyncMode = function (libParam300) {
      return (
        libHelper85(libParam300) || libHelper84(libParam300) === libValue105
      );
    };
    libParam7.isConcurrentMode = libHelper85;
    libParam7.isContextConsumer = function (libParam313) {
      return libHelper84(libParam313) === libValue104;
    };
    libParam7.isContextProvider = function (libParam314) {
      return libHelper84(libParam314) === libValue103;
    };
    libParam7.isElement = function (libParam262) {
      return (
        typeof libParam262 == "object" &&
        !!libParam262 &&
        libParam262.$$typeof === libValue98
      );
    };
    libParam7.isForwardRef = function (libParam315) {
      return libHelper84(libParam315) === libValue107;
    };
    libParam7.isFragment = function (libParam316) {
      return libHelper84(libParam316) === libValue100;
    };
    libParam7.isLazy = function (libParam317) {
      return libHelper84(libParam317) === libValue111;
    };
    libParam7.isMemo = function (libParam318) {
      return libHelper84(libParam318) === libValue110;
    };
    libParam7.isPortal = function (libParam319) {
      return libHelper84(libParam319) === libValue99;
    };
    libParam7.isProfiler = function (libParam320) {
      return libHelper84(libParam320) === libValue102;
    };
    libParam7.isStrictMode = function (libParam321) {
      return libHelper84(libParam321) === libValue101;
    };
    libParam7.isSuspense = function (libParam322) {
      return libHelper84(libParam322) === libValue108;
    };
    libParam7.isValidElementType = function (libParam59) {
      return (
        typeof libParam59 == "string" ||
        typeof libParam59 == "function" ||
        libParam59 === libValue100 ||
        libParam59 === libValue106 ||
        libParam59 === libValue102 ||
        libParam59 === libValue101 ||
        libParam59 === libValue108 ||
        libParam59 === libValue109 ||
        (typeof libParam59 == "object" &&
          !!libParam59 &&
          (libParam59.$$typeof === libValue111 ||
            libParam59.$$typeof === libValue110 ||
            libParam59.$$typeof === libValue103 ||
            libParam59.$$typeof === libValue104 ||
            libParam59.$$typeof === libValue107 ||
            libParam59.$$typeof === libValue113 ||
            libParam59.$$typeof === libValue114 ||
            libParam59.$$typeof === libValue115 ||
            libParam59.$$typeof === libValue112))
      );
    };
    libParam7.typeOf = libHelper84;
  }),
  libValue62 = chunkT((libParam344, libParam345) => {
    libParam345.exports = libValue61();
  });
chunkS(
  chunkT((libParam34, libParam35) => {
    var libValue170 = libValue62(),
      libValue171 = {
        childContextTypes: true,
        contextType: true,
        contextTypes: true,
        defaultProps: true,
        displayName: true,
        getDefaultProps: true,
        getDerivedStateFromError: true,
        getDerivedStateFromProps: true,
        mixins: true,
        propTypes: true,
        type: true,
      },
      libValue172 = {
        name: true,
        length: true,
        prototype: true,
        caller: true,
        callee: true,
        arguments: true,
        arity: true,
      },
      libValue173 = {
        $$typeof: true,
        render: true,
        defaultProps: true,
        displayName: true,
        propTypes: true,
      },
      libValue174 = {
        $$typeof: true,
        compare: true,
        defaultProps: true,
        displayName: true,
        propTypes: true,
        type: true,
      },
      libValue175 = {};
    libValue175[libValue170.ForwardRef] = libValue173;
    libValue175[libValue170.Memo] = libValue174;
    function libHelper87(libParam287) {
      return libValue170.isMemo(libParam287)
        ? libValue174
        : libValue175[libParam287.$$typeof] || libValue171;
    }
    var libValue176 = Object.defineProperty,
      libValue177 = Object.getOwnPropertyNames,
      libValue178 = Object.getOwnPropertySymbols,
      libValue179 = Object.getOwnPropertyDescriptor,
      libValue180 = Object.getPrototypeOf,
      libValue181 = Object.prototype;
    function libHelper88(libParam70, libParam71, libParam72) {
      if (typeof libParam71 != "string") {
        if (libValue181) {
          var libValue269 = libValue180(libParam71);
          libValue269 &&
            libValue269 !== libValue181 &&
            libHelper88(libParam70, libValue269, libParam72);
        }
        var libValue270 = libValue177(libParam71);
        libValue178 &&
          (libValue270 = libValue270.concat(libValue178(libParam71)));
        for (
          var libValue271 = libHelper87(libParam70),
            libValue272 = libHelper87(libParam71),
            libValue273 = 0;
          libValue273 < libValue270.length;
          ++libValue273
        ) {
          var libValue274 = libValue270[libValue273];
          if (
            !libValue172[libValue274] &&
            !(libParam72 && libParam72[libValue274]) &&
            !(libValue272 && libValue272[libValue274]) &&
            !(libValue271 && libValue271[libValue274])
          ) {
            var libValue275 = libValue179(libParam71, libValue274);
            try {
              libValue176(libParam70, libValue274, libValue275);
            } catch {}
          }
        }
      }
      return libParam70;
    }
    libParam35.exports = libHelper88;
  })(),
);
var libValue63 =
  typeof window < "u" && !window.__REACT_INTL_BYPASS_GLOBAL_CONTEXT__
    ? window.__REACT_INTL_CONTEXT__ ||
      (window.__REACT_INTL_CONTEXT__ = React.createContext(null))
    : React.createContext(null);
libValue63.Consumer;
var libValue64 = libValue63.Provider,
  libValue65 = libValue63;
function libL() {
  var libValue473 = React.useContext(libValue65);
  return (libHelper72(libValue473), libValue473);
}
var libValue66;
(function (libParam171) {
  libParam171.formatDate = "FormattedDate";
  libParam171.formatTime = "FormattedTime";
  libParam171.formatNumber = "FormattedNumber";
  libParam171.formatList = "FormattedList";
  libParam171.formatDisplayName = "FormattedDisplayName";
})((libValue66 ||= {}));
var libValue67;
(function (libParam201) {
  libParam201.formatDate = "FormattedDateParts";
  libParam201.formatTime = "FormattedTimeParts";
  libParam201.formatNumber = "FormattedNumberParts";
  libParam201.formatList = "FormattedListParts";
})((libValue67 ||= {}));
var libValue68 = function (libParam230) {
  var libValue445 = libL(),
    libValue446 = libParam230.value,
    libValue447 = libParam230.children,
    libValue448 = libImport2(libParam230, ["value", "children"]);
  return libValue447(libValue445.formatNumberToParts(libValue446, libValue448));
};
libValue68.displayName = "FormattedNumberParts";
libValue68.displayName = "FormattedNumberParts";
function libHelper75(libParam115) {
  var libValue333 = function (libParam150) {
    var libValue365 = libL(),
      libValue366 = libParam150.value,
      libValue367 = libParam150.children,
      libValue368 = libImport2(libParam150, ["value", "children"]),
      libValue369 =
        typeof libValue366 == "string"
          ? new Date(libValue366 || 0)
          : libValue366;
    return libValue367(
      libParam115 === "formatDate"
        ? libValue365.formatDateToParts(libValue369, libValue368)
        : libValue365.formatTimeToParts(libValue369, libValue368),
    );
  };
  return ((libValue333.displayName = libValue67[libParam115]), libValue333);
}
function libHelper76(libParam129) {
  var libValue336 = function (libParam159) {
    var libValue375 = libL(),
      libValue376 = libParam159.value,
      libValue377 = libParam159.children,
      libValue378 = libImport2(libParam159, ["value", "children"]),
      libValue379 = libValue375[libParam129](libValue376, libValue378);
    if (typeof libValue377 == "function") return libValue377(libValue379);
    var libValue380 = libValue375.textComponent || React.Fragment;
    return React.createElement(libValue380, null, libValue379);
  };
  return ((libValue336.displayName = libValue66[libParam129]), libValue336);
}
function libHelper77(libParam225) {
  return (
    libParam225 &&
    Object.keys(libParam225).reduce(function (accumulator, current) {
      var libValue463 = libParam225[current];
      return (
        (accumulator[current] = libHelper39(libValue463)
          ? libHelper73(libValue463)
          : libValue463),
        accumulator
      );
    }, {})
  );
}
var libValue69 = function (libParam215, libParam216, libParam217, libParam218) {
    var libValue436 = [...arguments].slice(4),
      libValue437 = libHelper77(libParam218),
      libValue438 = libValue49.apply(
        undefined,
        libImport3(
          [libParam215, libParam216, libParam217, libValue437],
          libValue436,
          false,
        ),
      );
    return Array.isArray(libValue438) ? libValue60(libValue438) : libValue438;
  },
  libC = function (libParam57, libParam58) {
    var libValue226 = libParam57.defaultRichTextElements,
      libValue227 = libImport2(libParam57, ["defaultRichTextElements"]),
      libValue228 = libHelper77(libValue226),
      libValue229 = libHelper70(
        libImport5(libImport5(libImport5({}, libValue58), libValue227), {
          defaultRichTextElements: libValue228,
        }),
        libParam58,
      ),
      libValue230 = {
        locale: libValue229.locale,
        timeZone: libValue229.timeZone,
        fallbackOnEmptyString: libValue229.fallbackOnEmptyString,
        formats: libValue229.formats,
        defaultLocale: libValue229.defaultLocale,
        defaultFormats: libValue229.defaultFormats,
        messages: libValue229.messages,
        onError: libValue229.onError,
        defaultRichTextElements: libValue228,
      };
    return libImport5(libImport5({}, libValue229), {
      formatMessage: libValue69.bind(null, libValue230, libValue229.formatters),
      $t: libValue69.bind(null, libValue230, libValue229.formatters),
    });
  };
function $t(libParam233, libParam234) {
  var libValue449 = libParam233.values,
    libValue450 = libImport2(libParam233, ["values"]),
    libValue451 = libParam234.values,
    libValue452 = libImport2(libParam234, ["values"]);
  return (
    libHelper74(libValue451, libValue449) &&
    libHelper74(libValue450, libValue452)
  );
}
function libHelper78(libParam69) {
  var libValue251 = libL(),
    libValue252 = libValue251.formatMessage,
    libValue253 = libValue251.textComponent,
    libValue254 = libValue253 === undefined ? React.Fragment : libValue253,
    libValue255 = libParam69.id,
    libValue256 = libParam69.description,
    libValue257 = libParam69.defaultMessage,
    libValue258 = libParam69.values,
    libValue259 = libParam69.children,
    libValue260 = libParam69.tagName,
    libValue261 = libValue260 === undefined ? libValue254 : libValue260,
    libValue262 = libParam69.ignoreTag,
    libValue263 = libValue252(
      {
        id: libValue255,
        description: libValue256,
        defaultMessage: libValue257,
      },
      libValue258,
      {
        ignoreTag: libValue262,
      },
    );
  return typeof libValue259 == "function"
    ? libValue259(Array.isArray(libValue263) ? libValue263 : [libValue263])
    : libValue261
      ? React.createElement(libValue261, null, libValue263)
      : React.createElement(React.Fragment, null, libValue263);
}
libHelper78.displayName = "FormattedMessage";
var libS = React.memo(libHelper78, $t);
libS.displayName = "MemoizedFormattedMessage";
function libHelper79(libParam89) {
  return {
    locale: libParam89.locale,
    timeZone: libParam89.timeZone,
    fallbackOnEmptyString: libParam89.fallbackOnEmptyString,
    formats: libParam89.formats,
    textComponent: libParam89.textComponent,
    messages: libParam89.messages,
    defaultLocale: libParam89.defaultLocale,
    defaultFormats: libParam89.defaultFormats,
    onError: libParam89.onError,
    onWarn: libParam89.onWarn,
    wrapRichTextChunksInFragment: libParam89.wrapRichTextChunksInFragment,
    defaultRichTextElements: libParam89.defaultRichTextElements,
  };
}
export const libO = (function (libParam49) {
  libImport4(libHelper89, libParam49);
  function libHelper89() {
    var libValue371 =
      (libParam49 !== null && libParam49.apply(this, arguments)) || this;
    return (
      (libValue371.cache = libHelper46()),
      (libValue371.state = {
        cache: libValue371.cache,
        intl: libC(libHelper79(libValue371.props), libValue371.cache),
        prevConfig: libHelper79(libValue371.props),
      }),
      libValue371
    );
  }
  return (
    (libHelper89.getDerivedStateFromProps = function (
      libParam223,
      libParam224,
    ) {
      var libValue441 = libParam224.prevConfig,
        libValue442 = libParam224.cache,
        libValue443 = libHelper79(libParam223);
      return libHelper74(libValue441, libValue443)
        ? null
        : {
            intl: libC(libValue443, libValue442),
            prevConfig: libValue443,
          };
    }),
    (libHelper89.prototype.render = function () {
      return (
        libHelper72(this.state.intl),
        React.createElement(
          libValue64,
          {
            value: this.state.intl,
          },
          this.props.children,
        )
      );
    }),
    (libHelper89.displayName = "IntlProvider"),
    (libHelper89.defaultProps = libValue58),
    libHelper89
  );
})(React.PureComponent);
function libHelper80(libParam252) {
  var libValue458 = Math.abs(libParam252);
  return libValue458 < 60
    ? "second"
    : libValue458 < 3600
      ? "minute"
      : libValue458 < 86400
        ? "hour"
        : "day";
}
function libHelper81(libParam219) {
  switch (libParam219) {
    case "second":
      return 1;
    case "minute":
      return 60;
    case "hour":
      return 3600;
    default:
      return 86400;
  }
}
function libHelper82(libParam220, libParam221) {
  if (!libParam220) return 0;
  switch (libParam221) {
    case "second":
      return libParam220;
    case "minute":
      return libParam220 * 60;
    default:
      return libParam220 * 3600;
  }
}
var libValue72 = ["second", "minute", "hour"];
function $(libParam276) {
  return (
    libParam276 === undefined && (libParam276 = "second"),
    libValue72.indexOf(libParam276) > -1
  );
}
var libValue73 = function (libParam114) {
    var libValue325 = libL(),
      libValue326 = libValue325.formatRelativeTime,
      libValue327 = libValue325.textComponent,
      libValue328 = libParam114.children,
      libValue329 = libParam114.value,
      libValue330 = libParam114.unit,
      libValue331 = libImport2(libParam114, ["children", "value", "unit"]),
      libValue332 = libValue326(libValue329 || 0, libValue330, libValue331);
    return typeof libValue328 == "function"
      ? libValue328(libValue332)
      : libValue327
        ? React.createElement(libValue327, null, libValue332)
        : React.createElement(React.Fragment, null, libValue332);
  },
  libA = function (libParam40) {
    var libValue190 = libParam40.value,
      libValue191 = libValue190 === undefined ? 0 : libValue190,
      libValue192 = libParam40.unit,
      libValue193 = libValue192 === undefined ? "second" : libValue192,
      libValue194 = libParam40.updateIntervalInSeconds,
      libValue195 = libImport2(libParam40, [
        "value",
        "unit",
        "updateIntervalInSeconds",
      ]);
    libHelper71(
      !libValue194 || !!(libValue194 && $(libValue193)),
      "Cannot schedule update with unit longer than hour",
    );
    var libValue196 = React.useState(),
      libValue197 = libValue196[0],
      libValue198 = libValue196[1],
      libValue199 = React.useState(0),
      libValue200 = libValue199[0],
      libValue201 = libValue199[1],
      libValue202 = React.useState(0),
      libValue203 = libValue202[0],
      libValue204 = libValue202[1],
      libValue205;
    (libValue193 !== libValue197 || libValue191 !== libValue200) &&
      (libValue201(libValue191 || 0),
      libValue198(libValue193),
      libValue204($(libValue193) ? libHelper82(libValue191, libValue193) : 0));
    React.useEffect(
      function () {
        function libHelper91() {
          clearTimeout(libValue205);
        }
        if ((libHelper91(), !libValue194 || !$(libValue193)))
          return libHelper91;
        var libValue264 = libValue203 - libValue194,
          className = libHelper80(libValue264);
        if (className === "day") return libHelper91;
        var libValue265 = libHelper81(className),
          libValue266 = libValue264 - (libValue264 % libValue265),
          libValue267 =
            libValue266 >= libValue203
              ? libValue266 - libValue265
              : libValue266,
          libValue268 = Math.abs(libValue267 - libValue203);
        return (
          libValue203 !== libValue267 &&
            (libValue205 = setTimeout(function () {
              return libValue204(libValue267);
            }, libValue268 * 1e3)),
          libHelper91
        );
      },
      [libValue203, libValue194, libValue193],
    );
    var libValue206 = libValue191 || 0,
      libValue207 = libValue193;
    if ($(libValue193) && typeof libValue203 == "number" && libValue194) {
      libValue207 = libHelper80(libValue203);
      var libValue208 = libHelper81(libValue207);
      libValue206 = Math.round(libValue203 / libValue208);
    }
    return React.createElement(
      libValue73,
      libImport5(
        {
          value: libValue206,
          unit: libValue207,
        },
        libValue195,
      ),
    );
  };
libA.displayName = "FormattedRelativeTime";
export function libI(libParam346) {
  return libParam346;
}
export function libR(libParam347) {
  return libParam347;
}
export const libT = libHelper76("formatDate");
libHelper76("formatTime");
export const libN = libHelper76("formatNumber");
libHelper76("formatList");
libHelper76("formatDisplayName");
libHelper75("formatDate");
libHelper75("formatTime");
export { libA, libC, libL, libS };

// Aliases used by consumer checkpoints
export declare const libI: any;
export declare const libR: any;

// Additional aliases exported for consumers mapped via IMPORT_MAP
export const c: any = undefined;
export const i: any = undefined;
export const l: any = undefined;
export const r: any = undefined;
export const s: any = undefined;
