// Restored from ref/webview/assets/treemap-CMHfdOyb.js
// Treemap chunk restored from the Codex webview bundle.
function treemapHelper1(treemapParam31) {
  var treemapValue77 = 0,
    treemapValue78 = treemapParam31.children,
    treemapValue79 = treemapValue78 && treemapValue78.length;
  if (!treemapValue79) treemapValue77 = 1;
  else
    for (; --treemapValue79 >= 0; )
      treemapValue77 += treemapValue78[treemapValue79].value;
  treemapParam31.value = treemapValue77;
}
function treemapHelper2() {
  return this.eachAfter(treemapHelper1);
}
function treemapHelper3(treemapParam42, treemapParam43) {
  let treemapValue84 = -1;
  for (let treemapValue90 of this)
    treemapParam42.call(treemapParam43, treemapValue90, ++treemapValue84, this);
  return this;
}
function treemapHelper4(treemapParam24, treemapParam25) {
  for (
    var treemapValue66 = this,
      treemapValue67 = [treemapValue66],
      treemapValue68,
      treemapValue69,
      treemapValue70 = -1;
    (treemapValue66 = treemapValue67.pop());
  )
    if (
      (treemapParam24.call(
        treemapParam25,
        treemapValue66,
        ++treemapValue70,
        this,
      ),
      (treemapValue68 = treemapValue66.children))
    )
      for (
        treemapValue69 = treemapValue68.length - 1;
        treemapValue69 >= 0;
        --treemapValue69
      )
        treemapValue67.push(treemapValue68[treemapValue69]);
  return this;
}
function treemapHelper5(treemapParam10, treemapParam11) {
  for (
    var treemapValue40 = this,
      treemapValue41 = [treemapValue40],
      treemapValue42 = [],
      treemapValue43,
      treemapValue44,
      treemapValue45,
      treemapValue46 = -1;
    (treemapValue40 = treemapValue41.pop());
  )
    if (
      (treemapValue42.push(treemapValue40),
      (treemapValue43 = treemapValue40.children))
    )
      for (
        treemapValue44 = 0, treemapValue45 = treemapValue43.length;
        treemapValue44 < treemapValue45;
        ++treemapValue44
      )
        treemapValue41.push(treemapValue43[treemapValue44]);
  for (; (treemapValue40 = treemapValue42.pop()); )
    treemapParam10.call(treemapParam11, treemapValue40, ++treemapValue46, this);
  return this;
}
function treemapHelper6(treemapParam44, treemapParam45) {
  let treemapValue85 = -1;
  for (let treemapValue89 of this)
    if (
      treemapParam44.call(
        treemapParam45,
        treemapValue89,
        ++treemapValue85,
        this,
      )
    )
      return treemapValue89;
}
function treemapHelper7(treemapParam27) {
  return this.eachAfter(function (treemapParam33) {
    for (
      var treemapValue80 = +treemapParam27(treemapParam33.data) || 0,
        treemapValue81 = treemapParam33.children,
        treemapValue82 = treemapValue81 && treemapValue81.length;
      --treemapValue82 >= 0;
    )
      treemapValue80 += treemapValue81[treemapValue82].value;
    treemapParam33.value = treemapValue80;
  });
}
function treemapHelper8(treemapParam40) {
  return this.eachBefore(function (treemapParam56) {
    treemapParam56.children && treemapParam56.children.sort(treemapParam40);
  });
}
function treemapHelper9(treemapParam26) {
  for (
    var treemapValue71 = this,
      treemapValue72 = treemapHelper10(treemapValue71, treemapParam26),
      treemapValue73 = [treemapValue71];
    treemapValue71 !== treemapValue72;
  ) {
    treemapValue71 = treemapValue71.parent;
    treemapValue73.push(treemapValue71);
  }
  for (
    var treemapValue74 = treemapValue73.length;
    treemapParam26 !== treemapValue72;
  ) {
    treemapValue73.splice(treemapValue74, 0, treemapParam26);
    treemapParam26 = treemapParam26.parent;
  }
  return treemapValue73;
}
function treemapHelper10(treemapParam22, treemapParam23) {
  if (treemapParam22 === treemapParam23) return treemapParam22;
  var treemapValue63 = treemapParam22.ancestors(),
    treemapValue64 = treemapParam23.ancestors(),
    treemapValue65 = null;
  for (
    treemapParam22 = treemapValue63.pop(),
      treemapParam23 = treemapValue64.pop();
    treemapParam22 === treemapParam23;
  ) {
    treemapValue65 = treemapParam22;
    treemapParam22 = treemapValue63.pop();
    treemapParam23 = treemapValue64.pop();
  }
  return treemapValue65;
}
function treemapHelper11() {
  for (
    var treemapValue87 = this, treemapValue88 = [treemapValue87];
    (treemapValue87 = treemapValue87.parent);
  )
    treemapValue88.push(treemapValue87);
  return treemapValue88;
}
function treemapHelper12() {
  return Array.from(this);
}
function treemapHelper13() {
  var treemapValue83 = [];
  return (
    this.eachBefore(function (treemapParam62) {
      treemapParam62.children || treemapValue83.push(treemapParam62);
    }),
    treemapValue83
  );
}
function treemapHelper14() {
  var treemapValue75 = this,
    treemapValue76 = [];
  return (
    treemapValue75.each(function (treemapParam49) {
      treemapParam49 !== treemapValue75 &&
        treemapValue76.push({
          source: treemapParam49.parent,
          target: treemapParam49,
        });
    }),
    treemapValue76
  );
}
function* treemapHelper15() {
  var treemapValue47 = this,
    treemapValue48,
    treemapValue49 = [treemapValue47],
    treemapValue50,
    treemapValue51,
    treemapValue52;
  do
    for (
      treemapValue48 = treemapValue49.reverse(), treemapValue49 = [];
      (treemapValue47 = treemapValue48.pop());
    )
      if ((yield treemapValue47, (treemapValue50 = treemapValue47.children)))
        for (
          treemapValue51 = 0, treemapValue52 = treemapValue50.length;
          treemapValue51 < treemapValue52;
          ++treemapValue51
        )
          treemapValue49.push(treemapValue50[treemapValue51]);
  while (treemapValue49.length);
}
function treemapA(treemapParam8, treemapParam9) {
  treemapParam8 instanceof Map
    ? ((treemapParam8 = [undefined, treemapParam8]),
      treemapParam9 === undefined && (treemapParam9 = treemapHelper18))
    : treemapParam9 === undefined && (treemapParam9 = treemapHelper17);
  for (
    var treemapValue33 = new treemapHelper21(treemapParam8),
      treemapValue34,
      treemapValue35 = [treemapValue33],
      treemapValue36,
      treemapValue37,
      treemapValue38,
      treemapValue39;
    (treemapValue34 = treemapValue35.pop());
  )
    if (
      (treemapValue37 = treemapParam9(treemapValue34.data)) &&
      (treemapValue39 = (treemapValue37 = Array.from(treemapValue37)).length)
    )
      for (
        treemapValue34.children = treemapValue37,
          treemapValue38 = treemapValue39 - 1;
        treemapValue38 >= 0;
        --treemapValue38
      ) {
        treemapValue35.push(
          (treemapValue36 = treemapValue37[treemapValue38] =
            new treemapHelper21(treemapValue37[treemapValue38])),
        );
        treemapValue36.parent = treemapValue34;
        treemapValue36.depth = treemapValue34.depth + 1;
      }
  return treemapValue33.eachBefore(treemapHelper20);
}
function treemapHelper16() {
  return treemapA(this).eachBefore(treemapHelper19);
}
function treemapHelper17(treemapParam63) {
  return treemapParam63.children;
}
function treemapHelper18(treemapParam54) {
  return Array.isArray(treemapParam54) ? treemapParam54[1] : null;
}
function treemapHelper19(treemapParam41) {
  treemapParam41.data.value !== undefined &&
    (treemapParam41.value = treemapParam41.data.value);
  treemapParam41.data = treemapParam41.data.data;
}
function treemapHelper20(treemapParam46) {
  var treemapValue86 = 0;
  do treemapParam46.height = treemapValue86;
  while (
    (treemapParam46 = treemapParam46.parent) &&
    treemapParam46.height < ++treemapValue86
  );
}
function treemapHelper21(treemapParam47) {
  this.data = treemapParam47;
  this.depth = this.height = 0;
  this.parent = null;
}
treemapHelper21.prototype = treemapA.prototype = {
  constructor: treemapHelper21,
  count: treemapHelper2,
  each: treemapHelper3,
  eachAfter: treemapHelper5,
  eachBefore: treemapHelper4,
  find: treemapHelper6,
  sum: treemapHelper7,
  sort: treemapHelper8,
  path: treemapHelper9,
  ancestors: treemapHelper11,
  descendants: treemapHelper12,
  leaves: treemapHelper13,
  links: treemapHelper14,
  copy: treemapHelper16,
  [Symbol.iterator]: treemapHelper15,
};
function treemapHelper22(treemapParam50) {
  if (typeof treemapParam50 != "function") throw Error();
  return treemapParam50;
}
function treemapHelper23() {
  return 0;
}
function treemapHelper24(treemapParam53) {
  return function () {
    return treemapParam53;
  };
}
function treemapI(treemapParam32) {
  treemapParam32.x0 = Math.round(treemapParam32.x0);
  treemapParam32.y0 = Math.round(treemapParam32.y0);
  treemapParam32.x1 = Math.round(treemapParam32.x1);
  treemapParam32.y1 = Math.round(treemapParam32.y1);
}
function treemapR(
  treemapParam12,
  treemapParam13,
  treemapParam14,
  treemapParam15,
  treemapParam16,
) {
  for (
    var treemapValue53 = treemapParam12.children,
      treemapValue54,
      treemapValue55 = -1,
      treemapValue56 = treemapValue53.length,
      treemapValue57 =
        treemapParam12.value &&
        (treemapParam15 - treemapParam13) / treemapParam12.value;
    ++treemapValue55 < treemapValue56;
  ) {
    treemapValue54 = treemapValue53[treemapValue55];
    treemapValue54.y0 = treemapParam14;
    treemapValue54.y1 = treemapParam16;
    treemapValue54.x0 = treemapParam13;
    treemapValue54.x1 = treemapParam13 += treemapValue54.value * treemapValue57;
  }
}
function treemapHelper25(
  treemapParam17,
  treemapParam18,
  treemapParam19,
  treemapParam20,
  treemapParam21,
) {
  for (
    var treemapValue58 = treemapParam17.children,
      treemapValue59,
      treemapValue60 = -1,
      treemapValue61 = treemapValue58.length,
      treemapValue62 =
        treemapParam17.value &&
        (treemapParam21 - treemapParam19) / treemapParam17.value;
    ++treemapValue60 < treemapValue61;
  ) {
    treemapValue59 = treemapValue58[treemapValue60];
    treemapValue59.x0 = treemapParam18;
    treemapValue59.x1 = treemapParam20;
    treemapValue59.y0 = treemapParam19;
    treemapValue59.y1 = treemapParam19 += treemapValue59.value * treemapValue62;
  }
}
var treemapValue1 = (1 + Math.sqrt(5)) / 2;
function treemapHelper26(
  treemapParam1,
  treemapParam2,
  treemapParam3,
  treemapParam4,
  treemapParam5,
  treemapParam6,
) {
  for (
    var treemapValue12 = [],
      treemapValue13 = treemapParam2.children,
      treemapValue14,
      treemapValue15,
      treemapValue16 = 0,
      treemapValue17 = 0,
      treemapValue18 = treemapValue13.length,
      treemapValue19,
      treemapValue20,
      _treemapA = treemapParam2.value,
      treemapValue21,
      treemapValue22,
      treemapValue23,
      treemapValue24,
      treemapValue25,
      treemapValue26,
      treemapValue27;
    treemapValue16 < treemapValue18;
  ) {
    treemapValue19 = treemapParam5 - treemapParam3;
    treemapValue20 = treemapParam6 - treemapParam4;
    do treemapValue21 = treemapValue13[treemapValue17++].value;
    while (!treemapValue21 && treemapValue17 < treemapValue18);
    for (
      treemapValue22 = treemapValue23 = treemapValue21,
        treemapValue26 =
          Math.max(
            treemapValue20 / treemapValue19,
            treemapValue19 / treemapValue20,
          ) /
          (_treemapA * treemapParam1),
        treemapValue27 = treemapValue21 * treemapValue21 * treemapValue26,
        treemapValue25 = Math.max(
          treemapValue23 / treemapValue27,
          treemapValue27 / treemapValue22,
        );
      treemapValue17 < treemapValue18;
      ++treemapValue17
    ) {
      if (
        ((treemapValue21 += treemapValue15 =
          treemapValue13[treemapValue17].value),
        treemapValue15 < treemapValue22 && (treemapValue22 = treemapValue15),
        treemapValue15 > treemapValue23 && (treemapValue23 = treemapValue15),
        (treemapValue27 = treemapValue21 * treemapValue21 * treemapValue26),
        (treemapValue24 = Math.max(
          treemapValue23 / treemapValue27,
          treemapValue27 / treemapValue22,
        )),
        treemapValue24 > treemapValue25)
      ) {
        treemapValue21 -= treemapValue15;
        break;
      }
      treemapValue25 = treemapValue24;
    }
    treemapValue12.push(
      (treemapValue14 = {
        value: treemapValue21,
        dice: treemapValue19 < treemapValue20,
        children: treemapValue13.slice(treemapValue16, treemapValue17),
      }),
    );
    treemapValue14.dice
      ? treemapR(
          treemapValue14,
          treemapParam3,
          treemapParam4,
          treemapParam5,
          _treemapA
            ? (treemapParam4 += (treemapValue20 * treemapValue21) / _treemapA)
            : treemapParam6,
        )
      : treemapHelper25(
          treemapValue14,
          treemapParam3,
          treemapParam4,
          _treemapA
            ? (treemapParam3 += (treemapValue19 * treemapValue21) / _treemapA)
            : treemapParam5,
          treemapParam6,
        );
    _treemapA -= treemapValue21;
    treemapValue16 = treemapValue17;
  }
  return treemapValue12;
}
var treemapN = (function treemapHelper29(treemapParam29) {
  function treemapHelper30(
    treemapParam57,
    treemapParam58,
    treemapParam59,
    treemapParam60,
    treemapParam61,
  ) {
    treemapHelper26(
      treemapParam29,
      treemapParam57,
      treemapParam58,
      treemapParam59,
      treemapParam60,
      treemapParam61,
    );
  }
  return (
    (treemapHelper30.ratio = function (treemapParam55) {
      return treemapHelper29(
        (treemapParam55 = +treemapParam55) > 1 ? treemapParam55 : 1,
      );
    }),
    treemapHelper30
  );
})(treemapValue1);
export function treemapT() {
  var treemapValue2 = treemapN,
    treemapValue3 = false,
    treemapValue4 = 1,
    treemapValue5 = 1,
    treemapValue6 = [0],
    treemapValue7 = treemapHelper23,
    treemapValue8 = treemapHelper23,
    treemapValue9 = treemapHelper23,
    treemapValue10 = treemapHelper23,
    treemapValue11 = treemapHelper23;
  function treemapHelper27(treemapParam28) {
    return (
      (treemapParam28.x0 = treemapParam28.y0 = 0),
      (treemapParam28.x1 = treemapValue4),
      (treemapParam28.y1 = treemapValue5),
      treemapParam28.eachBefore(treemapHelper28),
      (treemapValue6 = [0]),
      treemapValue3 && treemapParam28.eachBefore(treemapI),
      treemapParam28
    );
  }
  function treemapHelper28(treemapParam7) {
    var treemapValue28 = treemapValue6[treemapParam7.depth],
      treemapValue29 = treemapParam7.x0 + treemapValue28,
      treemapValue30 = treemapParam7.y0 + treemapValue28,
      treemapValue31 = treemapParam7.x1 - treemapValue28,
      treemapValue32 = treemapParam7.y1 - treemapValue28;
    treemapValue31 < treemapValue29 &&
      (treemapValue29 = treemapValue31 = (treemapValue29 + treemapValue31) / 2);
    treemapValue32 < treemapValue30 &&
      (treemapValue30 = treemapValue32 = (treemapValue30 + treemapValue32) / 2);
    treemapParam7.x0 = treemapValue29;
    treemapParam7.y0 = treemapValue30;
    treemapParam7.x1 = treemapValue31;
    treemapParam7.y1 = treemapValue32;
    treemapParam7.children &&
      ((treemapValue28 = treemapValue6[treemapParam7.depth + 1] =
        treemapValue7(treemapParam7) / 2),
      (treemapValue29 += treemapValue11(treemapParam7) - treemapValue28),
      (treemapValue30 += treemapValue8(treemapParam7) - treemapValue28),
      (treemapValue31 -= treemapValue9(treemapParam7) - treemapValue28),
      (treemapValue32 -= treemapValue10(treemapParam7) - treemapValue28),
      treemapValue31 < treemapValue29 &&
        (treemapValue29 = treemapValue31 =
          (treemapValue29 + treemapValue31) / 2),
      treemapValue32 < treemapValue30 &&
        (treemapValue30 = treemapValue32 =
          (treemapValue30 + treemapValue32) / 2),
      treemapValue2(
        treemapParam7,
        treemapValue29,
        treemapValue30,
        treemapValue31,
        treemapValue32,
      ));
  }
  return (
    (treemapHelper27.round = function (treemapParam52) {
      return arguments.length
        ? ((treemapValue3 = !!treemapParam52), treemapHelper27)
        : treemapValue3;
    }),
    (treemapHelper27.size = function (treemapParam48) {
      return arguments.length
        ? ((treemapValue4 = +treemapParam48[0]),
          (treemapValue5 = +treemapParam48[1]),
          treemapHelper27)
        : [treemapValue4, treemapValue5];
    }),
    (treemapHelper27.tile = function (treemapParam51) {
      return arguments.length
        ? ((treemapValue2 = treemapHelper22(treemapParam51)), treemapHelper27)
        : treemapValue2;
    }),
    (treemapHelper27.padding = function (treemapParam34) {
      return arguments.length
        ? treemapHelper27
            .paddingInner(treemapParam34)
            .paddingOuter(treemapParam34)
        : treemapHelper27.paddingInner();
    }),
    (treemapHelper27.paddingInner = function (treemapParam35) {
      return arguments.length
        ? ((treemapValue7 =
            typeof treemapParam35 == "function"
              ? treemapParam35
              : treemapHelper24(+treemapParam35)),
          treemapHelper27)
        : treemapValue7;
    }),
    (treemapHelper27.paddingOuter = function (treemapParam30) {
      return arguments.length
        ? treemapHelper27
            .paddingTop(treemapParam30)
            .paddingRight(treemapParam30)
            .paddingBottom(treemapParam30)
            .paddingLeft(treemapParam30)
        : treemapHelper27.paddingTop();
    }),
    (treemapHelper27.paddingTop = function (treemapParam36) {
      return arguments.length
        ? ((treemapValue8 =
            typeof treemapParam36 == "function"
              ? treemapParam36
              : treemapHelper24(+treemapParam36)),
          treemapHelper27)
        : treemapValue8;
    }),
    (treemapHelper27.paddingRight = function (treemapParam37) {
      return arguments.length
        ? ((treemapValue9 =
            typeof treemapParam37 == "function"
              ? treemapParam37
              : treemapHelper24(+treemapParam37)),
          treemapHelper27)
        : treemapValue9;
    }),
    (treemapHelper27.paddingBottom = function (treemapParam38) {
      return arguments.length
        ? ((treemapValue10 =
            typeof treemapParam38 == "function"
              ? treemapParam38
              : treemapHelper24(+treemapParam38)),
          treemapHelper27)
        : treemapValue10;
    }),
    (treemapHelper27.paddingLeft = function (treemapParam39) {
      return arguments.length
        ? ((treemapValue11 =
            typeof treemapParam39 == "function"
              ? treemapParam39
              : treemapHelper24(+treemapParam39)),
          treemapHelper27)
        : treemapValue11;
    }),
    treemapHelper27
  );
}
export { treemapA, treemapI, treemapN, treemapR };
