// Restored from ref/webview/assets/pie-ChHHloNp.js
// Pie chunk restored from the Codex webview bundle.
import path from "d3-path";
import { mathP } from "./d3-shape-math";
import { array } from "./d3-array-helper";
function pieHelper1(pieParam8, pieParam9) {
  return pieParam9 < pieParam8
    ? -1
    : pieParam9 > pieParam8
      ? 1
      : pieParam9 >= pieParam8
        ? 0
        : NaN;
}
function pieHelper2(pieParam14) {
  return pieParam14;
}
export function pie() {
  var _pie = pieHelper2,
    pieValue1 = pieHelper1,
    pieValue2 = null,
    pieValue3 = path(0),
    pieValue4 = path(mathP),
    pieValue5 = path(0);
  function pieHelper3(pieParam1) {
    var pieValue6,
      pieValue7 = (pieParam1 = array(pieParam1)).length,
      pieValue8,
      pieValue9,
      pieValue10 = 0,
      pieValue11 = Array(pieValue7),
      pieValue12 = Array(pieValue7),
      pieValue13 = +pieValue3.apply(this, arguments),
      pieValue14 = Math.min(
        mathP,
        Math.max(-mathP, pieValue4.apply(this, arguments) - pieValue13),
      ),
      pieValue15,
      pieValue16 = Math.min(
        Math.abs(pieValue14) / pieValue7,
        pieValue5.apply(this, arguments),
      ),
      pieValue17 = pieValue16 * (pieValue14 < 0 ? -1 : 1),
      pieValue18;
    for (pieValue6 = 0; pieValue6 < pieValue7; ++pieValue6)
      (pieValue18 = pieValue12[(pieValue11[pieValue6] = pieValue6)] =
        +_pie(pieParam1[pieValue6], pieValue6, pieParam1)) > 0 &&
        (pieValue10 += pieValue18);
    for (
      pieValue1 == null
        ? pieValue2 != null &&
          pieValue11.sort(function (pieParam10, pieParam11) {
            return pieValue2(pieParam1[pieParam10], pieParam1[pieParam11]);
          })
        : pieValue11.sort(function (pieParam12, pieParam13) {
            return pieValue1(pieValue12[pieParam12], pieValue12[pieParam13]);
          }),
        pieValue6 = 0,
        pieValue9 = pieValue10
          ? (pieValue14 - pieValue7 * pieValue17) / pieValue10
          : 0;
      pieValue6 < pieValue7;
      ++pieValue6, pieValue13 = pieValue15
    ) {
      pieValue8 = pieValue11[pieValue6];
      pieValue18 = pieValue12[pieValue8];
      pieValue15 =
        pieValue13 + (pieValue18 > 0 ? pieValue18 * pieValue9 : 0) + pieValue17;
      pieValue12[pieValue8] = {
        data: pieParam1[pieValue8],
        index: pieValue6,
        value: pieValue18,
        startAngle: pieValue13,
        endAngle: pieValue15,
        padAngle: pieValue16,
      };
    }
    return pieValue12;
  }
  return (
    (pieHelper3.value = function (pieParam2) {
      return arguments.length
        ? ((_pie =
            typeof pieParam2 == "function" ? pieParam2 : path(+pieParam2)),
          pieHelper3)
        : _pie;
    }),
    (pieHelper3.sortValues = function (pieParam6) {
      return arguments.length
        ? ((pieValue1 = pieParam6), (pieValue2 = null), pieHelper3)
        : pieValue1;
    }),
    (pieHelper3.sort = function (pieParam7) {
      return arguments.length
        ? ((pieValue2 = pieParam7), (pieValue1 = null), pieHelper3)
        : pieValue2;
    }),
    (pieHelper3.startAngle = function (pieParam3) {
      return arguments.length
        ? ((pieValue3 =
            typeof pieParam3 == "function" ? pieParam3 : path(+pieParam3)),
          pieHelper3)
        : pieValue3;
    }),
    (pieHelper3.endAngle = function (pieParam4) {
      return arguments.length
        ? ((pieValue4 =
            typeof pieParam4 == "function" ? pieParam4 : path(+pieParam4)),
          pieHelper3)
        : pieValue4;
    }),
    (pieHelper3.padAngle = function (pieParam5) {
      return arguments.length
        ? ((pieValue5 =
            typeof pieParam5 == "function" ? pieParam5 : path(+pieParam5)),
          pieHelper3)
        : pieValue5;
    }),
    pieHelper3
  );
}
