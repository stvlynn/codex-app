// Restored from ref/webview/assets/esm-DbqKqkZh.js
// Esm chunk restored from the Codex webview bundle.
var esmValue1 = Object.freeze({
    left: 0,
    top: 0,
    width: 16,
    height: 16,
  }),
  esmValue2 = Object.freeze({
    rotate: 0,
    vFlip: false,
    hFlip: false,
  }),
  esmValue3 = Object.freeze({
    ...esmValue1,
    ...esmValue2,
  }),
  esmValue4 = Object.freeze({
    ...esmValue3,
    body: "",
    hidden: false,
  }),
  esmValue5 = Object.freeze({
    width: null,
    height: null,
  }),
  esmValue6 = Object.freeze({
    ...esmValue5,
    ...esmValue2,
  }),
  esmValue7 = (esmParam32, esmParam33) =>
    esmParam32
      ? !!(
          ((esmParam33 && esmParam32.prefix === "") || esmParam32.prefix) &&
          esmParam32.name
        )
      : false;
export const esmO = (esmParam4, esmParam5, esmParam6, esmParam7 = "") => {
  let esmValue35 = esmParam4.split(":");
  if (esmParam4.slice(0, 1) === "@") {
    if (esmValue35.length < 2 || esmValue35.length > 3) return null;
    esmParam7 = esmValue35.shift().slice(1);
  }
  if (esmValue35.length > 3 || !esmValue35.length) return null;
  if (esmValue35.length > 1) {
    let esmValue62 = esmValue35.pop(),
      esmValue63 = esmValue35.pop(),
      esmValue64 = {
        provider: esmValue35.length > 0 ? esmValue35[0] : esmParam7,
        prefix: esmValue63,
        name: esmValue62,
      };
    return esmParam5 && !esmValue7(esmValue64) ? null : esmValue64;
  }
  let esmValue36 = esmValue35[0],
    _esmO = esmValue36.split("-");
  if (_esmO.length > 1) {
    let esmValue69 = {
      provider: esmParam7,
      prefix: _esmO.shift(),
      name: _esmO.join("-"),
    };
    return esmParam5 && !esmValue7(esmValue69) ? null : esmValue69;
  }
  if (esmParam6 && esmParam7 === "") {
    let esmValue71 = {
      provider: esmParam7,
      prefix: "",
      name: esmValue36,
    };
    return esmParam5 && !esmValue7(esmValue71, esmParam6) ? null : esmValue71;
  }
  return null;
};
function esmHelper1(esmParam20, esmParam21) {
  let esmValue56 = {};
  !esmParam20.hFlip != !esmParam21.hFlip && (esmValue56.hFlip = true);
  !esmParam20.vFlip != !esmParam21.vFlip && (esmValue56.vFlip = true);
  let esmValue57 = ((esmParam20.rotate || 0) + (esmParam21.rotate || 0)) % 4;
  return (esmValue57 && (esmValue56.rotate = esmValue57), esmValue56);
}
function esmHelper2(esmParam22, esmParam23) {
  let esmValue58 = esmHelper1(esmParam22, esmParam23);
  for (let esmValue65 in esmValue4)
    esmValue65 in esmValue2
      ? esmValue65 in esmParam22 &&
        !(esmValue65 in esmValue58) &&
        (esmValue58[esmValue65] = esmValue2[esmValue65])
      : esmValue65 in esmParam23
        ? (esmValue58[esmValue65] = esmParam23[esmValue65])
        : esmValue65 in esmParam22 &&
          (esmValue58[esmValue65] = esmParam22[esmValue65]);
  return esmValue58;
}
function esmHelper3(esmParam13, esmParam14) {
  let esmValue43 = esmParam13.icons,
    esmValue44 = esmParam13.aliases || Object.create(null),
    esmValue45 = Object.create(null);
  function esmHelper9(esmParam19) {
    if (esmValue43[esmParam19]) return (esmValue45[esmParam19] = []);
    if (!(esmParam19 in esmValue45)) {
      esmValue45[esmParam19] = null;
      let esmValue66 = esmValue44[esmParam19] && esmValue44[esmParam19].parent,
        esmValue67 = esmValue66 && esmHelper9(esmValue66);
      esmValue67 && (esmValue45[esmParam19] = [esmValue66].concat(esmValue67));
    }
    return esmValue45[esmParam19];
  }
  return (
    (
      esmParam14 || Object.keys(esmValue43).concat(Object.keys(esmValue44))
    ).forEach(esmHelper9),
    esmValue45
  );
}
function esmHelper4(esmParam24, esmParam25, esmParam26) {
  let esmValue59 = esmParam24.icons,
    esmValue60 = esmParam24.aliases || Object.create(null),
    esmValue61 = {};
  function _esmO(esmParam39) {
    esmValue61 = esmHelper2(
      esmValue59[esmParam39] || esmValue60[esmParam39],
      esmValue61,
    );
  }
  return (
    _esmO(esmParam25),
    esmParam26.forEach(_esmO),
    esmHelper2(esmParam24, esmValue61)
  );
}
export function esmA(esmParam27, esmParam28) {
  if (esmParam27.icons[esmParam28])
    return esmHelper4(esmParam27, esmParam28, []);
  let esmValue68 = esmHelper3(esmParam27, [esmParam28])[esmParam28];
  return esmValue68 ? esmHelper4(esmParam27, esmParam28, esmValue68) : null;
}
var esmValue8 = /(-?[0-9.]*[0-9]+[0-9.]*)/g,
  esmValue9 = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function esmHelper5(esmParam10, esmParam11, esmParam12) {
  if (esmParam11 === 1) return esmParam10;
  if (((esmParam12 ||= 100), typeof esmParam10 == "number"))
    return Math.ceil(esmParam10 * esmParam11 * esmParam12) / esmParam12;
  if (typeof esmParam10 != "string") return esmParam10;
  let esmValue40 = esmParam10.split(esmValue8);
  if (esmValue40 === null || !esmValue40.length) return esmParam10;
  let esmValue41 = [],
    esmValue42 = esmValue40.shift(),
    _esmO = esmValue9.test(esmValue42);
  for (;;) {
    if (_esmO) {
      let esmValue70 = parseFloat(esmValue42);
      isNaN(esmValue70)
        ? esmValue41.push(esmValue42)
        : esmValue41.push(
            Math.ceil(esmValue70 * esmParam11 * esmParam12) / esmParam12,
          );
    } else esmValue41.push(esmValue42);
    if (((esmValue42 = esmValue40.shift()), esmValue42 === undefined))
      return esmValue41.join("");
    _esmO = !_esmO;
  }
}
function esmHelper6(esmParam15, esmParam16 = "defs") {
  let esmValue46 = "",
    esmValue47 = esmParam15.indexOf("<" + esmParam16);
  for (; esmValue47 >= 0; ) {
    let esmValue53 = esmParam15.indexOf(">", esmValue47),
      esmValue54 = esmParam15.indexOf("</" + esmParam16);
    if (esmValue53 === -1 || esmValue54 === -1) break;
    let _esmO = esmParam15.indexOf(">", esmValue54);
    if (_esmO === -1) break;
    esmValue46 += esmParam15.slice(esmValue53 + 1, esmValue54).trim();
    esmParam15 =
      esmParam15.slice(0, esmValue47).trim() + esmParam15.slice(_esmO + 1);
  }
  return {
    defs: esmValue46,
    content: esmParam15,
  };
}
function esmHelper7(esmParam34, esmParam35) {
  return esmParam34
    ? "<defs>" + esmParam34 + "</defs>" + esmParam35
    : esmParam35;
}
function esmHelper8(esmParam29, esmParam30, esmParam31) {
  let esmValue72 = esmHelper6(esmParam29);
  return esmHelper7(
    esmValue72.defs,
    esmParam30 + esmValue72.content + esmParam31,
  );
}
var esmValue10 = (esmParam36) =>
  esmParam36 === "unset" || esmParam36 === "undefined" || esmParam36 === "none";
