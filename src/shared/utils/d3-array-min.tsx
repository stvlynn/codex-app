// Restored from ref/webview/assets/min-BVs4UoI0.js
// Min chunk restored from the Codex webview bundle.
export function minN(_minN, _minT) {
  let minValue1;
  if (_minT === undefined)
    for (let __minT of _minN)
      __minT != null &&
        (minValue1 < __minT || (minValue1 === undefined && __minT >= __minT)) &&
        (minValue1 = __minT);
  else {
    let minValue3 = -1;
    for (let minValue5 of _minN)
      (minValue5 = _minT(minValue5, ++minValue3, _minN)) != null &&
        (minValue1 < minValue5 ||
          (minValue1 === undefined && minValue5 >= minValue5)) &&
        (minValue1 = minValue5);
  }
  return minValue1;
}
export function minT(_minN, _minT) {
  let minValue2;
  if (_minT === undefined)
    for (let __minT of _minN)
      __minT != null &&
        (minValue2 > __minT || (minValue2 === undefined && __minT >= __minT)) &&
        (minValue2 = __minT);
  else {
    let minValue4 = -1;
    for (let minValue6 of _minN)
      (minValue6 = _minT(minValue6, ++minValue4, _minN)) != null &&
        (minValue2 > minValue6 ||
          (minValue2 === undefined && minValue6 >= minValue6)) &&
        (minValue2 = minValue6);
  }
  return minValue2;
}
