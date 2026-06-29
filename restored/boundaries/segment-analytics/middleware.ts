// Restored from ref/webview/assets/middleware-BDgBoOJW.js
// Middleware chunk restored from the Codex webview bundle.
import { chunkT } from "../../utils/esbuild-runtime-helpers";
import {
  i as middlewareImport1,
  n as middlewareImport2,
  r as middlewareImport3,
  t as middlewareImport4,
} from "tslib";
function middlewareH(middlewareParam53, middlewareParam54, middlewareParam55) {
  middlewareParam54.split && (middlewareParam54 = middlewareParam54.split(`.`));
  for (
    var middlewareValue135 = 0,
      middlewareValue136 = middlewareParam54.length,
      _middlewareH = middlewareParam53,
      middlewareValue137,
      middlewareValue138;
    middlewareValue135 < middlewareValue136 &&
    ((middlewareValue138 = `` + middlewareParam54[middlewareValue135++]),
    !(
      middlewareValue138 === `__proto__` ||
      middlewareValue138 === `constructor` ||
      middlewareValue138 === `prototype`
    ));
  )
    _middlewareH = _middlewareH[middlewareValue138] =
      middlewareValue135 === middlewareValue136
        ? middlewareParam55
        : typeof (middlewareValue137 = _middlewareH[middlewareValue138]) ==
            typeof middlewareParam54
          ? middlewareValue137
          : middlewareParam54[middlewareValue135] * 0 != 0 ||
              ~(`` + middlewareParam54[middlewareValue135]).indexOf(`.`)
            ? {}
            : [];
}
for (
  var middlewareValue1 = 256, middlewareValue2 = [], middlewareValue3;
  middlewareValue1--;
)
  middlewareValue2[middlewareValue1] = (middlewareValue1 + 256)
    .toString(16)
    .substring(1);
