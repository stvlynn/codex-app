// Restored from ref/webview/assets/core-CpC1jq0N.js
// Core chunk restored from the Codex webview bundle.
import { chunkT } from "./esbuild-runtime-helpers";
export const Core = chunkT((coreParam1, _Core) => {
  function coreHelper1(coreParam17) {
    return (
      coreParam17 instanceof Map
        ? (coreParam17.clear =
            coreParam17.delete =
            coreParam17.set =
              function () {
                throw Error("map is read-only");
              })
        : coreParam17 instanceof Set &&
          (coreParam17.add =
            coreParam17.clear =
            coreParam17.delete =
              function () {
                throw Error("set is read-only");
              }),
      Object.freeze(coreParam17),
      Object.getOwnPropertyNames(coreParam17).forEach((__Core) => {
        let coreValue126 = coreParam17[__Core],
          coreValue127 = typeof coreValue126;
        (coreValue127 === "object" || coreValue127 === "function") &&
          !Object.isFrozen(coreValue126) &&
          coreHelper1(coreValue126);
      }),
      coreParam17
    );
  }
  var coreValue1 = class {
    constructor(coreParam60) {
      coreParam60.data === undefined && (coreParam60.data = {});
      this.data = coreParam60.data;
      this.isMatchIgnored = false;
    }
    ignoreMatch() {
      this.isMatchIgnored = true;
    }
  };
  function coreHelper2(coreParam56) {
    return coreParam56
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  function coreHelper3(coreParam50, ...__Core) {
    let coreValue123 = Object.create(null);
    for (let ___Core in coreParam50)
      coreValue123[___Core] = coreParam50[___Core];
    return (
      __Core.forEach(function (item) {
        for (let ___Core in item) coreValue123[___Core] = item[___Core];
      }),
      coreValue123
    );
  }
  var coreValue3 = (coreParam112) => !!coreParam112.scope,
    coreValue4 = (coreParam38, { prefix: __Core }) => {
      if (coreParam38.startsWith("language:"))
        return coreParam38.replace("language:", "language-");
      if (coreParam38.includes(".")) {
        let coreValue125 = coreParam38.split(".");
        return [
          `${__Core}${coreValue125.shift()}`,
          ...coreValue125.map(
            (item, ___Core) => `${item}${"_".repeat(___Core + 1)}`,
          ),
        ].join(" ");
      }
      return `${__Core}${coreParam38}`;
    },
    coreValue5 = class {
      constructor(coreParam69, __Core) {
        this.buffer = "";
        this.classPrefix = __Core.classPrefix;
        coreParam69.walk(this);
      }
      addText(coreParam103) {
        this.buffer += coreHelper2(coreParam103);
      }
      openNode(coreParam63) {
        if (!coreValue3(coreParam63)) return;
        let __Core = coreValue4(coreParam63.scope, {
          prefix: this.classPrefix,
        });
        this.span(__Core);
      }
      closeNode(coreParam99) {
        coreValue3(coreParam99) && (this.buffer += "</span>");
      }
      value() {
        return this.buffer;
      }
      span(coreParam91) {
        this.buffer += `<span class="${coreParam91}">`;
      }
    },
    coreValue6 = (coreParam76 = {}) => {
      let __Core = {
        children: [],
      };
      return (Object.assign(__Core, coreParam76), __Core);
    },
    coreValue7 = class CoreClass3 {
      constructor() {
        this.rootNode = coreValue6();
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      add(coreParam101) {
        this.top.children.push(coreParam101);
      }
      openNode(coreParam73) {
        let __Core = coreValue6({
          scope: coreParam73,
        });
        this.add(__Core);
        this.stack.push(__Core);
      }
      closeNode() {
        if (this.stack.length > 1) return this.stack.pop();
      }
      closeAllNodes() {
        for (; this.closeNode(); );
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      walk(coreParam86) {
        return this.constructor._walk(coreParam86, this.rootNode);
      }
      static _walk(coreParam44, __Core) {
        return (
          typeof __Core == "string"
            ? coreParam44.addText(__Core)
            : __Core.children &&
              (coreParam44.openNode(__Core),
              __Core.children.forEach((___Core) =>
                this._walk(coreParam44, ___Core),
              ),
              coreParam44.closeNode(__Core)),
          coreParam44
        );
      }
      static _collapse(__Core) {
        typeof __Core != "string" &&
          __Core.children &&
          (__Core.children.every((item) => typeof item == "string")
            ? (__Core.children = [__Core.children.join("")])
            : __Core.children.forEach((___Core) => {
                CoreClass3._collapse(___Core);
              }));
      }
    },
    coreValue8 = class extends coreValue7 {
      constructor(coreParam92) {
        super();
        this.options = coreParam92;
      }
      addText(coreParam100) {
        coreParam100 !== "" && this.add(coreParam100);
      }
      startScope(coreParam104) {
        this.openNode(coreParam104);
      }
      endScope() {
        this.closeNode();
      }
      __addSublanguage(coreParam67, __Core) {
        let coreValue130 = coreParam67.root;
        __Core && (coreValue130.scope = `language:${__Core}`);
        this.add(coreValue130);
      }
      toHTML() {
        return new coreValue5(this, this.options).value();
      }
      finalize() {
        return (this.closeAllNodes(), true);
      }
    };
  function coreHelper4(coreParam83) {
    return coreParam83
      ? typeof coreParam83 == "string"
        ? coreParam83
        : coreParam83.source
      : null;
  }
  function coreHelper5(coreParam107) {
    return coreHelper8("(?=", coreParam107, ")");
  }
  function coreHelper6(coreParam105) {
    return coreHelper8("(?:", coreParam105, ")*");
  }
  function coreHelper7(coreParam106) {
    return coreHelper8("(?:", coreParam106, ")?");
  }
  function coreHelper8(...coreParam94) {
    return coreParam94.map((item) => coreHelper4(item)).join("");
  }
  function coreHelper9(coreParam58) {
    let __Core = coreParam58[coreParam58.length - 1];
    return typeof __Core == "object" && __Core.constructor === Object
      ? (coreParam58.splice(coreParam58.length - 1, 1), __Core)
      : {};
  }
  function coreHelper10(...coreParam64) {
    return (
      "(" +
      (coreHelper9(coreParam64).capture ? "" : "?:") +
      coreParam64.map((item) => coreHelper4(item)).join("|") +
      ")"
    );
  }
  function coreHelper11(coreParam84) {
    return RegExp(coreParam84.toString() + "|").exec("").length - 1;
  }
  function coreHelper12(coreParam82, __Core) {
    let coreValue135 = coreParam82 && coreParam82.exec(__Core);
    return coreValue135 && coreValue135.index === 0;
  }
  var coreValue9 = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
  function coreHelper13(coreParam20, { joinWith: __Core }) {
    let coreValue94 = 0;
    return coreParam20
      .map((item) => {
        coreValue94 += 1;
        let ___Core = coreValue94,
          coreValue103 = coreHelper4(item),
          coreValue104 = "";
        for (; coreValue103.length > 0; ) {
          let coreValue109 = coreValue9.exec(coreValue103);
          if (!coreValue109) {
            coreValue104 += coreValue103;
            break;
          }
          coreValue104 += coreValue103.substring(0, coreValue109.index);
          coreValue103 = coreValue103.substring(
            coreValue109.index + coreValue109[0].length,
          );
          coreValue109[0][0] === "\\" && coreValue109[1]
            ? (coreValue104 += "\\" + String(Number(coreValue109[1]) + ___Core))
            : ((coreValue104 += coreValue109[0]),
              coreValue109[0] === "(" && coreValue94++);
        }
        return coreValue104;
      })
      .map((item) => `(${item})`)
      .join(__Core);
  }
  var coreValue10 = /\b\B/,
    coreValue17 = (coreParam36 = {}) => {
      let __Core = /^#![ ]*\//;
      return (
        coreParam36.binary &&
          (coreParam36.begin = coreHelper8(
            __Core,
            /.*\b/,
            coreParam36.binary,
            /\b.*/,
          )),
        coreHelper3(
          {
            scope: "meta",
            begin: __Core,
            end: /$/,
            relevance: 0,
            "on:begin": (coreParam87, ___Core) => {
              coreParam87.index !== 0 && ___Core.ignoreMatch();
            },
          },
          coreParam36,
        )
      );
    },
    coreValue18 = {
      begin: "\\\\[\\s\\S]",
      relevance: 0,
    },
    coreValue19 = {
      scope: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [coreValue18],
    },
    coreValue20 = {
      scope: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [coreValue18],
    },
    coreValue21 = {
      begin:
        /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/,
    },
    coreValue22 = function (coreParam13, __Core, coreParam14 = {}) {
      let coreValue81 = coreHelper3(
        {
          scope: "comment",
          begin: coreParam13,
          end: __Core,
          contains: [],
        },
        coreParam14,
      );
      coreValue81.contains.push({
        scope: "doctag",
        begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
        end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
        excludeBegin: true,
        relevance: 0,
      });
      let coreValue82 = coreHelper10(
        "I",
        "a",
        "is",
        "so",
        "us",
        "to",
        "at",
        "if",
        "in",
        "it",
        "on",
        /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
        /[A-Za-z]+[-][a-z]+/,
        /[A-Za-z][a-z]{2,}/,
      );
      return (
        coreValue81.contains.push({
          begin: coreHelper8(
            /[ ]+/,
            "(",
            coreValue82,
            /[.]?[:]?([.][ ]|[ ])/,
            "){3}",
          ),
        }),
        coreValue81
      );
    },
    coreValue23 = coreValue22("//", "$"),
    coreValue24 = coreValue22("/\\*", "\\*/"),
    coreValue25 = coreValue22("#", "$"),
    coreValue26 = {
      scope: "number",
      begin: "\\b\\d+(\\.\\d+)?",
      relevance: 0,
    },
    coreValue27 = {
      scope: "number",
      begin:
        "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
      relevance: 0,
    },
    coreValue28 = {
      scope: "number",
      begin: "\\b(0b[01]+)",
      relevance: 0,
    },
    coreValue29 = {
      scope: "regexp",
      begin: /\/(?=[^/\n]*\/)/,
      end: /\/[gimuy]*/,
      contains: [
        coreValue18,
        {
          begin: /\[/,
          end: /\]/,
          relevance: 0,
          contains: [coreValue18],
        },
      ],
    },
    coreValue30 = {
      scope: "title",
      begin: "[a-zA-Z]\\w*",
      relevance: 0,
    },
    coreValue31 = {
      scope: "title",
      begin: "[a-zA-Z_]\\w*",
      relevance: 0,
    },
    coreValue32 = {
      begin: "\\.\\s*[a-zA-Z_]\\w*",
      relevance: 0,
    },
    coreValue33 = Object.freeze({
      __proto__: null,
      APOS_STRING_MODE: coreValue19,
      BACKSLASH_ESCAPE: coreValue18,
      BINARY_NUMBER_MODE: coreValue28,
      BINARY_NUMBER_RE: "\\b(0b[01]+)",
      COMMENT: coreValue22,
      C_BLOCK_COMMENT_MODE: coreValue24,
      C_LINE_COMMENT_MODE: coreValue23,
      C_NUMBER_MODE: coreValue27,
      C_NUMBER_RE:
        "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",
      END_SAME_AS_BEGIN: function (coreParam45) {
        return Object.assign(coreParam45, {
          "on:begin": (coreParam95, __Core) => {
            __Core.data._beginMatch = coreParam95[1];
          },
          "on:end": (coreParam81, __Core) => {
            __Core.data._beginMatch !== coreParam81[1] && __Core.ignoreMatch();
          },
        });
      },
      HASH_COMMENT_MODE: coreValue25,
      IDENT_RE: "[a-zA-Z]\\w*",
      MATCH_NOTHING_RE: coreValue10,
      METHOD_GUARD: coreValue32,
      NUMBER_MODE: coreValue26,
      NUMBER_RE: "\\b\\d+(\\.\\d+)?",
      PHRASAL_WORDS_MODE: coreValue21,
      QUOTE_STRING_MODE: coreValue20,
      REGEXP_MODE: coreValue29,
      RE_STARTERS_RE:
        "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
      SHEBANG: coreValue17,
      TITLE_MODE: coreValue30,
      UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
      UNDERSCORE_TITLE_MODE: coreValue31,
    });
  function coreHelper14(coreParam85, __Core) {
    coreParam85.input[coreParam85.index - 1] === "." && __Core.ignoreMatch();
  }
  function coreHelper15(coreParam71, __Core) {
    coreParam71.className !== undefined &&
      ((coreParam71.scope = coreParam71.className),
      delete coreParam71.className);
  }
  function coreHelper16(coreParam40, __Core) {
    __Core &&
      coreParam40.beginKeywords &&
      ((coreParam40.begin =
        "\\b(" +
        coreParam40.beginKeywords.split(" ").join("|") +
        ")(?!\\.)(?=\\b|\\s)"),
      (coreParam40.__beforeBegin = coreHelper14),
      (coreParam40.keywords =
        coreParam40.keywords || coreParam40.beginKeywords),
      delete coreParam40.beginKeywords,
      coreParam40.relevance === undefined && (coreParam40.relevance = 0));
  }
  function coreHelper17(coreParam80, __Core) {
    Array.isArray(coreParam80.illegal) &&
      (coreParam80.illegal = coreHelper10(...coreParam80.illegal));
  }
  function coreHelper18(coreParam55, __Core) {
    if (coreParam55.match) {
      if (coreParam55.begin || coreParam55.end)
        throw Error("begin & end are not supported with match");
      coreParam55.begin = coreParam55.match;
      delete coreParam55.match;
    }
  }
  function coreHelper19(coreParam88, __Core) {
    coreParam88.relevance === undefined && (coreParam88.relevance = 1);
  }
  var coreValue34 = (coreParam28, __Core) => {
      if (!coreParam28.beforeMatch) return;
      if (coreParam28.starts)
        throw Error("beforeMatch cannot be used with starts");
      let coreValue102 = Object.assign({}, coreParam28);
      Object.keys(coreParam28).forEach((___Core) => {
        delete coreParam28[___Core];
      });
      coreParam28.keywords = coreValue102.keywords;
      coreParam28.begin = coreHelper8(
        coreValue102.beforeMatch,
        coreHelper5(coreValue102.begin),
      );
      coreParam28.starts = {
        relevance: 0,
        contains: [
          Object.assign(coreValue102, {
            endsParent: true,
          }),
        ],
      };
      coreParam28.relevance = 0;
      delete coreValue102.beforeMatch;
    },
    coreValue35 = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      "list",
      "value",
    ];
  function coreHelper20(coreParam25, __Core, coreParam26 = "keyword") {
    let coreValue98 = Object.create(null);
    return (
      typeof coreParam25 == "string"
        ? coreHelper66(coreParam26, coreParam25.split(" "))
        : Array.isArray(coreParam25)
          ? coreHelper66(coreParam26, coreParam25)
          : Object.keys(coreParam25).forEach(function (item) {
              Object.assign(
                coreValue98,
                coreHelper20(coreParam25[item], __Core, item),
              );
            }),
      coreValue98
    );
    function coreHelper66(coreParam52, coreParam53) {
      __Core && (coreParam53 = coreParam53.map((item) => item.toLowerCase()));
      coreParam53.forEach(function (___Core) {
        let coreValue133 = ___Core.split("|");
        coreValue98[coreValue133[0]] = [
          coreParam52,
          coreHelper21(coreValue133[0], coreValue133[1]),
        ];
      });
    }
  }
  function coreHelper21(coreParam90, __Core) {
    return __Core ? Number(__Core) : _e(coreParam90) ? 0 : 1;
  }
  function _e(coreParam96) {
    return coreValue35.includes(coreParam96.toLowerCase());
  }
  var coreValue37 = {},
    coreValue38 = (coreParam109) => {
      console.error(coreParam109);
    },
    coreValue39 = (coreParam98, ...__Core) => {
      console.log(`WARN: ${coreParam98}`, ...__Core);
    },
    coreValue40 = (coreParam65, __Core) => {
      coreValue37[`${coreParam65}/${__Core}`] ||
        (console.log(`Deprecated as of ${coreParam65}. ${__Core}`),
        (coreValue37[`${coreParam65}/${__Core}`] = true));
    },
    coreValue41 = Error();
  function coreHelper22(coreParam46, __Core, { key }) {
    let coreValue116 = 0,
      coreValue117 = coreParam46[key],
      coreValue118 = {},
      coreValue119 = {};
    for (let coreValue132 = 1; coreValue132 <= __Core.length; coreValue132++) {
      coreValue119[coreValue132 + coreValue116] = coreValue117[coreValue132];
      coreValue118[coreValue132 + coreValue116] = true;
      coreValue116 += coreHelper11(__Core[coreValue132 - 1]);
    }
    coreParam46[key] = coreValue119;
    coreParam46[key]._emit = coreValue118;
    coreParam46[key]._multi = true;
  }
  function coreHelper23(coreParam29) {
    if (Array.isArray(coreParam29.begin)) {
      if (
        coreParam29.skip ||
        coreParam29.excludeBegin ||
        coreParam29.returnBegin
      )
        throw (
          coreValue38(
            "skip, excludeBegin, returnBegin not compatible with beginScope: {}",
          ),
          coreValue41
        );
      if (
        typeof coreParam29.beginScope != "object" ||
        coreParam29.beginScope === null
      )
        throw (coreValue38("beginScope must be object"), coreValue41);
      coreHelper22(coreParam29, coreParam29.begin, {
        key: "beginScope",
      });
      coreParam29.begin = coreHelper13(coreParam29.begin, {
        joinWith: "",
      });
    }
  }
  function coreHelper24(coreParam34) {
    if (Array.isArray(coreParam34.end)) {
      if (coreParam34.skip || coreParam34.excludeEnd || coreParam34.returnEnd)
        throw (
          coreValue38(
            "skip, excludeEnd, returnEnd not compatible with endScope: {}",
          ),
          coreValue41
        );
      if (
        typeof coreParam34.endScope != "object" ||
        coreParam34.endScope === null
      )
        throw (coreValue38("endScope must be object"), coreValue41);
      coreHelper22(coreParam34, coreParam34.end, {
        key: "endScope",
      });
      coreParam34.end = coreHelper13(coreParam34.end, {
        joinWith: "",
      });
    }
  }
  function be(coreParam59) {
    coreParam59.scope &&
      typeof coreParam59.scope == "object" &&
      coreParam59.scope !== null &&
      ((coreParam59.beginScope = coreParam59.scope), delete coreParam59.scope);
  }
  function coreHelper25(coreParam47) {
    be(coreParam47);
    typeof coreParam47.beginScope == "string" &&
      (coreParam47.beginScope = {
        _wrap: coreParam47.beginScope,
      });
    typeof coreParam47.endScope == "string" &&
      (coreParam47.endScope = {
        _wrap: coreParam47.endScope,
      });
    coreHelper23(coreParam47);
    coreHelper24(coreParam47);
  }
  function coreHelper26(coreParam7) {
    function __Core(___Core, coreParam51) {
      return new RegExp(
        coreHelper4(___Core),
        "m" +
          (coreParam7.case_insensitive ? "i" : "") +
          (coreParam7.unicodeRegex ? "u" : "") +
          (coreParam51 ? "g" : ""),
      );
    }
    class CoreClass1 {
      constructor() {
        this.matchIndexes = {};
        this.regexes = [];
        this.matchAt = 1;
        this.position = 0;
      }
      addRule(coreParam54, ___Core) {
        ___Core.position = this.position++;
        this.matchIndexes[this.matchAt] = ___Core;
        this.regexes.push([___Core, coreParam54]);
        this.matchAt += coreHelper11(coreParam54) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        this.matcherRe = __Core(
          coreHelper13(
            this.regexes.map((item) => item[1]),
            {
              joinWith: "|",
            },
          ),
          true,
        );
        this.lastIndex = 0;
      }
      exec(coreParam42) {
        this.matcherRe.lastIndex = this.lastIndex;
        let ___Core = this.matcherRe.exec(coreParam42);
        if (!___Core) return null;
        let coreValue113 = ___Core.findIndex(
            (item, ____Core) => ____Core > 0 && item !== undefined,
          ),
          coreValue114 = this.matchIndexes[coreValue113];
        return (
          ___Core.splice(0, coreValue113),
          Object.assign(___Core, coreValue114)
        );
      }
    }
    class CoreClass2 {
      constructor() {
        this.rules = [];
        this.multiRegexes = [];
        this.count = 0;
        this.lastIndex = 0;
        this.regexIndex = 0;
      }
      getMatcher(coreParam43) {
        if (this.multiRegexes[coreParam43])
          return this.multiRegexes[coreParam43];
        let ___Core = new CoreClass1();
        return (
          this.rules
            .slice(coreParam43)
            .forEach(([coreParam110, coreParam111]) =>
              ___Core.addRule(coreParam110, coreParam111),
            ),
          ___Core.compile(),
          (this.multiRegexes[coreParam43] = ___Core),
          ___Core
        );
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      addRule(coreParam75, ___Core) {
        this.rules.push([coreParam75, ___Core]);
        ___Core.type === "begin" && this.count++;
      }
      exec(coreParam24) {
        let ___Core = this.getMatcher(this.regexIndex);
        ___Core.lastIndex = this.lastIndex;
        let coreValue96 = ___Core.exec(coreParam24);
        if (
          this.resumingScanAtSamePosition() &&
          !(coreValue96 && coreValue96.index === this.lastIndex)
        ) {
          let ____Core = this.getMatcher(0);
          ____Core.lastIndex = this.lastIndex + 1;
          coreValue96 = ____Core.exec(coreParam24);
        }
        return (
          coreValue96 &&
            ((this.regexIndex += coreValue96.position + 1),
            this.regexIndex === this.count && this.considerAll()),
          coreValue96
        );
      }
    }
    function coreHelper64(coreParam41) {
      let ___Core = new CoreClass2();
      return (
        coreParam41.contains.forEach((item) =>
          ___Core.addRule(item.begin, {
            rule: item,
            type: "begin",
          }),
        ),
        coreParam41.terminatorEnd &&
          ___Core.addRule(coreParam41.terminatorEnd, {
            type: "end",
          }),
        coreParam41.illegal &&
          ___Core.addRule(coreParam41.illegal, {
            type: "illegal",
          }),
        ___Core
      );
    }
    function coreHelper65(coreParam9, coreParam10) {
      let coreValue73 = coreParam9;
      if (coreParam9.isCompiled) return coreValue73;
      [coreHelper15, coreHelper18, coreHelper25, coreValue34].forEach((item) =>
        item(coreParam9, coreParam10),
      );
      coreParam7.compilerExtensions.forEach((item) =>
        item(coreParam9, coreParam10),
      );
      coreParam9.__beforeBegin = null;
      [coreHelper16, coreHelper17, coreHelper19].forEach((item) =>
        item(coreParam9, coreParam10),
      );
      coreParam9.isCompiled = true;
      let coreValue74 = null;
      return (
        typeof coreParam9.keywords == "object" &&
          coreParam9.keywords.$pattern &&
          ((coreParam9.keywords = Object.assign({}, coreParam9.keywords)),
          (coreValue74 = coreParam9.keywords.$pattern),
          delete coreParam9.keywords.$pattern),
        (coreValue74 ||= /\w+/),
        (coreParam9.keywords &&= coreHelper20(
          coreParam9.keywords,
          coreParam7.case_insensitive,
        )),
        (coreValue73.keywordPatternRe = __Core(coreValue74, true)),
        coreParam10 &&
          ((coreParam9.begin ||= /\B|\b/),
          (coreValue73.beginRe = __Core(coreValue73.begin)),
          !coreParam9.end &&
            !coreParam9.endsWithParent &&
            (coreParam9.end = /\B|\b/),
          coreParam9.end && (coreValue73.endRe = __Core(coreValue73.end)),
          (coreValue73.terminatorEnd = coreHelper4(coreValue73.end) || ""),
          coreParam9.endsWithParent &&
            coreParam10.terminatorEnd &&
            (coreValue73.terminatorEnd +=
              (coreParam9.end ? "|" : "") + coreParam10.terminatorEnd)),
        coreParam9.illegal &&
          (coreValue73.illegalRe = __Core(coreParam9.illegal)),
        (coreParam9.contains ||= []),
        (coreParam9.contains = [].concat(
          ...coreParam9.contains.map(function (item) {
            return coreHelper28(item === "self" ? coreParam9 : item);
          }),
        )),
        coreParam9.contains.forEach(function (item) {
          coreHelper65(item, coreValue73);
        }),
        coreParam9.starts && coreHelper65(coreParam9.starts, coreParam10),
        (coreValue73.matcher = coreHelper64(coreValue73)),
        coreValue73
      );
    }
    if (
      ((coreParam7.compilerExtensions ||= []),
      coreParam7.contains && coreParam7.contains.includes("self"))
    )
      throw Error(
        "ERR: contains `self` is not supported at the top-level of a language.  See documentation.",
      );
    return (
      (coreParam7.classNameAliases = coreHelper3(
        coreParam7.classNameAliases || {},
      )),
      coreHelper65(coreParam7)
    );
  }
  function coreHelper27(coreParam89) {
    return coreParam89
      ? coreParam89.endsWithParent || coreHelper27(coreParam89.starts)
      : false;
  }
  function coreHelper28(coreParam35) {
    return (
      coreParam35.variants &&
        !coreParam35.cachedVariants &&
        (coreParam35.cachedVariants = coreParam35.variants.map(
          function (__Core) {
            return coreHelper3(
              coreParam35,
              {
                variants: null,
              },
              __Core,
            );
          },
        )),
      coreParam35.cachedVariants
        ? coreParam35.cachedVariants
        : coreHelper27(coreParam35)
          ? coreHelper3(coreParam35, {
              starts: coreParam35.starts
                ? coreHelper3(coreParam35.starts)
                : null,
            })
          : Object.isFrozen(coreParam35)
            ? coreHelper3(coreParam35)
            : coreParam35
    );
  }
  var coreValue43 = class extends Error {
      constructor(coreParam72, __Core) {
        super(coreParam72);
        this.name = "HTMLInjectionError";
        this.html = __Core;
      }
    },
    coreValue44 = coreHelper2,
    coreValue45 = coreHelper3,
    coreValue46 = Symbol("nomatch"),
    coreValue48 = function (coreParam2) {
      let __Core = Object.create(null),
        coreValue49 = Object.create(null),
        coreValue50 = [],
        coreValue51 = true,
        coreValue53 = {
          disableAutodetect: true,
          name: "Plain text",
          contains: [],
        },
        coreValue54 = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          __emitter: coreValue8,
        };
      function coreHelper29(coreParam93) {
        return coreValue54.noHighlightRe.test(coreParam93);
      }
      function coreHelper30(coreParam31) {
        let ___Core = coreParam31.className + " ";
        ___Core += coreParam31.parentNode
          ? coreParam31.parentNode.className
          : "";
        let coreValue105 = coreValue54.languageDetectRe.exec(___Core);
        if (coreValue105) {
          let ____Core = coreHelper43(coreValue105[1]);
          return (
            ____Core ||
              (coreValue39(
                "Could not find the language '{}', did you forget to load/include a language module?".replace(
                  "{}",
                  coreValue105[1],
                ),
              ),
              coreValue39(
                "Falling back to no-highlight mode for this block.",
                coreParam31,
              )),
            ____Core ? coreValue105[1] : "no-highlight"
          );
        }
        return ___Core
          .split(/\s+/)
          .find((item) => coreHelper29(item) || coreHelper43(item));
      }
      function coreHelper31(coreParam15, ___Core, coreParam16) {
        let coreValue83 = "",
          coreValue84 = "";
        typeof ___Core == "object"
          ? ((coreValue83 = coreParam15),
            (coreParam16 = ___Core.ignoreIllegals),
            (coreValue84 = ___Core.language))
          : (coreValue40(
              "10.7.0",
              "highlight(lang, code, ...args) has been deprecated.",
            ),
            coreValue40(
              "10.7.0",
              "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277",
            ),
            (coreValue84 = coreParam15),
            (coreValue83 = ___Core));
        coreParam16 === undefined && (coreParam16 = true);
        let coreValue85 = {
          code: coreValue83,
          language: coreValue84,
        };
        coreHelper49("before:highlight", coreValue85);
        let coreValue86 = coreValue85.result
          ? coreValue85.result
          : coreHelper32(coreValue85.language, coreValue85.code, coreParam16);
        return (
          (coreValue86.code = coreValue85.code),
          coreHelper49("after:highlight", coreValue86),
          coreValue86
        );
      }
      function coreHelper32(coreParam3, coreParam4, coreParam5, coreParam6) {
        let coreValue57 = Object.create(null);
        function coreHelper51(coreParam97, ___Core) {
          return coreParam97.keywords[___Core];
        }
        function coreHelper52() {
          if (!coreValue62.keywords) {
            coreValue64.addText(coreValue65);
            return;
          }
          let coreValue76 = 0;
          coreValue62.keywordPatternRe.lastIndex = 0;
          let ___Core = coreValue62.keywordPatternRe.exec(coreValue65),
            coreValue77 = "";
          for (; ___Core; ) {
            coreValue77 += coreValue65.substring(coreValue76, ___Core.index);
            let coreValue87 = coreValue59.case_insensitive
                ? ___Core[0].toLowerCase()
                : ___Core[0],
              coreValue88 = coreHelper51(coreValue62, coreValue87);
            if (coreValue88) {
              let [coreValue107, coreValue108] = coreValue88;
              if (
                (coreValue64.addText(coreValue77),
                (coreValue77 = ""),
                (coreValue57[coreValue87] =
                  (coreValue57[coreValue87] || 0) + 1),
                coreValue57[coreValue87] <= 7 && (coreValue66 += coreValue108),
                coreValue107.startsWith("_"))
              )
                coreValue77 += ___Core[0];
              else {
                let coreValue134 =
                  coreValue59.classNameAliases[coreValue107] || coreValue107;
                coreHelper55(___Core[0], coreValue134);
              }
            } else coreValue77 += ___Core[0];
            coreValue76 = coreValue62.keywordPatternRe.lastIndex;
            ___Core = coreValue62.keywordPatternRe.exec(coreValue65);
          }
          coreValue77 += coreValue65.substring(coreValue76);
          coreValue64.addText(coreValue77);
        }
        function coreHelper53() {
          if (coreValue65 === "") return;
          let coreValue97 = null;
          if (typeof coreValue62.subLanguage == "string") {
            if (!__Core[coreValue62.subLanguage]) {
              coreValue64.addText(coreValue65);
              return;
            }
            coreValue97 = coreHelper32(
              coreValue62.subLanguage,
              coreValue65,
              true,
              coreValue63[coreValue62.subLanguage],
            );
            coreValue63[coreValue62.subLanguage] = coreValue97._top;
          } else
            coreValue97 = coreHelper34(
              coreValue65,
              coreValue62.subLanguage.length ? coreValue62.subLanguage : null,
            );
          coreValue62.relevance > 0 && (coreValue66 += coreValue97.relevance);
          coreValue64.__addSublanguage(
            coreValue97._emitter,
            coreValue97.language,
          );
        }
        function coreHelper54() {
          coreValue62.subLanguage == null ? coreHelper52() : coreHelper53();
          coreValue65 = "";
        }
        function coreHelper55(coreParam74, ___Core) {
          coreParam74 !== "" &&
            (coreValue64.startScope(___Core),
            coreValue64.addText(coreParam74),
            coreValue64.endScope());
        }
        function coreHelper56(coreParam37, ___Core) {
          let coreValue110 = 1,
            coreValue111 = ___Core.length - 1;
          for (; coreValue110 <= coreValue111; ) {
            if (!coreParam37._emit[coreValue110]) {
              coreValue110++;
              continue;
            }
            let coreValue121 =
                coreValue59.classNameAliases[coreParam37[coreValue110]] ||
                coreParam37[coreValue110],
              coreValue122 = ___Core[coreValue110];
            coreValue121
              ? coreHelper55(coreValue122, coreValue121)
              : ((coreValue65 = coreValue122),
                coreHelper52(),
                (coreValue65 = ""));
            coreValue110++;
          }
        }
        function coreHelper57(coreParam21, ___Core) {
          return (
            coreParam21.scope &&
              typeof coreParam21.scope == "string" &&
              coreValue64.openNode(
                coreValue59.classNameAliases[coreParam21.scope] ||
                  coreParam21.scope,
              ),
            coreParam21.beginScope &&
              (coreParam21.beginScope._wrap
                ? (coreHelper55(
                    coreValue65,
                    coreValue59.classNameAliases[
                      coreParam21.beginScope._wrap
                    ] || coreParam21.beginScope._wrap,
                  ),
                  (coreValue65 = ""))
                : coreParam21.beginScope._multi &&
                  (coreHelper56(coreParam21.beginScope, ___Core),
                  (coreValue65 = ""))),
            (coreValue62 = Object.create(coreParam21, {
              parent: {
                value: coreValue62,
              },
            })),
            coreValue62
          );
        }
        function coreHelper58(coreParam32, ___Core, coreParam33) {
          let coreValue106 = coreHelper12(coreParam32.endRe, coreParam33);
          if (coreValue106) {
            if (coreParam32["on:end"]) {
              let coreValue131 = new coreValue1(coreParam32);
              coreParam32["on:end"](___Core, coreValue131);
              coreValue131.isMatchIgnored && (coreValue106 = false);
            }
            if (coreValue106) {
              for (; coreParam32.endsParent && coreParam32.parent; )
                coreParam32 = coreParam32.parent;
              return coreParam32;
            }
          }
          if (coreParam32.endsWithParent)
            return coreHelper58(coreParam32.parent, ___Core, coreParam33);
        }
        function coreHelper59(coreParam70) {
          return coreValue62.matcher.regexIndex === 0
            ? ((coreValue65 += coreParam70[0]), 1)
            : ((coreValue69 = true), 0);
        }
        function coreHelper60(coreParam27) {
          let ___Core = coreParam27[0],
            coreValue99 = coreParam27.rule,
            coreValue100 = new coreValue1(coreValue99),
            coreValue101 = [coreValue99.__beforeBegin, coreValue99["on:begin"]];
          for (let coreValue137 of coreValue101)
            if (
              coreValue137 &&
              (coreValue137(coreParam27, coreValue100),
              coreValue100.isMatchIgnored)
            )
              return coreHelper59(___Core);
          return (
            coreValue99.skip
              ? (coreValue65 += ___Core)
              : (coreValue99.excludeBegin && (coreValue65 += ___Core),
                coreHelper54(),
                !coreValue99.returnBegin &&
                  !coreValue99.excludeBegin &&
                  (coreValue65 = ___Core)),
            coreHelper57(coreValue99, coreParam27),
            coreValue99.returnBegin ? 0 : ___Core.length
          );
        }
        function coreHelper61(coreParam12) {
          let ___Core = coreParam12[0],
            coreValue78 = coreParam4.substring(coreParam12.index),
            coreValue79 = coreHelper58(coreValue62, coreParam12, coreValue78);
          if (!coreValue79) return coreValue46;
          let coreValue80 = coreValue62;
          coreValue62.endScope && coreValue62.endScope._wrap
            ? (coreHelper54(),
              coreHelper55(___Core, coreValue62.endScope._wrap))
            : coreValue62.endScope && coreValue62.endScope._multi
              ? (coreHelper54(),
                coreHelper56(coreValue62.endScope, coreParam12))
              : coreValue80.skip
                ? (coreValue65 += ___Core)
                : (coreValue80.returnEnd ||
                    coreValue80.excludeEnd ||
                    (coreValue65 += ___Core),
                  coreHelper54(),
                  coreValue80.excludeEnd && (coreValue65 = ___Core));
          do {
            coreValue62.scope && coreValue64.closeNode();
            !coreValue62.skip &&
              !coreValue62.subLanguage &&
              (coreValue66 += coreValue62.relevance);
            coreValue62 = coreValue62.parent;
          } while (coreValue62 !== coreValue79.parent);
          return (
            coreValue79.starts && coreHelper57(coreValue79.starts, coreParam12),
            coreValue80.returnEnd ? 0 : ___Core.length
          );
        }
        function coreHelper62() {
          let coreValue124 = [];
          for (
            let ___Core = coreValue62;
            ___Core !== coreValue59;
            ___Core = ___Core.parent
          )
            ___Core.scope && coreValue124.unshift(___Core.scope);
          coreValue124.forEach((item) => coreValue64.openNode(item));
        }
        let coreValue58 = {};
        function coreHelper63(___Core, coreParam11) {
          let coreValue75 = coreParam11 && coreParam11[0];
          if (((coreValue65 += ___Core), coreValue75 == null))
            return (coreHelper54(), 0);
          if (
            coreValue58.type === "begin" &&
            coreParam11.type === "end" &&
            coreValue58.index === coreParam11.index &&
            coreValue75 === ""
          ) {
            if (
              ((coreValue65 += coreParam4.slice(
                coreParam11.index,
                coreParam11.index + 1,
              )),
              !coreValue51)
            ) {
              let ____Core = Error(`0 width match regex (${coreParam3})`);
              throw (
                (____Core.languageName = coreParam3),
                (____Core.badRule = coreValue58.rule),
                ____Core
              );
            }
            return 1;
          }
          if (((coreValue58 = coreParam11), coreParam11.type === "begin"))
            return coreHelper60(coreParam11);
          if (coreParam11.type === "illegal" && !coreParam5) {
            let coreValue120 = Error(
              'Illegal lexeme "' +
                coreValue75 +
                '" for mode "' +
                (coreValue62.scope || "<unnamed>") +
                '"',
            );
            throw ((coreValue120.mode = coreValue62), coreValue120);
          } else if (coreParam11.type === "end") {
            let coreValue136 = coreHelper61(coreParam11);
            if (coreValue136 !== coreValue46) return coreValue136;
          }
          if (coreParam11.type === "illegal" && coreValue75 === "")
            return ((coreValue65 += "\n"), 1);
          if (coreValue68 > 1e5 && coreValue68 > coreParam11.index * 3)
            throw Error(
              "potential infinite loop, way more iterations than matches",
            );
          return ((coreValue65 += coreValue75), coreValue75.length);
        }
        let coreValue59 = coreHelper43(coreParam3);
        if (!coreValue59)
          throw (
            coreValue38(
              "Could not find the language '{}', did you forget to load/include a language module?".replace(
                "{}",
                coreParam3,
              ),
            ),
            Error('Unknown language: "' + coreParam3 + '"')
          );
        let coreValue60 = coreHelper26(coreValue59),
          coreValue61 = "",
          coreValue62 = coreParam6 || coreValue60,
          coreValue63 = {},
          coreValue64 = new coreValue54.__emitter(coreValue54);
        coreHelper62();
        let coreValue65 = "",
          coreValue66 = 0,
          coreValue67 = 0,
          coreValue68 = 0,
          coreValue69 = false;
        try {
          if (coreValue59.__emitTokens)
            coreValue59.__emitTokens(coreParam4, coreValue64);
          else {
            for (coreValue62.matcher.considerAll(); ; ) {
              coreValue68++;
              coreValue69
                ? (coreValue69 = false)
                : coreValue62.matcher.considerAll();
              coreValue62.matcher.lastIndex = coreValue67;
              let coreValue115 = coreValue62.matcher.exec(coreParam4);
              if (!coreValue115) break;
              let ___Core = coreHelper63(
                coreParam4.substring(coreValue67, coreValue115.index),
                coreValue115,
              );
              coreValue67 = coreValue115.index + ___Core;
            }
            coreHelper63(coreParam4.substring(coreValue67));
          }
          return (
            coreValue64.finalize(),
            (coreValue61 = coreValue64.toHTML()),
            {
              language: coreParam3,
              value: coreValue61,
              relevance: coreValue66,
              illegal: false,
              _emitter: coreValue64,
              _top: coreValue62,
            }
          );
        } catch (___Core) {
          if (___Core.message && ___Core.message.includes("Illegal"))
            return {
              language: coreParam3,
              value: coreValue44(coreParam4),
              illegal: true,
              relevance: 0,
              _illegalBy: {
                message: ___Core.message,
                index: coreValue67,
                context: coreParam4.slice(coreValue67 - 100, coreValue67 + 100),
                mode: ___Core.mode,
                resultSoFar: coreValue61,
              },
              _emitter: coreValue64,
            };
          if (coreValue51)
            return {
              language: coreParam3,
              value: coreValue44(coreParam4),
              illegal: false,
              relevance: 0,
              errorRaised: ___Core,
              _emitter: coreValue64,
              _top: coreValue62,
            };
          throw ___Core;
        }
      }
      function coreHelper33(coreParam48) {
        let ___Core = {
          value: coreValue44(coreParam48),
          illegal: false,
          relevance: 0,
          _top: coreValue53,
          _emitter: new coreValue54.__emitter(coreValue54),
        };
        return (___Core._emitter.addText(coreParam48), ___Core);
      }
      function coreHelper34(coreParam18, coreParam19) {
        coreParam19 =
          coreParam19 || coreValue54.languages || Object.keys(__Core);
        let coreValue89 = coreHelper33(coreParam18),
          coreValue90 = coreParam19
            .filter(coreHelper43)
            .filter(coreHelper45)
            .map((___Core) => coreHelper32(___Core, coreParam18, false));
        coreValue90.unshift(coreValue89);
        let [coreValue91, coreValue92] = coreValue90.sort(
            (coreParam39, ___Core) => {
              if (coreParam39.relevance !== ___Core.relevance)
                return ___Core.relevance - coreParam39.relevance;
              if (coreParam39.language && ___Core.language) {
                if (
                  coreHelper43(coreParam39.language).supersetOf ===
                  ___Core.language
                )
                  return 1;
                if (
                  coreHelper43(___Core.language).supersetOf ===
                  coreParam39.language
                )
                  return -1;
              }
              return 0;
            },
          ),
          coreValue93 = coreValue91;
        return ((coreValue93.secondBest = coreValue92), coreValue93);
      }
      function coreHelper35(coreParam61, ___Core, coreParam62) {
        let coreValue128 = (___Core && coreValue49[___Core]) || coreParam62;
        coreParam61.classList.add("hljs");
        coreParam61.classList.add(`language-${coreValue128}`);
      }
      function coreHelper36(coreParam8) {
        let ___Core = null,
          coreValue70 = coreHelper30(coreParam8);
        if (coreHelper29(coreValue70)) return;
        if (
          (coreHelper49("before:highlightElement", {
            el: coreParam8,
            language: coreValue70,
          }),
          coreParam8.dataset.highlighted)
        ) {
          console.log(
            "Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",
            coreParam8,
          );
          return;
        }
        if (
          coreParam8.children.length > 0 &&
          (coreValue54.ignoreUnescapedHTML ||
            (console.warn(
              "One of your code blocks includes unescaped HTML. This is a potentially serious security risk.",
            ),
            console.warn(
              "https://github.com/highlightjs/highlight.js/wiki/security",
            ),
            console.warn("The element with unescaped HTML:"),
            console.warn(coreParam8)),
          coreValue54.throwUnescapedHTML)
        )
          throw new coreValue43(
            "One of your code blocks includes unescaped HTML.",
            coreParam8.innerHTML,
          );
        ___Core = coreParam8;
        let coreValue71 = ___Core.textContent,
          coreValue72 = coreValue70
            ? coreHelper31(coreValue71, {
                language: coreValue70,
                ignoreIllegals: true,
              })
            : coreHelper34(coreValue71);
        coreParam8.innerHTML = coreValue72.value;
        coreParam8.dataset.highlighted = "yes";
        coreHelper35(coreParam8, coreValue70, coreValue72.language);
        coreParam8.result = {
          language: coreValue72.language,
          re: coreValue72.relevance,
          relevance: coreValue72.relevance,
        };
        coreValue72.secondBest &&
          (coreParam8.secondBest = {
            language: coreValue72.secondBest.language,
            relevance: coreValue72.secondBest.relevance,
          });
        coreHelper49("after:highlightElement", {
          el: coreParam8,
          result: coreValue72,
          text: coreValue71,
        });
      }
      function coreHelper37(coreParam108) {
        coreValue54 = coreValue45(coreValue54, coreParam108);
      }
      let coreValue55 = () => {
        coreHelper39();
        coreValue40(
          "10.6.0",
          "initHighlighting() deprecated.  Use highlightAll() now.",
        );
      };
      function coreHelper38() {
        coreHelper39();
        coreValue40(
          "10.6.0",
          "initHighlightingOnLoad() deprecated.  Use highlightAll() now.",
        );
      }
      let coreValue56 = false;
      function coreHelper39() {
        function coreHelper67() {
          coreHelper39();
        }
        if (document.readyState === "loading") {
          coreValue56 ||
            window.addEventListener("DOMContentLoaded", coreHelper67, false);
          coreValue56 = true;
          return;
        }
        document
          .querySelectorAll(coreValue54.cssSelector)
          .forEach(coreHelper36);
      }
      function coreHelper40(coreParam22, coreParam23) {
        let coreValue95 = null;
        try {
          coreValue95 = coreParam23(coreParam2);
        } catch (coreValue112) {
          if (
            (coreValue38(
              "Language definition for '{}' could not be registered.".replace(
                "{}",
                coreParam22,
              ),
            ),
            coreValue51)
          )
            coreValue38(coreValue112);
          else throw coreValue112;
          coreValue95 = coreValue53;
        }
        coreValue95.name ||= coreParam22;
        __Core[coreParam22] = coreValue95;
        coreValue95.rawDefinition = coreParam23.bind(null, coreParam2);
        coreValue95.aliases &&
          coreHelper44(coreValue95.aliases, {
            languageName: coreParam22,
          });
      }
      function coreHelper41(coreParam68) {
        delete __Core[coreParam68];
        for (let ___Core of Object.keys(coreValue49))
          coreValue49[___Core] === coreParam68 && delete coreValue49[___Core];
      }
      function coreHelper42() {
        return Object.keys(__Core);
      }
      function coreHelper43(coreParam78) {
        return (
          (coreParam78 = (coreParam78 || "").toLowerCase()),
          __Core[coreParam78] || __Core[coreValue49[coreParam78]]
        );
      }
      function coreHelper44(coreParam57, { languageName: ___Core }) {
        typeof coreParam57 == "string" && (coreParam57 = [coreParam57]);
        coreParam57.forEach((item) => {
          coreValue49[item.toLowerCase()] = ___Core;
        });
      }
      function coreHelper45(coreParam79) {
        let ___Core = coreHelper43(coreParam79);
        return ___Core && !___Core.disableAutodetect;
      }
      function coreHelper46(coreParam30) {
        coreParam30["before:highlightBlock"] &&
          !coreParam30["before:highlightElement"] &&
          (coreParam30["before:highlightElement"] = (___Core) => {
            coreParam30["before:highlightBlock"](
              Object.assign(
                {
                  block: ___Core.el,
                },
                ___Core,
              ),
            );
          });
        coreParam30["after:highlightBlock"] &&
          !coreParam30["after:highlightElement"] &&
          (coreParam30["after:highlightElement"] = (___Core) => {
            coreParam30["after:highlightBlock"](
              Object.assign(
                {
                  block: ___Core.el,
                },
                ___Core,
              ),
            );
          });
      }
      function coreHelper47(coreParam102) {
        coreHelper46(coreParam102);
        coreValue50.push(coreParam102);
      }
      function coreHelper48(coreParam77) {
        let ___Core = coreValue50.indexOf(coreParam77);
        ___Core !== -1 && coreValue50.splice(___Core, 1);
      }
      function coreHelper49(coreParam66, ___Core) {
        let coreValue129 = coreParam66;
        coreValue50.forEach(function (item) {
          item[coreValue129] && item[coreValue129](___Core);
        });
      }
      function coreHelper50(coreParam49) {
        return (
          coreValue40(
            "10.7.0",
            "highlightBlock will be removed entirely in v12.0",
          ),
          coreValue40("10.7.0", "Please use highlightElement now."),
          coreHelper36(coreParam49)
        );
      }
      Object.assign(coreParam2, {
        highlight: coreHelper31,
        highlightAuto: coreHelper34,
        highlightAll: coreHelper39,
        highlightElement: coreHelper36,
        highlightBlock: coreHelper50,
        configure: coreHelper37,
        initHighlighting: coreValue55,
        initHighlightingOnLoad: coreHelper38,
        registerLanguage: coreHelper40,
        unregisterLanguage: coreHelper41,
        listLanguages: coreHelper42,
        getLanguage: coreHelper43,
        registerAliases: coreHelper44,
        autoDetection: coreHelper45,
        inherit: coreValue45,
        addPlugin: coreHelper47,
        removePlugin: coreHelper48,
      });
      coreParam2.debugMode = function () {
        coreValue51 = false;
      };
      coreParam2.safeMode = function () {
        coreValue51 = true;
      };
      coreParam2.versionString = "11.11.1";
      coreParam2.regex = {
        concat: coreHelper8,
        lookahead: coreHelper5,
        either: coreHelper10,
        optional: coreHelper7,
        anyNumberOfTimes: coreHelper6,
      };
      for (let coreValue138 in coreValue33)
        typeof coreValue33[coreValue138] == "object" &&
          coreHelper1(coreValue33[coreValue138]);
      return (Object.assign(coreParam2, coreValue33), coreParam2);
    },
    $ = coreValue48({});
  $.newInstance = () => coreValue48({});
  _Core.exports = $;
  $.HighlightJS = $;
  $.default = $;
});
