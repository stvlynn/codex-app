// Restored from ref/webview/assets/monotone-DKOUTWfZ.js
// Monotone chunk restored from the Codex webview bundle.
function monotoneHelper1(monotoneParam18) {
  this._context = monotoneParam18;
}
monotoneHelper1.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (monotoneParam2, _monotoneR) {
    switch (
      ((monotoneParam2 = +monotoneParam2),
      (_monotoneR = +_monotoneR),
      this._point)
    ) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(monotoneParam2, _monotoneR)
          : this._context.moveTo(monotoneParam2, _monotoneR);
        break;
      case 1:
        this._point = 2;
      default:
        this._context.lineTo(monotoneParam2, _monotoneR);
        break;
    }
  },
};
export function monotoneR(_monotoneR) {
  return new monotoneHelper1(_monotoneR);
}
function monotoneHelper2(monotoneParam17) {
  return monotoneParam17 < 0 ? -1 : 1;
}
function monotoneHelper3(monotoneParam3, _monotoneR, monotoneParam4) {
  var monotoneValue2 = monotoneParam3._x1 - monotoneParam3._x0,
    monotoneValue3 = _monotoneR - monotoneParam3._x1,
    monotoneValue4 =
      (monotoneParam3._y1 - monotoneParam3._y0) /
      (monotoneValue2 || (monotoneValue3 < 0 && 0)),
    monotoneValue5 =
      (monotoneParam4 - monotoneParam3._y1) /
      (monotoneValue3 || (monotoneValue2 < 0 && 0)),
    monotoneValue6 =
      (monotoneValue4 * monotoneValue3 + monotoneValue5 * monotoneValue2) /
      (monotoneValue2 + monotoneValue3);
  return (
    (monotoneHelper2(monotoneValue4) + monotoneHelper2(monotoneValue5)) *
      Math.min(
        Math.abs(monotoneValue4),
        Math.abs(monotoneValue5),
        0.5 * Math.abs(monotoneValue6),
      ) || 0
  );
}
function monotoneHelper4(monotoneParam7, _monotoneR) {
  var monotoneValue12 = monotoneParam7._x1 - monotoneParam7._x0;
  return monotoneValue12
    ? ((3 * (monotoneParam7._y1 - monotoneParam7._y0)) / monotoneValue12 -
        _monotoneR) /
        2
    : _monotoneR;
}
function monotoneHelper5(monotoneParam5, _monotoneR, monotoneParam6) {
  var monotoneValue7 = monotoneParam5._x0,
    monotoneValue8 = monotoneParam5._y0,
    monotoneValue9 = monotoneParam5._x1,
    monotoneValue10 = monotoneParam5._y1,
    monotoneValue11 = (monotoneValue9 - monotoneValue7) / 3;
  monotoneParam5._context.bezierCurveTo(
    monotoneValue7 + monotoneValue11,
    monotoneValue8 + monotoneValue11 * _monotoneR,
    monotoneValue9 - monotoneValue11,
    monotoneValue10 - monotoneValue11 * monotoneParam6,
    monotoneValue9,
    monotoneValue10,
  );
}
function monotoneHelper6(monotoneParam19) {
  this._context = monotoneParam19;
}
monotoneHelper6.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        monotoneHelper5(this, this._t0, monotoneHelper4(this, this._t0));
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (monotoneParam1, _monotoneR) {
    var monotoneValue1 = NaN;
    if (
      ((monotoneParam1 = +monotoneParam1),
      (_monotoneR = +_monotoneR),
      !(monotoneParam1 === this._x1 && _monotoneR === this._y1))
    ) {
      switch (this._point) {
        case 0:
          this._point = 1;
          this._line
            ? this._context.lineTo(monotoneParam1, _monotoneR)
            : this._context.moveTo(monotoneParam1, _monotoneR);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3;
          monotoneHelper5(
            this,
            monotoneHelper4(
              this,
              (monotoneValue1 = monotoneHelper3(
                this,
                monotoneParam1,
                _monotoneR,
              )),
            ),
            monotoneValue1,
          );
          break;
        default:
          monotoneHelper5(
            this,
            this._t0,
            (monotoneValue1 = monotoneHelper3(
              this,
              monotoneParam1,
              _monotoneR,
            )),
          );
          break;
      }
      this._x0 = this._x1;
      this._x1 = monotoneParam1;
      this._y0 = this._y1;
      this._y1 = _monotoneR;
      this._t0 = monotoneValue1;
    }
  },
};
function monotoneHelper7(monotoneParam16) {
  this._context = new monotoneHelper8(monotoneParam16);
}
(monotoneHelper7.prototype = Object.create(monotoneHelper6.prototype)).point =
  function (monotoneParam13, _monotoneR) {
    monotoneHelper6.prototype.point.call(this, _monotoneR, monotoneParam13);
  };
function monotoneHelper8(monotoneParam20) {
  this._context = monotoneParam20;
}
monotoneHelper8.prototype = {
  moveTo: function (monotoneParam14, _monotoneR) {
    this._context.moveTo(_monotoneR, monotoneParam14);
  },
  closePath: function () {
    this._context.closePath();
  },
  lineTo: function (monotoneParam15, _monotoneR) {
    this._context.lineTo(_monotoneR, monotoneParam15);
  },
  bezierCurveTo: function (
    monotoneParam8,
    _monotoneR,
    monotoneParam9,
    monotoneParam10,
    monotoneParam11,
    monotoneParam12,
  ) {
    this._context.bezierCurveTo(
      _monotoneR,
      monotoneParam8,
      monotoneParam10,
      monotoneParam9,
      monotoneParam12,
      monotoneParam11,
    );
  },
};
export function monotoneT(monotoneParam21) {
  return new monotoneHelper6(monotoneParam21);
}
export function monotoneN(monotoneParam22) {
  return new monotoneHelper7(monotoneParam22);
}
