// Restored from ref/webview/assets/_baseFor-eDjxQiUL.js
// BaseFor chunk restored from the Codex webview bundle.
function baseForHelper1() {
  this.__data__ = [];
  this.size = 0;
}
function baseForO(baseForParam39, __baseForO) {
  return (
    baseForParam39 === __baseForO ||
    (baseForParam39 !== baseForParam39 && __baseForO !== __baseForO)
  );
}
function baseForHelper2(baseForParam26, baseForParam27) {
  for (var baseForValue109 = baseForParam26.length; baseForValue109--; )
    if (baseForO(baseForParam26[baseForValue109][0], baseForParam27))
      return baseForValue109;
  return -1;
}
var baseForValue1 = Array.prototype.splice;
function baseForHelper3(baseForParam9) {
  var __baseForO = this.__data__,
    baseForValue93 = baseForHelper2(__baseForO, baseForParam9);
  return baseForValue93 < 0
    ? false
    : (baseForValue93 == __baseForO.length - 1
        ? __baseForO.pop()
        : baseForValue1.call(__baseForO, baseForValue93, 1),
      --this.size,
      true);
}
function baseForHelper4(baseForParam28) {
  var __baseForO = this.__data__,
    baseForValue110 = baseForHelper2(__baseForO, baseForParam28);
  return baseForValue110 < 0 ? undefined : __baseForO[baseForValue110][1];
}
function baseForHelper5(baseForParam43) {
  return baseForHelper2(this.__data__, baseForParam43) > -1;
}
function baseForHelper6(baseForParam17, __baseForO) {
  var baseForValue102 = this.__data__,
    baseForValue103 = baseForHelper2(baseForValue102, baseForParam17);
  return (
    baseForValue103 < 0
      ? (++this.size, baseForValue102.push([baseForParam17, __baseForO]))
      : (baseForValue102[baseForValue103][1] = __baseForO),
    this
  );
}
function baseForHelper7(baseForParam14) {
  var __baseForO = -1,
    baseForValue96 = baseForParam14 == null ? 0 : baseForParam14.length;
  for (this.clear(); ++__baseForO < baseForValue96; ) {
    var baseForValue97 = baseForParam14[__baseForO];
    this.set(baseForValue97[0], baseForValue97[1]);
  }
}
baseForHelper7.prototype.clear = baseForHelper1;
baseForHelper7.prototype.delete = baseForHelper3;
baseForHelper7.prototype.get = baseForHelper4;
baseForHelper7.prototype.has = baseForHelper5;
baseForHelper7.prototype.set = baseForHelper6;
function baseForHelper8() {
  this.__data__ = new baseForHelper7();
  this.size = 0;
}
function baseForHelper9(baseForParam24) {
  var __baseForO = this.__data__,
    baseForValue108 = __baseForO.delete(baseForParam24);
  return ((this.size = __baseForO.size), baseForValue108);
}
function baseForHelper10(baseForParam44) {
  return this.__data__.get(baseForParam44);
}
function baseForHelper11(baseForParam45) {
  return this.__data__.has(baseForParam45);
}
var baseForValue2 =
    typeof global == "object" && global && global.Object === Object && global,
  baseForValue3 =
    typeof self == "object" && self && self.Object === Object && self,
  baseForD = baseForValue2 || baseForValue3 || Function("return this")(),
  baseForE = baseForD.Symbol,
  baseForValue4 = Object.prototype,
  baseForValue5 = baseForValue4.hasOwnProperty,
  baseForValue6 = baseForValue4.toString,
  baseForValue7 = baseForE ? baseForE.toStringTag : undefined;
