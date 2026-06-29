// Restored from ref/webview/assets/sankeyLinkHorizontal-DCfEjaVP.js
// SankeyLinkHorizontal chunk restored from the Codex webview bundle.
function sankeyLinkHorizontalHelper1(
  sankeyLinkHorizontalParam21,
  sankeyLinkHorizontalParam22,
) {
  let sankeyLinkHorizontalValue58;
  if (sankeyLinkHorizontalParam22 === undefined)
    for (let sankeyLinkHorizontalValue86 of sankeyLinkHorizontalParam21)
      sankeyLinkHorizontalValue86 != null &&
        (sankeyLinkHorizontalValue58 < sankeyLinkHorizontalValue86 ||
          (sankeyLinkHorizontalValue58 === undefined &&
            sankeyLinkHorizontalValue86 >= sankeyLinkHorizontalValue86)) &&
        (sankeyLinkHorizontalValue58 = sankeyLinkHorizontalValue86);
  else {
    let sankeyLinkHorizontalValue74 = -1;
    for (let _sankeyLinkHorizontalA of sankeyLinkHorizontalParam21)
      (_sankeyLinkHorizontalA = sankeyLinkHorizontalParam22(
        _sankeyLinkHorizontalA,
        ++sankeyLinkHorizontalValue74,
        sankeyLinkHorizontalParam21,
      )) != null &&
        (sankeyLinkHorizontalValue58 < _sankeyLinkHorizontalA ||
          (sankeyLinkHorizontalValue58 === undefined &&
            _sankeyLinkHorizontalA >= _sankeyLinkHorizontalA)) &&
        (sankeyLinkHorizontalValue58 = _sankeyLinkHorizontalA);
  }
  return sankeyLinkHorizontalValue58;
}
function sankeyLinkHorizontalHelper2(
  sankeyLinkHorizontalParam23,
  sankeyLinkHorizontalParam24,
) {
  let sankeyLinkHorizontalValue59;
  if (sankeyLinkHorizontalParam24 === undefined)
    for (let sankeyLinkHorizontalValue87 of sankeyLinkHorizontalParam23)
      sankeyLinkHorizontalValue87 != null &&
        (sankeyLinkHorizontalValue59 > sankeyLinkHorizontalValue87 ||
          (sankeyLinkHorizontalValue59 === undefined &&
            sankeyLinkHorizontalValue87 >= sankeyLinkHorizontalValue87)) &&
        (sankeyLinkHorizontalValue59 = sankeyLinkHorizontalValue87);
  else {
    let sankeyLinkHorizontalValue75 = -1;
    for (let _sankeyLinkHorizontalA of sankeyLinkHorizontalParam23)
      (_sankeyLinkHorizontalA = sankeyLinkHorizontalParam24(
        _sankeyLinkHorizontalA,
        ++sankeyLinkHorizontalValue75,
        sankeyLinkHorizontalParam23,
      )) != null &&
        (sankeyLinkHorizontalValue59 > _sankeyLinkHorizontalA ||
          (sankeyLinkHorizontalValue59 === undefined &&
            _sankeyLinkHorizontalA >= _sankeyLinkHorizontalA)) &&
        (sankeyLinkHorizontalValue59 = _sankeyLinkHorizontalA);
  }
  return sankeyLinkHorizontalValue59;
}
function sankeyLinkHorizontalHelper3(
  sankeyLinkHorizontalParam35,
  sankeyLinkHorizontalParam36,
) {
  let sankeyLinkHorizontalValue68 = 0;
  if (sankeyLinkHorizontalParam36 === undefined)
    for (let sankeyLinkHorizontalValue92 of sankeyLinkHorizontalParam35)
      (sankeyLinkHorizontalValue92 = +sankeyLinkHorizontalValue92) &&
        (sankeyLinkHorizontalValue68 += sankeyLinkHorizontalValue92);
  else {
    let sankeyLinkHorizontalValue88 = -1;
    for (let _sankeyLinkHorizontalA of sankeyLinkHorizontalParam35)
      (_sankeyLinkHorizontalA = +sankeyLinkHorizontalParam36(
        _sankeyLinkHorizontalA,
        ++sankeyLinkHorizontalValue88,
        sankeyLinkHorizontalParam35,
      )) && (sankeyLinkHorizontalValue68 += _sankeyLinkHorizontalA);
  }
  return sankeyLinkHorizontalValue68;
}
function sankeyLinkHorizontalHelper4(event) {
  return event.target.depth;
}
export function sankeyLinkHorizontalA(sankeyLinkHorizontalParam92) {
  return sankeyLinkHorizontalParam92.depth;
}
export function sankeyLinkHorizontalO(
  sankeyLinkHorizontalParam84,
  sankeyLinkHorizontalParam85,
) {
  return sankeyLinkHorizontalParam85 - 1 - sankeyLinkHorizontalParam84.height;
}
function sankeyLinkHorizontalI(
  sankeyLinkHorizontalParam80,
  sankeyLinkHorizontalParam81,
) {
  return sankeyLinkHorizontalParam80.sourceLinks.length
    ? sankeyLinkHorizontalParam80.depth
    : sankeyLinkHorizontalParam81 - 1;
}
export function sankeyLinkHorizontalR(sankeyLinkHorizontalParam47) {
  return sankeyLinkHorizontalParam47.targetLinks.length
    ? sankeyLinkHorizontalParam47.depth
    : sankeyLinkHorizontalParam47.sourceLinks.length
      ? sankeyLinkHorizontalHelper2(
          sankeyLinkHorizontalParam47.sourceLinks,
          sankeyLinkHorizontalHelper4,
        ) - 1
      : 0;
}
function sankeyLinkHorizontalHelper5(sankeyLinkHorizontalParam82) {
  return function () {
    return sankeyLinkHorizontalParam82;
  };
}
function sankeyLinkHorizontalHelper6(
  sankeyLinkHorizontalParam72,
  sankeyLinkHorizontalParam73,
) {
  return (
    sankeyLinkHorizontalHelper8(
      sankeyLinkHorizontalParam72.source,
      sankeyLinkHorizontalParam73.source,
    ) || sankeyLinkHorizontalParam72.index - sankeyLinkHorizontalParam73.index
  );
}
function sankeyLinkHorizontalHelper7(event, _event) {
  return (
    sankeyLinkHorizontalHelper8(event.target, _event.target) ||
    event.index - _event.index
  );
}
function sankeyLinkHorizontalHelper8(
  sankeyLinkHorizontalParam88,
  sankeyLinkHorizontalParam89,
) {
  return sankeyLinkHorizontalParam88.y0 - sankeyLinkHorizontalParam89.y0;
}
function sankeyLinkHorizontalHelper9(sankeyLinkHorizontalParam93) {
  return sankeyLinkHorizontalParam93.value;
}
function sankeyLinkHorizontalHelper10(sankeyLinkHorizontalParam94) {
  return sankeyLinkHorizontalParam94.index;
}
function sankeyLinkHorizontalHelper11(sankeyLinkHorizontalParam95) {
  return sankeyLinkHorizontalParam95.nodes;
}
function sankeyLinkHorizontalHelper12(sankeyLinkHorizontalParam96) {
  return sankeyLinkHorizontalParam96.links;
}
function sankeyLinkHorizontalHelper13(
  sankeyLinkHorizontalParam66,
  sankeyLinkHorizontalParam67,
) {
  let sankeyLinkHorizontalValue84 = sankeyLinkHorizontalParam66.get(
    sankeyLinkHorizontalParam67,
  );
  if (!sankeyLinkHorizontalValue84)
    throw Error("missing: " + sankeyLinkHorizontalParam67);
  return sankeyLinkHorizontalValue84;
}
function sankeyLinkHorizontalHelper14({ nodes }) {
  for (let sankeyLinkHorizontalValue64 of nodes) {
    let sankeyLinkHorizontalValue66 = sankeyLinkHorizontalValue64.y0,
      sankeyLinkHorizontalValue67 = sankeyLinkHorizontalValue66;
    for (let sankeyLinkHorizontalValue89 of sankeyLinkHorizontalValue64.sourceLinks) {
      sankeyLinkHorizontalValue89.y0 =
        sankeyLinkHorizontalValue66 + sankeyLinkHorizontalValue89.width / 2;
      sankeyLinkHorizontalValue66 += sankeyLinkHorizontalValue89.width;
    }
    for (let sankeyLinkHorizontalValue90 of sankeyLinkHorizontalValue64.targetLinks) {
      sankeyLinkHorizontalValue90.y1 =
        sankeyLinkHorizontalValue67 + sankeyLinkHorizontalValue90.width / 2;
      sankeyLinkHorizontalValue67 += sankeyLinkHorizontalValue90.width;
    }
  }
}
export function sankeyLinkHorizontalN() {
  let sankeyLinkHorizontalValue6 = 0,
    _sankeyLinkHorizontalA = 0,
    _sankeyLinkHorizontalO = 1,
    _sankeyLinkHorizontalR = 1,
    _sankeyLinkHorizontalN = 24,
    sankeyLinkHorizontalValue7 = 8,
    sankeyLinkHorizontalValue8,
    sankeyLinkHorizontalValue9 = sankeyLinkHorizontalHelper10,
    sankeyLinkHorizontalValue10 = sankeyLinkHorizontalI,
    sankeyLinkHorizontalValue11,
    sankeyLinkHorizontalValue12,
    sankeyLinkHorizontalValue13 = sankeyLinkHorizontalHelper11,
    sankeyLinkHorizontalValue14 = sankeyLinkHorizontalHelper12,
    sankeyLinkHorizontalValue15 = 6;
  function sankeyLinkHorizontalHelper27() {
    let sankeyLinkHorizontalValue71 = {
      nodes: sankeyLinkHorizontalValue13.apply(null, arguments),
      links: sankeyLinkHorizontalValue14.apply(null, arguments),
    };
    return (
      sankeyLinkHorizontalHelper28(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalHelper29(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalHelper30(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalHelper31(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalHelper34(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalHelper14(sankeyLinkHorizontalValue71),
      sankeyLinkHorizontalValue71
    );
  }
  sankeyLinkHorizontalHelper27.update = function (sankeyLinkHorizontalParam90) {
    return (
      sankeyLinkHorizontalHelper14(sankeyLinkHorizontalParam90),
      sankeyLinkHorizontalParam90
    );
  };
  sankeyLinkHorizontalHelper27.nodeId = function (sankeyLinkHorizontalParam52) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue9 =
          typeof sankeyLinkHorizontalParam52 == "function"
            ? sankeyLinkHorizontalParam52
            : sankeyLinkHorizontalHelper5(sankeyLinkHorizontalParam52)),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue9;
  };
  sankeyLinkHorizontalHelper27.nodeAlign = function (
    sankeyLinkHorizontalParam53,
  ) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue10 =
          typeof sankeyLinkHorizontalParam53 == "function"
            ? sankeyLinkHorizontalParam53
            : sankeyLinkHorizontalHelper5(sankeyLinkHorizontalParam53)),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue10;
  };
  sankeyLinkHorizontalHelper27.nodeSort = function (
    sankeyLinkHorizontalParam76,
  ) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue11 = sankeyLinkHorizontalParam76),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue11;
  };
  sankeyLinkHorizontalHelper27.nodeWidth = function (
    sankeyLinkHorizontalParam74,
  ) {
    return arguments.length
      ? ((_sankeyLinkHorizontalN = +sankeyLinkHorizontalParam74),
        sankeyLinkHorizontalHelper27)
      : _sankeyLinkHorizontalN;
  };
  sankeyLinkHorizontalHelper27.nodePadding = function (
    sankeyLinkHorizontalParam71,
  ) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue7 = sankeyLinkHorizontalValue8 =
          +sankeyLinkHorizontalParam71),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue7;
  };
  sankeyLinkHorizontalHelper27.nodes = function (sankeyLinkHorizontalParam54) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue13 =
          typeof sankeyLinkHorizontalParam54 == "function"
            ? sankeyLinkHorizontalParam54
            : sankeyLinkHorizontalHelper5(sankeyLinkHorizontalParam54)),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue13;
  };
  sankeyLinkHorizontalHelper27.links = function (sankeyLinkHorizontalParam55) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue14 =
          typeof sankeyLinkHorizontalParam55 == "function"
            ? sankeyLinkHorizontalParam55
            : sankeyLinkHorizontalHelper5(sankeyLinkHorizontalParam55)),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue14;
  };
  sankeyLinkHorizontalHelper27.linkSort = function (
    sankeyLinkHorizontalParam77,
  ) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue12 = sankeyLinkHorizontalParam77),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue12;
  };
  sankeyLinkHorizontalHelper27.size = function (sankeyLinkHorizontalParam48) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue6 = _sankeyLinkHorizontalA = 0),
        (_sankeyLinkHorizontalO = +sankeyLinkHorizontalParam48[0]),
        (_sankeyLinkHorizontalR = +sankeyLinkHorizontalParam48[1]),
        sankeyLinkHorizontalHelper27)
      : [
          _sankeyLinkHorizontalO - sankeyLinkHorizontalValue6,
          _sankeyLinkHorizontalR - _sankeyLinkHorizontalA,
        ];
  };
  sankeyLinkHorizontalHelper27.extent = function (sankeyLinkHorizontalParam34) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue6 = +sankeyLinkHorizontalParam34[0][0]),
        (_sankeyLinkHorizontalO = +sankeyLinkHorizontalParam34[1][0]),
        (_sankeyLinkHorizontalA = +sankeyLinkHorizontalParam34[0][1]),
        (_sankeyLinkHorizontalR = +sankeyLinkHorizontalParam34[1][1]),
        sankeyLinkHorizontalHelper27)
      : [
          [sankeyLinkHorizontalValue6, _sankeyLinkHorizontalA],
          [_sankeyLinkHorizontalO, _sankeyLinkHorizontalR],
        ];
  };
  sankeyLinkHorizontalHelper27.iterations = function (
    sankeyLinkHorizontalParam75,
  ) {
    return arguments.length
      ? ((sankeyLinkHorizontalValue15 = +sankeyLinkHorizontalParam75),
        sankeyLinkHorizontalHelper27)
      : sankeyLinkHorizontalValue15;
  };
  function sankeyLinkHorizontalHelper28({ nodes, links }) {
    for (let [
      sankeyLinkHorizontalValue82,
      sankeyLinkHorizontalValue83,
    ] of nodes.entries()) {
      sankeyLinkHorizontalValue83.index = sankeyLinkHorizontalValue82;
      sankeyLinkHorizontalValue83.sourceLinks = [];
      sankeyLinkHorizontalValue83.targetLinks = [];
    }
    let sankeyLinkHorizontalValue35 = new Map(
      nodes.map((item, index) => [
        sankeyLinkHorizontalValue9(item, index, nodes),
        item,
      ]),
    );
    for (let [
      sankeyLinkHorizontalValue60,
      sankeyLinkHorizontalValue61,
    ] of links.entries()) {
      sankeyLinkHorizontalValue61.index = sankeyLinkHorizontalValue60;
      let { source, target: __sankeyLinkHorizontalA } =
        sankeyLinkHorizontalValue61;
      typeof source != "object" &&
        (source = sankeyLinkHorizontalValue61.source =
          sankeyLinkHorizontalHelper13(sankeyLinkHorizontalValue35, source));
      typeof __sankeyLinkHorizontalA != "object" &&
        (__sankeyLinkHorizontalA = sankeyLinkHorizontalValue61.target =
          sankeyLinkHorizontalHelper13(
            sankeyLinkHorizontalValue35,
            __sankeyLinkHorizontalA,
          ));
      source.sourceLinks.push(sankeyLinkHorizontalValue61);
      __sankeyLinkHorizontalA.targetLinks.push(sankeyLinkHorizontalValue61);
    }
    if (sankeyLinkHorizontalValue12 != null)
      for (let { sourceLinks, targetLinks } of nodes) {
        sourceLinks.sort(sankeyLinkHorizontalValue12);
        targetLinks.sort(sankeyLinkHorizontalValue12);
      }
  }
  function sankeyLinkHorizontalHelper29({ nodes }) {
    for (let sankeyLinkHorizontalValue72 of nodes)
      sankeyLinkHorizontalValue72.value =
        sankeyLinkHorizontalValue72.fixedValue === undefined
          ? Math.max(
              sankeyLinkHorizontalHelper3(
                sankeyLinkHorizontalValue72.sourceLinks,
                sankeyLinkHorizontalHelper9,
              ),
              sankeyLinkHorizontalHelper3(
                sankeyLinkHorizontalValue72.targetLinks,
                sankeyLinkHorizontalHelper9,
              ),
            )
          : sankeyLinkHorizontalValue72.fixedValue;
  }
  function sankeyLinkHorizontalHelper30({ nodes }) {
    let sankeyLinkHorizontalValue47 = nodes.length,
      sankeyLinkHorizontalValue48 = new Set(nodes),
      sankeyLinkHorizontalValue49 = new Set(),
      __sankeyLinkHorizontalA = 0;
    for (; sankeyLinkHorizontalValue48.size; ) {
      for (let sankeyLinkHorizontalValue79 of sankeyLinkHorizontalValue48) {
        sankeyLinkHorizontalValue79.depth = __sankeyLinkHorizontalA;
        for (let { target } of sankeyLinkHorizontalValue79.sourceLinks)
          sankeyLinkHorizontalValue49.add(target);
      }
      if (++__sankeyLinkHorizontalA > sankeyLinkHorizontalValue47)
        throw Error("circular link");
      sankeyLinkHorizontalValue48 = sankeyLinkHorizontalValue49;
      sankeyLinkHorizontalValue49 = new Set();
    }
  }
  function sankeyLinkHorizontalHelper31({ nodes }) {
    let sankeyLinkHorizontalValue44 = nodes.length,
      sankeyLinkHorizontalValue45 = new Set(nodes),
      sankeyLinkHorizontalValue46 = new Set(),
      __sankeyLinkHorizontalA = 0;
    for (; sankeyLinkHorizontalValue45.size; ) {
      for (let sankeyLinkHorizontalValue78 of sankeyLinkHorizontalValue45) {
        sankeyLinkHorizontalValue78.height = __sankeyLinkHorizontalA;
        for (let { source } of sankeyLinkHorizontalValue78.targetLinks)
          sankeyLinkHorizontalValue46.add(source);
      }
      if (++__sankeyLinkHorizontalA > sankeyLinkHorizontalValue44)
        throw Error("circular link");
      sankeyLinkHorizontalValue45 = sankeyLinkHorizontalValue46;
      sankeyLinkHorizontalValue46 = new Set();
    }
  }
  function sankeyLinkHorizontalHelper32({ nodes }) {
    let sankeyLinkHorizontalValue39 =
        sankeyLinkHorizontalHelper1(
          nodes,
          (sankeyLinkHorizontalParam100) => sankeyLinkHorizontalParam100.depth,
        ) + 1,
      __sankeyLinkHorizontalA =
        (_sankeyLinkHorizontalO -
          sankeyLinkHorizontalValue6 -
          _sankeyLinkHorizontalN) /
        (sankeyLinkHorizontalValue39 - 1),
      _sankeyLinkHorizontalI = Array(sankeyLinkHorizontalValue39);
    for (let sankeyLinkHorizontalValue63 of nodes) {
      let sankeyLinkHorizontalValue65 = Math.max(
        0,
        Math.min(
          sankeyLinkHorizontalValue39 - 1,
          Math.floor(
            sankeyLinkHorizontalValue10.call(
              null,
              sankeyLinkHorizontalValue63,
              sankeyLinkHorizontalValue39,
            ),
          ),
        ),
      );
      sankeyLinkHorizontalValue63.layer = sankeyLinkHorizontalValue65;
      sankeyLinkHorizontalValue63.x0 =
        sankeyLinkHorizontalValue6 +
        sankeyLinkHorizontalValue65 * __sankeyLinkHorizontalA;
      sankeyLinkHorizontalValue63.x1 =
        sankeyLinkHorizontalValue63.x0 + _sankeyLinkHorizontalN;
      _sankeyLinkHorizontalI[sankeyLinkHorizontalValue65]
        ? _sankeyLinkHorizontalI[sankeyLinkHorizontalValue65].push(
            sankeyLinkHorizontalValue63,
          )
        : (_sankeyLinkHorizontalI[sankeyLinkHorizontalValue65] = [
            sankeyLinkHorizontalValue63,
          ]);
    }
    if (sankeyLinkHorizontalValue11)
      for (let sankeyLinkHorizontalValue93 of _sankeyLinkHorizontalI)
        sankeyLinkHorizontalValue93.sort(sankeyLinkHorizontalValue11);
    return _sankeyLinkHorizontalI;
  }
  function sankeyLinkHorizontalHelper33(sankeyLinkHorizontalParam16) {
    let sankeyLinkHorizontalValue36 = sankeyLinkHorizontalHelper2(
      sankeyLinkHorizontalParam16,
      (sankeyLinkHorizontalParam87) =>
        (_sankeyLinkHorizontalR -
          _sankeyLinkHorizontalA -
          (sankeyLinkHorizontalParam87.length - 1) *
            sankeyLinkHorizontalValue8) /
        sankeyLinkHorizontalHelper3(
          sankeyLinkHorizontalParam87,
          sankeyLinkHorizontalHelper9,
        ),
    );
    for (let sankeyLinkHorizontalValue40 of sankeyLinkHorizontalParam16) {
      let sankeyLinkHorizontalValue43 = _sankeyLinkHorizontalA;
      for (let sankeyLinkHorizontalValue73 of sankeyLinkHorizontalValue40) {
        sankeyLinkHorizontalValue73.y0 = sankeyLinkHorizontalValue43;
        sankeyLinkHorizontalValue73.y1 =
          sankeyLinkHorizontalValue43 +
          sankeyLinkHorizontalValue73.value * sankeyLinkHorizontalValue36;
        sankeyLinkHorizontalValue43 =
          sankeyLinkHorizontalValue73.y1 + sankeyLinkHorizontalValue8;
        for (let sankeyLinkHorizontalValue91 of sankeyLinkHorizontalValue73.sourceLinks)
          sankeyLinkHorizontalValue91.width =
            sankeyLinkHorizontalValue91.value * sankeyLinkHorizontalValue36;
      }
      sankeyLinkHorizontalValue43 =
        (_sankeyLinkHorizontalR -
          sankeyLinkHorizontalValue43 +
          sankeyLinkHorizontalValue8) /
        (sankeyLinkHorizontalValue40.length + 1);
      for (
        let sankeyLinkHorizontalValue77 = 0;
        sankeyLinkHorizontalValue77 < sankeyLinkHorizontalValue40.length;
        ++sankeyLinkHorizontalValue77
      ) {
        let sankeyLinkHorizontalValue85 =
          sankeyLinkHorizontalValue40[sankeyLinkHorizontalValue77];
        sankeyLinkHorizontalValue85.y0 +=
          sankeyLinkHorizontalValue43 * (sankeyLinkHorizontalValue77 + 1);
        sankeyLinkHorizontalValue85.y1 +=
          sankeyLinkHorizontalValue43 * (sankeyLinkHorizontalValue77 + 1);
      }
      sankeyLinkHorizontalHelper40(sankeyLinkHorizontalValue40);
    }
  }
  function sankeyLinkHorizontalHelper34(sankeyLinkHorizontalParam25) {
    let sankeyLinkHorizontalValue62 = sankeyLinkHorizontalHelper32(
      sankeyLinkHorizontalParam25,
    );
    sankeyLinkHorizontalValue8 = Math.min(
      sankeyLinkHorizontalValue7,
      (_sankeyLinkHorizontalR - _sankeyLinkHorizontalA) /
        (sankeyLinkHorizontalHelper1(
          sankeyLinkHorizontalValue62,
          (sankeyLinkHorizontalParam99) => sankeyLinkHorizontalParam99.length,
        ) -
          1),
    );
    sankeyLinkHorizontalHelper33(sankeyLinkHorizontalValue62);
    for (
      let sankeyLinkHorizontalValue76 = 0;
      sankeyLinkHorizontalValue76 < sankeyLinkHorizontalValue15;
      ++sankeyLinkHorizontalValue76
    ) {
      let sankeyLinkHorizontalValue80 = 0.99 ** sankeyLinkHorizontalValue76,
        sankeyLinkHorizontalValue81 = Math.max(
          1 - sankeyLinkHorizontalValue80,
          (sankeyLinkHorizontalValue76 + 1) / sankeyLinkHorizontalValue15,
        );
      sankeyLinkHorizontalHelper35(
        sankeyLinkHorizontalValue62,
        sankeyLinkHorizontalValue80,
        sankeyLinkHorizontalValue81,
      );
      _sankeyLinkHorizontalT(
        sankeyLinkHorizontalValue62,
        sankeyLinkHorizontalValue80,
        sankeyLinkHorizontalValue81,
      );
    }
  }
  function _sankeyLinkHorizontalT(
    sankeyLinkHorizontalParam10,
    sankeyLinkHorizontalParam11,
    sankeyLinkHorizontalParam12,
  ) {
    for (
      let sankeyLinkHorizontalValue37 = 1,
        __sankeyLinkHorizontalA = sankeyLinkHorizontalParam10.length;
      sankeyLinkHorizontalValue37 < __sankeyLinkHorizontalA;
      ++sankeyLinkHorizontalValue37
    ) {
      let ___sankeyLinkHorizontalA =
        sankeyLinkHorizontalParam10[sankeyLinkHorizontalValue37];
      for (let sankeyLinkHorizontalValue50 of ___sankeyLinkHorizontalA) {
        let sankeyLinkHorizontalValue52 = 0,
          sankeyLinkHorizontalValue53 = 0;
        for (let {
          source,
          value: _____sankeyLinkHorizontalA,
        } of sankeyLinkHorizontalValue50.targetLinks) {
          let __sankeyLinkHorizontalO =
            _____sankeyLinkHorizontalA *
            (sankeyLinkHorizontalValue50.layer - source.layer);
          sankeyLinkHorizontalValue52 +=
            sankeyLinkHorizontalHelper41(source, sankeyLinkHorizontalValue50) *
            __sankeyLinkHorizontalO;
          sankeyLinkHorizontalValue53 += __sankeyLinkHorizontalO;
        }
        if (!(sankeyLinkHorizontalValue53 > 0)) continue;
        let ____sankeyLinkHorizontalA =
          (sankeyLinkHorizontalValue52 / sankeyLinkHorizontalValue53 -
            sankeyLinkHorizontalValue50.y0) *
          sankeyLinkHorizontalParam11;
        sankeyLinkHorizontalValue50.y0 += ____sankeyLinkHorizontalA;
        sankeyLinkHorizontalValue50.y1 += ____sankeyLinkHorizontalA;
        sankeyLinkHorizontalHelper39(sankeyLinkHorizontalValue50);
      }
      sankeyLinkHorizontalValue11 === undefined &&
        ___sankeyLinkHorizontalA.sort(sankeyLinkHorizontalHelper8);
      sankeyLinkHorizontalHelper36(
        ___sankeyLinkHorizontalA,
        sankeyLinkHorizontalParam12,
      );
    }
  }
  function sankeyLinkHorizontalHelper35(
    sankeyLinkHorizontalParam13,
    sankeyLinkHorizontalParam14,
    sankeyLinkHorizontalParam15,
  ) {
    for (
      let sankeyLinkHorizontalValue38 = sankeyLinkHorizontalParam13.length - 2;
      sankeyLinkHorizontalValue38 >= 0;
      --sankeyLinkHorizontalValue38
    ) {
      let __sankeyLinkHorizontalA =
        sankeyLinkHorizontalParam13[sankeyLinkHorizontalValue38];
      for (let sankeyLinkHorizontalValue51 of __sankeyLinkHorizontalA) {
        let sankeyLinkHorizontalValue54 = 0,
          sankeyLinkHorizontalValue55 = 0;
        for (let {
          target,
          value: ____sankeyLinkHorizontalA,
        } of sankeyLinkHorizontalValue51.sourceLinks) {
          let __sankeyLinkHorizontalO =
            ____sankeyLinkHorizontalA *
            (target.layer - sankeyLinkHorizontalValue51.layer);
          sankeyLinkHorizontalValue54 +=
            sankeyLinkHorizontalHelper42(sankeyLinkHorizontalValue51, target) *
            __sankeyLinkHorizontalO;
          sankeyLinkHorizontalValue55 += __sankeyLinkHorizontalO;
        }
        if (!(sankeyLinkHorizontalValue55 > 0)) continue;
        let ___sankeyLinkHorizontalA =
          (sankeyLinkHorizontalValue54 / sankeyLinkHorizontalValue55 -
            sankeyLinkHorizontalValue51.y0) *
          sankeyLinkHorizontalParam14;
        sankeyLinkHorizontalValue51.y0 += ___sankeyLinkHorizontalA;
        sankeyLinkHorizontalValue51.y1 += ___sankeyLinkHorizontalA;
        sankeyLinkHorizontalHelper39(sankeyLinkHorizontalValue51);
      }
      sankeyLinkHorizontalValue11 === undefined &&
        __sankeyLinkHorizontalA.sort(sankeyLinkHorizontalHelper8);
      sankeyLinkHorizontalHelper36(
        __sankeyLinkHorizontalA,
        sankeyLinkHorizontalParam15,
      );
    }
  }
  function sankeyLinkHorizontalHelper36(
    sankeyLinkHorizontalParam37,
    sankeyLinkHorizontalParam38,
  ) {
    let sankeyLinkHorizontalValue69 = sankeyLinkHorizontalParam37.length >> 1,
      sankeyLinkHorizontalValue70 =
        sankeyLinkHorizontalParam37[sankeyLinkHorizontalValue69];
    sankeyLinkHorizontalHelper38(
      sankeyLinkHorizontalParam37,
      sankeyLinkHorizontalValue70.y0 - sankeyLinkHorizontalValue8,
      sankeyLinkHorizontalValue69 - 1,
      sankeyLinkHorizontalParam38,
    );
    sankeyLinkHorizontalHelper37(
      sankeyLinkHorizontalParam37,
      sankeyLinkHorizontalValue70.y1 + sankeyLinkHorizontalValue8,
      sankeyLinkHorizontalValue69 + 1,
      sankeyLinkHorizontalParam38,
    );
    sankeyLinkHorizontalHelper38(
      sankeyLinkHorizontalParam37,
      _sankeyLinkHorizontalR,
      sankeyLinkHorizontalParam37.length - 1,
      sankeyLinkHorizontalParam38,
    );
    sankeyLinkHorizontalHelper37(
      sankeyLinkHorizontalParam37,
      _sankeyLinkHorizontalA,
      0,
      sankeyLinkHorizontalParam38,
    );
  }
  function sankeyLinkHorizontalHelper37(
    sankeyLinkHorizontalParam39,
    sankeyLinkHorizontalParam40,
    sankeyLinkHorizontalParam41,
    sankeyLinkHorizontalParam42,
  ) {
    for (
      ;
      sankeyLinkHorizontalParam41 < sankeyLinkHorizontalParam39.length;
      ++sankeyLinkHorizontalParam41
    ) {
      let __sankeyLinkHorizontalA =
          sankeyLinkHorizontalParam39[sankeyLinkHorizontalParam41],
        __sankeyLinkHorizontalO =
          (sankeyLinkHorizontalParam40 - __sankeyLinkHorizontalA.y0) *
          sankeyLinkHorizontalParam42;
      __sankeyLinkHorizontalO > 1e-6 &&
        ((__sankeyLinkHorizontalA.y0 += __sankeyLinkHorizontalO),
        (__sankeyLinkHorizontalA.y1 += __sankeyLinkHorizontalO));
      sankeyLinkHorizontalParam40 =
        __sankeyLinkHorizontalA.y1 + sankeyLinkHorizontalValue8;
    }
  }
  function sankeyLinkHorizontalHelper38(
    sankeyLinkHorizontalParam43,
    sankeyLinkHorizontalParam44,
    sankeyLinkHorizontalParam45,
    sankeyLinkHorizontalParam46,
  ) {
    for (; sankeyLinkHorizontalParam45 >= 0; --sankeyLinkHorizontalParam45) {
      let __sankeyLinkHorizontalA =
          sankeyLinkHorizontalParam43[sankeyLinkHorizontalParam45],
        __sankeyLinkHorizontalO =
          (__sankeyLinkHorizontalA.y1 - sankeyLinkHorizontalParam44) *
          sankeyLinkHorizontalParam46;
      __sankeyLinkHorizontalO > 1e-6 &&
        ((__sankeyLinkHorizontalA.y0 -= __sankeyLinkHorizontalO),
        (__sankeyLinkHorizontalA.y1 -= __sankeyLinkHorizontalO));
      sankeyLinkHorizontalParam44 =
        __sankeyLinkHorizontalA.y0 - sankeyLinkHorizontalValue8;
    }
  }
  function sankeyLinkHorizontalHelper39({ sourceLinks, targetLinks }) {
    if (sankeyLinkHorizontalValue12 === undefined) {
      for (let {
        source: { sourceLinks: _sourceLinks },
      } of targetLinks)
        _sourceLinks.sort(sankeyLinkHorizontalHelper7);
      for (let {
        target: { targetLinks: _targetLinks },
      } of sourceLinks)
        _targetLinks.sort(sankeyLinkHorizontalHelper6);
    }
  }
  function sankeyLinkHorizontalHelper40(sankeyLinkHorizontalParam49) {
    if (sankeyLinkHorizontalValue12 === undefined)
      for (let { sourceLinks, targetLinks } of sankeyLinkHorizontalParam49) {
        sourceLinks.sort(sankeyLinkHorizontalHelper7);
        targetLinks.sort(sankeyLinkHorizontalHelper6);
      }
  }
  function sankeyLinkHorizontalHelper41(
    sankeyLinkHorizontalParam17,
    sankeyLinkHorizontalParam18,
  ) {
    let sankeyLinkHorizontalValue56 =
      sankeyLinkHorizontalParam17.y0 -
      ((sankeyLinkHorizontalParam17.sourceLinks.length - 1) *
        sankeyLinkHorizontalValue8) /
        2;
    for (let {
      target,
      width: __sankeyLinkHorizontalA,
    } of sankeyLinkHorizontalParam17.sourceLinks) {
      if (target === sankeyLinkHorizontalParam18) break;
      sankeyLinkHorizontalValue56 +=
        __sankeyLinkHorizontalA + sankeyLinkHorizontalValue8;
    }
    for (let {
      source,
      width: __sankeyLinkHorizontalA,
    } of sankeyLinkHorizontalParam18.targetLinks) {
      if (source === sankeyLinkHorizontalParam17) break;
      sankeyLinkHorizontalValue56 -= __sankeyLinkHorizontalA;
    }
    return sankeyLinkHorizontalValue56;
  }
  function sankeyLinkHorizontalHelper42(
    sankeyLinkHorizontalParam19,
    sankeyLinkHorizontalParam20,
  ) {
    let sankeyLinkHorizontalValue57 =
      sankeyLinkHorizontalParam20.y0 -
      ((sankeyLinkHorizontalParam20.targetLinks.length - 1) *
        sankeyLinkHorizontalValue8) /
        2;
    for (let {
      source,
      width: __sankeyLinkHorizontalA,
    } of sankeyLinkHorizontalParam20.targetLinks) {
      if (source === sankeyLinkHorizontalParam19) break;
      sankeyLinkHorizontalValue57 +=
        __sankeyLinkHorizontalA + sankeyLinkHorizontalValue8;
    }
    for (let {
      target,
      width: __sankeyLinkHorizontalA,
    } of sankeyLinkHorizontalParam19.sourceLinks) {
      if (target === sankeyLinkHorizontalParam20) break;
      sankeyLinkHorizontalValue57 -= __sankeyLinkHorizontalA;
    }
    return sankeyLinkHorizontalValue57;
  }
  return sankeyLinkHorizontalHelper27;
}
var sankeyLinkHorizontalValue1 = Math.PI,
  sankeyLinkHorizontalValue2 = 2 * sankeyLinkHorizontalValue1,
  sankeyLinkHorizontalValue4 = sankeyLinkHorizontalValue2 - 1e-6;
