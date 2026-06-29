// Restored from ref/webview/assets/Serializer-yJ_eEkxi.js
// Serializer chunk restored from the Codex webview bundle.
var serializerValue8 = Math.abs,
  serializerValue9 = String.fromCharCode;
function serializerHelper1(serializerParam72) {
  return serializerParam72.trim();
}
function serializerHelper2(
  serializerParam58,
  serializerParam59,
  serializerParam60,
) {
  return serializerParam58.replace(serializerParam59, serializerParam60);
}
function serializerHelper3(
  serializerParam61,
  serializerParam62,
  serializerParam63,
) {
  return serializerParam61.indexOf(serializerParam62, serializerParam63);
}
function serializerHelper4(serializerParam56, serializerParam57) {
  return serializerParam56.charCodeAt(serializerParam57) | 0;
}
function serializerHelper5(
  serializerParam64,
  serializerParam65,
  serializerParam66,
) {
  return serializerParam64.slice(serializerParam65, serializerParam66);
}
function serializerHelper6(serializerParam73) {
  return serializerParam73.length;
}
function serializerHelper7(serializerParam74) {
  return serializerParam74.length;
}
function serializerHelper8(serializerParam67, serializerParam68) {
  return (serializerParam68.push(serializerParam67), serializerParam67);
}
var serializerValue10 = 1,
  serializerValue11 = 1,
  serializerValue12 = 0,
  serializerValue13 = 0,
  serializerValue14 = 0,
  serializerValue15 = "";