function baseForHelper12(baseForParam6) {
  var __baseForO = baseForValue5.call(baseForParam6, baseForValue7),
    baseForValue85 = baseForParam6[baseForValue7];
  try {
    baseForParam6[baseForValue7] = undefined;
  } catch {}
  var baseForValue87 = baseForValue6.call(baseForParam6);
  return (
    __baseForO
      ? (baseForParam6[baseForValue7] = baseForValue85)
      : delete baseForParam6[baseForValue7],
    baseForValue87
  );
}
var baseForValue8 = Object.prototype.toString;
function baseForHelper13(baseForParam50) {
  return baseForValue8.call(baseForParam50);
}
var baseForValue11 = baseForE ? baseForE.toStringTag : undefined;
function baseForT(baseForParam18) {
  return baseForParam18 == null
    ? baseForParam18 === undefined
      ? "[object Undefined]"
      : "[object Null]"
    : baseForValue11 && baseForValue11 in Object(baseForParam18)
      ? baseForHelper12(baseForParam18)
      : baseForHelper13(baseForParam18);
}
function baseForW(baseForParam25) {
  var __baseForO = typeof baseForParam25;
  return (
    baseForParam25 != null &&
    (__baseForO == "object" || __baseForO == "function")
  );
}
function baseForC(baseForParam22) {
  if (!baseForW(baseForParam22)) return false;
  var __baseForO = baseForT(baseForParam22);
  return (
    __baseForO == "[object Function]" ||
    __baseForO == "[object GeneratorFunction]" ||
    __baseForO == "[object AsyncFunction]" ||
    __baseForO == "[object Proxy]"
  );
}
var baseForValue16 = baseForD["__core-js_shared__"],
  baseForValue17 = (function () {
    var baseForValue104 = /[^.]+$/.exec(
      (baseForValue16 && baseForValue16.keys && baseForValue16.keys.IE_PROTO) ||
        "",
    );
    return baseForValue104 ? "Symbol(src)_1." + baseForValue104 : "";
  })();
function baseForHelper14(baseForParam49) {
  return !!baseForValue17 && baseForValue17 in baseForParam49;
}
var baseForValue18 = Function.prototype.toString;
function baseForS(baseForParam12) {
  if (baseForParam12 != null) {
    try {
      return baseForValue18.call(baseForParam12);
    } catch {}
    try {
      return baseForParam12 + "";
    } catch {}
  }
  return "";
}
var _e = /[\\^$.*+?()[\]{}|]/g,
  baseForValue19 = /^\[object .+?Constructor\]$/,
  baseForValue20 = Function.prototype,
  be = Object.prototype,
  baseForValue21 = baseForValue20.toString,
  baseForValue22 = be.hasOwnProperty,
  baseForValue23 = RegExp(
    "^" +
      baseForValue21
        .call(baseForValue22)
        .replace(_e, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?",
        ) +
      "$",
  );
function baseForHelper15(baseForParam34) {
  return !baseForW(baseForParam34) || baseForHelper14(baseForParam34)
    ? false
    : (baseForC(baseForParam34) ? baseForValue23 : baseForValue19).test(
        baseForS(baseForParam34),
      );
}
function baseForHelper16(baseForParam51, __baseForO) {
  return baseForParam51?.[__baseForO];
}
function baseForX(baseForParam36, __baseForO) {
  var baseForValue113 = baseForHelper16(baseForParam36, __baseForO);
  return baseForHelper15(baseForValue113) ? baseForValue113 : undefined;
}
var baseForB = baseForX(baseForD, "Map"),
  baseForValue24 = baseForX(Object, "create");
