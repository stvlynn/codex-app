// Restored from ref/webview/assets/ordinal-jw163_Ud.js
// Ordinal chunk restored from the Codex webview bundle.
import { init } from "./d3-scale-init";
var ordinalValue1 = class extends Map {
  constructor(ordinalParam1, ordinalParam2 = ordinalHelper4) {
    if (
      (super(),
      Object.defineProperties(this, {
        _intern: {
          value: new Map(),
        },
        _key: {
          value: ordinalParam2,
        },
      }),
      ordinalParam1 != null)
    )
      for (let [ordinalValue12, ordinalValue13] of ordinalParam1)
        this.set(ordinalValue12, ordinalValue13);
  }
  get(ordinalParam14) {
    return super.get(ordinalHelper1(this, ordinalParam14));
  }
  has(ordinalParam15) {
    return super.has(ordinalHelper1(this, ordinalParam15));
  }
  set(ordinalParam11, ordinalParam12) {
    return super.set(ordinalHelper2(this, ordinalParam11), ordinalParam12);
  }
  delete(ordinalParam13) {
    return super.delete(ordinalHelper3(this, ordinalParam13));
  }
};
function ordinalHelper1({ _intern, _key }, ordinalParam7) {
  let ordinalValue10 = _key(ordinalParam7);
  return _intern.has(ordinalValue10)
    ? _intern.get(ordinalValue10)
    : ordinalParam7;
}
function ordinalHelper2({ _intern, _key }, ordinalParam6) {
  let ordinalValue9 = _key(ordinalParam6);
  return _intern.has(ordinalValue9)
    ? _intern.get(ordinalValue9)
    : (_intern.set(ordinalValue9, ordinalParam6), ordinalParam6);
}
function ordinalHelper3({ _intern, _key }, ordinalParam5) {
  let ordinalValue8 = _key(ordinalParam5);
  return (
    _intern.has(ordinalValue8) &&
      ((ordinalParam5 = _intern.get(ordinalValue8)),
      _intern.delete(ordinalValue8)),
    ordinalParam5
  );
}
function ordinalHelper4(ordinalParam9) {
  return typeof ordinalParam9 == "object" && ordinalParam9
    ? ordinalParam9.valueOf()
    : ordinalParam9;
}
var ordinalValue2 = Symbol("implicit");
function Ordinal() {
  var ordinalValue3 = new ordinalValue1(),
    ordinalValue4 = [],
    ordinalValue5 = [],
    ordinalValue6 = ordinalValue2;
  function ordinalHelper5(ordinalParam4) {
    let ordinalValue7 = ordinalValue3.get(ordinalParam4);
    if (ordinalValue7 === undefined) {
      if (ordinalValue6 !== ordinalValue2) return ordinalValue6;
      ordinalValue3.set(
        ordinalParam4,
        (ordinalValue7 = ordinalValue4.push(ordinalParam4) - 1),
      );
    }
    return ordinalValue5[ordinalValue7 % ordinalValue5.length];
  }
  return (
    (ordinalHelper5.domain = function (ordinalParam3) {
      if (!arguments.length) return ordinalValue4.slice();
      ordinalValue4 = [];
      ordinalValue3 = new ordinalValue1();
      for (let ordinalValue11 of ordinalParam3)
        ordinalValue3.has(ordinalValue11) ||
          ordinalValue3.set(
            ordinalValue11,
            ordinalValue4.push(ordinalValue11) - 1,
          );
      return ordinalHelper5;
    }),
    (ordinalHelper5.range = function (ordinalParam8) {
      return arguments.length
        ? ((ordinalValue5 = Array.from(ordinalParam8)), ordinalHelper5)
        : ordinalValue5.slice();
    }),
    (ordinalHelper5.unknown = function (ordinalParam10) {
      return arguments.length
        ? ((ordinalValue6 = ordinalParam10), ordinalHelper5)
        : ordinalValue6;
    }),
    (ordinalHelper5.copy = function () {
      return Ordinal(ordinalValue4, ordinalValue5).unknown(ordinalValue6);
    }),
    init.apply(ordinalHelper5, arguments),
    ordinalHelper5
  );
}
export { Ordinal };