export function esmI(esmParam1, esmParam2) {
  let esmValue14 = {
      ...esmValue3,
      ...esmParam1,
    },
    esmValue15 = {
      ...esmValue6,
      ...esmParam2,
    },
    _esmO = {
      left: esmValue14.left,
      top: esmValue14.top,
      width: esmValue14.width,
      height: esmValue14.height,
    },
    esmValue16 = esmValue14.body;
  [esmValue14, esmValue15].forEach((item) => {
    let esmValue25 = [],
      esmValue26 = item.hFlip,
      esmValue27 = item.vFlip,
      esmValue28 = item.rotate;
    esmValue26
      ? esmValue27
        ? (esmValue28 += 2)
        : (esmValue25.push(
            "translate(" +
              (_esmO.width + _esmO.left).toString() +
              " " +
              (0 - _esmO.top).toString() +
              ")",
          ),
          esmValue25.push("scale(-1 1)"),
          (_esmO.top = _esmO.left = 0))
      : esmValue27 &&
        (esmValue25.push(
          "translate(" +
            (0 - _esmO.left).toString() +
            " " +
            (_esmO.height + _esmO.top).toString() +
            ")",
        ),
        esmValue25.push("scale(1 -1)"),
        (_esmO.top = _esmO.left = 0));
    let esmValue29;
    switch (
      (esmValue28 < 0 && (esmValue28 -= Math.floor(esmValue28 / 4) * 4),
      (esmValue28 %= 4),
      esmValue28)
    ) {
      case 1:
        esmValue29 = _esmO.height / 2 + _esmO.top;
        esmValue25.unshift(
          "rotate(90 " +
            esmValue29.toString() +
            " " +
            esmValue29.toString() +
            ")",
        );
        break;
      case 2:
        esmValue25.unshift(
          "rotate(180 " +
            (_esmO.width / 2 + _esmO.left).toString() +
            " " +
            (_esmO.height / 2 + _esmO.top).toString() +
            ")",
        );
        break;
      case 3:
        esmValue29 = _esmO.width / 2 + _esmO.left;
        esmValue25.unshift(
          "rotate(-90 " +
            esmValue29.toString() +
            " " +
            esmValue29.toString() +
            ")",
        );
        break;
    }
    esmValue28 % 2 == 1 &&
      (_esmO.left !== _esmO.top &&
        ((esmValue29 = _esmO.left),
        (_esmO.left = _esmO.top),
        (_esmO.top = esmValue29)),
      _esmO.width !== _esmO.height &&
        ((esmValue29 = _esmO.width),
        (_esmO.width = _esmO.height),
        (_esmO.height = esmValue29)));
    esmValue25.length &&
      (esmValue16 = esmHelper8(
        esmValue16,
        '<g transform="' + esmValue25.join(" ") + '">',
        "</g>",
      ));
  });
  let esmValue17 = esmValue15.width,
    esmValue18 = esmValue15.height,
    esmValue19 = _esmO.width,
    esmValue20 = _esmO.height,
    _esmA,
    esmValue21;
  esmValue17 === null
    ? ((esmValue21 =
        esmValue18 === null
          ? "1em"
          : esmValue18 === "auto"
            ? esmValue20
            : esmValue18),
      (_esmA = esmHelper5(esmValue21, esmValue19 / esmValue20)))
    : ((_esmA = esmValue17 === "auto" ? esmValue19 : esmValue17),
      (esmValue21 =
        esmValue18 === null
          ? esmHelper5(_esmA, esmValue20 / esmValue19)
          : esmValue18 === "auto"
            ? esmValue20
            : esmValue18));
  let esmValue22 = {},
    esmValue23 = (esmParam37, esmParam38) => {
      esmValue10(esmParam38) ||
        (esmValue22[esmParam37] = esmParam38.toString());
    };
  esmValue23("width", _esmA);
  esmValue23("height", esmValue21);
  let esmValue24 = [_esmO.left, _esmO.top, esmValue19, esmValue20];
  return (
    (esmValue22.viewBox = esmValue24.join(" ")),
    {
      attributes: esmValue22,
      viewBox: esmValue24,
      body: esmValue16,
    }
  );
}
var esmValue11 = /\sid="(\S+)"/g,
  esmValue12 =
    "IconifyId" +
    Date.now().toString(16) +
    ((Math.random() * 16777216) | 0).toString(16),
  esmValue13 = 0;