function baseForHelper17() {
  this.__data__ = baseForValue24 ? baseForValue24(null) : {};
  this.size = 0;
}
function baseForHelper18(baseForParam23) {
  var __baseForO =
    this.has(baseForParam23) && delete this.__data__[baseForParam23];
  return ((this.size -= __baseForO ? 1 : 0), __baseForO);
}
var baseForValue26 = Object.prototype.hasOwnProperty;
function baseForHelper19(baseForParam13) {
  var __baseForO = this.__data__;
  if (baseForValue24) {
    var baseForValue95 = __baseForO[baseForParam13];
    return baseForValue95 === "__lodash_hash_undefined__"
      ? undefined
      : baseForValue95;
  }
  return baseForValue26.call(__baseForO, baseForParam13)
    ? __baseForO[baseForParam13]
    : undefined;
}
var baseForValue27 = Object.prototype.hasOwnProperty;
function baseForHelper20(baseForParam32) {
  var __baseForO = this.__data__;
  return baseForValue24
    ? __baseForO[baseForParam32] !== undefined
    : baseForValue27.call(__baseForO, baseForParam32);
}
function baseForHelper21(baseForParam11, __baseForO) {
  var baseForValue94 = this.__data__;
  return (
    (this.size += this.has(baseForParam11) ? 0 : 1),
    (baseForValue94[baseForParam11] =
      baseForValue24 && __baseForO === undefined
        ? "__lodash_hash_undefined__"
        : __baseForO),
    this
  );
}
function baseForHelper22(baseForParam15) {
  var __baseForO = -1,
    baseForValue98 = baseForParam15 == null ? 0 : baseForParam15.length;
  for (this.clear(); ++__baseForO < baseForValue98; ) {
    var baseForValue99 = baseForParam15[__baseForO];
    this.set(baseForValue99[0], baseForValue99[1]);
  }
}
baseForHelper22.prototype.clear = baseForHelper17;
baseForHelper22.prototype.delete = baseForHelper18;
baseForHelper22.prototype.get = baseForHelper19;
baseForHelper22.prototype.has = baseForHelper20;
baseForHelper22.prototype.set = baseForHelper21;
function baseForHelper23() {
  this.size = 0;
  this.__data__ = {
    hash: new baseForHelper22(),
    map: new (baseForB || baseForHelper7)(),
    string: new baseForHelper22(),
  };
}
function baseForHelper24(baseForParam10) {
  var __baseForO = typeof baseForParam10;
  return __baseForO == "string" ||
    __baseForO == "number" ||
    __baseForO == "symbol" ||
    __baseForO == "boolean"
    ? baseForParam10 !== "__proto__"
    : baseForParam10 === null;
}
function baseForHelper25(baseForParam20, __baseForO) {
  var baseForValue107 = baseForParam20.__data__;
  return baseForHelper24(__baseForO)
    ? baseForValue107[typeof __baseForO == "string" ? "string" : "hash"]
    : baseForValue107.map;
}
function baseForHelper26(baseForParam30) {
  var __baseForO = baseForHelper25(this, baseForParam30).delete(baseForParam30);
  return ((this.size -= __baseForO ? 1 : 0), __baseForO);
}
function baseForHelper27(baseForParam46) {
  return baseForHelper25(this, baseForParam46).get(baseForParam46);
}
function baseForHelper28(baseForParam47) {
  return baseForHelper25(this, baseForParam47).has(baseForParam47);
}
function baseForHelper29(baseForParam19, __baseForO) {
  var baseForValue105 = baseForHelper25(this, baseForParam19),
    baseForValue106 = baseForValue105.size;
  return (
    baseForValue105.set(baseForParam19, __baseForO),
    (this.size += baseForValue105.size == baseForValue106 ? 0 : 1),
    this
  );
}
function baseForY(baseForParam16) {
  var __baseForO = -1,
    baseForValue100 = baseForParam16 == null ? 0 : baseForParam16.length;
  for (this.clear(); ++__baseForO < baseForValue100; ) {
    var baseForValue101 = baseForParam16[__baseForO];
    this.set(baseForValue101[0], baseForValue101[1]);
  }
}
baseForY.prototype.clear = baseForHelper23;
baseForY.prototype.delete = baseForHelper26;
baseForY.prototype.get = baseForHelper27;
baseForY.prototype.has = baseForHelper28;
baseForY.prototype.set = baseForHelper29;
function baseForHelper30(baseForParam3, __baseForO) {
  var baseForValue78 = this.__data__;
  if (baseForValue78 instanceof baseForHelper7) {
    var baseForValue79 = baseForValue78.__data__;
    if (!baseForB || baseForValue79.length < 199)
      return (
        baseForValue79.push([baseForParam3, __baseForO]),
        (this.size = ++baseForValue78.size),
        this
      );
    baseForValue78 = this.__data__ = new baseForY(baseForValue79);
  }
  return (
    baseForValue78.set(baseForParam3, __baseForO),
    (this.size = baseForValue78.size),
    this
  );
}
function baseForV(baseForParam37) {
  this.size = (this.__data__ = new baseForHelper7(baseForParam37)).size;
}
baseForV.prototype.clear = baseForHelper8;
baseForV.prototype.delete = baseForHelper9;
baseForV.prototype.get = baseForHelper10;
baseForV.prototype.has = baseForHelper11;
baseForV.prototype.set = baseForHelper30;
var baseForG = Array.isArray;
export const baseForUnderscore = baseForD.Uint8Array;
function baseForHelper31(baseForParam31, __baseForO) {
  for (
    var baseForValue111 = -1, baseForValue112 = Array(baseForParam31);
    ++baseForValue111 < baseForParam31;
  )
    baseForValue112[baseForValue111] = __baseForO(baseForValue111);
  return baseForValue112;
}
function baseForH(baseForParam42) {
  return typeof baseForParam42 == "object" && !!baseForParam42;
}
function baseForHelper32(baseForParam48) {
  return (
    baseForH(baseForParam48) && baseForT(baseForParam48) == "[object Arguments]"
  );
}
var baseForValue31 = Object.prototype,
  baseForValue32 = baseForValue31.hasOwnProperty,
  baseForValue33 = baseForValue31.propertyIsEnumerable,
  baseForM = baseForHelper32(
    (function () {
      return arguments;
    })(),
  )
    ? baseForHelper32
    : function (baseForParam29) {
        return (
          baseForH(baseForParam29) &&
          baseForValue32.call(baseForParam29, "callee") &&
          !baseForValue33.call(baseForParam29, "callee")
        );
      };
