// Restored from ref/webview/assets/store-489E8Cj_.js
// Store chunk restored from the Codex webview bundle.
function storeHelper1() {
  return {
    childIdByNameId: new Map(),
    childIds: [],
    childPositionById: new Map(),
    childVisibleChunkSums: null,
    totalChildSubtreeNodeCount: 0,
    totalChildVisibleSubtreeCount: 0,
  };
}
function storeHelper2() {
  return {
    childIdByNameId: null,
    childIds: [],
    childPositionById: null,
    childVisibleChunkSums: null,
    totalChildSubtreeNodeCount: 0,
    totalChildVisibleSubtreeCount: 0,
  };
}
function storeHelper3(storeParam242, storeParam243) {
  if (storeParam243.childIdByNameId != null)
    return storeParam243.childIdByNameId;
  let storeValue478 = new Map();
  for (let storeValue642 of storeParam243.childIds) {
    let storeValue659 = storeParam242[storeValue642];
    storeValue659 != null &&
      storeValue478.set(storeValue659.nameId, storeValue642);
  }
  return ((storeParam243.childIdByNameId = storeValue478), storeValue478);
}
function storeHelper4(storeParam228) {
  if (storeParam228.childPositionById != null)
    return storeParam228.childPositionById;
  let storeValue452 = new Map();
  for (
    let storeValue622 = 0;
    storeValue622 < storeParam228.childIds.length;
    storeValue622++
  ) {
    let storeValue658 = storeParam228.childIds[storeValue622];
    storeValue658 != null && storeValue452.set(storeValue658, storeValue622);
  }
  return ((storeParam228.childPositionById = storeValue452), storeValue452);
}
function storeHelper5(storeParam346, storeParam347) {
  storeParam346.childPositionById != null &&
    storeParam346.childPositionById.set(
      storeParam347,
      storeParam346.childIds.length,
    );
  storeParam346.childIds.push(storeParam347);
}
function storeHelper6(storeParam266, storeParam267) {
  if (storeParam266.childPositionById != null)
    for (
      let storeValue588 = storeParam267;
      storeValue588 < storeParam266.childIds.length;
      storeValue588++
    ) {
      let storeValue643 = storeParam266.childIds[storeValue588];
      storeValue643 != null &&
        storeParam266.childPositionById.set(storeValue643, storeValue588);
    }
}
function storeHelper7(storeParam212, storeParam213) {
  let storeValue437 = 0,
    storeValue438 = 0;
  for (let storeValue593 of storeParam213.childIds) {
    let storeValue627 = storeParam212[storeValue593];
    storeValue627 != null &&
      ((storeValue437 += storeValue627.subtreeNodeCount),
      (storeValue438 += storeValue627.visibleSubtreeCount));
  }
  storeParam213.totalChildSubtreeNodeCount = storeValue437;
  storeParam213.totalChildVisibleSubtreeCount = storeValue438;
  storeHelper11(storeParam212, storeParam213);
}
function storeHelper8(
  storeParam200,
  storeParam201,
  storeParam202,
  storeParam203,
) {
  if (
    ((storeParam200.totalChildSubtreeNodeCount += storeParam202),
    (storeParam200.totalChildVisibleSubtreeCount += storeParam203),
    storeParam200.childVisibleChunkSums == null || storeParam203 === 0)
  )
    return;
  let storeValue416 = storeHelper4(storeParam200).get(storeParam201);
  if (storeValue416 === undefined) return;
  let storeValue417 = storeValue416 >> 5;
  storeParam200.childVisibleChunkSums[storeValue417] += storeParam203;
}
function storeHelper9(storeParam36, storeParam37, storeParam38) {
  let storeValue164 = storeParam37.childVisibleChunkSums;
  if (storeValue164 != null) {
    let storeValue419 = storeParam38,
      storeValue420 = 0;
    for (let storeValue522 of storeValue164) {
      if (storeValue419 < storeValue522) {
        let storeValue619 = storeHelper12(
          storeParam36,
          storeParam37,
          storeValue420,
          storeValue419,
        );
        return {
          ...storeValue619,
          childVisibleIndex: storeParam38 - storeValue619.localVisibleIndex,
        };
      }
      storeValue419 -= storeValue522;
      storeValue420 += 32;
    }
    throw Error(`Visible child index ${String(storeParam38)} is out of range`);
  }
  let storeValue165 = storeParam38;
  for (
    let storeValue366 = 0;
    storeValue366 < storeParam37.childIds.length;
    storeValue366++
  ) {
    let storeValue410 = storeParam37.childIds[storeValue366];
    if (storeValue410 == null) continue;
    let storeValue411 = storeParam36[storeValue410];
    if (storeValue411 != null) {
      if (storeValue165 < storeValue411.visibleSubtreeCount)
        return {
          childIndex: storeValue366,
          childVisibleIndex: storeParam38 - storeValue165,
          localVisibleIndex: storeValue165,
        };
      storeValue165 -= storeValue411.visibleSubtreeCount;
    }
  }
  throw Error(`Visible child index ${String(storeParam38)} is out of range`);
}
function storeHelper10(storeParam156, storeParam157, storeParam158) {
  let storeValue349 = 0,
    storeValue350 = storeParam157.childVisibleChunkSums,
    storeValue351 = 0;
  if (storeValue350 != null) {
    let storeValue636 = storeParam158 >> 5;
    for (
      let storeValue667 = 0;
      storeValue667 < storeValue636;
      storeValue667 += 1
    )
      storeValue349 += storeValue350[storeValue667] ?? 0;
    storeValue351 = storeValue636 << 5;
  }
  for (
    let storeValue550 = storeValue351;
    storeValue550 < storeParam158;
    storeValue550 += 1
  ) {
    let storeValue591 = storeParam157.childIds[storeValue550];
    if (storeValue591 == null) continue;
    let storeValue592 = storeParam156[storeValue591];
    storeValue592 != null &&
      (storeValue349 += storeValue592.visibleSubtreeCount);
  }
  return storeValue349;
}
function storeHelper11(storeParam147, storeParam148) {
  if (storeParam148.childIds.length < 128) {
    storeParam148.childVisibleChunkSums = null;
    return;
  }
  let storeValue339 = Math.ceil(storeParam148.childIds.length / 32),
    storeValue340 = new Int32Array(storeValue339);
  for (
    let storeValue525 = 0;
    storeValue525 < storeParam148.childIds.length;
    storeValue525++
  ) {
    let storeValue575 = storeParam148.childIds[storeValue525];
    if (storeValue575 == null) continue;
    let storeValue576 = storeParam147[storeValue575];
    storeValue576 != null &&
      (storeValue340[storeValue525 >> 5] += storeValue576.visibleSubtreeCount);
  }
  storeParam148.childVisibleChunkSums = storeValue340;
}
function storeHelper12(
  storeParam129,
  storeParam130,
  storeParam131,
  storeParam132,
) {
  let storeValue320 = Math.min(
      storeParam130.childIds.length,
      storeParam131 + 32,
    ),
    storeValue321 = storeParam132;
  for (
    let storeValue446 = storeParam131;
    storeValue446 < storeValue320;
    storeValue446++
  ) {
    let storeValue472 = storeParam130.childIds[storeValue446];
    if (storeValue472 == null) continue;
    let storeValue473 = storeParam129[storeValue472];
    if (storeValue473 != null) {
      if (storeValue321 < storeValue473.visibleSubtreeCount)
        return {
          childIndex: storeValue446,
          localVisibleIndex: storeValue321,
        };
      storeValue321 -= storeValue473.visibleSubtreeCount;
    }
  }
  throw Error(`Visible child index ${String(storeParam132)} is out of range`);
}
function storeHelper13(storeParam410, storeParam411, storeParam412 = 0) {
  return (storeParam410 << 4) | (storeParam412 << 3) | storeParam411;
}
function storeHelper14(storeParam424) {
  return storeParam424.depthAndFlags >>> 4;
}
function storeHelper15(storeParam423) {
  return (storeParam423.depthAndFlags & 8) >> 3;
}
function storeHelper16(storeParam421) {
  return (storeParam421.depthAndFlags & 8) !== 0;
}
function storeHelper17(storeParam428) {
  return storeParam428.depthAndFlags & 7;
}
function storeHelper18(storeParam429, storeParam430) {
  return (storeHelper17(storeParam429) & storeParam430) !== 0;
}
function storeHelper19(storeParam432, storeParam433) {
  storeParam432.depthAndFlags |= storeParam433;
}
function storeHelper20(storeParam413, storeParam414) {
  storeParam413.depthAndFlags = storeHelper13(
    storeParam414,
    storeHelper17(storeParam413),
    storeHelper15(storeParam413),
  );
}
var storeValue8 = Symbol("benchmarkInstrumentation");
function storeHelper21(storeParam255, storeParam256) {
  return (
    storeParam256 == null ||
      Object.defineProperty(storeParam255, storeValue8, {
        configurable: true,
        enumerable: false,
        value: storeParam256,
        writable: false,
      }),
    storeParam255
  );
}
function storeHelper22(storeParam409) {
  return storeParam409 == null ? null : (storeParam409[storeValue8] ?? null);
}
function storeHelper23(storeParam398, storeParam399, storeParam400) {
  return storeParam398 == null
    ? storeParam400()
    : storeParam398.measurePhase(storeParam399, storeParam400);
}
function storeHelper24(storeParam387, storeParam388, storeParam389) {
  !Number.isFinite(storeParam389) ||
    storeParam387 == null ||
    storeParam387.setCounter(storeParam388, storeParam389);
}
function storeHelper25(storeParam431) {
  return storeParam431 >= 48 && storeParam431 <= 57;
}
function storeHelper26(storeParam128) {
  let storeValue317 = [],
    storeValue318 = 0,
    storeValue319 = 0;
  for (; storeValue319 < storeParam128.length; ) {
    for (
      ;
      storeValue319 < storeParam128.length &&
      !storeHelper25(storeParam128.charCodeAt(storeValue319));
    )
      storeValue319 += 1;
    if (storeValue319 >= storeParam128.length) break;
    storeValue319 > storeValue318 &&
      storeValue317.push(storeParam128.slice(storeValue318, storeValue319));
    let storeValue423 = 0;
    for (
      ;
      storeValue319 < storeParam128.length &&
      storeHelper25(storeParam128.charCodeAt(storeValue319));
    ) {
      storeValue423 =
        storeValue423 * 10 + (storeParam128.charCodeAt(storeValue319) - 48);
      storeValue319 += 1;
    }
    storeValue317.push(storeValue423);
    storeValue318 = storeValue319;
  }
  return (
    (storeValue318 < storeParam128.length || storeValue317.length === 0) &&
      storeValue317.push(storeParam128.slice(storeValue318)),
    storeValue317
  );
}
function storeHelper27(storeParam381) {
  let storeValue640 = storeParam381.toLowerCase();
  return {
    lowerValue: storeValue640,
    tokens: storeHelper26(storeValue640),
  };
}
function storeHelper28(storeParam149, storeParam150) {
  let storeValue341 = Math.min(storeParam149.length, storeParam150.length);
  for (let storeValue449 = 0; storeValue449 < storeValue341; storeValue449++) {
    let storeValue479 = storeParam149[storeValue449],
      storeValue480 = storeParam150[storeValue449];
    if (storeValue479 === storeValue480) continue;
    if (typeof storeValue479 == "number" && typeof storeValue480 == "number")
      return storeValue479 < storeValue480 ? -1 : 1;
    let storeValue481 = String(storeValue479),
      storeValue482 = String(storeValue480);
    if (storeValue481 !== storeValue482)
      return storeValue481 < storeValue482 ? -1 : 1;
  }
  return storeParam149.length === storeParam150.length
    ? 0
    : storeParam149.length < storeParam150.length
      ? -1
      : 1;
}
function storeHelper29(storeParam126, storeParam127) {
  if (
    storeParam126.tokens.length === 1 &&
    storeParam127.tokens.length === 1 &&
    typeof storeParam126.tokens[0] == "string" &&
    typeof storeParam127.tokens[0] == "string"
  )
    return storeParam126.lowerValue === storeParam127.lowerValue
      ? 0
      : storeParam126.lowerValue < storeParam127.lowerValue
        ? -1
        : 1;
  let storeValue314 = storeHelper28(storeParam126.tokens, storeParam127.tokens);
  return storeValue314 === 0
    ? storeParam126.lowerValue === storeParam127.lowerValue
      ? 0
      : storeParam126.lowerValue < storeParam127.lowerValue
        ? -1
        : 1
    : storeValue314;
}
function storeHelper30(storeParam366, storeParam367, storeParam368) {
  let storeValue623 = storeHelper29(
    storeParam368(storeParam366),
    storeParam368(storeParam367),
  );
  return storeValue623 === 0
    ? storeParam366 === storeParam367
      ? 0
      : storeParam366 < storeParam367
        ? -1
        : 1
    : storeValue623;
}
function storeHelper31(storeParam438, storeParam439) {
  return storeHelper30(storeParam438, storeParam439, storeHelper27);
}
function storeHelper32(storeParam375, storeParam376) {
  return storeParam376 === storeParam375.segments.length - 1
    ? storeParam375.isDirectory
      ? 1
      : 0
    : 1;
}
function storeHelper33(storeParam104, storeParam105) {
  let storeValue296 = Math.min(
    storeParam104.segments.length,
    storeParam105.segments.length,
  );
  for (let storeValue508 = 0; storeValue508 < storeValue296; storeValue508++) {
    let storeValue542 = storeParam104.segments[storeValue508],
      storeValue543 = storeParam105.segments[storeValue508];
    if (storeValue542 === storeValue543) continue;
    let storeValue544 = storeHelper32(storeParam104, storeValue508);
    return storeValue544 === storeHelper32(storeParam105, storeValue508)
      ? storeHelper31(storeValue542, storeValue543)
      : storeValue544 === 1
        ? -1
        : 1;
  }
  return storeParam104.segments.length === storeParam105.segments.length
    ? storeParam104.isDirectory === storeParam105.isDirectory
      ? 0
      : storeParam104.isDirectory
        ? -1
        : 1
    : storeParam104.segments.length < storeParam105.segments.length
      ? -1
      : 1;
}
function storeHelper34(storeParam440, storeParam441) {
  return storeHelper33(storeParam440, storeParam441);
}
function storeHelper35(storeParam69, storeParam70, storeParam71) {
  let storeValue240 = (storeParam358) => {
      let storeValue602 = storeParam71.get(storeParam358);
      if (storeValue602 != null) return storeValue602;
      let storeValue603 = storeHelper27(storeParam358);
      return (storeParam71.set(storeParam358, storeValue603), storeValue603);
    },
    storeValue241 = Math.min(
      storeParam69.segments.length,
      storeParam70.segments.length,
    );
  for (let storeValue506 = 0; storeValue506 < storeValue241; storeValue506++) {
    let storeValue537 = storeParam69.segments[storeValue506],
      storeValue538 = storeParam70.segments[storeValue506];
    if (storeValue537 === storeValue538) continue;
    let storeValue539 = storeHelper32(storeParam69, storeValue506);
    return storeValue539 === storeHelper32(storeParam70, storeValue506)
      ? storeHelper30(storeValue537, storeValue538, storeValue240)
      : storeValue539 === 1
        ? -1
        : 1;
  }
  return storeParam69.segments.length === storeParam70.segments.length
    ? storeParam69.isDirectory === storeParam70.isDirectory
      ? 0
      : storeParam69.isDirectory
        ? -1
        : 1
    : storeParam69.segments.length < storeParam70.segments.length
      ? -1
      : 1;
}
function storeHelper36(storeParam304, storeParam305) {
  let storeValue551 = storeParam304.sortKeyById[storeParam305];
  if (storeValue551 !== undefined) return storeValue551;
  let storeValue552 = storeParam304.valueById[storeParam305],
    storeValue553 = storeHelper27(storeValue552);
  return (
    (storeParam304.sortKeyById[storeParam305] = storeValue553),
    storeValue553
  );
}
function storeHelper37(storeParam334 = {}) {
  return {
    flattenEmptyDirectories: storeParam334.flattenEmptyDirectories !== false,
    sort: storeParam334.sort ?? "default",
  };
}
function storeHelper38(storeParam189) {
  let storeValue398 =
      storeParam189.length > 0 &&
      storeParam189.charCodeAt(storeParam189.length - 1) === 47,
    storeValue399 = storeValue398
      ? storeParam189.length - 1
      : storeParam189.length,
    storeValue400 = [],
    storeValue401 = 0;
  for (let storeValue633 = 0; storeValue633 < storeValue399; storeValue633++)
    storeParam189.charCodeAt(storeValue633) === 47 &&
      (storeValue400.push(storeParam189.slice(storeValue401, storeValue633)),
      (storeValue401 = storeValue633 + 1));
  return (
    storeValue400.push(storeParam189.slice(storeValue401, storeValue399)),
    {
      hasTrailingSlash: storeValue398,
      segments: storeValue400,
    }
  );
}
function storeHelper39(storeParam286) {
  let { hasTrailingSlash, segments } = storeHelper38(storeParam286);
  return {
    basename: segments[segments.length - 1] ?? "",
    isDirectory: hasTrailingSlash,
    path: storeParam286,
    segments,
  };
}
function storeHelper40(storeParam273) {
  if (storeParam273.length === 0)
    return {
      requiresDirectory: false,
      segments: [],
    };
  let { hasTrailingSlash, segments } = storeHelper38(storeParam273);
  return {
    requiresDirectory: hasTrailingSlash,
    segments,
  };
}
function _e() {
  let storeValue580 = new Map();
  return (
    storeValue580.set("", 0),
    {
      idByValue: storeValue580,
      valueById: [""],
      sortKeyById: [storeHelper27("")],
    }
  );
}
function storeHelper41(storeParam289, storeParam290) {
  let storeValue531 = storeParam289.idByValue.get(storeParam290);
  if (storeValue531 !== undefined) return storeValue531;
  let storeValue532 = storeParam289.valueById.length;
  return (
    storeParam289.idByValue.set(storeParam290, storeValue532),
    storeParam289.valueById.push(storeParam290),
    storeValue532
  );
}
function storeHelper42(storeParam344, storeParam345) {
  let storeValue589 = storeParam344.valueById[storeParam345];
  if (storeValue589 === undefined)
    throw Error(`Unknown segment ID: ${String(storeParam345)}`);
  return storeValue589;
}
var storeValue10 = Symbol("pathStorePreparedInputKind");
function storeHelper43(storeParam426, storeParam427) {
  return ((storeParam426[storeValue10] = storeParam427), storeParam426);
}
function be(storeParam294) {
  return {
    basename: storeParam294.basename,
    depth: storeParam294.segments.length,
    isDirectory: storeParam294.isDirectory,
    path: storeParam294.path,
    segments: storeParam294.segments,
  };
}
function storeHelper44(storeParam392, storeParam393, storeParam394) {
  return storeParam394 === "default"
    ? storeHelper34(storeParam392, storeParam393)
    : storeParam394(be(storeParam392), be(storeParam393));
}
function storeHelper45() {
  return {
    depthAndFlags: storeHelper13(0, 3, 1),
    nameId: 0,
    parentId: 0,
    subtreeNodeCount: 1,
    visibleSubtreeCount: 1,
  };
}
function storeHelper46(storeParam337, storeParam338) {
  let storeValue581 = Math.min(storeParam337.length, storeParam338.length);
  for (let storeValue663 = 0; storeValue663 < storeValue581; storeValue663++)
    if (storeParam337[storeValue663] !== storeParam338[storeValue663])
      return storeValue663;
  return storeValue581;
}
function storeHelper47(storeParam382) {
  return storeParam382.isDirectory
    ? storeParam382.segments.length
    : storeParam382.segments.length - 1;
}
function storeHelper48(storeParam192) {
  return (
    Array.isArray(storeParam192) &&
    storeParam192.every(
      (item) =>
        typeof item == "object" &&
        !!item &&
        typeof item.path == "string" &&
        Array.isArray(item.segments) &&
        typeof item.basename == "string" &&
        typeof item.isDirectory == "boolean",
    )
  );
}
function storeHelper49(storeParam383) {
  return (
    Array.isArray(storeParam383) &&
    storeParam383.every((item) => typeof item == "string")
  );
}
function storeHelper50(storeParam405, storeParam406 = {}) {
  return storeHelper56(storeParam405, storeParam406).map((item) => item.path);
}
function storeHelper51(storeParam353, storeParam354 = {}) {
  let storeValue596 = storeHelper56(storeParam353, storeParam354);
  return storeHelper43(
    {
      paths: storeValue596.map((item) => item.path),
      preparedPaths: storeValue596,
    },
    "prepared",
  );
}
function storeHelper52(storeParam188) {
  let storeValue394 = storeParam188.length,
    storeValue395 = false;
  for (
    let storeValue562 = 0;
    storeValue562 < storeValue394;
    storeValue562 += 1
  ) {
    let storeValue607 = storeParam188[storeValue562];
    if (
      storeValue607.length > 0 &&
      storeValue607.charCodeAt(storeValue607.length - 1) === 47
    ) {
      storeValue395 = true;
      break;
    }
  }
  return storeHelper43(
    {
      paths: storeParam188,
      presortedPaths: storeParam188,
      presortedPathsContainDirectories: storeValue395,
    },
    "presorted",
  );
}
function storeHelper53(storeParam252) {
  let storeValue492 = storeParam252,
    storeValue493 = storeValue492.preparedPaths;
  if (storeValue492[storeValue10] === "prepared" && storeValue493 != null)
    return storeValue493;
  if (!storeHelper48(storeValue493))
    throw Error("preparedInput must come from PathStore.prepareInput()");
  return storeValue493;
}
function storeHelper54(storeParam308) {
  let storeValue557 = storeParam308;
  return (storeValue557[storeValue10] === "presorted" &&
    storeValue557.presortedPaths != null) ||
    storeHelper49(storeValue557.presortedPaths)
    ? storeValue557.presortedPaths
    : null;
}
function storeHelper55(storeParam317) {
  let storeValue563 = storeParam317;
  return typeof storeValue563.presortedPathsContainDirectories == "boolean"
    ? storeValue563.presortedPathsContainDirectories
    : null;
}
function storeHelper56(storeParam193, storeParam194 = {}) {
  let storeValue413 = storeHelper37(storeParam194),
    storeValue414 = storeHelper22(storeParam194);
  storeHelper24(storeValue414, "workload.inputFiles", storeParam193.length);
  let storeValue415 = storeHelper23(
    storeValue414,
    "store.preparePathEntries.parse",
    () => storeParam193.map((item) => storeHelper39(item)),
  );
  return (
    storeHelper23(storeValue414, "store.preparePathEntries.sort", () =>
      storeValue415.sort((storeParam443, storeParam444) =>
        storeHelper44(storeParam443, storeParam444, storeValue413.sort),
      ),
    ),
    storeValue415
  );
}
var storeValue11 = class {
  directories = new Map();
  directoryStack = [0];
  presortedDirectoryNodeIds = [];
  initialExpandedPathSet;
  createdDirectoriesAllExpanded = false;
  createdDirectoryCount = 0;
  lastPreparedPath = null;
  nodes = [storeHelper45()];
  options;
  instrumentation;
  segmentSortKeyCache = new Map();
  segmentTable = _e();
  hasDeferredDirectoryIndexes = false;
  constructor(storeParam84 = {}) {
    this.instrumentation = storeHelper22(storeParam84);
    this.options = storeHelper37(storeParam84);
    let storeValue263 = storeParam84.initialExpandedPaths ?? null;
    if (storeValue263 == null || storeValue263.length === 0)
      this.initialExpandedPathSet = null;
    else {
      let storeValue382 = new Set(),
        storeValue383 = storeValue263.length;
      for (
        let storeValue541 = 0;
        storeValue541 < storeValue383;
        storeValue541 += 1
      ) {
        let storeValue582 = storeValue263[storeValue541],
          storeValue583 = storeValue582.length;
        storeValue382.add(
          storeValue583 > 0 &&
            storeValue582.charCodeAt(storeValue583 - 1) === 47
            ? storeValue582.slice(0, storeValue583 - 1)
            : storeValue582,
        );
      }
      this.initialExpandedPathSet = storeValue382;
      this.createdDirectoriesAllExpanded = true;
    }
    this.directories.set(0, storeHelper1());
  }
  appendPaths(storeParam309) {
    return storeHelper23(
      this.instrumentation,
      "store.builder.appendPaths.parse",
      () =>
        this.appendPreparedPaths(
          storeParam309.map((item) => storeHelper39(item)),
        ),
    );
  }
  appendPreparedPaths(storeParam223, storeParam224 = true) {
    return (
      (this.createdDirectoriesAllExpanded = false),
      storeHelper23(
        this.instrumentation,
        "store.builder.appendPreparedPaths",
        () => {
          for (let storeValue666 of storeParam223)
            this.appendPreparedPath(storeValue666, storeParam224);
        },
      ),
      this
    );
  }
  appendPresortedPaths(storeParam1, storeParam2 = null) {
    return (
      storeHelper23(
        this.instrumentation,
        "store.builder.appendPresortedPaths",
        () => {
          if (storeParam2 === false) {
            this.appendPresortedFilePaths(storeParam1);
            return;
          }
          this.createdDirectoriesAllExpanded = false;
          let storeValue13 = null,
            storeValue14 = 0,
            storeValue15 = this.nodes,
            storeValue16 = this.segmentTable,
            storeValue17 = storeValue16.idByValue,
            storeValue18 = storeValue16.valueById,
            storeValue19 = this.directoryStack,
            storeValue20 = 0,
            storeValue21 = "",
            storeValue22 = 0;
          for (let storeValue23 of storeParam1) {
            if (storeValue13 === storeValue23)
              throw Error(`Duplicate path: "${storeValue23}"`);
            let storeValue24 =
                storeValue23.length > 0 &&
                storeValue23.charCodeAt(storeValue23.length - 1) === 47,
              storeValue25 = storeValue24
                ? storeValue23.length - 1
                : storeValue23.length,
              storeValue26 = 0,
              storeValue27 = 0;
            if (storeValue13 != null)
              if (
                storeValue21.length > 0 &&
                storeValue23.length > storeValue21.length &&
                storeValue23.startsWith(storeValue21)
              ) {
                storeValue26 = storeValue22;
                storeValue27 = storeValue21.length;
              } else {
                let storeValue279 = Math.min(storeValue25, storeValue13.length),
                  storeValue280 = true;
                for (
                  let storeValue458 = 0;
                  storeValue458 < storeValue279;
                  storeValue458++
                ) {
                  let storeValue487 = storeValue23.charCodeAt(storeValue458);
                  if (
                    storeValue487 !== storeValue13.charCodeAt(storeValue458)
                  ) {
                    storeValue280 = false;
                    break;
                  }
                  storeValue487 === 47 &&
                    (storeValue26++, (storeValue27 = storeValue458 + 1));
                }
                storeValue280 &&
                  storeValue24 &&
                  storeValue279 === storeValue25 &&
                  storeValue13.length > storeValue25 &&
                  storeValue13.charCodeAt(storeValue25) === 47 &&
                  (storeValue26++, (storeValue27 = storeValue25 + 1));
              }
            storeValue20 = storeValue26;
            storeValue14 = storeValue26;
            let storeValue28 = storeValue27,
              storeValue29 = storeValue23.indexOf("/", storeValue28);
            for (; storeValue29 >= 0 && storeValue29 < storeValue25; ) {
              let storeValue193 = storeValue19[storeValue20];
              if (storeValue193 === undefined)
                throw Error(
                  "Directory stack underflow while building the path store",
                );
              storeValue14++;
              let storeValue194 = storeValue23.slice(
                  storeValue28,
                  storeValue29,
                ),
                storeValue195 = storeValue17.get(storeValue194);
              storeValue195 === undefined &&
                ((storeValue195 = storeValue18.length),
                storeValue17.set(storeValue194, storeValue195),
                storeValue18.push(storeValue194));
              let storeValue196 = storeValue15.length;
              storeValue15.push({
                depthAndFlags: storeHelper13(storeValue14, 0, 1),
                nameId: storeValue195,
                parentId: storeValue193,
                subtreeNodeCount: 1,
                visibleSubtreeCount: 1,
              });
              this.recordCreatedDirectoryPath(
                storeValue23.slice(0, storeValue29),
              );
              storeValue20++;
              storeValue19[storeValue20] = storeValue196;
              storeValue28 = storeValue29 + 1;
              storeValue29 = storeValue23.indexOf("/", storeValue28);
            }
            if (storeValue24) {
              if (storeValue28 < storeValue25) {
                let storeValue247 = storeValue19[storeValue20];
                if (storeValue247 === undefined)
                  throw Error(
                    `Unable to resolve directory parent for "${storeValue23}"`,
                  );
                storeValue14++;
                let storeValue248 = storeValue23.slice(
                    storeValue28,
                    storeValue25,
                  ),
                  storeValue249 = storeValue17.get(storeValue248);
                storeValue249 === undefined &&
                  ((storeValue249 = storeValue18.length),
                  storeValue17.set(storeValue248, storeValue249),
                  storeValue18.push(storeValue248));
                let storeValue250 = storeValue15.length;
                storeValue15.push({
                  depthAndFlags: storeHelper13(storeValue14, 0, 1),
                  nameId: storeValue249,
                  parentId: storeValue247,
                  subtreeNodeCount: 1,
                  visibleSubtreeCount: 1,
                });
                storeValue20++;
                storeValue19[storeValue20] = storeValue250;
              }
              let storeValue163 = storeValue19[storeValue20];
              if (storeValue163 === undefined)
                throw Error(
                  `Unable to resolve directory node for "${storeValue23}"`,
                );
              this.promoteDirectoryToExplicit(storeValue163, storeValue23);
            } else {
              let storeValue291 = storeValue19[storeValue20];
              if (storeValue291 === undefined)
                throw Error(
                  `Unable to resolve file parent for "${storeValue23}"`,
                );
              let storeValue292 = storeValue23.slice(storeValue28),
                storeValue293 = storeValue17.get(storeValue292);
              storeValue293 === undefined &&
                ((storeValue293 = storeValue18.length),
                storeValue17.set(storeValue292, storeValue293),
                storeValue18.push(storeValue292));
              storeValue15.push({
                depthAndFlags: storeHelper13(storeValue14 + 1, 0),
                nameId: storeValue293,
                parentId: storeValue291,
                subtreeNodeCount: 1,
                visibleSubtreeCount: 1,
              });
            }
            storeValue28 !== storeValue21.length &&
              ((storeValue21 = storeValue23.substring(0, storeValue28)),
              (storeValue22 = storeValue14));
            storeValue13 = storeValue23;
          }
          storeValue19.length = storeValue20 + 1;
          storeValue13 != null &&
            (this.lastPreparedPath = storeHelper39(storeValue13));
          this.hasDeferredDirectoryIndexes = true;
        },
      ),
      this
    );
  }
  appendPresortedFilePaths(storeParam4) {
    let storeValue47 = null,
      storeValue48 = 0,
      storeValue49 = this.nodes,
      storeValue50 = this.segmentTable,
      storeValue51 = storeValue50.idByValue,
      storeValue52 = storeValue50.valueById,
      storeValue53 = this.directoryStack,
      storeValue54 = 0,
      storeValue55 = "",
      storeValue56 = 0;
    for (let storeValue57 of storeParam4) {
      if (storeValue47 === storeValue57)
        throw Error(`Duplicate path: "${storeValue57}"`);
      let storeValue64 = storeValue57.length,
        storeValue65 = 0,
        storeValue66 = 0;
      if (storeValue47 != null)
        if (
          storeValue55.length > 0 &&
          storeValue57.length > storeValue55.length &&
          storeValue57.startsWith(storeValue55)
        ) {
          storeValue65 = storeValue56;
          storeValue66 = storeValue55.length;
        } else {
          let storeValue477 = Math.min(storeValue64, storeValue47.length);
          for (
            let storeValue533 = 0;
            storeValue533 < storeValue477;
            storeValue533++
          ) {
            let storeValue571 = storeValue57.charCodeAt(storeValue533);
            if (storeValue571 !== storeValue47.charCodeAt(storeValue533)) break;
            storeValue571 === 47 &&
              (storeValue65++, (storeValue66 = storeValue533 + 1));
          }
        }
      storeValue54 = storeValue65;
      storeValue48 = storeValue65;
      let storeValue67 = storeValue66,
        storeValue68 = storeValue57.indexOf("/", storeValue67);
      for (; storeValue68 >= 0; ) {
        let storeValue197 = storeValue53[storeValue54];
        if (storeValue197 === undefined)
          throw Error(
            "Directory stack underflow while building the path store",
          );
        storeValue48++;
        let storeValue198 = storeValue57.slice(storeValue67, storeValue68),
          storeValue199 = storeValue51.get(storeValue198);
        storeValue199 === undefined &&
          ((storeValue199 = storeValue52.length),
          storeValue51.set(storeValue198, storeValue199),
          storeValue52.push(storeValue198));
        let storeValue200 = storeValue49.length;
        storeValue49.push({
          depthAndFlags: storeHelper13(storeValue48, 0, 1),
          nameId: storeValue199,
          parentId: storeValue197,
          subtreeNodeCount: 1,
          visibleSubtreeCount: 1,
        });
        this.recordCreatedDirectoryPath(storeValue57.slice(0, storeValue68));
        this.presortedDirectoryNodeIds.push(storeValue200);
        storeValue54++;
        storeValue53[storeValue54] = storeValue200;
        storeValue67 = storeValue68 + 1;
        storeValue68 = storeValue57.indexOf("/", storeValue67);
      }
      let storeValue69 = storeValue53[storeValue54];
      if (storeValue69 === undefined)
        throw Error(`Unable to resolve file parent for "${storeValue57}"`);
      let storeValue70 = storeValue57.slice(storeValue67),
        storeValue71 = storeValue51.get(storeValue70);
      storeValue71 === undefined &&
        ((storeValue71 = storeValue52.length),
        storeValue51.set(storeValue70, storeValue71),
        storeValue52.push(storeValue70));
      storeValue49.push({
        depthAndFlags: storeHelper13(storeValue48 + 1, 0),
        nameId: storeValue71,
        parentId: storeValue69,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1,
      });
      storeValue67 !== storeValue55.length &&
        ((storeValue55 = storeValue57.substring(0, storeValue67)),
        (storeValue56 = storeValue48));
      storeValue47 = storeValue57;
    }
    storeValue53.length = storeValue54 + 1;
    storeValue47 != null &&
      (this.lastPreparedPath = storeHelper39(storeValue47));
    this.hasDeferredDirectoryIndexes = true;
  }
  finish(storeParam39 = {}) {
    let storeValue174 = storeParam39.skipSubtreeCountPass === true;
    return (
      this.hasDeferredDirectoryIndexes
        ? (storeHelper23(
            this.instrumentation,
            "store.builder.buildDirectoryIndexes",
            () => this.buildPresortedFinish(storeValue174),
          ),
          (this.hasDeferredDirectoryIndexes = false))
        : storeValue174 ||
          storeHelper23(
            this.instrumentation,
            "store.builder.computeSubtreeCounts",
            () => this.computeSubtreeCounts(0),
          ),
      {
        directories: this.directories,
        nodes: this.nodes,
        options: this.options,
        rootId: 0,
        segmentTable: this.segmentTable,
        presortedDirectoryNodeIds:
          this.presortedDirectoryNodeIds.length > 0
            ? this.presortedDirectoryNodeIds
            : null,
      }
    );
  }
  didMatchAllInitialExpandedPaths() {
    return (
      this.createdDirectoriesAllExpanded &&
      this.initialExpandedPathSet != null &&
      this.createdDirectoryCount === this.initialExpandedPathSet.size
    );
  }
  appendPreparedPath(storeParam5, storeParam6) {
    if (
      ((this.hasDeferredDirectoryIndexes &&=
        (this.buildDirectoryIndexes(), false)),
      this.lastPreparedPath != null)
    ) {
      if (storeParam5.path === this.lastPreparedPath.path)
        throw Error(`Duplicate path: "${storeParam5.path}"`);
      if (
        storeParam6 &&
        (this.options.sort === "default"
          ? storeHelper35(
              this.lastPreparedPath,
              storeParam5,
              this.segmentSortKeyCache,
            )
          : storeHelper44(
              this.lastPreparedPath,
              storeParam5,
              this.options.sort,
            )) > 0
      )
        throw Error(
          `Builder input must be sorted before appendPaths(): "${storeParam5.path}"`,
        );
    }
    let storeValue58 = this.lastPreparedPath,
      storeValue59 = storeHelper47(storeParam5),
      storeValue60 = storeValue58 == null ? 0 : storeHelper47(storeValue58),
      storeValue61 =
        storeValue58 == null
          ? 0
          : storeHelper46(storeValue58.segments, storeParam5.segments),
      storeValue62 = Math.min(storeValue61, storeValue59, storeValue60);
    this.directoryStack.length = storeValue62 + 1;
    for (
      let storeValue346 = storeValue62;
      storeValue346 < storeValue59;
      storeValue346++
    ) {
      let storeValue364 = this.directoryStack[this.directoryStack.length - 1];
      if (storeValue364 === undefined)
        throw Error("Directory stack underflow while building the path store");
      let storeValue365 = storeParam6
        ? this.getOrCreateDirectoryChild(
            storeValue364,
            storeParam5.segments[storeValue346],
          )
        : this.createDirectoryChild(
            storeValue364,
            storeParam5.segments[storeValue346],
          );
      this.directoryStack.push(storeValue365);
    }
    if (storeParam5.isDirectory) {
      let storeValue442 = this.directoryStack[this.directoryStack.length - 1];
      if (storeValue442 === undefined)
        throw Error(
          `Unable to resolve directory node for "${storeParam5.path}"`,
        );
      this.promoteDirectoryToExplicit(storeValue442, storeParam5.path);
      this.lastPreparedPath = storeParam5;
      return;
    }
    let storeValue63 = this.directoryStack[this.directoryStack.length - 1];
    if (storeValue63 === undefined)
      throw Error(`Unable to resolve file parent for "${storeParam5.path}"`);
    storeParam6
      ? this.createFileChild(
          storeValue63,
          storeParam5.basename,
          storeParam5.path,
        )
      : this.createFileChildUnchecked(storeValue63, storeParam5.basename);
    this.lastPreparedPath = storeParam5;
  }
  recordCreatedDirectoryPath(storeParam220) {
    !this.createdDirectoriesAllExpanded ||
      this.initialExpandedPathSet == null ||
      ((this.createdDirectoryCount += 1),
      this.initialExpandedPathSet.has(storeParam220) ||
        (this.createdDirectoriesAllExpanded = false));
  }
  createFileChild(storeParam72, storeParam73, storeParam74) {
    let storeValue242 = storeHelper41(this.segmentTable, storeParam73),
      storeValue243 = this.getDirectoryIndex(storeParam72),
      storeValue244 = storeValue243.childIdByNameId;
    if (storeValue244 != null && storeValue244.get(storeValue242) !== undefined)
      throw Error(`Path collides with an existing entry: "${storeParam74}"`);
    let storeValue245 = this.nodes[storeParam72];
    if (storeValue245 === undefined)
      throw Error(`Unknown parent node ID: ${String(storeParam72)}`);
    let storeValue246 = this.nodes.length;
    return (
      this.nodes.push({
        depthAndFlags: storeHelper13(storeHelper14(storeValue245) + 1, 0),
        nameId: storeValue242,
        parentId: storeParam72,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1,
      }),
      storeValue244?.set(storeValue242, storeValue246),
      storeHelper5(storeValue243, storeValue246),
      storeValue246
    );
  }
  createFileChildUnchecked(storeParam87, storeParam88) {
    let storeValue281 = storeHelper41(this.segmentTable, storeParam88),
      storeValue282 = this.getDirectoryIndex(storeParam87),
      storeValue283 = this.nodes[storeParam87];
    if (storeValue283 === undefined)
      throw Error(`Unknown parent node ID: ${String(storeParam87)}`);
    let storeValue284 = this.nodes.length;
    return (
      this.nodes.push({
        depthAndFlags: storeHelper13(storeHelper14(storeValue283) + 1, 0),
        nameId: storeValue281,
        parentId: storeParam87,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1,
      }),
      storeValue282.childIdByNameId != null &&
        storeValue282.childIdByNameId.set(storeValue281, storeValue284),
      storeHelper5(storeValue282, storeValue284),
      storeValue284
    );
  }
  getOrCreateDirectoryChild(storeParam25, storeParam26) {
    let storeValue149 = storeHelper41(this.segmentTable, storeParam26),
      storeValue150 = this.getDirectoryIndex(storeParam25);
    if (storeValue150.childIdByNameId != null) {
      let storeValue421 = storeValue150.childIdByNameId.get(storeValue149);
      if (storeValue421 !== undefined) {
        let storeValue491 = this.nodes[storeValue421];
        if (storeValue491 != null && !storeHelper16(storeValue491))
          throw Error(
            `Path collides with an existing file while creating directory "${storeParam26}"`,
          );
        return storeValue421;
      }
    }
    let storeValue151 = this.nodes[storeParam25];
    if (storeValue151 === undefined)
      throw Error(`Unknown parent node ID: ${String(storeParam25)}`);
    let storeValue152 = this.nodes.length;
    return (
      this.nodes.push({
        depthAndFlags: storeHelper13(storeHelper14(storeValue151) + 1, 0, 1),
        nameId: storeValue149,
        parentId: storeParam25,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1,
      }),
      storeValue150.childIdByNameId != null &&
        storeValue150.childIdByNameId.set(storeValue149, storeValue152),
      storeHelper5(storeValue150, storeValue152),
      this.directories.set(storeValue152, storeHelper1()),
      storeValue152
    );
  }
  createDirectoryChild(storeParam85, storeParam86) {
    let storeValue264 = storeHelper41(this.segmentTable, storeParam86),
      storeValue265 = this.getDirectoryIndex(storeParam85),
      storeValue266 = this.nodes[storeParam85];
    if (storeValue266 === undefined)
      throw Error(`Unknown parent node ID: ${String(storeParam85)}`);
    let storeValue267 = this.nodes.length;
    return (
      this.nodes.push({
        depthAndFlags: storeHelper13(storeHelper14(storeValue266) + 1, 0, 1),
        nameId: storeValue264,
        parentId: storeParam85,
        subtreeNodeCount: 1,
        visibleSubtreeCount: 1,
      }),
      storeValue265.childIdByNameId != null &&
        storeValue265.childIdByNameId.set(storeValue264, storeValue267),
      storeHelper5(storeValue265, storeValue267),
      this.directories.set(storeValue267, storeHelper1()),
      storeValue267
    );
  }
  promoteDirectoryToExplicit(storeParam204, storeParam205) {
    let storeValue424 = this.nodes[storeParam204];
    if (storeValue424 === undefined)
      throw Error(`Unknown directory node ID: ${String(storeParam204)}`);
    if (!storeHelper16(storeValue424))
      throw Error(`Path is not a directory: "${storeParam205}"`);
    if (storeHelper18(storeValue424, 1))
      throw Error(`Duplicate path: "${storeParam205}"`);
    storeHelper19(storeValue424, 1);
  }
  getDirectoryIndex(storeParam293) {
    let storeValue535 = this.directories.get(storeParam293);
    if (storeValue535 !== undefined) return storeValue535;
    throw Error(
      `Unknown directory child index for node ${String(storeParam293)}`,
    );
  }
  buildPresortedFinish(storeParam41) {
    let storeValue182 = this.nodes,
      storeValue183 = this.directories;
    storeValue183.set(0, storeHelper2());
    let storeValue184 = -1,
      storeValue185 = null;
    for (
      let storeValue370 = 1;
      storeValue370 < storeValue182.length;
      storeValue370++
    ) {
      let storeValue402 = storeValue182[storeValue370];
      if (storeValue402 == null) continue;
      if (storeHelper16(storeValue402)) {
        let storeValue650 = storeHelper2();
        storeValue183.set(storeValue370, storeValue650);
        storeValue184 = storeValue370;
        storeValue185 = storeValue650;
      }
      let storeValue403;
      storeValue402.parentId === storeValue184
        ? (storeValue403 = storeValue185)
        : ((storeValue403 = storeValue183.get(storeValue402.parentId)),
          (storeValue184 = storeValue402.parentId),
          (storeValue185 = storeValue403 ?? null));
      storeValue403?.childIds.push(storeValue370);
    }
    if (!storeParam41)
      for (
        let storeValue431 = storeValue182.length - 1;
        storeValue431 >= 1;
        storeValue431--
      ) {
        let storeValue475 = storeValue182[storeValue431];
        if (storeValue475 == null) continue;
        let storeValue476 = storeValue182[storeValue475.parentId];
        storeValue476 != null &&
          ((storeValue476.subtreeNodeCount += storeValue475.subtreeNodeCount),
          (storeValue476.visibleSubtreeCount +=
            storeValue475.visibleSubtreeCount));
      }
  }
  buildDirectoryIndexes() {
    let storeValue355 = this.nodes;
    for (
      let storeValue412 = 1;
      storeValue412 < storeValue355.length;
      storeValue412++
    ) {
      let storeValue447 = storeValue355[storeValue412];
      if (storeValue447 == null) continue;
      storeHelper16(storeValue447) &&
        this.directories.set(storeValue412, storeHelper1());
      let storeValue448 = this.directories.get(storeValue447.parentId);
      storeValue448 != null &&
        (storeValue448.childIdByNameId != null &&
          storeValue448.childIdByNameId.set(
            storeValue447.nameId,
            storeValue412,
          ),
        storeHelper5(storeValue448, storeValue412));
    }
  }
  computeSubtreeCounts(storeParam120) {
    let storeValue310 = this.nodes[storeParam120];
    if (storeValue310 === undefined)
      throw Error(`Unknown node ID: ${String(storeParam120)}`);
    if (!storeHelper16(storeValue310))
      return (
        (storeValue310.subtreeNodeCount = 1),
        (storeValue310.visibleSubtreeCount = 1),
        1
      );
    let storeValue311 = this.getDirectoryIndex(storeParam120),
      storeValue312 = 1;
    for (let storeValue660 of storeValue311.childIds)
      storeValue312 += this.computeSubtreeCounts(storeValue660);
    return (
      storeHelper7(this.nodes, storeValue311),
      (storeValue310.subtreeNodeCount = storeValue312),
      (storeValue310.visibleSubtreeCount = storeValue312),
      storeValue312
    );
  }
};
function storeHelper57(
  storeParam81,
  storeParam82 = "closed",
  storeParam83 = null,
) {
  let storeValue262 = storeHelper59(storeParam82);
  return {
    activeNodeCount: storeParam81.nodes.length - 1,
    collapsedDirectoryIds: new Set(),
    collapseNewDirectoriesByDefault: false,
    defaultExpansion: storeValue262,
    directoriesOpenByDefault: storeValue262 === "open",
    hasCollapsedDirectoryOverrides: false,
    directoryLoadInfoById: new Map(),
    expandedDirectoryIds: new Set(),
    instrumentation: storeParam83,
    listeners: new Map(),
    pathCacheByNodeId: new Map([
      [
        storeParam81.rootId,
        {
          path: "",
          version: 0,
        },
      ],
    ]),
    pathCacheVersion: 0,
    snapshot: storeParam81,
    transactionStack: [],
  };
}
function storeHelper58() {
  return {
    affectedAncestorIds: new Set(),
    affectedNodeIds: new Set(),
    events: [],
  };
}
function storeHelper59(storeParam237) {
  if (typeof storeParam237 != "number") return storeParam237;
  if (!Number.isInteger(storeParam237) || storeParam237 < 0)
    throw Error(
      `initialExpansion must be "open", "closed", or a non-negative integer depth. Received: ${String(storeParam237)}`,
    );
  return storeParam237;
}
function storeHelper60(storeParam295, storeParam296) {
  return storeHelper18(storeParam296, 2) ||
    storeParam295.defaultExpansion === "open"
    ? true
    : storeParam295.defaultExpansion === "closed"
      ? false
      : storeHelper14(storeParam296) <= storeParam295.defaultExpansion;
}
function storeHelper61(
  storeParam196,
  storeParam197,
  storeParam198 = storeParam196.snapshot.nodes[storeParam197],
) {
  return storeParam198 == null || !storeHelper16(storeParam198)
    ? false
    : storeParam196.directoriesOpenByDefault &&
        !storeParam196.hasCollapsedDirectoryOverrides
      ? true
      : storeParam196.collapsedDirectoryIds.has(storeParam197)
        ? false
        : storeParam196.expandedDirectoryIds.has(storeParam197)
          ? true
          : storeHelper60(storeParam196, storeParam198);
}
function storeHelper62(
  storeParam113,
  storeParam114,
  storeParam115,
  storeParam116 = storeParam113.snapshot.nodes[storeParam114],
) {
  if (storeParam116 == null || !storeHelper16(storeParam116)) return;
  let storeValue305 = storeHelper60(storeParam113, storeParam116);
  if (storeParam115) {
    if (storeValue305) {
      storeParam113.collapsedDirectoryIds.delete(storeParam114);
      storeParam113.hasCollapsedDirectoryOverrides =
        storeParam113.collapsedDirectoryIds.size > 0;
      return;
    }
    storeParam113.expandedDirectoryIds.add(storeParam114);
    return;
  }
  if (storeValue305) {
    storeParam113.collapsedDirectoryIds.add(storeParam114);
    storeParam113.hasCollapsedDirectoryOverrides = true;
    return;
  }
  storeParam113.expandedDirectoryIds.delete(storeParam114);
}
function storeHelper63(storeParam229, storeParam230) {
  let storeValue453 = storeParam229.directoryLoadInfoById.get(storeParam230);
  if (storeValue453 != null) return storeValue453;
  let storeValue454 = {
    activeAttemptId: null,
    errorMessage: null,
    nextAttemptId: 1,
    state: "loaded",
  };
  return (
    storeParam229.directoryLoadInfoById.set(storeParam230, storeValue454),
    storeValue454
  );
}
function storeHelper64(storeParam390, storeParam391) {
  return (
    storeParam390.directoryLoadInfoById.get(storeParam391)?.state ?? "loaded"
  );
}
function storeHelper65(storeParam153, storeParam154) {
  let storeValue347 = storeHelper63(storeParam153, storeParam154);
  if (
    storeValue347.state === "loading" &&
    storeValue347.activeAttemptId != null
  )
    return {
      attemptId: storeValue347.activeAttemptId,
      nodeId: storeParam154,
      reused: true,
    };
  let storeValue348 = storeValue347.nextAttemptId;
  return (
    (storeValue347.activeAttemptId = storeValue348),
    (storeValue347.errorMessage = null),
    (storeValue347.nextAttemptId += 1),
    (storeValue347.state = "loading"),
    {
      attemptId: storeValue348,
      nodeId: storeParam154,
      reused: false,
    }
  );
}
function storeHelper66(storeParam355, storeParam356) {
  let storeValue597 = storeHelper63(storeParam355, storeParam356);
  storeValue597.activeAttemptId = null;
  storeValue597.errorMessage = null;
  storeValue597.state = "unloaded";
}
function storeHelper67(storeParam244, storeParam245, storeParam246) {
  let storeValue483 = storeParam244.directoryLoadInfoById.get(storeParam245);
  return storeValue483 == null ||
    storeValue483.activeAttemptId !== storeParam246
    ? false
    : ((storeValue483.activeAttemptId = null),
      (storeValue483.errorMessage = null),
      (storeValue483.state = "loaded"),
      true);
}
function storeHelper68(storeParam377, storeParam378, storeParam379) {
  return (
    storeParam377.directoryLoadInfoById.get(storeParam378)?.activeAttemptId ===
    storeParam379
  );
}
function storeHelper69(
  storeParam238,
  storeParam239,
  storeParam240,
  storeParam241,
) {
  let storeValue474 = storeParam238.directoryLoadInfoById.get(storeParam239);
  return storeValue474 == null ||
    storeValue474.activeAttemptId !== storeParam240
    ? false
    : ((storeValue474.activeAttemptId = null),
      (storeValue474.errorMessage = storeParam241 ?? null),
      (storeValue474.state = "error"),
      true);
}
function storeHelper70(storeParam415, storeParam416) {
  storeParam415.directoryLoadInfoById.delete(storeParam416);
}
function storeHelper71(storeParam216, storeParam217, storeParam218) {
  let storeValue440 = storeParam218,
    storeValue441 = storeParam216.listeners.get(storeParam217);
  return (
    storeValue441 == null
      ? storeParam216.listeners.set(storeParam217, new Set([storeValue440]))
      : storeValue441.add(storeValue440),
    () => {
      let storeValue604 = storeParam216.listeners.get(storeParam217);
      storeValue604 != null &&
        (storeValue604.delete(storeValue440),
        storeValue604.size === 0 &&
          storeParam216.listeners.delete(storeParam217));
    }
  );
}
function storeHelper72(storeParam209) {
  return {
    affectedAncestorIds: storeParam209.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam209.affectedNodeIds ?? [],
    canonicalChanged: true,
    operation: "add",
    path: storeParam209.path,
    projectionChanged: storeParam209.projectionChanged,
    visibleCountDelta: null,
  };
}
function storeHelper73(storeParam190) {
  return {
    affectedAncestorIds: storeParam190.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam190.affectedNodeIds ?? [],
    canonicalChanged: true,
    operation: "remove",
    path: storeParam190.path,
    projectionChanged: storeParam190.projectionChanged,
    recursive: storeParam190.recursive,
    visibleCountDelta: null,
  };
}
function storeHelper74(storeParam199) {
  return {
    affectedAncestorIds: storeParam199.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam199.affectedNodeIds ?? [],
    canonicalChanged: true,
    from: storeParam199.from,
    operation: "move",
    projectionChanged: storeParam199.projectionChanged,
    to: storeParam199.to,
    visibleCountDelta: null,
  };
}
function storeHelper75(storeParam222) {
  return {
    affectedAncestorIds: storeParam222.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam222.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "expand",
    path: storeParam222.path,
    projectionChanged: true,
    visibleCountDelta: null,
  };
}
function storeHelper76(storeParam221) {
  return {
    affectedAncestorIds: storeParam221.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam221.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "collapse",
    path: storeParam221.path,
    projectionChanged: true,
    visibleCountDelta: null,
  };
}
function storeHelper77(storeParam195) {
  return {
    affectedAncestorIds: storeParam195.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam195.affectedNodeIds ?? [],
    canonicalChanged: false,
    operation: "mark-directory-unloaded",
    path: storeParam195.path,
    projectionChanged: storeParam195.projectionChanged,
    visibleCountDelta: null,
  };
}
function $e(storeParam169) {
  return {
    affectedAncestorIds: storeParam169.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam169.affectedNodeIds ?? [],
    attemptId: storeParam169.attemptId,
    canonicalChanged: false,
    operation: "begin-child-load",
    path: storeParam169.path,
    projectionChanged: storeParam169.projectionChanged,
    reused: storeParam169.reused,
    visibleCountDelta: null,
  };
}
function storeHelper78(storeParam139) {
  return {
    affectedAncestorIds: storeParam139.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam139.affectedNodeIds ?? [],
    attemptId: storeParam139.attemptId,
    canonicalChanged: storeParam139.childEvents.some(
      (item) => item.canonicalChanged,
    ),
    childEvents: storeParam139.childEvents,
    operation: "apply-child-patch",
    path: storeParam139.path,
    projectionChanged: storeParam139.projectionChanged,
    visibleCountDelta: null,
  };
}
function storeHelper79(storeParam168) {
  return {
    affectedAncestorIds: storeParam168.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam168.affectedNodeIds ?? [],
    attemptId: storeParam168.attemptId,
    canonicalChanged: false,
    operation: "complete-child-load",
    path: storeParam168.path,
    projectionChanged: storeParam168.projectionChanged,
    stale: storeParam168.stale,
    visibleCountDelta: null,
  };
}
function storeHelper80(storeParam155) {
  return {
    affectedAncestorIds: storeParam155.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam155.affectedNodeIds ?? [],
    attemptId: storeParam155.attemptId,
    canonicalChanged: false,
    errorMessage: storeParam155.errorMessage,
    operation: "fail-child-load",
    path: storeParam155.path,
    projectionChanged: storeParam155.projectionChanged,
    stale: storeParam155.stale,
    visibleCountDelta: null,
  };
}
function storeHelper81(storeParam21) {
  return {
    activeNodeCountAfter: storeParam21.activeNodeCountAfter,
    activeNodeCountBefore: storeParam21.activeNodeCountBefore,
    affectedAncestorIds: storeParam21.affectedAncestorIds ?? [],
    affectedNodeIds: storeParam21.affectedNodeIds ?? [],
    cachedPathEntryCountAfter: storeParam21.cachedPathEntryCountAfter,
    cachedPathEntryCountBefore: storeParam21.cachedPathEntryCountBefore,
    canonicalChanged: false,
    idsPreserved: storeParam21.idsPreserved,
    loadInfoEntryCountAfter: storeParam21.loadInfoEntryCountAfter,
    loadInfoEntryCountBefore: storeParam21.loadInfoEntryCountBefore,
    mode: storeParam21.mode,
    operation: "cleanup",
    projectionChanged: storeParam21.projectionChanged,
    reclaimedCachedPathEntryCount: storeParam21.reclaimedCachedPathEntryCount,
    reclaimedLoadInfoEntryCount: storeParam21.reclaimedLoadInfoEntryCount,
    reclaimedNodeSlotCount: storeParam21.reclaimedNodeSlotCount,
    reclaimedSegmentCount: storeParam21.reclaimedSegmentCount,
    segmentCountAfter: storeParam21.segmentCountAfter,
    segmentCountBefore: storeParam21.segmentCountBefore,
    totalNodeSlotCountAfter: storeParam21.totalNodeSlotCountAfter,
    totalNodeSlotCountBefore: storeParam21.totalNodeSlotCountBefore,
    visibleCountDelta: null,
  };
}
function storeHelper82(storeParam401, storeParam402, storeParam403) {
  return {
    ...storeParam403,
    visibleCountDelta: storeHelper92(storeParam401) - storeParam402,
  };
}
function storeHelper83(storeParam284, storeParam285) {
  let storeValue527 = storeHelper92(storeParam284),
    storeValue528 = storeHelper58();
  storeParam284.transactionStack.push(storeValue528);
  try {
    storeParam285();
  } catch (storeValue669) {
    throw (storeHelper85(storeParam284, storeValue528, false), storeValue669);
  }
  storeHelper85(
    storeParam284,
    storeValue528,
    true,
    storeHelper92(storeParam284) - storeValue527,
  );
}
function storeHelper84(storeParam320, storeParam321) {
  let storeValue565 = storeParam320.instrumentation;
  if (storeValue565 == null) {
    at(storeParam320, storeParam321);
    return;
  }
  storeHelper23(storeValue565, "store.events.record", () =>
    at(storeParam320, storeParam321),
  );
}
function at(storeParam287, storeParam288) {
  let storeValue530 =
    storeParam287.transactionStack[storeParam287.transactionStack.length - 1] ??
    null;
  if (storeValue530 == null) {
    storeHelper90(storeParam287, storeParam288);
    return;
  }
  storeValue530.events.push(storeParam288);
  storeHelper89(storeValue530, storeParam288);
}
function storeHelper85(
  storeParam94,
  storeParam95,
  storeParam96,
  storeParam97 = null,
) {
  if (storeParam94.transactionStack.pop() !== storeParam95)
    throw Error("Transaction stack underflow");
  if (!storeParam96) return;
  let storeValue288 =
    storeParam94.transactionStack[storeParam94.transactionStack.length - 1] ??
    null;
  if (storeValue288 != null) {
    let storeValue594 = storeParam94.instrumentation;
    storeValue594 == null
      ? storeHelper88(storeValue288, storeParam95)
      : storeHelper23(storeValue594, "store.events.batch.merge", () =>
          storeHelper88(storeValue288, storeParam95),
        );
    return;
  }
  let storeValue289 = storeHelper86(storeParam95, storeParam97),
    storeValue290 = storeParam94.instrumentation;
  if (storeValue290 == null) {
    storeHelper90(storeParam94, storeValue289);
    return;
  }
  storeHelper23(storeValue290, "store.events.batch.commit", () =>
    storeHelper90(storeParam94, storeValue289),
  );
}
function storeHelper86(storeParam164, storeParam165) {
  return {
    affectedAncestorIds: [...storeParam164.affectedAncestorIds],
    affectedNodeIds: [...storeParam164.affectedNodeIds],
    canonicalChanged: storeParam164.events.some(
      (item) => item.canonicalChanged,
    ),
    events: [...storeParam164.events],
    operation: "batch",
    projectionChanged: storeParam164.events.some(
      (item) => item.projectionChanged,
    ),
    visibleCountDelta: storeParam165,
  };
}
function storeHelper87(storeParam313, storeParam314) {
  for (let storeValue652 of storeParam314.affectedAncestorIds)
    storeParam313.affectedAncestorIds.add(storeValue652);
  for (let storeValue661 of storeParam314.affectedNodeIds)
    storeParam313.affectedNodeIds.add(storeValue661);
}
function storeHelper88(storeParam395, storeParam396) {
  for (let storeValue670 of storeParam396.events)
    storeParam395.events.push(storeValue670);
  storeHelper87(storeParam395, storeParam396);
}
function storeHelper89(storeParam315, storeParam316) {
  for (let storeValue662 of storeParam316.affectedNodeIds)
    storeParam315.affectedNodeIds.add(storeValue662);
  for (let storeValue653 of storeParam316.affectedAncestorIds)
    storeParam315.affectedAncestorIds.add(storeValue653);
}
function storeHelper90(storeParam322, storeParam323) {
  let storeValue566 = storeParam322.instrumentation;
  if (storeValue566 == null) {
    storeHelper91(storeParam322, storeParam323);
    return;
  }
  storeHelper23(storeValue566, "store.events.emit", () =>
    storeHelper91(storeParam322, storeParam323),
  );
}
function storeHelper91(storeParam348, storeParam349) {
  storeParam348.listeners
    .get(storeParam349.operation)
    ?.forEach((storeParam445) => storeParam445(storeParam349));
  storeParam348.listeners
    .get("*")
    ?.forEach((storeParam446) => storeParam446(storeParam349));
}
function storeHelper92(storeParam374) {
  return (
    storeParam374.snapshot.nodes[storeParam374.snapshot.rootId]
      ?.visibleSubtreeCount ?? 0
  );
}
function storeHelper93(storeParam137, storeParam138) {
  if (storeParam137.snapshot.options.flattenEmptyDirectories !== true)
    return null;
  let storeValue325 = storeParam137.snapshot.nodes[storeParam138];
  if (
    storeValue325 == null ||
    !storeHelper16(storeValue325) ||
    storeHelper18(storeValue325, 2)
  )
    return null;
  let storeValue326 = storeParam137.snapshot.directories.get(storeParam138);
  if (storeValue326 == null || storeValue326.childIds.length !== 1) return null;
  let storeValue327 = storeValue326.childIds[0];
  if (storeValue327 == null) return null;
  let storeValue328 = storeParam137.snapshot.nodes[storeValue327];
  return storeValue328 == null || !storeHelper16(storeValue328)
    ? null
    : storeValue327;
}
function storeHelper94(storeParam362, storeParam363) {
  let storeValue618 = storeParam363;
  for (;;) {
    let storeValue654 = storeHelper93(storeParam362, storeValue618);
    if (storeValue654 == null) return storeValue618;
    storeValue618 = storeValue654;
  }
}
function storeHelper95(storeParam332, storeParam333) {
  let storeValue573 = [storeParam333],
    storeValue574 = storeParam333;
  for (;;) {
    let storeValue646 = storeHelper93(storeParam332, storeValue574);
    if (storeValue646 == null) return storeValue573;
    storeValue573.push(storeValue646);
    storeValue574 = storeValue646;
  }
}
function storeHelper96(storeParam364, storeParam365) {
  let storeValue620 =
    storeParam365 == null
      ? storeParam364.snapshot.rootId
      : storeHelper105(storeParam364, storeParam365);
  return storeValue620 == null
    ? []
    : storeHelper109(storeParam364, storeValue620);
}
function storeHelper97(storeParam61, storeParam62) {
  let storeValue224 = storeHelper39(storeParam62),
    storeValue225 = storeValue224.isDirectory
      ? storeValue224.segments
      : storeValue224.segments.slice(0, -1),
    storeValue226 = storeHelper124(
      storeParam61,
      storeHelper123(storeParam61, storeValue225),
    ),
    { createdNodeIds, directoryId } = storeHelper110(
      storeParam61,
      storeValue225,
    ),
    storeValue227 = new Set(createdNodeIds),
    storeValue228 = directoryId;
  if (storeValue224.isDirectory) {
    let storeValue505 = storeHelper108(storeParam61, directoryId);
    if (storeHelper18(storeValue505, 1))
      throw Error(`Path already exists: "${storeParam62}"`);
    storeHelper19(storeValue505, 1);
    storeParam61.pathCacheByNodeId.set(directoryId, {
      path: storeParam62,
      version: storeParam61.pathCacheVersion,
    });
    storeValue227.add(directoryId);
  } else {
    storeValue228 = storeHelper112(
      storeParam61,
      directoryId,
      storeValue224.basename,
    );
    storeValue227.add(storeValue228);
  }
  storeHelper102(storeParam61, directoryId);
  let storeValue229 = storeHelper124(storeParam61, directoryId);
  return storeHelper72({
    affectedAncestorIds: storeHelper104(storeParam61, storeValue228),
    affectedNodeIds: [...storeValue227],
    path: storeParam62,
    projectionChanged: storeHelper125(storeValue226, storeValue229),
  });
}
function storeHelper98(storeParam65, storeParam66, storeParam67) {
  let storeValue234 = storeHelper105(storeParam65, storeParam66);
  if (storeValue234 == null)
    throw Error(`Path does not exist: "${storeParam66}"`);
  let storeValue235 = storeHelper108(storeParam65, storeValue234);
  if (storeHelper18(storeValue235, 2))
    throw Error("The root node cannot be removed");
  if (
    storeHelper16(storeValue235) &&
    storeHelper107(storeParam65, storeValue234).childIds.length > 0 &&
    storeParam67.recursive !== true
  )
    throw Error(
      `Cannot remove a non-empty directory without recursive: "${storeParam66}"`,
    );
  let storeValue236 = storeValue235.parentId,
    storeValue237 = storeHelper124(storeParam65, storeValue236),
    storeValue238 = storeHelper121(storeParam65, storeValue234);
  storeHelper115(
    storeParam65,
    storeValue236,
    storeValue234,
    storeValue235.nameId,
  );
  storeHelper122(storeParam65, storeValue236);
  storeHelper102(storeParam65, storeValue236);
  let storeValue239 = storeHelper124(storeParam65, storeValue236);
  return storeHelper73({
    affectedAncestorIds: storeHelper104(storeParam65, storeValue236),
    affectedNodeIds: storeValue238,
    path: storeParam66,
    projectionChanged: storeHelper125(storeValue237, storeValue239),
    recursive: storeParam67.recursive === true,
  });
}
function _t(storeParam15, storeParam16, storeParam17, storeParam18) {
  let storeValue112 = storeHelper105(storeParam15, storeParam16);
  if (storeValue112 == null)
    throw Error(`Source path does not exist: "${storeParam16}"`);
  let storeValue113 = storeHelper108(storeParam15, storeValue112);
  if (storeHelper18(storeValue113, 2))
    throw Error("The root node cannot be moved");
  let storeValue114 = storeParam18.collision ?? "error",
    storeValue115 = storeHelper119(storeParam15, storeValue112, storeParam17),
    storeValue116 = storeHelper124(storeParam15, storeValue113.parentId),
    storeValue117 = storeHelper124(storeParam15, storeValue115.parentId),
    storeValue118 = storeHelper42(
      storeParam15.snapshot.segmentTable,
      storeValue113.nameId,
    ),
    storeValue119 = storeHelper41(
      storeParam15.snapshot.segmentTable,
      storeValue115.basename,
    );
  if (
    storeValue115.parentId === storeValue113.parentId &&
    storeValue118 === storeValue115.basename
  )
    return null;
  if (
    storeHelper16(storeValue113) &&
    storeHelper129(storeParam15, storeValue112, storeValue115.parentId)
  )
    throw Error("Cannot move a directory into one of its descendants");
  let storeValue120 = storeHelper3(
      storeParam15.snapshot.nodes,
      storeHelper107(storeParam15, storeValue115.parentId),
    ).get(storeValue119),
    storeValue121 = storeValue115.existingNodeId ?? storeValue120 ?? null;
  if (
    storeValue121 != null &&
    storeValue121 !== storeValue112 &&
    storeHelper120(
      storeParam15,
      storeValue121,
      storeValue114,
      storeHelper15(storeValue113),
    ) === "skip"
  )
    return null;
  let storeValue122 = storeValue113.parentId;
  storeHelper115(
    storeParam15,
    storeValue122,
    storeValue112,
    storeValue113.nameId,
  );
  storeValue113.parentId = storeValue115.parentId;
  storeValue113.nameId = storeValue119;
  storeParam15.pathCacheByNodeId.delete(storeValue112);
  storeHelper128(storeParam15, storeValue112);
  storeHelper114(storeParam15, storeValue115.parentId, storeValue112);
  storeHelper122(storeParam15, storeValue122);
  storeParam15.pathCacheVersion++;
  storeHelper102(storeParam15, storeValue122);
  storeValue115.parentId !== storeValue122 &&
    storeHelper102(storeParam15, storeValue115.parentId);
  let storeValue123 = storeHelper124(storeParam15, storeValue122),
    storeValue124 = storeHelper124(storeParam15, storeValue115.parentId);
  return storeHelper74({
    affectedAncestorIds: [
      ...new Set([
        ...storeHelper104(storeParam15, storeValue122),
        ...storeHelper104(storeParam15, storeValue115.parentId),
      ]),
    ],
    affectedNodeIds: [storeValue112],
    from: storeParam16,
    projectionChanged: storeHelper126(
      [storeValue116, storeValue117],
      [storeValue123, storeValue124],
    ),
    to: storeHelper101(storeParam15, storeValue112),
  });
}
function storeHelper99(storeParam340, storeParam341) {
  let storeValue584 = storeParam340.pathCacheByNodeId.get(storeParam341);
  return storeValue584 != null &&
    storeValue584.version === storeParam340.pathCacheVersion
    ? storeValue584.path
    : null;
}
function storeHelper100(storeParam359, storeParam360, storeParam361) {
  return (
    storeParam359.pathCacheByNodeId.set(storeParam360, {
      path: storeParam361,
      version: storeParam359.pathCacheVersion,
    }),
    storeParam361
  );
}
function storeHelper101(storeParam206, storeParam207) {
  let storeValue426 = storeHelper108(storeParam206, storeParam207),
    storeValue427 = storeHelper99(storeParam206, storeParam207);
  if (storeValue427 != null) return storeValue427;
  if (storeHelper18(storeValue426, 2))
    return storeHelper100(storeParam206, storeParam207, "");
  let storeValue428 = storeHelper101(storeParam206, storeValue426.parentId),
    storeValue429 = storeHelper42(
      storeParam206.snapshot.segmentTable,
      storeValue426.nameId,
    ),
    storeValue430 =
      storeValue428.length === 0
        ? storeValue429
        : `${storeValue428}${storeValue429}`;
  return storeHelper100(
    storeParam206,
    storeParam207,
    storeHelper16(storeValue426) ? `${storeValue430}/` : storeValue430,
  );
}
function storeHelper102(storeParam306, storeParam307) {
  let storeValue554 = storeParam306.instrumentation;
  if (storeValue554 == null) {
    storeHelper131(storeParam306, storeParam307);
    return;
  }
  storeHelper23(storeValue554, "store.recomputeCountsUpwardFrom", () =>
    storeHelper131(storeParam306, storeParam307),
  );
}
function storeHelper103(storeParam124, storeParam125) {
  let storeValue313 = [[storeParam125, 0]],
    { nodes, directories } = storeParam124.snapshot;
  for (; storeValue313.length > 0; ) {
    let storeValue373 = storeValue313[storeValue313.length - 1],
      storeValue374 = storeValue373[0],
      storeValue375 = nodes[storeValue374];
    if (storeValue375 == null || !storeHelper16(storeValue375)) {
      storeHelper130(storeParam124, storeValue374, storeValue375, true);
      storeValue313.pop();
      continue;
    }
    let storeValue376 = directories.get(storeValue374);
    if (
      storeValue376 == null ||
      storeValue373[1] >= storeValue376.childIds.length
    ) {
      storeHelper130(storeParam124, storeValue374, storeValue375, true);
      storeValue313.pop();
      continue;
    }
    let storeValue377 = storeValue376.childIds[storeValue373[1]++];
    storeValue313.push([storeValue377, 0]);
  }
}
function storeHelper104(storeParam282, storeParam283) {
  let storeValue523 = [],
    storeValue524 = storeParam283;
  for (; storeValue524 != null; ) {
    let storeValue628 = storeHelper108(storeParam282, storeValue524);
    if (
      (storeValue523.push(storeValue524),
      storeValue524 === storeParam282.snapshot.rootId)
    )
      break;
    storeValue524 = storeValue628.parentId;
  }
  return storeValue523;
}
function storeHelper105(storeParam335, storeParam336) {
  if (storeParam336.length === 0) return storeParam335.snapshot.rootId;
  let storeValue577 = storeHelper40(storeParam336);
  return storeHelper106(
    storeParam335,
    storeValue577.segments,
    storeValue577.requiresDirectory,
  );
}
function storeHelper106(storeParam177, storeParam178, storeParam179) {
  let storeValue380 = storeParam177.snapshot.rootId;
  for (let storeValue488 of storeParam178) {
    let storeValue498 =
      storeParam177.snapshot.segmentTable.idByValue.get(storeValue488);
    if (storeValue498 === undefined) return null;
    let storeValue499 = storeHelper107(storeParam177, storeValue380),
      storeValue500 = storeHelper3(
        storeParam177.snapshot.nodes,
        storeValue499,
      ).get(storeValue498);
    if (storeValue500 === undefined) return null;
    storeValue380 = storeValue500;
  }
  let storeValue381 = storeHelper108(storeParam177, storeValue380);
  return storeParam179 && !storeHelper16(storeValue381) ? null : storeValue380;
}
function storeHelper107(storeParam297, storeParam298) {
  let storeValue536 = storeParam297.snapshot.directories.get(storeParam298);
  if (storeValue536 === undefined)
    throw Error(
      `Unknown directory child index for node ${String(storeParam298)}`,
    );
  return storeValue536;
}
function storeHelper108(storeParam330, storeParam331) {
  let storeValue572 = storeParam330.snapshot.nodes[storeParam331];
  if (storeValue572 === undefined || storeHelper18(storeValue572, 4))
    throw Error(`Unknown node ID: ${String(storeParam331)}`);
  return storeValue572;
}
function storeHelper109(storeParam34, storeParam35) {
  let storeValue160 = storeParam34.snapshot.nodes[storeParam35];
  if (storeValue160 === undefined || storeHelper18(storeValue160, 4)) return [];
  if (!storeHelper16(storeValue160))
    return [storeHelper101(storeParam34, storeParam35)];
  if (storeHelper107(storeParam34, storeParam35).childIds.length === 0)
    return storeHelper18(storeValue160, 1) && !storeHelper18(storeValue160, 2)
      ? [storeHelper101(storeParam34, storeParam35)]
      : [];
  let storeValue161 = [],
    storeValue162 = [
      {
        childIndex: 0,
        nodeId: storeParam35,
      },
    ];
  for (; storeValue162.length > 0; ) {
    let storeValue268 = storeValue162[storeValue162.length - 1];
    if (storeValue268 == null) break;
    let storeValue269 = storeParam34.snapshot.nodes[storeValue268.nodeId];
    if (storeValue269 === undefined || storeHelper18(storeValue269, 4)) {
      storeValue162.pop();
      continue;
    }
    if (!storeHelper16(storeValue269)) {
      storeValue161.push(storeHelper101(storeParam34, storeValue268.nodeId));
      storeValue162.pop();
      continue;
    }
    let storeValue270 = storeHelper107(storeParam34, storeValue268.nodeId);
    if (storeValue270.childIds.length === 0) {
      storeHelper18(storeValue269, 1) &&
        !storeHelper18(storeValue269, 2) &&
        storeValue161.push(storeHelper101(storeParam34, storeValue268.nodeId));
      storeValue162.pop();
      continue;
    }
    let storeValue271 = storeValue270.childIds[storeValue268.childIndex];
    if (storeValue271 == null) {
      storeValue162.pop();
      continue;
    }
    storeValue268.childIndex++;
    storeValue162.push({
      childIndex: 0,
      nodeId: storeValue271,
    });
  }
  return storeValue161;
}
function storeHelper110(storeParam107, storeParam108) {
  let storeValue301 = [],
    storeValue302 = storeParam107.snapshot.rootId;
  for (let storeValue353 of storeParam108) {
    let storeValue367 = storeHelper41(
        storeParam107.snapshot.segmentTable,
        storeValue353,
      ),
      storeValue368 = storeHelper107(storeParam107, storeValue302),
      storeValue369 = storeHelper3(
        storeParam107.snapshot.nodes,
        storeValue368,
      ).get(storeValue367);
    if (storeValue369 !== undefined) {
      if (!storeHelper16(storeHelper108(storeParam107, storeValue369)))
        throw Error(
          `Cannot create a directory that collides with an existing file: "${storeValue353}"`,
        );
      storeValue302 = storeValue369;
      continue;
    }
    storeValue302 = storeHelper111(storeParam107, storeValue302, storeValue367);
    storeValue301.push(storeValue302);
  }
  return {
    createdNodeIds: storeValue301,
    directoryId: storeValue302,
  };
}
function storeHelper111(storeParam109, storeParam110, storeParam111) {
  let storeValue303 = storeHelper108(storeParam109, storeParam110),
    storeValue304 = storeParam109.snapshot.nodes.length;
  return (
    storeParam109.snapshot.nodes.push({
      depthAndFlags: storeHelper13(storeHelper14(storeValue303) + 1, 0, 1),
      nameId: storeParam111,
      parentId: storeParam110,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1,
    }),
    storeParam109.snapshot.directories.set(storeValue304, storeHelper1()),
    storeHelper114(storeParam109, storeParam110, storeValue304),
    storeParam109.collapseNewDirectoriesByDefault &&
      (storeParam109.collapsedDirectoryIds.add(storeValue304),
      (storeParam109.hasCollapsedDirectoryOverrides = true)),
    storeParam109.activeNodeCount++,
    storeValue304
  );
}
function storeHelper112(storeParam117, storeParam118, storeParam119) {
  let storeValue306 = storeHelper41(
      storeParam117.snapshot.segmentTable,
      storeParam119,
    ),
    storeValue307 = storeHelper107(storeParam117, storeParam118);
  if (
    storeHelper3(storeParam117.snapshot.nodes, storeValue307).has(storeValue306)
  )
    throw Error(
      `Path already exists: "${storeHelper133(storeParam117, storeParam118, storeParam119)}"`,
    );
  let storeValue308 = storeHelper108(storeParam117, storeParam118),
    storeValue309 = storeParam117.snapshot.nodes.length;
  return (
    storeParam117.snapshot.nodes.push({
      depthAndFlags: storeHelper13(storeHelper14(storeValue308) + 1, 0),
      nameId: storeValue306,
      parentId: storeParam118,
      subtreeNodeCount: 1,
      visibleSubtreeCount: 1,
    }),
    storeHelper114(storeParam117, storeParam118, storeValue309),
    storeParam117.activeNodeCount++,
    storeValue309
  );
}
function storeHelper113(storeParam225, storeParam226, storeParam227) {
  let storeValue450 = 0,
    storeValue451 = storeParam226.childIds.length;
  for (; storeValue450 < storeValue451; ) {
    let storeValue547 = (storeValue450 + storeValue451) >>> 1,
      storeValue548 = storeParam226.childIds[storeValue547];
    if (storeValue548 == null) {
      storeValue451 = storeValue547;
      continue;
    }
    storeHelper116(storeParam225, storeParam227, storeValue548) < 0
      ? (storeValue451 = storeValue547)
      : (storeValue450 = storeValue547 + 1);
  }
  return storeValue450;
}
function storeHelper114(storeParam231, storeParam232, storeParam233) {
  let storeValue455 = storeHelper107(storeParam231, storeParam232),
    storeValue456 = storeHelper108(storeParam231, storeParam233);
  storeHelper3(storeParam231.snapshot.nodes, storeValue455).set(
    storeValue456.nameId,
    storeParam233,
  );
  storeHelper8(
    storeValue455,
    storeParam233,
    storeValue456.subtreeNodeCount,
    storeValue456.visibleSubtreeCount,
  );
  let storeValue457 = storeHelper113(
    storeParam231,
    storeValue455,
    storeParam233,
  );
  storeValue455.childIds.splice(storeValue457, 0, storeParam233);
  storeHelper6(storeValue455, storeValue457);
  storeHelper11(storeParam231.snapshot.nodes, storeValue455);
}
function storeHelper115(
  storeParam182,
  storeParam183,
  storeParam184,
  storeParam185,
) {
  let storeValue386 = storeHelper107(storeParam182, storeParam183),
    storeValue387 = storeHelper4(storeValue386),
    storeValue388 = storeValue387.get(storeParam184) ?? -1;
  storeHelper3(storeParam182.snapshot.nodes, storeValue386).delete(
    storeParam185,
  );
  storeValue387.delete(storeParam184);
  let storeValue389 = storeParam182.snapshot.nodes[storeParam184];
  storeValue389 != null &&
    storeHelper8(
      storeValue386,
      storeParam184,
      -storeValue389.subtreeNodeCount,
      -storeValue389.visibleSubtreeCount,
    );
  storeValue388 >= 0 &&
    (storeValue386.childIds.splice(storeValue388, 1),
    storeHelper6(storeValue386, storeValue388),
    storeHelper11(storeParam182.snapshot.nodes, storeValue386));
}
function storeHelper116(storeParam350, storeParam351, storeParam352) {
  let storeValue595 = storeParam350.snapshot.options.sort;
  return storeValue595 === "default"
    ? storeHelper117(storeParam350, storeParam351, storeParam352)
    : storeValue595(
        storeHelper118(storeParam350, storeParam351),
        storeHelper118(storeParam350, storeParam352),
      );
}
function storeHelper117(storeParam140, storeParam141, storeParam142) {
  let storeValue329 = storeHelper108(storeParam140, storeParam141),
    storeValue330 = storeHelper108(storeParam140, storeParam142),
    storeValue331 = storeHelper16(storeValue329);
  if (storeValue331 !== storeHelper16(storeValue330))
    return storeValue331 ? -1 : 1;
  let storeValue332 = storeHelper29(
    storeHelper36(storeParam140.snapshot.segmentTable, storeValue329.nameId),
    storeHelper36(storeParam140.snapshot.segmentTable, storeValue330.nameId),
  );
  if (storeValue332 !== 0) return storeValue332;
  let storeValue333 = storeHelper42(
      storeParam140.snapshot.segmentTable,
      storeValue329.nameId,
    ),
    storeValue334 = storeHelper42(
      storeParam140.snapshot.segmentTable,
      storeValue330.nameId,
    );
  return storeValue333 === storeValue334
    ? storeParam141 < storeParam142
      ? -1
      : 1
    : storeValue333 < storeValue334
      ? -1
      : 1;
}
function storeHelper118(storeParam210, storeParam211) {
  let storeValue432 = storeHelper108(storeParam210, storeParam211),
    storeValue433 = storeHelper101(storeParam210, storeParam211),
    storeValue434 = storeHelper16(storeValue432),
    storeValue435 = storeValue434 ? storeValue433.slice(0, -1) : storeValue433;
  return {
    basename: storeHelper42(
      storeParam210.snapshot.segmentTable,
      storeValue432.nameId,
    ),
    depth: storeHelper14(storeValue432),
    isDirectory: storeValue434,
    path: storeValue433,
    segments: storeValue435.length === 0 ? [] : storeValue435.split("/"),
  };
}
function storeHelper119(storeParam55, storeParam56, storeParam57) {
  let storeValue211 = storeHelper108(storeParam55, storeParam56),
    storeValue212 = storeHelper105(storeParam55, storeParam57);
  if (storeValue212 != null) {
    let storeValue396 = storeHelper108(storeParam55, storeValue212);
    if (storeHelper16(storeValue396))
      return {
        basename: storeHelper42(
          storeParam55.snapshot.segmentTable,
          storeValue211.nameId,
        ),
        existingNodeId: null,
        parentId: storeValue212,
      };
    let storeValue397 = storeHelper40(storeParam57).segments;
    return {
      basename: storeValue397[storeValue397.length - 1] ?? "",
      existingNodeId: storeValue212,
      parentId: storeValue396.parentId,
    };
  }
  let storeValue213 = storeHelper40(storeParam57),
    storeValue214 =
      storeValue213.segments[storeValue213.segments.length - 1] ?? "",
    storeValue215 = storeValue213.segments.slice(0, -1),
    storeValue216 =
      storeValue215.length === 0
        ? storeParam55.snapshot.rootId
        : storeHelper106(storeParam55, storeValue215, true);
  if (storeValue216 == null)
    throw Error(`Destination parent does not exist: "${storeParam57}"`);
  return {
    basename: storeValue214,
    existingNodeId: null,
    parentId: storeValue216,
  };
}
function storeHelper120(
  storeParam89,
  storeParam90,
  storeParam91,
  storeParam92,
) {
  if (storeParam91 === "skip") return "skip";
  if (storeParam91 === "error")
    throw Error(
      `Destination already exists: "${storeHelper101(storeParam89, storeParam90)}"`,
    );
  let storeValue285 = storeHelper108(storeParam89, storeParam90);
  if (storeHelper15(storeValue285) !== storeParam92)
    throw Error(
      "replace collision requires the same source and destination kinds",
    );
  if (
    storeHelper16(storeValue285) &&
    storeHelper107(storeParam89, storeParam90).childIds.length > 0
  )
    throw Error("replace collision does not support non-empty directories");
  let storeValue286 = storeValue285.parentId,
    storeValue287 = storeValue285.nameId;
  return (
    storeHelper121(storeParam89, storeParam90),
    storeHelper115(storeParam89, storeValue286, storeParam90, storeValue287),
    storeHelper122(storeParam89, storeValue286),
    storeHelper102(storeParam89, storeValue286),
    "handled"
  );
}
function storeHelper121(storeParam28, storeParam29) {
  let storeValue158 = [],
    storeValue159 = [
      {
        nodeId: storeParam29,
        visitedChildren: false,
      },
    ];
  for (; storeValue159.length > 0; ) {
    let storeValue186 = storeValue159.pop();
    if (storeValue186 == null) break;
    let storeValue187 = storeHelper108(storeParam28, storeValue186.nodeId);
    if (storeValue186.visitedChildren || !storeHelper16(storeValue187)) {
      storeHelper16(storeValue187) &&
        storeParam28.snapshot.directories.delete(storeValue186.nodeId);
      storeHelper19(storeValue187, 4);
      storeParam28.pathCacheByNodeId.delete(storeValue186.nodeId);
      storeParam28.collapsedDirectoryIds.delete(storeValue186.nodeId) &&
        (storeParam28.hasCollapsedDirectoryOverrides =
          storeParam28.collapsedDirectoryIds.size > 0);
      storeParam28.expandedDirectoryIds.delete(storeValue186.nodeId);
      storeHelper70(storeParam28, storeValue186.nodeId);
      storeParam28.activeNodeCount--;
      storeValue158.push(storeValue186.nodeId);
      continue;
    }
    storeValue159.push({
      nodeId: storeValue186.nodeId,
      visitedChildren: true,
    });
    let storeValue188 = storeHelper107(storeParam28, storeValue186.nodeId);
    for (
      let storeValue564 = storeValue188.childIds.length - 1;
      storeValue564 >= 0;
      storeValue564--
    ) {
      let storeValue629 = storeValue188.childIds[storeValue564];
      storeValue629 != null &&
        storeValue159.push({
          nodeId: storeValue629,
          visitedChildren: false,
        });
    }
  }
  return storeValue158;
}
function storeHelper122(storeParam253, storeParam254) {
  let storeValue494 = storeParam254;
  for (; storeValue494 != null; ) {
    let storeValue561 = storeHelper108(storeParam253, storeValue494);
    if (
      !storeHelper16(storeValue561) ||
      storeHelper18(storeValue561, 2) ||
      storeHelper107(storeParam253, storeValue494).childIds.length > 0
    )
      return;
    storeHelper19(storeValue561, 1);
    storeValue494 =
      storeValue561.parentId === storeValue494 ? null : storeValue561.parentId;
  }
}
function storeHelper123(storeParam214, storeParam215) {
  let storeValue439 = storeParam214.snapshot.rootId;
  for (let storeValue497 of storeParam215) {
    let storeValue513 =
      storeParam214.snapshot.segmentTable.idByValue.get(storeValue497);
    if (storeValue513 == null) break;
    let storeValue514 = storeHelper3(
      storeParam214.snapshot.nodes,
      storeHelper107(storeParam214, storeValue439),
    ).get(storeValue513);
    if (
      storeValue514 == null ||
      !storeHelper16(storeHelper108(storeParam214, storeValue514))
    )
      break;
    storeValue439 = storeValue514;
  }
  return storeValue439;
}
function storeHelper124(storeParam186, storeParam187) {
  let storeValue390 = storeHelper127(storeParam186, storeParam187);
  if (storeValue390 == null) return null;
  let storeValue391 = storeHelper94(storeParam186, storeValue390),
    storeValue392 = storeHelper108(storeParam186, storeValue391),
    storeValue393 =
      storeValue390 === storeValue391
        ? null
        : storeHelper95(storeParam186, storeValue390).map((item) =>
            storeHelper101(storeParam186, item),
          );
  return JSON.stringify({
    flattenedSegmentPaths: storeValue393,
    hasChildren:
      storeHelper107(storeParam186, storeValue391).childIds.length > 0,
    path: storeHelper101(storeParam186, storeValue391),
    terminalKind: storeHelper15(storeValue392),
  });
}
function storeHelper125(storeParam434, storeParam435) {
  return storeHelper126([storeParam434], [storeParam435]);
}
function storeHelper126(storeParam291, storeParam292) {
  for (
    let storeValue585 = 0;
    storeValue585 < storeParam291.length;
    storeValue585 += 1
  ) {
    let storeValue634 = storeParam291[storeValue585],
      storeValue635 = storeParam292[storeValue585];
    if (
      storeValue634 == null ||
      storeValue635 == null ||
      storeValue634 !== storeValue635
    )
      return true;
  }
  return false;
}
function storeHelper127(storeParam271, storeParam272) {
  let storeValue511 = storeParam272;
  for (; storeValue511 != null; ) {
    let storeValue610 = storeHelper108(storeParam271, storeValue511);
    if (!storeHelper16(storeValue610) || storeHelper18(storeValue610, 2))
      return null;
    if (!storeHelper61(storeParam271, storeValue511, storeValue610))
      return storeValue511;
    storeValue511 = storeValue610.parentId;
  }
  return null;
}
function storeHelper128(storeParam269, storeParam270) {
  let storeValue509 = storeHelper108(storeParam269, storeParam270);
  if (
    (storeHelper20(
      storeValue509,
      (storeParam270 === storeParam269.snapshot.rootId
        ? -1
        : storeHelper14(
            storeHelper108(storeParam269, storeValue509.parentId),
          )) + 1,
    ),
    !storeHelper16(storeValue509))
  )
    return;
  let storeValue510 = storeHelper107(storeParam269, storeParam270);
  for (let storeValue671 of storeValue510.childIds)
    storeHelper128(storeParam269, storeValue671);
}
function storeHelper129(storeParam263, storeParam264, storeParam265) {
  let storeValue507 = storeParam265;
  for (; storeValue507 != null; ) {
    if (storeValue507 === storeParam264) return true;
    let storeValue605 = storeHelper108(storeParam263, storeValue507);
    if (storeValue507 === storeParam263.snapshot.rootId) return false;
    storeValue507 = storeValue605.parentId;
  }
  return false;
}
function storeHelper130(
  storeParam274,
  storeParam275,
  storeParam276 = storeHelper108(storeParam274, storeParam275),
  storeParam277 = false,
) {
  let storeValue515 = storeParam274.instrumentation;
  if (storeValue515 == null) {
    storeHelper132(storeParam274, storeParam275, storeParam276, storeParam277);
    return;
  }
  storeHelper23(storeValue515, "store.recomputeNodeCounts", () =>
    storeHelper132(storeParam274, storeParam275, storeParam276, storeParam277),
  );
}
function storeHelper131(storeParam160, storeParam161) {
  let storeValue354 = storeParam161;
  for (; storeValue354 != null; ) {
    let storeValue404 = storeHelper108(storeParam160, storeValue354),
      storeValue405 = storeValue404.subtreeNodeCount,
      storeValue406 = storeValue404.visibleSubtreeCount;
    if (
      (storeHelper130(storeParam160, storeValue354, storeValue404),
      storeValue354 === storeParam160.snapshot.rootId)
    )
      return;
    let storeValue407 = storeValue404.subtreeNodeCount - storeValue405,
      storeValue408 = storeValue404.visibleSubtreeCount - storeValue406,
      storeValue409 = storeValue404.parentId;
    (storeValue407 !== 0 || storeValue408 !== 0) &&
      storeHelper8(
        storeHelper107(storeParam160, storeValue409),
        storeValue354,
        storeValue407,
        storeValue408,
      );
    storeValue354 = storeValue409;
  }
}
function storeHelper132(
  storeParam75,
  storeParam76,
  storeParam77,
  storeParam78,
) {
  if (!storeHelper16(storeParam77)) {
    storeParam77.subtreeNodeCount = 1;
    storeParam77.visibleSubtreeCount = 1;
    return;
  }
  let storeValue251 = storeHelper107(storeParam75, storeParam76);
  if (storeParam78) {
    let storeValue502 = storeParam75.instrumentation;
    storeValue502 == null
      ? storeHelper7(storeParam75.snapshot.nodes, storeValue251)
      : storeHelper23(
          storeValue502,
          "store.recomputeNodeCounts.rebuildChildAggregates",
          () => storeHelper7(storeParam75.snapshot.nodes, storeValue251),
        );
  }
  let storeValue252 = 1 + storeValue251.totalChildSubtreeNodeCount,
    storeValue253 = storeValue251.totalChildVisibleSubtreeCount;
  if (
    ((storeParam77.subtreeNodeCount = storeValue252),
    storeHelper18(storeParam77, 2))
  ) {
    storeParam77.visibleSubtreeCount = storeValue253;
    return;
  }
  storeParam77.visibleSubtreeCount =
    storeHelper93(storeParam75, storeParam76) == null
      ? storeHelper61(storeParam75, storeParam76, storeParam77)
        ? 1 + storeValue253
        : 1
      : storeValue253;
}
function storeHelper133(storeParam384, storeParam385, storeParam386) {
  let storeValue644 = storeHelper101(storeParam384, storeParam385);
  return storeValue644.length === 0
    ? storeParam386
    : `${storeValue644}${storeParam386}`;
}
function storeHelper134(storeParam425) {
  return storeParam425 != null && !storeHelper18(storeParam425, 4);
}
function storeHelper135(storeParam370, storeParam371) {
  let storeValue630 = storeParam370.snapshot.nodes[storeParam371];
  return !storeHelper134(storeValue630) ||
    !storeHelper16(storeValue630) ||
    storeHelper18(storeValue630, 2)
    ? null
    : storeValue630;
}
function storeHelper136(storeParam301) {
  let storeValue545 = 0;
  for (let [storeValue615, storeValue616] of storeParam301.pathCacheByNodeId)
    storeValue616.version === storeParam301.pathCacheVersion &&
      storeHelper134(storeParam301.snapshot.nodes[storeValue615]) &&
      (storeValue545 += 1);
  return storeValue545;
}
function storeHelper137(storeParam407) {
  return Math.max(0, storeParam407.valueById.length - 1);
}
function storeHelper138(storeParam208) {
  return {
    activeNodeCount: storeParam208.activeNodeCount,
    cachedPathEntryCount: storeHelper136(storeParam208),
    loadInfoEntryCount: storeParam208.directoryLoadInfoById.size,
    segmentCount: storeHelper137(storeParam208.snapshot.segmentTable),
    totalNodeSlotCount: Math.max(0, storeParam208.snapshot.nodes.length - 1),
  };
}
function storeHelper139(
  storeParam30,
  storeParam31,
  storeParam32,
  storeParam33,
) {
  return {
    activeNodeCountAfter: storeParam33.activeNodeCount,
    activeNodeCountBefore: storeParam32.activeNodeCount,
    cachedPathEntryCountAfter: storeParam33.cachedPathEntryCount,
    cachedPathEntryCountBefore: storeParam32.cachedPathEntryCount,
    idsPreserved: storeParam31,
    loadInfoEntryCountAfter: storeParam33.loadInfoEntryCount,
    loadInfoEntryCountBefore: storeParam32.loadInfoEntryCount,
    mode: storeParam30,
    reclaimedCachedPathEntryCount:
      storeParam32.cachedPathEntryCount - storeParam33.cachedPathEntryCount,
    reclaimedLoadInfoEntryCount:
      storeParam32.loadInfoEntryCount - storeParam33.loadInfoEntryCount,
    reclaimedNodeSlotCount:
      storeParam32.totalNodeSlotCount - storeParam33.totalNodeSlotCount,
    reclaimedSegmentCount:
      storeParam32.segmentCount - storeParam33.segmentCount,
    segmentCountAfter: storeParam33.segmentCount,
    segmentCountBefore: storeParam32.segmentCount,
    totalNodeSlotCountAfter: storeParam33.totalNodeSlotCount,
    totalNodeSlotCountBefore: storeParam32.totalNodeSlotCount,
  };
}
function storeHelper140(storeParam234) {
  let storeValue459 = [],
    storeValue460 = [];
  for (let storeValue648 of storeParam234.collapsedDirectoryIds)
    storeHelper135(storeParam234, storeValue648) != null &&
      storeValue459.push(storeHelper101(storeParam234, storeValue648));
  for (let storeValue649 of storeParam234.expandedDirectoryIds)
    storeHelper135(storeParam234, storeValue649) != null &&
      storeValue460.push(storeHelper101(storeParam234, storeValue649));
  return {
    collapsedPaths: storeValue459,
    expandedPaths: storeValue460,
  };
}
function storeHelper141(storeParam159) {
  let storeValue352 = [];
  for (let [
    storeValue384,
    storeValue385,
  ] of storeParam159.directoryLoadInfoById)
    storeHelper135(storeParam159, storeValue384) == null ||
      storeHelper64(storeParam159, storeValue384) === "loaded" ||
      storeValue352.push({
        info: {
          activeAttemptId: null,
          errorMessage: storeValue385.errorMessage,
          nextAttemptId: storeValue385.nextAttemptId,
          state: storeValue385.state,
        },
        path: storeHelper101(storeParam159, storeValue384),
      });
  return storeValue352;
}
function storeHelper142(storeParam166, storeParam167) {
  storeParam166.collapsedDirectoryIds.clear();
  storeParam166.hasCollapsedDirectoryOverrides = false;
  storeParam166.expandedDirectoryIds.clear();
  for (let storeValue632 of storeParam167.expandedPaths) {
    let storeValue655 = storeHelper105(storeParam166, storeValue632);
    storeValue655 != null &&
      storeHelper62(
        storeParam166,
        storeValue655,
        true,
        storeHelper108(storeParam166, storeValue655),
      );
  }
  for (let storeValue631 of storeParam167.collapsedPaths) {
    let storeValue656 = storeHelper105(storeParam166, storeValue631);
    storeValue656 != null &&
      storeHelper62(
        storeParam166,
        storeValue656,
        false,
        storeHelper108(storeParam166, storeValue656),
      );
  }
}
function $t(storeParam162, storeParam163) {
  storeParam162.directoryLoadInfoById.clear();
  for (let storeValue418 of storeParam163) {
    let storeValue436 = storeHelper105(storeParam162, storeValue418.path);
    storeValue436 != null &&
      storeHelper135(storeParam162, storeValue436) != null &&
      storeParam162.directoryLoadInfoById.set(storeValue436, {
        activeAttemptId: null,
        errorMessage: storeValue418.info.errorMessage,
        nextAttemptId: storeValue418.info.nextAttemptId,
        state: storeValue418.info.state,
      });
  }
}
function storeHelper143(storeParam268) {
  storeParam268.pathCacheVersion += 1;
  storeParam268.pathCacheByNodeId.clear();
  storeParam268.pathCacheByNodeId.set(storeParam268.snapshot.rootId, {
    path: "",
    version: storeParam268.pathCacheVersion,
  });
}
function storeHelper144(storeParam219) {
  let storeValue444 = storeParam219.snapshot.segmentTable,
    storeValue445 = _e();
  for (let storeValue546 of storeParam219.snapshot.nodes)
    if (storeHelper134(storeValue546)) {
      if (storeHelper18(storeValue546, 2)) {
        storeValue546.nameId = 0;
        continue;
      }
      storeValue546.nameId = storeHelper41(
        storeValue445,
        storeHelper42(storeValue444, storeValue546.nameId),
      );
    }
  storeParam219.snapshot.segmentTable = storeValue445;
}
function storeHelper145(storeParam93) {
  for (let [storeValue297, storeValue298] of storeParam93.snapshot
    .directories) {
    let storeValue315 = storeParam93.snapshot.nodes[storeValue297];
    if (!storeHelper134(storeValue315) || !storeHelper16(storeValue315)) {
      storeParam93.snapshot.directories.delete(storeValue297);
      continue;
    }
    let storeValue316 = storeValue298.childIds.filter((item) => {
      let storeValue638 = storeParam93.snapshot.nodes[item];
      return (
        storeHelper134(storeValue638) &&
        storeValue638.parentId === storeValue297
      );
    });
    storeValue298.childIds = storeValue316;
    storeValue298.childIdByNameId = new Map(
      storeValue316.map((item) => [
        storeHelper108(storeParam93, item).nameId,
        item,
      ]),
    );
    storeValue298.childPositionById = new Map(
      storeValue316.map((item, index) => [item, index]),
    );
    storeHelper7(storeParam93.snapshot.nodes, storeValue298);
  }
}
function storeHelper146(storeParam258) {
  let storeValue504 = storeParam258.snapshot.nodes.length - 1;
  for (; storeValue504 > storeParam258.snapshot.rootId; ) {
    let storeValue651 = storeParam258.snapshot.nodes[storeValue504];
    if (storeHelper134(storeValue651)) break;
    --storeValue504;
  }
  storeParam258.snapshot.nodes.length = storeValue504 + 1;
}
function storeHelper147(storeParam42) {
  let storeValue189 = storeHelper140(storeParam42),
    storeValue190 = storeHelper141(storeParam42);
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.clearPathCaches",
    () => storeHelper143(storeParam42),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.rebuildSegmentTable",
    () => storeHelper144(storeParam42),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.rebuildDirectoryIndexes",
    () => storeHelper145(storeParam42),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.trimTrailingRemovedNodeSlots",
    () => storeHelper146(storeParam42),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.restoreExpansionOverrides",
    () => storeHelper142(storeParam42, storeValue189),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.restoreDirectoryLoadInfos",
    () => $t(storeParam42, storeValue190),
  );
  storeHelper23(
    storeParam42.instrumentation,
    "store.cleanup.stable.recomputeCounts",
    () => storeHelper103(storeParam42, storeParam42.snapshot.rootId),
  );
}
function on(storeParam27) {
  let storeValue153 = storeHelper140(storeParam27),
    storeValue154 = storeHelper141(storeParam27),
    storeValue155 = storeHelper23(
      storeParam27.instrumentation,
      "store.cleanup.aggressive.listPaths",
      () => storeHelper96(storeParam27),
    ),
    storeValue156 = storeHelper21(
      {
        ...storeParam27.snapshot.options,
      },
      storeParam27.instrumentation,
    ),
    storeValue157 = storeHelper23(
      storeParam27.instrumentation,
      "store.cleanup.aggressive.rebuildSnapshot",
      () => {
        let storeValue645 = new storeValue11(storeValue156);
        return (
          storeValue645.appendPaths(storeValue155),
          storeValue645.finish()
        );
      },
    );
  storeParam27.snapshot = storeValue157;
  storeParam27.activeNodeCount = storeValue157.nodes.length - 1;
  storeParam27.pathCacheByNodeId = new Map([
    [
      storeValue157.rootId,
      {
        path: "",
        version: 0,
      },
    ],
  ]);
  storeParam27.pathCacheVersion = 0;
  storeHelper23(
    storeParam27.instrumentation,
    "store.cleanup.aggressive.restoreExpansionOverrides",
    () => storeHelper142(storeParam27, storeValue153),
  );
  storeHelper23(
    storeParam27.instrumentation,
    "store.cleanup.aggressive.restoreDirectoryLoadInfos",
    () => $t(storeParam27, storeValue154),
  );
  storeHelper23(
    storeParam27.instrumentation,
    "store.cleanup.aggressive.recomputeCounts",
    () => storeHelper103(storeParam27, storeParam27.snapshot.rootId),
  );
}
function storeHelper148(storeParam312) {
  for (let storeValue606 of storeParam312.directoryLoadInfoById.values())
    if (
      storeValue606.state === "loading" &&
      storeValue606.activeAttemptId != null
    )
      return true;
  return false;
}
function storeHelper149(storeParam235, storeParam236) {
  let storeValue463 = storeHelper138(storeParam235);
  storeParam236 === "stable"
    ? storeHelper23(storeParam235.instrumentation, "store.cleanup.stable", () =>
        storeHelper147(storeParam235),
      )
    : storeHelper23(
        storeParam235.instrumentation,
        "store.cleanup.aggressive",
        () => on(storeParam235),
      );
  let storeValue464 = storeHelper138(storeParam235);
  return storeHelper139(
    storeParam236,
    storeParam236 === "stable",
    storeValue463,
    storeValue464,
  );
}
function storeHelper150(storeParam280, storeParam281) {
  let storeValue519 = storeParam281 + 2;
  if (storeValue519 <= storeParam280.length) return storeParam280;
  let storeValue520 = storeParam280.length;
  for (; storeValue520 < storeValue519; ) storeValue520 *= 2;
  let storeValue521 = new Int32Array(storeValue520);
  return (
    storeValue521.fill(-1),
    storeValue521.set(storeParam280),
    storeValue521
  );
}
function storeHelper151(storeParam404) {
  return storeHelper108(storeParam404, storeParam404.snapshot.rootId)
    .visibleSubtreeCount;
}
function storeHelper152(
  storeParam324,
  storeParam325,
  storeParam326,
  storeParam327,
) {
  let storeValue567 = storeHelper108(
      storeParam324,
      storeParam325.terminalNodeId,
    ),
    storeValue568 = Math.max(1, storeValue567.visibleSubtreeCount);
  return Math.min(storeParam327 - 1, storeParam326 + storeValue568 - 1);
}
function storeHelper153(
  storeParam247,
  storeParam248,
  storeParam249,
  storeParam250,
) {
  return {
    ancestorPaths: storeParam250,
    index: storeParam248.index,
    posInSet: storeParam248.posInSet,
    row: $(storeParam247, storeParam248.cursor),
    setSize: storeParam248.setSize,
    subtreeEndIndex: storeHelper152(
      storeParam247,
      storeParam248.cursor,
      storeParam248.index,
      storeParam249,
    ),
  };
}
function storeHelper154(
  storeParam171,
  storeParam172,
  storeParam173,
  storeParam174,
  storeParam175,
  storeParam176,
) {
  let storeValue378 = storeHelper107(storeParam171, storeParam172),
    { childIndex, childVisibleIndex, localVisibleIndex } = storeHelper9(
      storeParam171.snapshot.nodes,
      storeValue378,
      storeParam173,
    ),
    storeValue379 = storeValue378.childIds[childIndex];
  if (storeValue379 == null)
    throw Error(`Visible index ${String(storeParam173)} is out of range`);
  return storeHelper155(
    storeParam171,
    storeValue379,
    localVisibleIndex,
    storeParam174 + childVisibleIndex,
    storeParam175 + 1,
    childIndex,
    storeValue378.childIds.length,
    storeParam176,
  );
}
function storeHelper155(
  storeParam43,
  storeParam44,
  storeParam45,
  storeParam46,
  storeParam47,
  storeParam48,
  storeParam49,
  storeParam50,
) {
  if (!storeHelper16(storeHelper108(storeParam43, storeParam44))) {
    if (storeParam45 === 0)
      return {
        ancestors: storeParam50,
        cursor: {
          headNodeId: storeParam44,
          terminalNodeId: storeParam44,
          visibleDepth: storeParam47,
        },
        index: storeParam46,
        posInSet: storeParam48,
        setSize: storeParam49,
      };
    throw Error(
      `Visible index ${String(storeParam45)} is out of range for file`,
    );
  }
  let storeValue191 = storeHelper165(storeParam43, storeParam44, storeParam47);
  if (storeParam45 === 0)
    return {
      ancestors: storeParam50,
      cursor: storeValue191,
      index: storeParam46,
      posInSet: storeParam48,
      setSize: storeParam49,
    };
  let storeValue192 = storeHelper108(
    storeParam43,
    storeValue191.terminalNodeId,
  );
  if (
    !storeHelper16(storeValue192) ||
    !storeHelper61(storeParam43, storeValue191.terminalNodeId, storeValue192)
  )
    throw Error(
      `Visible index ${String(storeParam45)} is out of range for collapsed directory`,
    );
  return storeHelper154(
    storeParam43,
    storeValue191.terminalNodeId,
    storeParam45 - 1,
    storeParam46 + 1,
    storeValue191.visibleDepth,
    [
      ...storeParam50,
      {
        cursor: storeValue191,
        index: storeParam46,
        posInSet: storeParam48,
        setSize: storeParam49,
      },
    ],
  );
}
function storeHelper156(storeParam63, storeParam64) {
  let storeValue230 = storeHelper151(storeParam63);
  if (storeParam64 < 0 || storeParam64 >= storeValue230) return null;
  let storeValue231 = storeHelper154(
      storeParam63,
      storeParam63.snapshot.rootId,
      storeParam64,
      0,
      -1,
      [],
    ),
    storeValue232 = storeValue231.ancestors.map((item) =>
      storeHelper101(storeParam63, item.cursor.terminalNodeId),
    ),
    storeValue233 = null;
  return {
    ancestorPaths: storeValue232,
    get ancestorRows() {
      if (storeValue233 != null) return storeValue233;
      let storeValue469 = [],
        storeValue470 = [];
      for (let storeValue617 of storeValue231.ancestors) {
        let storeValue641 = storeHelper153(
          storeParam63,
          storeValue617,
          storeValue230,
          [...storeValue470],
        );
        storeValue469.push(storeValue641);
        storeValue470.push(storeValue641.row.path);
      }
      return ((storeValue233 = storeValue469), storeValue233);
    },
    index: storeValue231.index,
    posInSet: storeValue231.posInSet,
    row: $(storeParam63, storeValue231.cursor),
    setSize: storeValue231.setSize,
    subtreeEndIndex: storeHelper152(
      storeParam63,
      storeValue231.cursor,
      storeValue231.index,
      storeValue230,
    ),
  };
}
function storeHelper157(storeParam22, storeParam23, storeParam24) {
  let storeValue132 = storeParam22.instrumentation,
    storeValue133 = storeHelper151(storeParam22);
  if (storeValue133 <= 0 || storeParam24 < storeParam23) return [];
  let storeValue134 = Math.max(0, Math.min(storeParam23, storeValue133 - 1)),
    storeValue135 = Math.max(
      storeValue134,
      Math.min(storeParam24, storeValue133 - 1),
    );
  if (storeValue132 == null) {
    if (storeValue134 === 0)
      return storeHelper170(storeParam22, storeValue135 + 1);
    let storeValue495 = [],
      storeValue496 = storeHelper162(storeParam22, storeValue134);
    for (
      let storeValue621 = storeValue134;
      storeValue621 <= storeValue135 && storeValue496 != null;
      storeValue621++
    ) {
      let storeValue657 = $(storeParam22, storeValue496);
      storeValue495.push(storeValue657);
      storeValue496 = storeHelper167(storeParam22, storeValue496);
    }
    return storeValue495;
  }
  let storeValue136 = [],
    storeValue137 = 0,
    storeValue138 = 0,
    storeValue139 = storeHelper23(
      storeValue132,
      "store.getVisibleSlice.selectFirstRow",
      () => storeHelper162(storeParam22, storeValue134),
    );
  for (
    let storeValue422 = storeValue134;
    storeValue422 <= storeValue135 && storeValue139 != null;
    storeValue422++
  ) {
    let storeValue471 = storeHelper23(
      storeValue132,
      "store.getVisibleSlice.materializeRow",
      () => $(storeParam22, storeValue139),
    );
    storeValue136.push(storeValue471);
    storeValue471.isFlattened &&
      (storeValue137++,
      (storeValue138 += storeValue471.flattenedSegments?.length ?? 0));
    storeValue139 = storeHelper23(
      storeValue132,
      "store.getVisibleSlice.advanceCursor",
      () => storeHelper167(storeParam22, storeValue139),
    );
  }
  return (
    storeHelper24(
      storeValue132,
      "workload.visibleRowsRead",
      storeValue136.length,
    ),
    storeHelper24(storeValue132, "workload.flattenedRowsRead", storeValue137),
    storeHelper24(
      storeValue132,
      "workload.flattenedSegmentsRead",
      storeValue138,
    ),
    storeValue136
  );
}
function _n(storeParam310, storeParam311 = storeHelper151(storeParam310)) {
  let storeValue558 = storeParam310.instrumentation;
  return storeValue558 == null
    ? storeHelper169(storeParam310, storeParam311)
    : storeHelper23(storeValue558, "store.getVisibleTreeProjection", () =>
        storeHelper169(storeParam310, storeParam311),
      );
}
function storeHelper158(storeParam442) {
  return storeHelper168(_n(storeParam442));
}
function storeHelper159(storeParam79, storeParam80) {
  let storeValue257 = storeHelper105(storeParam79, storeParam80);
  if (
    storeValue257 == null ||
    storeValue257 === storeParam79.snapshot.rootId ||
    (storeHelper16(storeHelper108(storeParam79, storeValue257)) &&
      storeHelper94(storeParam79, storeValue257) !== storeValue257)
  )
    return null;
  let storeValue258 = 0,
    storeValue259 = storeValue257,
    { nodes, rootId } = storeParam79.snapshot;
  for (; storeValue259 !== rootId; ) {
    let storeValue356 = storeHelper108(storeParam79, storeValue259).parentId,
      storeValue357 = storeHelper107(storeParam79, storeValue356),
      storeValue358 = storeHelper4(storeValue357).get(storeValue259);
    if (storeValue358 == null)
      throw Error(
        `Child ${String(storeValue259)} was not found in its parent index`,
      );
    if (
      ((storeValue258 += storeHelper10(nodes, storeValue357, storeValue358)),
      storeValue356 !== rootId)
    ) {
      let storeValue586 = storeHelper108(storeParam79, storeValue356),
        storeValue587 = storeHelper93(storeParam79, storeValue356);
      if (
        !storeHelper61(storeParam79, storeValue356, storeValue586) &&
        storeValue587 !== storeValue259
      )
        return null;
      storeHelper94(storeParam79, storeValue356) === storeValue356 &&
        (storeValue258 += 1);
    }
    storeValue259 = storeValue356;
  }
  return storeValue258;
}
function storeHelper160(storeParam143, storeParam144) {
  let storeValue335 = storeHelper105(storeParam143, storeParam144);
  if (storeValue335 == null)
    throw Error(`Path does not exist: "${storeParam144}"`);
  let storeValue336 = storeHelper108(storeParam143, storeValue335);
  if (!storeHelper16(storeValue336))
    throw Error(`Path is not a directory: "${storeParam144}"`);
  return storeHelper61(storeParam143, storeValue335, storeValue336)
    ? null
    : (storeHelper62(storeParam143, storeValue335, true, storeValue336),
      storeHelper102(storeParam143, storeValue335),
      storeHelper75({
        affectedAncestorIds: storeHelper104(storeParam143, storeValue335),
        affectedNodeIds: [storeValue335],
        path: storeParam144,
        projectionChanged: true,
      }));
}
function storeHelper161(storeParam145, storeParam146) {
  let storeValue337 = storeHelper105(storeParam145, storeParam146);
  if (storeValue337 == null)
    throw Error(`Path does not exist: "${storeParam146}"`);
  let storeValue338 = storeHelper108(storeParam145, storeValue337);
  if (!storeHelper16(storeValue338))
    throw Error(`Path is not a directory: "${storeParam146}"`);
  return storeHelper61(storeParam145, storeValue337, storeValue338)
    ? (storeHelper62(storeParam145, storeValue337, false, storeValue338),
      storeHelper102(storeParam145, storeValue337),
      storeHelper76({
        affectedAncestorIds: storeHelper104(storeParam145, storeValue337),
        affectedNodeIds: [storeValue337],
        path: storeParam146,
        projectionChanged: true,
      }))
    : null;
}
function storeHelper162(storeParam372, storeParam373) {
  return storeParam373 < 0 || storeParam373 >= storeHelper151(storeParam372)
    ? null
    : storeHelper163(
        storeParam372,
        storeParam372.snapshot.rootId,
        storeParam373,
        -1,
      );
}
function storeHelper163(
  storeParam133,
  storeParam134,
  storeParam135,
  storeParam136,
) {
  let storeValue322 = storeHelper107(storeParam133, storeParam134),
    storeValue323 = storeParam133.instrumentation,
    { childIndex, localVisibleIndex } =
      storeValue323 == null
        ? storeHelper9(
            storeParam133.snapshot.nodes,
            storeValue322,
            storeParam135,
          )
        : storeHelper23(
            storeValue323,
            "store.getVisibleSlice.selectChildIndex",
            () =>
              storeHelper9(
                storeParam133.snapshot.nodes,
                storeValue322,
                storeParam135,
              ),
          ),
    storeValue324 = storeValue322.childIds[childIndex];
  if (storeValue324 != null)
    return storeHelper164(
      storeParam133,
      storeValue324,
      localVisibleIndex,
      storeParam136 + 1,
    );
  throw Error(`Visible index ${String(storeParam135)} is out of range`);
}
function storeHelper164(
  storeParam100,
  storeParam101,
  storeParam102,
  storeParam103,
) {
  if (!storeHelper16(storeHelper108(storeParam100, storeParam101))) {
    if (storeParam102 === 0)
      return {
        headNodeId: storeParam101,
        terminalNodeId: storeParam101,
        visibleDepth: storeParam103,
      };
    throw Error(
      `Visible index ${String(storeParam102)} is out of range for file`,
    );
  }
  let storeValue294 = storeHelper165(
    storeParam100,
    storeParam101,
    storeParam103,
  );
  if (storeParam102 === 0) return storeValue294;
  let storeValue295 = storeHelper108(
    storeParam100,
    storeValue294.terminalNodeId,
  );
  if (
    !storeHelper16(storeValue295) ||
    !storeHelper61(storeParam100, storeValue294.terminalNodeId, storeValue295)
  )
    throw Error(
      `Visible index ${String(storeParam102)} is out of range for collapsed directory`,
    );
  return storeHelper163(
    storeParam100,
    storeValue294.terminalNodeId,
    storeParam102 - 1,
    storeValue294.visibleDepth,
  );
}
function storeHelper165(storeParam121, storeParam122, storeParam123) {
  return storeHelper16(storeHelper108(storeParam121, storeParam122))
    ? storeParam121.instrumentation == null
      ? {
          headNodeId: storeParam122,
          terminalNodeId: storeHelper94(storeParam121, storeParam122),
          visibleDepth: storeParam123,
        }
      : {
          headNodeId: storeParam122,
          terminalNodeId: storeHelper23(
            storeParam121.instrumentation,
            "store.getVisibleSlice.flatten.resolveTerminalDirectory",
            () => storeHelper94(storeParam121, storeParam122),
          ),
          visibleDepth: storeParam123,
        }
    : {
        headNodeId: storeParam122,
        terminalNodeId: storeParam122,
        visibleDepth: storeParam123,
      };
}
function storeHelper166(storeParam328, storeParam329) {
  let storeValue569 = storeHelper108(storeParam328, storeParam329);
  if (!storeHelper16(storeValue569)) return true;
  let storeValue570 = storeValue569.parentId;
  return storeValue570 === storeParam328.snapshot.rootId
    ? true
    : storeHelper93(storeParam328, storeValue570) !== storeParam329;
}
function storeHelper167(storeParam58, storeParam59) {
  let storeValue217 = storeHelper108(storeParam58, storeParam59.terminalNodeId);
  if (storeHelper16(storeValue217)) {
    let storeValue501 = storeHelper107(
      storeParam58,
      storeParam59.terminalNodeId,
    );
    if (
      storeHelper61(storeParam58, storeParam59.terminalNodeId, storeValue217) &&
      storeValue501.childIds.length > 0
    ) {
      let storeValue625 = storeValue501.childIds[0];
      return storeValue625 == null
        ? null
        : storeHelper164(
            storeParam58,
            storeValue625,
            0,
            storeParam59.visibleDepth + 1,
          );
    }
  }
  let storeValue218 = storeParam59.terminalNodeId,
    storeValue219 = storeParam59.visibleDepth;
  for (;;) {
    let storeValue359 = storeHelper108(storeParam58, storeValue218);
    if (storeValue218 === storeParam58.snapshot.rootId) return null;
    let storeValue360 = storeValue359.parentId,
      storeValue361 = storeHelper107(storeParam58, storeValue360),
      storeValue362 = storeHelper4(storeValue361).get(storeValue218) ?? -1;
    if (storeValue362 < 0)
      throw Error(
        `Child ${String(storeValue218)} was not found in its parent index`,
      );
    let storeValue363 = storeValue361.childIds[storeValue362 + 1] ?? null;
    if (storeValue363 != null)
      return storeHelper164(storeParam58, storeValue363, 0, storeValue219);
    storeHelper166(storeParam58, storeValue218) && storeValue219--;
    storeValue218 = storeValue360;
  }
}
function storeHelper168(storeParam106) {
  let storeValue299 = storeParam106.paths.length,
    storeValue300 = Array(storeValue299);
  for (
    let storeValue425 = 0;
    storeValue425 < storeValue299;
    storeValue425 += 1
  ) {
    let storeValue462 = storeParam106.getParentIndex(storeValue425);
    storeValue300[storeValue425] = {
      index: storeValue425,
      parentPath:
        storeValue462 >= 0
          ? (storeParam106.paths[storeValue462] ?? null)
          : null,
      path: storeParam106.paths[storeValue425] ?? "",
      posInSet: storeParam106.posInSetByIndex[storeValue425] ?? 0,
      setSize: storeParam106.setSizeByIndex[storeValue425] ?? 0,
    };
  }
  return {
    getParentIndex: storeParam106.getParentIndex,
    rows: storeValue300,
    get visibleIndexByPath() {
      return storeParam106.visibleIndexByPath;
    },
  };
}
function storeHelper169(storeParam8, storeParam9) {
  let storeValue77 = Array(storeParam9),
    storeValue78 = new Int32Array(storeParam9),
    storeValue79 = new Int32Array(storeParam9),
    storeValue80 = new Int32Array(storeParam9),
    storeValue81 = new Int32Array(64);
  storeValue81.fill(-1);
  let storeValue82 = 0,
    { nodes, directories, segmentTable } = storeParam8.snapshot,
    storeValue83 = [[directories.get(storeParam8.snapshot.rootId), 0, -1, ""]],
    storeValue84 = storeParam8.snapshot.options.flattenEmptyDirectories,
    storeValue85 = storeParam8.pathCacheByNodeId,
    storeValue86 = storeParam8.pathCacheVersion,
    storeValue87 = segmentTable.valueById;
  for (; storeValue83.length > 0 && storeValue82 < storeParam9; ) {
    let storeValue201 = storeValue83[storeValue83.length - 1],
      storeValue202 = storeValue201[0];
    if (storeValue201[1] >= storeValue202.childIds.length) {
      storeValue83.pop();
      continue;
    }
    let storeValue203 = storeValue201[1],
      storeValue204 = storeValue202.childIds[storeValue201[1]++],
      storeValue205 = nodes[storeValue204],
      storeValue206 = storeValue201[2] + 1,
      storeValue207 = storeValue201[3];
    storeValue81 = storeHelper150(storeValue81, storeValue206);
    let storeValue208,
      storeValue209 = storeValue204;
    if (storeHelper16(storeValue205)) {
      storeValue209 = storeValue84
        ? storeHelper94(storeParam8, storeValue204)
        : storeValue204;
      storeValue208 =
        storeValue209 === storeValue204
          ? `${storeValue207}${storeValue87[storeValue205.nameId]}/`
          : storeHelper101(storeParam8, storeValue209);
    } else {
      let storeValue624 = storeValue85.get(storeValue204);
      storeValue208 =
        storeValue624 != null && storeValue624.version === storeValue86
          ? storeValue624.path
          : `${storeValue207}${storeValue87[storeValue205.nameId]}`;
    }
    storeValue78[storeValue82] = storeValue81[storeValue206];
    storeValue77[storeValue82] = storeValue208;
    storeValue79[storeValue82] = storeValue203;
    storeValue80[storeValue82] = storeValue202.childIds.length;
    storeValue81[storeValue206 + 1] = storeValue82;
    storeValue82 += 1;
    let storeValue210 = nodes[storeValue209];
    storeValue210 != null &&
      storeHelper16(storeValue210) &&
      storeHelper61(storeParam8, storeValue209, storeValue210) &&
      storeValue83.push([
        directories.get(storeValue209),
        0,
        storeValue206,
        storeValue208,
      ]);
  }
  storeValue82 < storeParam9 && (storeValue77.length = storeValue82);
  let storeValue88 = storeValue78.subarray(0, storeValue82),
    storeValue89 = storeValue79.subarray(0, storeValue82),
    storeValue90 = storeValue80.subarray(0, storeValue82),
    storeValue91 = null;
  return {
    getParentIndex(storeParam397) {
      return storeParam397 < 0 || storeParam397 >= storeValue82
        ? -1
        : (storeValue88[storeParam397] ?? -1);
    },
    paths: storeValue77,
    posInSetByIndex: storeValue89,
    setSizeByIndex: storeValue90,
    get visibleIndexByPath() {
      if (storeValue91 == null) {
        storeValue91 = new Map();
        for (
          let storeValue664 = 0;
          storeValue664 < storeValue82;
          storeValue664 += 1
        )
          storeValue91.set(storeValue77[storeValue664] ?? "", storeValue664);
      }
      return storeValue91;
    },
  };
}
function storeHelper170(storeParam19, storeParam20) {
  let storeValue125 = Array(storeParam20),
    storeValue126 = 0,
    { nodes, directories, segmentTable } = storeParam19.snapshot,
    storeValue127 = [[directories.get(storeParam19.snapshot.rootId), 0, -1]],
    storeValue128 = segmentTable.valueById,
    storeValue129 = storeParam19.snapshot.options.flattenEmptyDirectories,
    storeValue130 = storeParam19.pathCacheByNodeId,
    storeValue131 = storeParam19.pathCacheVersion;
  for (; storeValue127.length > 0 && storeValue126 < storeParam20; ) {
    let storeValue166 = storeValue127[storeValue127.length - 1],
      storeValue167 = storeValue166[0];
    if (storeValue166[1] >= storeValue167.childIds.length) {
      storeValue127.pop();
      continue;
    }
    let storeValue168 = storeValue167.childIds[storeValue166[1]++],
      storeValue169 = nodes[storeValue168],
      storeValue170 = storeValue166[2] + 1;
    if (!storeHelper16(storeValue169)) {
      let storeValue345 = storeValue130.get(storeValue168);
      storeValue125[storeValue126++] = {
        depth: storeValue170,
        flattenedSegments: undefined,
        hasChildren: false,
        id: storeValue168,
        isExpanded: false,
        isFlattened: false,
        isLoading: false,
        kind: "file",
        loadState: undefined,
        name: storeValue128[storeValue169.nameId],
        path:
          storeValue345 != null && storeValue345.version === storeValue131
            ? storeValue345.path
            : storeHelper101(storeParam19, storeValue168),
      };
      continue;
    }
    let storeValue171 = storeValue129
        ? storeHelper94(storeParam19, storeValue168)
        : storeValue168,
      storeValue172 = {
        headNodeId: storeValue168,
        terminalNodeId: storeValue171,
        visibleDepth: storeValue170,
      };
    storeValue125[storeValue126++] = $(storeParam19, storeValue172);
    let storeValue173 = nodes[storeValue171];
    storeValue173 != null &&
      storeHelper16(storeValue173) &&
      storeHelper61(storeParam19, storeValue171, storeValue173) &&
      storeValue127.push([directories.get(storeValue171), 0, storeValue170]);
  }
  return (
    storeValue126 < storeParam20 && (storeValue125.length = storeValue126),
    storeValue125
  );
}
function $(storeParam13, storeParam14) {
  let storeValue104 = storeHelper108(storeParam13, storeParam14.terminalNodeId),
    storeValue105 = storeHelper16(storeValue104)
      ? storeHelper171(storeParam13, storeParam14)
      : null,
    storeValue106 = storeHelper101(storeParam13, storeParam14.terminalNodeId),
    storeValue107 = storeHelper42(
      storeParam13.snapshot.segmentTable,
      storeValue104.nameId,
    ),
    storeValue108 =
      storeHelper16(storeValue104) &&
      storeHelper107(storeParam13, storeParam14.terminalNodeId).childIds
        .length > 0,
    storeValue109 = storeParam14.headNodeId !== storeParam14.terminalNodeId,
    storeValue110 = storeParam13.instrumentation,
    storeValue111 = storeValue109
      ? storeValue110 == null
        ? storeHelper95(storeParam13, storeParam14.headNodeId).map((item) => {
            let storeValue461 = storeHelper108(storeParam13, item);
            return {
              isTerminal: item === storeParam14.terminalNodeId,
              name: storeHelper42(
                storeParam13.snapshot.segmentTable,
                storeValue461.nameId,
              ),
              nodeId: item,
              path: storeHelper101(storeParam13, item),
            };
          })
        : storeHelper23(
            storeValue110,
            "store.getVisibleSlice.flatten.collectSegments",
            () =>
              storeHelper95(storeParam13, storeParam14.headNodeId).map(
                (item) => {
                  let storeValue443 = storeHelper108(storeParam13, item);
                  return {
                    isTerminal: item === storeParam14.terminalNodeId,
                    name: storeHelper42(
                      storeParam13.snapshot.segmentTable,
                      storeValue443.nameId,
                    ),
                    nodeId: item,
                    path: storeHelper101(storeParam13, item),
                  };
                },
              ),
          )
      : undefined;
  return {
    depth: storeParam14.visibleDepth,
    flattenedSegments: storeValue111,
    hasChildren: storeValue108,
    id: storeParam14.terminalNodeId,
    isExpanded:
      storeHelper16(storeValue104) &&
      storeHelper61(storeParam13, storeParam14.terminalNodeId, storeValue104),
    isFlattened: storeValue109,
    isLoading: storeValue105 === "loading",
    kind: storeHelper16(storeValue104) ? "directory" : "file",
    loadState:
      storeValue105 == null || storeValue105 === "loaded"
        ? undefined
        : storeValue105,
    name: storeValue107,
    path: storeValue106,
  };
}
function storeHelper171(storeParam151, storeParam152) {
  if (storeParam152.headNodeId === storeParam152.terminalNodeId)
    return storeHelper64(storeParam151, storeParam152.terminalNodeId);
  let storeValue342 = storeHelper95(storeParam151, storeParam152.headNodeId),
    storeValue343 = false,
    storeValue344 = false;
  for (let storeValue517 of storeValue342) {
    let storeValue540 = storeHelper64(storeParam151, storeValue517);
    if (storeValue540 === "loading") return "loading";
    if (storeValue540 === "error") {
      storeValue344 = true;
      continue;
    }
    storeValue540 === "unloaded" && (storeValue343 = true);
  }
  return storeValue344 ? "error" : storeValue343 ? "unloaded" : "loaded";
}
function storeHelper172(storeParam10) {
  let { directories, nodes, options, rootId, presortedDirectoryNodeIds } =
      storeParam10.snapshot,
    storeValue92 = options.flattenEmptyDirectories === true,
    storeValue93 = (storeParam40) => {
      let storeValue175 = nodes[storeParam40];
      if (storeValue175 == null || !storeHelper16(storeValue175)) return;
      let storeValue176 = directories.get(storeParam40);
      if (storeValue176 == null)
        throw Error(
          `Unknown directory child index for node ${String(storeParam40)}`,
        );
      let storeValue177 = storeValue176.childIds,
        storeValue178 = storeValue177.length,
        storeValue179 = 0,
        storeValue180 = 0;
      for (
        let storeValue518 = 0;
        storeValue518 < storeValue178;
        storeValue518++
      ) {
        let storeValue559 = storeValue177[storeValue518];
        if (storeValue559 == null) continue;
        let storeValue560 = nodes[storeValue559];
        storeValue179 += storeValue560.subtreeNodeCount;
        storeValue180 += storeValue560.visibleSubtreeCount;
      }
      storeValue176.totalChildSubtreeNodeCount = storeValue179;
      storeValue176.totalChildVisibleSubtreeCount = storeValue180;
      storeValue178 >= 128 && storeHelper11(nodes, storeValue176);
      storeValue175.subtreeNodeCount = 1 + storeValue179;
      let storeValue181;
      if (storeValue92 && storeValue178 === 1) {
        let storeValue647 = nodes[storeValue177[0]];
        storeValue181 =
          storeValue647 != null && storeHelper16(storeValue647)
            ? storeValue180
            : 1 + storeValue180;
      } else storeValue181 = 1 + storeValue180;
      storeValue175.visibleSubtreeCount = storeValue181;
    };
  if (presortedDirectoryNodeIds != null)
    for (
      let storeValue665 = presortedDirectoryNodeIds.length - 1;
      storeValue665 >= 0;
      storeValue665--
    )
      storeValue93(presortedDirectoryNodeIds[storeValue665]);
  else
    for (
      let storeValue668 = nodes.length - 1;
      storeValue668 >= 1;
      storeValue668--
    )
      storeValue93(storeValue668);
  let storeValue94 = nodes[rootId],
    storeValue95 = directories.get(rootId);
  if (storeValue94 == null || storeValue95 == null) return;
  let storeValue96 = storeValue95.childIds,
    storeValue97 = 0,
    storeValue98 = 0;
  for (
    let storeValue534 = 0;
    storeValue534 < storeValue96.length;
    storeValue534++
  ) {
    let storeValue578 = storeValue96[storeValue534];
    if (storeValue578 == null) continue;
    let storeValue579 = nodes[storeValue578];
    storeValue97 += storeValue579.subtreeNodeCount;
    storeValue98 += storeValue579.visibleSubtreeCount;
  }
  storeValue95.totalChildSubtreeNodeCount = storeValue97;
  storeValue95.totalChildVisibleSubtreeCount = storeValue98;
  storeHelper11(nodes, storeValue95);
  storeValue94.subtreeNodeCount = 1 + storeValue97;
  storeValue94.visibleSubtreeCount = storeValue98;
}
function storeHelper173(storeParam318) {
  return (
    storeParam318.initialExpansion === "open" &&
    (storeParam318.initialExpandedPaths == null ||
      storeParam318.initialExpandedPaths.length === 0)
  );
}
export const Store = class StoreClass1 {
  #e;
  constructor(storeParam7 = {}) {
    let storeValue72 = storeHelper22(storeParam7),
      storeValue73 = storeHelper23(
        storeValue72,
        "store.builder.create",
        () => new storeValue11(storeParam7),
      );
    if (storeParam7.preparedInput != null) {
      let storeValue529 = storeHelper54(storeParam7.preparedInput);
      storeValue529 == null
        ? storeValue73.appendPreparedPaths(
            storeHelper53(storeParam7.preparedInput),
            false,
          )
        : storeValue73.appendPresortedPaths(
            storeValue529,
            storeHelper55(storeParam7.preparedInput),
          );
    } else {
      let storeValue503 = storeParam7.paths ?? [];
      storeParam7.presorted === true
        ? storeValue73.appendPaths(storeValue503)
        : storeValue73.appendPreparedPaths(
            storeHelper23(storeValue72, "store.preparePathEntries", () =>
              storeHelper56(storeValue503, storeParam7),
            ),
          );
    }
    let storeValue74 = storeHelper23(storeValue72, "store.builder.finish", () =>
        storeValue73.finish({
          skipSubtreeCountPass: true,
        }),
      ),
      storeValue75 = storeHelper23(
        storeValue72,
        "store.state.detectAllDirectoriesExpanded",
        () =>
          (storeParam7.initialExpansion ?? "closed") === "closed" &&
          storeValue73.didMatchAllInitialExpandedPaths(),
      );
    this.#e = storeHelper23(storeValue72, "store.state.create", () =>
      storeHelper57(
        storeValue74,
        storeValue75 ? "open" : (storeParam7.initialExpansion ?? "closed"),
        storeValue72,
      ),
    );
    storeValue75 && (this.#e.collapseNewDirectoriesByDefault = true);
    let storeValue76 = storeValue75
      ? this.#e.snapshot.directories.size - 1
      : storeHelper23(storeValue72, "store.state.initializeExpandedPaths", () =>
          this.initializeExpandedPaths(storeParam7.initialExpandedPaths),
        );
    storeValue75 ||
    storeHelper173(storeParam7) ||
    ((storeParam7.initialExpansion ?? "closed") === "closed" &&
      storeValue76 === this.#e.snapshot.directories.size - 1) ||
    ((storeParam7.initialExpandedPaths?.length ?? 0) > 0 &&
      storeHelper23(
        storeValue72,
        "store.state.checkAllDirectoriesExpanded",
        () => this.hasAllDirectoriesExpanded(),
      ))
      ? storeHelper23(
          storeValue72,
          "store.state.initializeOpenVisibleCounts",
          () => storeHelper172(this.#e),
        )
      : storeHelper23(storeValue72, "store.state.recomputeCounts", () =>
          storeHelper103(this.#e, this.#e.snapshot.rootId),
        );
  }
  static preparePaths(storeParam417, storeParam418 = {}) {
    return storeHelper50(storeParam417, storeParam418);
  }
  static prepareInput(storeParam419, storeParam420 = {}) {
    return storeHelper51(storeParam419, storeParam420);
  }
  static preparePresortedInput(storeParam422) {
    return storeHelper52(storeParam422);
  }
  list(storeParam380) {
    return storeHelper23(this.#e.instrumentation, "store.list", () =>
      storeHelper96(this.#e, storeParam380),
    );
  }
  add(storeParam319) {
    storeHelper23(this.#e.instrumentation, "store.add", () => {
      let storeValue639 = storeHelper151(this.#e);
      storeHelper84(
        this.#e,
        storeHelper82(
          this.#e,
          storeValue639,
          storeHelper97(this.#e, storeParam319),
        ),
      );
    });
  }
  remove(storeParam299, storeParam300 = {}) {
    storeHelper23(this.#e.instrumentation, "store.remove", () => {
      let storeValue637 = storeHelper151(this.#e);
      storeHelper84(
        this.#e,
        storeHelper82(
          this.#e,
          storeValue637,
          storeHelper98(this.#e, storeParam299, storeParam300),
        ),
      );
    });
  }
  move(storeParam259, storeParam260, storeParam261 = {}) {
    storeHelper23(this.#e.instrumentation, "store.move", () => {
      let storeValue598 = storeHelper151(this.#e),
        storeValue599 = _t(
          this.#e,
          storeParam259,
          storeParam260,
          storeParam261,
        );
      storeValue599 != null &&
        storeHelper84(
          this.#e,
          storeHelper82(this.#e, storeValue598, storeValue599),
        );
    });
  }
  batch(storeParam112) {
    storeHelper83(this.#e, () => {
      if (typeof storeParam112 == "function") {
        storeParam112(this);
        return;
      }
      for (let storeValue371 of storeParam112)
        switch (storeValue371.type) {
          case "add":
            this.add(storeValue371.path);
            break;
          case "remove":
            this.remove(storeValue371.path, {
              recursive: storeValue371.recursive,
            });
            break;
          case "move":
            this.move(storeValue371.from, storeValue371.to, {
              collision: storeValue371.collision,
            });
            break;
        }
    });
  }
  getVisibleCount() {
    return storeHelper23(this.#e.instrumentation, "store.getVisibleCount", () =>
      storeHelper151(this.#e),
    );
  }
  getVisibleSlice(storeParam342, storeParam343) {
    return storeHelper23(this.#e.instrumentation, "store.getVisibleSlice", () =>
      storeHelper157(this.#e, storeParam342, storeParam343),
    );
  }
  getVisibleRowContext(storeParam339) {
    return storeHelper23(
      this.#e.instrumentation,
      "store.getVisibleRowContext",
      () => storeHelper156(this.#e, storeParam339),
    );
  }
  getVisibleTreeProjection() {
    return storeHelper158(this.#e);
  }
  getVisibleTreeProjectionData(storeParam408) {
    return _n(this.#e, storeParam408);
  }
  getVisibleIndex(storeParam357) {
    return storeHelper23(this.#e.instrumentation, "store.getVisibleIndex", () =>
      storeHelper159(this.#e, storeParam357),
    );
  }
  getPathInfo(storeParam191) {
    return storeHelper23(this.#e.instrumentation, "store.getPathInfo", () => {
      let storeValue484 = storeHelper105(this.#e, storeParam191);
      if (storeValue484 == null) return null;
      let storeValue485 = storeHelper108(this.#e, storeValue484);
      return {
        depth: storeHelper14(storeValue485),
        kind: storeHelper16(storeValue485) ? "directory" : "file",
        path: storeHelper101(this.#e, storeValue484),
      };
    });
  }
  isExpanded(storeParam257) {
    return storeHelper23(this.#e.instrumentation, "store.isExpanded", () => {
      let storeValue608 = this.requireDirectoryNodeId(storeParam257),
        storeValue609 = storeHelper108(this.#e, storeValue608);
      return storeHelper61(this.#e, storeValue608, storeValue609);
    });
  }
  expand(storeParam279) {
    storeHelper23(this.#e.instrumentation, "store.expand", () => {
      let storeValue611 = storeHelper151(this.#e),
        storeValue612 = storeHelper160(this.#e, storeParam279);
      storeValue612 != null &&
        storeHelper84(
          this.#e,
          storeHelper82(this.#e, storeValue611, storeValue612),
        );
    });
  }
  collapse(storeParam278) {
    storeHelper23(this.#e.instrumentation, "store.collapse", () => {
      let storeValue613 = storeHelper151(this.#e),
        storeValue614 = storeHelper161(this.#e, storeParam278);
      storeValue614 != null &&
        storeHelper84(
          this.#e,
          storeHelper82(this.#e, storeValue613, storeValue614),
        );
    });
  }
  on(storeParam436, storeParam437) {
    return storeHelper71(this.#e, storeParam436, storeParam437);
  }
  getDirectoryLoadState(storeParam369) {
    let storeValue626 = this.requireDirectoryNodeId(storeParam369);
    return storeHelper64(this.#e, storeValue626);
  }
  markDirectoryUnloaded(storeParam60) {
    storeHelper23(
      this.#e.instrumentation,
      "store.markDirectoryUnloaded",
      () => {
        let storeValue260 = this.requireDirectoryNodeId(storeParam60);
        if (storeHelper107(this.#e, storeValue260).childIds.length > 0)
          throw Error(
            `Cannot mark a directory with known children as unloaded: "${storeParam60}"`,
          );
        let storeValue261 = storeHelper151(this.#e);
        storeHelper66(this.#e, storeValue260);
        storeHelper84(
          this.#e,
          storeHelper82(
            this.#e,
            storeValue261,
            storeHelper77({
              affectedAncestorIds: storeHelper104(this.#e, storeValue260),
              affectedNodeIds: [storeValue260],
              path: storeParam60,
              projectionChanged:
                this.isDirectoryProjectionVisible(storeValue260),
            }),
          ),
        );
      },
    );
  }
  beginChildLoad(storeParam68) {
    return storeHelper23(
      this.#e.instrumentation,
      "store.beginChildLoad",
      () => {
        let storeValue275 = this.requireDirectoryNodeId(storeParam68),
          storeValue276 = storeHelper151(this.#e),
          storeValue277 = storeHelper65(this.#e, storeValue275);
        return (
          storeHelper84(
            this.#e,
            storeHelper82(
              this.#e,
              storeValue276,
              $e({
                affectedAncestorIds: storeHelper104(this.#e, storeValue275),
                affectedNodeIds: [storeValue275],
                attemptId: storeValue277.attemptId,
                path: storeParam68,
                projectionChanged:
                  this.isDirectoryProjectionVisible(storeValue275),
                reused: storeValue277.reused,
              }),
            ),
          ),
          storeValue277
        );
      },
    );
  }
  applyChildPatch(storeParam11, storeParam12) {
    return storeHelper23(
      this.#e.instrumentation,
      "store.applyChildPatch",
      () => {
        let storeValue99 = this.resolveActiveDirectoryNodeId(
          storeParam11.nodeId,
        );
        if (
          storeValue99 == null ||
          storeHelper64(this.#e, storeValue99) !== "loading" ||
          !storeHelper68(this.#e, storeValue99, storeParam11.attemptId)
        )
          return false;
        let storeValue100 = storeHelper101(this.#e, storeValue99);
        this.validateChildPatch(storeValue100, storeParam12);
        let storeValue101 = storeHelper151(this.#e),
          storeValue102 = [];
        for (let storeValue274 of storeParam12.operations) {
          storeHelper174(storeValue100, storeValue274);
          let storeValue278 = storeHelper151(this.#e);
          switch (storeValue274.type) {
            case "add":
              storeValue102.push(
                storeHelper82(
                  this.#e,
                  storeValue278,
                  storeHelper97(this.#e, storeValue274.path),
                ),
              );
              break;
            case "remove":
              storeValue102.push(
                storeHelper82(
                  this.#e,
                  storeValue278,
                  storeHelper98(this.#e, storeValue274.path, {
                    recursive: storeValue274.recursive,
                  }),
                ),
              );
              break;
            case "move": {
              let storeValue549 = _t(
                this.#e,
                storeValue274.from,
                storeValue274.to,
                {
                  collision: storeValue274.collision,
                },
              );
              storeValue549 != null &&
                storeValue102.push(
                  storeHelper82(this.#e, storeValue278, storeValue549),
                );
              break;
            }
          }
        }
        let storeValue103 =
          storeValue102.some((item) => item.projectionChanged) ||
          this.isDirectoryProjectionVisible(storeValue99);
        return (
          storeHelper84(
            this.#e,
            storeHelper82(
              this.#e,
              storeValue101,
              storeHelper78({
                affectedAncestorIds: storeHelper104(this.#e, storeValue99),
                affectedNodeIds: [storeValue99],
                attemptId: storeParam11.attemptId,
                childEvents: storeValue102,
                path: storeHelper101(this.#e, storeValue99),
                projectionChanged: storeValue103,
              }),
            ),
          ),
          true
        );
      },
    );
  }
  completeChildLoad(storeParam54) {
    return storeHelper23(
      this.#e.instrumentation,
      "store.completeChildLoad",
      () => {
        let storeValue254 = this.resolveActiveDirectoryNodeId(
          storeParam54.nodeId,
        );
        if (storeValue254 == null) return false;
        let storeValue255 = storeHelper151(this.#e),
          storeValue256 = storeHelper67(
            this.#e,
            storeValue254,
            storeParam54.attemptId,
          );
        return (
          storeHelper84(
            this.#e,
            storeHelper82(
              this.#e,
              storeValue255,
              storeHelper79({
                affectedAncestorIds: storeHelper104(this.#e, storeValue254),
                affectedNodeIds: [storeValue254],
                attemptId: storeParam54.attemptId,
                path: storeHelper101(this.#e, storeValue254),
                projectionChanged:
                  this.isDirectoryProjectionVisible(storeValue254),
                stale: !storeValue256,
              }),
            ),
          ),
          storeValue256
        );
      },
    );
  }
  failChildLoad(storeParam51, storeParam52) {
    return storeHelper23(this.#e.instrumentation, "store.failChildLoad", () => {
      let storeValue221 = this.resolveActiveDirectoryNodeId(
        storeParam51.nodeId,
      );
      if (storeValue221 == null) return false;
      let storeValue222 = storeHelper151(this.#e),
        storeValue223 = storeHelper69(
          this.#e,
          storeValue221,
          storeParam51.attemptId,
          storeParam52,
        );
      return (
        storeHelper84(
          this.#e,
          storeHelper82(
            this.#e,
            storeValue222,
            storeHelper80({
              affectedAncestorIds: storeHelper104(this.#e, storeValue221),
              affectedNodeIds: [storeValue221],
              attemptId: storeParam51.attemptId,
              errorMessage: storeParam52,
              path: storeHelper101(this.#e, storeValue221),
              projectionChanged:
                this.isDirectoryProjectionVisible(storeValue221),
              stale: !storeValue223,
            }),
          ),
        ),
        storeValue223
      );
    });
  }
  cleanup(storeParam53 = {}) {
    return storeHelper23(this.#e.instrumentation, "store.cleanup", () => {
      if (this.#e.transactionStack.length > 0)
        throw Error("Cleanup cannot run during an open batch or transaction.");
      if (storeHelper148(this.#e))
        throw Error("Cleanup cannot run while directory loads are active.");
      let storeValue220 = storeHelper151(this.#e),
        className = storeHelper149(this.#e, storeParam53.mode ?? "stable");
      return (
        storeHelper84(
          this.#e,
          storeHelper82(
            this.#e,
            storeValue220,
            storeHelper81({
              ...className,
              affectedAncestorIds: [],
              affectedNodeIds: [],
              projectionChanged: className.idsPreserved === false,
            }),
          ),
        ),
        className
      );
    });
  }
  getNodeCount() {
    return this.#e.activeNodeCount;
  }
  initializeExpandedPaths(storeParam3) {
    if (storeParam3 == null || storeParam3.length === 0) return 0;
    let storeValue30 = 0,
      storeValue31 = [],
      storeValue32 = [],
      storeValue33 = 0,
      storeValue34 = null,
      storeValue35 = this.#e.snapshot.segmentTable,
      storeValue36 = storeValue35.valueById,
      storeValue37 = this.#e.snapshot.nodes,
      storeValue38 = new Map();
    for (let storeValue39 of storeParam3) {
      storeValue34 != null &&
        storeValue39 < storeValue34 &&
        ((storeValue34 = null),
        (storeValue33 = 0),
        (storeValue31.length = 0),
        (storeValue32.length = 0));
      let storeValue40 =
        storeValue39.length > 0 &&
        storeValue39.charCodeAt(storeValue39.length - 1) === 47
          ? storeValue39.length - 1
          : storeValue39.length;
      if (storeValue40 === 0) {
        storeValue34 = storeValue39;
        storeValue33 = storeValue40;
        storeValue31.length = 0;
        storeValue32.length = 0;
        continue;
      }
      let storeValue41 = 0,
        storeValue42 = 0;
      if (storeValue34 != null) {
        let storeValue272 = Math.min(storeValue40, storeValue33),
          storeValue273 = true;
        for (
          let storeValue489 = 0;
          storeValue489 < storeValue272;
          storeValue489 += 1
        ) {
          let storeValue516 = storeValue39.charCodeAt(storeValue489);
          if (storeValue516 !== storeValue34.charCodeAt(storeValue489)) {
            storeValue273 = false;
            break;
          }
          storeValue516 === 47 &&
            ((storeValue41 += 1), (storeValue42 = storeValue489 + 1));
        }
        storeValue273 &&
          (storeValue272 === storeValue33 &&
          storeValue40 > storeValue272 &&
          storeValue39.charCodeAt(storeValue272) === 47
            ? ((storeValue41 += 1), (storeValue42 = storeValue272 + 1))
            : storeValue272 === storeValue40 &&
              storeValue33 > storeValue272 &&
              storeValue34.charCodeAt(storeValue272) === 47 &&
              ((storeValue41 += 1), (storeValue42 = storeValue40 + 1)));
        storeValue41 = Math.min(storeValue41, storeValue32.length);
      }
      let storeValue43 =
          storeValue41 === 0
            ? this.#e.snapshot.rootId
            : (storeValue32[storeValue41 - 1] ?? this.#e.snapshot.rootId),
        storeValue44 = storeValue41,
        storeValue45 = true,
        storeValue46 = storeValue42;
      for (; storeValue46 <= storeValue40; ) {
        let storeValue140 = storeValue39.indexOf("/", storeValue46),
          storeValue141 =
            storeValue140 === -1 || storeValue140 > storeValue40
              ? storeValue40
              : storeValue140,
          storeValue142 = storeValue39.slice(storeValue46, storeValue141),
          storeValue143 = storeHelper107(this.#e, storeValue43).childIds,
          storeValue144 =
            storeValue44 === storeValue41
              ? (storeValue31[storeValue44] ?? 0)
              : 0,
          storeValue145 = storeValue144,
          storeValue146,
          storeValue147 =
            storeValue38.get(storeValue142) ?? storeHelper27(storeValue142);
        storeValue38.set(storeValue142, storeValue147);
        let storeValue148 = (storeParam180, storeParam181) => {
          for (
            storeValue145 = storeParam180;
            storeValue145 < storeParam181;
            storeValue145 += 1
          ) {
            let storeValue465 = storeValue143[storeValue145],
              storeValue466 = storeValue37[storeValue465],
              storeValue467 = storeValue36[storeValue466.nameId];
            if (storeValue467 === storeValue142)
              return ((storeValue146 = storeValue465), true);
            let storeValue468 = storeHelper29(
              storeHelper36(storeValue35, storeValue466.nameId),
              storeValue147,
            );
            if (
              storeValue468 > 0 ||
              (storeValue468 === 0 && storeValue467 > storeValue142)
            )
              return false;
          }
          return false;
        };
        if (
          (!storeValue148(storeValue144, storeValue143.length) &&
            storeValue144 > 0 &&
            storeValue148(0, storeValue144),
          storeValue146 === undefined)
        ) {
          storeValue45 = false;
          break;
        }
        if (!storeHelper16(storeHelper108(this.#e, storeValue146))) {
          storeValue45 = false;
          break;
        }
        if (
          ((storeValue31[storeValue44] = storeValue145),
          (storeValue32[storeValue44] = storeValue146),
          (storeValue43 = storeValue146),
          (storeValue44 += 1),
          storeValue141 === storeValue40)
        )
          break;
        storeValue46 = storeValue141 + 1;
      }
      if (
        ((storeValue34 = storeValue39),
        (storeValue33 = storeValue40),
        (storeValue31.length = storeValue44),
        (storeValue32.length = storeValue44),
        !storeValue45)
      ) {
        storeValue34 = null;
        storeValue33 = 0;
        storeValue31.length = 0;
        storeValue32.length = 0;
        continue;
      }
      for (
        let storeValue512 = storeValue41;
        storeValue512 < storeValue44;
        storeValue512 += 1
      ) {
        let storeValue555 = storeValue32[storeValue512];
        if (storeValue555 == null) continue;
        let storeValue556 = storeHelper108(this.#e, storeValue555);
        storeHelper61(this.#e, storeValue555, storeValue556) ||
          (storeHelper62(this.#e, storeValue555, true, storeValue556),
          (storeValue30 += 1));
      }
    }
    return storeValue30;
  }
  hasAllDirectoriesExpanded() {
    for (let storeValue526 of this.#e.snapshot.directories.keys()) {
      if (storeValue526 === this.#e.snapshot.rootId) continue;
      let storeValue590 = storeHelper108(this.#e, storeValue526);
      if (!storeHelper61(this.#e, storeValue526, storeValue590)) return false;
    }
    return true;
  }
  requireDirectoryNodeId(storeParam251) {
    let storeValue490 = storeHelper105(this.#e, storeParam251);
    if (storeValue490 == null)
      throw Error(`Path does not exist: "${storeParam251}"`);
    if (!storeHelper16(storeHelper108(this.#e, storeValue490)))
      throw Error(`Path is not a directory: "${storeParam251}"`);
    return storeValue490;
  }
  resolveActiveDirectoryNodeId(storeParam262) {
    try {
      if (!storeHelper16(storeHelper108(this.#e, storeParam262)))
        throw Error(`Node is not a directory: ${String(storeParam262)}`);
      return storeParam262;
    } catch {
      return null;
    }
  }
  isDirectoryProjectionVisible(storeParam170) {
    let storeValue372 = storeParam170;
    for (; storeValue372 !== this.#e.snapshot.rootId; ) {
      let storeValue486 = storeHelper108(this.#e, storeValue372).parentId;
      if (storeValue486 !== this.#e.snapshot.rootId) {
        let storeValue600 = storeHelper108(this.#e, storeValue486),
          storeValue601 = storeHelper93(this.#e, storeValue486);
        if (
          !storeHelper61(this.#e, storeValue486, storeValue600) &&
          storeValue601 !== storeValue372
        )
          return false;
      }
      storeValue372 = storeValue486;
    }
    return true;
  }
  validateChildPatch(storeParam302, storeParam303) {
    new StoreClass1({
      paths: this.list(storeParam302),
      presorted: true,
      sort: this.#e.snapshot.options.sort,
    }).batch(storeParam303.operations);
  }
};
function storeHelper174(storeParam98, storeParam99) {
  switch (storeParam99.type) {
    case "add":
    case "remove":
      if (
        !storeParam99.path.startsWith(storeParam98) ||
        storeParam99.path === storeParam98
      )
        throw Error(
          `Child patch operation must stay within ${storeParam98}: "${storeParam99.path}"`,
        );
      break;
    case "move":
      if (
        !storeParam99.from.startsWith(storeParam98) ||
        !storeParam99.to.startsWith(storeParam98) ||
        storeParam99.from === storeParam98 ||
        storeParam99.to === storeParam98
      )
        throw Error(
          `Child patch move must stay within ${storeParam98}: "${storeParam99.from}" -> "${storeParam99.to}"`,
        );
      break;
  }
}
