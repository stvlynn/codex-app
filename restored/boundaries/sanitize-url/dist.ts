// Restored from ref/webview/assets/dist-D8VrLBqU.js
// Dist chunk restored from the Codex webview bundle.
import { chunkT } from "../../utils/esbuild-runtime-helpers";
var distValue1 = chunkT((distParam3) => {
  Object.defineProperty(distParam3, "__esModule", {
    value: true,
  });
  distParam3.BLANK_URL =
    distParam3.relativeFirstCharacters =
    distParam3.whitespaceEscapeCharsRegex =
    distParam3.urlSchemeRegex =
    distParam3.ctrlCharactersRegex =
    distParam3.htmlCtrlEntityRegex =
    distParam3.htmlEntitiesRegex =
    distParam3.invalidProtocolRegex =
      undefined;
  distParam3.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
  distParam3.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
  distParam3.htmlCtrlEntityRegex = /&(newline|tab);/gi;
  distParam3.ctrlCharactersRegex =
    /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
  distParam3.urlSchemeRegex = /^.+(:|&colon;)/gim;
  distParam3.whitespaceEscapeCharsRegex =
    /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g;
  distParam3.relativeFirstCharacters = [".", "/"];
  distParam3.BLANK_URL = "about:blank";
});
export const dist = chunkT((distParam1) => {
  Object.defineProperty(distParam1, "__esModule", {
    value: true,
  });
  distParam1.sanitizeUrl = undefined;
  var _dist = distValue1();
  function distHelper1(distParam6) {
    return _dist.relativeFirstCharacters.indexOf(distParam6[0]) > -1;
  }
  function distHelper2(distParam4) {
    return distParam4
      .replace(_dist.ctrlCharactersRegex, "")
      .replace(_dist.htmlEntitiesRegex, function (distParam7, distParam8) {
        return String.fromCharCode(distParam8);
      });
  }
  function distHelper3(distParam9) {
    return URL.canParse(distParam9);
  }
  function distHelper4(distParam5) {
    try {
      return decodeURIComponent(distParam5);
    } catch {
      return distParam5;
    }
  }
  function distHelper5(distParam2) {
    if (!distParam2) return _dist.BLANK_URL;
    var distValue2,
      distValue3 = distHelper4(distParam2.trim());
    do {
      distValue3 = distHelper2(distValue3)
        .replace(_dist.htmlCtrlEntityRegex, "")
        .replace(_dist.ctrlCharactersRegex, "")
        .replace(_dist.whitespaceEscapeCharsRegex, "")
        .trim();
      distValue3 = distHelper4(distValue3);
      distValue2 =
        distValue3.match(_dist.ctrlCharactersRegex) ||
        distValue3.match(_dist.htmlEntitiesRegex) ||
        distValue3.match(_dist.htmlCtrlEntityRegex) ||
        distValue3.match(_dist.whitespaceEscapeCharsRegex);
    } while (distValue2 && distValue2.length > 0);
    var distValue4 = distValue3;
    if (!distValue4) return _dist.BLANK_URL;
    if (distHelper1(distValue4)) return distValue4;
    var distValue5 = distValue4.trimStart(),
      distValue6 = distValue5.match(_dist.urlSchemeRegex);
    if (!distValue6) return distValue4;
    var distValue7 = distValue6[0].toLowerCase().trim();
    if (_dist.invalidProtocolRegex.test(distValue7)) return _dist.BLANK_URL;
    var distValue8 = distValue5.replace(/\\/g, "/");
    if (distValue7 === "mailto:" || distValue7.includes("://"))
      return distValue8;
    if (distValue7 === "http:" || distValue7 === "https:") {
      if (!distHelper3(distValue8)) return _dist.BLANK_URL;
      var distValue9 = new URL(distValue8);
      return (
        (distValue9.protocol = distValue9.protocol.toLowerCase()),
        (distValue9.hostname = distValue9.hostname.toLowerCase()),
        distValue9.toString()
      );
    }
    return distValue8;
  }
  distParam1.sanitizeUrl = distHelper5;
});

// Additional aliases exported for consumers mapped via IMPORT_MAP
export const t: any = undefined;
