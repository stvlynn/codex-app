// Restored from ref/webview/assets/auto-track-CVxnO46V.js
// AutoTrack chunk restored from the Codex webview bundle.
import { callbackN } from "./p-timeout";
function autoTrackHelper1(autoTrackParam5) {
  var autoTrackValue12 = autoTrackParam5;
  return !!(
    autoTrackValue12.ctrlKey ||
    autoTrackValue12.shiftKey ||
    autoTrackValue12.metaKey ||
    (autoTrackValue12.button && autoTrackValue12.button == 1)
  );
}
function autoTrackHelper2(event, autoTrackParam6) {
  return !!(event.target === "_blank" && autoTrackParam6);
}
export function autoTrackLink(
  _autoTrackLink,
  _autoTrackForm,
  autoTrackParam1,
  autoTrackParam2,
) {
  var autoTrackValue1 = this,
    autoTrackValue2 = [];
  return _autoTrackLink
    ? ((autoTrackValue2 =
        _autoTrackLink instanceof Element
          ? [_autoTrackLink]
          : "toArray" in _autoTrackLink
            ? _autoTrackLink.toArray()
            : _autoTrackLink),
      autoTrackValue2.forEach(function (__autoTrackLink) {
        __autoTrackLink.addEventListener(
          "click",
          function (event) {
            var autoTrackValue4 =
                _autoTrackForm instanceof Function
                  ? _autoTrackForm(__autoTrackLink)
                  : _autoTrackForm,
              autoTrackValue5 =
                autoTrackParam1 instanceof Function
                  ? autoTrackParam1(__autoTrackLink)
                  : autoTrackParam1,
              autoTrackValue6 =
                __autoTrackLink.getAttribute("href") ||
                __autoTrackLink.getAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "href",
                ) ||
                __autoTrackLink.getAttribute("xlink:href") ||
                __autoTrackLink
                  .getElementsByTagName("a")[0]
                  ?.getAttribute("href"),
              autoTrackValue7 = callbackN(
                autoTrackValue1.track(
                  autoTrackValue4,
                  autoTrackValue5,
                  autoTrackParam2 ?? {},
                ),
                autoTrackValue1.settings.timeout ?? 500,
              );
            !autoTrackHelper2(__autoTrackLink, autoTrackValue6) &&
              !autoTrackHelper1(event) &&
              autoTrackValue6 &&
              (event.preventDefault
                ? event.preventDefault()
                : (event.returnValue = false),
              autoTrackValue7
                .catch(console.error)
                .then(function () {
                  window.location.href = autoTrackValue6;
                })
                .catch(console.error));
          },
          false,
        );
      }),
      this)
    : this;
}
export function autoTrackForm(
  autoTrackParam3,
  autoTrackParam4,
  _autoTrackLink,
  _autoTrackForm,
) {
  var autoTrackValue3 = this;
  return autoTrackParam3
    ? (autoTrackParam3 instanceof HTMLFormElement &&
        (autoTrackParam3 = [autoTrackParam3]),
      autoTrackParam3.forEach(function (item) {
        if (!(item instanceof Element))
          throw TypeError("Must pass HTMLElement to trackForm/trackSubmit.");
        var autoTrackValue8 = function (event) {
            event.preventDefault
              ? event.preventDefault()
              : (event.returnValue = false);
            var autoTrackValue10 =
                autoTrackParam4 instanceof Function
                  ? autoTrackParam4(item)
                  : autoTrackParam4,
              autoTrackValue11 =
                _autoTrackLink instanceof Function
                  ? _autoTrackLink(item)
                  : _autoTrackLink;
            callbackN(
              autoTrackValue3.track(
                autoTrackValue10,
                autoTrackValue11,
                _autoTrackForm ?? {},
              ),
              autoTrackValue3.settings.timeout ?? 500,
            )
              .catch(console.error)
              .then(function () {
                item.submit();
              })
              .catch(console.error);
          },
          autoTrackValue9 = window.jQuery || window.Zepto;
        autoTrackValue9
          ? autoTrackValue9(item).submit(autoTrackValue8)
          : item.addEventListener("submit", autoTrackValue8, false);
      }),
      this)
    : this;
}