function middlewareM() {
  var middlewareValue139 = 0,
    middlewareValue140,
    middlewareValue141 = ``;
  if (!middlewareValue3 || middlewareValue1 + 16 > 256) {
    for (
      middlewareValue3 = Array((middlewareValue139 = 256));
      middlewareValue139--;
    )
      middlewareValue3[middlewareValue139] = (256 * Math.random()) | 0;
    middlewareValue139 = middlewareValue1 = 0;
  }
  for (; middlewareValue139 < 16; middlewareValue139++)
    ((middlewareValue140 =
      middlewareValue3[middlewareValue1 + middlewareValue139]),
      middlewareValue139 == 6
        ? (middlewareValue141 +=
            middlewareValue2[(middlewareValue140 & 15) | 64])
        : middlewareValue139 == 8
          ? (middlewareValue141 +=
              middlewareValue2[(middlewareValue140 & 63) | 128])
          : (middlewareValue141 += middlewareValue2[middlewareValue140]),
      middlewareValue139 & 1 &&
        middlewareValue139 > 1 &&
        middlewareValue139 < 11 &&
        (middlewareValue141 += `-`));
  return (middlewareValue1++, middlewareValue141);
}
var middlewareValue4 = (function () {
    function middlewareHelper17() {
      this._logs = [];
    }
    return (
      (middlewareHelper17.prototype.log = function (
        middlewareParam109,
        middlewareParam110,
        middlewareParam111,
      ) {
        var middlewareValue208 = new Date();
        this._logs.push({
          level: middlewareParam109,
          message: middlewareParam110,
          time: middlewareValue208,
          extras: middlewareParam111,
        });
      }),
      Object.defineProperty(middlewareHelper17.prototype, `logs`, {
        get: function () {
          return this._logs;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (middlewareHelper17.prototype.flush = function () {
        if (this.logs.length > 1) {
          var middlewareValue85 = this._logs.reduce(function (
            accumulator,
            current,
          ) {
            var middlewareValue130,
              middlewareValue131 = middlewareImport4(
                middlewareImport4({}, current),
                {
                  json: JSON.stringify(current.extras, null, ` `),
                  extras: current.extras,
                },
              );
            delete middlewareValue131.time;
            var _middlewareH = current.time?.toISOString() ?? ``;
            return (
              accumulator[_middlewareH] &&
                (_middlewareH = `${_middlewareH}-${Math.random()}`),
              middlewareImport4(
                middlewareImport4({}, accumulator),
                ((middlewareValue130 = {}),
                (middlewareValue130[_middlewareH] = middlewareValue131),
                middlewareValue130),
              )
            );
          }, {});
          console.table
            ? console.table(middlewareValue85)
            : console.log(middlewareValue85);
        } else
          this.logs.forEach(function (item) {
            var middlewareValue176 = item.level,
              middlewareValue177 = item.message,
              middlewareValue178 = item.extras;
            middlewareValue176 === `info` || middlewareValue176 === `debug`
              ? console.log(middlewareValue177, middlewareValue178 ?? ``)
              : console[middlewareValue176](
                  middlewareValue177,
                  middlewareValue178 ?? ``,
                );
          });
        this._logs = [];
      }),
      middlewareHelper17
    );
  })(),
  middlewareValue5 = function (middlewareParam156) {
    return {
      gauge: `g`,
      counter: `c`,
    }[middlewareParam156];
  },
  middlewareValue6 = (function () {
    function middlewareHelper19() {
      this.metrics = [];
    }
    return (
      (middlewareHelper19.prototype.increment = function (
        middlewareParam81,
        middlewareParam82,
        middlewareParam83,
      ) {
        (middlewareParam82 === void 0 && (middlewareParam82 = 1),
          this.metrics.push({
            metric: middlewareParam81,
            value: middlewareParam82,
            tags: middlewareParam83 ?? [],
            type: `counter`,
            timestamp: Date.now(),
          }));
      }),
      (middlewareHelper19.prototype.gauge = function (
        middlewareParam93,
        middlewareParam94,
        middlewareParam95,
      ) {
        this.metrics.push({
          metric: middlewareParam93,
          value: middlewareParam94,
          tags: middlewareParam95 ?? [],
          type: `gauge`,
          timestamp: Date.now(),
        });
      }),
      (middlewareHelper19.prototype.flush = function () {
        var middlewareValue179 = this.metrics.map(function (item) {
          return middlewareImport4(middlewareImport4({}, item), {
            tags: item.tags.join(`,`),
          });
        });
        (console.table
          ? console.table(middlewareValue179)
          : console.log(middlewareValue179),
          (this.metrics = []));
      }),
      (middlewareHelper19.prototype.serialize = function () {
        return this.metrics.map(function (item) {
          return {
            m: item.metric,
            v: item.value,
            t: item.tags,
            k: middlewareValue5(item.type),
            e: item.timestamp,
          };
        });
      }),
      middlewareHelper19
    );
  })(),
  middlewareValue7 = (function (middlewareParam61) {
    middlewareImport3(middlewareHelper32, middlewareParam61);
    function middlewareHelper32() {
      return (
        (middlewareParam61 !== null &&
          middlewareParam61.apply(this, arguments)) ||
        this
      );
    }
    return (
      (middlewareHelper32.prototype.gauge = function () {}),
      (middlewareHelper32.prototype.increment = function () {}),
      (middlewareHelper32.prototype.flush = function () {}),
      (middlewareHelper32.prototype.serialize = function () {
        return [];
      }),
      middlewareHelper32
    );
  })(middlewareValue6),
  middlewareF = (function () {
    function middlewareHelper34(middlewareParam104) {
      ((this.retry = middlewareParam104.retry ?? !0),
        (this.type = middlewareParam104.type ?? `plugin Error`),
        (this.reason = middlewareParam104.reason ?? ``));
    }
    return middlewareHelper34;
  })(),
  middlewareP = (function () {
    function middlewareHelper10(
      middlewareParam70,
      middlewareParam71,
      middlewareParam72,
      middlewareParam73,
    ) {
      (middlewareParam71 === void 0 && (middlewareParam71 = middlewareM()),
        middlewareParam72 === void 0 &&
          (middlewareParam72 = new middlewareValue7()),
        middlewareParam73 === void 0 &&
          (middlewareParam73 = new middlewareValue4()),
        (this.attempts = 0),
        (this.event = middlewareParam70),
        (this._id = middlewareParam71),
        (this.logger = middlewareParam73),
        (this.stats = middlewareParam72));
    }
    return (
      (middlewareHelper10.system = function () {}),
      (middlewareHelper10.prototype.isSame = function (middlewareParam175) {
        return middlewareParam175.id === this.id;
      }),
      (middlewareHelper10.prototype.cancel = function (middlewareParam135) {
        throw (
          middlewareParam135 ||
          new middlewareF({
            reason: `Context Cancel`,
          })
        );
      }),
      (middlewareHelper10.prototype.log = function (
        middlewareParam157,
        middlewareParam158,
        middlewareParam159,
      ) {
        this.logger.log(
          middlewareParam157,
          middlewareParam158,
          middlewareParam159,
        );
      }),
      Object.defineProperty(middlewareHelper10.prototype, `id`, {
        get: function () {
          return this._id;
        },
        enumerable: !1,
        configurable: !0,
      }),
      (middlewareHelper10.prototype.updateEvent = function (
        middlewareParam87,
        middlewareParam88,
      ) {
        if (middlewareParam87.split(`.`)[0] === `integrations`) {
          var middlewareValue175 = middlewareParam87.split(`.`)[1];
          if (this.event.integrations?.[middlewareValue175] === !1)
            return this.event;
        }
        return (
          middlewareH(this.event, middlewareParam87, middlewareParam88),
          this.event
        );
      }),
      (middlewareHelper10.prototype.failedDelivery = function () {
        return this._failedDelivery;
      }),
      (middlewareHelper10.prototype.setFailedDelivery = function (
        middlewareParam174,
      ) {
        this._failedDelivery = middlewareParam174;
      }),
      (middlewareHelper10.prototype.logs = function () {
        return this.logger.logs;
      }),
      (middlewareHelper10.prototype.flush = function () {
        (this.logger.flush(), this.stats.flush());
      }),
      (middlewareHelper10.prototype.toJSON = function () {
        return {
          id: this._id,
          event: this.event,
          logs: this.logger.logs,
          metrics: this.stats.metrics,
        };
      }),
      middlewareHelper10
    );
  })();
function middlewareHelper1(middlewareParam7, middlewareParam8) {
  return (
    (middlewareParam8 ||= {}),
    new Promise(function (middlewareParam11, middlewareParam12) {
      var middlewareValue67 = new XMLHttpRequest(),
        _middlewareH = [],
        middlewareValue68 = [],
        middlewareValue69 = {},
        middlewareValue70 = function () {
          return {
            ok: ((middlewareValue67.status / 100) | 0) == 2,
            statusText: middlewareValue67.statusText,
            status: middlewareValue67.status,
            url: middlewareValue67.responseURL,
            text: function () {
              return Promise.resolve(middlewareValue67.responseText);
            },
            json: function () {
              return Promise.resolve(middlewareValue67.responseText).then(
                JSON.parse,
              );
            },
            blob: function () {
              return Promise.resolve(new Blob([middlewareValue67.response]));
            },
            clone: middlewareValue70,
            headers: {
              keys: function () {
                return _middlewareH;
              },
              entries: function () {
                return middlewareValue68;
              },
              get: function (middlewareParam151) {
                return middlewareValue69[middlewareParam151.toLowerCase()];
              },
              has: function (middlewareParam147) {
                return middlewareParam147.toLowerCase() in middlewareValue69;
              },
            },
          };
        };
      for (var _middlewareM in (middlewareValue67.open(
        middlewareParam8.method || `get`,
        middlewareParam7,
        !0,
      ),
      (middlewareValue67.onload = function () {
        (middlewareValue67
          .getAllResponseHeaders()
          .replace(
            /^(.*?):[^\S\n]*([\s\S]*?)$/gm,
            function (
              middlewareParam99,
              middlewareParam100,
              middlewareParam101,
            ) {
              (_middlewareH.push(
                (middlewareParam100 = middlewareParam100.toLowerCase()),
              ),
                middlewareValue68.push([
                  middlewareParam100,
                  middlewareParam101,
                ]),
                (middlewareValue69[middlewareParam100] = middlewareValue69[
                  middlewareParam100
                ]
                  ? middlewareValue69[middlewareParam100] +
                    `,` +
                    middlewareParam101
                  : middlewareParam101));
            },
          ),
          middlewareParam11(middlewareValue70()));
      }),
      (middlewareValue67.onerror = middlewareParam12),
      (middlewareValue67.withCredentials =
        middlewareParam8.credentials == `include`),
      middlewareParam8.headers))
        middlewareValue67.setRequestHeader(
          _middlewareM,
          middlewareParam8.headers[_middlewareM],
        );
      middlewareValue67.send(middlewareParam8.body || null);
    })
  );
}
var middlewareD = function () {
    return typeof globalThis < `u`
      ? globalThis
      : typeof self < `u`
        ? self
        : typeof window < `u`
          ? window
          : typeof global < `u`
            ? global
            : null;
  },
  middlewareU = function () {
    var middlewareValue216 = [...arguments],
      middlewareValue217 = middlewareD();
    return (
      (middlewareValue217 && middlewareValue217.fetch) ||
      middlewareHelper1
    ).apply(void 0, middlewareValue216);
  },
  middlewareL = `1.82.0`,
  middlewareValue8 = `npm`;
function middlewareC() {
  return middlewareValue8;
}
var middlewareS = `api.segment.io/v1`,
  middlewareValue9 = function (
    middlewareParam47,
    middlewareParam48,
    middlewareParam49,
  ) {
    return {
      type: `Counter`,
      metric: middlewareParam47,
      value: 1,
      tags: middlewareImport4(
        middlewareImport4(
          {},
          middlewareParam48.reduce(function (accumulator, current) {
            var middlewareValue209 = current.split(`:`),
              middlewareValue210 = middlewareValue209[0];
            return (
              (accumulator[middlewareValue210] = middlewareValue209[1]),
              accumulator
            );
          }, {}),
        ),
        {
          library: `analytics.js`,
          library_version:
            middlewareParam49 === `web`
              ? `next-${middlewareL}`
              : `npm:next-${middlewareL}`,
        },
      ),
    };
  };
function middlewareHelper2(middlewareParam124) {
  console.error(
    `Error sending segment performance metrics`,
    middlewareParam124,
  );
}
var middlewareValue10 = (function () {
    function middlewareHelper8(middlewareParam37) {
      var middlewareValue103 = this;
      if (
        ((this.host = middlewareParam37?.host ?? middlewareS),
        (this.sampleRate = middlewareParam37?.sampleRate ?? 1),
        (this.flushTimer = middlewareParam37?.flushTimer ?? 30 * 1e3),
        (this.maxQueueSize = middlewareParam37?.maxQueueSize ?? 20),
        (this.protocol = middlewareParam37?.protocol ?? `https`),
        (this.queue = []),
        this.sampleRate > 0)
      ) {
        var middlewareValue104 = !1,
          middlewareValue105 = function () {
            middlewareValue104 ||
              ((middlewareValue104 = !0),
              middlewareValue103.flush().catch(middlewareHelper2),
              (middlewareValue104 = !1),
              setTimeout(middlewareValue105, middlewareValue103.flushTimer));
          };
        middlewareValue105();
      }
    }
    return (
      (middlewareHelper8.prototype.increment = function (
        middlewareParam63,
        middlewareParam64,
      ) {
        if (
          middlewareParam63.includes(`analytics_js.`) &&
          middlewareParam64.length !== 0 &&
          !(Math.random() > this.sampleRate) &&
          !(this.queue.length >= this.maxQueueSize)
        ) {
          var middlewareValue153 = middlewareValue9(
            middlewareParam63,
            middlewareParam64,
            middlewareC(),
          );
          (this.queue.push(middlewareValue153),
            middlewareParam63.includes(`error`) &&
              this.flush().catch(middlewareHelper2));
        }
      }),
      (middlewareHelper8.prototype.flush = function () {
        return middlewareImport2(this, void 0, void 0, function () {
          var middlewareValue109 = this;
          return middlewareImport1(this, function (middlewareParam50) {
            switch (middlewareParam50.label) {
              case 0:
                return this.queue.length <= 0
                  ? [2]
                  : [
                      4,
                      this.send().catch(function (error) {
                        (middlewareHelper2(error),
                          (middlewareValue109.sampleRate = 0));
                      }),
                    ];
              case 1:
                return (middlewareParam50.sent(), [2]);
            }
          });
        });
      }),
      (middlewareHelper8.prototype.send = function () {
        return middlewareImport2(this, void 0, void 0, function () {
          var middlewareValue132, middlewareValue133, middlewareValue134;
          return middlewareImport1(this, function (middlewareParam65) {
            return (
              (middlewareValue132 = {
                series: this.queue,
              }),
              (this.queue = []),
              (middlewareValue133 = {
                "Content-Type": `text/plain`,
              }),
              (middlewareValue134 = `${this.protocol}://${this.host}/m`),
              [
                2,
                middlewareU(middlewareValue134, {
                  headers: middlewareValue133,
                  body: JSON.stringify(middlewareValue132),
                  method: `POST`,
                }),
              ]
            );
          });
        });
      }),
      middlewareHelper8
    );
  })(),
  middlewareValue11,
  middlewareO = (function (middlewareParam59) {
    middlewareImport3(middlewareHelper31, middlewareParam59);
    function middlewareHelper31() {
      return (
        (middlewareParam59 !== null &&
          middlewareParam59.apply(this, arguments)) ||
        this
      );
    }
    return (
      (middlewareHelper31.initRemoteMetrics = function (middlewareParam182) {
        middlewareValue11 = new middlewareValue10(middlewareParam182);
      }),
      (middlewareHelper31.prototype.increment = function (
        middlewareParam113,
        middlewareParam114,
        middlewareParam115,
      ) {
        (middlewareParam59.prototype.increment.call(
          this,
          middlewareParam113,
          middlewareParam114,
          middlewareParam115,
        ),
          middlewareValue11?.increment(
            middlewareParam113,
            middlewareParam115 ?? [],
          ));
      }),
      middlewareHelper31
    );
  })(middlewareValue6),
  middlewareValue12 = chunkT((middlewareParam13, middlewareParam14) => {
    ((middlewareParam14.exports = middlewareHelper12(middlewareHelper13)),
      (middlewareParam14.exports.find = middlewareParam14.exports),
      (middlewareParam14.exports.replace = function (
        middlewareParam125,
        middlewareParam126,
        middlewareParam127,
        middlewareParam128,
      ) {
        return (
          middlewareHelper12(_middlewareH).call(
            this,
            middlewareParam125,
            middlewareParam126,
            middlewareParam127,
            middlewareParam128,
          ),
          middlewareParam125
        );
      }),
      (middlewareParam14.exports.del = function (
        middlewareParam129,
        middlewareParam130,
        middlewareParam131,
      ) {
        return (
          middlewareHelper12(middlewareHelper14).call(
            this,
            middlewareParam129,
            middlewareParam130,
            null,
            middlewareParam131,
          ),
          middlewareParam129
        );
      }));
    function middlewareHelper12(middlewareParam22) {
      return function (
        middlewareParam25,
        middlewareParam26,
        middlewareParam27,
        middlewareParam28,
      ) {
        var __middlewareH =
          middlewareParam28 && middlewareHelper16(middlewareParam28.normalizer)
            ? middlewareParam28.normalizer
            : middlewareHelper15;
        middlewareParam26 = __middlewareH(middlewareParam26);
        for (var middlewareValue89, _middlewareM = !1; !_middlewareM; )
          middlewareHelper23();
        function middlewareHelper23() {
          for (middlewareValue89 in middlewareParam25) {
            var middlewareValue96 = __middlewareH(middlewareValue89);
            if (middlewareParam26.indexOf(middlewareValue96) === 0) {
              var middlewareValue97 = middlewareParam26.substr(
                middlewareValue96.length,
              );
              if (
                middlewareValue97.charAt(0) === `.` ||
                middlewareValue97.length === 0
              ) {
                middlewareParam26 = middlewareValue97.substr(1);
                var middlewareValue98 = middlewareParam25[middlewareValue89];
                if (middlewareValue98 == null) {
                  _middlewareM = !0;
                  return;
                }
                if (!middlewareParam26.length) {
                  _middlewareM = !0;
                  return;
                }
                middlewareParam25 = middlewareValue98;
                return;
              }
            }
          }
          ((middlewareValue89 = void 0), (_middlewareM = !0));
        }
        if (middlewareValue89)
          return middlewareParam25 == null
            ? middlewareParam25
            : middlewareParam22(
                middlewareParam25,
                middlewareValue89,
                middlewareParam27,
              );
      };
    }
    function middlewareHelper13(middlewareParam152, middlewareParam153) {
      if (middlewareParam152.hasOwnProperty(middlewareParam153))
        return middlewareParam152[middlewareParam153];
    }
    function middlewareHelper14(middlewareParam136, middlewareParam137) {
      return (
        middlewareParam136.hasOwnProperty(middlewareParam137) &&
          delete middlewareParam136[middlewareParam137],
        middlewareParam136
      );
    }
    function _middlewareH(
      middlewareParam132,
      middlewareParam133,
      middlewareParam134,
    ) {
      return (
        middlewareParam132.hasOwnProperty(middlewareParam133) &&
          (middlewareParam132[middlewareParam133] = middlewareParam134),
        middlewareParam132
      );
    }
    function middlewareHelper15(middlewareParam123) {
      return middlewareParam123.replace(/[^a-zA-Z0-9\.]+/g, ``).toLowerCase();
    }
    function middlewareHelper16(middlewareParam161) {
      return typeof middlewareParam161 == `function`;
    }
  }),
  middlewareValue13 = chunkT((middlewareParam19) => {
    var middlewareValue76 =
      (middlewareParam19 && middlewareParam19.__importDefault) ||
      function (middlewareParam138) {
        return middlewareParam138 && middlewareParam138.__esModule
          ? middlewareParam138
          : {
              default: middlewareParam138,
            };
      };
    Object.defineProperty(middlewareParam19, `__esModule`, {
      value: !0,
    });
    var middlewareValue77 = middlewareValue76(middlewareValue12());
    function middlewareHelper20(middlewareParam39, middlewareParam40) {
      return function () {
        var middlewareValue114 = this.traits(),
          middlewareValue115 = this.properties ? this.properties() : {};
        return (
          middlewareValue77.default(
            middlewareValue114,
            `address.` + middlewareParam39,
          ) ||
          middlewareValue77.default(middlewareValue114, middlewareParam39) ||
          (middlewareParam40
            ? middlewareValue77.default(
                middlewareValue114,
                `address.` + middlewareParam40,
              )
            : null) ||
          (middlewareParam40
            ? middlewareValue77.default(middlewareValue114, middlewareParam40)
            : null) ||
          middlewareValue77.default(
            middlewareValue115,
            `address.` + middlewareParam39,
          ) ||
          middlewareValue77.default(middlewareValue115, middlewareParam39) ||
          (middlewareParam40
            ? middlewareValue77.default(
                middlewareValue115,
                `address.` + middlewareParam40,
              )
            : null) ||
          (middlewareParam40
            ? middlewareValue77.default(middlewareValue115, middlewareParam40)
            : null)
        );
      };
    }
    function middlewareHelper21(middlewareParam89) {
      ((middlewareParam89.zip = middlewareHelper20(`postalCode`, `zip`)),
        (middlewareParam89.country = middlewareHelper20(`country`)),
        (middlewareParam89.street = middlewareHelper20(`street`)),
        (middlewareParam89.state = middlewareHelper20(`state`)),
        (middlewareParam89.city = middlewareHelper20(`city`)),
        (middlewareParam89.region = middlewareHelper20(`region`)));
    }
    middlewareParam19.default = middlewareHelper21;
  }),
  middlewareValue14 = chunkT((middlewareParam43) => {
    (Object.defineProperty(middlewareParam43, `__esModule`, {
      value: !0,
    }),
      (middlewareParam43.clone = void 0));
    function middlewareHelper29(middlewareParam62) {
      if (typeof middlewareParam62 != `object`) return middlewareParam62;
      if (
        Object.prototype.toString.call(middlewareParam62) === `[object Object]`
      ) {
        var middlewareValue151 = {};
        for (var middlewareValue152 in middlewareParam62)
          Object.prototype.hasOwnProperty.call(
            middlewareParam62,
            middlewareValue152,
          ) &&
            (middlewareValue151[middlewareValue152] = middlewareHelper29(
              middlewareParam62[middlewareValue152],
            ));
        return middlewareValue151;
      } else if (Array.isArray(middlewareParam62))
        return middlewareParam62.map(middlewareHelper29);
      else return middlewareParam62;
    }
    middlewareParam43.clone = middlewareHelper29;
  }),
  middlewareValue15 = chunkT((middlewareParam97) => {
    Object.defineProperty(middlewareParam97, `__esModule`, {
      value: !0,
    });
    var middlewareValue198 = {
      Salesforce: !0,
    };
    function middlewareHelper35(middlewareParam185) {
      return !middlewareValue198[middlewareParam185];
    }
    middlewareParam97.default = middlewareHelper35;
  }),
  middlewareValue16 = chunkT((middlewareParam17) => {
    var middlewareValue75 =
      /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
    ((middlewareParam17.parse = function (middlewareParam32) {
      var middlewareValue91 = [1, 5, 6, 7, 11, 12],
        middlewareValue92 = middlewareValue75.exec(middlewareParam32),
        middlewareValue93 = 0;
      if (!middlewareValue92) return new Date(middlewareParam32);
      for (
        var _middlewareH = 0, middlewareValue94;
        (middlewareValue94 = middlewareValue91[_middlewareH]);
        _middlewareH++
      )
        middlewareValue92[middlewareValue94] =
          parseInt(middlewareValue92[middlewareValue94], 10) || 0;
      ((middlewareValue92[2] = parseInt(middlewareValue92[2], 10) || 1),
        (middlewareValue92[3] = parseInt(middlewareValue92[3], 10) || 1),
        middlewareValue92[2]--,
        (middlewareValue92[8] = middlewareValue92[8]
          ? (middlewareValue92[8] + `00`).substring(0, 3)
          : 0),
        middlewareValue92[4] === ` `
          ? (middlewareValue93 = new Date().getTimezoneOffset())
          : middlewareValue92[9] !== `Z` &&
            middlewareValue92[10] &&
            ((middlewareValue93 =
              middlewareValue92[11] * 60 + middlewareValue92[12]),
            middlewareValue92[10] === `+` &&
              (middlewareValue93 = 0 - middlewareValue93)));
      var middlewareValue95 = Date.UTC(
        middlewareValue92[1],
        middlewareValue92[2],
        middlewareValue92[3],
        middlewareValue92[5],
        middlewareValue92[6] + middlewareValue93,
        middlewareValue92[7],
        middlewareValue92[8],
      );
      return new Date(middlewareValue95);
    }),
      (middlewareParam17.is = function (
        middlewareParam102,
        middlewareParam103,
      ) {
        return typeof middlewareParam102 != `string` ||
          (middlewareParam103 &&
            /^\d{4}-\d{2}-\d{2}/.test(middlewareParam102) === !1)
          ? !1
          : middlewareValue75.test(middlewareParam102);
      }));
  }),
  middlewareValue17 = chunkT((middlewareParam96) => {
    var middlewareValue195 = /\d{13}/;
    ((middlewareParam96.is = function (middlewareParam183) {
      return middlewareValue195.test(middlewareParam183);
    }),
      (middlewareParam96.parse = function (middlewareParam148) {
        return (
          (middlewareParam148 = parseInt(middlewareParam148, 10)),
          new Date(middlewareParam148)
        );
      }));
  }),
  middlewareValue18 = chunkT((middlewareParam92) => {
    var middlewareValue194 = /\d{10}/;
    ((middlewareParam92.is = function (middlewareParam184) {
      return middlewareValue194.test(middlewareParam184);
    }),
      (middlewareParam92.parse = function (middlewareParam120) {
        var middlewareValue220 = parseInt(middlewareParam120, 10) * 1e3;
        return new Date(middlewareValue220);
      }));
  }),
  middlewareValue19 = chunkT((middlewareParam35, middlewareParam36) => {
    var middlewareValue100 = middlewareValue16(),
      middlewareValue101 = middlewareValue17(),
      middlewareValue102 = middlewareValue18(),
      _middlewareH = Object.prototype.toString;
    function middlewareHelper26(middlewareParam155) {
      return _middlewareH.call(middlewareParam155) === `[object Date]`;
    }
    function middlewareHelper27(middlewareParam154) {
      return _middlewareH.call(middlewareParam154) === `[object Number]`;
    }
    middlewareParam36.exports = function (middlewareParam74) {
      return middlewareHelper26(middlewareParam74)
        ? middlewareParam74
        : middlewareHelper27(middlewareParam74)
          ? new Date(middlewareHelper28(middlewareParam74))
          : middlewareValue100.is(middlewareParam74)
            ? middlewareValue100.parse(middlewareParam74)
            : middlewareValue101.is(middlewareParam74)
              ? middlewareValue101.parse(middlewareParam74)
              : middlewareValue102.is(middlewareParam74)
                ? middlewareValue102.parse(middlewareParam74)
                : new Date(middlewareParam74);
    };
    function middlewareHelper28(middlewareParam160) {
      return middlewareParam160 < 315576e5
        ? middlewareParam160 * 1e3
        : middlewareParam160;
    }
  }),
  middlewareValue20 = chunkT((middlewareParam33, middlewareParam34) => {
    var middlewareValue99 = middlewareValue16();
    middlewareParam34.exports = middlewareHelper24;
    function middlewareHelper24(middlewareParam75, middlewareParam76) {
      return (
        middlewareParam76 === void 0 && (middlewareParam76 = !0),
        middlewareParam75 && typeof middlewareParam75 == `object`
          ? middlewareHelper25(middlewareParam75, middlewareParam76)
          : Array.isArray(middlewareParam75)
            ? _middlewareH(middlewareParam75, middlewareParam76)
            : middlewareValue99.is(middlewareParam75, middlewareParam76)
              ? middlewareValue99.parse(middlewareParam75)
              : middlewareParam75
      );
    }
    function middlewareHelper25(middlewareParam105, middlewareParam106) {
      return (
        Object.keys(middlewareParam105).forEach(function (item) {
          middlewareParam105[item] = middlewareHelper24(
            middlewareParam105[item],
            middlewareParam106,
          );
        }),
        middlewareParam105
      );
    }
    function _middlewareH(middlewareParam107, middlewareParam108) {
      return (
        middlewareParam107.forEach(function (item, index) {
          middlewareParam107[index] = middlewareHelper24(
            item,
            middlewareParam108,
          );
        }),
        middlewareParam107
      );
    }
  }),
  middlewareValue21 = chunkT((middlewareParam2) => {
    var middlewareValue38 =
      (middlewareParam2 && middlewareParam2.__importDefault) ||
      function (middlewareParam139) {
        return middlewareParam139 && middlewareParam139.__esModule
          ? middlewareParam139
          : {
              default: middlewareParam139,
            };
      };
    (Object.defineProperty(middlewareParam2, `__esModule`, {
      value: !0,
    }),
      (middlewareParam2.Facade = void 0));
    var middlewareValue39 = middlewareValue38(middlewareValue13()),
      middlewareValue40 = middlewareValue14(),
      middlewareValue41 = middlewareValue38(middlewareValue15()),
      _middlewareH = middlewareValue38(middlewareValue19()),
      middlewareValue42 = middlewareValue38(middlewareValue12()),
      middlewareValue43 = middlewareValue38(middlewareValue20());
    function middlewareHelper4(middlewareParam56, middlewareParam57) {
      ((middlewareParam57 ||= {}),
        (this.raw = middlewareValue40.clone(middlewareParam56)),
        `clone` in middlewareParam57 || (middlewareParam57.clone = !0),
        middlewareParam57.clone &&
          (middlewareParam56 = middlewareValue40.clone(middlewareParam56)),
        `traverse` in middlewareParam57 || (middlewareParam57.traverse = !0),
        `timestamp` in middlewareParam56
          ? (middlewareParam56.timestamp = _middlewareH.default(
              middlewareParam56.timestamp,
            ))
          : (middlewareParam56.timestamp = new Date()),
        middlewareParam57.traverse &&
          middlewareValue43.default(middlewareParam56),
        (this.opts = middlewareParam57),
        (this.obj = middlewareParam56));
    }
    middlewareParam2.Facade = middlewareHelper4;
    var _middlewareM = middlewareHelper4.prototype;
    ((_middlewareM.proxy = function (middlewareParam69) {
      var middlewareValue160 = middlewareParam69.split(`.`);
      middlewareParam69 = middlewareValue160.shift();
      var middlewareValue161 =
        this[middlewareParam69] || this.obj[middlewareParam69];
      return (
        middlewareValue161 &&
        (typeof middlewareValue161 == `function` &&
          (middlewareValue161 = middlewareValue161.call(this) || {}),
        middlewareValue160.length === 0 ||
          (middlewareValue161 = middlewareValue42.default(
            middlewareValue161,
            middlewareValue160.join(`.`),
          )),
        this.opts.clone
          ? middlewareHelper5(middlewareValue161)
          : middlewareValue161)
      );
    }),
      (_middlewareM.field = function (middlewareParam116) {
        var middlewareValue219 = this.obj[middlewareParam116];
        return this.opts.clone
          ? middlewareHelper5(middlewareValue219)
          : middlewareValue219;
      }),
      (middlewareHelper4.proxy = function (middlewareParam117) {
        return function () {
          return this.proxy(middlewareParam117);
        };
      }),
      (middlewareHelper4.field = function (middlewareParam118) {
        return function () {
          return this.field(middlewareParam118);
        };
      }),
      (middlewareHelper4.multi = function (middlewareParam78) {
        return function () {
          var middlewareValue190 = this.proxy(middlewareParam78 + `s`);
          if (Array.isArray(middlewareValue190)) return middlewareValue190;
          var middlewareValue191 = this.proxy(middlewareParam78);
          return (
            (middlewareValue191 &&= [
              this.opts.clone
                ? middlewareValue40.clone(middlewareValue191)
                : middlewareValue191,
            ]),
            middlewareValue191 || []
          );
        };
      }),
      (middlewareHelper4.one = function (middlewareParam91) {
        return function () {
          var middlewareValue199 = this.proxy(middlewareParam91);
          if (middlewareValue199) return middlewareValue199;
          var middlewareValue200 = this.proxy(middlewareParam91 + `s`);
          if (Array.isArray(middlewareValue200)) return middlewareValue200[0];
        };
      }),
      (_middlewareM.json = function () {
        var middlewareValue206 = this.opts.clone
          ? middlewareValue40.clone(this.obj)
          : this.obj;
        return (
          this.type && (middlewareValue206.type = this.type()),
          middlewareValue206
        );
      }),
      (_middlewareM.rawEvent = function () {
        return this.raw;
      }),
      (_middlewareM.options = function (middlewareParam52) {
        var middlewareValue124 = this.obj.options || this.obj.context || {},
          middlewareValue125 = this.opts.clone
            ? middlewareValue40.clone(middlewareValue124)
            : middlewareValue124;
        if (!middlewareParam52) return middlewareValue125;
        if (this.enabled(middlewareParam52)) {
          var middlewareValue126 = this.integrations(),
            __middlewareH =
              middlewareValue126[middlewareParam52] ||
              middlewareValue42.default(middlewareValue126, middlewareParam52);
          return (
            typeof __middlewareH != `object` &&
              (__middlewareH = middlewareValue42.default(
                this.options(),
                middlewareParam52,
              )),
            typeof __middlewareH == `object` ? __middlewareH : {}
          );
        }
      }),
      (_middlewareM.context = _middlewareM.options),
      (_middlewareM.enabled = function (middlewareParam38) {
        var middlewareValue106 = this.proxy(`options.providers.all`);
        (typeof middlewareValue106 != `boolean` &&
          (middlewareValue106 = this.proxy(`options.all`)),
          typeof middlewareValue106 != `boolean` &&
            (middlewareValue106 = this.proxy(`integrations.all`)),
          typeof middlewareValue106 != `boolean` && (middlewareValue106 = !0));
        var middlewareValue107 =
            middlewareValue106 && middlewareValue41.default(middlewareParam38),
          middlewareValue108 = this.integrations();
        if (
          (middlewareValue108.providers &&
            middlewareValue108.providers.hasOwnProperty(middlewareParam38) &&
            (middlewareValue107 =
              middlewareValue108.providers[middlewareParam38]),
          middlewareValue108.hasOwnProperty(middlewareParam38))
        ) {
          var __middlewareH = middlewareValue108[middlewareParam38];
          middlewareValue107 =
            typeof __middlewareH == `boolean` ? __middlewareH : !0;
        }
        return !!middlewareValue107;
      }),
      (_middlewareM.integrations = function () {
        return (
          this.obj.integrations ||
          this.proxy(`options.providers`) ||
          this.options()
        );
      }),
      (_middlewareM.active = function () {
        var middlewareValue218 = this.proxy(`options.active`);
        return ((middlewareValue218 ??= !0), middlewareValue218);
      }),
      (_middlewareM.anonymousId = function () {
        return this.field(`anonymousId`) || this.field(`sessionId`);
      }),
      (_middlewareM.sessionId = _middlewareM.anonymousId),
      (_middlewareM.groupId = middlewareHelper4.proxy(`options.groupId`)),
      (_middlewareM.traits = function (middlewareParam51) {
        var middlewareValue120 = this.proxy(`options.traits`) || {},
          middlewareValue121 = this.userId();
        for (var middlewareValue122 in ((middlewareParam51 ||= {}),
        middlewareValue121 && (middlewareValue120.id = middlewareValue121),
        middlewareParam51))
          if (
            Object.prototype.hasOwnProperty.call(
              middlewareParam51,
              middlewareValue122,
            )
          ) {
            var middlewareValue123 =
              this[middlewareValue122] == null
                ? this.proxy(`options.traits.` + middlewareValue122)
                : this[middlewareValue122]();
            if (middlewareValue123 == null) continue;
            ((middlewareValue120[middlewareParam51[middlewareValue122]] =
              middlewareValue123),
              delete middlewareValue120[middlewareValue122]);
          }
        return middlewareValue120;
      }),
      (_middlewareM.library = function () {
        var middlewareValue184 = this.proxy(`options.library`);
        return middlewareValue184
          ? typeof middlewareValue184 == `string`
            ? {
                name: middlewareValue184,
                version: null,
              }
            : middlewareValue184
          : {
              name: `unknown`,
              version: null,
            };
      }),
      (_middlewareM.device = function () {
        var middlewareValue154 = this.proxy(`context.device`);
        (typeof middlewareValue154 != `object` || !middlewareValue154) &&
          (middlewareValue154 = {});
        var middlewareValue155 = this.library().name;
        return middlewareValue154.type
          ? middlewareValue154
          : (middlewareValue155.indexOf(`ios`) > -1 &&
              (middlewareValue154.type = `ios`),
            middlewareValue155.indexOf(`android`) > -1 &&
              (middlewareValue154.type = `android`),
            middlewareValue154);
      }),
      (_middlewareM.userAgent = middlewareHelper4.proxy(`context.userAgent`)),
      (_middlewareM.timezone = middlewareHelper4.proxy(`context.timezone`)),
      (_middlewareM.timestamp = middlewareHelper4.field(`timestamp`)),
      (_middlewareM.channel = middlewareHelper4.field(`channel`)),
      (_middlewareM.ip = middlewareHelper4.proxy(`context.ip`)),
      (_middlewareM.userId = middlewareHelper4.field(`userId`)),
      middlewareValue39.default(_middlewareM));
    function middlewareHelper5(middlewareParam180) {
      return middlewareValue40.clone(middlewareParam180);
    }
  }),
  middlewareValue22 = chunkT((middlewareParam30, middlewareParam31) => {
    typeof Object.create == `function`
      ? (middlewareParam31.exports = function (
          middlewareParam67,
          middlewareParam68,
        ) {
          middlewareParam68 &&
            ((middlewareParam67.super_ = middlewareParam68),
            (middlewareParam67.prototype = Object.create(
              middlewareParam68.prototype,
              {
                constructor: {
                  value: middlewareParam67,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              },
            )));
        })
      : (middlewareParam31.exports = function (
          middlewareParam79,
          middlewareParam80,
        ) {
          if (middlewareParam80) {
            middlewareParam79.super_ = middlewareParam80;
            var middlewareValue172 = function () {};
            ((middlewareValue172.prototype = middlewareParam80.prototype),
              (middlewareParam79.prototype = new middlewareValue172()),
              (middlewareParam79.prototype.constructor = middlewareParam79));
          }
        });
  }),
  middlewareValue23 = chunkT((middlewareParam24) => {
    var middlewareValue86 =
      (middlewareParam24 && middlewareParam24.__importDefault) ||
      function (middlewareParam140) {
        return middlewareParam140 && middlewareParam140.__esModule
          ? middlewareParam140
          : {
              default: middlewareParam140,
            };
      };
    (Object.defineProperty(middlewareParam24, `__esModule`, {
      value: !0,
    }),
      (middlewareParam24.Alias = void 0));
    var middlewareValue87 = middlewareValue86(middlewareValue22()),
      middlewareValue88 = middlewareValue21();
    function middlewareHelper22(middlewareParam162, middlewareParam163) {
      middlewareValue88.Facade.call(
        this,
        middlewareParam162,
        middlewareParam163,
      );
    }
    ((middlewareParam24.Alias = middlewareHelper22),
      middlewareValue87.default(middlewareHelper22, middlewareValue88.Facade),
      (middlewareHelper22.prototype.action = function () {
        return `alias`;
      }),
      (middlewareHelper22.prototype.type = middlewareHelper22.prototype.action),
      (middlewareHelper22.prototype.previousId = function () {
        return this.field(`previousId`) || this.field(`from`);
      }),
      (middlewareHelper22.prototype.from =
        middlewareHelper22.prototype.previousId),
      (middlewareHelper22.prototype.userId = function () {
        return this.field(`userId`) || this.field(`to`);
      }),
      (middlewareHelper22.prototype.to = middlewareHelper22.prototype.userId));
  }),
  middlewareValue24 = chunkT((middlewareParam98) => {
    Object.defineProperty(middlewareParam98, `__esModule`, {
      value: !0,
    });
    var middlewareValue201 = /.+\@.+\..+/;
    function middlewareHelper36(middlewareParam181) {
      return middlewareValue201.test(middlewareParam181);
    }
    middlewareParam98.default = middlewareHelper36;
  }),
  middlewareValue25 = chunkT((middlewareParam6) => {
    var middlewareValue62 =
      (middlewareParam6 && middlewareParam6.__importDefault) ||
      function (middlewareParam141) {
        return middlewareParam141 && middlewareParam141.__esModule
          ? middlewareParam141
          : {
              default: middlewareParam141,
            };
      };
    (Object.defineProperty(middlewareParam6, `__esModule`, {
      value: !0,
    }),
      (middlewareParam6.Group = void 0));
    var middlewareValue63 = middlewareValue62(middlewareValue22()),
      middlewareValue64 = middlewareValue62(middlewareValue24()),
      middlewareValue65 = middlewareValue62(middlewareValue19()),
      _middlewareH = middlewareValue21();
    function middlewareHelper9(middlewareParam164, middlewareParam165) {
      _middlewareH.Facade.call(this, middlewareParam164, middlewareParam165);
    }
    ((middlewareParam6.Group = middlewareHelper9),
      middlewareValue63.default(middlewareHelper9, _middlewareH.Facade));
    var middlewareValue66 = middlewareHelper9.prototype;
    ((middlewareValue66.action = function () {
      return `group`;
    }),
      (middlewareValue66.type = middlewareValue66.action),
      (middlewareValue66.groupId = _middlewareH.Facade.field(`groupId`)),
      (middlewareValue66.created = function () {
        var middlewareValue171 =
          this.proxy(`traits.createdAt`) ||
          this.proxy(`traits.created`) ||
          this.proxy(`properties.createdAt`) ||
          this.proxy(`properties.created`);
        if (middlewareValue171)
          return middlewareValue65.default(middlewareValue171);
      }),
      (middlewareValue66.email = function () {
        var middlewareValue202 = this.proxy(`traits.email`);
        if (middlewareValue202) return middlewareValue202;
        var middlewareValue203 = this.groupId();
        if (middlewareValue64.default(middlewareValue203))
          return middlewareValue203;
      }),
      (middlewareValue66.traits = function (middlewareParam58) {
        var middlewareValue142 = this.properties(),
          middlewareValue143 = this.groupId();
        for (var middlewareValue144 in ((middlewareParam58 ||= {}),
        middlewareValue143 && (middlewareValue142.id = middlewareValue143),
        middlewareParam58))
          if (
            Object.prototype.hasOwnProperty.call(
              middlewareParam58,
              middlewareValue144,
            )
          ) {
            var middlewareValue145 =
              this[middlewareValue144] == null
                ? this.proxy(`traits.` + middlewareValue144)
                : this[middlewareValue144]();
            if (middlewareValue145 == null) continue;
            ((middlewareValue142[middlewareParam58[middlewareValue144]] =
              middlewareValue145),
              delete middlewareValue142[middlewareValue144]);
          }
        return middlewareValue142;
      }),
      (middlewareValue66.name = _middlewareH.Facade.proxy(`traits.name`)),
      (middlewareValue66.industry =
        _middlewareH.Facade.proxy(`traits.industry`)),
      (middlewareValue66.employees =
        _middlewareH.Facade.proxy(`traits.employees`)),
      (middlewareValue66.properties = function () {
        return this.field(`traits`) || this.field(`properties`) || {};
      }));
  }),
  middlewareValue26 = chunkT((middlewareParam3) => {
    var middlewareValue44 =
      (middlewareParam3 && middlewareParam3.__importDefault) ||
      function (middlewareParam142) {
        return middlewareParam142 && middlewareParam142.__esModule
          ? middlewareParam142
          : {
              default: middlewareParam142,
            };
      };
    (Object.defineProperty(middlewareParam3, `__esModule`, {
      value: !0,
    }),
      (middlewareParam3.Identify = void 0));
    var middlewareValue45 = middlewareValue21(),
      middlewareValue46 = middlewareValue44(middlewareValue12()),
      middlewareValue47 = middlewareValue44(middlewareValue22()),
      _middlewareH = middlewareValue44(middlewareValue24()),
      middlewareValue48 = middlewareValue44(middlewareValue19()),
      middlewareValue49 = function (middlewareParam179) {
        return middlewareParam179.trim();
      };
    function middlewareHelper6(middlewareParam166, middlewareParam167) {
      middlewareValue45.Facade.call(
        this,
        middlewareParam166,
        middlewareParam167,
      );
    }
    ((middlewareParam3.Identify = middlewareHelper6),
      middlewareValue47.default(middlewareHelper6, middlewareValue45.Facade));
    var _middlewareM = middlewareHelper6.prototype;
    ((_middlewareM.action = function () {
      return `identify`;
    }),
      (_middlewareM.type = _middlewareM.action),
      (_middlewareM.traits = function (middlewareParam66) {
        var middlewareValue156 = this.field(`traits`) || {},
          middlewareValue157 = this.userId();
        for (var middlewareValue158 in ((middlewareParam66 ||= {}),
        middlewareValue157 && (middlewareValue156.id = middlewareValue157),
        middlewareParam66)) {
          var middlewareValue159 =
            this[middlewareValue158] == null
              ? this.proxy(`traits.` + middlewareValue158)
              : this[middlewareValue158]();
          middlewareValue159 != null &&
            ((middlewareValue156[middlewareParam66[middlewareValue158]] =
              middlewareValue159),
            middlewareValue158 !== middlewareParam66[middlewareValue158] &&
              delete middlewareValue156[middlewareValue158]);
        }
        return middlewareValue156;
      }),
      (_middlewareM.email = function () {
        var middlewareValue204 = this.proxy(`traits.email`);
        if (middlewareValue204) return middlewareValue204;
        var middlewareValue205 = this.userId();
        if (_middlewareH.default(middlewareValue205)) return middlewareValue205;
      }),
      (_middlewareM.created = function () {
        var middlewareValue207 =
          this.proxy(`traits.created`) || this.proxy(`traits.createdAt`);
        if (middlewareValue207)
          return middlewareValue48.default(middlewareValue207);
      }),
      (_middlewareM.companyCreated = function () {
        var middlewareValue197 =
          this.proxy(`traits.company.created`) ||
          this.proxy(`traits.company.createdAt`);
        if (middlewareValue197)
          return middlewareValue48.default(middlewareValue197);
      }),
      (_middlewareM.companyName = function () {
        return this.proxy(`traits.company.name`);
      }),
      (_middlewareM.name = function () {
        var middlewareValue187 = this.proxy(`traits.name`);
        if (typeof middlewareValue187 == `string`)
          return middlewareValue49(middlewareValue187);
        var middlewareValue188 = this.firstName(),
          middlewareValue189 = this.lastName();
        if (middlewareValue188 && middlewareValue189)
          return middlewareValue49(
            middlewareValue188 + ` ` + middlewareValue189,
          );
      }),
      (_middlewareM.firstName = function () {
        var middlewareValue185 = this.proxy(`traits.firstName`);
        if (typeof middlewareValue185 == `string`)
          return middlewareValue49(middlewareValue185);
        var middlewareValue186 = this.proxy(`traits.name`);
        if (typeof middlewareValue186 == `string`)
          return middlewareValue49(middlewareValue186).split(` `)[0];
      }),
      (_middlewareM.lastName = function () {
        var middlewareValue162 = this.proxy(`traits.lastName`);
        if (typeof middlewareValue162 == `string`)
          return middlewareValue49(middlewareValue162);
        var middlewareValue163 = this.proxy(`traits.name`);
        if (typeof middlewareValue163 == `string`) {
          var middlewareValue164 =
            middlewareValue49(middlewareValue163).indexOf(` `);
          if (middlewareValue164 !== -1)
            return middlewareValue49(
              middlewareValue163.substr(middlewareValue164 + 1),
            );
        }
      }),
      (_middlewareM.uid = function () {
        return this.userId() || this.username() || this.email();
      }),
      (_middlewareM.description = function () {
        return (
          this.proxy(`traits.description`) || this.proxy(`traits.background`)
        );
      }),
      (_middlewareM.age = function () {
        var middlewareValue182 = this.birthday(),
          middlewareValue183 = middlewareValue46.default(this.traits(), `age`);
        if (middlewareValue183 != null) return middlewareValue183;
        if (middlewareValue182 instanceof Date)
          return new Date().getFullYear() - middlewareValue182.getFullYear();
      }),
      (_middlewareM.avatar = function () {
        var middlewareValue196 = this.traits();
        return (
          middlewareValue46.default(middlewareValue196, `avatar`) ||
          middlewareValue46.default(middlewareValue196, `photoUrl`) ||
          middlewareValue46.default(middlewareValue196, `avatarUrl`)
        );
      }),
      (_middlewareM.position = function () {
        var middlewareValue214 = this.traits();
        return (
          middlewareValue46.default(middlewareValue214, `position`) ||
          middlewareValue46.default(middlewareValue214, `jobTitle`)
        );
      }),
      (_middlewareM.username =
        middlewareValue45.Facade.proxy(`traits.username`)),
      (_middlewareM.website = middlewareValue45.Facade.one(`traits.website`)),
      (_middlewareM.websites =
        middlewareValue45.Facade.multi(`traits.website`)),
      (_middlewareM.phone = middlewareValue45.Facade.one(`traits.phone`)),
      (_middlewareM.phones = middlewareValue45.Facade.multi(`traits.phone`)),
      (_middlewareM.address = middlewareValue45.Facade.proxy(`traits.address`)),
      (_middlewareM.gender = middlewareValue45.Facade.proxy(`traits.gender`)),
      (_middlewareM.birthday =
        middlewareValue45.Facade.proxy(`traits.birthday`)));
  }),
  middlewareValue27 = chunkT((middlewareParam1) => {
    var middlewareValue32 =
      (middlewareParam1 && middlewareParam1.__importDefault) ||
      function (middlewareParam143) {
        return middlewareParam143 && middlewareParam143.__esModule
          ? middlewareParam143
          : {
              default: middlewareParam143,
            };
      };
    (Object.defineProperty(middlewareParam1, `__esModule`, {
      value: !0,
    }),
      (middlewareParam1.Track = void 0));
    var middlewareValue33 = middlewareValue32(middlewareValue22()),
      middlewareValue34 = middlewareValue21(),
      middlewareValue35 = middlewareValue26(),
      _middlewareH = middlewareValue32(middlewareValue24()),
      middlewareValue36 = middlewareValue32(middlewareValue12());
    function middlewareHelper3(middlewareParam168, middlewareParam169) {
      middlewareValue34.Facade.call(
        this,
        middlewareParam168,
        middlewareParam169,
      );
    }
    ((middlewareParam1.Track = middlewareHelper3),
      middlewareValue33.default(middlewareHelper3, middlewareValue34.Facade));
    var middlewareValue37 = middlewareHelper3.prototype;
    ((middlewareValue37.action = function () {
      return `track`;
    }),
      (middlewareValue37.type = middlewareValue37.action),
      (middlewareValue37.event = middlewareValue34.Facade.field(`event`)),
      (middlewareValue37.value =
        middlewareValue34.Facade.proxy(`properties.value`)),
      (middlewareValue37.category =
        middlewareValue34.Facade.proxy(`properties.category`)),
      (middlewareValue37.id = middlewareValue34.Facade.proxy(`properties.id`)),
      (middlewareValue37.productId = function () {
        return (
          this.proxy(`properties.product_id`) ||
          this.proxy(`properties.productId`)
        );
      }),
      (middlewareValue37.promotionId = function () {
        return (
          this.proxy(`properties.promotion_id`) ||
          this.proxy(`properties.promotionId`)
        );
      }),
      (middlewareValue37.cartId = function () {
        return (
          this.proxy(`properties.cart_id`) || this.proxy(`properties.cartId`)
        );
      }),
      (middlewareValue37.checkoutId = function () {
        return (
          this.proxy(`properties.checkout_id`) ||
          this.proxy(`properties.checkoutId`)
        );
      }),
      (middlewareValue37.paymentId = function () {
        return (
          this.proxy(`properties.payment_id`) ||
          this.proxy(`properties.paymentId`)
        );
      }),
      (middlewareValue37.couponId = function () {
        return (
          this.proxy(`properties.coupon_id`) ||
          this.proxy(`properties.couponId`)
        );
      }),
      (middlewareValue37.wishlistId = function () {
        return (
          this.proxy(`properties.wishlist_id`) ||
          this.proxy(`properties.wishlistId`)
        );
      }),
      (middlewareValue37.reviewId = function () {
        return (
          this.proxy(`properties.review_id`) ||
          this.proxy(`properties.reviewId`)
        );
      }),
      (middlewareValue37.orderId = function () {
        return (
          this.proxy(`properties.id`) ||
          this.proxy(`properties.order_id`) ||
          this.proxy(`properties.orderId`)
        );
      }),
      (middlewareValue37.sku =
        middlewareValue34.Facade.proxy(`properties.sku`)),
      (middlewareValue37.tax =
        middlewareValue34.Facade.proxy(`properties.tax`)),
      (middlewareValue37.name =
        middlewareValue34.Facade.proxy(`properties.name`)),
      (middlewareValue37.price =
        middlewareValue34.Facade.proxy(`properties.price`)),
      (middlewareValue37.total =
        middlewareValue34.Facade.proxy(`properties.total`)),
      (middlewareValue37.repeat =
        middlewareValue34.Facade.proxy(`properties.repeat`)),
      (middlewareValue37.coupon =
        middlewareValue34.Facade.proxy(`properties.coupon`)),
      (middlewareValue37.shipping =
        middlewareValue34.Facade.proxy(`properties.shipping`)),
      (middlewareValue37.discount =
        middlewareValue34.Facade.proxy(`properties.discount`)),
      (middlewareValue37.shippingMethod = function () {
        return (
          this.proxy(`properties.shipping_method`) ||
          this.proxy(`properties.shippingMethod`)
        );
      }),
      (middlewareValue37.paymentMethod = function () {
        return (
          this.proxy(`properties.payment_method`) ||
          this.proxy(`properties.paymentMethod`)
        );
      }),
      (middlewareValue37.description = middlewareValue34.Facade.proxy(
        `properties.description`,
      )),
      (middlewareValue37.plan =
        middlewareValue34.Facade.proxy(`properties.plan`)),
      (middlewareValue37.subtotal = function () {
        var middlewareValue127 = middlewareValue36.default(
            this.properties(),
            `subtotal`,
          ),
          middlewareValue128 = this.total() || this.revenue();
        if (middlewareValue127) return middlewareValue127;
        if (!middlewareValue128) return 0;
        if (this.total()) {
          var middlewareValue129 = this.tax();
          (middlewareValue129 && (middlewareValue128 -= middlewareValue129),
            (middlewareValue129 = this.shipping()),
            middlewareValue129 && (middlewareValue128 -= middlewareValue129),
            (middlewareValue129 = this.discount()),
            middlewareValue129 && (middlewareValue128 += middlewareValue129));
        }
        return middlewareValue128;
      }),
      (middlewareValue37.products = function () {
        var middlewareValue180 = this.properties(),
          middlewareValue181 = middlewareValue36.default(
            middlewareValue180,
            `products`,
          );
        return Array.isArray(middlewareValue181)
          ? middlewareValue181.filter(function (item) {
              return item !== null;
            })
          : [];
      }),
      (middlewareValue37.quantity = function () {
        return (this.obj.properties || {}).quantity || 1;
      }),
      (middlewareValue37.currency = function () {
        return (this.obj.properties || {}).currency || `USD`;
      }),
      (middlewareValue37.referrer = function () {
        return (
          this.proxy(`context.referrer.url`) ||
          this.proxy(`context.page.referrer`) ||
          this.proxy(`properties.referrer`)
        );
      }),
      (middlewareValue37.query =
        middlewareValue34.Facade.proxy(`options.query`)),
      (middlewareValue37.properties = function (middlewareParam60) {
        var middlewareValue146 = this.field(`properties`) || {};
        for (var middlewareValue147 in ((middlewareParam60 ||= {}),
        middlewareParam60))
          if (
            Object.prototype.hasOwnProperty.call(
              middlewareParam60,
              middlewareValue147,
            )
          ) {
            var middlewareValue148 =
              this[middlewareValue147] == null
                ? this.proxy(`properties.` + middlewareValue147)
                : this[middlewareValue147]();
            if (middlewareValue148 == null) continue;
            ((middlewareValue146[middlewareParam60[middlewareValue147]] =
              middlewareValue148),
              delete middlewareValue146[middlewareValue147]);
          }
        return middlewareValue146;
      }),
      (middlewareValue37.username = function () {
        return (
          this.proxy(`traits.username`) ||
          this.proxy(`properties.username`) ||
          this.userId() ||
          this.sessionId()
        );
      }),
      (middlewareValue37.email = function () {
        var middlewareValue165 =
          this.proxy(`traits.email`) ||
          this.proxy(`properties.email`) ||
          this.proxy(`options.traits.email`);
        if (middlewareValue165) return middlewareValue165;
        var middlewareValue166 = this.userId();
        if (_middlewareH.default(middlewareValue166)) return middlewareValue166;
      }),
      (middlewareValue37.revenue = function () {
        var middlewareValue149 = this.proxy(`properties.revenue`),
          middlewareValue150 = this.event();
        return (
          !middlewareValue149 &&
            middlewareValue150 &&
            middlewareValue150.match(
              /^[ _]?completed[ _]?order[ _]?|^[ _]?order[ _]?completed[ _]?$/i,
            ) &&
            (middlewareValue149 = this.proxy(`properties.total`)),
          _middlewareM(middlewareValue149)
        );
      }),
      (middlewareValue37.cents = function () {
        var middlewareValue215 = this.revenue();
        return typeof middlewareValue215 == `number`
          ? middlewareValue215 * 100
          : this.value() || 0;
      }),
      (middlewareValue37.identify = function () {
        var middlewareValue211 = this.json();
        return (
          (middlewareValue211.traits = this.traits()),
          new middlewareValue35.Identify(middlewareValue211, this.opts)
        );
      }));
    function _middlewareM(middlewareParam90) {
      if (
        middlewareParam90 &&
        (typeof middlewareParam90 == `number` ||
          (typeof middlewareParam90 == `string` &&
            ((middlewareParam90 = middlewareParam90.replace(/\$/g, ``)),
            (middlewareParam90 = parseFloat(middlewareParam90)),
            !isNaN(middlewareParam90))))
      )
        return middlewareParam90;
    }
  }),
  middlewareValue28 = chunkT((middlewareParam4) => {
    var middlewareValue50 =
      (middlewareParam4 && middlewareParam4.__importDefault) ||
      function (middlewareParam144) {
        return middlewareParam144 && middlewareParam144.__esModule
          ? middlewareParam144
          : {
              default: middlewareParam144,
            };
      };
    (Object.defineProperty(middlewareParam4, `__esModule`, {
      value: !0,
    }),
      (middlewareParam4.Page = void 0));
    var middlewareValue51 = middlewareValue50(middlewareValue22()),
      middlewareValue52 = middlewareValue21(),
      middlewareValue53 = middlewareValue27(),
      _middlewareH = middlewareValue50(middlewareValue24());
    function middlewareHelper7(middlewareParam170, middlewareParam171) {
      middlewareValue52.Facade.call(
        this,
        middlewareParam170,
        middlewareParam171,
      );
    }
    ((middlewareParam4.Page = middlewareHelper7),
      middlewareValue51.default(middlewareHelper7, middlewareValue52.Facade));
    var middlewareValue54 = middlewareHelper7.prototype;
    ((middlewareValue54.action = function () {
      return `page`;
    }),
      (middlewareValue54.type = middlewareValue54.action),
      (middlewareValue54.category = middlewareValue52.Facade.field(`category`)),
      (middlewareValue54.name = middlewareValue52.Facade.field(`name`)),
      (middlewareValue54.title =
        middlewareValue52.Facade.proxy(`properties.title`)),
      (middlewareValue54.path =
        middlewareValue52.Facade.proxy(`properties.path`)),
      (middlewareValue54.url =
        middlewareValue52.Facade.proxy(`properties.url`)),
      (middlewareValue54.referrer = function () {
        return (
          this.proxy(`context.referrer.url`) ||
          this.proxy(`context.page.referrer`) ||
          this.proxy(`properties.referrer`)
        );
      }),
      (middlewareValue54.properties = function (middlewareParam42) {
        var middlewareValue110 = this.field(`properties`) || {},
          middlewareValue111 = this.category(),
          middlewareValue112 = this.name();
        for (var middlewareValue113 in ((middlewareParam42 ||= {}),
        middlewareValue111 &&
          (middlewareValue110.category = middlewareValue111),
        middlewareValue112 && (middlewareValue110.name = middlewareValue112),
        middlewareParam42))
          if (
            Object.prototype.hasOwnProperty.call(
              middlewareParam42,
              middlewareValue113,
            )
          ) {
            var __middlewareH =
              this[middlewareValue113] == null
                ? this.proxy(`properties.` + middlewareValue113)
                : this[middlewareValue113]();
            if (__middlewareH == null) continue;
            ((middlewareValue110[middlewareParam42[middlewareValue113]] =
              __middlewareH),
              middlewareValue113 !== middlewareParam42[middlewareValue113] &&
                delete middlewareValue110[middlewareValue113]);
          }
        return middlewareValue110;
      }),
      (middlewareValue54.email = function () {
        var middlewareValue192 =
          this.proxy(`context.traits.email`) || this.proxy(`properties.email`);
        if (middlewareValue192) return middlewareValue192;
        var middlewareValue193 = this.userId();
        if (_middlewareH.default(middlewareValue193)) return middlewareValue193;
      }),
      (middlewareValue54.fullName = function () {
        var middlewareValue212 = this.category(),
          middlewareValue213 = this.name();
        return middlewareValue213 && middlewareValue212
          ? middlewareValue212 + ` ` + middlewareValue213
          : middlewareValue213;
      }),
      (middlewareValue54.event = function (middlewareParam122) {
        return middlewareParam122
          ? `Viewed ` + middlewareParam122 + ` Page`
          : `Loaded a Page`;
      }),
      (middlewareValue54.track = function (middlewareParam84) {
        var middlewareValue173 = this.json();
        return (
          (middlewareValue173.event = this.event(middlewareParam84)),
          (middlewareValue173.timestamp = this.timestamp()),
          (middlewareValue173.properties = this.properties()),
          new middlewareValue53.Track(middlewareValue173, this.opts)
        );
      }));
  }),
  middlewareValue29 = chunkT((middlewareParam20) => {
    var middlewareValue81 =
      (middlewareParam20 && middlewareParam20.__importDefault) ||
      function (middlewareParam145) {
        return middlewareParam145 && middlewareParam145.__esModule
          ? middlewareParam145
          : {
              default: middlewareParam145,
            };
      };
    (Object.defineProperty(middlewareParam20, `__esModule`, {
      value: !0,
    }),
      (middlewareParam20.Screen = void 0));
    var middlewareValue82 = middlewareValue81(middlewareValue22()),
      middlewareValue83 = middlewareValue28(),
      middlewareValue84 = middlewareValue27();
    function _middlewareH(middlewareParam176, middlewareParam177) {
      middlewareValue83.Page.call(this, middlewareParam176, middlewareParam177);
    }
    ((middlewareParam20.Screen = _middlewareH),
      middlewareValue82.default(_middlewareH, middlewareValue83.Page),
      (_middlewareH.prototype.action = function () {
        return `screen`;
      }),
      (_middlewareH.prototype.type = _middlewareH.prototype.action),
      (_middlewareH.prototype.event = function (middlewareParam121) {
        return middlewareParam121
          ? `Viewed ` + middlewareParam121 + ` Screen`
          : `Loaded a Screen`;
      }),
      (_middlewareH.prototype.track = function (middlewareParam85) {
        var middlewareValue174 = this.json();
        return (
          (middlewareValue174.event = this.event(middlewareParam85)),
          (middlewareValue174.timestamp = this.timestamp()),
          (middlewareValue174.properties = this.properties()),
          new middlewareValue84.Track(middlewareValue174, this.opts)
        );
      }));
  }),
  middlewareValue30 = chunkT((middlewareParam44) => {
    var middlewareValue116 =
      (middlewareParam44 && middlewareParam44.__importDefault) ||
      function (middlewareParam146) {
        return middlewareParam146 && middlewareParam146.__esModule
          ? middlewareParam146
          : {
              default: middlewareParam146,
            };
      };
    (Object.defineProperty(middlewareParam44, `__esModule`, {
      value: !0,
    }),
      (middlewareParam44.Delete = void 0));
    var middlewareValue117 = middlewareValue116(middlewareValue22()),
      middlewareValue118 = middlewareValue21();
    function middlewareHelper30(middlewareParam172, middlewareParam173) {
      middlewareValue118.Facade.call(
        this,
        middlewareParam172,
        middlewareParam173,
      );
    }
    ((middlewareParam44.Delete = middlewareHelper30),
      middlewareValue117.default(middlewareHelper30, middlewareValue118.Facade),
      (middlewareHelper30.prototype.type = function () {
        return `delete`;
      }));
  }),
  middlewareI = chunkT((middlewareParam5) => {
    var middlewareValue55 =
      (middlewareParam5 && middlewareParam5.__assign) ||
      function () {
        return (
          (middlewareValue55 =
            Object.assign ||
            function (middlewareParam77) {
              for (
                var middlewareValue167,
                  middlewareValue168 = 1,
                  middlewareValue169 = arguments.length;
                middlewareValue168 < middlewareValue169;
                middlewareValue168++
              )
                for (var middlewareValue170 in ((middlewareValue167 =
                  arguments[middlewareValue168]),
                middlewareValue167))
                  Object.prototype.hasOwnProperty.call(
                    middlewareValue167,
                    middlewareValue170,
                  ) &&
                    (middlewareParam77[middlewareValue170] =
                      middlewareValue167[middlewareValue170]);
              return middlewareParam77;
            }),
          middlewareValue55.apply(this, arguments)
        );
      };
    (Object.defineProperty(middlewareParam5, `__esModule`, {
      value: !0,
    }),
      (middlewareParam5.Delete =
        middlewareParam5.Screen =
        middlewareParam5.Page =
        middlewareParam5.Track =
        middlewareParam5.Identify =
        middlewareParam5.Group =
        middlewareParam5.Alias =
        middlewareParam5.Facade =
          void 0));
    var middlewareValue56 = middlewareValue21();
    Object.defineProperty(middlewareParam5, `Facade`, {
      enumerable: !0,
      get: function () {
        return middlewareValue56.Facade;
      },
    });
    var middlewareValue57 = middlewareValue23();
    Object.defineProperty(middlewareParam5, `Alias`, {
      enumerable: !0,
      get: function () {
        return middlewareValue57.Alias;
      },
    });
    var middlewareValue58 = middlewareValue25();
    Object.defineProperty(middlewareParam5, `Group`, {
      enumerable: !0,
      get: function () {
        return middlewareValue58.Group;
      },
    });
    var _middlewareH = middlewareValue26();
    Object.defineProperty(middlewareParam5, `Identify`, {
      enumerable: !0,
      get: function () {
        return _middlewareH.Identify;
      },
    });
    var middlewareValue59 = middlewareValue27();
    Object.defineProperty(middlewareParam5, `Track`, {
      enumerable: !0,
      get: function () {
        return middlewareValue59.Track;
      },
    });
    var middlewareValue60 = middlewareValue28();
    Object.defineProperty(middlewareParam5, `Page`, {
      enumerable: !0,
      get: function () {
        return middlewareValue60.Page;
      },
    });
    var middlewareValue61 = middlewareValue29();
    Object.defineProperty(middlewareParam5, `Screen`, {
      enumerable: !0,
      get: function () {
        return middlewareValue61.Screen;
      },
    });
    var _middlewareM = middlewareValue30();
    (Object.defineProperty(middlewareParam5, `Delete`, {
      enumerable: !0,
      get: function () {
        return _middlewareM.Delete;
      },
    }),
      (middlewareParam5.default = middlewareValue55(
        middlewareValue55({}, middlewareValue56.Facade),
        {
          Alias: middlewareValue57.Alias,
          Group: middlewareValue58.Group,
          Identify: _middlewareH.Identify,
          Track: middlewareValue59.Track,
          Page: middlewareValue60.Page,
          Screen: middlewareValue61.Screen,
          Delete: _middlewareM.Delete,
        },
      )));
  }),
  middlewareValue31 = middlewareI();
export const middlewareA = (function (middlewareParam86) {
  middlewareImport3(middlewareHelper33, middlewareParam86);
  function middlewareHelper33(middlewareParam149, middlewareParam150) {
    return (
      middlewareParam86.call(
        this,
        middlewareParam149,
        middlewareParam150,
        new middlewareO(),
      ) || this
    );
  }
  return (
    (middlewareHelper33.system = function () {
      return new this({
        type: `track`,
        event: `system`,
      });
    }),
    middlewareHelper33
  );
})(middlewareP);
function middlewareR(middlewareParam45, middlewareParam46) {
  var middlewareValue119 = new middlewareValue31.Facade(
    middlewareParam45,
    middlewareParam46,
  );
  return (
    middlewareParam45.type === `track` &&
      (middlewareValue119 = new middlewareValue31.Track(
        middlewareParam45,
        middlewareParam46,
      )),
    middlewareParam45.type === `identify` &&
      (middlewareValue119 = new middlewareValue31.Identify(
        middlewareParam45,
        middlewareParam46,
      )),
    middlewareParam45.type === `page` &&
      (middlewareValue119 = new middlewareValue31.Page(
        middlewareParam45,
        middlewareParam46,
      )),
    middlewareParam45.type === `alias` &&
      (middlewareValue119 = new middlewareValue31.Alias(
        middlewareParam45,
        middlewareParam46,
      )),
    middlewareParam45.type === `group` &&
      (middlewareValue119 = new middlewareValue31.Group(
        middlewareParam45,
        middlewareParam46,
      )),
    middlewareParam45.type === `screen` &&
      (middlewareValue119 = new middlewareValue31.Screen(
        middlewareParam45,
        middlewareParam46,
      )),
    Object.defineProperty(middlewareValue119, `obj`, {
      value: middlewareParam45,
      writable: !0,
    }),
    middlewareValue119
  );
}
export function middlewareT(middlewareParam9, middlewareParam10, _middlewareH) {
  return middlewareImport2(this, void 0, void 0, function () {
    function middlewareHelper11(middlewareParam18, __middlewareH) {
      return middlewareImport2(this, void 0, void 0, function () {
        var middlewareValue78, middlewareValue79, middlewareValue80;
        return middlewareImport1(this, function (middlewareParam21) {
          switch (middlewareParam21.label) {
            case 0:
              return (
                (middlewareValue78 = !1),
                (middlewareValue79 = null),
                [
                  4,
                  __middlewareH({
                    payload: middlewareR(middlewareParam18, {
                      clone: !0,
                      traverse: !1,
                    }),
                    integration: middlewareParam9,
                    next: function (middlewareParam112) {
                      ((middlewareValue78 = !0),
                        middlewareParam112 === null &&
                          (middlewareValue79 = null),
                        middlewareParam112 &&
                          (middlewareValue79 = middlewareParam112.obj));
                    },
                  }),
                ]
              );
            case 1:
              return (
                middlewareParam21.sent(),
                !middlewareValue78 &&
                  middlewareValue79 !== null &&
                  ((middlewareValue79 = middlewareValue79),
                  (middlewareValue79.integrations = middlewareImport4(
                    middlewareImport4({}, middlewareParam18.integrations),
                    ((middlewareValue80 = {}),
                    (middlewareValue80[middlewareParam9] = !1),
                    middlewareValue80),
                  ))),
                [2, middlewareValue79]
              );
          }
        });
      });
    }
    var middlewareValue71,
      middlewareValue72,
      _middlewareM,
      middlewareValue73,
      middlewareValue74;
    return middlewareImport1(this, function (middlewareParam41) {
      switch (middlewareParam41.label) {
        case 0:
          ((middlewareValue71 = middlewareR(middlewareParam10, {
            clone: !0,
            traverse: !1,
          }).rawEvent()),
            (middlewareValue72 = 0),
            (_middlewareM = _middlewareH),
            (middlewareParam41.label = 1));
        case 1:
          return middlewareValue72 < _middlewareM.length
            ? ((middlewareValue73 = _middlewareM[middlewareValue72]),
              [4, middlewareHelper11(middlewareValue71, middlewareValue73)])
            : [3, 4];
        case 2:
          if (
            ((middlewareValue74 = middlewareParam41.sent()),
            middlewareValue74 === null)
          )
            return [2, null];
          ((middlewareValue71 = middlewareValue74),
            (middlewareParam41.label = 3));
        case 3:
          return (middlewareValue72++, [3, 1]);
        case 4:
          return [2, middlewareValue71];
      }
    });
  });
}
export function middlewareN(middlewareParam15, middlewareParam16) {
  function middlewareHelper18(middlewareParam23) {
    return middlewareImport2(this, void 0, void 0, function () {
      var middlewareValue90;
      return middlewareImport1(this, function (middlewareParam29) {
        switch (middlewareParam29.label) {
          case 0:
            return (
              (middlewareValue90 = !1),
              [
                4,
                middlewareParam15({
                  payload: middlewareR(middlewareParam23.event, {
                    clone: !0,
                    traverse: !1,
                  }),
                  integrations: middlewareParam16 ?? {},
                  next: function (middlewareParam119) {
                    ((middlewareValue90 = !0),
                      middlewareParam119 &&
                        (middlewareParam23.event = middlewareParam119.obj));
                  },
                }),
              ]
            );
          case 1:
            if ((middlewareParam29.sent(), !middlewareValue90))
              throw new middlewareF({
                retry: !1,
                type: `middleware_cancellation`,
                reason: "Middleware `next` function skipped",
              });
            return [2, middlewareParam23];
        }
      });
    });
  }
  return {
    name: `Source Middleware ${middlewareParam15.name}`,
    type: `before`,
    version: `0.1.0`,
    isLoaded: function () {
      return !0;
    },
    load: function (middlewareParam178) {
      return Promise.resolve(middlewareParam178);
    },
    track: middlewareHelper18,
    page: middlewareHelper18,
    screen: middlewareHelper18,
    identify: middlewareHelper18,
    alias: middlewareHelper18,
    group: middlewareHelper18,
  };
}
export {
  middlewareC,
  middlewareD,
  middlewareF,
  middlewareH,
  middlewareI,
  middlewareL,
  middlewareM,
  middlewareO,
  middlewareP,
  middlewareR,
  middlewareS,
  middlewareU,
};

// Aliases used by consumer checkpoints
export declare const middlewareN: any;
export declare const middlewareT: any;