function sankeyLinkHorizontalHelper15() {
  this._x0 = this._y0 = this._x1 = this._y1 = null;
  this._ = "";
}
function sankeyLinkHorizontalHelper16() {
  return new sankeyLinkHorizontalHelper15();
}
sankeyLinkHorizontalHelper15.prototype =
  sankeyLinkHorizontalHelper16.prototype = {
    constructor: sankeyLinkHorizontalHelper15,
    moveTo: function (
      sankeyLinkHorizontalParam60,
      sankeyLinkHorizontalParam61,
    ) {
      this._ +=
        "M" +
        (this._x0 = this._x1 = +sankeyLinkHorizontalParam60) +
        "," +
        (this._y0 = this._y1 = +sankeyLinkHorizontalParam61);
    },
    closePath: function () {
      this._x1 !== null &&
        ((this._x1 = this._x0), (this._y1 = this._y0), (this._ += "Z"));
    },
    lineTo: function (
      sankeyLinkHorizontalParam68,
      sankeyLinkHorizontalParam69,
    ) {
      this._ +=
        "L" +
        (this._x1 = +sankeyLinkHorizontalParam68) +
        "," +
        (this._y1 = +sankeyLinkHorizontalParam69);
    },
    quadraticCurveTo: function (
      sankeyLinkHorizontalParam56,
      sankeyLinkHorizontalParam57,
      sankeyLinkHorizontalParam58,
      sankeyLinkHorizontalParam59,
    ) {
      this._ +=
        "Q" +
        +sankeyLinkHorizontalParam56 +
        "," +
        +sankeyLinkHorizontalParam57 +
        "," +
        (this._x1 = +sankeyLinkHorizontalParam58) +
        "," +
        (this._y1 = +sankeyLinkHorizontalParam59);
    },
    bezierCurveTo: function (
      sankeyLinkHorizontalParam30,
      sankeyLinkHorizontalParam31,
      sankeyLinkHorizontalParam32,
      sankeyLinkHorizontalParam33,
      _sankeyLinkHorizontalA,
      _sankeyLinkHorizontalO,
    ) {
      this._ +=
        "C" +
        +sankeyLinkHorizontalParam30 +
        "," +
        +sankeyLinkHorizontalParam31 +
        "," +
        +sankeyLinkHorizontalParam32 +
        "," +
        +sankeyLinkHorizontalParam33 +
        "," +
        (this._x1 = +_sankeyLinkHorizontalA) +
        "," +
        (this._y1 = +_sankeyLinkHorizontalO);
    },
    arcTo: function (
      sankeyLinkHorizontalParam5,
      sankeyLinkHorizontalParam6,
      sankeyLinkHorizontalParam7,
      sankeyLinkHorizontalParam8,
      _sankeyLinkHorizontalA,
    ) {
      sankeyLinkHorizontalParam5 = +sankeyLinkHorizontalParam5;
      sankeyLinkHorizontalParam6 = +sankeyLinkHorizontalParam6;
      sankeyLinkHorizontalParam7 = +sankeyLinkHorizontalParam7;
      sankeyLinkHorizontalParam8 = +sankeyLinkHorizontalParam8;
      _sankeyLinkHorizontalA = +_sankeyLinkHorizontalA;
      var _sankeyLinkHorizontalO = this._x1,
        _sankeyLinkHorizontalI = this._y1,
        _sankeyLinkHorizontalR =
          sankeyLinkHorizontalParam7 - sankeyLinkHorizontalParam5,
        sankeyLinkHorizontalValue20 =
          sankeyLinkHorizontalParam8 - sankeyLinkHorizontalParam6,
        sankeyLinkHorizontalValue21 =
          _sankeyLinkHorizontalO - sankeyLinkHorizontalParam5,
        sankeyLinkHorizontalValue22 =
          _sankeyLinkHorizontalI - sankeyLinkHorizontalParam6,
        sankeyLinkHorizontalValue23 =
          sankeyLinkHorizontalValue21 * sankeyLinkHorizontalValue21 +
          sankeyLinkHorizontalValue22 * sankeyLinkHorizontalValue22;
      if (_sankeyLinkHorizontalA < 0)
        throw Error("negative radius: " + _sankeyLinkHorizontalA);
      if (this._x1 === null)
        this._ +=
          "M" +
          (this._x1 = sankeyLinkHorizontalParam5) +
          "," +
          (this._y1 = sankeyLinkHorizontalParam6);
      else if (sankeyLinkHorizontalValue23 > 1e-6)
        if (
          !(
            Math.abs(
              sankeyLinkHorizontalValue22 * _sankeyLinkHorizontalR -
                sankeyLinkHorizontalValue20 * sankeyLinkHorizontalValue21,
            ) > 1e-6
          ) ||
          !_sankeyLinkHorizontalA
        )
          this._ +=
            "L" +
            (this._x1 = sankeyLinkHorizontalParam5) +
            "," +
            (this._y1 = sankeyLinkHorizontalParam6);
        else {
          var sankeyLinkHorizontalValue24 =
              sankeyLinkHorizontalParam7 - _sankeyLinkHorizontalO,
            sankeyLinkHorizontalValue25 =
              sankeyLinkHorizontalParam8 - _sankeyLinkHorizontalI,
            sankeyLinkHorizontalValue26 =
              _sankeyLinkHorizontalR * _sankeyLinkHorizontalR +
              sankeyLinkHorizontalValue20 * sankeyLinkHorizontalValue20,
            sankeyLinkHorizontalValue27 =
              sankeyLinkHorizontalValue24 * sankeyLinkHorizontalValue24 +
              sankeyLinkHorizontalValue25 * sankeyLinkHorizontalValue25,
            sankeyLinkHorizontalValue28 = Math.sqrt(
              sankeyLinkHorizontalValue26,
            ),
            sankeyLinkHorizontalValue29 = Math.sqrt(
              sankeyLinkHorizontalValue23,
            ),
            _sankeyLinkHorizontalN =
              _sankeyLinkHorizontalA *
              Math.tan(
                (sankeyLinkHorizontalValue1 -
                  Math.acos(
                    (sankeyLinkHorizontalValue26 +
                      sankeyLinkHorizontalValue23 -
                      sankeyLinkHorizontalValue27) /
                      (2 *
                        sankeyLinkHorizontalValue28 *
                        sankeyLinkHorizontalValue29),
                  )) /
                  2,
              ),
            sankeyLinkHorizontalValue30 =
              _sankeyLinkHorizontalN / sankeyLinkHorizontalValue29,
            sankeyLinkHorizontalValue31 =
              _sankeyLinkHorizontalN / sankeyLinkHorizontalValue28;
          Math.abs(sankeyLinkHorizontalValue30 - 1) > 1e-6 &&
            (this._ +=
              "L" +
              (sankeyLinkHorizontalParam5 +
                sankeyLinkHorizontalValue30 * sankeyLinkHorizontalValue21) +
              "," +
              (sankeyLinkHorizontalParam6 +
                sankeyLinkHorizontalValue30 * sankeyLinkHorizontalValue22));
          this._ +=
            "A" +
            _sankeyLinkHorizontalA +
            "," +
            _sankeyLinkHorizontalA +
            ",0,0," +
            +(
              sankeyLinkHorizontalValue22 * sankeyLinkHorizontalValue24 >
              sankeyLinkHorizontalValue21 * sankeyLinkHorizontalValue25
            ) +
            "," +
            (this._x1 =
              sankeyLinkHorizontalParam5 +
              sankeyLinkHorizontalValue31 * _sankeyLinkHorizontalR) +
            "," +
            (this._y1 =
              sankeyLinkHorizontalParam6 +
              sankeyLinkHorizontalValue31 * sankeyLinkHorizontalValue20);
        }
    },
    arc: function (
      sankeyLinkHorizontalParam1,
      sankeyLinkHorizontalParam2,
      sankeyLinkHorizontalParam3,
      sankeyLinkHorizontalParam4,
      _sankeyLinkHorizontalA,
      _sankeyLinkHorizontalO,
    ) {
      sankeyLinkHorizontalParam1 = +sankeyLinkHorizontalParam1;
      sankeyLinkHorizontalParam2 = +sankeyLinkHorizontalParam2;
      sankeyLinkHorizontalParam3 = +sankeyLinkHorizontalParam3;
      _sankeyLinkHorizontalO = !!_sankeyLinkHorizontalO;
      var _sankeyLinkHorizontalI =
          sankeyLinkHorizontalParam3 * Math.cos(sankeyLinkHorizontalParam4),
        _sankeyLinkHorizontalR =
          sankeyLinkHorizontalParam3 * Math.sin(sankeyLinkHorizontalParam4),
        sankeyLinkHorizontalValue16 =
          sankeyLinkHorizontalParam1 + _sankeyLinkHorizontalI,
        sankeyLinkHorizontalValue17 =
          sankeyLinkHorizontalParam2 + _sankeyLinkHorizontalR,
        sankeyLinkHorizontalValue18 = 1 ^ _sankeyLinkHorizontalO,
        sankeyLinkHorizontalValue19 = _sankeyLinkHorizontalO
          ? sankeyLinkHorizontalParam4 - _sankeyLinkHorizontalA
          : _sankeyLinkHorizontalA - sankeyLinkHorizontalParam4;
      if (sankeyLinkHorizontalParam3 < 0)
        throw Error("negative radius: " + sankeyLinkHorizontalParam3);
      this._x1 === null
        ? (this._ +=
            "M" +
            sankeyLinkHorizontalValue16 +
            "," +
            sankeyLinkHorizontalValue17)
        : (Math.abs(this._x1 - sankeyLinkHorizontalValue16) > 1e-6 ||
            Math.abs(this._y1 - sankeyLinkHorizontalValue17) > 1e-6) &&
          (this._ +=
            "L" +
            sankeyLinkHorizontalValue16 +
            "," +
            sankeyLinkHorizontalValue17);
      sankeyLinkHorizontalParam3 &&
        (sankeyLinkHorizontalValue19 < 0 &&
          (sankeyLinkHorizontalValue19 =
            (sankeyLinkHorizontalValue19 % sankeyLinkHorizontalValue2) +
            sankeyLinkHorizontalValue2),
        sankeyLinkHorizontalValue19 > sankeyLinkHorizontalValue4
          ? (this._ +=
              "A" +
              sankeyLinkHorizontalParam3 +
              "," +
              sankeyLinkHorizontalParam3 +
              ",0,1," +
              sankeyLinkHorizontalValue18 +
              "," +
              (sankeyLinkHorizontalParam1 - _sankeyLinkHorizontalI) +
              "," +
              (sankeyLinkHorizontalParam2 - _sankeyLinkHorizontalR) +
              "A" +
              sankeyLinkHorizontalParam3 +
              "," +
              sankeyLinkHorizontalParam3 +
              ",0,1," +
              sankeyLinkHorizontalValue18 +
              "," +
              (this._x1 = sankeyLinkHorizontalValue16) +
              "," +
              (this._y1 = sankeyLinkHorizontalValue17))
          : sankeyLinkHorizontalValue19 > 1e-6 &&
            (this._ +=
              "A" +
              sankeyLinkHorizontalParam3 +
              "," +
              sankeyLinkHorizontalParam3 +
              ",0," +
              +(sankeyLinkHorizontalValue19 >= sankeyLinkHorizontalValue1) +
              "," +
              sankeyLinkHorizontalValue18 +
              "," +
              (this._x1 =
                sankeyLinkHorizontalParam1 +
                sankeyLinkHorizontalParam3 * Math.cos(_sankeyLinkHorizontalA)) +
              "," +
              (this._y1 =
                sankeyLinkHorizontalParam2 +
                sankeyLinkHorizontalParam3 *
                  Math.sin(_sankeyLinkHorizontalA))));
    },
    rect: function (
      sankeyLinkHorizontalParam26,
      sankeyLinkHorizontalParam27,
      sankeyLinkHorizontalParam28,
      sankeyLinkHorizontalParam29,
    ) {
      this._ +=
        "M" +
        (this._x0 = this._x1 = +sankeyLinkHorizontalParam26) +
        "," +
        (this._y0 = this._y1 = +sankeyLinkHorizontalParam27) +
        "h" +
        +sankeyLinkHorizontalParam28 +
        "v" +
        +sankeyLinkHorizontalParam29 +
        "h" +
        -sankeyLinkHorizontalParam28 +
        "Z";
    },
    toString: function () {
      return this._;
    },
  };