function serializerHelper9(
  serializerParam28,
  serializerParam29,
  serializerParam30,
  serializerParam31,
  serializerParam32,
  serializerParam33,
  serializerParam34,
  serializerParam35,
) {
  return {
    value: serializerParam28,
    root: serializerParam29,
    parent: serializerParam30,
    type: serializerParam31,
    props: serializerParam32,
    children: serializerParam33,
    line: serializerValue10,
    column: serializerValue11,
    length: serializerParam34,
    return: "",
    siblings: serializerParam35,
  };
}
function serializerHelper10() {
  return serializerValue14;
}
function serializerHelper11() {
  return (
    (serializerValue14 =
      serializerValue13 > 0
        ? serializerHelper4(serializerValue15, --serializerValue13)
        : 0),
    serializerValue11--,
    serializerValue14 === 10 && ((serializerValue11 = 1), serializerValue10--),
    serializerValue14
  );
}
function serializerHelper12() {
  return (
    (serializerValue14 =
      serializerValue13 < serializerValue12
        ? serializerHelper4(serializerValue15, serializerValue13++)
        : 0),
    serializerValue11++,
    serializerValue14 === 10 && ((serializerValue11 = 1), serializerValue10++),
    serializerValue14
  );
}
function serializerHelper13() {
  return serializerHelper4(serializerValue15, serializerValue13);
}
function serializerHelper14() {
  return serializerValue13;
}
function serializerHelper15(serializerParam69, serializerParam70) {
  return serializerHelper5(
    serializerValue15,
    serializerParam69,
    serializerParam70,
  );
}
function serializerHelper16(serializerParam14) {
  switch (serializerParam14) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function serializerHelper17(serializerParam54) {
  return (
    (serializerValue10 = serializerValue11 = 1),
    (serializerValue12 = serializerHelper6(
      (serializerValue15 = serializerParam54),
    )),
    (serializerValue13 = 0),
    []
  );
}
function serializerHelper18(serializerParam71) {
  return ((serializerValue15 = ""), serializerParam71);
}
function serializerHelper19(serializerParam48) {
  return serializerHelper1(
    serializerHelper15(
      serializerValue13 - 1,
      serializerHelper22(
        serializerParam48 === 91
          ? serializerParam48 + 2
          : serializerParam48 === 40
            ? serializerParam48 + 1
            : serializerParam48,
      ),
    ),
  );
}
function serializerHelper20(serializerParam42) {
  for (; (serializerValue14 = serializerHelper13()) && serializerValue14 < 33; )
    serializerHelper12();
  return serializerHelper16(serializerParam42) > 2 ||
    serializerHelper16(serializerValue14) > 3
    ? ""
    : " ";
}
function serializerHelper21(serializerParam36, serializerParam37) {
  for (
    ;
    --serializerParam37 &&
    serializerHelper12() &&
    !(
      serializerValue14 < 48 ||
      serializerValue14 > 102 ||
      (serializerValue14 > 57 && serializerValue14 < 65) ||
      (serializerValue14 > 70 && serializerValue14 < 97)
    );
  );
  return serializerHelper15(
    serializerParam36,
    serializerHelper14() +
      (serializerParam37 < 6 &&
        serializerHelper13() == 32 &&
        serializerHelper12() == 32),
  );
}
function serializerHelper22(serializerParam27) {
  for (; serializerHelper12(); )
    switch (serializerValue14) {
      case serializerParam27:
        return serializerValue13;
      case 34:
      case 39:
        serializerParam27 !== 34 &&
          serializerParam27 !== 39 &&
          serializerHelper22(serializerValue14);
        break;
      case 40:
        serializerParam27 === 41 && serializerHelper22(serializerParam27);
        break;
      case 92:
        serializerHelper12();
        break;
    }
  return serializerValue13;
}
function serializerHelper23(serializerParam38, serializerParam39) {
  for (
    ;
    serializerHelper12() &&
    serializerParam38 + serializerValue14 !== 57 &&
    !(
      serializerParam38 + serializerValue14 === 84 &&
      serializerHelper13() === 47
    );
  );
  return (
    "/*" +
    serializerHelper15(serializerParam39, serializerValue13 - 1) +
    "*" +
    serializerValue9(
      serializerParam38 === 47 ? serializerParam38 : serializerHelper12(),
    )
  );
}
function serializerHelper24(serializerParam55) {
  for (; !serializerHelper16(serializerHelper13()); ) serializerHelper12();
  return serializerHelper15(serializerParam55, serializerValue13);
}
export function serializerR(serializerParam49) {
  return serializerHelper18(
    serializerHelper25(
      "",
      null,
      null,
      null,
      [""],
      (serializerParam49 = serializerHelper17(serializerParam49)),
      0,
      [0],
      serializerParam49,
    ),
  );
}
function serializerHelper25(
  serializerParam1,
  serializerParam2,
  serializerParam3,
  serializerParam4,
  serializerParam5,
  serializerParam6,
  serializerParam7,
  serializerParam8,
  serializerParam9,
) {
  for (
    var serializerValue16 = 0,
      serializerValue17 = 0,
      serializerValue18 = serializerParam7,
      serializerValue19 = 0,
      serializerValue20 = 0,
      serializerValue21 = 0,
      serializerValue22 = 1,
      serializerValue23 = 1,
      serializerValue24 = 1,
      serializerValue25 = 0,
      serializerValue26 = "",
      serializerValue27 = serializerParam5,
      _serializerR = serializerParam6,
      _serializerT = serializerParam4,
      _serializerN = serializerValue26;
    serializerValue23;
  )
    switch (
      ((serializerValue21 = serializerValue25),
      (serializerValue25 = serializerHelper12()))
    ) {
      case 40:
        if (
          serializerValue21 != 108 &&
          serializerHelper4(_serializerN, serializerValue18 - 1) == 58
        ) {
          serializerHelper3(
            (_serializerN += serializerHelper2(
              serializerHelper19(serializerValue25),
              "&",
              "&\f",
            )),
            "&\f",
            serializerValue8(
              serializerValue16 ? serializerParam8[serializerValue16 - 1] : 0,
            ),
          ) != -1 && (serializerValue24 = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        _serializerN += serializerHelper19(serializerValue25);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        _serializerN += serializerHelper20(serializerValue21);
        break;
      case 92:
        _serializerN += serializerHelper21(serializerHelper14() - 1, 7);
        continue;
      case 47:
        switch (serializerHelper13()) {
          case 42:
          case 47:
            serializerHelper8(
              serializerHelper27(
                serializerHelper23(serializerHelper12(), serializerHelper14()),
                serializerParam2,
                serializerParam3,
                serializerParam9,
              ),
              serializerParam9,
            );
            (serializerHelper16(serializerValue21 || 1) == 5 ||
              serializerHelper16(serializerHelper13() || 1) == 5) &&
              serializerHelper6(_serializerN) &&
              serializerHelper5(_serializerN, -1, undefined) !== " " &&
              (_serializerN += " ");
            break;
          default:
            _serializerN += "/";
        }
        break;
      case 123 * serializerValue22:
        serializerParam8[serializerValue16++] =
          serializerHelper6(_serializerN) * serializerValue24;
      case 125 * serializerValue22:
      case 59:
      case 0:
        switch (serializerValue25) {
          case 0:
          case 125:
            serializerValue23 = 0;
          case 59 + serializerValue17:
            serializerValue24 == -1 &&
              (_serializerN = serializerHelper2(_serializerN, /\f/g, ""));
            serializerValue20 > 0 &&
              (serializerHelper6(_serializerN) - serializerValue18 ||
                (serializerValue22 === 0 && serializerValue21 === 47)) &&
              serializerHelper8(
                serializerValue20 > 32
                  ? serializerHelper28(
                      _serializerN + ";",
                      serializerParam4,
                      serializerParam3,
                      serializerValue18 - 1,
                      serializerParam9,
                    )
                  : serializerHelper28(
                      serializerHelper2(_serializerN, " ", "") + ";",
                      serializerParam4,
                      serializerParam3,
                      serializerValue18 - 2,
                      serializerParam9,
                    ),
                serializerParam9,
              );
            break;
          case 59:
            _serializerN += ";";
          default:
            if (
              (serializerHelper8(
                (_serializerT = serializerHelper26(
                  _serializerN,
                  serializerParam2,
                  serializerParam3,
                  serializerValue16,
                  serializerValue17,
                  serializerParam5,
                  serializerParam8,
                  serializerValue26,
                  (serializerValue27 = []),
                  (_serializerR = []),
                  serializerValue18,
                  serializerParam6,
                )),
                serializerParam6,
              ),
              serializerValue25 === 123)
            )
              if (serializerValue17 === 0)
                serializerHelper25(
                  _serializerN,
                  serializerParam2,
                  _serializerT,
                  _serializerT,
                  serializerValue27,
                  serializerParam6,
                  serializerValue18,
                  serializerParam8,
                  _serializerR,
                );
              else {
                switch (serializerValue19) {
                  case 99:
                    if (serializerHelper4(_serializerN, 3) === 110) break;
                  case 108:
                    if (serializerHelper4(_serializerN, 2) === 97) break;
                  default:
                    serializerValue17 = 0;
                  case 100:
                  case 109:
                  case 115:
                }
                serializerValue17
                  ? serializerHelper25(
                      serializerParam1,
                      _serializerT,
                      _serializerT,
                      serializerParam4 &&
                        serializerHelper8(
                          serializerHelper26(
                            serializerParam1,
                            _serializerT,
                            _serializerT,
                            0,
                            0,
                            serializerParam5,
                            serializerParam8,
                            serializerValue26,
                            serializerParam5,
                            (serializerValue27 = []),
                            serializerValue18,
                            _serializerR,
                          ),
                          _serializerR,
                        ),
                      serializerParam5,
                      _serializerR,
                      serializerValue18,
                      serializerParam8,
                      serializerParam4 ? serializerValue27 : _serializerR,
                    )
                  : serializerHelper25(
                      _serializerN,
                      _serializerT,
                      _serializerT,
                      _serializerT,
                      [""],
                      _serializerR,
                      0,
                      serializerParam8,
                      _serializerR,
                    );
              }
        }
        serializerValue16 = serializerValue17 = serializerValue20 = 0;
        serializerValue22 = serializerValue24 = 1;
        serializerValue26 = _serializerN = "";
        serializerValue18 = serializerParam7;
        break;
      case 58:
        serializerValue18 = 1 + serializerHelper6(_serializerN);
        serializerValue20 = serializerValue21;
      default:
        if (serializerValue22 < 1) {
          if (serializerValue25 == 123) --serializerValue22;
          else if (
            serializerValue25 == 125 &&
            serializerValue22++ == 0 &&
            serializerHelper11() == 125
          )
            continue;
        }
        switch (
          ((_serializerN += serializerValue9(serializerValue25)),
          serializerValue25 * serializerValue22)
        ) {
          case 38:
            serializerValue24 =
              serializerValue17 > 0 ? 1 : ((_serializerN += "\f"), -1);
            break;
          case 44:
            serializerParam8[serializerValue16++] =
              (serializerHelper6(_serializerN) - 1) * serializerValue24;
            serializerValue24 = 1;
            break;
          case 64:
            serializerHelper13() === 45 &&
              (_serializerN += serializerHelper19(serializerHelper12()));
            serializerValue19 = serializerHelper13();
            serializerValue17 = serializerValue18 = serializerHelper6(
              (serializerValue26 = _serializerN +=
                serializerHelper24(serializerHelper14())),
            );
            serializerValue25++;
            break;
          case 45:
            serializerValue21 === 45 &&
              serializerHelper6(_serializerN) == 2 &&
              (serializerValue22 = 0);
        }
    }
  return serializerParam6;
}
function serializerHelper26(
  serializerParam15,
  serializerParam16,
  serializerParam17,
  serializerParam18,
  serializerParam19,
  serializerParam20,
  serializerParam21,
  serializerParam22,
  serializerParam23,
  serializerParam24,
  serializerParam25,
  serializerParam26,
) {
  for (
    var serializerValue28 = serializerParam19 - 1,
      serializerValue29 = serializerParam19 === 0 ? serializerParam20 : [""],
      serializerValue30 = serializerHelper7(serializerValue29),
      serializerValue31 = 0,
      serializerValue32 = 0,
      serializerValue33 = 0;
    serializerValue31 < serializerParam18;
    ++serializerValue31
  )
    for (
      var serializerValue34 = 0,
        serializerValue35 = serializerHelper5(
          serializerParam15,
          serializerValue28 + 1,
          (serializerValue28 = serializerValue8(
            (serializerValue32 = serializerParam21[serializerValue31]),
          )),
        ),
        serializerValue36 = serializerParam15;
      serializerValue34 < serializerValue30;
      ++serializerValue34
    )
      (serializerValue36 = serializerHelper1(
        serializerValue32 > 0
          ? serializerValue29[serializerValue34] + " " + serializerValue35
          : serializerHelper2(
              serializerValue35,
              /&\f/g,
              serializerValue29[serializerValue34],
            ),
      )) && (serializerParam23[serializerValue33++] = serializerValue36);
  return serializerHelper9(
    serializerParam15,
    serializerParam16,
    serializerParam17,
    serializerParam19 === 0 ? "rule" : serializerParam22,
    serializerParam23,
    serializerParam24,
    serializerParam25,
    serializerParam26,
  );
}
function serializerHelper27(
  serializerParam50,
  serializerParam51,
  serializerParam52,
  serializerParam53,
) {
  return serializerHelper9(
    serializerParam50,
    serializerParam51,
    serializerParam52,
    "comm",
    serializerValue9(serializerHelper10()),
    serializerHelper5(serializerParam50, 2, -2),
    0,
    serializerParam53,
  );
}
function serializerHelper28(
  serializerParam43,
  serializerParam44,
  serializerParam45,
  serializerParam46,
  serializerParam47,
) {
  return serializerHelper9(
    serializerParam43,
    serializerParam44,
    serializerParam45,
    "decl",
    serializerHelper5(serializerParam43, 0, serializerParam46),
    serializerHelper5(serializerParam43, serializerParam46 + 1, -1),
    serializerParam46,
    serializerParam47,
  );
}
function serializerT(serializerParam40, serializerParam41) {
  for (
    var serializerValue37 = "", serializerValue38 = 0;
    serializerValue38 < serializerParam40.length;
    serializerValue38++
  )
    serializerValue37 +=
      serializerParam41(
        serializerParam40[serializerValue38],
        serializerValue38,
        serializerParam40,
        serializerParam41,
      ) || "";
  return serializerValue37;
}
export function serializerN(
  serializerParam10,
  serializerParam11,
  serializerParam12,
  serializerParam13,
) {
  switch (serializerParam10.type) {
    case "@layer":
      if (serializerParam10.children.length) break;
    case "@import":
    case "@namespace":
    case "decl":
      return (serializerParam10.return =
        serializerParam10.return || serializerParam10.value);
    case "comm":
      return "";
    case "@keyframes":
      return (serializerParam10.return =
        serializerParam10.value +
        "{" +
        serializerT(serializerParam10.children, serializerParam13) +
        "}");
    case "rule":
      if (
        !serializerHelper6(
          (serializerParam10.value = serializerParam10.props.join(",")),
        )
      )
        return "";
  }
  return serializerHelper6(
    (serializerParam12 = serializerT(
      serializerParam10.children,
      serializerParam13,
    )),
  )
    ? (serializerParam10.return =
        serializerParam10.value + "{" + serializerParam12 + "}")
    : "";
}
export { serializerT };

// Additional aliases exported for consumers mapped via IMPORT_MAP
export const n: any = undefined;
export const r: any = undefined;
export const t: any = undefined;
