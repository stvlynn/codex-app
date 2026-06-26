// Restored from ref/webview/assets/linear-C3CxBvdt.js
// Linear chunk restored from the Codex webview bundle.
import {
  defaultLocaleA,
  defaultLocaleI,
  defaultLocaleN,
  defaultLocaleT,
} from "./d3-format-default-locale";
import { stringL, stringN, stringO, stringR, stringT } from "./d3-color-string";
import { init } from "./d3-scale-init";
function linearHelper1(linearParam86) {
  return Math.max(0, -defaultLocaleA(Math.abs(linearParam86)));
}
function linearHelper2(linearParam57, linearParam58) {
  return Math.max(
    0,
    Math.max(-8, Math.min(8, Math.floor(defaultLocaleA(linearParam58) / 3))) *
      3 -
      defaultLocaleA(Math.abs(linearParam57)),
  );
}
function linearHelper3(linearParam59, linearParam60) {
  return (
    (linearParam59 = Math.abs(linearParam59)),
    (linearParam60 = Math.abs(linearParam60) - linearParam59),
    Math.max(0, defaultLocaleA(linearParam60) - defaultLocaleA(linearParam59)) +
      1
  );
}
function linearHelper4(linearParam34, linearParam35) {
  linearParam35 ||= [];
  var linearValue63 = linearParam34
      ? Math.min(linearParam35.length, linearParam34.length)
      : 0,
    linearValue64 = linearParam35.slice(),
    linearValue65;
  return function (linearParam63) {
    for (linearValue65 = 0; linearValue65 < linearValue63; ++linearValue65)
      linearValue64[linearValue65] =
        linearParam34[linearValue65] * (1 - linearParam63) +
        linearParam35[linearValue65] * linearParam63;
    return linearValue64;
  };
}
function linearHelper5(linearParam72) {
  return (
    ArrayBuffer.isView(linearParam72) && !(linearParam72 instanceof DataView)
  );
}
function linearHelper6(linearParam19, linearParam20) {
  var linearValue51 = linearParam20 ? linearParam20.length : 0,
    linearValue52 = linearParam19
      ? Math.min(linearValue51, linearParam19.length)
      : 0,
    linearValue53 = Array(linearValue52),
    linearValue54 = Array(linearValue51),
    linearValue55;
  for (linearValue55 = 0; linearValue55 < linearValue52; ++linearValue55)
    linearValue53[linearValue55] = linearHelper9(
      linearParam19[linearValue55],
      linearParam20[linearValue55],
    );
  for (; linearValue55 < linearValue51; ++linearValue55)
    linearValue54[linearValue55] = linearParam20[linearValue55];
  return function (linearParam73) {
    for (linearValue55 = 0; linearValue55 < linearValue52; ++linearValue55)
      linearValue54[linearValue55] =
        linearValue53[linearValue55](linearParam73);
    return linearValue54;
  };
}
function linearHelper7(linearParam36, linearParam37) {
  var linearValue67 = new Date();
  return (
    (linearParam36 = +linearParam36),
    (linearParam37 = +linearParam37),
    function (linearParam76) {
      return (
        linearValue67.setTime(
          linearParam36 * (1 - linearParam76) + linearParam37 * linearParam76,
        ),
        linearValue67
      );
    }
  );
}
function linearHelper8(linearParam21, linearParam22) {
  var linearValue56 = {},
    linearValue57 = {},
    linearValue58;
  for (linearValue58 in ((typeof linearParam21 != "object" || !linearParam21) &&
    (linearParam21 = {}),
  (typeof linearParam22 != "object" || !linearParam22) && (linearParam22 = {}),
  linearParam22))
    linearValue58 in linearParam21
      ? (linearValue56[linearValue58] = linearHelper9(
          linearParam21[linearValue58],
          linearParam22[linearValue58],
        ))
      : (linearValue57[linearValue58] = linearParam22[linearValue58]);
  return function (linearParam81) {
    for (linearValue58 in linearValue56)
      linearValue57[linearValue58] =
        linearValue56[linearValue58](linearParam81);
    return linearValue57;
  };
}
function linearHelper9(linearParam7, linearParam8) {
  var linearValue24 = typeof linearParam8,
    linearValue25;
  return linearParam8 == null || linearValue24 === "boolean"
    ? stringO(linearParam8)
    : (linearValue24 === "number"
        ? stringN
        : linearValue24 === "string"
          ? (linearValue25 = stringL(linearParam8))
            ? ((linearParam8 = linearValue25), stringR)
            : stringT
          : linearParam8 instanceof stringL
            ? stringR
            : linearParam8 instanceof Date
              ? linearHelper7
              : linearHelper5(linearParam8)
                ? linearHelper4
                : Array.isArray(linearParam8)
                  ? linearHelper6
                  : (typeof linearParam8.valueOf != "function" &&
                        typeof linearParam8.toString != "function") ||
                      isNaN(linearParam8)
                    ? linearHelper8
                    : stringN)(linearParam7, linearParam8);
}
function linearHelper10(linearParam53, linearParam54) {
  return (
    (linearParam53 = +linearParam53),
    (linearParam54 = +linearParam54),
    function (linearParam80) {
      return Math.round(
        linearParam53 * (1 - linearParam80) + linearParam54 * linearParam80,
      );
    }
  );
}
function linearHelper11(linearParam40, linearParam41) {
  return linearParam40 == null || linearParam41 == null
    ? NaN
    : linearParam40 < linearParam41
      ? -1
      : linearParam40 > linearParam41
        ? 1
        : linearParam40 >= linearParam41
          ? 0
          : NaN;
}
function linearHelper12(linearParam42, linearParam43) {
  return linearParam42 == null || linearParam43 == null
    ? NaN
    : linearParam43 < linearParam42
      ? -1
      : linearParam43 > linearParam42
        ? 1
        : linearParam43 >= linearParam42
          ? 0
          : NaN;
}
function linearL(linearParam2) {
  let linearValue18, linearValue19, linearValue20;
  linearParam2.length === 2
    ? ((linearValue18 =
        linearParam2 === linearHelper11 || linearParam2 === linearHelper12
          ? linearParam2
          : linearHelper13),
      (linearValue19 = linearParam2),
      (linearValue20 = linearParam2))
    : ((linearValue18 = linearHelper11),
      (linearValue19 = (linearParam92, linearParam93) =>
        linearHelper11(linearParam2(linearParam92), linearParam93)),
      (linearValue20 = (linearParam94, linearParam95) =>
        linearParam2(linearParam94) - linearParam95));
  function linearHelper26(
    linearParam27,
    linearParam28,
    linearParam29 = 0,
    linearParam30 = linearParam27.length,
  ) {
    if (linearParam29 < linearParam30) {
      if (linearValue18(linearParam28, linearParam28) !== 0)
        return linearParam30;
      do {
        let linearValue75 = (linearParam29 + linearParam30) >>> 1;
        linearValue19(linearParam27[linearValue75], linearParam28) < 0
          ? (linearParam29 = linearValue75 + 1)
          : (linearParam30 = linearValue75);
      } while (linearParam29 < linearParam30);
    }
    return linearParam29;
  }
  function linearHelper27(
    linearParam23,
    linearParam24,
    linearParam25 = 0,
    linearParam26 = linearParam23.length,
  ) {
    if (linearParam25 < linearParam26) {
      if (linearValue18(linearParam24, linearParam24) !== 0)
        return linearParam26;
      do {
        let linearValue74 = (linearParam25 + linearParam26) >>> 1;
        linearValue19(linearParam23[linearValue74], linearParam24) <= 0
          ? (linearParam25 = linearValue74 + 1)
          : (linearParam26 = linearValue74);
      } while (linearParam25 < linearParam26);
    }
    return linearParam25;
  }
  function linearHelper28(
    linearParam49,
    linearParam50,
    linearParam51 = 0,
    linearParam52 = linearParam49.length,
  ) {
    let linearValue72 = linearHelper26(
      linearParam49,
      linearParam50,
      linearParam51,
      linearParam52 - 1,
    );
    return linearValue72 > linearParam51 &&
      linearValue20(linearParam49[linearValue72 - 1], linearParam50) >
        -linearValue20(linearParam49[linearValue72], linearParam50)
      ? linearValue72 - 1
      : linearValue72;
  }
  return {
    left: linearHelper26,
    center: linearHelper28,
    right: linearHelper27,
  };
}
function linearHelper13() {
  return 0;
}
function linearC(linearParam88) {
  return linearParam88 === null ? NaN : +linearParam88;
}
var linearValue1 = linearL(linearHelper11),
  linearValue2 = linearValue1.right;