function sankeyLinkHorizontalHelper17(sankeyLinkHorizontalParam83) {
  return function () {
    return sankeyLinkHorizontalParam83;
  };
}
function sankeyLinkHorizontalHelper18(sankeyLinkHorizontalParam97) {
  return sankeyLinkHorizontalParam97[0];
}
function sankeyLinkHorizontalHelper19(sankeyLinkHorizontalParam98) {
  return sankeyLinkHorizontalParam98[1];
}
var sankeyLinkHorizontalValue5 = Array.prototype.slice;
function sankeyLinkHorizontalHelper20(sankeyLinkHorizontalParam91) {
  return sankeyLinkHorizontalParam91.source;
}
function sankeyLinkHorizontalHelper21(event) {
  return event.target;
}
function sankeyLinkHorizontalHelper22(sankeyLinkHorizontalParam9) {
  var sankeyLinkHorizontalValue32 = sankeyLinkHorizontalHelper20,
    sankeyLinkHorizontalValue33 = sankeyLinkHorizontalHelper21,
    sankeyLinkHorizontalValue34 = sankeyLinkHorizontalHelper18,
    _sankeyLinkHorizontalA = sankeyLinkHorizontalHelper19,
    _sankeyLinkHorizontalO = null;
  function _sankeyLinkHorizontalI() {
    var __sankeyLinkHorizontalI,
      _sankeyLinkHorizontalR = sankeyLinkHorizontalValue5.call(arguments),
      sankeyLinkHorizontalValue41 = sankeyLinkHorizontalValue32.apply(
        this,
        _sankeyLinkHorizontalR,
      ),
      sankeyLinkHorizontalValue42 = sankeyLinkHorizontalValue33.apply(
        this,
        _sankeyLinkHorizontalR,
      );
    if (
      ((_sankeyLinkHorizontalO ||= __sankeyLinkHorizontalI =
        sankeyLinkHorizontalHelper16()),
      sankeyLinkHorizontalParam9(
        _sankeyLinkHorizontalO,
        +sankeyLinkHorizontalValue34.apply(
          this,
          ((_sankeyLinkHorizontalR[0] = sankeyLinkHorizontalValue41),
          _sankeyLinkHorizontalR),
        ),
        +_sankeyLinkHorizontalA.apply(this, _sankeyLinkHorizontalR),
        +sankeyLinkHorizontalValue34.apply(
          this,
          ((_sankeyLinkHorizontalR[0] = sankeyLinkHorizontalValue42),
          _sankeyLinkHorizontalR),
        ),
        +_sankeyLinkHorizontalA.apply(this, _sankeyLinkHorizontalR),
      ),
      __sankeyLinkHorizontalI)
    )
      return (
        (_sankeyLinkHorizontalO = null),
        __sankeyLinkHorizontalI + "" || null
      );
  }
  return (
    (_sankeyLinkHorizontalI.source = function (sankeyLinkHorizontalParam78) {
      return arguments.length
        ? ((sankeyLinkHorizontalValue32 = sankeyLinkHorizontalParam78),
          _sankeyLinkHorizontalI)
        : sankeyLinkHorizontalValue32;
    }),
    (_sankeyLinkHorizontalI.target = function (sankeyLinkHorizontalParam79) {
      return arguments.length
        ? ((sankeyLinkHorizontalValue33 = sankeyLinkHorizontalParam79),
          _sankeyLinkHorizontalI)
        : sankeyLinkHorizontalValue33;
    }),
    (_sankeyLinkHorizontalI.x = function (sankeyLinkHorizontalParam50) {
      return arguments.length
        ? ((sankeyLinkHorizontalValue34 =
            typeof sankeyLinkHorizontalParam50 == "function"
              ? sankeyLinkHorizontalParam50
              : sankeyLinkHorizontalHelper17(+sankeyLinkHorizontalParam50)),
          _sankeyLinkHorizontalI)
        : sankeyLinkHorizontalValue34;
    }),
    (_sankeyLinkHorizontalI.y = function (sankeyLinkHorizontalParam51) {
      return arguments.length
        ? ((_sankeyLinkHorizontalA =
            typeof sankeyLinkHorizontalParam51 == "function"
              ? sankeyLinkHorizontalParam51
              : sankeyLinkHorizontalHelper17(+sankeyLinkHorizontalParam51)),
          _sankeyLinkHorizontalI)
        : _sankeyLinkHorizontalA;
    }),
    (_sankeyLinkHorizontalI.context = function (sankeyLinkHorizontalParam70) {
      return arguments.length
        ? ((_sankeyLinkHorizontalO = sankeyLinkHorizontalParam70 ?? null),
          _sankeyLinkHorizontalI)
        : _sankeyLinkHorizontalO;
    }),
    _sankeyLinkHorizontalI
  );
}
function sankeyLinkHorizontalHelper23(
  sankeyLinkHorizontalParam62,
  sankeyLinkHorizontalParam63,
  sankeyLinkHorizontalParam64,
  sankeyLinkHorizontalParam65,
  _sankeyLinkHorizontalA,
) {
  sankeyLinkHorizontalParam62.moveTo(
    sankeyLinkHorizontalParam63,
    sankeyLinkHorizontalParam64,
  );
  sankeyLinkHorizontalParam62.bezierCurveTo(
    (sankeyLinkHorizontalParam63 =
      (sankeyLinkHorizontalParam63 + sankeyLinkHorizontalParam65) / 2),
    sankeyLinkHorizontalParam64,
    sankeyLinkHorizontalParam63,
    _sankeyLinkHorizontalA,
    sankeyLinkHorizontalParam65,
    _sankeyLinkHorizontalA,
  );
}
function sankeyLinkHorizontalHelper24() {
  return sankeyLinkHorizontalHelper22(sankeyLinkHorizontalHelper23);
}
function sankeyLinkHorizontalHelper25(sankeyLinkHorizontalParam86) {
  return [
    sankeyLinkHorizontalParam86.source.x1,
    sankeyLinkHorizontalParam86.y0,
  ];
}
function sankeyLinkHorizontalHelper26(event) {
  return [event.target.x0, event.y1];
}
export function sankeyLinkHorizontalT() {
  return sankeyLinkHorizontalHelper24()
    .source(sankeyLinkHorizontalHelper25)
    .target(sankeyLinkHorizontalHelper26);
}
export { sankeyLinkHorizontalI };

// Aliases used by consumer checkpoints
export declare const sankeyLinkHorizontalA: any;
export declare const sankeyLinkHorizontalN: any;
export declare const sankeyLinkHorizontalO: any;
export declare const sankeyLinkHorizontalR: any;
export declare const sankeyLinkHorizontalT: any;
