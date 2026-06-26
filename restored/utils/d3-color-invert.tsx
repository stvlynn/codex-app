// Restored from ref/webview/assets/invert-D9sJN2p1.js
// Invert chunk restored from the Codex webview bundle.
var invertValue1 = {
    min: {
      r: 0,
      g: 0,
      b: 0,
      s: 0,
      l: 0,
      a: 0,
    },
    max: {
      r: 255,
      g: 255,
      b: 255,
      h: 360,
      s: 100,
      l: 100,
      a: 1,
    },
    clamp: {
      r: (invertParam45) =>
        invertParam45 >= 255 ? 255 : invertParam45 < 0 ? 0 : invertParam45,
      g: (invertParam46) =>
        invertParam46 >= 255 ? 255 : invertParam46 < 0 ? 0 : invertParam46,
      b: (invertParam47) =>
        invertParam47 >= 255 ? 255 : invertParam47 < 0 ? 0 : invertParam47,
      h: (invertParam55) => invertParam55 % 360,
      s: (invertParam48) =>
        invertParam48 >= 100 ? 100 : invertParam48 < 0 ? 0 : invertParam48,
      l: (invertParam49) =>
        invertParam49 >= 100 ? 100 : invertParam49 < 0 ? 0 : invertParam49,
      a: (invertParam50) =>
        invertParam50 >= 1 ? 1 : invertParam50 < 0 ? 0 : invertParam50,
    },
    toLinear: (invertParam32) => {
      let _invertL = invertParam32 / 255;
      return invertParam32 > 0.03928
        ? ((_invertL + 0.055) / 1.055) ** 2.4
        : _invertL / 12.92;
    },
    hue2rgb: (invertParam17, _invertL, invertParam18) => (
      invertParam18 < 0 && (invertParam18 += 1),
      invertParam18 > 1 && --invertParam18,
      invertParam18 < 0.16666666666666666
        ? invertParam17 + (_invertL - invertParam17) * 6 * invertParam18
        : invertParam18 < 0.5
          ? _invertL
          : invertParam18 < 0.6666666666666666
            ? invertParam17 +
              (_invertL - invertParam17) *
                (0.6666666666666666 - invertParam18) *
                6
            : invertParam17
    ),
    hsl2rgb: ({ h: _invertL, s, l }, invertParam6) => {
      if (!s) return l * 2.55;
      _invertL /= 360;
      s /= 100;
      l /= 100;
      let invertValue41 = l < 0.5 ? l * (1 + s) : l + s - l * s,
        invertValue42 = 2 * l - invertValue41;
      switch (invertParam6) {
        case "r":
          return (
            invertValue1.hue2rgb(
              invertValue42,
              invertValue41,
              _invertL + 0.3333333333333333,
            ) * 255
          );
        case "g":
          return (
            invertValue1.hue2rgb(invertValue42, invertValue41, _invertL) * 255
          );
        case "b":
          return (
            invertValue1.hue2rgb(
              invertValue42,
              invertValue41,
              _invertL - 0.3333333333333333,
            ) * 255
          );
      }
    },
    rgb2hsl: ({ r: _r, g: _invertL, b }, invertParam1) => {
      _r /= 255;
      _invertL /= 255;
      b /= 255;
      let invertValue14 = Math.max(_r, _invertL, b),
        invertValue15 = Math.min(_r, _invertL, b),
        invertValue16 = (invertValue14 + invertValue15) / 2;
      if (invertParam1 === "l") return invertValue16 * 100;
      if (invertValue14 === invertValue15) return 0;
      let invertValue17 = invertValue14 - invertValue15,
        invertValue18 =
          invertValue16 > 0.5
            ? invertValue17 / (2 - invertValue14 - invertValue15)
            : invertValue17 / (invertValue14 + invertValue15);
      if (invertParam1 === "s") return invertValue18 * 100;
      switch (invertValue14) {
        case _r:
          return ((_invertL - b) / invertValue17 + (_invertL < b ? 6 : 0)) * 60;
        case _invertL:
          return ((b - _r) / invertValue17 + 2) * 60;
        case b:
          return ((_r - _invertL) / invertValue17 + 4) * 60;
        default:
          return -1;
      }
    },
  },
  invertL = {
    channel: invertValue1,
    lang: {
      clamp: (invertParam35, _invertL, invertParam36) =>
        _invertL > invertParam36
          ? Math.min(_invertL, Math.max(invertParam36, invertParam35))
          : Math.min(invertParam36, Math.max(_invertL, invertParam35)),
      round: (invertParam51) => Math.round(invertParam51 * 1e10) / 1e10,
    },
    unit: {
      dec2hex: (invertParam33) => {
        let _invertL = Math.round(invertParam33).toString(16);
        return _invertL.length > 1 ? _invertL : `0${_invertL}`;
      },
    },
  },
  invertValue2 = {};
