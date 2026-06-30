// Restored from ref/webview/assets/step-K6tEdR0Q.js
// Step chunk restored from the Codex webview bundle.
var stepValue1 = class {
  constructor(stepParam21, _stepG) {
    this._context = stepParam21;
    this._x = _stepG;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  }
  point(stepParam4, _stepG) {
    switch (((stepParam4 = +stepParam4), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(stepParam4, _stepG)
          : this._context.moveTo(stepParam4, _stepG);
        break;
      case 1:
        this._point = 2;
      default:
        this._x
          ? this._context.bezierCurveTo(
              (this._x0 = (this._x0 + stepParam4) / 2),
              this._y0,
              this._x0,
              _stepG,
              stepParam4,
              _stepG,
            )
          : this._context.bezierCurveTo(
              this._x0,
              (this._y0 = (this._y0 + _stepG) / 2),
              stepParam4,
              this._y0,
              stepParam4,
              _stepG,
            );
        break;
    }
    this._x0 = stepParam4;
    this._y0 = _stepG;
  }
};
export function stepG(_stepG) {
  return new stepValue1(_stepG, true);
}
export function stepUnderscore(_stepG) {
  return new stepValue1(_stepG, false);
}
function stepHelper1() {}
function stepHelper2(stepParam14, _stepG, _stepUnderscore) {
  stepParam14._context.bezierCurveTo(
    (2 * stepParam14._x0 + stepParam14._x1) / 3,
    (2 * stepParam14._y0 + stepParam14._y1) / 3,
    (stepParam14._x0 + 2 * stepParam14._x1) / 3,
    (stepParam14._y0 + 2 * stepParam14._y1) / 3,
    (stepParam14._x0 + 4 * stepParam14._x1 + _stepG) / 6,
    (stepParam14._y0 + 4 * stepParam14._y1 + _stepUnderscore) / 6,
  );
}
function stepHelper3(stepParam38) {
  this._context = stepParam38;
}
stepHelper3.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 3:
        stepHelper2(this, this._x1, this._y1);
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam10, _stepG) {
    switch (((stepParam10 = +stepParam10), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(stepParam10, _stepG)
          : this._context.moveTo(stepParam10, _stepG);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._context.lineTo(
          (5 * this._x0 + this._x1) / 6,
          (5 * this._y0 + this._y1) / 6,
        );
      default:
        stepHelper2(this, stepParam10, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = stepParam10;
    this._y0 = this._y1;
    this._y1 = _stepG;
  },
};
export function stepH(stepParam43) {
  return new stepHelper3(stepParam43);
}
function stepHelper4(stepParam39) {
  this._context = stepParam39;
}
stepHelper4.prototype = {
  areaStart: stepHelper1,
  areaEnd: stepHelper1,
  lineStart: function () {
    this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
        NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        this._context.moveTo(this._x2, this._y2);
        this._context.closePath();
        break;
      case 2:
        this._context.moveTo(
          (this._x2 + 2 * this._x3) / 3,
          (this._y2 + 2 * this._y3) / 3,
        );
        this._context.lineTo(
          (this._x3 + 2 * this._x2) / 3,
          (this._y3 + 2 * this._y2) / 3,
        );
        this._context.closePath();
        break;
      case 3:
        this.point(this._x2, this._y2);
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        break;
    }
  },
  point: function (stepParam6, _stepG) {
    switch (((stepParam6 = +stepParam6), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._x2 = stepParam6;
        this._y2 = _stepG;
        break;
      case 1:
        this._point = 2;
        this._x3 = stepParam6;
        this._y3 = _stepG;
        break;
      case 2:
        this._point = 3;
        this._x4 = stepParam6;
        this._y4 = _stepG;
        this._context.moveTo(
          (this._x0 + 4 * this._x1 + stepParam6) / 6,
          (this._y0 + 4 * this._y1 + _stepG) / 6,
        );
        break;
      default:
        stepHelper2(this, stepParam6, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = stepParam6;
    this._y0 = this._y1;
    this._y1 = _stepG;
  },
};
export function stepM(stepParam44) {
  return new stepHelper4(stepParam44);
}
function stepHelper5(stepParam40) {
  this._context = stepParam40;
}
stepHelper5.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam9, _stepG) {
    switch (((stepParam9 = +stepParam9), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var _stepUnderscore = (this._x0 + 4 * this._x1 + stepParam9) / 6,
          stepValue17 = (this._y0 + 4 * this._y1 + _stepG) / 6;
        this._line
          ? this._context.lineTo(_stepUnderscore, stepValue17)
          : this._context.moveTo(_stepUnderscore, stepValue17);
        break;
      case 3:
        this._point = 4;
      default:
        stepHelper2(this, stepParam9, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = stepParam9;
    this._y0 = this._y1;
    this._y1 = _stepG;
  },
};
export function stepP(stepParam45) {
  return new stepHelper5(stepParam45);
}
function stepHelper6(stepParam20, _stepG) {
  this._basis = new stepHelper3(stepParam20);
  this._beta = _stepG;
}
stepHelper6.prototype = {
  lineStart: function () {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function () {
    var stepValue18 = this._x,
      _stepG = this._y,
      _stepUnderscore = stepValue18.length - 1;
    if (_stepUnderscore > 0)
      for (
        var stepValue19 = stepValue18[0],
          stepValue20 = _stepG[0],
          stepValue21 = stepValue18[_stepUnderscore] - stepValue19,
          _stepH = _stepG[_stepUnderscore] - stepValue20,
          stepValue22 = -1,
          _stepM;
        ++stepValue22 <= _stepUnderscore;
      ) {
        _stepM = stepValue22 / _stepUnderscore;
        this._basis.point(
          this._beta * stepValue18[stepValue22] +
            (1 - this._beta) * (stepValue19 + _stepM * stepValue21),
          this._beta * _stepG[stepValue22] +
            (1 - this._beta) * (stepValue20 + _stepM * _stepH),
        );
      }
    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function (stepParam26, _stepG) {
    this._x.push(+stepParam26);
    this._y.push(+_stepG);
  },
};
export const stepF = (function stepHelper19(_stepG) {
  function _stepUnderscore(stepParam22) {
    return _stepG === 1
      ? new stepHelper3(stepParam22)
      : new stepHelper6(stepParam22, _stepG);
  }
  return (
    (_stepUnderscore.beta = function (__stepG) {
      return stepHelper19(+__stepG);
    }),
    _stepUnderscore
  );
})(0.85);
function stepHelper7(stepParam15, _stepG, _stepUnderscore) {
  stepParam15._context.bezierCurveTo(
    stepParam15._x1 + stepParam15._k * (stepParam15._x2 - stepParam15._x0),
    stepParam15._y1 + stepParam15._k * (stepParam15._y2 - stepParam15._y0),
    stepParam15._x2 + stepParam15._k * (stepParam15._x1 - _stepG),
    stepParam15._y2 + stepParam15._k * (stepParam15._y1 - _stepUnderscore),
    stepParam15._x2,
    stepParam15._y2,
  );
}
function stepHelper8(stepParam17, _stepG) {
  this._context = stepParam17;
  this._k = (1 - _stepG) / 6;
}
stepHelper8.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        stepHelper7(this, this._x1, this._y1);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam13, _stepG) {
    switch (((stepParam13 = +stepParam13), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(stepParam13, _stepG)
          : this._context.moveTo(stepParam13, _stepG);
        break;
      case 1:
        this._point = 2;
        this._x1 = stepParam13;
        this._y1 = _stepG;
        break;
      case 2:
        this._point = 3;
      default:
        stepHelper7(this, stepParam13, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam13;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepD = (function stepHelper23(_stepG) {
  function _stepUnderscore(stepParam32) {
    return new stepHelper8(stepParam32, _stepG);
  }
  return (
    (_stepUnderscore.tension = function (__stepG) {
      return stepHelper23(+__stepG);
    }),
    _stepUnderscore
  );
})(0);
function stepHelper9(stepParam18, _stepG) {
  this._context = stepParam18;
  this._k = (1 - _stepG) / 6;
}
stepHelper9.prototype = {
  areaStart: stepHelper1,
  areaEnd: stepHelper1,
  lineStart: function () {
    this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._x5 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
      this._y5 =
        NaN;
    this._point = 0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      case 2:
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      case 3:
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
    }
  },
  point: function (stepParam11, _stepG) {
    switch (((stepParam11 = +stepParam11), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._x3 = stepParam11;
        this._y3 = _stepG;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo((this._x4 = stepParam11), (this._y4 = _stepG));
        break;
      case 2:
        this._point = 3;
        this._x5 = stepParam11;
        this._y5 = _stepG;
        break;
      default:
        stepHelper7(this, stepParam11, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam11;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepU = (function stepHelper24(_stepG) {
  function _stepUnderscore(stepParam33) {
    return new stepHelper9(stepParam33, _stepG);
  }
  return (
    (_stepUnderscore.tension = function (__stepG) {
      return stepHelper24(+__stepG);
    }),
    _stepUnderscore
  );
})(0);
function stepHelper10(stepParam19, _stepG) {
  this._context = stepParam19;
  this._k = (1 - _stepG) / 6;
}
stepHelper10.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam8, _stepG) {
    switch (((stepParam8 = +stepParam8), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line
          ? this._context.lineTo(this._x2, this._y2)
          : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        stepHelper7(this, stepParam8, _stepG);
        break;
    }
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam8;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepL = (function stepHelper25(_stepG) {
  function _stepUnderscore(stepParam34) {
    return new stepHelper10(stepParam34, _stepG);
  }
  return (
    (_stepUnderscore.tension = function (__stepG) {
      return stepHelper25(+__stepG);
    }),
    _stepUnderscore
  );
})(0);
function stepHelper11(stepParam5, _stepG, _stepUnderscore) {
  var stepValue9 = stepParam5._x1,
    stepValue10 = stepParam5._y1,
    stepValue11 = stepParam5._x2,
    _stepH = stepParam5._y2;
  if (stepParam5._l01_a > 1e-12) {
    var stepValue12 =
        2 * stepParam5._l01_2a +
        3 * stepParam5._l01_a * stepParam5._l12_a +
        stepParam5._l12_2a,
      _stepM = 3 * stepParam5._l01_a * (stepParam5._l01_a + stepParam5._l12_a);
    stepValue9 =
      (stepValue9 * stepValue12 -
        stepParam5._x0 * stepParam5._l12_2a +
        stepParam5._x2 * stepParam5._l01_2a) /
      _stepM;
    stepValue10 =
      (stepValue10 * stepValue12 -
        stepParam5._y0 * stepParam5._l12_2a +
        stepParam5._y2 * stepParam5._l01_2a) /
      _stepM;
  }
  if (stepParam5._l23_a > 1e-12) {
    var stepValue13 =
        2 * stepParam5._l23_2a +
        3 * stepParam5._l23_a * stepParam5._l12_a +
        stepParam5._l12_2a,
      _stepP = 3 * stepParam5._l23_a * (stepParam5._l23_a + stepParam5._l12_a);
    stepValue11 =
      (stepValue11 * stepValue13 +
        stepParam5._x1 * stepParam5._l23_2a -
        _stepG * stepParam5._l12_2a) /
      _stepP;
    _stepH =
      (_stepH * stepValue13 +
        stepParam5._y1 * stepParam5._l23_2a -
        _stepUnderscore * stepParam5._l12_2a) /
      _stepP;
  }
  stepParam5._context.bezierCurveTo(
    stepValue9,
    stepValue10,
    stepValue11,
    _stepH,
    stepParam5._x2,
    stepParam5._y2,
  );
}
function stepHelper12(stepParam23, _stepG) {
  this._context = stepParam23;
  this._alpha = _stepG;
}
stepHelper12.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a =
      this._l12_a =
      this._l23_a =
      this._l01_2a =
      this._l12_2a =
      this._l23_2a =
      this._point =
        0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam3, _stepG) {
    if (((stepParam3 = +stepParam3), (_stepG = +_stepG), this._point)) {
      var _stepUnderscore = this._x2 - stepParam3,
        stepValue4 = this._y2 - _stepG;
      this._l23_a = Math.sqrt(
        (this._l23_2a =
          (_stepUnderscore * _stepUnderscore + stepValue4 * stepValue4) **
          +this._alpha),
      );
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(stepParam3, _stepG)
          : this._context.moveTo(stepParam3, _stepG);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      default:
        stepHelper11(this, stepParam3, _stepG);
        break;
    }
    this._l01_a = this._l12_a;
    this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a;
    this._l12_2a = this._l23_2a;
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam3;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepC = (function stepHelper20(_stepG) {
  function _stepUnderscore(stepParam28) {
    return _stepG
      ? new stepHelper12(stepParam28, _stepG)
      : new stepHelper8(stepParam28, 0);
  }
  return (
    (_stepUnderscore.alpha = function (__stepG) {
      return stepHelper20(+__stepG);
    }),
    _stepUnderscore
  );
})(0.5);
function stepHelper13(stepParam24, _stepG) {
  this._context = stepParam24;
  this._alpha = _stepG;
}
stepHelper13.prototype = {
  areaStart: stepHelper1,
  areaEnd: stepHelper1,
  lineStart: function () {
    this._x0 =
      this._x1 =
      this._x2 =
      this._x3 =
      this._x4 =
      this._x5 =
      this._y0 =
      this._y1 =
      this._y2 =
      this._y3 =
      this._y4 =
      this._y5 =
        NaN;
    this._l01_a =
      this._l12_a =
      this._l23_a =
      this._l01_2a =
      this._l12_2a =
      this._l23_2a =
      this._point =
        0;
  },
  lineEnd: function () {
    switch (this._point) {
      case 1:
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      case 2:
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      case 3:
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
    }
  },
  point: function (stepParam2, _stepG) {
    if (((stepParam2 = +stepParam2), (_stepG = +_stepG), this._point)) {
      var _stepUnderscore = this._x2 - stepParam2,
        stepValue3 = this._y2 - _stepG;
      this._l23_a = Math.sqrt(
        (this._l23_2a =
          (_stepUnderscore * _stepUnderscore + stepValue3 * stepValue3) **
          +this._alpha),
      );
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        this._x3 = stepParam2;
        this._y3 = _stepG;
        break;
      case 1:
        this._point = 2;
        this._context.moveTo((this._x4 = stepParam2), (this._y4 = _stepG));
        break;
      case 2:
        this._point = 3;
        this._x5 = stepParam2;
        this._y5 = _stepG;
        break;
      default:
        stepHelper11(this, stepParam2, _stepG);
        break;
    }
    this._l01_a = this._l12_a;
    this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a;
    this._l12_2a = this._l23_2a;
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam2;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepS = (function stepHelper21(_stepG) {
  function _stepUnderscore(stepParam29) {
    return _stepG
      ? new stepHelper13(stepParam29, _stepG)
      : new stepHelper9(stepParam29, 0);
  }
  return (
    (_stepUnderscore.alpha = function (__stepG) {
      return stepHelper21(+__stepG);
    }),
    _stepUnderscore
  );
})(0.5);
function stepHelper14(stepParam25, _stepG) {
  this._context = stepParam25;
  this._alpha = _stepG;
}
stepHelper14.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a =
      this._l12_a =
      this._l23_a =
      this._l01_2a =
      this._l12_2a =
      this._l23_2a =
      this._point =
        0;
  },
  lineEnd: function () {
    (this._line || (this._line !== 0 && this._point === 3)) &&
      this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function (stepParam1, _stepG) {
    if (((stepParam1 = +stepParam1), (_stepG = +_stepG), this._point)) {
      var _stepUnderscore = this._x2 - stepParam1,
        stepValue2 = this._y2 - _stepG;
      this._l23_a = Math.sqrt(
        (this._l23_2a =
          (_stepUnderscore * _stepUnderscore + stepValue2 * stepValue2) **
          +this._alpha),
      );
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        this._line
          ? this._context.lineTo(this._x2, this._y2)
          : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      default:
        stepHelper11(this, stepParam1, _stepG);
        break;
    }
    this._l01_a = this._l12_a;
    this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a;
    this._l12_2a = this._l23_2a;
    this._x0 = this._x1;
    this._x1 = this._x2;
    this._x2 = stepParam1;
    this._y0 = this._y1;
    this._y1 = this._y2;
    this._y2 = _stepG;
  },
};
export const stepO = (function stepHelper22(_stepG) {
  function _stepUnderscore(stepParam30) {
    return _stepG
      ? new stepHelper14(stepParam30, _stepG)
      : new stepHelper10(stepParam30, 0);
  }
  return (
    (_stepUnderscore.alpha = function (__stepG) {
      return stepHelper22(+__stepG);
    }),
    _stepUnderscore
  );
})(0.5);
function stepHelper15(stepParam41) {
  this._context = stepParam41;
}
stepHelper15.prototype = {
  areaStart: stepHelper1,
  areaEnd: stepHelper1,
  lineStart: function () {
    this._point = 0;
  },
  lineEnd: function () {
    this._point && this._context.closePath();
  },
  point: function (stepParam16, _stepG) {
    stepParam16 = +stepParam16;
    _stepG = +_stepG;
    this._point
      ? this._context.lineTo(stepParam16, _stepG)
      : ((this._point = 1), this._context.moveTo(stepParam16, _stepG));
  },
};
export function stepA(stepParam46) {
  return new stepHelper15(stepParam46);
}
function stepHelper16(stepParam42) {
  this._context = stepParam42;
}
stepHelper16.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = [];
    this._y = [];
  },
  lineEnd: function () {
    var stepValue5 = this._x,
      _stepG = this._y,
      _stepUnderscore = stepValue5.length;
    if (_stepUnderscore)
      if (
        (this._line
          ? this._context.lineTo(stepValue5[0], _stepG[0])
          : this._context.moveTo(stepValue5[0], _stepG[0]),
        _stepUnderscore === 2)
      )
        this._context.lineTo(stepValue5[1], _stepG[1]);
      else
        for (
          var stepValue6 = stepHelper17(stepValue5),
            stepValue7 = stepHelper17(_stepG),
            stepValue8 = 0,
            _stepH = 1;
          _stepH < _stepUnderscore;
          ++stepValue8, ++_stepH
        )
          this._context.bezierCurveTo(
            stepValue6[0][stepValue8],
            stepValue7[0][stepValue8],
            stepValue6[1][stepValue8],
            stepValue7[1][stepValue8],
            stepValue5[_stepH],
            _stepG[_stepH],
          );
    (this._line || (this._line !== 0 && _stepUnderscore === 1)) &&
      this._context.closePath();
    this._line = 1 - this._line;
    this._x = this._y = null;
  },
  point: function (stepParam27, _stepG) {
    this._x.push(+stepParam27);
    this._y.push(+_stepG);
  },
};
function stepHelper17(stepParam7) {
  var _stepG,
    _stepUnderscore = stepParam7.length - 1,
    stepValue14,
    stepValue15 = Array(_stepUnderscore),
    stepValue16 = Array(_stepUnderscore),
    _stepH = Array(_stepUnderscore);
  for (
    stepValue15[0] = 0,
      stepValue16[0] = 2,
      _stepH[0] = stepParam7[0] + 2 * stepParam7[1],
      _stepG = 1;
    _stepG < _stepUnderscore - 1;
    ++_stepG
  ) {
    stepValue15[_stepG] = 1;
    stepValue16[_stepG] = 4;
    _stepH[_stepG] = 4 * stepParam7[_stepG] + 2 * stepParam7[_stepG + 1];
  }
  for (
    stepValue15[_stepUnderscore - 1] = 2,
      stepValue16[_stepUnderscore - 1] = 7,
      _stepH[_stepUnderscore - 1] =
        8 * stepParam7[_stepUnderscore - 1] + stepParam7[_stepUnderscore],
      _stepG = 1;
    _stepG < _stepUnderscore;
    ++_stepG
  ) {
    stepValue14 = stepValue15[_stepG] / stepValue16[_stepG - 1];
    stepValue16[_stepG] -= stepValue14;
    _stepH[_stepG] -= stepValue14 * _stepH[_stepG - 1];
  }
  for (
    stepValue15[_stepUnderscore - 1] =
      _stepH[_stepUnderscore - 1] / stepValue16[_stepUnderscore - 1],
      _stepG = _stepUnderscore - 2;
    _stepG >= 0;
    --_stepG
  )
    stepValue15[_stepG] =
      (_stepH[_stepG] - stepValue15[_stepG + 1]) / stepValue16[_stepG];
  for (
    stepValue16[_stepUnderscore - 1] =
      (stepParam7[_stepUnderscore] + stepValue15[_stepUnderscore - 1]) / 2,
      _stepG = 0;
    _stepG < _stepUnderscore - 1;
    ++_stepG
  )
    stepValue16[_stepG] = 2 * stepParam7[_stepG + 1] - stepValue15[_stepG + 1];
  return [stepValue15, stepValue16];
}
export function stepI(stepParam47) {
  return new stepHelper16(stepParam47);
}
function stepHelper18(stepParam31, _stepG) {
  this._context = stepParam31;
  this._t = _stepG;
}
stepHelper18.prototype = {
  areaStart: function () {
    this._line = 0;
  },
  areaEnd: function () {
    this._line = NaN;
  },
  lineStart: function () {
    this._x = this._y = NaN;
    this._point = 0;
  },
  lineEnd: function () {
    0 < this._t &&
      this._t < 1 &&
      this._point === 2 &&
      this._context.lineTo(this._x, this._y);
    (this._line || (this._line !== 0 && this._point === 1)) &&
      this._context.closePath();
    this._line >= 0 && ((this._t = 1 - this._t), (this._line = 1 - this._line));
  },
  point: function (stepParam12, _stepG) {
    switch (((stepParam12 = +stepParam12), (_stepG = +_stepG), this._point)) {
      case 0:
        this._point = 1;
        this._line
          ? this._context.lineTo(stepParam12, _stepG)
          : this._context.moveTo(stepParam12, _stepG);
        break;
      case 1:
        this._point = 2;
      default:
        if (this._t <= 0) {
          this._context.lineTo(this._x, _stepG);
          this._context.lineTo(stepParam12, _stepG);
        } else {
          var _stepUnderscore = this._x * (1 - this._t) + stepParam12 * this._t;
          this._context.lineTo(_stepUnderscore, this._y);
          this._context.lineTo(_stepUnderscore, _stepG);
        }
        break;
    }
    this._x = stepParam12;
    this._y = _stepG;
  },
};
export function stepR(stepParam35) {
  return new stepHelper18(stepParam35, 0.5);
}
export function stepN(stepParam36) {
  return new stepHelper18(stepParam36, 0);
}
export function stepT(stepParam37) {
  return new stepHelper18(stepParam37, 1);
}
