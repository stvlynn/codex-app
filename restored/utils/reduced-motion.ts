// Restored from ref/webview/assets/reduced-motion-GGHfH0hr.js
// ReducedMotion chunk restored from the Codex webview bundle.
var reducedMotionI = typeof window < "u",
  reducedMotionR = {
    current: null,
  },
  reducedMotionN = {
    current: false,
  };
export function reducedMotionT() {
  if (((reducedMotionN.current = true), reducedMotionI))
    if (window.matchMedia) {
      let _reducedMotionI = window.matchMedia("(prefers-reduced-motion)"),
        _reducedMotionN = () =>
          (reducedMotionR.current = _reducedMotionI.matches);
      _reducedMotionI.addEventListener("change", _reducedMotionN);
      _reducedMotionN();
    } else reducedMotionR.current = false;
}
export { reducedMotionI, reducedMotionN, reducedMotionR };
