// Restored from ref/webview/assets/lib-CqEvD6Nn.js
// Lib chunk restored from the Codex webview bundle.
import { chunkR } from "../../utils/esbuild-runtime-helpers";
var libValue1 = {};
function libY(libParam225, _libY) {
  let libValue273 = _libY || libValue1;
  return libHelper1(
    libParam225,
    typeof libValue273.includeImageAlt == "boolean"
      ? libValue273.includeImageAlt
      : true,
    typeof libValue273.includeHtml == "boolean"
      ? libValue273.includeHtml
      : true,
  );
}
function libHelper1(libParam172, libParam173, _libY) {
  if (libHelper3(libParam172)) {
    if ("value" in libParam172)
      return libParam172.type === "html" && !_libY ? "" : libParam172.value;
    if (libParam173 && "alt" in libParam172 && libParam172.alt)
      return libParam172.alt;
    if ("children" in libParam172)
      return libHelper2(libParam172.children, libParam173, _libY);
  }
  return Array.isArray(libParam172)
    ? libHelper2(libParam172, libParam173, _libY)
    : "";
}
function libHelper2(libParam312, libParam313, _libY) {
  let libValue298 = [],
    libValue299 = -1;
  for (; ++libValue299 < libParam312.length; )
    libValue298[libValue299] = libHelper1(
      libParam312[libValue299],
      libParam313,
      _libY,
    );
  return libValue298.join("");
}
function libHelper3(libParam418) {
  return !!(libParam418 && typeof libParam418 == "object");
}
var libValue2 = document.createElement("i");
function libHelper4(libParam249) {
  let libValue280 = "&" + libParam249 + ";";
  libValue2.innerHTML = libValue280;
  let _libY = libValue2.textContent;
  return (_libY.charCodeAt(_libY.length - 1) === 59 &&
    libParam249 !== "semi") ||
    _libY === libValue280
    ? false
    : _libY;
}
function libV(libParam114, libParam115, _libY, libParam116) {
  let libValue220 = libParam114.length,
    libValue221 = 0,
    libValue222;
  if (
    ((libParam115 =
      libParam115 < 0
        ? -libParam115 > libValue220
          ? 0
          : libValue220 + libParam115
        : libParam115 > libValue220
          ? libValue220
          : libParam115),
    (_libY = _libY > 0 ? _libY : 0),
    libParam116.length < 1e4)
  ) {
    libValue222 = Array.from(libParam116);
    libValue222.unshift(libParam115, _libY);
    libParam114.splice(...libValue222);
  } else
    for (
      _libY && libParam114.splice(libParam115, _libY);
      libValue221 < libParam116.length;
    ) {
      libValue222 = libParam116.slice(libValue221, libValue221 + 1e4);
      libValue222.unshift(libParam115, 0);
      libParam114.splice(...libValue222);
      libValue221 += 1e4;
      libParam115 += 1e4;
    }
}
function libHelper5(libParam377, libParam378) {
  return libParam377.length > 0
    ? (libV(libParam377, libParam377.length, 0, libParam378), libParam377)
    : libParam378;
}
var libValue3 = {}.hasOwnProperty;
function libUnderscore(libParam339) {
  let libValue326 = {},
    _libY = -1;
  for (; ++_libY < libParam339.length; )
    libHelper6(libValue326, libParam339[_libY]);
  return libValue326;
}
function libHelper6(libParam163, libParam164) {
  let _libY;
  for (_libY in libParam164) {
    let libValue261 =
        (libValue3.call(libParam163, _libY) ? libParam163[_libY] : undefined) ||
        (libParam163[_libY] = {}),
      libValue262 = libParam164[_libY],
      libValue263;
    if (libValue262)
      for (libValue263 in libValue262) {
        libValue3.call(libValue261, libValue263) ||
          (libValue261[libValue263] = []);
        let libValue296 = libValue262[libValue263];
        libHelper7(
          libValue261[libValue263],
          Array.isArray(libValue296)
            ? libValue296
            : libValue296
              ? [libValue296]
              : [],
        );
      }
  }
}
function libHelper7(libParam295, libParam296) {
  let _libY = -1,
    libValue294 = [];
  for (; ++_libY < libParam296.length; )
    (libParam296[_libY].add === "after" ? libParam295 : libValue294).push(
      libParam296[_libY],
    );
  libV(libParam295, 0, 0, libValue294);
}
function libHelper8(libParam153, libParam154) {
  let _libY = Number.parseInt(libParam153, libParam154);
  return _libY < 9 ||
    _libY === 11 ||
    (_libY > 13 && _libY < 32) ||
    (_libY > 126 && _libY < 160) ||
    (_libY > 55295 && _libY < 57344) ||
    (_libY > 64975 && _libY < 65008) ||
    (_libY & 65535) == 65535 ||
    (_libY & 65535) == 65534 ||
    _libY > 1114111
    ? "�"
    : String.fromCodePoint(_libY);
}
function libG(libParam301) {
  return libParam301
    .replace(/[\t\n\r ]+/g, " ")
    .replace(/^ | $/g, "")
    .toLowerCase()
    .toUpperCase();
}
var libC = libHelper9(/[A-Za-z]/),
  libL = libHelper9(/[\dA-Za-z]/),
  libValue4 = libHelper9(/[#-'*+\--9=?A-Z^-~]/);
function libU(libParam404) {
  return libParam404 !== null && (libParam404 < 32 || libParam404 === 127);
}
var libValue5 = libHelper9(/\d/),
  libValue6 = libHelper9(/[\dA-Fa-f]/),
  libValue7 = libHelper9(/[!-/:-@[-`{-~]/);
function libD(libParam437) {
  return libParam437 !== null && libParam437 < -2;
}
function libF(libParam410) {
  return libParam410 !== null && (libParam410 < 0 || libParam410 === 32);
}
function libP(libParam415) {
  return libParam415 === -2 || libParam415 === -1 || libParam415 === 32;
}
var libM = libHelper9(/\p{P}|\p{S}/u),
  libH = libHelper9(/\s/);
function libHelper9(libParam314) {
  return libHelper315;
  function libHelper315(libParam354) {
    return (
      libParam354 !== null &&
      libParam354 > -1 &&
      libParam314.test(String.fromCharCode(libParam354))
    );
  }
}
function libS(libParam185, libParam186, _libY, libParam187) {
  let libValue266 = libParam187 ? libParam187 - 1 : 1 / 0,
    libValue267 = 0;
  return libHelper308;
  function libHelper308(libParam400) {
    return libP(libParam400)
      ? (libParam185.enter(_libY), libHelper309(libParam400))
      : libParam186(libParam400);
  }
  function libHelper309(libParam353) {
    return libP(libParam353) && libValue267++ < libValue266
      ? (libParam185.consume(libParam353), libHelper309)
      : (libParam185.exit(_libY), libParam186(libParam353));
  }
}
var libValue8 = {
  tokenize: libHelper10,
};
function libHelper10(libParam75) {
  let libValue186 = libParam75.attempt(
      this.parser.constructs.contentInitial,
      libHelper254,
      libHelper255,
    ),
    _libY;
  return libValue186;
  function libHelper254(__libY) {
    if (__libY === null) {
      libParam75.consume(__libY);
      return;
    }
    return (
      libParam75.enter("lineEnding"),
      libParam75.consume(__libY),
      libParam75.exit("lineEnding"),
      libS(libParam75, libValue186, "linePrefix")
    );
  }
  function libHelper255(libParam416) {
    return (libParam75.enter("paragraph"), libHelper256(libParam416));
  }
  function libHelper256(libParam289) {
    let libValue289 = libParam75.enter("chunkText", {
      contentType: "text",
      previous: _libY,
    });
    return (
      _libY && (_libY.next = libValue289),
      (_libY = libValue289),
      libHelper257(libParam289)
    );
  }
  function libHelper257(libParam212) {
    if (libParam212 === null) {
      libParam75.exit("chunkText");
      libParam75.exit("paragraph");
      libParam75.consume(libParam212);
      return;
    }
    return libD(libParam212)
      ? (libParam75.consume(libParam212),
        libParam75.exit("chunkText"),
        libHelper256)
      : (libParam75.consume(libParam212), libHelper257);
  }
}
var libValue9 = {
    tokenize: libHelper11,
  },
  libValue10 = {
    tokenize: libHelper12,
  };
function libHelper11(libParam8) {
  let libValue79 = this,
    _libY = [],
    libValue80 = 0,
    libValue81,
    libValue82,
    libValue83;
  return libHelper175;
  function libHelper175(libParam261) {
    if (libValue80 < _libY.length) {
      let libValue304 = _libY[libValue80];
      return (
        (libValue79.containerState = libValue304[1]),
        libParam8.attempt(
          libValue304[0].continuation,
          libHelper176,
          libHelper177,
        )(libParam261)
      );
    }
    return libHelper177(libParam261);
  }
  function libHelper176(libParam89) {
    if ((libValue80++, libValue79.containerState._closeFlow)) {
      libValue79.containerState._closeFlow = undefined;
      libValue81 && _libU();
      let __libY = libValue79.events.length,
        libValue210 = __libY,
        libValue211;
      for (; libValue210--; )
        if (
          libValue79.events[libValue210][0] === "exit" &&
          libValue79.events[libValue210][1].type === "chunkFlow"
        ) {
          libValue211 = libValue79.events[libValue210][1].end;
          break;
        }
      libHelper181(libValue80);
      let libValue212 = __libY;
      for (; libValue212 < libValue79.events.length; ) {
        libValue79.events[libValue212][1].end = {
          ...libValue211,
        };
        libValue212++;
      }
      return (
        libV(
          libValue79.events,
          libValue210 + 1,
          0,
          libValue79.events.slice(__libY),
        ),
        (libValue79.events.length = libValue212),
        libHelper177(libParam89)
      );
    }
    return libHelper175(libParam89);
  }
  function libHelper177(libParam162) {
    if (libValue80 === _libY.length) {
      if (!libValue81) return libHelper179(libParam162);
      if (libValue81.currentConstruct && libValue81.currentConstruct.concrete)
        return _libG(libParam162);
      libValue79.interrupt = !!(
        libValue81.currentConstruct && !libValue81._gfmTableDynamicInterruptHack
      );
    }
    return (
      (libValue79.containerState = {}),
      libParam8.check(libValue10, _libUnderscore, libHelper178)(libParam162)
    );
  }
  function _libUnderscore(libParam424) {
    return (
      libValue81 && _libU(),
      libHelper181(libValue80),
      libHelper179(libParam424)
    );
  }
  function libHelper178(libParam297) {
    return (
      (libValue79.parser.lazy[libValue79.now().line] =
        libValue80 !== _libY.length),
      (libValue83 = libValue79.now().offset),
      _libG(libParam297)
    );
  }
  function libHelper179(__libY) {
    return (
      (libValue79.containerState = {}),
      libParam8.attempt(libValue10, libHelper180, _libG)(__libY)
    );
  }
  function libHelper180(libParam345) {
    return (
      libValue80++,
      _libY.push([libValue79.currentConstruct, libValue79.containerState]),
      libHelper179(libParam345)
    );
  }
  function _libG(__libY) {
    if (__libY === null) {
      libValue81 && _libU();
      libHelper181(0);
      libParam8.consume(__libY);
      return;
    }
    return (
      (libValue81 ||= libValue79.parser.flow(libValue79.now())),
      libParam8.enter("chunkFlow", {
        _tokenizer: libValue81,
        contentType: "flow",
        previous: libValue82,
      }),
      _libC(__libY)
    );
  }
  function _libC(__libY) {
    if (__libY === null) {
      _libL(libParam8.exit("chunkFlow"), true);
      libHelper181(0);
      libParam8.consume(__libY);
      return;
    }
    return libD(__libY)
      ? (libParam8.consume(__libY),
        _libL(libParam8.exit("chunkFlow")),
        (libValue80 = 0),
        (libValue79.interrupt = undefined),
        libHelper175)
      : (libParam8.consume(__libY), _libC);
  }
  function _libL(libParam65, __libY) {
    let libValue174 = libValue79.sliceStream(libParam65);
    if (
      (__libY && libValue174.push(null),
      (libParam65.previous = libValue82),
      libValue82 && (libValue82.next = libParam65),
      (libValue82 = libParam65),
      libValue81.defineSkip(libParam65.start),
      libValue81.write(libValue174),
      libValue79.parser.lazy[libParam65.start.line])
    ) {
      let libValue194 = libValue81.events.length;
      for (; libValue194--; )
        if (
          libValue81.events[libValue194][1].start.offset < libValue83 &&
          (!libValue81.events[libValue194][1].end ||
            libValue81.events[libValue194][1].end.offset > libValue83)
        )
          return;
      let ___libY = libValue79.events.length,
        libValue195 = ___libY,
        libValue196,
        libValue197;
      for (; libValue195--; )
        if (
          libValue79.events[libValue195][0] === "exit" &&
          libValue79.events[libValue195][1].type === "chunkFlow"
        ) {
          if (libValue196) {
            libValue197 = libValue79.events[libValue195][1].end;
            break;
          }
          libValue196 = true;
        }
      for (
        libHelper181(libValue80), libValue194 = ___libY;
        libValue194 < libValue79.events.length;
      ) {
        libValue79.events[libValue194][1].end = {
          ...libValue197,
        };
        libValue194++;
      }
      libV(
        libValue79.events,
        libValue195 + 1,
        0,
        libValue79.events.slice(___libY),
      );
      libValue79.events.length = libValue194;
    }
  }
  function libHelper181(libParam263) {
    let libValue284 = _libY.length;
    for (; libValue284-- > libParam263; ) {
      let libValue332 = _libY[libValue284];
      libValue79.containerState = libValue332[1];
      libValue332[0].exit.call(libValue79, libParam8);
    }
    _libY.length = libParam263;
  }
  function _libU() {
    libValue81.write([null]);
    libValue82 = undefined;
    libValue81 = undefined;
    libValue79.containerState._closeFlow = undefined;
  }
}
function libHelper12(libParam216, libParam217, _libY) {
  return libS(
    libParam216,
    libParam216.attempt(this.parser.constructs.document, libParam217, _libY),
    "linePrefix",
    this.parser.constructs.disable.null.includes("codeIndented")
      ? undefined
      : 4,
  );
}
function libO(libParam363) {
  if (libParam363 === null || libF(libParam363) || libH(libParam363)) return 1;
  if (libM(libParam363)) return 2;
}
function libA(libParam245, libParam246, _libY) {
  let libValue278 = [],
    libValue279 = -1;
  for (; ++libValue279 < libParam245.length; ) {
    let libValue329 = libParam245[libValue279].resolveAll;
    libValue329 &&
      !libValue278.includes(libValue329) &&
      ((libParam246 = libValue329(libParam246, _libY)),
      libValue278.push(libValue329));
  }
  return libParam246;
}
var libValue11 = {
  name: "attention",
  resolveAll: libHelper13,
  tokenize: libHelper14,
};
function libHelper13(libParam11, libParam12) {
  let _libY = -1,
    libValue89,
    libValue90,
    libValue91,
    libValue92,
    libValue93,
    libValue94,
    _libUnderscore,
    libValue95;
  for (; ++_libY < libParam11.length; )
    if (
      libParam11[_libY][0] === "enter" &&
      libParam11[_libY][1].type === "attentionSequence" &&
      libParam11[_libY][1]._close
    ) {
      for (libValue89 = _libY; libValue89--; )
        if (
          libParam11[libValue89][0] === "exit" &&
          libParam11[libValue89][1].type === "attentionSequence" &&
          libParam11[libValue89][1]._open &&
          libParam12.sliceSerialize(libParam11[libValue89][1]).charCodeAt(0) ===
            libParam12.sliceSerialize(libParam11[_libY][1]).charCodeAt(0)
        ) {
          if (
            (libParam11[libValue89][1]._close || libParam11[_libY][1]._open) &&
            (libParam11[_libY][1].end.offset -
              libParam11[_libY][1].start.offset) %
              3 &&
            !(
              (libParam11[libValue89][1].end.offset -
                libParam11[libValue89][1].start.offset +
                libParam11[_libY][1].end.offset -
                libParam11[_libY][1].start.offset) %
              3
            )
          )
            continue;
          libValue94 =
            libParam11[libValue89][1].end.offset -
              libParam11[libValue89][1].start.offset >
              1 &&
            libParam11[_libY][1].end.offset -
              libParam11[_libY][1].start.offset >
              1
              ? 2
              : 1;
          let libValue96 = {
              ...libParam11[libValue89][1].end,
            },
            libValue97 = {
              ...libParam11[_libY][1].start,
            };
          libHelper15(libValue96, -libValue94);
          libHelper15(libValue97, libValue94);
          libValue92 = {
            type: libValue94 > 1 ? "strongSequence" : "emphasisSequence",
            start: libValue96,
            end: {
              ...libParam11[libValue89][1].end,
            },
          };
          libValue93 = {
            type: libValue94 > 1 ? "strongSequence" : "emphasisSequence",
            start: {
              ...libParam11[_libY][1].start,
            },
            end: libValue97,
          };
          libValue91 = {
            type: libValue94 > 1 ? "strongText" : "emphasisText",
            start: {
              ...libParam11[libValue89][1].end,
            },
            end: {
              ...libParam11[_libY][1].start,
            },
          };
          libValue90 = {
            type: libValue94 > 1 ? "strong" : "emphasis",
            start: {
              ...libValue92.start,
            },
            end: {
              ...libValue93.end,
            },
          };
          libParam11[libValue89][1].end = {
            ...libValue92.start,
          };
          libParam11[_libY][1].start = {
            ...libValue93.end,
          };
          _libUnderscore = [];
          libParam11[libValue89][1].end.offset -
            libParam11[libValue89][1].start.offset &&
            (_libUnderscore = libHelper5(_libUnderscore, [
              ["enter", libParam11[libValue89][1], libParam12],
              ["exit", libParam11[libValue89][1], libParam12],
            ]));
          _libUnderscore = libHelper5(_libUnderscore, [
            ["enter", libValue90, libParam12],
            ["enter", libValue92, libParam12],
            ["exit", libValue92, libParam12],
            ["enter", libValue91, libParam12],
          ]);
          _libUnderscore = libHelper5(
            _libUnderscore,
            libA(
              libParam12.parser.constructs.insideSpan.null,
              libParam11.slice(libValue89 + 1, _libY),
              libParam12,
            ),
          );
          _libUnderscore = libHelper5(_libUnderscore, [
            ["exit", libValue91, libParam12],
            ["enter", libValue93, libParam12],
            ["exit", libValue93, libParam12],
            ["exit", libValue90, libParam12],
          ]);
          libParam11[_libY][1].end.offset - libParam11[_libY][1].start.offset
            ? ((libValue95 = 2),
              (_libUnderscore = libHelper5(_libUnderscore, [
                ["enter", libParam11[_libY][1], libParam12],
                ["exit", libParam11[_libY][1], libParam12],
              ])))
            : (libValue95 = 0);
          libV(
            libParam11,
            libValue89 - 1,
            _libY - libValue89 + 3,
            _libUnderscore,
          );
          _libY = libValue89 + _libUnderscore.length - libValue95 - 2;
          break;
        }
    }
  for (_libY = -1; ++_libY < libParam11.length; )
    libParam11[_libY][1].type === "attentionSequence" &&
      (libParam11[_libY][1].type = "data");
  return libParam11;
}
function libHelper14(libParam92, libParam93) {
  let _libY = this.parser.constructs.attentionMarkers.null,
    libValue204 = this.previous,
    libValue205 = libO(libValue204),
    libValue206;
  return libHelper273;
  function libHelper273(libParam372) {
    return (
      (libValue206 = libParam372),
      libParam92.enter("attentionSequence"),
      libHelper274(libParam372)
    );
  }
  function libHelper274(libParam136) {
    if (libParam136 === libValue206)
      return (libParam92.consume(libParam136), libHelper274);
    let _libV = libParam92.exit("attentionSequence"),
      libValue232 = libO(libParam136),
      libValue233 =
        !libValue232 ||
        (libValue232 === 2 && libValue205) ||
        _libY.includes(libParam136),
      _libUnderscore =
        !libValue205 ||
        (libValue205 === 2 && libValue232) ||
        _libY.includes(libValue204);
    return (
      (_libV._open = !!(libValue206 === 42
        ? libValue233
        : libValue233 && (libValue205 || !_libUnderscore))),
      (_libV._close = !!(libValue206 === 42
        ? _libUnderscore
        : _libUnderscore && (libValue232 || !libValue233))),
      libParam93(libParam136)
    );
  }
}
function libHelper15(libParam365, libParam366) {
  libParam365.column += libParam366;
  libParam365.offset += libParam366;
  libParam365._bufferIndex += libParam366;
}
var libValue12 = {
  name: "autolink",
  tokenize: libHelper16,
};
function libHelper16(libParam17, libParam18, _libY) {
  let libValue109 = 0;
  return libHelper194;
  function libHelper194(libParam222) {
    return (
      libParam17.enter("autolink"),
      libParam17.enter("autolinkMarker"),
      libParam17.consume(libParam222),
      libParam17.exit("autolinkMarker"),
      libParam17.enter("autolinkProtocol"),
      libHelper195
    );
  }
  function libHelper195(libParam367) {
    return libC(libParam367)
      ? (libParam17.consume(libParam367), libHelper196)
      : libParam367 === 64
        ? _libY(libParam367)
        : libHelper198(libParam367);
  }
  function libHelper196(libParam331) {
    return libParam331 === 43 ||
      libParam331 === 45 ||
      libParam331 === 46 ||
      libL(libParam331)
      ? ((libValue109 = 1), libHelper197(libParam331))
      : libHelper198(libParam331);
  }
  function libHelper197(libParam224) {
    return libParam224 === 58
      ? (libParam17.consume(libParam224), (libValue109 = 0), _libV)
      : (libParam224 === 43 ||
            libParam224 === 45 ||
            libParam224 === 46 ||
            libL(libParam224)) &&
          libValue109++ < 32
        ? (libParam17.consume(libParam224), libHelper197)
        : ((libValue109 = 0), libHelper198(libParam224));
  }
  function _libV(libParam158) {
    return libParam158 === 62
      ? (libParam17.exit("autolinkProtocol"),
        libParam17.enter("autolinkMarker"),
        libParam17.consume(libParam158),
        libParam17.exit("autolinkMarker"),
        libParam17.exit("autolink"),
        libParam18)
      : libParam158 === null ||
          libParam158 === 32 ||
          libParam158 === 60 ||
          libU(libParam158)
        ? _libY(libParam158)
        : (libParam17.consume(libParam158), _libV);
  }
  function libHelper198(libParam340) {
    return libParam340 === 64
      ? (libParam17.consume(libParam340), libHelper199)
      : libValue4(libParam340)
        ? (libParam17.consume(libParam340), libHelper198)
        : _libY(libParam340);
  }
  function libHelper199(libParam435) {
    return libL(libParam435) ? _libUnderscore(libParam435) : _libY(libParam435);
  }
  function _libUnderscore(__libY) {
    return __libY === 46
      ? (libParam17.consume(__libY), (libValue109 = 0), libHelper199)
      : __libY === 62
        ? ((libParam17.exit("autolinkProtocol").type = "autolinkEmail"),
          libParam17.enter("autolinkMarker"),
          libParam17.consume(__libY),
          libParam17.exit("autolinkMarker"),
          libParam17.exit("autolink"),
          libParam18)
        : libHelper200(__libY);
  }
  function libHelper200(libParam277) {
    if ((libParam277 === 45 || libL(libParam277)) && libValue109++ < 63) {
      let __libY = libParam277 === 45 ? libHelper200 : _libUnderscore;
      return (libParam17.consume(libParam277), __libY);
    }
    return _libY(libParam277);
  }
}
var libI = {
  partial: true,
  tokenize: libHelper17,
};
function libHelper17(libParam250, libParam251, _libY) {
  return libHelper313;
  function libHelper313(libParam386) {
    return libP(libParam386)
      ? libS(libParam250, libHelper314, "linePrefix")(libParam386)
      : libHelper314(libParam386);
  }
  function libHelper314(libParam401) {
    return libParam401 === null || libD(libParam401)
      ? libParam251(libParam401)
      : _libY(libParam401);
  }
}
var libValue13 = {
  continuation: {
    tokenize: libHelper19,
  },
  exit: libHelper20,
  name: "blockQuote",
  tokenize: libHelper18,
};
function libHelper18(libParam82, libParam83, _libY) {
  let libValue199 = this;
  return libHelper265;
  function libHelper265(libParam142) {
    if (libParam142 === 62) {
      let __libY = libValue199.containerState;
      return (
        (__libY.open ||=
          (libParam82.enter("blockQuote", {
            _container: true,
          }),
          true)),
        libParam82.enter("blockQuotePrefix"),
        libParam82.enter("blockQuoteMarker"),
        libParam82.consume(libParam142),
        libParam82.exit("blockQuoteMarker"),
        libHelper266
      );
    }
    return _libY(libParam142);
  }
  function libHelper266(__libY) {
    return libP(__libY)
      ? (libParam82.enter("blockQuotePrefixWhitespace"),
        libParam82.consume(__libY),
        libParam82.exit("blockQuotePrefixWhitespace"),
        libParam82.exit("blockQuotePrefix"),
        libParam83)
      : (libParam82.exit("blockQuotePrefix"), libParam83(__libY));
  }
}
function libHelper19(libParam139, libParam140, _libY) {
  let libValue236 = this;
  return libHelper297;
  function libHelper297(libParam194) {
    return libP(libParam194)
      ? libS(
          libParam139,
          libHelper298,
          "linePrefix",
          libValue236.parser.constructs.disable.null.includes("codeIndented")
            ? undefined
            : 4,
        )(libParam194)
      : libHelper298(libParam194);
  }
  function libHelper298(libParam425) {
    return libParam139.attempt(libValue13, libParam140, _libY)(libParam425);
  }
}
function libHelper20(libParam442) {
  libParam442.exit("blockQuote");
}
var libValue14 = {
  name: "characterEscape",
  tokenize: libHelper21,
};
function libHelper21(libParam119, libParam120, _libY) {
  return libHelper287;
  function libHelper287(libParam268) {
    return (
      libParam119.enter("characterEscape"),
      libParam119.enter("escapeMarker"),
      libParam119.consume(libParam268),
      libParam119.exit("escapeMarker"),
      libHelper288
    );
  }
  function libHelper288(libParam214) {
    return libValue7(libParam214)
      ? (libParam119.enter("characterEscapeValue"),
        libParam119.consume(libParam214),
        libParam119.exit("characterEscapeValue"),
        libParam119.exit("characterEscape"),
        libParam120)
      : _libY(libParam214);
  }
}
var libValue15 = {
  name: "characterReference",
  tokenize: libHelper22,
};
function libHelper22(libParam33, libParam34, _libY) {
  let libValue140 = this,
    libValue141 = 0,
    libValue142,
    libValue143;
  return _libV;
  function _libV(libParam227) {
    return (
      libParam33.enter("characterReference"),
      libParam33.enter("characterReferenceMarker"),
      libParam33.consume(libParam227),
      libParam33.exit("characterReferenceMarker"),
      libHelper205
    );
  }
  function libHelper205(libParam177) {
    return libParam177 === 35
      ? (libParam33.enter("characterReferenceMarkerNumeric"),
        libParam33.consume(libParam177),
        libParam33.exit("characterReferenceMarkerNumeric"),
        libHelper206)
      : (libParam33.enter("characterReferenceValue"),
        (libValue142 = 31),
        (libValue143 = libL),
        _libUnderscore(libParam177));
  }
  function libHelper206(libParam138) {
    return libParam138 === 88 || libParam138 === 120
      ? (libParam33.enter("characterReferenceMarkerHexadecimal"),
        libParam33.consume(libParam138),
        libParam33.exit("characterReferenceMarkerHexadecimal"),
        libParam33.enter("characterReferenceValue"),
        (libValue142 = 6),
        (libValue143 = libValue6),
        _libUnderscore)
      : (libParam33.enter("characterReferenceValue"),
        (libValue142 = 7),
        (libValue143 = libValue5),
        _libUnderscore(libParam138));
  }
  function _libUnderscore(__libV) {
    if (__libV === 59 && libValue141) {
      let libValue252 = libParam33.exit("characterReferenceValue");
      return libValue143 === libL &&
        !libHelper4(libValue140.sliceSerialize(libValue252))
        ? _libY(__libV)
        : (libParam33.enter("characterReferenceMarker"),
          libParam33.consume(__libV),
          libParam33.exit("characterReferenceMarker"),
          libParam33.exit("characterReference"),
          libParam34);
    }
    return libValue143(__libV) && libValue141++ < libValue142
      ? (libParam33.consume(__libV), _libUnderscore)
      : _libY(__libV);
  }
}
var libValue16 = {
    partial: true,
    tokenize: libHelper24,
  },
  libValue17 = {
    concrete: true,
    name: "codeFenced",
    tokenize: libHelper23,
  };
function libHelper23(libParam9, libParam10, _libY) {
  let libValue84 = this,
    libValue85 = {
      partial: true,
      tokenize: libHelper189,
    },
    libValue86 = 0,
    libValue87 = 0,
    libValue88;
  return _libV;
  function _libV(libParam449) {
    return libHelper182(libParam449);
  }
  function libHelper182(libParam143) {
    let __libY = libValue84.events[libValue84.events.length - 1];
    return (
      (libValue86 =
        __libY && __libY[1].type === "linePrefix"
          ? __libY[2].sliceSerialize(__libY[1], true).length
          : 0),
      (libValue88 = libParam143),
      libParam9.enter("codeFenced"),
      libParam9.enter("codeFencedFence"),
      libParam9.enter("codeFencedFenceSequence"),
      libHelper183(libParam143)
    );
  }
  function libHelper183(libParam221) {
    return libParam221 === libValue88
      ? (libValue87++, libParam9.consume(libParam221), libHelper183)
      : libValue87 < 3
        ? _libY(libParam221)
        : (libParam9.exit("codeFencedFenceSequence"),
          libP(libParam221)
            ? libS(libParam9, _libUnderscore, "whitespace")(libParam221)
            : _libUnderscore(libParam221));
  }
  function _libUnderscore(__libY) {
    return __libY === null || libD(__libY)
      ? (libParam9.exit("codeFencedFence"),
        libValue84.interrupt
          ? libParam10(__libY)
          : libParam9.check(libValue16, _libG, libHelper188)(__libY))
      : (libParam9.enter("codeFencedFenceInfo"),
        libParam9.enter("chunkString", {
          contentType: "string",
        }),
        libHelper184(__libY));
  }
  function libHelper184(libParam150) {
    return libParam150 === null || libD(libParam150)
      ? (libParam9.exit("chunkString"),
        libParam9.exit("codeFencedFenceInfo"),
        _libUnderscore(libParam150))
      : libP(libParam150)
        ? (libParam9.exit("chunkString"),
          libParam9.exit("codeFencedFenceInfo"),
          libS(libParam9, libHelper185, "whitespace")(libParam150))
        : libParam150 === 96 && libParam150 === libValue88
          ? _libY(libParam150)
          : (libParam9.consume(libParam150), libHelper184);
  }
  function libHelper185(libParam247) {
    return libParam247 === null || libD(libParam247)
      ? _libUnderscore(libParam247)
      : (libParam9.enter("codeFencedFenceMeta"),
        libParam9.enter("chunkString", {
          contentType: "string",
        }),
        libHelper186(libParam247));
  }
  function libHelper186(libParam226) {
    return libParam226 === null || libD(libParam226)
      ? (libParam9.exit("chunkString"),
        libParam9.exit("codeFencedFenceMeta"),
        _libUnderscore(libParam226))
      : libParam226 === 96 && libParam226 === libValue88
        ? _libY(libParam226)
        : (libParam9.consume(libParam226), libHelper186);
  }
  function _libG(libParam432) {
    return libParam9.attempt(libValue85, libHelper188, _libC)(libParam432);
  }
  function _libC(libParam341) {
    return (
      libParam9.enter("lineEnding"),
      libParam9.consume(libParam341),
      libParam9.exit("lineEnding"),
      _libL
    );
  }
  function _libL(libParam355) {
    return libValue86 > 0 && libP(libParam355)
      ? libS(libParam9, libHelper187, "linePrefix", libValue86 + 1)(libParam355)
      : libHelper187(libParam355);
  }
  function libHelper187(libParam309) {
    return libParam309 === null || libD(libParam309)
      ? libParam9.check(libValue16, _libG, libHelper188)(libParam309)
      : (libParam9.enter("codeFlowValue"), _libU(libParam309));
  }
  function _libU(libParam317) {
    return libParam317 === null || libD(libParam317)
      ? (libParam9.exit("codeFlowValue"), libHelper187(libParam317))
      : (libParam9.consume(libParam317), _libU);
  }
  function libHelper188(__libY) {
    return (libParam9.exit("codeFenced"), libParam10(__libY));
  }
  function libHelper189(libParam63, libParam64, __libY) {
    let libValue173 = 0;
    return libHelper240;
    function libHelper240(libParam330) {
      return (
        libParam63.enter("lineEnding"),
        libParam63.consume(libParam330),
        libParam63.exit("lineEnding"),
        __libV
      );
    }
    function __libV(libParam148) {
      return (
        libParam63.enter("codeFencedFence"),
        libP(libParam148)
          ? libS(
              libParam63,
              libHelper241,
              "linePrefix",
              libValue84.parser.constructs.disable.null.includes("codeIndented")
                ? undefined
                : 4,
            )(libParam148)
          : libHelper241(libParam148)
      );
    }
    function libHelper241(libParam335) {
      return libParam335 === libValue88
        ? (libParam63.enter("codeFencedFenceSequence"),
          libHelper242(libParam335))
        : __libY(libParam335);
    }
    function libHelper242(libParam207) {
      return libParam207 === libValue88
        ? (libValue173++, libParam63.consume(libParam207), libHelper242)
        : libValue173 >= libValue87
          ? (libParam63.exit("codeFencedFenceSequence"),
            libP(libParam207)
              ? libS(libParam63, __libUnderscore, "whitespace")(libParam207)
              : __libUnderscore(libParam207))
          : __libY(libParam207);
    }
    function __libUnderscore(libParam332) {
      return libParam332 === null || libD(libParam332)
        ? (libParam63.exit("codeFencedFence"), libParam64(libParam332))
        : __libY(libParam332);
    }
  }
}
function libHelper24(libParam169, libParam170, _libY) {
  let libValue256 = this;
  return libHelper303;
  function libHelper303(libParam302) {
    return libParam302 === null
      ? _libY(libParam302)
      : (libParam169.enter("lineEnding"),
        libParam169.consume(libParam302),
        libParam169.exit("lineEnding"),
        libHelper304);
  }
  function libHelper304(libParam382) {
    return libValue256.parser.lazy[libValue256.now().line]
      ? _libY(libParam382)
      : libParam170(libParam382);
  }
}
var libValue18 = {
    name: "codeIndented",
    tokenize: libHelper25,
  },
  libValue19 = {
    partial: true,
    tokenize: libHelper26,
  };
function libHelper25(libParam80, libParam81, _libY) {
  let libValue193 = this;
  return libHelper261;
  function libHelper261(libParam356) {
    return (
      libParam80.enter("codeIndented"),
      libS(libParam80, libHelper262, "linePrefix", 5)(libParam356)
    );
  }
  function libHelper262(libParam228) {
    let libValue274 = libValue193.events[libValue193.events.length - 1];
    return libValue274 &&
      libValue274[1].type === "linePrefix" &&
      libValue274[2].sliceSerialize(libValue274[1], true).length >= 4
      ? libHelper263(libParam228)
      : _libY(libParam228);
  }
  function libHelper263(libParam281) {
    return libParam281 === null
      ? _libV(libParam281)
      : libD(libParam281)
        ? libParam80.attempt(libValue19, libHelper263, _libV)(libParam281)
        : (libParam80.enter("codeFlowValue"), libHelper264(libParam281));
  }
  function libHelper264(libParam318) {
    return libParam318 === null || libD(libParam318)
      ? (libParam80.exit("codeFlowValue"), libHelper263(libParam318))
      : (libParam80.consume(libParam318), libHelper264);
  }
  function _libV(__libY) {
    return (libParam80.exit("codeIndented"), libParam81(__libY));
  }
}
function libHelper26(libParam105, libParam106, _libY) {
  let libValue215 = this;
  return libHelper281;
  function libHelper281(libParam220) {
    return libValue215.parser.lazy[libValue215.now().line]
      ? _libY(libParam220)
      : libD(libParam220)
        ? (libParam105.enter("lineEnding"),
          libParam105.consume(libParam220),
          libParam105.exit("lineEnding"),
          libHelper281)
        : libS(libParam105, libHelper282, "linePrefix", 5)(libParam220);
  }
  function libHelper282(libParam202) {
    let libValue268 = libValue215.events[libValue215.events.length - 1];
    return libValue268 &&
      libValue268[1].type === "linePrefix" &&
      libValue268[2].sliceSerialize(libValue268[1], true).length >= 4
      ? libParam106(libParam202)
      : libD(libParam202)
        ? libHelper281(libParam202)
        : _libY(libParam202);
  }
}
var libValue20 = {
  name: "codeText",
  previous: libHelper28,
  resolve: libHelper27,
  tokenize: _e,
};
function libHelper27(libParam66) {
  let libValue175 = libParam66.length - 4,
    _libY = 3,
    libValue176,
    libValue177;
  if (
    (libParam66[_libY][1].type === "lineEnding" ||
      libParam66[_libY][1].type === "space") &&
    (libParam66[libValue175][1].type === "lineEnding" ||
      libParam66[libValue175][1].type === "space")
  ) {
    for (libValue176 = _libY; ++libValue176 < libValue175; )
      if (libParam66[libValue176][1].type === "codeTextData") {
        libParam66[_libY][1].type = "codeTextPadding";
        libParam66[libValue175][1].type = "codeTextPadding";
        _libY += 2;
        libValue175 -= 2;
        break;
      }
  }
  for (libValue176 = _libY - 1, libValue175++; ++libValue176 <= libValue175; )
    libValue177 === undefined
      ? libValue176 !== libValue175 &&
        libParam66[libValue176][1].type !== "lineEnding" &&
        (libValue177 = libValue176)
      : (libValue176 === libValue175 ||
          libParam66[libValue176][1].type === "lineEnding") &&
        ((libParam66[libValue177][1].type = "codeTextData"),
        libValue176 !== libValue177 + 2 &&
          ((libParam66[libValue177][1].end =
            libParam66[libValue176 - 1][1].end),
          libParam66.splice(libValue177 + 2, libValue176 - libValue177 - 2),
          (libValue175 -= libValue176 - libValue177 - 2),
          (libValue176 = libValue177 + 2)),
        (libValue177 = undefined));
  return libParam66;
}
function libHelper28(libParam310) {
  return (
    libParam310 !== 96 ||
    this.events[this.events.length - 1][1].type === "characterEscape"
  );
}
function _e(libParam49, libParam50, _libY) {
  let libValue165 = 0,
    libValue166,
    libValue167;
  return libHelper227;
  function libHelper227(libParam350) {
    return (
      libParam49.enter("codeText"),
      libParam49.enter("codeTextSequence"),
      libHelper228(libParam350)
    );
  }
  function libHelper228(libParam323) {
    return libParam323 === 96
      ? (libParam49.consume(libParam323), libValue165++, libHelper228)
      : (libParam49.exit("codeTextSequence"), _libV(libParam323));
  }
  function _libV(libParam133) {
    return libParam133 === null
      ? _libY(libParam133)
      : libParam133 === 32
        ? (libParam49.enter("space"),
          libParam49.consume(libParam133),
          libParam49.exit("space"),
          _libV)
        : libParam133 === 96
          ? ((libValue167 = libParam49.enter("codeTextSequence")),
            (libValue166 = 0),
            libHelper230(libParam133))
          : libD(libParam133)
            ? (libParam49.enter("lineEnding"),
              libParam49.consume(libParam133),
              libParam49.exit("lineEnding"),
              _libV)
            : (libParam49.enter("codeTextData"), libHelper229(libParam133));
  }
  function libHelper229(libParam288) {
    return libParam288 === null ||
      libParam288 === 32 ||
      libParam288 === 96 ||
      libD(libParam288)
      ? (libParam49.exit("codeTextData"), _libV(libParam288))
      : (libParam49.consume(libParam288), libHelper229);
  }
  function libHelper230(__libY) {
    return __libY === 96
      ? (libParam49.consume(__libY), libValue166++, libHelper230)
      : libValue166 === libValue165
        ? (libParam49.exit("codeTextSequence"),
          libParam49.exit("codeText"),
          libParam50(__libY))
        : ((libValue167.type = "codeTextData"), libHelper229(__libY));
  }
}
var libValue21 = class {
  constructor(libParam375) {
    this.left = libParam375 ? [...libParam375] : [];
    this.right = [];
  }
  get(libParam127) {
    if (libParam127 < 0 || libParam127 >= this.left.length + this.right.length)
      throw RangeError(
        "Cannot access index `" +
          libParam127 +
          "` in a splice buffer of size `" +
          (this.left.length + this.right.length) +
          "`",
      );
    return libParam127 < this.left.length
      ? this.left[libParam127]
      : this.right[this.right.length - libParam127 + this.left.length - 1];
  }
  get length() {
    return this.left.length + this.right.length;
  }
  shift() {
    return (this.setCursor(0), this.right.pop());
  }
  slice(libParam99, libParam100) {
    let _libY = libParam100 ?? 1 / 0;
    return _libY < this.left.length
      ? this.left.slice(libParam99, _libY)
      : libParam99 > this.left.length
        ? this.right
            .slice(
              this.right.length - _libY + this.left.length,
              this.right.length - libParam99 + this.left.length,
            )
            .reverse()
        : this.left
            .slice(libParam99)
            .concat(
              this.right
                .slice(this.right.length - _libY + this.left.length)
                .reverse(),
            );
  }
  splice(libParam232, libParam233, _libY) {
    let libValue275 = libParam233 || 0;
    this.setCursor(Math.trunc(libParam232));
    let libValue276 = this.right.splice(this.right.length - libValue275, 1 / 0);
    return (_libY && libHelper29(this.left, _libY), libValue276.reverse());
  }
  pop() {
    return (this.setCursor(1 / 0), this.left.pop());
  }
  push(libParam411) {
    this.setCursor(1 / 0);
    this.left.push(libParam411);
  }
  pushMany(libParam405) {
    this.setCursor(1 / 0);
    libHelper29(this.left, libParam405);
  }
  unshift(libParam412) {
    this.setCursor(0);
    this.right.push(libParam412);
  }
  unshiftMany(libParam383) {
    this.setCursor(0);
    libHelper29(this.right, libParam383.reverse());
  }
  setCursor(libParam103) {
    if (
      !(
        libParam103 === this.left.length ||
        (libParam103 > this.left.length && this.right.length === 0) ||
        (libParam103 < 0 && this.left.length === 0)
      )
    )
      if (libParam103 < this.left.length) {
        let libValue330 = this.left.splice(libParam103, 1 / 0);
        libHelper29(this.right, libValue330.reverse());
      } else {
        let libValue286 = this.right.splice(
          this.left.length + this.right.length - libParam103,
          1 / 0,
        );
        libHelper29(this.left, libValue286.reverse());
      }
  }
};
function libHelper29(libParam279, libParam280) {
  let _libY = 0;
  if (libParam280.length < 1e4) libParam279.push(...libParam280);
  else
    for (; _libY < libParam280.length; ) {
      libParam279.push(...libParam280.slice(_libY, _libY + 1e4));
      _libY += 1e4;
    }
}
function libHelper30(libParam21) {
  let libValue120 = {},
    _libY = -1,
    libValue121,
    libValue122,
    libValue123,
    libValue124,
    libValue125,
    libValue126,
    libValue127,
    _libUnderscore = new libValue21(libParam21);
  for (; ++_libY < _libUnderscore.length; ) {
    for (; _libY in libValue120; ) _libY = libValue120[_libY];
    if (
      ((libValue121 = _libUnderscore.get(_libY)),
      _libY &&
        libValue121[1].type === "chunkFlow" &&
        _libUnderscore.get(_libY - 1)[1].type === "listItemPrefix" &&
        ((libValue126 = libValue121[1]._tokenizer.events),
        (libValue123 = 0),
        libValue123 < libValue126.length &&
          libValue126[libValue123][1].type === "lineEndingBlank" &&
          (libValue123 += 2),
        libValue123 < libValue126.length &&
          libValue126[libValue123][1].type === "content"))
    )
      for (
        ;
        ++libValue123 < libValue126.length &&
        libValue126[libValue123][1].type !== "content";
      )
        libValue126[libValue123][1].type === "chunkText" &&
          ((libValue126[libValue123][1]._isInFirstContentOfListItem = true),
          libValue123++);
    if (libValue121[0] === "enter")
      libValue121[1].contentType &&
        (Object.assign(libValue120, be(_libUnderscore, _libY)),
        (_libY = libValue120[_libY]),
        (libValue127 = true));
    else if (libValue121[1]._container) {
      for (libValue123 = _libY, libValue122 = undefined; libValue123--; )
        if (
          ((libValue124 = _libUnderscore.get(libValue123)),
          libValue124[1].type === "lineEnding" ||
            libValue124[1].type === "lineEndingBlank")
        )
          libValue124[0] === "enter" &&
            (libValue122 &&
              (_libUnderscore.get(libValue122)[1].type = "lineEndingBlank"),
            (libValue124[1].type = "lineEnding"),
            (libValue122 = libValue123));
        else if (
          !(
            libValue124[1].type === "linePrefix" ||
            libValue124[1].type === "listItemIndent"
          )
        )
          break;
      libValue122 &&
        ((libValue121[1].end = {
          ..._libUnderscore.get(libValue122)[1].start,
        }),
        (libValue125 = _libUnderscore.slice(libValue122, _libY)),
        libValue125.unshift(libValue121),
        _libUnderscore.splice(
          libValue122,
          _libY - libValue122 + 1,
          libValue125,
        ));
    }
  }
  return (libV(libParam21, 0, 1 / 0, _libUnderscore.slice(0)), !libValue127);
}
function be(libParam19, libParam20) {
  let _libY = libParam19.get(libParam20)[1],
    libValue110 = libParam19.get(libParam20)[2],
    libValue111 = libParam20 - 1,
    libValue112 = [],
    libValue113 = _libY._tokenizer;
  libValue113 ||
    ((libValue113 = libValue110.parser[_libY.contentType](_libY.start)),
    _libY._contentTypeTextTrailing &&
      (libValue113._contentTypeTextTrailing = true));
  let libValue114 = libValue113.events,
    _libV = [],
    libValue115 = {},
    libValue116,
    _libUnderscore,
    libValue117 = -1,
    libValue118 = _libY,
    libValue119 = 0,
    _libG = 0,
    _libC = [_libG];
  for (; libValue118; ) {
    for (; libParam19.get(++libValue111)[1] !== libValue118; );
    libValue112.push(libValue111);
    libValue118._tokenizer ||
      ((libValue116 = libValue110.sliceStream(libValue118)),
      libValue118.next || libValue116.push(null),
      _libUnderscore && libValue113.defineSkip(libValue118.start),
      libValue118._isInFirstContentOfListItem &&
        (libValue113._gfmTasklistFirstContentOfListItem = true),
      libValue113.write(libValue116),
      libValue118._isInFirstContentOfListItem &&
        (libValue113._gfmTasklistFirstContentOfListItem = undefined));
    _libUnderscore = libValue118;
    libValue118 = libValue118.next;
  }
  for (libValue118 = _libY; ++libValue117 < libValue114.length; )
    libValue114[libValue117][0] === "exit" &&
      libValue114[libValue117 - 1][0] === "enter" &&
      libValue114[libValue117][1].type ===
        libValue114[libValue117 - 1][1].type &&
      libValue114[libValue117][1].start.line !==
        libValue114[libValue117][1].end.line &&
      ((_libG = libValue117 + 1),
      _libC.push(_libG),
      (libValue118._tokenizer = undefined),
      (libValue118.previous = undefined),
      (libValue118 = libValue118.next));
  for (
    libValue113.events = [],
      libValue118
        ? ((libValue118._tokenizer = undefined),
          (libValue118.previous = undefined))
        : _libC.pop(),
      libValue117 = _libC.length;
    libValue117--;
  ) {
    let libValue300 = libValue114.slice(
        _libC[libValue117],
        _libC[libValue117 + 1],
      ),
      __libY = libValue112.pop();
    _libV.push([__libY, __libY + libValue300.length - 1]);
    libParam19.splice(__libY, 2, libValue300);
  }
  for (_libV.reverse(), libValue117 = -1; ++libValue117 < _libV.length; ) {
    libValue115[libValue119 + _libV[libValue117][0]] =
      libValue119 + _libV[libValue117][1];
    libValue119 += _libV[libValue117][1] - _libV[libValue117][0] - 1;
  }
  return libValue115;
}
var libValue22 = {
    resolve: libHelper31,
    tokenize: libHelper32,
  },
  libValue23 = {
    partial: true,
    tokenize: libHelper33,
  };
function libHelper31(libParam446) {
  return (libHelper30(libParam446), libParam446);
}
function libHelper32(libParam86, libParam87) {
  let _libY;
  return libHelper267;
  function libHelper267(libParam283) {
    return (
      libParam86.enter("content"),
      (_libY = libParam86.enter("chunkContent", {
        contentType: "content",
      })),
      libHelper268(libParam283)
    );
  }
  function libHelper268(libParam328) {
    return libParam328 === null
      ? libHelper269(libParam328)
      : libD(libParam328)
        ? libParam86.check(libValue23, libHelper270, libHelper269)(libParam328)
        : (libParam86.consume(libParam328), libHelper268);
  }
  function libHelper269(__libY) {
    return (
      libParam86.exit("chunkContent"),
      libParam86.exit("content"),
      libParam87(__libY)
    );
  }
  function libHelper270(libParam199) {
    return (
      libParam86.consume(libParam199),
      libParam86.exit("chunkContent"),
      (_libY.next = libParam86.enter("chunkContent", {
        contentType: "content",
        previous: _libY,
      })),
      (_libY = _libY.next),
      libHelper268
    );
  }
}
function libHelper33(libParam90, libParam91, _libY) {
  let libValue203 = this;
  return libHelper271;
  function libHelper271(libParam252) {
    return (
      libParam90.exit("chunkContent"),
      libParam90.enter("lineEnding"),
      libParam90.consume(libParam252),
      libParam90.exit("lineEnding"),
      libS(libParam90, libHelper272, "linePrefix")
    );
  }
  function libHelper272(libParam141) {
    if (libParam141 === null || libD(libParam141)) return _libY(libParam141);
    let libValue237 = libValue203.events[libValue203.events.length - 1];
    return !libValue203.parser.constructs.disable.null.includes(
      "codeIndented",
    ) &&
      libValue237 &&
      libValue237[1].type === "linePrefix" &&
      libValue237[2].sliceSerialize(libValue237[1], true).length >= 4
      ? libParam91(libParam141)
      : libParam90.interrupt(
          libValue203.parser.constructs.flow,
          _libY,
          libParam91,
        )(libParam141);
  }
}
function libHelper34(
  libParam22,
  libParam23,
  _libY,
  libParam24,
  libParam25,
  libParam26,
  libParam27,
  libParam28,
  _libV,
) {
  let libValue128 = _libV || 1 / 0,
    libValue129 = 0;
  return _libUnderscore;
  function _libUnderscore(libParam149) {
    return libParam149 === 60
      ? (libParam22.enter(libParam24),
        libParam22.enter(libParam25),
        libParam22.enter(libParam26),
        libParam22.consume(libParam149),
        libParam22.exit(libParam26),
        libHelper201)
      : libParam149 === null ||
          libParam149 === 32 ||
          libParam149 === 41 ||
          libU(libParam149)
        ? _libY(libParam149)
        : (libParam22.enter(libParam24),
          libParam22.enter(libParam27),
          libParam22.enter(libParam28),
          libParam22.enter("chunkString", {
            contentType: "string",
          }),
          _libG(libParam149));
  }
  function libHelper201(__libY) {
    return __libY === 62
      ? (libParam22.enter(libParam26),
        libParam22.consume(__libY),
        libParam22.exit(libParam26),
        libParam22.exit(libParam25),
        libParam22.exit(libParam24),
        libParam23)
      : (libParam22.enter(libParam28),
        libParam22.enter("chunkString", {
          contentType: "string",
        }),
        libHelper202(__libY));
  }
  function libHelper202(libParam230) {
    return libParam230 === 62
      ? (libParam22.exit("chunkString"),
        libParam22.exit(libParam28),
        libHelper201(libParam230))
      : libParam230 === null || libParam230 === 60 || libD(libParam230)
        ? _libY(libParam230)
        : (libParam22.consume(libParam230),
          libParam230 === 92 ? libHelper203 : libHelper202);
  }
  function libHelper203(libParam346) {
    return libParam346 === 60 || libParam346 === 62 || libParam346 === 92
      ? (libParam22.consume(libParam346), libHelper202)
      : libHelper202(libParam346);
  }
  function _libG(libParam128) {
    return !libValue129 &&
      (libParam128 === null || libParam128 === 41 || libF(libParam128))
      ? (libParam22.exit("chunkString"),
        libParam22.exit(libParam28),
        libParam22.exit(libParam27),
        libParam22.exit(libParam24),
        libParam23(libParam128))
      : libValue129 < libValue128 && libParam128 === 40
        ? (libParam22.consume(libParam128), libValue129++, _libG)
        : libParam128 === 41
          ? (libParam22.consume(libParam128), libValue129--, _libG)
          : libParam128 === null ||
              libParam128 === 32 ||
              libParam128 === 40 ||
              libU(libParam128)
            ? _libY(libParam128)
            : (libParam22.consume(libParam128),
              libParam128 === 92 ? _libC : _libG);
  }
  function _libC(libParam347) {
    return libParam347 === 40 || libParam347 === 41 || libParam347 === 92
      ? (libParam22.consume(libParam347), _libG)
      : _libG(libParam347);
  }
}
function libHelper35(
  libParam58,
  libParam59,
  _libY,
  libParam60,
  libParam61,
  libParam62,
) {
  let libValue171 = this,
    libValue172 = 0,
    _libV;
  return libHelper237;
  function libHelper237(libParam333) {
    return (
      libParam58.enter(libParam60),
      libParam58.enter(libParam61),
      libParam58.consume(libParam333),
      libParam58.exit(libParam61),
      libParam58.enter(libParam62),
      libHelper238
    );
  }
  function libHelper238(libParam109) {
    return libValue172 > 999 ||
      libParam109 === null ||
      libParam109 === 91 ||
      (libParam109 === 93 && !_libV) ||
      (libParam109 === 94 &&
        !libValue172 &&
        "_hiddenFootnoteSupport" in libValue171.parser.constructs)
      ? _libY(libParam109)
      : libParam109 === 93
        ? (libParam58.exit(libParam62),
          libParam58.enter(libParam61),
          libParam58.consume(libParam109),
          libParam58.exit(libParam61),
          libParam58.exit(libParam60),
          libParam59)
        : libD(libParam109)
          ? (libParam58.enter("lineEnding"),
            libParam58.consume(libParam109),
            libParam58.exit("lineEnding"),
            libHelper238)
          : (libParam58.enter("chunkString", {
              contentType: "string",
            }),
            _libUnderscore(libParam109));
  }
  function _libUnderscore(libParam238) {
    return libParam238 === null ||
      libParam238 === 91 ||
      libParam238 === 93 ||
      libD(libParam238) ||
      libValue172++ > 999
      ? (libParam58.exit("chunkString"), libHelper238(libParam238))
      : (libParam58.consume(libParam238),
        (_libV ||= !libP(libParam238)),
        libParam238 === 92 ? libHelper239 : _libUnderscore);
  }
  function libHelper239(libParam334) {
    return libParam334 === 91 || libParam334 === 92 || libParam334 === 93
      ? (libParam58.consume(libParam334), libValue172++, _libUnderscore)
      : _libUnderscore(libParam334);
  }
}
function libHelper36(
  libParam53,
  libParam54,
  _libY,
  libParam55,
  libParam56,
  libParam57,
) {
  let libValue169;
  return libHelper234;
  function libHelper234(libParam213) {
    return libParam213 === 34 || libParam213 === 39 || libParam213 === 40
      ? (libParam53.enter(libParam55),
        libParam53.enter(libParam56),
        libParam53.consume(libParam213),
        libParam53.exit(libParam56),
        (libValue169 = libParam213 === 40 ? 41 : libParam213),
        _libV)
      : _libY(libParam213);
  }
  function _libV(__libY) {
    return __libY === libValue169
      ? (libParam53.enter(libParam56),
        libParam53.consume(__libY),
        libParam53.exit(libParam56),
        libParam53.exit(libParam55),
        libParam54)
      : (libParam53.enter(libParam57), libHelper235(__libY));
  }
  function libHelper235(libParam156) {
    return libParam156 === libValue169
      ? (libParam53.exit(libParam57), _libV(libValue169))
      : libParam156 === null
        ? _libY(libParam156)
        : libD(libParam156)
          ? (libParam53.enter("lineEnding"),
            libParam53.consume(libParam156),
            libParam53.exit("lineEnding"),
            libS(libParam53, libHelper235, "linePrefix"))
          : (libParam53.enter("chunkString", {
              contentType: "string",
            }),
            libHelper236(libParam156));
  }
  function libHelper236(libParam286) {
    return libParam286 === libValue169 ||
      libParam286 === null ||
      libD(libParam286)
      ? (libParam53.exit("chunkString"), libHelper235(libParam286))
      : (libParam53.consume(libParam286),
        libParam286 === 92 ? _libUnderscore : libHelper236);
  }
  function _libUnderscore(libParam371) {
    return libParam371 === libValue169 || libParam371 === 92
      ? (libParam53.consume(libParam371), libHelper236)
      : libHelper236(libParam371);
  }
}
function libHelper37(libParam182, libParam183) {
  let _libY;
  return libHelper307;
  function libHelper307(libParam215) {
    return libD(libParam215)
      ? (libParam182.enter("lineEnding"),
        libParam182.consume(libParam215),
        libParam182.exit("lineEnding"),
        (_libY = true),
        libHelper307)
      : libP(libParam215)
        ? libS(
            libParam182,
            libHelper307,
            _libY ? "linePrefix" : "lineSuffix",
          )(libParam215)
        : libParam183(libParam215);
  }
}
var libValue24 = {
    name: "definition",
    tokenize: libHelper38,
  },
  libValue25 = {
    partial: true,
    tokenize: libHelper39,
  };
function libHelper38(libParam45, libParam46, _libY) {
  let libValue154 = this,
    libValue155;
  return libHelper218;
  function libHelper218(libParam413) {
    return (libParam45.enter("definition"), libHelper219(libParam413));
  }
  function libHelper219(libParam256) {
    return libHelper35.call(
      libValue154,
      libParam45,
      libHelper220,
      _libY,
      "definitionLabel",
      "definitionLabelMarker",
      "definitionLabelString",
    )(libParam256);
  }
  function libHelper220(libParam167) {
    return (
      (libValue155 = libG(
        libValue154
          .sliceSerialize(libValue154.events[libValue154.events.length - 1][1])
          .slice(1, -1),
      )),
      libParam167 === 58
        ? (libParam45.enter("definitionMarker"),
          libParam45.consume(libParam167),
          libParam45.exit("definitionMarker"),
          _libV)
        : _libY(libParam167)
    );
  }
  function _libV(libParam419) {
    return libF(libParam419)
      ? libHelper37(libParam45, libHelper221)(libParam419)
      : libHelper221(libParam419);
  }
  function libHelper221(libParam174) {
    return libHelper34(
      libParam45,
      libHelper222,
      _libY,
      "definitionDestination",
      "definitionDestinationLiteral",
      "definitionDestinationLiteralMarker",
      "definitionDestinationRaw",
      "definitionDestinationString",
    )(libParam174);
  }
  function libHelper222(libParam426) {
    return libParam45.attempt(
      libValue25,
      _libUnderscore,
      _libUnderscore,
    )(libParam426);
  }
  function _libUnderscore(libParam387) {
    return libP(libParam387)
      ? libS(libParam45, libHelper223, "whitespace")(libParam387)
      : libHelper223(libParam387);
  }
  function libHelper223(libParam303) {
    return libParam303 === null || libD(libParam303)
      ? (libParam45.exit("definition"),
        libValue154.parser.defined.push(libValue155),
        libParam46(libParam303))
      : _libY(libParam303);
  }
}
function libHelper39(libParam121, libParam122, _libY) {
  return libHelper289;
  function libHelper289(libParam420) {
    return libF(libParam420)
      ? libHelper37(libParam121, libHelper290)(libParam420)
      : _libY(libParam420);
  }
  function libHelper290(libParam274) {
    return libHelper36(
      libParam121,
      libHelper291,
      _libY,
      "definitionTitle",
      "definitionTitleMarker",
      "definitionTitleString",
    )(libParam274);
  }
  function libHelper291(libParam388) {
    return libP(libParam388)
      ? libS(libParam121, libHelper292, "whitespace")(libParam388)
      : libHelper292(libParam388);
  }
  function libHelper292(libParam402) {
    return libParam402 === null || libD(libParam402)
      ? libParam122(libParam402)
      : _libY(libParam402);
  }
}
var libValue26 = {
  name: "hardBreakEscape",
  tokenize: libHelper40,
};
function libHelper40(libParam218, libParam219, _libY) {
  return libHelper310;
  function libHelper310(libParam373) {
    return (
      libParam218.enter("hardBreakEscape"),
      libParam218.consume(libParam373),
      libHelper311
    );
  }
  function libHelper311(libParam370) {
    return libD(libParam370)
      ? (libParam218.exit("hardBreakEscape"), libParam219(libParam370))
      : _libY(libParam370);
  }
}
var libValue27 = {
  name: "headingAtx",
  resolve: libHelper41,
  tokenize: libHelper42,
};
function libHelper41(libParam76, libParam77) {
  let _libY = libParam76.length - 2,
    libValue187 = 3,
    libValue188,
    libValue189;
  return (
    libParam76[libValue187][1].type === "whitespace" && (libValue187 += 2),
    _libY - 2 > libValue187 &&
      libParam76[_libY][1].type === "whitespace" &&
      (_libY -= 2),
    libParam76[_libY][1].type === "atxHeadingSequence" &&
      (libValue187 === _libY - 1 ||
        (_libY - 4 > libValue187 &&
          libParam76[_libY - 2][1].type === "whitespace")) &&
      (_libY -= libValue187 + 1 === _libY ? 2 : 4),
    _libY > libValue187 &&
      ((libValue188 = {
        type: "atxHeadingText",
        start: libParam76[libValue187][1].start,
        end: libParam76[_libY][1].end,
      }),
      (libValue189 = {
        type: "chunkText",
        start: libParam76[libValue187][1].start,
        end: libParam76[_libY][1].end,
        contentType: "text",
      }),
      libV(libParam76, libValue187, _libY - libValue187 + 1, [
        ["enter", libValue188, libParam77],
        ["enter", libValue189, libParam77],
        ["exit", libValue189, libParam77],
        ["exit", libValue188, libParam77],
      ])),
    libParam76
  );
}
function libHelper42(libParam67, libParam68, _libY) {
  let libValue178 = 0;
  return libHelper243;
  function libHelper243(libParam414) {
    return (libParam67.enter("atxHeading"), libHelper244(libParam414));
  }
  function libHelper244(libParam390) {
    return (libParam67.enter("atxHeadingSequence"), libHelper245(libParam390));
  }
  function libHelper245(libParam264) {
    return libParam264 === 35 && libValue178++ < 6
      ? (libParam67.consume(libParam264), libHelper245)
      : libParam264 === null || libF(libParam264)
        ? (libParam67.exit("atxHeadingSequence"), libHelper246(libParam264))
        : _libY(libParam264);
  }
  function libHelper246(__libY) {
    return __libY === 35
      ? (libParam67.enter("atxHeadingSequence"), _libV(__libY))
      : __libY === null || libD(__libY)
        ? (libParam67.exit("atxHeading"), libParam68(__libY))
        : libP(__libY)
          ? libS(libParam67, libHelper246, "whitespace")(__libY)
          : (libParam67.enter("atxHeadingText"), libHelper247(__libY));
  }
  function _libV(libParam329) {
    return libParam329 === 35
      ? (libParam67.consume(libParam329), _libV)
      : (libParam67.exit("atxHeadingSequence"), libHelper246(libParam329));
  }
  function libHelper247(libParam300) {
    return libParam300 === null || libParam300 === 35 || libF(libParam300)
      ? (libParam67.exit("atxHeadingText"), libHelper246(libParam300))
      : (libParam67.consume(libParam300), libHelper247);
  }
}
var libValue28 =
    "address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul".split(
      ".",
    ),
  libValue29 = ["pre", "script", "style", "textarea"],
  libValue30 = {
    concrete: true,
    name: "htmlFlow",
    resolveTo: libHelper43,
    tokenize: libHelper44,
  },
  libValue31 = {
    partial: true,
    tokenize: libHelper46,
  },
  libValue32 = {
    partial: true,
    tokenize: libHelper45,
  };
function libHelper43(libParam157) {
  let libValue250 = libParam157.length;
  for (
    ;
    libValue250-- &&
    !(
      libParam157[libValue250][0] === "enter" &&
      libParam157[libValue250][1].type === "htmlFlow"
    );
  );
  return (
    libValue250 > 1 &&
      libParam157[libValue250 - 2][1].type === "linePrefix" &&
      ((libParam157[libValue250][1].start =
        libParam157[libValue250 - 2][1].start),
      (libParam157[libValue250 + 1][1].start =
        libParam157[libValue250 - 2][1].start),
      libParam157.splice(libValue250 - 2, 2)),
    libParam157
  );
}
function libHelper44(libParam2, libParam3, _libY) {
  let libValue63 = this,
    libValue64,
    libValue65,
    libValue66,
    libValue67,
    _libV;
  return libHelper125;
  function libHelper125(libParam450) {
    return libHelper126(libParam450);
  }
  function libHelper126(libParam336) {
    return (
      libParam2.enter("htmlFlow"),
      libParam2.enter("htmlFlowData"),
      libParam2.consume(libParam336),
      _libUnderscore
    );
  }
  function _libUnderscore(libParam160) {
    return libParam160 === 33
      ? (libParam2.consume(libParam160), libHelper127)
      : libParam160 === 47
        ? (libParam2.consume(libParam160), (libValue65 = true), _libG)
        : libParam160 === 63
          ? (libParam2.consume(libParam160),
            (libValue64 = 3),
            libValue63.interrupt ? libParam3 : libHelper144)
          : libC(libParam160)
            ? (libParam2.consume(libParam160),
              (libValue66 = String.fromCharCode(libParam160)),
              libHelper130)
            : _libY(libParam160);
  }
  function libHelper127(libParam197) {
    return libParam197 === 45
      ? (libParam2.consume(libParam197), (libValue64 = 2), libHelper128)
      : libParam197 === 91
        ? (libParam2.consume(libParam197),
          (libValue64 = 5),
          (libValue67 = 0),
          libHelper129)
        : libC(libParam197)
          ? (libParam2.consume(libParam197),
            (libValue64 = 4),
            libValue63.interrupt ? libParam3 : libHelper144)
          : _libY(libParam197);
  }
  function libHelper128(libParam357) {
    return libParam357 === 45
      ? (libParam2.consume(libParam357),
        libValue63.interrupt ? libParam3 : libHelper144)
      : _libY(libParam357);
  }
  function libHelper129(libParam292) {
    return libParam292 === "CDATA[".charCodeAt(libValue67++)
      ? (libParam2.consume(libParam292),
        libValue67 === 6
          ? libValue63.interrupt
            ? libParam3
            : libHelper138
          : libHelper129)
      : _libY(libParam292);
  }
  function _libG(libParam344) {
    return libC(libParam344)
      ? (libParam2.consume(libParam344),
        (libValue66 = String.fromCharCode(libParam344)),
        libHelper130)
      : _libY(libParam344);
  }
  function libHelper130(libParam88) {
    if (
      libParam88 === null ||
      libParam88 === 47 ||
      libParam88 === 62 ||
      libF(libParam88)
    ) {
      let __libV = libParam88 === 47,
        libValue218 = libValue66.toLowerCase();
      return !__libV && !libValue65 && libValue29.includes(libValue218)
        ? ((libValue64 = 1),
          libValue63.interrupt
            ? libParam3(libParam88)
            : libHelper138(libParam88))
        : libValue28.includes(libValue66.toLowerCase())
          ? ((libValue64 = 6),
            __libV
              ? (libParam2.consume(libParam88), _libU)
              : libValue63.interrupt
                ? libParam3(libParam88)
                : libHelper138(libParam88))
          : ((libValue64 = 7),
            libValue63.interrupt &&
            !libValue63.parser.lazy[libValue63.now().line]
              ? _libY(libParam88)
              : libValue65
                ? libHelper131(libParam88)
                : libHelper132(libParam88));
    }
    return libParam88 === 45 || libL(libParam88)
      ? (libParam2.consume(libParam88),
        (libValue66 += String.fromCharCode(libParam88)),
        libHelper130)
      : _libY(libParam88);
  }
  function _libU(libParam358) {
    return libParam358 === 62
      ? (libParam2.consume(libParam358),
        libValue63.interrupt ? libParam3 : libHelper138)
      : _libY(libParam358);
  }
  function libHelper131(libParam406) {
    return libP(libParam406)
      ? (libParam2.consume(libParam406), libHelper131)
      : libHelper136(libParam406);
  }
  function libHelper132(libParam223) {
    return libParam223 === 47
      ? (libParam2.consume(libParam223), libHelper136)
      : libParam223 === 58 || libParam223 === 95 || libC(libParam223)
        ? (libParam2.consume(libParam223), libHelper133)
        : libP(libParam223)
          ? (libParam2.consume(libParam223), libHelper132)
          : libHelper136(libParam223);
  }
  function libHelper133(libParam305) {
    return libParam305 === 45 ||
      libParam305 === 46 ||
      libParam305 === 58 ||
      libParam305 === 95 ||
      libL(libParam305)
      ? (libParam2.consume(libParam305), libHelper133)
      : _libM(libParam305);
  }
  function _libM(libParam342) {
    return libParam342 === 61
      ? (libParam2.consume(libParam342), _libH)
      : libP(libParam342)
        ? (libParam2.consume(libParam342), _libM)
        : libHelper132(libParam342);
  }
  function _libH(libParam191) {
    return libParam191 === null ||
      libParam191 === 60 ||
      libParam191 === 61 ||
      libParam191 === 62 ||
      libParam191 === 96
      ? _libY(libParam191)
      : libParam191 === 34 || libParam191 === 39
        ? (libParam2.consume(libParam191), (_libV = libParam191), libHelper134)
        : libP(libParam191)
          ? (libParam2.consume(libParam191), _libH)
          : _libS(libParam191);
  }
  function libHelper134(libParam278) {
    return libParam278 === _libV
      ? (libParam2.consume(libParam278), (_libV = null), libHelper135)
      : libParam278 === null || libD(libParam278)
        ? _libY(libParam278)
        : (libParam2.consume(libParam278), libHelper134);
  }
  function _libS(libParam201) {
    return libParam201 === null ||
      libParam201 === 34 ||
      libParam201 === 39 ||
      libParam201 === 47 ||
      libParam201 === 60 ||
      libParam201 === 61 ||
      libParam201 === 62 ||
      libParam201 === 96 ||
      libF(libParam201)
      ? _libM(libParam201)
      : (libParam2.consume(libParam201), _libS);
  }
  function libHelper135(libParam380) {
    return libParam380 === 47 || libParam380 === 62 || libP(libParam380)
      ? libHelper132(libParam380)
      : _libY(libParam380);
  }
  function libHelper136(libParam393) {
    return libParam393 === 62
      ? (libParam2.consume(libParam393), libHelper137)
      : _libY(libParam393);
  }
  function libHelper137(libParam348) {
    return libParam348 === null || libD(libParam348)
      ? libHelper138(libParam348)
      : libP(libParam348)
        ? (libParam2.consume(libParam348), libHelper137)
        : _libY(libParam348);
  }
  function libHelper138(libParam94) {
    return libParam94 === 45 && libValue64 === 2
      ? (libParam2.consume(libParam94), _libA)
      : libParam94 === 60 && libValue64 === 1
        ? (libParam2.consume(libParam94), libHelper141)
        : libParam94 === 62 && libValue64 === 4
          ? (libParam2.consume(libParam94), libHelper145)
          : libParam94 === 63 && libValue64 === 3
            ? (libParam2.consume(libParam94), libHelper144)
            : libParam94 === 93 && libValue64 === 5
              ? (libParam2.consume(libParam94), libHelper143)
              : libD(libParam94) && (libValue64 === 6 || libValue64 === 7)
                ? (libParam2.exit("htmlFlowData"),
                  libParam2.check(
                    libValue31,
                    libHelper146,
                    libHelper139,
                  )(libParam94))
                : libParam94 === null || libD(libParam94)
                  ? (libParam2.exit("htmlFlowData"), libHelper139(libParam94))
                  : (libParam2.consume(libParam94), libHelper138);
  }
  function libHelper139(libParam433) {
    return libParam2.check(libValue32, libHelper140, libHelper146)(libParam433);
  }
  function libHelper140(libParam343) {
    return (
      libParam2.enter("lineEnding"),
      libParam2.consume(libParam343),
      libParam2.exit("lineEnding"),
      _libO
    );
  }
  function _libO(libParam349) {
    return libParam349 === null || libD(libParam349)
      ? libHelper139(libParam349)
      : (libParam2.enter("htmlFlowData"), libHelper138(libParam349));
  }
  function _libA(libParam394) {
    return libParam394 === 45
      ? (libParam2.consume(libParam394), libHelper144)
      : libHelper138(libParam394);
  }
  function libHelper141(libParam374) {
    return libParam374 === 47
      ? (libParam2.consume(libParam374), (libValue66 = ""), libHelper142)
      : libHelper138(libParam374);
  }
  function libHelper142(libParam188) {
    if (libParam188 === 62) {
      let __libY = libValue66.toLowerCase();
      return libValue29.includes(__libY)
        ? (libParam2.consume(libParam188), libHelper145)
        : libHelper138(libParam188);
    }
    return libC(libParam188) && libValue66.length < 8
      ? (libParam2.consume(libParam188),
        (libValue66 += String.fromCharCode(libParam188)),
        libHelper142)
      : libHelper138(libParam188);
  }
  function libHelper143(libParam395) {
    return libParam395 === 93
      ? (libParam2.consume(libParam395), libHelper144)
      : libHelper138(libParam395);
  }
  function libHelper144(libParam290) {
    return libParam290 === 62
      ? (libParam2.consume(libParam290), libHelper145)
      : libParam290 === 45 && libValue64 === 2
        ? (libParam2.consume(libParam290), libHelper144)
        : libHelper138(libParam290);
  }
  function libHelper145(libParam319) {
    return libParam319 === null || libD(libParam319)
      ? (libParam2.exit("htmlFlowData"), libHelper146(libParam319))
      : (libParam2.consume(libParam319), libHelper145);
  }
  function libHelper146(__libY) {
    return (libParam2.exit("htmlFlow"), libParam3(__libY));
  }
}
function libHelper45(libParam175, libParam176, _libY) {
  let libValue259 = this;
  return libHelper305;
  function libHelper305(libParam311) {
    return libD(libParam311)
      ? (libParam175.enter("lineEnding"),
        libParam175.consume(libParam311),
        libParam175.exit("lineEnding"),
        libHelper306)
      : _libY(libParam311);
  }
  function libHelper306(libParam384) {
    return libValue259.parser.lazy[libValue259.now().line]
      ? _libY(libParam384)
      : libParam176(libParam384);
  }
}
function libHelper46(libParam240, libParam241, _libY) {
  return libHelper312;
  function libHelper312(libParam284) {
    return (
      libParam240.enter("lineEnding"),
      libParam240.consume(libParam284),
      libParam240.exit("lineEnding"),
      libParam240.attempt(libI, libParam241, _libY)
    );
  }
}
var libValue33 = {
  name: "htmlText",
  tokenize: libHelper47,
};
function libHelper47(libParam6, libParam7, _libY) {
  let libValue75 = this,
    libValue76,
    libValue77,
    libValue78;
  return libHelper154;
  function libHelper154(libParam337) {
    return (
      libParam6.enter("htmlText"),
      libParam6.enter("htmlTextData"),
      libParam6.consume(libParam337),
      _libV
    );
  }
  function _libV(libParam196) {
    return libParam196 === 33
      ? (libParam6.consume(libParam196), libHelper155)
      : libParam196 === 47
        ? (libParam6.consume(libParam196), _libM)
        : libParam196 === 63
          ? (libParam6.consume(libParam196), libHelper162)
          : libC(libParam196)
            ? (libParam6.consume(libParam196), libHelper165)
            : _libY(libParam196);
  }
  function libHelper155(libParam237) {
    return libParam237 === 45
      ? (libParam6.consume(libParam237), libHelper156)
      : libParam237 === 91
        ? (libParam6.consume(libParam237), (libValue77 = 0), libHelper159)
        : libC(libParam237)
          ? (libParam6.consume(libParam237), libHelper161)
          : _libY(libParam237);
  }
  function libHelper156(libParam396) {
    return libParam396 === 45
      ? (libParam6.consume(libParam396), libHelper158)
      : _libY(libParam396);
  }
  function _libUnderscore(libParam253) {
    return libParam253 === null
      ? _libY(libParam253)
      : libParam253 === 45
        ? (libParam6.consume(libParam253), libHelper157)
        : libD(libParam253)
          ? ((libValue78 = _libUnderscore), libHelper172(libParam253))
          : (libParam6.consume(libParam253), _libUnderscore);
  }
  function libHelper157(libParam397) {
    return libParam397 === 45
      ? (libParam6.consume(libParam397), libHelper158)
      : _libUnderscore(libParam397);
  }
  function libHelper158(libParam385) {
    return libParam385 === 62
      ? libHelper171(libParam385)
      : libParam385 === 45
        ? libHelper157(libParam385)
        : _libUnderscore(libParam385);
  }
  function libHelper159(libParam320) {
    return libParam320 === "CDATA[".charCodeAt(libValue77++)
      ? (libParam6.consume(libParam320),
        libValue77 === 6 ? _libG : libHelper159)
      : _libY(libParam320);
  }
  function _libG(libParam254) {
    return libParam254 === null
      ? _libY(libParam254)
      : libParam254 === 93
        ? (libParam6.consume(libParam254), libHelper160)
        : libD(libParam254)
          ? ((libValue78 = _libG), libHelper172(libParam254))
          : (libParam6.consume(libParam254), _libG);
  }
  function libHelper160(libParam398) {
    return libParam398 === 93
      ? (libParam6.consume(libParam398), _libU)
      : _libG(libParam398);
  }
  function _libU(libParam359) {
    return libParam359 === 62
      ? libHelper171(libParam359)
      : libParam359 === 93
        ? (libParam6.consume(libParam359), _libU)
        : _libG(libParam359);
  }
  function libHelper161(libParam293) {
    return libParam293 === null || libParam293 === 62
      ? libHelper171(libParam293)
      : libD(libParam293)
        ? ((libValue78 = libHelper161), libHelper172(libParam293))
        : (libParam6.consume(libParam293), libHelper161);
  }
  function libHelper162(libParam255) {
    return libParam255 === null
      ? _libY(libParam255)
      : libParam255 === 63
        ? (libParam6.consume(libParam255), libHelper163)
        : libD(libParam255)
          ? ((libValue78 = libHelper162), libHelper172(libParam255))
          : (libParam6.consume(libParam255), libHelper162);
  }
  function libHelper163(libParam427) {
    return libParam427 === 62
      ? libHelper171(libParam427)
      : libHelper162(libParam427);
  }
  function _libM(libParam407) {
    return libC(libParam407)
      ? (libParam6.consume(libParam407), _libH)
      : _libY(libParam407);
  }
  function _libH(libParam379) {
    return libParam379 === 45 || libL(libParam379)
      ? (libParam6.consume(libParam379), _libH)
      : libHelper164(libParam379);
  }
  function libHelper164(libParam351) {
    return libD(libParam351)
      ? ((libValue78 = libHelper164), libHelper172(libParam351))
      : libP(libParam351)
        ? (libParam6.consume(libParam351), libHelper164)
        : libHelper171(libParam351);
  }
  function libHelper165(libParam285) {
    return libParam285 === 45 || libL(libParam285)
      ? (libParam6.consume(libParam285), libHelper165)
      : libParam285 === 47 || libParam285 === 62 || libF(libParam285)
        ? libHelper166(libParam285)
        : _libY(libParam285);
  }
  function libHelper166(libParam184) {
    return libParam184 === 47
      ? (libParam6.consume(libParam184), libHelper171)
      : libParam184 === 58 || libParam184 === 95 || libC(libParam184)
        ? (libParam6.consume(libParam184), libHelper167)
        : libD(libParam184)
          ? ((libValue78 = libHelper166), libHelper172(libParam184))
          : libP(libParam184)
            ? (libParam6.consume(libParam184), libHelper166)
            : libHelper171(libParam184);
  }
  function libHelper167(libParam306) {
    return libParam306 === 45 ||
      libParam306 === 46 ||
      libParam306 === 58 ||
      libParam306 === 95 ||
      libL(libParam306)
      ? (libParam6.consume(libParam306), libHelper167)
      : libHelper168(libParam306);
  }
  function libHelper168(libParam262) {
    return libParam262 === 61
      ? (libParam6.consume(libParam262), libHelper169)
      : libD(libParam262)
        ? ((libValue78 = libHelper168), libHelper172(libParam262))
        : libP(libParam262)
          ? (libParam6.consume(libParam262), libHelper168)
          : libHelper166(libParam262);
  }
  function libHelper169(libParam161) {
    return libParam161 === null ||
      libParam161 === 60 ||
      libParam161 === 61 ||
      libParam161 === 62 ||
      libParam161 === 96
      ? _libY(libParam161)
      : libParam161 === 34 || libParam161 === 39
        ? (libParam6.consume(libParam161),
          (libValue76 = libParam161),
          libHelper170)
        : libD(libParam161)
          ? ((libValue78 = libHelper169), libHelper172(libParam161))
          : libP(libParam161)
            ? (libParam6.consume(libParam161), libHelper169)
            : (libParam6.consume(libParam161), _libO);
  }
  function libHelper170(libParam231) {
    return libParam231 === libValue76
      ? (libParam6.consume(libParam231), (libValue76 = undefined), _libA)
      : libParam231 === null
        ? _libY(libParam231)
        : libD(libParam231)
          ? ((libValue78 = libHelper170), libHelper172(libParam231))
          : (libParam6.consume(libParam231), libHelper170);
  }
  function _libO(libParam198) {
    return libParam198 === null ||
      libParam198 === 34 ||
      libParam198 === 39 ||
      libParam198 === 60 ||
      libParam198 === 61 ||
      libParam198 === 96
      ? _libY(libParam198)
      : libParam198 === 47 || libParam198 === 62 || libF(libParam198)
        ? libHelper166(libParam198)
        : (libParam6.consume(libParam198), _libO);
  }
  function _libA(libParam381) {
    return libParam381 === 47 || libParam381 === 62 || libF(libParam381)
      ? libHelper166(libParam381)
      : _libY(libParam381);
  }
  function libHelper171(libParam307) {
    return libParam307 === 62
      ? (libParam6.consume(libParam307),
        libParam6.exit("htmlTextData"),
        libParam6.exit("htmlText"),
        libParam7)
      : _libY(libParam307);
  }
  function libHelper172(libParam275) {
    return (
      libParam6.exit("htmlTextData"),
      libParam6.enter("lineEnding"),
      libParam6.consume(libParam275),
      libParam6.exit("lineEnding"),
      libHelper173
    );
  }
  function libHelper173(libParam195) {
    return libP(libParam195)
      ? libS(
          libParam6,
          libHelper174,
          "linePrefix",
          libValue75.parser.constructs.disable.null.includes("codeIndented")
            ? undefined
            : 4,
        )(libParam195)
      : libHelper174(libParam195);
  }
  function libHelper174(libParam408) {
    return (libParam6.enter("htmlTextData"), libValue78(libParam408));
  }
}
var libValue34 = {
    name: "labelEnd",
    resolveAll: $e,
    resolveTo: libHelper48,
    tokenize: libHelper49,
  },
  libValue35 = {
    tokenize: libHelper50,
  },
  libValue36 = {
    tokenize: libHelper51,
  },
  libValue37 = {
    tokenize: libHelper52,
  };
function $e(libParam126) {
  let libValue226 = -1,
    _libY = [];
  for (; ++libValue226 < libParam126.length; ) {
    let libValue258 = libParam126[libValue226][1];
    if (
      (_libY.push(libParam126[libValue226]),
      libValue258.type === "labelImage" ||
        libValue258.type === "labelLink" ||
        libValue258.type === "labelEnd")
    ) {
      let libValue327 = libValue258.type === "labelImage" ? 4 : 2;
      libValue258.type = "data";
      libValue226 += libValue327;
    }
  }
  return (
    libParam126.length !== _libY.length &&
      libV(libParam126, 0, libParam126.length, _libY),
    libParam126
  );
}
function libHelper48(libParam29, libParam30) {
  let _libY = libParam29.length,
    libValue130 = 0,
    libValue131,
    libValue132,
    libValue133,
    libValue134;
  for (; _libY--; )
    if (((libValue131 = libParam29[_libY][1]), libValue132)) {
      if (
        libValue131.type === "link" ||
        (libValue131.type === "labelLink" && libValue131._inactive)
      )
        break;
      libParam29[_libY][0] === "enter" &&
        libValue131.type === "labelLink" &&
        (libValue131._inactive = true);
    } else if (libValue133) {
      if (
        libParam29[_libY][0] === "enter" &&
        (libValue131.type === "labelImage" ||
          libValue131.type === "labelLink") &&
        !libValue131._balanced &&
        ((libValue132 = _libY), libValue131.type !== "labelLink")
      ) {
        libValue130 = 2;
        break;
      }
    } else libValue131.type === "labelEnd" && (libValue133 = _libY);
  let libValue135 = {
      type: libParam29[libValue132][1].type === "labelLink" ? "link" : "image",
      start: {
        ...libParam29[libValue132][1].start,
      },
      end: {
        ...libParam29[libParam29.length - 1][1].end,
      },
    },
    _libUnderscore = {
      type: "label",
      start: {
        ...libParam29[libValue132][1].start,
      },
      end: {
        ...libParam29[libValue133][1].end,
      },
    },
    libValue136 = {
      type: "labelText",
      start: {
        ...libParam29[libValue132 + libValue130 + 2][1].end,
      },
      end: {
        ...libParam29[libValue133 - 2][1].start,
      },
    };
  return (
    (libValue134 = [
      ["enter", libValue135, libParam30],
      ["enter", _libUnderscore, libParam30],
    ]),
    (libValue134 = libHelper5(
      libValue134,
      libParam29.slice(libValue132 + 1, libValue132 + libValue130 + 3),
    )),
    (libValue134 = libHelper5(libValue134, [
      ["enter", libValue136, libParam30],
    ])),
    (libValue134 = libHelper5(
      libValue134,
      libA(
        libParam30.parser.constructs.insideSpan.null,
        libParam29.slice(libValue132 + libValue130 + 4, libValue133 - 3),
        libParam30,
      ),
    )),
    (libValue134 = libHelper5(libValue134, [
      ["exit", libValue136, libParam30],
      libParam29[libValue133 - 2],
      libParam29[libValue133 - 1],
      ["exit", _libUnderscore, libParam30],
    ])),
    (libValue134 = libHelper5(libValue134, libParam29.slice(libValue133 + 1))),
    (libValue134 = libHelper5(libValue134, [
      ["exit", libValue135, libParam30],
    ])),
    libV(libParam29, libValue132, libParam29.length, libValue134),
    libParam29
  );
}
function libHelper49(libParam47, libParam48, _libY) {
  let libValue161 = this,
    libValue162 = libValue161.events.length,
    libValue163,
    libValue164;
  for (; libValue162--; )
    if (
      (libValue161.events[libValue162][1].type === "labelImage" ||
        libValue161.events[libValue162][1].type === "labelLink") &&
      !libValue161.events[libValue162][1]._balanced
    ) {
      libValue163 = libValue161.events[libValue162][1];
      break;
    }
  return libHelper224;
  function libHelper224(libParam130) {
    return libValue163
      ? libValue163._inactive
        ? _libUnderscore(libParam130)
        : ((libValue164 = libValue161.parser.defined.includes(
            libG(
              libValue161.sliceSerialize({
                start: libValue163.end,
                end: libValue161.now(),
              }),
            ),
          )),
          libParam47.enter("labelEnd"),
          libParam47.enter("labelMarker"),
          libParam47.consume(libParam130),
          libParam47.exit("labelMarker"),
          libParam47.exit("labelEnd"),
          _libV)
      : _libY(libParam130);
  }
  function _libV(libParam236) {
    return libParam236 === 40
      ? libParam47.attempt(
          libValue35,
          libHelper226,
          libValue164 ? libHelper226 : _libUnderscore,
        )(libParam236)
      : libParam236 === 91
        ? libParam47.attempt(
            libValue36,
            libHelper226,
            libValue164 ? libHelper225 : _libUnderscore,
          )(libParam236)
        : libValue164
          ? libHelper226(libParam236)
          : _libUnderscore(libParam236);
  }
  function libHelper225(libParam428) {
    return libParam47.attempt(
      libValue37,
      libHelper226,
      _libUnderscore,
    )(libParam428);
  }
  function libHelper226(libParam451) {
    return libParam48(libParam451);
  }
  function _libUnderscore(libParam417) {
    return ((libValue163._balanced = true), _libY(libParam417));
  }
}
function libHelper50(libParam41, libParam42, _libY) {
  return libHelper207;
  function libHelper207(libParam272) {
    return (
      libParam41.enter("resource"),
      libParam41.enter("resourceMarker"),
      libParam41.consume(libParam272),
      libParam41.exit("resourceMarker"),
      libHelper208
    );
  }
  function libHelper208(libParam421) {
    return libF(libParam421)
      ? libHelper37(libParam41, libHelper209)(libParam421)
      : libHelper209(libParam421);
  }
  function libHelper209(libParam144) {
    return libParam144 === 41
      ? libHelper213(libParam144)
      : libHelper34(
          libParam41,
          libHelper210,
          libHelper211,
          "resourceDestination",
          "resourceDestinationLiteral",
          "resourceDestinationLiteralMarker",
          "resourceDestinationRaw",
          "resourceDestinationString",
          32,
        )(libParam144);
  }
  function libHelper210(libParam422) {
    return libF(libParam422)
      ? libHelper37(libParam41, _libV)(libParam422)
      : libHelper213(libParam422);
  }
  function libHelper211(libParam452) {
    return _libY(libParam452);
  }
  function _libV(libParam189) {
    return libParam189 === 34 || libParam189 === 39 || libParam189 === 40
      ? libHelper36(
          libParam41,
          libHelper212,
          _libY,
          "resourceTitle",
          "resourceTitleMarker",
          "resourceTitleString",
        )(libParam189)
      : libHelper213(libParam189);
  }
  function libHelper212(libParam423) {
    return libF(libParam423)
      ? libHelper37(libParam41, libHelper213)(libParam423)
      : libHelper213(libParam423);
  }
  function libHelper213(libParam234) {
    return libParam234 === 41
      ? (libParam41.enter("resourceMarker"),
        libParam41.consume(libParam234),
        libParam41.exit("resourceMarker"),
        libParam41.exit("resource"),
        libParam42)
      : _libY(libParam234);
  }
}
function libHelper51(libParam112, libParam113, _libY) {
  let libValue219 = this;
  return libHelper284;
  function libHelper284(libParam276) {
    return libHelper35.call(
      libValue219,
      libParam112,
      libHelper285,
      libHelper286,
      "reference",
      "referenceMarker",
      "referenceString",
    )(libParam276);
  }
  function libHelper285(libParam267) {
    return libValue219.parser.defined.includes(
      libG(
        libValue219
          .sliceSerialize(libValue219.events[libValue219.events.length - 1][1])
          .slice(1, -1),
      ),
    )
      ? libParam113(libParam267)
      : _libY(libParam267);
  }
  function libHelper286(libParam453) {
    return _libY(libParam453);
  }
}
function libHelper52(libParam124, libParam125, _libY) {
  return libHelper293;
  function libHelper293(libParam269) {
    return (
      libParam124.enter("reference"),
      libParam124.enter("referenceMarker"),
      libParam124.consume(libParam269),
      libParam124.exit("referenceMarker"),
      libHelper294
    );
  }
  function libHelper294(libParam229) {
    return libParam229 === 93
      ? (libParam124.enter("referenceMarker"),
        libParam124.consume(libParam229),
        libParam124.exit("referenceMarker"),
        libParam124.exit("reference"),
        libParam125)
      : _libY(libParam229);
  }
}
var at = {
  name: "labelStartImage",
  resolveAll: libValue34.resolveAll,
  tokenize: libHelper53,
};
function libHelper53(libParam95, libParam96, _libY) {
  let libValue207 = this;
  return libHelper275;
  function libHelper275(libParam265) {
    return (
      libParam95.enter("labelImage"),
      libParam95.enter("labelImageMarker"),
      libParam95.consume(libParam265),
      libParam95.exit("labelImageMarker"),
      libHelper276
    );
  }
  function libHelper276(libParam242) {
    return libParam242 === 91
      ? (libParam95.enter("labelMarker"),
        libParam95.consume(libParam242),
        libParam95.exit("labelMarker"),
        libParam95.exit("labelImage"),
        libHelper277)
      : _libY(libParam242);
  }
  function libHelper277(libParam315) {
    return libParam315 === 94 &&
      "_hiddenFootnoteSupport" in libValue207.parser.constructs
      ? _libY(libParam315)
      : libParam96(libParam315);
  }
}
var libValue38 = {
  name: "labelStartLink",
  resolveAll: libValue34.resolveAll,
  tokenize: libHelper54,
};
function libHelper54(libParam134, libParam135, _libY) {
  let libValue231 = this;
  return libHelper295;
  function libHelper295(libParam239) {
    return (
      libParam134.enter("labelLink"),
      libParam134.enter("labelMarker"),
      libParam134.consume(libParam239),
      libParam134.exit("labelMarker"),
      libParam134.exit("labelLink"),
      libHelper296
    );
  }
  function libHelper296(libParam316) {
    return libParam316 === 94 &&
      "_hiddenFootnoteSupport" in libValue231.parser.constructs
      ? _libY(libParam316)
      : libParam135(libParam316);
  }
}
var libValue39 = {
  name: "lineEnding",
  tokenize: libHelper55,
};
function libHelper55(libParam243, libParam244) {
  return _libY;
  function _libY(__libY) {
    return (
      libParam243.enter("lineEnding"),
      libParam243.consume(__libY),
      libParam243.exit("lineEnding"),
      libS(libParam243, libParam244, "linePrefix")
    );
  }
}
var libValue40 = {
  name: "thematicBreak",
  tokenize: libHelper56,
};
function libHelper56(libParam97, libParam98, _libY) {
  let libValue208 = 0,
    libValue209;
  return libHelper278;
  function libHelper278(libParam403) {
    return (libParam97.enter("thematicBreak"), libHelper279(libParam403));
  }
  function libHelper279(libParam438) {
    return ((libValue209 = libParam438), libHelper280(libParam438));
  }
  function libHelper280(libParam235) {
    return libParam235 === libValue209
      ? (libParam97.enter("thematicBreakSequence"), _libV(libParam235))
      : libValue208 >= 3 && (libParam235 === null || libD(libParam235))
        ? (libParam97.exit("thematicBreak"), libParam98(libParam235))
        : _libY(libParam235);
  }
  function _libV(libParam271) {
    return libParam271 === libValue209
      ? (libParam97.consume(libParam271), libValue208++, _libV)
      : (libParam97.exit("thematicBreakSequence"),
        libP(libParam271)
          ? libS(libParam97, libHelper280, "whitespace")(libParam271)
          : libHelper280(libParam271));
  }
}
var libValue41 = {
    continuation: {
      tokenize: libHelper58,
    },
    exit: _t,
    name: "list",
    tokenize: libHelper57,
  },
  libValue42 = {
    partial: true,
    tokenize: libHelper60,
  },
  libValue43 = {
    partial: true,
    tokenize: libHelper59,
  };
function libHelper57(libParam15, libParam16, _libY) {
  let libValue105 = this,
    libValue106 = libValue105.events[libValue105.events.length - 1],
    libValue107 =
      libValue106 && libValue106[1].type === "linePrefix"
        ? libValue106[2].sliceSerialize(libValue106[1], true).length
        : 0,
    libValue108 = 0;
  return libHelper190;
  function libHelper190(libParam78) {
    let libValue190 =
      libValue105.containerState.type ||
      (libParam78 === 42 || libParam78 === 43 || libParam78 === 45
        ? "listUnordered"
        : "listOrdered");
    if (
      libValue190 === "listUnordered"
        ? !libValue105.containerState.marker ||
          libParam78 === libValue105.containerState.marker
        : libValue5(libParam78)
    ) {
      if (
        (libValue105.containerState.type ||
          ((libValue105.containerState.type = libValue190),
          libParam15.enter(libValue190, {
            _container: true,
          })),
        libValue190 === "listUnordered")
      )
        return (
          libParam15.enter("listItemPrefix"),
          libParam78 === 42 || libParam78 === 45
            ? libParam15.check(libValue40, _libY, libHelper191)(libParam78)
            : libHelper191(libParam78)
        );
      if (!libValue105.interrupt || libParam78 === 49)
        return (
          libParam15.enter("listItemPrefix"),
          libParam15.enter("listItemValue"),
          _libV(libParam78)
        );
    }
    return _libY(libParam78);
  }
  function _libV(libParam165) {
    return libValue5(libParam165) && ++libValue108 < 10
      ? (libParam15.consume(libParam165), _libV)
      : (!libValue105.interrupt || libValue108 < 2) &&
          (libValue105.containerState.marker
            ? libParam165 === libValue105.containerState.marker
            : libParam165 === 41 || libParam165 === 46)
        ? (libParam15.exit("listItemValue"), libHelper191(libParam165))
        : _libY(libParam165);
  }
  function libHelper191(libParam178) {
    return (
      libParam15.enter("listItemMarker"),
      libParam15.consume(libParam178),
      libParam15.exit("listItemMarker"),
      (libValue105.containerState.marker =
        libValue105.containerState.marker || libParam178),
      libParam15.check(
        libI,
        libValue105.interrupt ? _libY : libHelper192,
        libParam15.attempt(libValue42, libHelper193, _libUnderscore),
      )
    );
  }
  function libHelper192(libParam360) {
    return (
      (libValue105.containerState.initialBlankLine = true),
      libValue107++,
      libHelper193(libParam360)
    );
  }
  function _libUnderscore(libParam257) {
    return libP(libParam257)
      ? (libParam15.enter("listItemPrefixWhitespace"),
        libParam15.consume(libParam257),
        libParam15.exit("listItemPrefixWhitespace"),
        libHelper193)
      : _libY(libParam257);
  }
  function libHelper193(__libY) {
    return (
      (libValue105.containerState.size =
        libValue107 +
        libValue105.sliceSerialize(libParam15.exit("listItemPrefix"), true)
          .length),
      libParam16(__libY)
    );
  }
}
function libHelper58(libParam51, libParam52, _libY) {
  let libValue168 = this;
  return (
    (libValue168.containerState._closeFlow = undefined),
    libParam51.check(libI, libHelper231, libHelper232)
  );
  function libHelper231(__libY) {
    return (
      (libValue168.containerState.furtherBlankLines =
        libValue168.containerState.furtherBlankLines ||
        libValue168.containerState.initialBlankLine),
      libS(
        libParam51,
        libParam52,
        "listItemIndent",
        libValue168.containerState.size + 1,
      )(__libY)
    );
  }
  function libHelper232(__libY) {
    return libValue168.containerState.furtherBlankLines || !libP(__libY)
      ? ((libValue168.containerState.furtherBlankLines = undefined),
        (libValue168.containerState.initialBlankLine = undefined),
        libHelper233(__libY))
      : ((libValue168.containerState.furtherBlankLines = undefined),
        (libValue168.containerState.initialBlankLine = undefined),
        libParam51.attempt(libValue43, libParam52, libHelper233)(__libY));
  }
  function libHelper233(libParam166) {
    return (
      (libValue168.containerState._closeFlow = true),
      (libValue168.interrupt = undefined),
      libS(
        libParam51,
        libParam51.attempt(libValue41, libParam52, _libY),
        "linePrefix",
        libValue168.parser.constructs.disable.null.includes("codeIndented")
          ? undefined
          : 4,
      )(libParam166)
    );
  }
}
function libHelper59(libParam151, libParam152, _libY) {
  let libValue248 = this;
  return libS(
    libParam151,
    libHelper301,
    "listItemIndent",
    libValue248.containerState.size + 1,
  );
  function libHelper301(libParam204) {
    let libValue270 = libValue248.events[libValue248.events.length - 1];
    return libValue270 &&
      libValue270[1].type === "listItemIndent" &&
      libValue270[2].sliceSerialize(libValue270[1], true).length ===
        libValue248.containerState.size
      ? libParam152(libParam204)
      : _libY(libParam204);
  }
}
function _t(libParam429) {
  libParam429.exit(this.containerState.type);
}
function libHelper60(libParam145, libParam146, _libY) {
  let libValue243 = this;
  return libS(
    libParam145,
    libHelper300,
    "listItemPrefixWhitespace",
    libValue243.parser.constructs.disable.null.includes("codeIndented")
      ? undefined
      : 5,
  );
  function libHelper300(libParam282) {
    let libValue287 = libValue243.events[libValue243.events.length - 1];
    return !libP(libParam282) &&
      libValue287 &&
      libValue287[1].type === "listItemPrefixWhitespace"
      ? libParam146(libParam282)
      : _libY(libParam282);
  }
}
var libValue44 = {
  name: "setextUnderline",
  resolveTo: libHelper61,
  tokenize: libHelper62,
};
function libHelper61(libParam73, libParam74) {
  let _libY = libParam73.length,
    libValue182,
    libValue183,
    libValue184;
  for (; _libY--; )
    if (libParam73[_libY][0] === "enter") {
      if (libParam73[_libY][1].type === "content") {
        libValue182 = _libY;
        break;
      }
      libParam73[_libY][1].type === "paragraph" && (libValue183 = _libY);
    } else {
      libParam73[_libY][1].type === "content" && libParam73.splice(_libY, 1);
      !libValue184 &&
        libParam73[_libY][1].type === "definition" &&
        (libValue184 = _libY);
    }
  let libValue185 = {
    type: "setextHeading",
    start: {
      ...libParam73[libValue182][1].start,
    },
    end: {
      ...libParam73[libParam73.length - 1][1].end,
    },
  };
  return (
    (libParam73[libValue183][1].type = "setextHeadingText"),
    libValue184
      ? (libParam73.splice(libValue183, 0, ["enter", libValue185, libParam74]),
        libParam73.splice(libValue184 + 1, 0, [
          "exit",
          libParam73[libValue182][1],
          libParam74,
        ]),
        (libParam73[libValue182][1].end = {
          ...libParam73[libValue184][1].end,
        }))
      : (libParam73[libValue182][1] = libValue185),
    libParam73.push(["exit", libValue185, libParam74]),
    libParam73
  );
}
function libHelper62(libParam69, libParam70, _libY) {
  let libValue179 = this,
    libValue180;
  return libHelper248;
  function libHelper248(libParam110) {
    let libValue216 = libValue179.events.length,
      libValue217;
    for (; libValue216--; )
      if (
        libValue179.events[libValue216][1].type !== "lineEnding" &&
        libValue179.events[libValue216][1].type !== "linePrefix" &&
        libValue179.events[libValue216][1].type !== "content"
      ) {
        libValue217 = libValue179.events[libValue216][1].type === "paragraph";
        break;
      }
    return !libValue179.parser.lazy[libValue179.now().line] &&
      (libValue179.interrupt || libValue217)
      ? (libParam69.enter("setextHeadingLine"),
        (libValue180 = libParam110),
        libHelper249(libParam110))
      : _libY(libParam110);
  }
  function libHelper249(libParam376) {
    return (
      libParam69.enter("setextHeadingLineSequence"),
      libHelper250(libParam376)
    );
  }
  function libHelper250(libParam273) {
    return libParam273 === libValue180
      ? (libParam69.consume(libParam273), libHelper250)
      : (libParam69.exit("setextHeadingLineSequence"),
        libP(libParam273)
          ? libS(libParam69, _libV, "lineSuffix")(libParam273)
          : _libV(libParam273));
  }
  function _libV(libParam338) {
    return libParam338 === null || libD(libParam338)
      ? (libParam69.exit("setextHeadingLine"), libParam70(libParam338))
      : _libY(libParam338);
  }
}
var libValue45 = {
  tokenize: libHelper63,
};
function libHelper63(libParam72) {
  let libValue181 = this,
    _libY = libParam72.attempt(
      libI,
      libHelper252,
      libParam72.attempt(
        this.parser.constructs.flowInitial,
        libHelper253,
        libS(
          libParam72,
          libParam72.attempt(
            this.parser.constructs.flow,
            libHelper253,
            libParam72.attempt(libValue22, libHelper253),
          ),
          "linePrefix",
        ),
      ),
    );
  return _libY;
  function libHelper252(libParam190) {
    if (libParam190 === null) {
      libParam72.consume(libParam190);
      return;
    }
    return (
      libParam72.enter("lineEndingBlank"),
      libParam72.consume(libParam190),
      libParam72.exit("lineEndingBlank"),
      (libValue181.currentConstruct = undefined),
      _libY
    );
  }
  function libHelper253(libParam200) {
    if (libParam200 === null) {
      libParam72.consume(libParam200);
      return;
    }
    return (
      libParam72.enter("lineEnding"),
      libParam72.consume(libParam200),
      libParam72.exit("lineEnding"),
      (libValue181.currentConstruct = undefined),
      _libY
    );
  }
}
var libValue46 = {
    resolveAll: libHelper65(),
  },
  libValue47 = libHelper64("string"),
  libValue48 = libHelper64("text");
function libHelper64(libParam71) {
  return {
    resolveAll: libHelper65(libParam71 === "text" ? libHelper66 : undefined),
    tokenize: libHelper251,
  };
  function libHelper251(libParam79) {
    let _libY = this,
      libValue191 = this.parser.constructs[libParam71],
      libValue192 = libParam79.attempt(libValue191, libHelper258, libHelper259);
    return libHelper258;
    function libHelper258(libParam430) {
      return _libV(libParam430)
        ? libValue192(libParam430)
        : libHelper259(libParam430);
    }
    function libHelper259(libParam287) {
      if (libParam287 === null) {
        libParam79.consume(libParam287);
        return;
      }
      return (
        libParam79.enter("data"),
        libParam79.consume(libParam287),
        libHelper260
      );
    }
    function libHelper260(libParam361) {
      return _libV(libParam361)
        ? (libParam79.exit("data"), libValue192(libParam361))
        : (libParam79.consume(libParam361), libHelper260);
    }
    function _libV(libParam168) {
      if (libParam168 === null) return true;
      let libValue254 = libValue191[libParam168],
        libValue255 = -1;
      if (libValue254)
        for (; ++libValue255 < libValue254.length; ) {
          let libValue305 = libValue254[libValue255];
          if (
            !libValue305.previous ||
            libValue305.previous.call(_libY, _libY.previous)
          )
            return true;
        }
      return false;
    }
  }
}
function libHelper65(libParam111) {
  return libHelper283;
  function libHelper283(libParam123, _libY) {
    let libValue224 = -1,
      libValue225;
    for (; ++libValue224 <= libParam123.length; )
      libValue225 === undefined
        ? libParam123[libValue224] &&
          libParam123[libValue224][1].type === "data" &&
          ((libValue225 = libValue224), libValue224++)
        : (!libParam123[libValue224] ||
            libParam123[libValue224][1].type !== "data") &&
          (libValue224 !== libValue225 + 2 &&
            ((libParam123[libValue225][1].end =
              libParam123[libValue224 - 1][1].end),
            libParam123.splice(libValue225 + 2, libValue224 - libValue225 - 2),
            (libValue224 = libValue225 + 2)),
          (libValue225 = undefined));
    return libParam111 ? libParam111(libParam123, _libY) : libParam123;
  }
}
function libHelper66(libParam31, libParam32) {
  let _libY = 0;
  for (; ++_libY <= libParam31.length; )
    if (
      (_libY === libParam31.length ||
        libParam31[_libY][1].type === "lineEnding") &&
      libParam31[_libY - 1][1].type === "data"
    ) {
      let libValue156 = libParam31[_libY - 1][1],
        libValue157 = libParam32.sliceStream(libValue156),
        libValue158 = libValue157.length,
        libValue159 = -1,
        libValue160 = 0,
        _libV;
      for (; libValue158--; ) {
        let libValue251 = libValue157[libValue158];
        if (typeof libValue251 == "string") {
          for (
            libValue159 = libValue251.length;
            libValue251.charCodeAt(libValue159 - 1) === 32;
          ) {
            libValue160++;
            libValue159--;
          }
          if (libValue159) break;
          libValue159 = -1;
        } else if (libValue251 === -2) {
          _libV = true;
          libValue160++;
        } else if (libValue251 !== -1) {
          libValue158++;
          break;
        }
      }
      if (
        (libParam32._contentTypeTextTrailing &&
          _libY === libParam31.length &&
          (libValue160 = 0),
        libValue160)
      ) {
        let libValue202 = {
          type:
            _libY === libParam31.length || _libV || libValue160 < 2
              ? "lineSuffix"
              : "hardBreakTrailing",
          start: {
            _bufferIndex: libValue158
              ? libValue159
              : libValue156.start._bufferIndex + libValue159,
            _index: libValue156.start._index + libValue158,
            line: libValue156.end.line,
            column: libValue156.end.column - libValue160,
            offset: libValue156.end.offset - libValue160,
          },
          end: {
            ...libValue156.end,
          },
        };
        libValue156.end = {
          ...libValue202.start,
        };
        libValue156.start.offset === libValue156.end.offset
          ? Object.assign(libValue156, libValue202)
          : (libParam31.splice(
              _libY,
              0,
              ["enter", libValue202, libParam32],
              ["exit", libValue202, libParam32],
            ),
            (_libY += 2));
      }
      _libY++;
    }
  return libParam31;
}
var libValue49 = chunkR({
    attentionMarkers: () => libValue57,
    contentInitial: () => libValue51,
    disable: () => libValue58,
    document: () => libValue50,
    flow: () => libValue53,
    flowInitial: () => libValue52,
    insideSpan: () => libValue56,
    string: () => libValue54,
    text: () => libValue55,
  }),
  libValue50 = {
    42: libValue41,
    43: libValue41,
    45: libValue41,
    48: libValue41,
    49: libValue41,
    50: libValue41,
    51: libValue41,
    52: libValue41,
    53: libValue41,
    54: libValue41,
    55: libValue41,
    56: libValue41,
    57: libValue41,
    62: libValue13,
  },
  libValue51 = {
    91: libValue24,
  },
  libValue52 = {
    [-2]: libValue18,
    [-1]: libValue18,
    32: libValue18,
  },
  libValue53 = {
    35: libValue27,
    42: libValue40,
    45: [libValue44, libValue40],
    60: libValue30,
    61: libValue44,
    95: libValue40,
    96: libValue17,
    126: libValue17,
  },
  libValue54 = {
    38: libValue15,
    92: libValue14,
  },
  libValue55 = {
    [-5]: libValue39,
    [-4]: libValue39,
    [-3]: libValue39,
    33: at,
    38: libValue15,
    42: libValue11,
    60: [libValue12, libValue33],
    91: libValue38,
    92: [libValue26, libValue14],
    93: libValue34,
    95: libValue11,
    96: libValue20,
  },
  libValue56 = {
    null: [libValue11, libValue46],
  },
  libValue57 = {
    null: [42, 95],
  },
  libValue58 = {
    null: [],
  };
function libHelper67(libParam4, libParam5, _libY) {
  let libValue68 = {
      _bufferIndex: -1,
      _index: 0,
      line: (_libY && _libY.line) || 1,
      column: (_libY && _libY.column) || 1,
      offset: (_libY && _libY.offset) || 0,
    },
    libValue69 = {},
    libValue70 = [],
    libValue71 = [],
    libValue72 = [],
    libValue73 = {
      attempt: _libM(_libF),
      check: _libM(_libP),
      consume: libHelper150,
      enter: libHelper151,
      exit: libHelper152,
      interrupt: _libM(_libP, {
        interrupt: true,
      }),
    },
    _libUnderscore = {
      code: null,
      containerState: {},
      defineSkip: _libL,
      events: [],
      now: _libC,
      parser: libParam4,
      previous: null,
      sliceSerialize: libHelper148,
      sliceStream: _libG,
      write: libHelper147,
    },
    libValue74 = libParam5.tokenize.call(_libUnderscore, libValue73);
  return (libParam5.resolveAll && libValue70.push(libParam5), _libUnderscore);
  function libHelper147(libParam248) {
    return (
      (libValue71 = libHelper5(libValue71, libParam248)),
      libHelper149(),
      libValue71[libValue71.length - 1] === null
        ? (_libH(libParam5, 0),
          (_libUnderscore.events = libA(
            libValue70,
            _libUnderscore.events,
            _libUnderscore,
          )),
          _libUnderscore.events)
        : []
    );
  }
  function libHelper148(libParam439, libParam440) {
    return libHelper69(_libG(libParam439), libParam440);
  }
  function _libG(libParam443) {
    return libHelper68(libValue71, libParam443);
  }
  function _libC() {
    let { _bufferIndex, _index, line: __libY, column, offset } = libValue68;
    return {
      _bufferIndex,
      _index,
      line: __libY,
      column,
      offset,
    };
  }
  function _libL(libParam431) {
    libValue69[libParam431.line] = libParam431.column;
    _libS();
  }
  function libHelper149() {
    let libValue242;
    for (; libValue68._index < libValue71.length; ) {
      let libValue253 = libValue71[libValue68._index];
      if (typeof libValue253 == "string")
        for (
          libValue242 = libValue68._index,
            libValue68._bufferIndex < 0 && (libValue68._bufferIndex = 0);
          libValue68._index === libValue242 &&
          libValue68._bufferIndex < libValue253.length;
        )
          _libU(libValue253.charCodeAt(libValue68._bufferIndex));
      else _libU(libValue253);
    }
  }
  function _libU(libParam454) {
    libValue74 = libValue74(libParam454);
  }
  function libHelper150(libParam137) {
    libD(libParam137)
      ? (libValue68.line++,
        (libValue68.column = 1),
        (libValue68.offset += libParam137 === -3 ? 2 : 1),
        _libS())
      : libParam137 !== -1 && (libValue68.column++, libValue68.offset++);
    libValue68._bufferIndex < 0
      ? libValue68._index++
      : (libValue68._bufferIndex++,
        libValue68._bufferIndex === libValue71[libValue68._index].length &&
          ((libValue68._bufferIndex = -1), libValue68._index++));
    _libUnderscore.previous = libParam137;
  }
  function libHelper151(libParam259, libParam260) {
    let __libY = libParam260 || {};
    return (
      (__libY.type = libParam259),
      (__libY.start = _libC()),
      _libUnderscore.events.push(["enter", __libY, _libUnderscore]),
      libValue72.push(__libY),
      __libY
    );
  }
  function libHelper152(libParam326) {
    let libValue324 = libValue72.pop();
    return (
      (libValue324.end = _libC()),
      _libUnderscore.events.push(["exit", libValue324, _libUnderscore]),
      libValue324
    );
  }
  function _libF(libParam444, libParam445) {
    _libH(libParam444, libParam445.from);
  }
  function _libP(libParam447, libParam448) {
    libParam448.restore();
  }
  function _libM(libParam39, libParam40) {
    return __libY;
    function __libY(___libY, libParam43, libParam44) {
      let libValue151, libValue152, libValue153, _libV;
      return Array.isArray(___libY)
        ? libHelper215(___libY)
        : "tokenize" in ___libY
          ? libHelper215([___libY])
          : libHelper214(___libY);
      function libHelper214(libParam159) {
        return libHelper302;
        function libHelper302(libParam179) {
          let ____libY = libParam179 !== null && libParam159[libParam179],
            libValue260 = libParam179 !== null && libParam159.null;
          return libHelper215([
            ...(Array.isArray(____libY)
              ? ____libY
              : ____libY
                ? [____libY]
                : []),
            ...(Array.isArray(libValue260)
              ? libValue260
              : libValue260
                ? [libValue260]
                : []),
          ])(libParam179);
        }
      }
      function libHelper215(libParam352) {
        return (
          (libValue151 = libParam352),
          (libValue152 = 0),
          libParam352.length === 0
            ? libParam44
            : libHelper216(libParam352[libValue152])
        );
      }
      function libHelper216(libParam104) {
        return ____libY;
        function ____libY(_____libY) {
          return (
            (_libV = libHelper153()),
            (libValue153 = libParam104),
            libParam104.partial ||
              (_libUnderscore.currentConstruct = libParam104),
            libParam104.name &&
            _libUnderscore.parser.constructs.disable.null.includes(
              libParam104.name,
            )
              ? __libG(_____libY)
              : libParam104.tokenize.call(
                  libParam40
                    ? Object.assign(Object.create(_libUnderscore), libParam40)
                    : _libUnderscore,
                  libValue73,
                  libHelper217,
                  __libG,
                )(_____libY)
          );
        }
      }
      function libHelper217(libParam434) {
        return (libParam39(libValue153, _libV), libParam43);
      }
      function __libG(libParam364) {
        return (
          _libV.restore(),
          ++libValue152 < libValue151.length
            ? libHelper216(libValue151[libValue152])
            : libParam44
        );
      }
    }
  }
  function _libH(libParam192, libParam193) {
    libParam192.resolveAll &&
      !libValue70.includes(libParam192) &&
      libValue70.push(libParam192);
    libParam192.resolve &&
      libV(
        _libUnderscore.events,
        libParam193,
        _libUnderscore.events.length - libParam193,
        libParam192.resolve(
          _libUnderscore.events.slice(libParam193),
          _libUnderscore,
        ),
      );
    libParam192.resolveTo &&
      (_libUnderscore.events = libParam192.resolveTo(
        _libUnderscore.events,
        _libUnderscore,
      ));
  }
  function libHelper153() {
    let libValue238 = _libC(),
      libValue239 = _libUnderscore.previous,
      __libY = _libUnderscore.currentConstruct,
      libValue240 = _libUnderscore.events.length,
      libValue241 = Array.from(libValue72);
    return {
      from: libValue240,
      restore: libHelper299,
    };
    function libHelper299() {
      libValue68 = libValue238;
      _libUnderscore.previous = libValue239;
      _libUnderscore.currentConstruct = __libY;
      _libUnderscore.events.length = libValue240;
      libValue72 = libValue241;
      _libS();
    }
  }
  function _libS() {
    libValue68.line in libValue69 &&
      libValue68.column < 2 &&
      ((libValue68.column = libValue69[libValue68.line]),
      (libValue68.offset += libValue69[libValue68.line] - 1));
  }
}
function libHelper68(libParam131, libParam132) {
  let _libY = libParam132.start._index,
    libValue227 = libParam132.start._bufferIndex,
    libValue228 = libParam132.end._index,
    libValue229 = libParam132.end._bufferIndex,
    libValue230;
  if (_libY === libValue228)
    libValue230 = [libParam131[_libY].slice(libValue227, libValue229)];
  else {
    if (
      ((libValue230 = libParam131.slice(_libY, libValue228)), libValue227 > -1)
    ) {
      let libValue331 = libValue230[0];
      typeof libValue331 == "string"
        ? (libValue230[0] = libValue331.slice(libValue227))
        : libValue230.shift();
    }
    libValue229 > 0 &&
      libValue230.push(libParam131[libValue228].slice(0, libValue229));
  }
  return libValue230;
}
function libHelper69(libParam84, libParam85) {
  let _libY = -1,
    libValue200 = [],
    libValue201;
  for (; ++_libY < libParam84.length; ) {
    let libValue213 = libParam84[_libY],
      libValue214;
    if (typeof libValue213 == "string") libValue214 = libValue213;
    else
      switch (libValue213) {
        case -5:
          libValue214 = "\r";
          break;
        case -4:
          libValue214 = "\n";
          break;
        case -3:
          libValue214 = "\r\n";
          break;
        case -2:
          libValue214 = libParam85 ? " " : "\t";
          break;
        case -1:
          if (!libParam85 && libValue201) continue;
          libValue214 = " ";
          break;
        default:
          libValue214 = String.fromCharCode(libValue213);
      }
    libValue201 = libValue213 === -2;
    libValue200.push(libValue214);
  }
  return libValue200.join("");
}
function libHelper70(libParam155) {
  let libValue249 = {
    constructs: libUnderscore([
      libValue49,
      ...((libParam155 || {}).extensions || []),
    ]),
    content: _libY(libValue8),
    defined: [],
    document: _libY(libValue9),
    flow: _libY(libValue45),
    lazy: {},
    string: _libY(libValue47),
    text: _libY(libValue48),
  };
  return libValue249;
  function _libY(libParam362) {
    return __libY;
    function __libY(___libY) {
      return libHelper67(libValue249, libParam362, ___libY);
    }
  }
}
function libHelper71(libParam436) {
  for (; !libHelper30(libParam436); );
  return libParam436;
}
var libValue59 = /[\0\t\n\r]/g;
function libHelper72() {
  let libValue137 = 1,
    libValue138 = "",
    _libY = true,
    libValue139;
  return libHelper204;
  function libHelper204(libParam35, libParam36, libParam37) {
    let libValue144 = [],
      _libV,
      libValue145,
      libValue146,
      _libUnderscore,
      libValue147;
    for (
      libParam35 =
        libValue138 +
        (typeof libParam35 == "string"
          ? libParam35.toString()
          : new TextDecoder(libParam36 || undefined).decode(libParam35)),
        libValue146 = 0,
        libValue138 = "",
        _libY &&=
          (libParam35.charCodeAt(0) === 65279 && libValue146++, undefined);
      libValue146 < libParam35.length;
    ) {
      if (
        ((libValue59.lastIndex = libValue146),
        (_libV = libValue59.exec(libParam35)),
        (_libUnderscore =
          _libV && _libV.index !== undefined ? _libV.index : libParam35.length),
        (libValue147 = libParam35.charCodeAt(_libUnderscore)),
        !_libV)
      ) {
        libValue138 = libParam35.slice(libValue146);
        break;
      }
      if (libValue147 === 10 && libValue146 === _libUnderscore && libValue139) {
        libValue144.push(-3);
        libValue139 = undefined;
      } else
        switch (
          ((libValue139 &&= (libValue144.push(-5), undefined)),
          libValue146 < _libUnderscore &&
            (libValue144.push(libParam35.slice(libValue146, _libUnderscore)),
            (libValue137 += _libUnderscore - libValue146)),
          libValue147)
        ) {
          case 0:
            libValue144.push(65533);
            libValue137++;
            break;
          case 9:
            for (
              libValue145 = Math.ceil(libValue137 / 4) * 4,
                libValue144.push(-2);
              libValue137++ < libValue145;
            )
              libValue144.push(-1);
            break;
          case 10:
            libValue144.push(-4);
            libValue137 = 1;
            break;
          default:
            libValue139 = true;
            libValue137 = 1;
        }
      libValue146 = _libUnderscore + 1;
    }
    return (
      libParam37 &&
        (libValue139 && libValue144.push(-5),
        libValue138 && libValue144.push(libValue138),
        libValue144.push(null)),
      libValue144
    );
  }
}
var libValue60 =
  /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
function libR(libParam441) {
  return libParam441.replace(libValue60, libHelper73);
}
function libHelper73(libParam208, libParam209, _libY) {
  if (libParam209) return libParam209;
  if (_libY.charCodeAt(0) === 35) {
    let libValue301 = _libY.charCodeAt(1),
      libValue302 = libValue301 === 120 || libValue301 === 88;
    return libHelper8(_libY.slice(libValue302 ? 2 : 1), libValue302 ? 16 : 10);
  }
  return libHelper4(_libY) || libParam208;
}
function libN(libParam180) {
  return !libParam180 || typeof libParam180 != "object"
    ? ""
    : "position" in libParam180 || "type" in libParam180
      ? libHelper75(libParam180.position)
      : "start" in libParam180 || "end" in libParam180
        ? libHelper75(libParam180)
        : "line" in libParam180 || "column" in libParam180
          ? libHelper74(libParam180)
          : "";
}
function libHelper74(libParam389) {
  return (
    libHelper76(libParam389 && libParam389.line) +
    ":" +
    libHelper76(libParam389 && libParam389.column)
  );
}
function libHelper75(libParam391) {
  return (
    libHelper74(libParam391 && libParam391.start) +
    "-" +
    libHelper74(libParam391 && libParam391.end)
  );
}
function libHelper76(libParam409) {
  return libParam409 && typeof libParam409 == "number" ? libParam409 : 1;
}
var $t = {}.hasOwnProperty;
export function libT(libParam210, libParam211, _libY) {
  return (
    libParam211 &&
      typeof libParam211 == "object" &&
      ((_libY = libParam211), (libParam211 = undefined)),
    libHelper77(_libY)(
      libHelper71(
        libHelper70(_libY)
          .document()
          .write(libHelper72()(libParam210, libParam211, true)),
      ),
    )
  );
}
function libHelper77(libParam1) {
  let libValue61 = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: libHelper83(libHelper119),
      autolinkProtocol: _libS,
      autolinkEmail: _libS,
      atxHeading: libHelper83(libHelper115),
      blockQuote: libHelper83(libHelper110),
      characterEscape: _libS,
      characterReference: _libS,
      codeFenced: libHelper83(libHelper111),
      codeFencedFenceInfo: _libV,
      codeFencedFenceMeta: _libV,
      codeIndented: libHelper83(libHelper111, _libV),
      codeText: libHelper83(libHelper112, _libV),
      codeTextData: _libS,
      data: _libS,
      codeFlowValue: _libS,
      definition: libHelper83(libHelper113),
      definitionDestinationString: _libV,
      definitionLabelString: _libV,
      definitionTitleString: _libV,
      emphasis: libHelper83(libHelper114),
      hardBreakEscape: libHelper83(libHelper116),
      hardBreakTrailing: libHelper83(libHelper116),
      htmlFlow: libHelper83(libHelper117, _libV),
      htmlFlowData: _libS,
      htmlText: libHelper83(libHelper117, _libV),
      htmlTextData: _libS,
      image: libHelper83(libHelper118),
      label: _libV,
      link: libHelper83(libHelper119),
      listItem: libHelper83(libHelper121),
      listItemValue: _libC,
      listOrdered: libHelper83(libHelper120, libHelper87),
      listUnordered: libHelper83(libHelper120),
      paragraph: libHelper83(libHelper122),
      reference: libHelper104,
      referenceString: _libV,
      resourceDestinationString: _libV,
      resourceTitleString: _libV,
      setextHeading: libHelper83(libHelper115),
      strong: libHelper83(libHelper123),
      thematicBreak: libHelper83(_e),
    },
    exit: {
      atxHeading: libHelper85(),
      atxHeadingSequence: _libP,
      autolink: libHelper85(),
      autolinkEmail: libHelper109,
      autolinkProtocol: libHelper108,
      blockQuote: libHelper85(),
      characterEscapeValue: libHelper93,
      characterReferenceMarkerHexadecimal: libHelper105,
      characterReferenceMarkerNumeric: libHelper105,
      characterReferenceValue: libHelper106,
      characterReference: libHelper107,
      codeFenced: libHelper85(libHelper89),
      codeFencedFence: _libU,
      codeFencedFenceInfo: _libL,
      codeFencedFenceMeta: libHelper88,
      codeFlowValue: libHelper93,
      codeIndented: libHelper85(libHelper90),
      codeText: libHelper85(libHelper98),
      codeTextData: libHelper93,
      data: libHelper93,
      definition: libHelper85(),
      definitionDestinationString: _libF,
      definitionLabelString: libHelper91,
      definitionTitleString: _libD,
      emphasis: libHelper85(),
      hardBreakEscape: libHelper85(libHelper95),
      hardBreakTrailing: libHelper85(libHelper95),
      htmlFlow: libHelper85(libHelper96),
      htmlFlowData: libHelper93,
      htmlText: libHelper85(libHelper97),
      htmlTextData: libHelper93,
      image: libHelper85(_libA),
      label: libHelper100,
      labelText: libHelper99,
      lineEnding: libHelper94,
      link: libHelper85(_libO),
      listItem: libHelper85(),
      listOrdered: libHelper85(),
      listUnordered: libHelper85(),
      paragraph: libHelper85(),
      referenceString: _libI,
      resourceDestinationString: libHelper101,
      resourceTitleString: libHelper102,
      resource: libHelper103,
      setextHeading: libHelper85(libHelper92),
      setextHeadingLineSequence: _libH,
      setextHeadingText: _libM,
      strong: libHelper85(),
      thematicBreak: libHelper85(),
    },
  };
  libHelper78(libValue61, (libParam1 || {}).mdastExtensions || []);
  let libValue62 = {};
  return libHelper81;
  function libHelper81(libParam38) {
    let _libY = {
        type: "root",
        children: [],
      },
      libValue148 = {
        stack: [_libY],
        tokenStack: [],
        config: libValue61,
        enter: libHelper84,
        exit: _libUnderscore,
        buffer: _libV,
        resume: libHelper86,
        data: libValue62,
      },
      libValue149 = [],
      libValue150 = -1;
    for (; ++libValue150 < libParam38.length; )
      (libParam38[libValue150][1].type === "listOrdered" ||
        libParam38[libValue150][1].type === "listUnordered") &&
        (libParam38[libValue150][0] === "enter"
          ? libValue149.push(libValue150)
          : (libValue150 = libHelper82(
              libParam38,
              libValue149.pop(),
              libValue150,
            )));
    for (libValue150 = -1; ++libValue150 < libParam38.length; ) {
      let __libY = libValue61[libParam38[libValue150][0]];
      $t.call(__libY, libParam38[libValue150][1].type) &&
        __libY[libParam38[libValue150][1].type].call(
          Object.assign(
            {
              sliceSerialize: libParam38[libValue150][2].sliceSerialize,
            },
            libValue148,
          ),
          libParam38[libValue150][1],
        );
    }
    if (libValue148.tokenStack.length > 0) {
      let libValue325 =
        libValue148.tokenStack[libValue148.tokenStack.length - 1];
      (libValue325[1] || libHelper80).call(
        libValue148,
        undefined,
        libValue325[0],
      );
    }
    for (
      _libY.position = {
        start: $(
          libParam38.length > 0
            ? libParam38[0][1].start
            : {
                line: 1,
                column: 1,
                offset: 0,
              },
        ),
        end: $(
          libParam38.length > 0
            ? libParam38[libParam38.length - 2][1].end
            : {
                line: 1,
                column: 1,
                offset: 0,
              },
        ),
      },
        libValue150 = -1;
      ++libValue150 < libValue61.transforms.length;
    )
      _libY = libValue61.transforms[libValue150](_libY) || _libY;
    return _libY;
  }
  function libHelper82(libParam13, libParam14, _libY) {
    let libValue98 = libParam14 - 1,
      libValue99 = -1,
      libValue100 = false,
      libValue101,
      libValue102,
      __libV,
      libValue103;
    for (; ++libValue98 <= _libY; ) {
      let libValue104 = libParam13[libValue98];
      switch (libValue104[1].type) {
        case "listUnordered":
        case "listOrdered":
        case "blockQuote":
          libValue104[0] === "enter" ? libValue99++ : libValue99--;
          libValue103 = undefined;
          break;
        case "lineEndingBlank":
          libValue104[0] === "enter" &&
            (libValue101 &&
              !libValue103 &&
              !libValue99 &&
              !__libV &&
              (__libV = libValue98),
            (libValue103 = undefined));
          break;
        case "linePrefix":
        case "listItemValue":
        case "listItemMarker":
        case "listItemPrefix":
        case "listItemPrefixWhitespace":
          break;
        default:
          libValue103 = undefined;
      }
      if (
        (!libValue99 &&
          libValue104[0] === "enter" &&
          libValue104[1].type === "listItemPrefix") ||
        (libValue99 === -1 &&
          libValue104[0] === "exit" &&
          (libValue104[1].type === "listUnordered" ||
            libValue104[1].type === "listOrdered"))
      ) {
        if (libValue101) {
          let libValue170 = libValue98;
          for (libValue102 = undefined; libValue170--; ) {
            let libValue198 = libParam13[libValue170];
            if (
              libValue198[1].type === "lineEnding" ||
              libValue198[1].type === "lineEndingBlank"
            ) {
              if (libValue198[0] === "exit") continue;
              libValue102 &&
                ((libParam13[libValue102][1].type = "lineEndingBlank"),
                (libValue100 = true));
              libValue198[1].type = "lineEnding";
              libValue102 = libValue170;
            } else if (
              !(
                libValue198[1].type === "linePrefix" ||
                libValue198[1].type === "blockQuotePrefix" ||
                libValue198[1].type === "blockQuotePrefixWhitespace" ||
                libValue198[1].type === "blockQuoteMarker" ||
                libValue198[1].type === "listItemIndent"
              )
            )
              break;
          }
          __libV &&
            (!libValue102 || __libV < libValue102) &&
            (libValue101._spread = true);
          libValue101.end = Object.assign(
            {},
            libValue102 ? libParam13[libValue102][1].start : libValue104[1].end,
          );
          libParam13.splice(libValue102 || libValue98, 0, [
            "exit",
            libValue101,
            libValue104[2],
          ]);
          libValue98++;
          _libY++;
        }
        if (libValue104[1].type === "listItemPrefix") {
          let libValue244 = {
            type: "listItem",
            _spread: false,
            start: Object.assign({}, libValue104[1].start),
            end: undefined,
          };
          libValue101 = libValue244;
          libParam13.splice(libValue98, 0, [
            "enter",
            libValue244,
            libValue104[2],
          ]);
          libValue98++;
          _libY++;
          __libV = undefined;
          libValue103 = true;
        }
      }
    }
    return ((libParam13[libParam14][1]._spread = libValue100), _libY);
  }
  function libHelper83(libParam321, libParam322) {
    return _libY;
    function _libY(__libY) {
      libHelper84.call(this, libParam321(__libY), __libY);
      libParam322 && libParam322.call(this, __libY);
    }
  }
  function _libV() {
    this.stack.push({
      type: "fragment",
      children: [],
    });
  }
  function libHelper84(libParam205, libParam206, _libY) {
    this.stack[this.stack.length - 1].children.push(libParam205);
    this.stack.push(libParam205);
    this.tokenStack.push([libParam206, _libY || undefined]);
    libParam205.position = {
      start: $(libParam206.start),
      end: undefined,
    };
  }
  function libHelper85(libParam325) {
    return libHelper316;
    function libHelper316(libParam392) {
      libParam325 && libParam325.call(this, libParam392);
      _libUnderscore.call(this, libParam392);
    }
  }
  function _libUnderscore(libParam117, libParam118) {
    let _libY = this.stack.pop(),
      libValue223 = this.tokenStack.pop();
    if (libValue223)
      libValue223[0].type !== libParam117.type &&
        (libParam118
          ? libParam118.call(this, libParam117, libValue223[0])
          : (libValue223[1] || libHelper80).call(
              this,
              libParam117,
              libValue223[0],
            ));
    else
      throw Error(
        "Cannot close `" +
          libParam117.type +
          "` (" +
          libN({
            start: libParam117.start,
            end: libParam117.end,
          }) +
          "): it’s not open",
      );
    _libY.position.end = $(libParam117.end);
  }
  function libHelper86() {
    return libY(this.stack.pop());
  }
  function libHelper87() {
    this.data.expectingFirstListItemValue = true;
  }
  function _libC(libParam181) {
    if (this.data.expectingFirstListItemValue) {
      let libValue277 = this.stack[this.stack.length - 2];
      libValue277.start = Number.parseInt(this.sliceSerialize(libParam181), 10);
      this.data.expectingFirstListItemValue = undefined;
    }
  }
  function _libL() {
    let libValue316 = this.resume(),
      libValue317 = this.stack[this.stack.length - 1];
    libValue317.lang = libValue316;
  }
  function libHelper88() {
    let libValue318 = this.resume(),
      libValue319 = this.stack[this.stack.length - 1];
    libValue319.meta = libValue318;
  }
  function _libU() {
    this.data.flowCodeInside ||
      (this.buffer(), (this.data.flowCodeInside = true));
  }
  function libHelper89() {
    let libValue271 = this.resume(),
      libValue272 = this.stack[this.stack.length - 1];
    libValue272.value = libValue271.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    this.data.flowCodeInside = undefined;
  }
  function libHelper90() {
    let libValue291 = this.resume(),
      libValue292 = this.stack[this.stack.length - 1];
    libValue292.value = libValue291.replace(/(\r?\n|\r)$/g, "");
  }
  function libHelper91(libParam258) {
    let libValue281 = this.resume(),
      _libY = this.stack[this.stack.length - 1];
    _libY.label = libValue281;
    _libY.identifier = libG(this.sliceSerialize(libParam258)).toLowerCase();
  }
  function _libD() {
    let libValue306 = this.resume(),
      libValue307 = this.stack[this.stack.length - 1];
    libValue307.title = libValue306;
  }
  function _libF() {
    let libValue320 = this.resume(),
      libValue321 = this.stack[this.stack.length - 1];
    libValue321.url = libValue320;
  }
  function _libP(libParam324) {
    let libValue303 = this.stack[this.stack.length - 1];
    libValue303.depth ||= this.sliceSerialize(libParam324).length;
  }
  function _libM() {
    this.data.setextHeadingSlurpLineEnding = true;
  }
  function _libH(libParam294) {
    let libValue293 = this.stack[this.stack.length - 1];
    libValue293.depth =
      this.sliceSerialize(libParam294).codePointAt(0) === 61 ? 1 : 2;
  }
  function libHelper92() {
    this.data.setextHeadingSlurpLineEnding = undefined;
  }
  function _libS(libParam171) {
    let libValue257 = this.stack[this.stack.length - 1].children,
      _libY = libValue257[libValue257.length - 1];
    (!_libY || _libY.type !== "text") &&
      ((_libY = libHelper124()),
      (_libY.position = {
        start: $(libParam171.start),
        end: undefined,
      }),
      libValue257.push(_libY));
    this.stack.push(_libY);
  }
  function libHelper93(libParam308) {
    let libValue297 = this.stack.pop();
    libValue297.value += this.sliceSerialize(libParam308);
    libValue297.position.end = $(libParam308.end);
  }
  function libHelper94(libParam129) {
    let _libY = this.stack[this.stack.length - 1];
    if (this.data.atHardBreak) {
      let libValue288 = _libY.children[_libY.children.length - 1];
      libValue288.position.end = $(libParam129.end);
      this.data.atHardBreak = undefined;
      return;
    }
    !this.data.setextHeadingSlurpLineEnding &&
      libValue61.canContainEols.includes(_libY.type) &&
      (_libS.call(this, libParam129), libHelper93.call(this, libParam129));
  }
  function libHelper95() {
    this.data.atHardBreak = true;
  }
  function libHelper96() {
    let libValue308 = this.resume(),
      libValue309 = this.stack[this.stack.length - 1];
    libValue309.value = libValue308;
  }
  function libHelper97() {
    let libValue310 = this.resume(),
      libValue311 = this.stack[this.stack.length - 1];
    libValue311.value = libValue310;
  }
  function libHelper98() {
    let libValue312 = this.resume(),
      libValue313 = this.stack[this.stack.length - 1];
    libValue313.value = libValue312;
  }
  function _libO() {
    let libValue234 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let libValue282 = this.data.referenceType || "shortcut";
      libValue234.type += "Reference";
      libValue234.referenceType = libValue282;
      delete libValue234.url;
      delete libValue234.title;
    } else {
      delete libValue234.identifier;
      delete libValue234.label;
    }
    this.data.referenceType = undefined;
  }
  function _libA() {
    let libValue235 = this.stack[this.stack.length - 1];
    if (this.data.inReference) {
      let libValue283 = this.data.referenceType || "shortcut";
      libValue235.type += "Reference";
      libValue235.referenceType = libValue283;
      delete libValue235.url;
      delete libValue235.title;
    } else {
      delete libValue235.identifier;
      delete libValue235.label;
    }
    this.data.referenceType = undefined;
  }
  function libHelper99(libParam270) {
    let libValue285 = this.sliceSerialize(libParam270),
      _libY = this.stack[this.stack.length - 2];
    _libY.label = libR(libValue285);
    _libY.identifier = libG(libValue285).toLowerCase();
  }
  function libHelper100() {
    let libValue264 = this.stack[this.stack.length - 1],
      libValue265 = this.resume(),
      _libY = this.stack[this.stack.length - 1];
    this.data.inReference = true;
    _libY.type === "link"
      ? (_libY.children = libValue264.children)
      : (_libY.alt = libValue265);
  }
  function libHelper101() {
    let libValue322 = this.resume(),
      libValue323 = this.stack[this.stack.length - 1];
    libValue323.url = libValue322;
  }
  function libHelper102() {
    let libValue314 = this.resume(),
      libValue315 = this.stack[this.stack.length - 1];
    libValue315.title = libValue314;
  }
  function libHelper103() {
    this.data.inReference = undefined;
  }
  function libHelper104() {
    this.data.referenceType = "collapsed";
  }
  function _libI(libParam203) {
    let libValue269 = this.resume(),
      _libY = this.stack[this.stack.length - 1];
    _libY.label = libValue269;
    _libY.identifier = libG(this.sliceSerialize(libParam203)).toLowerCase();
    this.data.referenceType = "full";
  }
  function libHelper105(libParam399) {
    this.data.characterReferenceType = libParam399.type;
  }
  function libHelper106(libParam147) {
    let libValue245 = this.sliceSerialize(libParam147),
      _libY = this.data.characterReferenceType,
      libValue246;
    _libY
      ? ((libValue246 = libHelper8(
          libValue245,
          _libY === "characterReferenceMarkerNumeric" ? 10 : 16,
        )),
        (this.data.characterReferenceType = undefined))
      : (libValue246 = libHelper4(libValue245));
    let libValue247 = this.stack[this.stack.length - 1];
    libValue247.value += libValue246;
  }
  function libHelper107(libParam368) {
    let libValue335 = this.stack.pop();
    libValue335.position.end = $(libParam368.end);
  }
  function libHelper108(libParam304) {
    libHelper93.call(this, libParam304);
    let libValue295 = this.stack[this.stack.length - 1];
    libValue295.url = this.sliceSerialize(libParam304);
  }
  function libHelper109(libParam291) {
    libHelper93.call(this, libParam291);
    let libValue290 = this.stack[this.stack.length - 1];
    libValue290.url = "mailto:" + this.sliceSerialize(libParam291);
  }
  function libHelper110() {
    return {
      type: "blockquote",
      children: [],
    };
  }
  function libHelper111() {
    return {
      type: "code",
      lang: null,
      meta: null,
      value: "",
    };
  }
  function libHelper112() {
    return {
      type: "inlineCode",
      value: "",
    };
  }
  function libHelper113() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: "",
    };
  }
  function libHelper114() {
    return {
      type: "emphasis",
      children: [],
    };
  }
  function libHelper115() {
    return {
      type: "heading",
      depth: 0,
      children: [],
    };
  }
  function libHelper116() {
    return {
      type: "break",
    };
  }
  function libHelper117() {
    return {
      type: "html",
      value: "",
    };
  }
  function libHelper118() {
    return {
      type: "image",
      title: null,
      url: "",
      alt: null,
    };
  }
  function libHelper119() {
    return {
      type: "link",
      title: null,
      url: "",
      children: [],
    };
  }
  function libHelper120(libParam266) {
    return {
      type: "list",
      ordered: libParam266.type === "listOrdered",
      start: null,
      spread: libParam266._spread,
      children: [],
    };
  }
  function libHelper121(libParam327) {
    return {
      type: "listItem",
      spread: libParam327._spread,
      checked: null,
      children: [],
    };
  }
  function libHelper122() {
    return {
      type: "paragraph",
      children: [],
    };
  }
  function libHelper123() {
    return {
      type: "strong",
      children: [],
    };
  }
  function libHelper124() {
    return {
      type: "text",
      value: "",
    };
  }
  function _e() {
    return {
      type: "thematicBreak",
    };
  }
}
function $(libParam369) {
  return {
    line: libParam369.line,
    column: libParam369.column,
    offset: libParam369.offset,
  };
}
function libHelper78(libParam298, libParam299) {
  let _libY = -1;
  for (; ++_libY < libParam299.length; ) {
    let libValue336 = libParam299[_libY];
    Array.isArray(libValue336)
      ? libHelper78(libParam298, libValue336)
      : libHelper79(libParam298, libValue336);
  }
}
function libHelper79(libParam107, libParam108) {
  let _libY;
  for (_libY in libParam108)
    if ($t.call(libParam108, _libY))
      switch (_libY) {
        case "canContainEols": {
          let libValue333 = libParam108[_libY];
          libValue333 && libParam107[_libY].push(...libValue333);
          break;
        }
        case "transforms": {
          let libValue334 = libParam108[_libY];
          libValue334 && libParam107[_libY].push(...libValue334);
          break;
        }
        case "enter":
        case "exit": {
          let libValue328 = libParam108[_libY];
          libValue328 && Object.assign(libParam107[_libY], libValue328);
          break;
        }
      }
}
function libHelper80(libParam101, libParam102) {
  throw libParam101
    ? Error(
        "Cannot close `" +
          libParam101.type +
          "` (" +
          libN({
            start: libParam101.start,
            end: libParam101.end,
          }) +
          "): a different token (`" +
          libParam102.type +
          "`, " +
          libN({
            start: libParam102.start,
            end: libParam102.end,
          }) +
          ") is open",
      )
    : Error(
        "Cannot close document, a token (`" +
          libParam102.type +
          "`, " +
          libN({
            start: libParam102.start,
            end: libParam102.end,
          }) +
          ") is still open",
      );
}
export {
  libUnderscore,
  libA,
  libC,
  libD,
  libF,
  libG,
  libH,
  libI,
  libL,
  libM,
  libN,
  libO,
  libP,
  libR,
  libS,
  libU,
  libV,
  libY,
};