for (let invertValue74 = 0; invertValue74 <= 255; invertValue74++)
  invertValue2[invertValue74] = invertL.unit.dec2hex(invertValue74);
var invertValue3 = {
    ALL: 0,
    RGB: 1,
    HSL: 2,
  },
  invertValue4 = class {
    constructor() {
      this.type = invertValue3.ALL;
    }
    get() {
      return this.type;
    }
    set(invertParam23) {
      if (this.type && this.type !== invertParam23)
        throw Error("Cannot change both RGB and HSL channels at the same time");
      this.type = invertParam23;
    }
    reset() {
      this.type = invertValue3.ALL;
    }
    is(invertParam44) {
      return this.type === invertParam44;
    }
  },
  invertValue5 = new (class {
    constructor(invertParam27, _invertL) {
      this.color = _invertL;
      this.changed = false;
      this.data = invertParam27;
      this.type = new invertValue4();
    }
    set(invertParam21, _invertL) {
      return (
        (this.color = _invertL),
        (this.changed = false),
        (this.data = invertParam21),
        (this.type.type = invertValue3.ALL),
        this
      );
    }
    _ensureHSL() {
      let invertValue49 = this.data,
        { h, s, l } = invertValue49;
      h === undefined &&
        (invertValue49.h = invertL.channel.rgb2hsl(invertValue49, "h"));
      s === undefined &&
        (invertValue49.s = invertL.channel.rgb2hsl(invertValue49, "s"));
      l === undefined &&
        (invertValue49.l = invertL.channel.rgb2hsl(invertValue49, "l"));
    }
    _ensureRGB() {
      let invertValue50 = this.data,
        { r: _r, g, b } = invertValue50;
      _r === undefined &&
        (invertValue50.r = invertL.channel.hsl2rgb(invertValue50, "r"));
      g === undefined &&
        (invertValue50.g = invertL.channel.hsl2rgb(invertValue50, "g"));
      b === undefined &&
        (invertValue50.b = invertL.channel.hsl2rgb(invertValue50, "b"));
    }
    get r() {
      let invertValue55 = this.data,
        invertValue56 = invertValue55.r;
      return !this.type.is(invertValue3.HSL) && invertValue56 !== undefined
        ? invertValue56
        : (this._ensureHSL(), invertL.channel.hsl2rgb(invertValue55, "r"));
    }
    get g() {
      let invertValue57 = this.data,
        invertValue58 = invertValue57.g;
      return !this.type.is(invertValue3.HSL) && invertValue58 !== undefined
        ? invertValue58
        : (this._ensureHSL(), invertL.channel.hsl2rgb(invertValue57, "g"));
    }
    get b() {
      let invertValue59 = this.data,
        invertValue60 = invertValue59.b;
      return !this.type.is(invertValue3.HSL) && invertValue60 !== undefined
        ? invertValue60
        : (this._ensureHSL(), invertL.channel.hsl2rgb(invertValue59, "b"));
    }
    get h() {
      let invertValue61 = this.data,
        invertValue62 = invertValue61.h;
      return !this.type.is(invertValue3.RGB) && invertValue62 !== undefined
        ? invertValue62
        : (this._ensureRGB(), invertL.channel.rgb2hsl(invertValue61, "h"));
    }
    get s() {
      let invertValue63 = this.data,
        invertValue64 = invertValue63.s;
      return !this.type.is(invertValue3.RGB) && invertValue64 !== undefined
        ? invertValue64
        : (this._ensureRGB(), invertL.channel.rgb2hsl(invertValue63, "s"));
    }
    get l() {
      let invertValue65 = this.data,
        invertValue66 = invertValue65.l;
      return !this.type.is(invertValue3.RGB) && invertValue66 !== undefined
        ? invertValue66
        : (this._ensureRGB(), invertL.channel.rgb2hsl(invertValue65, "l"));
    }
    get a() {
      return this.data.a;
    }
    set r(invertParam37) {
      this.type.set(invertValue3.RGB);
      this.changed = true;
      this.data.r = invertParam37;
    }
    set g(invertParam38) {
      this.type.set(invertValue3.RGB);
      this.changed = true;
      this.data.g = invertParam38;
    }
    set b(invertParam39) {
      this.type.set(invertValue3.RGB);
      this.changed = true;
      this.data.b = invertParam39;
    }
    set h(invertParam40) {
      this.type.set(invertValue3.HSL);
      this.changed = true;
      this.data.h = invertParam40;
    }
    set s(invertParam41) {
      this.type.set(invertValue3.HSL);
      this.changed = true;
      this.data.s = invertParam41;
    }
    set l(invertParam42) {
      this.type.set(invertValue3.HSL);
      this.changed = true;
      this.data.l = invertParam42;
    }
    set a(invertParam43) {
      this.changed = true;
      this.data.a = invertParam43;
    }
  })(
    {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    },
    "transparent",
  ),
  invertValue6 = {
    re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
    parse: (invertParam2) => {
      if (invertParam2.charCodeAt(0) !== 35) return;
      let _invertL = invertParam2.match(invertValue6.re);
      if (!_invertL) return;
      let invertValue19 = _invertL[1],
        invertValue20 = parseInt(invertValue19, 16),
        invertValue21 = invertValue19.length,
        invertValue22 = invertValue21 % 4 == 0,
        invertValue23 = invertValue21 > 4,
        invertValue24 = invertValue23 ? 1 : 17,
        _invertC = invertValue23 ? 8 : 4,
        invertValue25 = invertValue22 ? 0 : -1,
        _invertS = invertValue23 ? 255 : 15;
      return invertValue5.set(
        {
          r:
            ((invertValue20 >> (_invertC * (invertValue25 + 3))) & _invertS) *
            invertValue24,
          g:
            ((invertValue20 >> (_invertC * (invertValue25 + 2))) & _invertS) *
            invertValue24,
          b:
            ((invertValue20 >> (_invertC * (invertValue25 + 1))) & _invertS) *
            invertValue24,
          a: invertValue22
            ? ((invertValue20 & _invertS) * invertValue24) / 255
            : 1,
        },
        invertParam2,
      );
    },
    stringify: (invertParam15) => {
      let { r: _invertL, g, b, a: invertValue52 } = invertParam15;
      return invertValue52 < 1
        ? `#${invertValue2[Math.round(_invertL)]}${invertValue2[Math.round(g)]}${invertValue2[Math.round(b)]}${invertValue2[Math.round(invertValue52 * 255)]}`
        : `#${invertValue2[Math.round(_invertL)]}${invertValue2[Math.round(g)]}${invertValue2[Math.round(b)]}`;
    },
  },
  invertValue7 = {
    re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
    hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
    _hue2deg: (invertParam5) => {
      let invertValue40 = invertParam5.match(invertValue7.hueRe);
      if (invertValue40) {
        let [, invertValue46, invertValue47] = invertValue40;
        switch (invertValue47) {
          case "grad":
            return invertL.channel.clamp.h(parseFloat(invertValue46) * 0.9);
          case "rad":
            return invertL.channel.clamp.h(
              (parseFloat(invertValue46) * 180) / Math.PI,
            );
          case "turn":
            return invertL.channel.clamp.h(parseFloat(invertValue46) * 360);
        }
      }
      return invertL.channel.clamp.h(parseFloat(invertParam5));
    },
    parse: (invertParam4) => {
      let invertValue34 = invertParam4.charCodeAt(0);
      if (invertValue34 !== 104 && invertValue34 !== 72) return;
      let invertValue35 = invertParam4.match(invertValue7.re);
      if (!invertValue35) return;
      let [
        ,
        invertValue36,
        invertValue37,
        invertValue38,
        invertValue39,
        _invertC,
      ] = invertValue35;
      return invertValue5.set(
        {
          h: invertValue7._hue2deg(invertValue36),
          s: invertL.channel.clamp.s(parseFloat(invertValue37)),
          l: invertL.channel.clamp.l(parseFloat(invertValue38)),
          a: invertValue39
            ? invertL.channel.clamp.a(
                _invertC
                  ? parseFloat(invertValue39) / 100
                  : parseFloat(invertValue39),
              )
            : 1,
        },
        invertParam4,
      );
    },
    stringify: (invertParam16) => {
      let { h, s, l, a: invertValue53 } = invertParam16;
      return invertValue53 < 1
        ? `hsla(${invertL.lang.round(h)}, ${invertL.lang.round(s)}%, ${invertL.lang.round(l)}%, ${invertValue53})`
        : `hsl(${invertL.lang.round(h)}, ${invertL.lang.round(s)}%, ${invertL.lang.round(l)}%)`;
    },
  },
  invertValue8 = {
    colors: {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyanaqua: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkgrey: "#a9a9a9",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkslategrey: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      gold: "#ffd700",
      goldenrod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      grey: "#808080",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      indianred: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      lavender: "#e6e6fa",
      lavenderblush: "#fff0f5",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrodyellow: "#fafad2",
      lightgray: "#d3d3d3",
      lightgreen: "#90ee90",
      lightgrey: "#d3d3d3",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370db",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#db7093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      transparent: "#00000000",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32",
    },
    parse: (invertParam34) => {
      invertParam34 = invertParam34.toLowerCase();
      let _invertL = invertValue8.colors[invertParam34];
      if (_invertL) return invertValue6.parse(_invertL);
    },
    stringify: (invertParam31) => {
      let _invertL = invertValue6.stringify(invertParam31);
      for (let invertValue75 in invertValue8.colors)
        if (invertValue8.colors[invertValue75] === _invertL)
          return invertValue75;
    },
  },
  invertValue9 = {
    re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
    parse: (invertParam3) => {
      let invertValue26 = invertParam3.charCodeAt(0);
      if (invertValue26 !== 114 && invertValue26 !== 82) return;
      let invertValue27 = invertParam3.match(invertValue9.re);
      if (!invertValue27) return;
      let [
        ,
        invertValue28,
        invertValue29,
        invertValue30,
        invertValue31,
        _invertC,
        invertValue32,
        _invertS,
        invertValue33,
      ] = invertValue27;
      return invertValue5.set(
        {
          r: invertL.channel.clamp.r(
            invertValue29
              ? parseFloat(invertValue28) * 2.55
              : parseFloat(invertValue28),
          ),
          g: invertL.channel.clamp.g(
            invertValue31
              ? parseFloat(invertValue30) * 2.55
              : parseFloat(invertValue30),
          ),
          b: invertL.channel.clamp.b(
            invertValue32 ? parseFloat(_invertC) * 2.55 : parseFloat(_invertC),
          ),
          a: _invertS
            ? invertL.channel.clamp.a(
                invertValue33
                  ? parseFloat(_invertS) / 100
                  : parseFloat(_invertS),
              )
            : 1,
        },
        invertParam3,
      );
    },
    stringify: (invertParam14) => {
      let { r: _r, g, b, a: invertValue51 } = invertParam14;
      return invertValue51 < 1
        ? `rgba(${invertL.lang.round(_r)}, ${invertL.lang.round(g)}, ${invertL.lang.round(b)}, ${invertL.lang.round(invertValue51)})`
        : `rgb(${invertL.lang.round(_r)}, ${invertL.lang.round(g)}, ${invertL.lang.round(b)})`;
    },
  },
  invertC = {
    format: {
      keyword: invertValue8,
      hex: invertValue6,
      rgb: invertValue9,
      rgba: invertValue9,
      hsl: invertValue7,
      hsla: invertValue7,
    },
    parse: (invertParam20) => {
      if (typeof invertParam20 != "string") return invertParam20;
      let _invertL =
        invertValue6.parse(invertParam20) ||
        invertValue9.parse(invertParam20) ||
        invertValue7.parse(invertParam20) ||
        invertValue8.parse(invertParam20);
      if (_invertL) return _invertL;
      throw Error(`Unsupported color format: "${invertParam20}"`);
    },
    stringify: (invertParam9) =>
      !invertParam9.changed && invertParam9.color
        ? invertParam9.color
        : invertParam9.type.is(invertValue3.HSL) ||
            invertParam9.data.r === undefined
          ? invertValue7.stringify(invertParam9)
          : invertParam9.a < 1 ||
              !Number.isInteger(invertParam9.r) ||
              !Number.isInteger(invertParam9.g) ||
              !Number.isInteger(invertParam9.b)
            ? invertValue9.stringify(invertParam9)
            : invertValue6.stringify(invertParam9),
  },
  invertValue10 = (invertParam29, invertParam30) => {
    let invertValue73 = invertC.parse(invertParam29);
    for (let invertValue76 in invertParam30)
      invertValue73[invertValue76] = invertL.channel.clamp[invertValue76](
        invertParam30[invertValue76],
      );
    return invertC.stringify(invertValue73);
  },
  invertS = (
    invertParam10,
    invertParam11,
    invertParam12 = 0,
    invertParam13 = 1,
  ) => {
    if (typeof invertParam10 != "number")
      return invertValue10(invertParam10, {
        a: invertParam11,
      });
    let invertValue48 = invertValue5.set({
      r: invertL.channel.clamp.r(invertParam10),
      g: invertL.channel.clamp.g(invertParam11),
      b: invertL.channel.clamp.b(invertParam12),
      a: invertL.channel.clamp.a(invertParam13),
    });
    return invertC.stringify(invertValue48);
  },
  invertValue11 = (invertParam19) => {
    let { r: _r, g, b } = invertC.parse(invertParam19),
      invertValue54 =
        0.2126 * invertL.channel.toLinear(_r) +
        0.7152 * invertL.channel.toLinear(g) +
        0.0722 * invertL.channel.toLinear(b);
    return invertL.lang.round(invertValue54);
  },
  invertValue12 = (invertParam54) => invertValue11(invertParam54) >= 0.5,
  invertA = (invertParam24, invertParam25, invertParam26) => {
    let invertValue68 = invertC.parse(invertParam24),
      invertValue69 = invertValue68[invertParam25],
      invertValue70 = invertL.channel.clamp[invertParam25](
        invertValue69 + invertParam26,
      );
    return (
      invertValue69 !== invertValue70 &&
        (invertValue68[invertParam25] = invertValue70),
      invertC.stringify(invertValue68)
    );
  },
  invertValue13 = (invertParam7, _invertL, invertParam8 = 50) => {
    let { r: invertValue43, g: _g, b, a } = invertC.parse(invertParam7),
      { r, g: __g, b: _b, a: _a } = invertC.parse(_invertL),
      invertValue44 = invertParam8 / 100,
      invertValue45 = invertValue44 * 2 - 1,
      _invertO = a - _a,
      _invertA =
        ((invertValue45 * _invertO === -1
          ? invertValue45
          : (invertValue45 + _invertO) / (1 + invertValue45 * _invertO)) +
          1) /
        2,
      _invertI = 1 - _invertA;
    return invertS(
      invertValue43 * _invertA + r * _invertI,
      _g * _invertA + __g * _invertI,
      b * _invertA + _b * _invertI,
      a * invertValue44 + _a * (1 - invertValue44),
    );
  };
export const invertT = (invertParam22, _invertL = 100) => {
  let invertValue67 = invertC.parse(invertParam22);
  return (
    (invertValue67.r = 255 - invertValue67.r),
    (invertValue67.g = 255 - invertValue67.g),
    (invertValue67.b = 255 - invertValue67.b),
    invertValue13(invertValue67, invertParam22, _invertL)
  );
};
export const invertR = (invertParam52, _invertL) =>
  invertA(invertParam52, "l", -_invertL);
export const invertO = (invertParam56) => !invertValue12(invertParam56);
export const invertN = (invertParam28, _invertL) => {
  let invertValue71 = invertC.parse(invertParam28),
    invertValue72 = {};
  for (let invertValue77 in _invertL)
    _invertL[invertValue77] &&
      (invertValue72[invertValue77] =
        invertValue71[invertValue77] + _invertL[invertValue77]);
  return invertValue10(invertParam28, invertValue72);
};
export const invertI = (invertParam53, _invertL) =>
  invertA(invertParam53, "l", _invertL);
export { invertA, invertC, invertL, invertS };