export function esmR(esmParam8, esmParam9 = esmValue12) {
  let esmValue37 = [],
    esmValue38;
  for (; (esmValue38 = esmValue11.exec(esmParam8)); )
    esmValue37.push(esmValue38[1]);
  if (!esmValue37.length) return esmParam8;
  let esmValue39 =
    "suffix" + ((Math.random() * 16777216) | Date.now()).toString(16);
  return (
    esmValue37.forEach((item) => {
      let esmValue51 =
          typeof esmParam9 == "function"
            ? esmParam9(item)
            : esmParam9 + (esmValue13++).toString(),
        esmValue52 = item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      esmParam8 = esmParam8.replace(
        RegExp('([#;"])(' + esmValue52 + ')([")]|\\.[a-z])', "g"),
        "$1" + esmValue51 + esmValue39 + "$3",
      );
    }),
    (esmParam8 = esmParam8.replace(new RegExp(esmValue39, "g"), "")),
    esmParam8
  );
}
export function esmN(esmParam17, esmParam18) {
  let esmValue50 =
    esmParam17.indexOf("xlink:") === -1
      ? ""
      : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (let esmValue73 in esmParam18)
    esmValue50 += " " + esmValue73 + '="' + esmParam18[esmValue73] + '"';
  return (
    '<svg xmlns="http://www.w3.org/2000/svg"' +
    esmValue50 +
    ">" +
    esmParam17 +
    "</svg>"
  );
}
export function esmT(esmParam3) {
  var esmValue30 = [...arguments].slice(1),
    esmValue31 = Array.from(
      typeof esmParam3 == "string" ? [esmParam3] : esmParam3,
    );
  esmValue31[esmValue31.length - 1] = esmValue31[esmValue31.length - 1].replace(
    /\r?\n([\t ]*)$/,
    "",
  );
  var esmValue32 = esmValue31.reduce(function (accumulator, current) {
    var esmValue55 = current.match(/\n([\t ]+|(?!\s).)/g);
    return esmValue55
      ? accumulator.concat(
          esmValue55.map(function (item) {
            return item.match(/[\t ]/g)?.length ?? 0;
          }),
        )
      : accumulator;
  }, []);
  if (esmValue32.length) {
    var esmValue33 = RegExp(
      "\n[\t ]{" + Math.min.apply(Math, esmValue32) + "}",
      "g",
    );
    esmValue31 = esmValue31.map(function (item) {
      return item.replace(esmValue33, "\n");
    });
  }
  esmValue31[0] = esmValue31[0].replace(/^\r?\n/, "");
  var esmValue34 = esmValue31[0];
  return (
    esmValue30.forEach(function (item, index) {
      var esmValue48 = esmValue34.match(/(?:^|\n)( *)$/),
        esmValue49 = esmValue48 ? esmValue48[1] : "",
        _esmO = item;
      typeof item == "string" &&
        item.includes("\n") &&
        (_esmO = String(item)
          .split("\n")
          .map(function (_item, _index) {
            return _index === 0 ? _item : "" + esmValue49 + _item;
          })
          .join("\n"));
      esmValue34 += _esmO + esmValue31[index + 1];
    }),
    esmValue34
  );
}