linearValue1.left;
linearL(linearC).center;
var linearValue3 = Math.sqrt(50),
  linearValue4 = Math.sqrt(10),
  linearValue5 = Math.sqrt(2);
function linearHelper14(linearParam10, linearParam11, linearParam12) {
  let linearValue34 =
      (linearParam11 - linearParam10) / Math.max(0, linearParam12),
    linearValue35 = Math.floor(Math.log10(linearValue34)),
    linearValue36 = linearValue34 / 10 ** linearValue35,
    linearValue37 =
      linearValue36 >= linearValue3
        ? 10
        : linearValue36 >= linearValue4
          ? 5
          : linearValue36 >= linearValue5
            ? 2
            : 1,
    linearValue38,
    linearValue39,
    linearValue40;
  return (
    linearValue35 < 0
      ? ((linearValue40 = 10 ** -linearValue35 / linearValue37),
        (linearValue38 = Math.round(linearParam10 * linearValue40)),
        (linearValue39 = Math.round(linearParam11 * linearValue40)),
        linearValue38 / linearValue40 < linearParam10 && ++linearValue38,
        linearValue39 / linearValue40 > linearParam11 && --linearValue39,
        (linearValue40 = -linearValue40))
      : ((linearValue40 = 10 ** linearValue35 * linearValue37),
        (linearValue38 = Math.round(linearParam10 / linearValue40)),
        (linearValue39 = Math.round(linearParam11 / linearValue40)),
        linearValue38 * linearValue40 < linearParam10 && ++linearValue38,
        linearValue39 * linearValue40 > linearParam11 && --linearValue39),
    linearValue39 < linearValue38 && 0.5 <= linearParam12 && linearParam12 < 2
      ? linearHelper14(linearParam10, linearParam11, linearParam12 * 2)
      : [linearValue38, linearValue39, linearValue40]
  );
}
function linearHelper15(linearParam13, linearParam14, linearParam15) {
  if (
    ((linearParam14 = +linearParam14),
    (linearParam13 = +linearParam13),
    (linearParam15 = +linearParam15),
    !(linearParam15 > 0))
  )
    return [];
  if (linearParam13 === linearParam14) return [linearParam13];
  let linearValue41 = linearParam14 < linearParam13,
    [linearValue42, linearValue43, linearValue44] = linearValue41
      ? linearHelper14(linearParam14, linearParam13, linearParam15)
      : linearHelper14(linearParam13, linearParam14, linearParam15);
  if (!(linearValue43 >= linearValue42)) return [];
  let linearValue45 = linearValue43 - linearValue42 + 1,
    linearValue46 = Array(linearValue45);
  if (linearValue41) {
    if (linearValue44 < 0)
      for (
        let linearValue78 = 0;
        linearValue78 < linearValue45;
        ++linearValue78
      )
        linearValue46[linearValue78] =
          (linearValue43 - linearValue78) / -linearValue44;
    else
      for (
        let linearValue80 = 0;
        linearValue80 < linearValue45;
        ++linearValue80
      )
        linearValue46[linearValue80] =
          (linearValue43 - linearValue80) * linearValue44;
  } else if (linearValue44 < 0)
    for (let linearValue79 = 0; linearValue79 < linearValue45; ++linearValue79)
      linearValue46[linearValue79] =
        (linearValue42 + linearValue79) / -linearValue44;
  else
    for (let linearValue81 = 0; linearValue81 < linearValue45; ++linearValue81)
      linearValue46[linearValue81] =
        (linearValue42 + linearValue81) * linearValue44;
  return linearValue46;
}
function linearHelper16(linearParam69, linearParam70, linearParam71) {
  return (
    (linearParam70 = +linearParam70),
    (linearParam69 = +linearParam69),
    (linearParam71 = +linearParam71),
    linearHelper14(linearParam69, linearParam70, linearParam71)[2]
  );
}
function linearS(linearParam44, linearParam45, linearParam46) {
  linearParam45 = +linearParam45;
  linearParam44 = +linearParam44;
  linearParam46 = +linearParam46;
  let linearValue68 = linearParam45 < linearParam44,
    linearValue69 = linearValue68
      ? linearHelper16(linearParam45, linearParam44, linearParam46)
      : linearHelper16(linearParam44, linearParam45, linearParam46);
  return (
    (linearValue68 ? -1 : 1) *
    (linearValue69 < 0 ? 1 / -linearValue69 : linearValue69)
  );
}
function linearHelper17(linearParam85) {
  return function () {
    return linearParam85;
  };
}
function linearHelper18(linearParam90) {
  return +linearParam90;
}
var linearValue6 = [0, 1];
function linearA(linearParam91) {
  return linearParam91;
}
function linearHelper19(linearParam55, linearParam56) {
  return (linearParam56 -= linearParam55 = +linearParam55)
    ? function (linearParam87) {
        return (linearParam87 - linearParam55) / linearParam56;
      }
    : linearHelper17(isNaN(linearParam56) ? NaN : 0.5);
}
function linearHelper20(linearParam47, linearParam48) {
  var linearValue70;
  return (
    linearParam47 > linearParam48 &&
      ((linearValue70 = linearParam47),
      (linearParam47 = linearParam48),
      (linearParam48 = linearValue70)),
    function (linearParam82) {
      return Math.max(linearParam47, Math.min(linearParam48, linearParam82));
    }
  );
}
function linearHelper21(linearParam31, linearParam32, linearParam33) {
  var linearValue59 = linearParam31[0],
    linearValue60 = linearParam31[1],
    linearValue61 = linearParam32[0],
    linearValue62 = linearParam32[1];
  return (
    linearValue60 < linearValue59
      ? ((linearValue59 = linearHelper19(linearValue60, linearValue59)),
        (linearValue61 = linearParam33(linearValue62, linearValue61)))
      : ((linearValue59 = linearHelper19(linearValue59, linearValue60)),
        (linearValue61 = linearParam33(linearValue61, linearValue62))),
    function (linearParam89) {
      return linearValue61(linearValue59(linearParam89));
    }
  );
}
function linearHelper22(linearParam16, linearParam17, linearParam18) {
  var linearValue47 = Math.min(linearParam16.length, linearParam17.length) - 1,
    linearValue48 = Array(linearValue47),
    linearValue49 = Array(linearValue47),
    linearValue50 = -1;
  for (
    linearParam16[linearValue47] < linearParam16[0] &&
    ((linearParam16 = linearParam16.slice().reverse()),
    (linearParam17 = linearParam17.slice().reverse()));
    ++linearValue50 < linearValue47;
  ) {
    linearValue48[linearValue50] = linearHelper19(
      linearParam16[linearValue50],
      linearParam16[linearValue50 + 1],
    );
    linearValue49[linearValue50] = linearParam18(
      linearParam17[linearValue50],
      linearParam17[linearValue50 + 1],
    );
  }
  return function (linearParam74) {
    var linearValue77 =
      linearValue2(linearParam16, linearParam74, 1, linearValue47) - 1;
    return linearValue49[linearValue77](
      linearValue48[linearValue77](linearParam74),
    );
  };
}
function linearI(linearParam38, linearParam39) {
  return linearParam39
    .domain(linearParam38.domain())
    .range(linearParam38.range())
    .interpolate(linearParam38.interpolate())
    .clamp(linearParam38.clamp())
    .unknown(linearParam38.unknown());
}
function linearO() {
  var linearValue7 = linearValue6,
    linearValue8 = linearValue6,
    linearValue9 = linearHelper9,
    linearValue10,
    linearValue11,
    linearValue12,
    linearValue13 = linearA,
    linearValue14,
    linearValue15,
    linearValue16;
  function linearHelper24() {
    var linearValue66 = Math.min(linearValue7.length, linearValue8.length);
    return (
      linearValue13 !== linearA &&
        (linearValue13 = linearHelper20(
          linearValue7[0],
          linearValue7[linearValue66 - 1],
        )),
      (linearValue14 = linearValue66 > 2 ? linearHelper22 : linearHelper21),
      (linearValue15 = linearValue16 = null),
      linearHelper25
    );
  }
  function linearHelper25(linearParam61) {
    return linearParam61 == null || isNaN((linearParam61 = +linearParam61))
      ? linearValue12
      : (linearValue15 ||= linearValue14(
          linearValue7.map(linearValue10),
          linearValue8,
          linearValue9,
        ))(linearValue10(linearValue13(linearParam61)));
  }
  return (
    (linearHelper25.invert = function (linearParam79) {
      return linearValue13(
        linearValue11(
          (linearValue16 ||= linearValue14(
            linearValue8,
            linearValue7.map(linearValue10),
            stringN,
          ))(linearParam79),
        ),
      );
    }),
    (linearHelper25.domain = function (linearParam62) {
      return arguments.length
        ? ((linearValue7 = Array.from(linearParam62, linearHelper18)),
          linearHelper24())
        : linearValue7.slice();
    }),
    (linearHelper25.range = function (linearParam66) {
      return arguments.length
        ? ((linearValue8 = Array.from(linearParam66)), linearHelper24())
        : linearValue8.slice();
    }),
    (linearHelper25.rangeRound = function (linearParam77) {
      return (
        (linearValue8 = Array.from(linearParam77)),
        (linearValue9 = linearHelper10),
        linearHelper24()
      );
    }),
    (linearHelper25.clamp = function (linearParam67) {
      return arguments.length
        ? ((linearValue13 = linearParam67 ? true : linearA), linearHelper24())
        : linearValue13 !== linearA;
    }),
    (linearHelper25.interpolate = function (linearParam75) {
      return arguments.length
        ? ((linearValue9 = linearParam75), linearHelper24())
        : linearValue9;
    }),
    (linearHelper25.unknown = function (linearParam78) {
      return arguments.length
        ? ((linearValue12 = linearParam78), linearHelper25)
        : linearValue12;
    }),
    function (linearParam83, linearParam84) {
      return (
        (linearValue10 = linearParam83),
        (linearValue11 = linearParam84),
        linearHelper24()
      );
    }
  );
}
function linearR() {
  return linearO()(linearA, linearA);
}
function linearHelper23(
  linearParam3,
  linearParam4,
  linearParam5,
  linearParam6,
) {
  var linearValue21 = linearS(linearParam3, linearParam4, linearParam5),
    linearValue22;
  switch (
    ((linearParam6 = defaultLocaleI(linearParam6 ?? ",f")), linearParam6.type)
  ) {
    case "s":
      var linearValue23 = Math.max(
        Math.abs(linearParam3),
        Math.abs(linearParam4),
      );
      return (
        linearParam6.precision == null &&
          !isNaN(
            (linearValue22 = linearHelper2(linearValue21, linearValue23)),
          ) &&
          (linearParam6.precision = linearValue22),
        defaultLocaleN(linearParam6, linearValue23)
      );
    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      linearParam6.precision == null &&
        !isNaN(
          (linearValue22 = linearHelper3(
            linearValue21,
            Math.max(Math.abs(linearParam3), Math.abs(linearParam4)),
          )),
        ) &&
        (linearParam6.precision = linearValue22 - (linearParam6.type === "e"));
      break;
    case "f":
    case "%":
      linearParam6.precision == null &&
        !isNaN((linearValue22 = linearHelper1(linearValue21))) &&
        (linearParam6.precision =
          linearValue22 - (linearParam6.type === "%") * 2);
      break;
  }
  return defaultLocaleT(linearParam6);
}
function linearN(linearParam1) {
  var linearValue17 = linearParam1.domain;
  return (
    (linearParam1.ticks = function (linearParam68) {
      var linearValue76 = linearValue17();
      return linearHelper15(
        linearValue76[0],
        linearValue76[linearValue76.length - 1],
        linearParam68 ?? 10,
      );
    }),
    (linearParam1.tickFormat = function (linearParam64, linearParam65) {
      var linearValue73 = linearValue17();
      return linearHelper23(
        linearValue73[0],
        linearValue73[linearValue73.length - 1],
        linearParam64 ?? 10,
        linearParam65,
      );
    }),
    (linearParam1.nice = function (linearParam9) {
      linearParam9 ??= 10;
      var linearValue26 = linearValue17(),
        linearValue27 = 0,
        linearValue28 = linearValue26.length - 1,
        linearValue29 = linearValue26[linearValue27],
        linearValue30 = linearValue26[linearValue28],
        linearValue31,
        linearValue32,
        linearValue33 = 10;
      for (
        linearValue30 < linearValue29 &&
        ((linearValue32 = linearValue29),
        (linearValue29 = linearValue30),
        (linearValue30 = linearValue32),
        (linearValue32 = linearValue27),
        (linearValue27 = linearValue28),
        (linearValue28 = linearValue32));
        linearValue33-- > 0;
      ) {
        if (
          ((linearValue32 = linearHelper16(
            linearValue29,
            linearValue30,
            linearParam9,
          )),
          linearValue32 === linearValue31)
        )
          return (
            (linearValue26[linearValue27] = linearValue29),
            (linearValue26[linearValue28] = linearValue30),
            linearValue17(linearValue26)
          );
        if (linearValue32 > 0) {
          linearValue29 =
            Math.floor(linearValue29 / linearValue32) * linearValue32;
          linearValue30 =
            Math.ceil(linearValue30 / linearValue32) * linearValue32;
        } else if (linearValue32 < 0) {
          linearValue29 =
            Math.ceil(linearValue29 * linearValue32) / linearValue32;
          linearValue30 =
            Math.floor(linearValue30 * linearValue32) / linearValue32;
        } else break;
        linearValue31 = linearValue32;
      }
      return linearParam1;
    }),
    linearParam1
  );
}
function linearT() {
  var linearValue71 = linearR();
  return (
    (linearValue71.copy = function () {
      return linearI(linearValue71, linearT());
    }),
    init.apply(linearValue71, arguments),
    linearN(linearValue71)
  );
}
export {
  linearA,
  linearC,
  linearI,
  linearL,
  linearN,
  linearO,
  linearR,
  linearS,
  linearT,
};