function baseForHelper33() {
  return false;
}
var baseForValue34 =
    typeof exports == "object" && exports && !exports.nodeType && exports,
  baseForValue35 =
    baseForValue34 &&
    typeof module == "object" &&
    module &&
    !module.nodeType &&
    module,
  baseForValue36 =
    baseForValue35 && baseForValue35.exports === baseForValue34
      ? baseForD.Buffer
      : undefined,
  baseForP =
    (baseForValue36 ? baseForValue36.isBuffer : undefined) || baseForHelper33,
  baseForValue38 = /^(?:0|[1-9]\d*)$/;
function baseForF(baseForParam5, __baseForO) {
  var baseForValue84 = typeof baseForParam5;
  return (
    (__baseForO ??= 9007199254740991),
    !!__baseForO &&
      (baseForValue84 == "number" ||
        (baseForValue84 != "symbol" && baseForValue38.test(baseForParam5))) &&
      baseForParam5 > -1 &&
      baseForParam5 % 1 == 0 &&
      baseForParam5 < __baseForO
  );
}
function _baseForD(baseForParam33) {
  return (
    typeof baseForParam33 == "number" &&
    baseForParam33 > -1 &&
    baseForParam33 % 1 == 0 &&
    baseForParam33 <= 9007199254740991
  );
}
var baseForValue61 = {};
baseForValue61["[object Float32Array]"] =
  baseForValue61["[object Float64Array]"] =
  baseForValue61["[object Int8Array]"] =
  baseForValue61["[object Int16Array]"] =
  baseForValue61["[object Int32Array]"] =
  baseForValue61["[object Uint8Array]"] =
  baseForValue61["[object Uint8ClampedArray]"] =
  baseForValue61["[object Uint16Array]"] =
  baseForValue61["[object Uint32Array]"] =
    true;
baseForValue61["[object Arguments]"] =
  baseForValue61["[object Array]"] =
  baseForValue61["[object ArrayBuffer]"] =
  baseForValue61["[object Boolean]"] =
  baseForValue61["[object DataView]"] =
  baseForValue61["[object Date]"] =
  baseForValue61["[object Error]"] =
  baseForValue61["[object Function]"] =
  baseForValue61["[object Map]"] =
  baseForValue61["[object Number]"] =
  baseForValue61["[object Object]"] =
  baseForValue61["[object RegExp]"] =
  baseForValue61["[object Set]"] =
  baseForValue61["[object String]"] =
  baseForValue61["[object WeakMap]"] =
    false;
function baseForHelper34(baseForParam41) {
  return (
    baseForH(baseForParam41) &&
    _baseForD(baseForParam41.length) &&
    !!baseForValue61[baseForT(baseForParam41)]
  );
}
function baseForU(baseForParam38) {
  return function (__baseForO) {
    return baseForParam38(__baseForO);
  };
}
var baseForValue62 =
    typeof exports == "object" && exports && !exports.nodeType && exports,
  baseForValue63 =
    baseForValue62 &&
    typeof module == "object" &&
    module &&
    !module.nodeType &&
    module,
  baseForValue64 =
    baseForValue63 &&
    baseForValue63.exports === baseForValue62 &&
    baseForValue2.process,
  baseForL = (function () {
    try {
      return (
        (baseForValue63 &&
          baseForValue63.require &&
          baseForValue63.require("util").types) ||
        (baseForValue64 &&
          baseForValue64.binding &&
          baseForValue64.binding("util"))
      );
    } catch {}
  })(),
  baseForValue65 = baseForL && baseForL.isTypedArray,
  _baseForC = baseForValue65 ? baseForU(baseForValue65) : baseForHelper34,
  baseForValue66 = Object.prototype.hasOwnProperty;
