// Restored from ref/webview/assets/modifiers.esm-BFjb-QXg.js
// ModifiersEsm chunk restored from the Codex webview bundle.
export const modifiersEsmN = (_modifiersEsmN) => {
  let { transform } = _modifiersEsmN;
  return {
    ...transform,
    y: 0,
  };
};
function modifiersEsmHelper1(
  _modifiersEsmN,
  modifiersEsmParam1,
  _modifiersEsmT,
) {
  let _modifiersEsmR = {
    ..._modifiersEsmN,
  };
  return (
    modifiersEsmParam1.top + _modifiersEsmN.y <= _modifiersEsmT.top
      ? (_modifiersEsmR.y = _modifiersEsmT.top - modifiersEsmParam1.top)
      : modifiersEsmParam1.bottom + _modifiersEsmN.y >=
          _modifiersEsmT.top + _modifiersEsmT.height &&
        (_modifiersEsmR.y =
          _modifiersEsmT.top +
          _modifiersEsmT.height -
          modifiersEsmParam1.bottom),
    modifiersEsmParam1.left + _modifiersEsmN.x <= _modifiersEsmT.left
      ? (_modifiersEsmR.x = _modifiersEsmT.left - modifiersEsmParam1.left)
      : modifiersEsmParam1.right + _modifiersEsmN.x >=
          _modifiersEsmT.left + _modifiersEsmT.width &&
        (_modifiersEsmR.x =
          _modifiersEsmT.left +
          _modifiersEsmT.width -
          modifiersEsmParam1.right),
    _modifiersEsmR
  );
}
export const modifiersEsmT = (_modifiersEsmN) => {
  let {
      draggingNodeRect: _modifiersEsmT,
      transform: _modifiersEsmR,
      scrollableAncestorRects,
    } = _modifiersEsmN,
    modifiersEsmValue1 = scrollableAncestorRects[0];
  return !_modifiersEsmT || !modifiersEsmValue1
    ? _modifiersEsmR
    : modifiersEsmHelper1(_modifiersEsmR, _modifiersEsmT, modifiersEsmValue1);
};
export const modifiersEsmR = (_modifiersEsmN) => {
  let { transform } = _modifiersEsmN;
  return {
    ...transform,
    x: 0,
  };
};
