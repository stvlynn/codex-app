// Restored from ref/webview/assets/callback-BhdA_NIt.js
// Callback chunk restored from the Codex webview bundle.
function callbackN(_callbackN, callbackParam3) {
  return new Promise(function (_callbackT, callbackParam4) {
    var callbackValue2 = setTimeout(function () {
      callbackParam4(Error("Promise timed out"));
    }, callbackParam3);
    _callbackN
      .then(function (__callbackN) {
        return (clearTimeout(callbackValue2), _callbackT(__callbackN));
      })
      .catch(callbackParam4);
  });
}
function callbackHelper1(_callbackN) {
  return new Promise(function (callbackParam5) {
    return setTimeout(callbackParam5, _callbackN);
  });
}
export function callbackT(_callbackT, callbackParam1, callbackParam2) {
  var callbackValue1 = function () {
    try {
      return Promise.resolve(callbackParam1(_callbackT));
    } catch (_callbackN) {
      return Promise.reject(_callbackN);
    }
  };
  return callbackHelper1(callbackParam2)
    .then(function () {
      return callbackN(callbackValue1(), 1e3);
    })
    .catch(function (_callbackN) {
      _callbackT?.log("warn", "Callback Error", {
        error: _callbackN,
      });
      _callbackT?.stats.increment("callback_error");
    })
    .then(function () {
      return _callbackT;
    });
}
export { callbackN };