export function _baseForS(baseForParam1, __baseForO) {
  var baseForValue69 = baseForG(baseForParam1),
    baseForValue70 = !baseForValue69 && baseForM(baseForParam1),
    baseForValue71 =
      !baseForValue69 && !baseForValue70 && baseForP(baseForParam1),
    baseForValue72 =
      !baseForValue69 &&
      !baseForValue70 &&
      !baseForValue71 &&
      _baseForC(baseForParam1),
    baseForValue73 =
      baseForValue69 || baseForValue70 || baseForValue71 || baseForValue72,
    baseForValue74 = baseForValue73
      ? baseForHelper31(baseForParam1.length, String)
      : [],
    baseForValue75 = baseForValue74.length;
  for (var baseForValue76 in baseForParam1)
    (__baseForO || baseForValue66.call(baseForParam1, baseForValue76)) &&
      !(
        baseForValue73 &&
        (baseForValue76 == "length" ||
          (baseForValue71 &&
            (baseForValue76 == "offset" || baseForValue76 == "parent")) ||
          (baseForValue72 &&
            (baseForValue76 == "buffer" ||
              baseForValue76 == "byteLength" ||
              baseForValue76 == "byteOffset")) ||
          baseForF(baseForValue76, baseForValue75))
      ) &&
      baseForValue74.push(baseForValue76);
  return baseForValue74;
}
var baseForValue67 = Object.prototype;
export function _baseForO(baseForParam21) {
  var __baseForO = baseForParam21 && baseForParam21.constructor;
  return (
    baseForParam21 ===
    ((typeof __baseForO == "function" && __baseForO.prototype) ||
      baseForValue67)
  );
}
export function baseForA(baseForParam35, __baseForO) {
  return function (baseForParam52) {
    return baseForParam35(__baseForO(baseForParam52));
  };
}
export function baseForI(baseForParam40) {
  return (
    baseForParam40 != null &&
    _baseForD(baseForParam40.length) &&
    !baseForC(baseForParam40)
  );
}
function baseForR(baseForParam2, __baseForO) {
  if (
    typeof baseForParam2 != "function" ||
    (__baseForO != null && typeof __baseForO != "function")
  )
    throw TypeError("Expected a function");
  var baseForValue77 = function () {
    var baseForValue80 = arguments,
      baseForValue81 = __baseForO
        ? __baseForO.apply(this, baseForValue80)
        : baseForValue80[0],
      baseForValue82 = baseForValue77.cache;
    if (baseForValue82.has(baseForValue81))
      return baseForValue82.get(baseForValue81);
    var baseForValue83 = baseForParam2.apply(this, baseForValue80);
    return (
      (baseForValue77.cache =
        baseForValue82.set(baseForValue81, baseForValue83) || baseForValue82),
      baseForValue83
    );
  };
  return (
    (baseForValue77.cache = new (baseForR.Cache || baseForY)()),
    baseForValue77
  );
}
baseForR.Cache = baseForY;
export function baseForN(baseForParam53) {
  return baseForParam53;
}
function baseForHelper35(baseForParam4) {
  return function (__baseForO, baseForParam7, baseForParam8) {
    for (
      var baseForValue88 = -1,
        baseForValue89 = Object(__baseForO),
        baseForValue90 = baseForParam8(__baseForO),
        baseForValue91 = baseForValue90.length;
      baseForValue91--;
    ) {
      var baseForValue92 =
        baseForValue90[baseForParam4 ? baseForValue91 : ++baseForValue88];
      if (
        baseForParam7(
          baseForValue89[baseForValue92],
          baseForValue92,
          baseForValue89,
        ) === false
      )
        break;
    }
    return __baseForO;
  };
}
export const _baseForT = baseForHelper35();
export {
  baseForC,
  baseForD,
  baseForE,
  baseForO,
  baseForS,
  baseForT,
  baseForB,
  _baseForC,
  _baseForD,
  baseForF,
  baseForG,
  baseForH,
  baseForL,
  baseForM,
  baseForP,
  baseForR,
  baseForU,
  baseForV,
  baseForW,
  baseForX,
  baseForY,
};
