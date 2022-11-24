/*
@license
  Expanse by Archetype Themes (https://archetypethemes.co)
  Access unminified JS in assets/theme.js

  Use this event listener to run your own JS outside of this file.
  Documentation - https://archetypethemes.co/blogs/expanse/javascript-events-for-developers

  document.addEventListener('page:loaded', function() {
    // Page has loaded and theme assets are ready
  });
*/
(window.theme = window.theme || {}),
  (window.Shopify = window.Shopify || {}),
  (theme.config = {
    bpSmall: !1,
    hasSessionStorage: !0,
    hasLocalStorage: !0,
    mediaQuerySmall: "screen and (max-width: 769px)",
    youTubeReady: !1,
    vimeoReady: !1,
    vimeoLoading: !1,
    isTouch: !!(
      "ontouchstart" in window ||
      (window.DocumentTouch && window.document instanceof DocumentTouch) ||
      window.navigator.maxTouchPoints ||
      window.navigator.msMaxTouchPoints
    ),
    stickyHeader: !1,
    rtl: "rtl" == document.documentElement.getAttribute("dir")
  }),
  (theme.recentlyViewedIds = []),
  theme.config.isTouch && (document.documentElement.className += " supports-touch"),
  (window.lazySizesConfig = window.lazySizesConfig || {}),
  (lazySizesConfig.expFactor = 4),
  (function () {
    "use strict";
    var e, t, i, n, o, s, a, r;
    if (
      ((theme.delegate = {
        on: function (e, t, i) {
          return (
            this.namespaces || (this.namespaces = {}),
            (this.namespaces[e] = t),
            (i = i || !1),
            this.addEventListener(e.split(".")[0], t, i),
            this
          );
        },
        off: function (e) {
          if (this.namespaces)
            return this.removeEventListener(e.split(".")[0], this.namespaces[e]), delete this.namespaces[e], this;
        }
      }),
      (window.on = Element.prototype.on = theme.delegate.on),
      (window.off = Element.prototype.off = theme.delegate.off),
      (theme.utils = {
        defaultTo: function (e, t) {
          return null == e || e != e ? t : e;
        },
        wrap: function (e, t) {
          e.parentNode.insertBefore(t, e), t.appendChild(e);
        },
        debounce: function (e, t, i) {
          var n;
          return function () {
            var o = this,
              s = arguments,
              a = function () {
                (n = null), i || t.apply(o, s);
              },
              r = i && !n;
            clearTimeout(n), (n = setTimeout(a, e)), r && t.apply(o, s);
          };
        },
        throttle: function (e, t) {
          var i = !1;
          return function () {
            i ||
              (t.apply(this, arguments),
              (i = !0),
              setTimeout(function () {
                i = !1;
              }, e));
          };
        },
        prepareTransition: function (e, t) {
          e.addEventListener("transitionend", function t(i) {
            e.classList.remove("is-transitioning"), e.removeEventListener("transitionend", t);
          }),
            e.classList.add("is-transitioning"),
            e.offsetWidth,
            "function" == typeof t && t();
        },
        compact: function (e) {
          for (var t = -1, i = null == e ? 0 : e.length, n = 0, o = []; ++t < i; ) {
            var s = e[t];
            s && (o[n++] = s);
          }
          return o;
        },
        serialize: function (e) {
          var t = [];
          return (
            Array.prototype.slice.call(e.elements).forEach(function (e) {
              !e.name ||
                e.disabled ||
                ["file", "reset", "submit", "button"].indexOf(e.type) > -1 ||
                ("select-multiple" !== e.type
                  ? (["checkbox", "radio"].indexOf(e.type) > -1 && !e.checked) ||
                    t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
                  : Array.prototype.slice.call(e.options).forEach(function (i) {
                      i.selected && t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(i.value));
                    }));
            }),
            t.join("&")
          );
        }
      }),
      (theme.a11y = {
        trapFocus: function (e) {
          var t = {
              focusin: e.namespace ? "focusin." + e.namespace : "focusin",
              focusout: e.namespace ? "focusout." + e.namespace : "focusout",
              keydown: e.namespace ? "keydown." + e.namespace : "keydown.handleFocus"
            },
            i = e.container.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
            ),
            n = [].slice.call(i).filter((e) => null !== e.offsetParent),
            o = n[0],
            s = n[n.length - 1];
          e.elementToFocus || (e.elementToFocus = e.container),
            e.container.setAttribute("tabindex", "-1"),
            e.elementToFocus.focus(),
            document.documentElement.off("focusin"),
            document.documentElement.on(t.focusout, function () {
              document.documentElement.off(t.keydown);
            }),
            document.documentElement.on(t.focusin, function (e) {
              (e.target !== s && e.target !== o) ||
                document.documentElement.on(t.keydown, function (e) {
                  !(function (e) {
                    if (9 !== e.keyCode) return;
                    e.target === o && e.shiftKey && (e.preventDefault(), s.focus());
                  })(e);
                });
            });
        },
        removeTrapFocus: function (e) {
          var t = e.namespace ? "focusin." + e.namespace : "focusin";
          e.container && e.container.removeAttribute("tabindex"), document.documentElement.off(t);
        },
        lockMobileScrolling: function (e, t) {
          var i = t || document.documentElement;
          document.documentElement.classList.add("lock-scroll"),
            i.on("touchmove" + e, function () {
              return !0;
            });
        },
        unlockMobileScrolling: function (e, t) {
          document.documentElement.classList.remove("lock-scroll"),
            (t || document.documentElement).off("touchmove" + e);
        }
      }),
      document.documentElement.on("keyup.tab", function (e) {
        9 === e.keyCode &&
          (document.documentElement.classList.add("tab-outline"), document.documentElement.off("keyup.tab"));
      }),
      (theme.Currency =
        ((e = theme && theme.settings && theme.settings.superScriptPrice),
        {
          formatMoney: function (t, i) {
            i || (i = theme.settings.moneyFormat), "string" == typeof t && (t = t.replace(".", ""));
            var n = "",
              o = /\{\{\s*(\w+)\s*\}\}/,
              s = i || "${{amount}}";
            function a(e, t, i, n) {
              if (
                ((t = theme.utils.defaultTo(t, 2)),
                (i = theme.utils.defaultTo(i, ",")),
                (n = theme.utils.defaultTo(n, ".")),
                isNaN(e) || null == e)
              )
                return 0;
              var o = (e = (e / 100).toFixed(t)).split(".");
              return o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i) + (o[1] ? n + o[1] : "");
            }
            switch (s.match(o)[1]) {
              case "amount":
                (n = a(t, 2)), e && n && n.includes(".") && (n = n.replace(".", "<sup>") + "</sup>");
                break;
              case "amount_no_decimals":
                n = a(t, 0);
                break;
              case "amount_with_comma_separator":
                (n = a(t, 2, ".", ",")), e && n && n.includes(".") && (n = n.replace(",", "<sup>") + "</sup>");
                break;
              case "amount_no_decimals_with_comma_separator":
                n = a(t, 0, ".", ",");
                break;
              case "amount_no_decimals_with_space_separator":
                n = a(t, 0, " ");
            }
            return s.replace(o, n);
          },
          getBaseUnit: function (e) {
            if (e && e.unit_price_measurement && e.unit_price_measurement.reference_value)
              return 1 === e.unit_price_measurement.reference_value
                ? e.unit_price_measurement.reference_unit
                : e.unit_price_measurement.reference_value + e.unit_price_measurement.reference_unit;
          }
        })),
      (theme.Images = {
        imageSize: function (e) {
          if (!e) return "620x";
          var t = e.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
          return null !== t ? t[1] : null;
        },
        getSizedImageUrl: function (e, t) {
          if (!e) return e;
          if (null == t) return e;
          if ("master" === t) return this.removeProtocol(e);
          var i = e.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
          if (null != i) {
            var n = e.split(i[0]),
              o = i[0];
            return this.removeProtocol(n[0] + "_" + t + o);
          }
          return null;
        },
        removeProtocol: function (e) {
          return e.replace(/http(s)?:/, "");
        },
        lazyloadImagePath: function (e) {
          var t;
          return null !== e && (t = e.replace(/(\.[^.]*)$/, "_{width}x$1")), t;
        }
      }),
      (theme.loadImageSection = function (e) {
        function t() {
          e.classList.remove("loading", "loading--delayed"), e.classList.add("loaded");
        }
        function i() {
          return e.querySelector(".lazyloaded");
        }
        if (e.querySelector("svg")) t();
        else if (i()) t();
        else
          var n = setInterval(function () {
            i() && (clearInterval(n), t());
          }, 50);
      }),
      (theme.initWhenVisible = function (e) {
        var t = e.threshold ? e.threshold : 0;
        new IntersectionObserver(
          (t, i) => {
            t.forEach((t) => {
              t.isIntersecting && "function" == typeof e.callback && (e.callback(), i.unobserve(t.target));
            });
          },
          { rootMargin: "0px 0px " + t + "px 0px" }
        ).observe(e.element);
      }),
      (theme.LibraryLoader =
        ((n = "requested"),
        (o = "loaded"),
        (a = {
          youtubeSdk: {
            tagId: "youtube-sdk",
            src: "https://www.youtube.com/iframe_api",
            type: (i = "script")
          },
          vimeo: {
            tagId: "vimeo-api",
            src: "https://player.vimeo.com/api/player.js",
            type: i
          },
          shopifyXr: {
            tagId: "shopify-model-viewer-xr",
            src: (s = "https://cdn.shopify.com/shopifycloud/") + "shopify-xr-js/assets/v1.0/shopify-xr.en.js",
            type: i
          },
          modelViewerUi: {
            tagId: "shopify-model-viewer-ui",
            src: s + "model-viewer-ui/assets/v1.0/model-viewer-ui.en.js",
            type: i
          },
          modelViewerUiStyles: {
            tagId: "shopify-model-viewer-ui-styles",
            src: s + "model-viewer-ui/assets/v1.0/model-viewer-ui.css",
            type: (t = "link")
          }
        }),
        {
          load: function (e, s) {
            var r = a[e];
            if (r && r.status !== n)
              if (((s = s || function () {}), r.status !== o)) {
                var c;
                switch (((r.status = n), r.type)) {
                  case i:
                    c = (function (e, t) {
                      var i = document.createElement("script");
                      return (
                        (i.src = e.src),
                        i.addEventListener("load", function () {
                          (e.status = o), t();
                        }),
                        i
                      );
                    })(r, s);
                    break;
                  case t:
                    c = (function (e, t) {
                      var i = document.createElement("link");
                      return (
                        (i.href = e.src),
                        (i.rel = "stylesheet"),
                        (i.type = "text/css"),
                        i.addEventListener("load", function () {
                          (e.status = o), t();
                        }),
                        i
                      );
                    })(r, s);
                }
                (c.id = r.tagId), (r.element = c);
                var d = document.getElementsByTagName(r.type)[0];
                d.parentNode.insertBefore(c, d);
              } else s();
          }
        })),
      (theme.rteInit = function () {
        function e(e) {
          e.src = e.src;
          var t = document.createElement("div");
          t.classList.add("video-wrapper"), theme.utils.wrap(e, t);
        }
        document.querySelectorAll(".rte table").forEach((e) => {
          var t = document.createElement("div");
          t.classList.add("table-wrapper"), theme.utils.wrap(e, t);
        }),
          document.querySelectorAll('.rte iframe[src*="youtube.com/embed"]').forEach((t) => {
            e(t);
          }),
          document.querySelectorAll('.rte iframe[src*="player.vimeo"]').forEach((t) => {
            e(t);
          }),
          document.querySelectorAll(".rte a img").forEach((e) => {
            e.parentNode.classList.add("rte__image");
          });
      }),
      (theme.Sections = function () {
        (this.constructors = {}),
          (this.instances = []),
          document.addEventListener("shopify:section:load", this._onSectionLoad.bind(this)),
          document.addEventListener("shopify:section:unload", this._onSectionUnload.bind(this)),
          document.addEventListener("shopify:section:select", this._onSelect.bind(this)),
          document.addEventListener("shopify:section:deselect", this._onDeselect.bind(this)),
          document.addEventListener("shopify:block:select", this._onBlockSelect.bind(this)),
          document.addEventListener("shopify:block:deselect", this._onBlockDeselect.bind(this));
      }),
      (theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
        _createInstance: function (e, t, i) {
          var n = e.getAttribute("data-section-id"),
            o = e.getAttribute("data-section-type");
          if (void 0 !== (t = t || this.constructors[o])) {
            if (i) this._findInstance(n) && this._removeInstance(n);
            var s = Object.assign(new t(e), { id: n, type: o, container: e });
            this.instances.push(s);
          }
        },
        _findInstance: function (e) {
          for (var t = 0; t < this.instances.length; t++) if (this.instances[t].id === e) return this.instances[t];
        },
        _removeInstance: function (e) {
          for (var t, i = this.instances.length; i--; )
            if (this.instances[i].id === e) {
              (t = this.instances[i]), this.instances.splice(i, 1);
              break;
            }
          return t;
        },
        _onSectionLoad: function (e, t, i) {
          window.AOS && AOS.refreshHard(), theme && theme.initGlobals && theme.initGlobals();
          var n = t || e.target,
            o = t || e.target.querySelector("[data-section-id]");
          if (o) {
            this._createInstance(o);
            var s = t ? i : this._findInstance(e.detail.sectionId);
            n.querySelectorAll("[data-subsection]").length && this.loadSubSections(n),
              s && "function" == typeof s.onLoad && s.onLoad(e),
              setTimeout(function () {
                window.dispatchEvent(new Event("scroll"));
              }, 200);
          }
        },
        _onSectionUnload: function (e) {
          this.instances = this.instances.filter(function (t) {
            var i = t.id === e.detail.sectionId;
            return i && "function" == typeof t.onUnload && t.onUnload(e), !i;
          });
        },
        loadSubSections: function (e) {
          (e ? e.querySelectorAll("[data-subsection]") : document.querySelectorAll("[data-subsection]")).forEach(
            (e) => {
              this._onSectionLoad(null, e, e.dataset.sectionId);
            }
          ),
            window.AOS && AOS.refreshHard();
        },
        _onSelect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onSelect && t.onSelect(e);
        },
        _onDeselect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onDeselect && t.onDeselect(e);
        },
        _onBlockSelect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onBlockSelect && t.onBlockSelect(e);
        },
        _onBlockDeselect: function (e) {
          var t = this._findInstance(e.detail.sectionId);
          void 0 !== t && "function" == typeof t.onBlockDeselect && t.onBlockDeselect(e);
        },
        register: function (e, t, i) {
          this.constructors[e] = t;
          var n = document.querySelectorAll('[data-section-type="' + e + '"]');
          i && (n = i.querySelectorAll('[data-section-type="' + e + '"]')),
            n.forEach(
              function (e) {
                this._createInstance(e, t, i);
              }.bind(this)
            );
        },
        reinit: function (e) {
          for (var t = 0; t < this.instances.length; t++) {
            var i = this.instances[t];
            i.type === e && "function" == typeof i.forceReload && i.forceReload();
          }
        }
      })),
      (theme.Variants = (function () {
        function e(e) {
          (this.container = e.container),
            (this.variants = e.variants),
            (this.singleOptionSelector = e.singleOptionSelector),
            (this.originalSelectorId = e.originalSelectorId),
            (this.enableHistoryState = e.enableHistoryState),
            (this.currentVariant = this._getVariantFromOptions()),
            this.container.querySelectorAll(this.singleOptionSelector).forEach((e) => {
              e.addEventListener("change", this._onSelectChange.bind(this));
            });
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            _getCurrentOptions: function () {
              var e = [];
              return (
                this.container.querySelectorAll(this.singleOptionSelector).forEach((t) => {
                  var i = t.getAttribute("type");
                  "radio" === i || "checkbox" === i
                    ? t.checked && e.push({ value: t.value, index: t.dataset.index })
                    : e.push({ value: t.value, index: t.dataset.index });
                }),
                (e = theme.utils.compact(e))
              );
            },
            _getVariantFromOptions: function () {
              var e = this._getCurrentOptions(),
                t = this.variants,
                i = !1;
              return (
                t.forEach(function (t) {
                  var n = !0;
                  t.options;
                  e.forEach(function (e) {
                    n && (n = t[e.index] === e.value);
                  }),
                    n && (i = t);
                }),
                i || null
              );
            },
            _onSelectChange: function () {
              var e = this._getVariantFromOptions();

              this.container.dispatchEvent(new CustomEvent("variantChange", { detail: { variant: e } })),
                document.dispatchEvent(new CustomEvent("variant:change", { detail: { variant: e } })),
                e &&
                  (this._updateMasterSelect(e),
                  this._updateImages(e),
                  this._updatePrice(e),
                  this._updateUnitPrice(e),
                  this._updateSKU(e),
                  (this.currentVariant = e),
                  this.enableHistoryState && this._updateHistoryState(e));
            },
            _updateImages: function (e) {
              if (!this.currentVariant) {
                return;
              }
              var t = e.featured_image || {},
                i = this.currentVariant?.featured_image || {};
              e.featured_image &&
                t.src !== i.src &&
                this.container.dispatchEvent(
                  new CustomEvent("variantImageChange", {
                    detail: { variant: e }
                  })
                );
            },
            _updatePrice: function (e) {
              (e.price === this.currentVariant?.price &&
                e.compare_at_price === this.currentVariant?.compare_at_price) ||
                this.container.dispatchEvent(
                  new CustomEvent("variantPriceChange", {
                    detail: { variant: e }
                  })
                );
            },
            _updateUnitPrice: function (e) {
              e.unit_price !== this.currentVariant?.unit_price &&
                this.container.dispatchEvent(
                  new CustomEvent("variantUnitPriceChange", {
                    detail: { variant: e }
                  })
                );
            },
            _updateSKU: function (e) {
              e.sku !== this.currentVariant?.sku &&
                this.container.dispatchEvent(
                  new CustomEvent("variantSKUChange", {
                    detail: { variant: e }
                  })
                );
            },
            _updateHistoryState: function (e) {
              if (history.replaceState && e) {
                var t =
                  window.location.protocol +
                  "//" +
                  window.location.host +
                  window.location.pathname +
                  "?variant=" +
                  e.id;
                window.history.replaceState({ path: t }, "", t);
              }
            },
            _updateMasterSelect: function (e) {
              this.container.querySelector(this.originalSelectorId).value = e.id;
            }
          })),
          e
        );
      })()),
      (window.vimeoApiReady = function () {
        var e, t;
        (theme.config.vimeoLoading = !0),
          new Promise((i, n) => {
            (e = setInterval(function () {
              Vimeo && (clearInterval(e), clearTimeout(t), i());
            }, 500)),
              (t = setTimeout(function () {
                clearInterval(e), n();
              }, 4e3));
          }).then(function () {
            (theme.config.vimeoReady = !0),
              (theme.config.vimeoLoading = !1),
              document.dispatchEvent(new CustomEvent("vimeoReady"));
          });
      }),
      (theme.VimeoPlayer = (function () {
        var e = "loading",
          t = "loaded",
          i = "video-interactable",
          n = {
            background: !0,
            byline: !1,
            controls: !1,
            loop: !0,
            muted: !0,
            playsinline: !0,
            portrait: !1,
            title: !1
          };
        function o(e, t, i) {
          (this.divId = e),
            (this.el = document.getElementById(e)),
            (this.videoId = t),
            (this.iframe = null),
            (this.options = i),
            this.options && this.options.videoParent && (this.parent = this.el.closest(this.options.videoParent)),
            this.setAsLoading(),
            theme.config.vimeoReady
              ? this.init()
              : (theme.LibraryLoader.load("vimeo", window.vimeoApiReady),
                document.addEventListener("vimeoReady", this.init.bind(this)));
        }
        return (
          (o.prototype = Object.assign({}, o.prototype, {
            init: function () {
              var e = n;
              (e.id = this.videoId),
                (this.videoPlayer = new Vimeo.Player(this.el, e)),
                this.videoPlayer.ready().then(this.playerReady.bind(this));
            },
            playerReady: function () {
              (this.iframe = this.el.querySelector("iframe")),
                this.iframe.setAttribute("tabindex", "-1"),
                this.videoPlayer.setMuted(!0),
                this.setAsLoaded(),
                new IntersectionObserver(
                  (e, t) => {
                    e.forEach((e) => {
                      e.isIntersecting ? this.play() : this.pause();
                    });
                  },
                  { rootMargin: "0px 0px 50px 0px" }
                ).observe(this.iframe);
            },
            setAsLoading: function () {
              this.parent && this.parent.classList.add(e);
            },
            setAsLoaded: function () {
              this.parent &&
                (this.parent.classList.remove(e),
                this.parent.classList.add(t),
                Shopify && Shopify.designMode && window.AOS && AOS.refreshHard());
            },
            enableInteraction: function () {
              this.parent && this.parent.classList.add(i);
            },
            play: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.play && this.videoPlayer.play();
            },
            pause: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.pause && this.videoPlayer.pause();
            },
            destroy: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.destroy && this.videoPlayer.destroy();
            }
          })),
          o
        );
      })()),
      (window.onYouTubeIframeAPIReady = function () {
        (theme.config.youTubeReady = !0), document.dispatchEvent(new CustomEvent("youTubeReady"));
      }),
      (theme.YouTube = (function () {
        var e = "loading",
          t = "loaded",
          i = "video-interactable",
          n = {
            width: 1280,
            height: 720,
            playerVars: {
              autohide: 0,
              autoplay: 1,
              cc_load_policy: 0,
              controls: 0,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              rel: 0
            }
          };
        function o(e, t) {
          (this.divId = e),
            (this.iframe = null),
            (this.attemptedToPlay = !1),
            (n.events = {
              onReady: this.onVideoPlayerReady.bind(this),
              onStateChange: this.onVideoStateChange.bind(this)
            }),
            (this.options = Object.assign({}, n, t)),
            this.options &&
              (this.options.videoParent &&
                (this.parent = document.getElementById(this.divId).closest(this.options.videoParent)),
              this.options.autoplay || (this.options.playerVars.autoplay = this.options.autoplay),
              "sound" === this.options.style &&
                ((this.options.playerVars.controls = 1), (this.options.playerVars.autoplay = 0))),
            this.setAsLoading(),
            theme.config.youTubeReady
              ? this.init()
              : (theme.LibraryLoader.load("youtubeSdk"),
                document.addEventListener("youTubeReady", this.init.bind(this)));
        }
        return (
          (o.prototype = Object.assign({}, o.prototype, {
            init: function () {
              this.videoPlayer = new YT.Player(this.divId, this.options);
            },
            onVideoPlayerReady: function (e) {
              (this.iframe = document.getElementById(this.divId)),
                this.iframe.setAttribute("tabindex", "-1"),
                "sound" !== this.options.style && e.target.mute(),
                new IntersectionObserver(
                  (e, t) => {
                    e.forEach((e) => {
                      e.isIntersecting ? this.play() : this.pause();
                    });
                  },
                  { rootMargin: "0px 0px 50px 0px" }
                ).observe(this.iframe);
            },
            onVideoStateChange: function (e) {
              switch (e.data) {
                case -1:
                  this.attemptedToPlay && (this.setAsLoaded(), this.enableInteraction());
                  break;
                case 0:
                  this.play(e);
                  break;
                case 1:
                  this.setAsLoaded();
                  break;
                case 3:
                  this.attemptedToPlay = !0;
              }
            },
            setAsLoading: function () {
              this.parent && this.parent.classList.add(e);
            },
            setAsLoaded: function () {
              this.parent &&
                (this.parent.classList.remove(e),
                this.parent.classList.add(t),
                Shopify && Shopify.designMode && window.AOS && AOS.refreshHard());
            },
            enableInteraction: function () {
              this.parent && this.parent.classList.add(i);
            },
            play: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.playVideo && this.videoPlayer.playVideo();
            },
            pause: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.pauseVideo && this.videoPlayer.pauseVideo();
            },
            destroy: function () {
              this.videoPlayer && "function" == typeof this.videoPlayer.destroy && this.videoPlayer.destroy();
            }
          })),
          o
        );
      })()),
      (theme.cart = {
        getCart: function () {
          var e = "".concat(theme.routes.cart, "?t=").concat(Date.now());
          return fetch(e, { credentials: "same-origin", method: "GET" }).then((e) => e.json());
        },
        getCartProductMarkup: function () {
          var e = "".concat(theme.routes.cartPage, "?t=").concat(Date.now());
          return (
            (e = -1 === e.indexOf("?") ? e + "?view=ajax" : e + "&view=ajax"),
            fetch(e, { credentials: "same-origin", method: "GET" }).then(function (e) {
              return e.text();
            })
          );
        },
        changeItem: function (e, t) {
          return this._updateCart({
            url: "".concat(theme.routes.cartChange, "?t=").concat(Date.now()),
            data: JSON.stringify({ id: e, quantity: t })
          });
        },
        _updateCart: function (e) {
          return fetch(e.url, {
            method: "POST",
            body: e.data,
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            }
          })
            .then((e) => e.json())
            .then(function (e) {
              var cartContents = fetch(window.Shopify.routes.root + "cart.js")
                .then((response) => response.json())
                .then((res) => {
                  var total_amount = res.total_price / 100;
                  total_amount = total_amount.toFixed(2);
                  var gifted_item = $.grep(res.items, function (n) {
                    return n.variant_id == parseInt(gift_product_id);
                  });
                  if (total_amount >= parseInt(unlock_gift_amount)) {
                    $(".cart-message-content").addClass("hide");
                    $(".cart__scrollable").addClass("product-offered");
                    $(".shipping-fee-content").addClass("offer-red");
                    $(".shipping-fee-content").removeClass("shipping-black");
                    $(".progress-bar-wh").css("width", "100%");
                    $(".shipping-fee-content").html("OFFERTS");
                  } else if (total_amount < parseInt(unlock_gift_amount)) {
                    $(".cart-unlock-gift-amount").html((parseInt(unlock_gift_amount) - total_amount).toFixed(2));
                    var progressBarWidth = (total_amount * 100) / parseInt(unlock_gift_amount);
                    $(".progress-bar-wh").css("width", progressBarWidth + "%");
                    $(".shipping-fee-content").removeClass("offer-red");
                    $(".shipping-fee-content").addClass("shipping-black");
                    $(".shipping-fee-content").html("Calculés à l’étape de paiement");
                    $(".cart-message-content").removeClass("hide");
                    $(".cart__scrollable").removeClass("product-offered");
                  }

                  if (total_amount == 0) {
                    $(".cart-message").addClass("hide");
                  } else {
                    $(".cart-message").removeClass("hide");
                  }

                  if (
                    total_amount >= parseInt(unlock_gift_amount) &&
                    (gifted_item === undefined || gifted_item.length == 0)
                  ) {
                    let formData = {
                      items: [
                        {
                          quantity: 1,
                          id: parseInt(gift_product_id)
                        }
                      ]
                    };
                    fetch(window.Shopify.routes.root + "cart/add.js", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(formData)
                    })
                      .then((response) => {
                        document.dispatchEvent(new CustomEvent("ajaxProduct:added", {}));
                        return e;
                      })
                      .catch((error) => {
                        document.dispatchEvent(new CustomEvent("ajaxProduct:added", {}));
                        return e;
                        console.error("Error:", error);
                      });
                  } else if (
                    total_amount < parseInt(unlock_gift_amount) &&
                    gifted_item != undefined &&
                    gifted_item.length != 0
                  ) {
                    var q = {
                      type: "POST",
                      url: "/cart/change.js",
                      data: {
                        id: parseInt(gift_product_id),
                        quantity: 0
                      },
                      dataType: "json",
                      success: function (res) {
                        document.dispatchEvent(new CustomEvent("ajaxProduct:added", {}));
                        return e;
                      },
                      error: function (t, a) {
                        document.dispatchEvent(new CustomEvent("ajaxProduct:added", {}));
                        return e;
                      }
                    };
                    jQuery.ajax(q);
                  } else {
                    document.dispatchEvent(new CustomEvent("ajaxProduct:added", {}));
                    return e;
                  }
                });
            });
        },

        updateAttribute: function (e, t) {
          return this._updateCart({
            url: "/cart/update.js",
            data: JSON.stringify({
              attributes: { [e]: theme.cart.attributeToString(t) }
            })
          });
        },
        updateNote: function (e) {
          return this._updateCart({
            url: "/cart/update.js",
            data: JSON.stringify({ note: theme.cart.attributeToString(e) })
          });
        },
        attributeToString: function (e) {
          return "string" != typeof e && "undefined" === (e += "") && (e = ""), e.trim();
        }
      }),
      (theme.CartForm = (function () {
        var e = "[data-products]",
          t = ".js-qty__wrapper",
          i = "[data-discounts]",
          n = "[data-savings]",
          o = "[data-subtotal]",
          s = ".cart-link__bubble",
          a = '[name="note"]',
          r = ".cart__terms-checkbox",
          c = ".cart__checkout",
          d = "btn--loading",
          l = { requiresTerms: !1 };
        function h(t) {
          t &&
            ((this.form = t),
            (this.wrapper = t.parentNode),
            (this.location = t.dataset.location),
            (this.namespace = ".cart-" + this.location),
            (this.products = t.querySelector(e)),
            (this.submitBtn = t.querySelector(c)),
            (this.discounts = t.querySelector(i)),
            (this.savings = t.querySelector(n)),
            (this.subtotal = t.querySelector(o)),
            (this.termsCheckbox = t.querySelector(r)),
            (this.noteInput = t.querySelector(a)),
            this.termsCheckbox && (l.requiresTerms = !0),
            this.init());
        }
        return (
          (h.prototype = Object.assign({}, h.prototype, {
            init: function () {
              this.initQtySelectors(),
                document.addEventListener("cart:quantity" + this.namespace, this.quantityChanged.bind(this)),
                this.form.on("submit" + this.namespace, this.onSubmit.bind(this)),
                this.noteInput &&
                  this.noteInput.addEventListener("change", function () {
                    var e = this.value;
                    theme.cart.updateNote(e);
                  }),
                document.addEventListener(
                  "cart:build",
                  function () {
                    this.buildCart();
                  }.bind(this)
                );
            },
            reInit: function () {
              this.initQtySelectors();
            },
            onSubmit: function (e) {
              if ((this.submitBtn.classList.add(d), l.requiresTerms && !this.termsCheckbox.checked))
                return (
                  alert(theme.strings.cartTermsConfirmation), this.submitBtn.classList.remove(d), e.preventDefault(), !1
                );
            },
            _parseProductHTML: function (e) {
              var t = new DOMParser().parseFromString(e, "text/html");
              return {
                items: t.querySelector(".cart__items"),
                discounts: t.querySelector(".cart__discounts")
              };
            },
            buildCart: function () {
              theme.cart.getCartProductMarkup().then(this.cartMarkup.bind(this));
            },
            cartMarkup: function (e) {
              var t = this._parseProductHTML(e),
                i = t.items,
                n = parseInt(i.dataset.count),
                o = i.dataset.cartSubtotal,
                s = i.dataset.cartSavings;
              this.updateCartDiscounts(t.discounts),
                this.updateSavings(s),
                n > 0 ? this.wrapper.classList.remove("is-empty") : this.wrapper.classList.add("is-empty"),
                this.updateCount(n),
                (this.products.innerHTML = ""),
                this.products.append(i),
                (this.subtotal.innerHTML = theme.Currency.formatMoney(o, theme.settings.moneyFormat)),
                this.reInit(),
                window.AOS && AOS.refreshHard(),
                Shopify && Shopify.StorefrontExpressButtons && Shopify.StorefrontExpressButtons.initialize();
            },
            updateCartDiscounts: function (e) {
              this.discounts && ((this.discounts.innerHTML = ""), this.discounts.append(e));
            },
            initQtySelectors: function () {
              this.form.querySelectorAll(t).forEach((e) => {
                new theme.QtySelector(e, {
                  namespace: this.namespace,
                  isCart: !0
                });
              });
            },
            quantityChanged: function (e) {
              var t = e.detail[0],
                i = e.detail[1],
                n = e.detail[2];
              t &&
                i &&
                (n && n.classList.add("is-loading"),
                theme.cart
                  .changeItem(t, i)
                  .then(
                    function (e) {
                      e.item_count > 0
                        ? this.wrapper.classList.remove("is-empty")
                        : this.wrapper.classList.add("is-empty"),
                        this.buildCart(),
                        document.dispatchEvent(
                          new CustomEvent("cart:updated", {
                            detail: { cart: e }
                          })
                        );
                    }.bind(this)
                  )
                  .catch(function (e) {}));
            },
            updateSubtotal: function (e) {
              this.form.querySelector(o).innerHTML = theme.Currency.formatMoney(e, theme.settings.moneyFormat);
            },
            updateSavings: function (e) {
              if (this.savings)
                if (e > 0) {
                  var t = theme.Currency.formatMoney(e, theme.settings.moneyFormat);
                  this.savings.classList.remove("hide"),
                    (this.savings.innerHTML = theme.strings.cartSavings.replace("[savings]", t));
                } else this.savings.classList.add("hide");
            },
            updateCount: function (e) {
              var t = document.querySelectorAll(".cart-link__bubble-num");
              t.length &&
                t.forEach((t) => {
                  t.innerText = e;
                });
              var i = document.querySelectorAll(s);
              i.length &&
                (e > 0
                  ? i.forEach((e) => {
                      e.classList.add("cart-link__bubble--visible");
                    })
                  : i.forEach((e) => {
                      e.classList.remove("cart-link__bubble--visible");
                    }));
            }
          })),
          h
        );
      })()),
      (theme.collapsibles = (function () {
        var e = ".collapsible-trigger",
          t = ".collapsible-content",
          i = ".collapsible-content__inner",
          n = ".collapsible-trigger--tab",
          o = "hide",
          s = "is-open",
          a = "collapsible--auto-height",
          r = "collapsible-trigger--tab",
          c = !1;
        function d(e) {
          if (!c) {
            c = !0;
            var o = e.currentTarget,
              d = o.classList.contains(s),
              h = o.classList.contains(r),
              u = o.getAttribute("aria-controls"),
              m = document.getElementById(u);
            if ((u || (u = o.dataset.controls), u)) {
              if (!m)
                document.querySelectorAll('[data-id="' + u + '"]').length > 0 &&
                  (m = o.parentNode.querySelector('[data-id="' + u + '"]'));
              if (m) {
                var p = m.querySelector(i).offsetHeight,
                  f = m.classList.contains(a),
                  v = m.parentNode.closest(t),
                  g = p;
                if (h) {
                  if (d) return void (c = !1);
                  document.querySelectorAll(n + '[data-id="' + o.dataset.id + '"]').forEach((e) => {
                    e.classList.remove(s), l(document.querySelector("#" + e.getAttribute("aria-controls")), 0, !0);
                  });
                }
                if (
                  (d &&
                    f &&
                    setTimeout(function () {
                      l(m, (p = 0), d, f);
                    }, 0),
                  d && !f && (p = 0),
                  o.setAttribute("aria-expanded", !d),
                  d ? o.classList.remove(s) : o.classList.add(s),
                  l(m, p, d, f),
                  v)
                )
                  l(v, d ? v.offsetHeight - g : p + v.offsetHeight, !1, !1);
                if (window.SPR) {
                  var y = m.querySelector(".spr-summary-actions-newreview");
                  if (!y) return;
                  y.off("click.collapsible"),
                    y.on("click.collapsible", function () {
                      (p = m.querySelector(i).offsetHeight), l(m, p, d, f);
                    });
                }
              } else c = !1;
            }
          }
        }
        function l(e, t, i, n) {
          if (
            (e.classList.remove(o),
            theme.utils.prepareTransition(e, function () {
              (e.style.height = t + "px"), i ? e.classList.remove(s) : e.classList.add(s);
            }),
            !i && n)
          ) {
            var a = e;
            window.setTimeout(function () {
              a.css("height", "auto"), (c = !1);
            }, 500);
          } else c = !1;
        }
        return {
          init: function (t) {
            (t || document).querySelectorAll(e).forEach((e) => {
              var t = e.classList.contains(s);
              e.setAttribute("aria-expanded", t), e.off("click.collapsible"), e.on("click.collapsible", d);
            });
          }
        };
      })()),
      (theme.Disclosure = (function () {
        var e = "[data-disclosure-form]",
          t = "[data-disclosure-list]",
          i = "[data-disclosure-toggle]",
          n = "[data-disclosure-input]",
          o = "[data-disclosure-option]",
          s = "disclosure-list--visible";
        function a(e) {
          (this.container = e), this._cacheSelectors(), this._setupListeners();
        }
        return (
          (a.prototype = Object.assign({}, a.prototype, {
            _cacheSelectors: function () {
              this.cache = {
                disclosureForm: this.container.closest(e),
                disclosureList: this.container.querySelector(t),
                disclosureToggle: this.container.querySelector(i),
                disclosureInput: this.container.querySelector(n),
                disclosureOptions: this.container.querySelectorAll(o)
              };
            },
            _setupListeners: function () {
              (this.eventHandlers = this._setupEventHandlers()),
                this.cache.disclosureToggle.addEventListener("click", this.eventHandlers.toggleList),
                this.cache.disclosureOptions.forEach(function (e) {
                  e.addEventListener("click", this.eventHandlers.connectOptions);
                }, this),
                this.container.addEventListener("keyup", this.eventHandlers.onDisclosureKeyUp),
                this.cache.disclosureList.addEventListener("focusout", this.eventHandlers.onDisclosureListFocusOut),
                this.cache.disclosureToggle.addEventListener("focusout", this.eventHandlers.onDisclosureToggleFocusOut),
                document.body.addEventListener("click", this.eventHandlers.onBodyClick);
            },
            _setupEventHandlers: function () {
              return {
                connectOptions: this._connectOptions.bind(this),
                toggleList: this._toggleList.bind(this),
                onBodyClick: this._onBodyClick.bind(this),
                onDisclosureKeyUp: this._onDisclosureKeyUp.bind(this),
                onDisclosureListFocusOut: this._onDisclosureListFocusOut.bind(this),
                onDisclosureToggleFocusOut: this._onDisclosureToggleFocusOut.bind(this)
              };
            },
            _connectOptions: function (e) {
              e.preventDefault(), this._submitForm(e.currentTarget.dataset.value);
            },
            _onDisclosureToggleFocusOut: function (e) {
              !1 === this.container.contains(e.relatedTarget) && this._hideList();
            },
            _onDisclosureListFocusOut: function (e) {
              var t = e.currentTarget.contains(e.relatedTarget);
              this.cache.disclosureList.classList.contains(s) && !t && this._hideList();
            },
            _onDisclosureKeyUp: function (e) {
              27 === e.which && (this._hideList(), this.cache.disclosureToggle.focus());
            },
            _onBodyClick: function (e) {
              var t = this.container.contains(e.target);
              this.cache.disclosureList.classList.contains(s) && !t && this._hideList();
            },
            _submitForm: function (e) {
              (this.cache.disclosureInput.value = e), this.cache.disclosureForm.submit();
            },
            _hideList: function () {
              this.cache.disclosureList.classList.remove(s),
                this.cache.disclosureToggle.setAttribute("aria-expanded", !1);
            },
            _toggleList: function () {
              var e = "true" === this.cache.disclosureToggle.getAttribute("aria-expanded");
              this.cache.disclosureList.classList.toggle(s),
                this.cache.disclosureToggle.setAttribute("aria-expanded", !e);
            },
            destroy: function () {
              this.cache.disclosureToggle.removeEventListener("click", this.eventHandlers.toggleList),
                this.cache.disclosureOptions.forEach(function (e) {
                  e.removeEventListener("click", this.eventHandlers.connectOptions);
                }, this),
                this.container.removeEventListener("keyup", this.eventHandlers.onDisclosureKeyUp),
                this.cache.disclosureList.removeEventListener("focusout", this.eventHandlers.onDisclosureListFocusOut),
                this.cache.disclosureToggle.removeEventListener(
                  "focusout",
                  this.eventHandlers.onDisclosureToggleFocusOut
                ),
                document.body.removeEventListener("click", this.eventHandlers.onBodyClick);
            }
          })),
          a
        );
      })()),
      (theme.Modals = (function () {
        function e(e, t, i) {
          var n = {
            close: ".js-modal-close",
            open: ".js-modal-open-" + t,
            openClass: "modal--is-active",
            closingClass: "modal--is-closing",
            bodyOpenClass: "modal-open",
            bodyOpenSolidClass: "modal-open--solid",
            bodyClosingClass: "modal-closing",
            closeOffContentClick: !0
          };
          if (((this.id = e), (this.modal = document.getElementById(e)), !this.modal)) return !1;
          (this.modalContent = this.modal.querySelector(".modal__inner")),
            (this.config = Object.assign(n, i)),
            (this.modalIsOpen = !1),
            (this.focusOnOpen = this.config.focusIdOnOpen
              ? document.getElementById(this.config.focusIdOnOpen)
              : this.modal),
            (this.isSolid = this.config.solid),
            this.init();
        }
        return (
          (e.prototype.init = function () {
            document.querySelectorAll(this.config.open).forEach((e) => {
              e.setAttribute("aria-expanded", "false"), e.addEventListener("click", this.open.bind(this));
            }),
              this.modal.querySelectorAll(this.config.close).forEach((e) => {
                e.addEventListener("click", this.close.bind(this));
              }),
              document.addEventListener(
                "drawerOpen",
                function () {
                  this.close();
                }.bind(this)
              );
          }),
          (e.prototype.open = function (e) {
            var t = !1;
            this.modalIsOpen ||
              (e ? e.preventDefault() : (t = !0),
              e &&
                e.stopPropagation &&
                (e.stopPropagation(), (this.activeSource = e.currentTarget.setAttribute("aria-expanded", "true"))),
              this.modalIsOpen && !t && this.close(),
              this.modal.classList.add(this.config.openClass),
              document.documentElement.classList.add(this.config.bodyOpenClass),
              this.isSolid && document.documentElement.classList.add(this.config.bodyOpenSolidClass),
              (this.modalIsOpen = !0),
              theme.a11y.trapFocus({
                container: this.modal,
                elementToFocus: this.focusOnOpen,
                namespace: "modal_focus"
              }),
              document.dispatchEvent(new CustomEvent("modalOpen")),
              document.dispatchEvent(new CustomEvent("modalOpen." + this.id)),
              this.bindEvents());
          }),
          (e.prototype.close = function (e) {
            if (this.modalIsOpen) {
              if (e)
                if (e.target.closest(".js-modal-close"));
                else if (e.target.closest(".modal__inner")) return;
              document.activeElement.blur(),
                this.modal.classList.remove(this.config.openClass),
                this.modal.classList.add(this.config.closingClass),
                document.documentElement.classList.remove(this.config.bodyOpenClass),
                document.documentElement.classList.add(this.config.bodyClosingClass),
                window.setTimeout(
                  function () {
                    document.documentElement.classList.remove(this.config.bodyClosingClass),
                      this.modal.classList.remove(this.config.closingClass),
                      this.activeSource &&
                        this.activeSource.getAttribute("aria-expanded") &&
                        this.activeSource.setAttribute("aria-expanded", "false").focus();
                  }.bind(this),
                  500
                ),
                this.isSolid && document.documentElement.classList.remove(this.config.bodyOpenSolidClass),
                (this.modalIsOpen = !1),
                theme.a11y.removeTrapFocus({
                  container: this.modal,
                  namespace: "modal_focus"
                }),
                document.dispatchEvent(new CustomEvent("modalClose." + this.id)),
                this.unbindEvents();
            }
          }),
          (e.prototype.bindEvents = function () {
            window.on(
              "keyup.modal",
              function (e) {
                27 === e.keyCode && this.close();
              }.bind(this)
            ),
              this.config.closeOffContentClick && this.modal.on("click.modal", this.close.bind(this));
          }),
          (e.prototype.unbindEvents = function () {
            document.documentElement.off(".modal"), this.config.closeOffContentClick && this.modal.off(".modal");
          }),
          e
        );
      })()),
      (theme.parallaxSections = {}),
      (theme.Parallax = (function () {
        var e = !1;
        function t(e, t) {
          (this.isInit = !1),
            (this.isVisible = !1),
            (this.container = e),
            (this.image = e.querySelector(".parallax-image")),
            (this.namespace = t.namespace),
            (this.desktopOnly = t.desktopOnly),
            this.container &&
              this.image &&
              (this.desktopOnly &&
                (document.addEventListener(
                  "matchSmall",
                  function () {
                    this.destroy();
                  }.bind(this)
                ),
                document.addEventListener(
                  "unmatchSmall",
                  function () {
                    this.init(!0);
                  }.bind(this)
                )),
              this.init(this.desktopOnly));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function (e) {
              (this.isInit && this.destroy(), (this.isInit = !0), e && theme.config.bpSmall) ||
                (this.setSizes(),
                this.scrollHandler(),
                new IntersectionObserver(
                  (e, t) => {
                    e.forEach((e) => {
                      (this.isVisible = e.isIntersecting),
                        this.isVisible
                          ? window.on("scroll" + this.namespace, this.onScroll.bind(this))
                          : window.off("scroll" + this.namespace);
                    });
                  },
                  { rootMargin: "200px 0px 200px 0px" }
                ).observe(this.container),
                window.on("resize" + this.namespace, theme.utils.debounce(250, this.setSizes.bind(this))),
                document.addEventListener(
                  "shopify:section:reorder",
                  theme.utils.debounce(250, this.onReorder.bind(this))
                ));
            },
            onScroll: function () {
              this.isVisible &&
                (window.SPR && !e && (this.setSizes(), (e = !0)), requestAnimationFrame(this.scrollHandler.bind(this)));
            },
            scrollHandler: function () {
              var e = 0.85 * (window.scrollY - this.elTop);
              this.image.style.transform = "translate3d(0, " + e + "px, 0)";
            },
            setSizes: function () {
              var e = this.container.getBoundingClientRect();
              this.elTop = e.top + window.scrollY;
            },
            onReorder: function () {
              this.setSizes(), this.onScroll();
            },
            destroy: function () {
              (this.image.style.transform = "none"),
                window.off("scroll" + this.namespace),
                window.off("resize" + this.namespace);
            }
          })),
          t
        );
      })()),
      (theme.AjaxProduct = (function () {
        var e = { loading: !1 };
        function t(e, t, i) {
          (this.form = e), (this.args = i);
          var n = t || ".add-to-cart";
          this.form &&
            ((this.addToCart = e.querySelector(n)),
            this.form.addEventListener("submit", this.addItemFromForm.bind(this)));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            addItemFromForm: function (t, i) {
              if ((t.preventDefault(), !e.loading)) {
                this.addToCart.classList.add("btn--loading"), (e.loading = !0);
                var n = theme.utils.serialize(this.form);
                fetch(theme.routes.cartAdd, {
                  method: "POST",
                  body: n,
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest"
                  }
                })
                  .then((e) => e.json())
                  .then(
                    function (t) {
                      if (422 === t.status) this.error(t);
                      else {
                        var cartContents = fetch(window.Shopify.routes.root + "cart.js")
                          .then((response) => response.json())
                          .then((res) => {
                            var total_amount = res.total_price / 100;
                            total_amount = total_amount.toFixed(2);
                            var gifted_item = $.grep(res.items, function (n) {
                              return n.variant_id == parseInt(gift_product_id);
                            });
                            if (total_amount >= parseInt(unlock_gift_amount)) {
                              $(".cart-message-content").addClass("hide");
                              $(".cart__scrollable").addClass("product-offered");
                              $(".shipping-fee-content").addClass("offer-red");
                              $(".shipping-fee-content").removeClass("shipping-black");
                              $(".shipping-fee-content").html("OFFERTS");
                              $(".progress-bar-wh").css("width", "100%");
                            } else if (total_amount < parseInt(unlock_gift_amount)) {
                              $(".cart-unlock-gift-amount").html(
                                (parseInt(unlock_gift_amount) - total_amount).toFixed(2)
                              );
                              var progressBarWidth = (total_amount * 100) / parseInt(unlock_gift_amount);
                              $(".progress-bar-wh").css("width", progressBarWidth + "%");
                              $(".shipping-fee-content").removeClass("offer-red");
                              $(".shipping-fee-content").addClass("shipping-black");
                              $(".shipping-fee-content").html("Calculés à l’étape de paiement");
                              $(".cart-message-content").removeClass("hide");
                              $(".cart__scrollable").removeClass("product-offered");
                            }

                            if (total_amount == 0) {
                              $(".cart-message").addClass("hide");
                            } else {
                              $(".cart-message").removeClass("hide");
                            }

                            if (
                              total_amount >= parseInt(unlock_gift_amount) &&
                              (gifted_item === undefined || gifted_item.length == 0)
                            ) {
                              let formData = {
                                items: [
                                  {
                                    quantity: 1,
                                    id: parseInt(gift_product_id)
                                  }
                                ]
                              };
                              fetch(window.Shopify.routes.root + "cart/add.js", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(formData)
                              })
                                .then((response) => {
                                  var i = t;
                                  this.success(i);
                                  return response.json();
                                })
                                .catch((error) => {
                                  var i = t;
                                  this.success(i);
                                  console.error("Error:", error);
                                });
                            } else if (
                              total_amount < parseInt(unlock_gift_amount) &&
                              gifted_item != undefined &&
                              gifted_item.length != 0
                            ) {
                              var q = {
                                type: "POST",
                                url: "/cart/change.js",
                                data: {
                                  id: parseInt(gift_product_id),
                                  quantity: 0
                                },
                                dataType: "json",
                                success: function (res) {
                                  var i = t;
                                  this.success(i);
                                  return res.json();
                                },
                                error: function (t, a) {
                                  var i = t;
                                  this.success(i);
                                }
                              };
                              jQuery.ajax(q);
                            } else {
                              var i = t;
                              this.success(i);
                            }
                          });
                      }
                      (e.loading = !1), this.addToCart.classList.remove("btn--loading");
                    }.bind(this)
                  );
              }
            },
            success: function (e) {
              var t = this.form.querySelector(".errors");
              t && t.remove(),
                document.dispatchEvent(
                  new CustomEvent("ajaxProduct:added", {
                    detail: { product: e, addToCartBtn: this.addToCart }
                  })
                ),
                this.args &&
                  this.args.scopedEventId &&
                  document.dispatchEvent(
                    new CustomEvent("ajaxProduct:added:" + this.args.scopedEventId, {
                      detail: { product: e, addToCartBtn: this.addToCart }
                    })
                  );
            },
            error: function (e) {
              if (e.description) {
                var t = this.form.querySelector(".errors");
                t && t.remove();
                var i = document.createElement("div");
                i.classList.add("errors", "text-center"),
                  (i.textContent = e.description),
                  this.form.append(i),
                  document.dispatchEvent(
                    new CustomEvent("ajaxProduct:error", {
                      detail: { errorMessage: e.description }
                    })
                  ),
                  this.args &&
                    this.args.scopedEventId &&
                    document.dispatchEvent(
                      new CustomEvent("ajaxProduct:error:" + this.args.scopedEventId, {
                        detail: { errorMessage: e.description }
                      })
                    );
              } else console.warn(e);
            }
          })),
          t
        );
      })()),
      (theme.ProductMedia = (function () {
        var e = {},
          t = {},
          i = {},
          n = "[data-product-single-media-group]",
          o = "[data-shopify-xr]";
        function s(t) {
          if (!t)
            if (window.ShopifyXR) {
              for (var i in e)
                if (e.hasOwnProperty(i)) {
                  var n = e[i];
                  if (n.loaded) continue;
                  var o = document.querySelector("#ModelJson-" + i);
                  window.ShopifyXR.addModels(JSON.parse(o.innerHTML)), (n.loaded = !0);
                }
              window.ShopifyXR.setupXRElements();
            } else
              document.addEventListener("shopify_xr_initialized", function () {
                s();
              });
        }
        function a(e) {
          if (!e)
            for (var i in t)
              if (t.hasOwnProperty(i)) {
                var n = t[i];
                !n.modelViewerUi && Shopify && (n.modelViewerUi = new Shopify.ModelViewerUI(n.element)), r(n);
              }
        }
        function r(e) {
          var t = i[e.sectionId];
          e.container.addEventListener("mediaVisible", function () {
            t.element.setAttribute("data-shopify-model3d-id", e.modelId),
              theme.config.isTouch || e.modelViewerUi.play();
          }),
            e.container.addEventListener("mediaHidden", function () {
              t.element.setAttribute("data-shopify-model3d-id", t.defaultId), e.modelViewerUi.pause();
            }),
            e.container.addEventListener("xrLaunch", function () {
              e.modelViewerUi.pause();
            });
        }
        return {
          init: function (r, c) {
            (e[c] = { loaded: !1 }),
              r.forEach(function (e, s) {
                var a = e.dataset.mediaId,
                  r = e.querySelector("model-viewer"),
                  d = r.dataset.modelId;
                if (0 === s) {
                  var l = e.closest(n).querySelector(o);
                  i[c] = { element: l, defaultId: d };
                }
                t[a] = { modelId: d, sectionId: c, container: e, element: r };
              }),
              window.Shopify.loadFeatures([
                { name: "shopify-xr", version: "1.0", onLoad: s },
                { name: "model-viewer-ui", version: "1.0", onLoad: a }
              ]),
              theme.LibraryLoader.load("modelViewerUiStyles");
          },
          removeSectionModels: function (i) {
            for (var n in t) {
              if (t.hasOwnProperty(n)) t[n].sectionId === i && delete t[n];
            }
            delete e[i];
          }
        };
      })()),
      (theme.QtySelector = (function () {
        var e = ".js-qty__num",
          t = ".js-qty__adjust--plus",
          i = ".js-qty__adjust--minus";
        function n(n, o) {
          (this.wrapper = n),
            (this.plus = n.querySelector(t)),
            (this.minus = n.querySelector(i)),
            (this.input = n.querySelector(e)),
            (this.minValue = this.input.getAttribute("min") || 1);
          var s = { namespace: null, isCart: !1, key: this.input.dataset.id };
          (this.options = Object.assign({}, s, o)), this.init();
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            init: function () {
              this.plus.addEventListener(
                "click",
                function () {
                  var e = this._getQty();
                  this._change(e + 1);
                }.bind(this)
              ),
                this.minus.addEventListener(
                  "click",
                  function () {
                    var e = this._getQty();
                    this._change(e - 1);
                  }.bind(this)
                ),
                this.input.addEventListener(
                  "change",
                  function (e) {
                    this._change(this._getQty());
                  }.bind(this)
                );
            },
            _getQty: function () {
              var e = this.input.value;
              return (parseFloat(e) != parseInt(e) || isNaN(e)) && (e = 1), parseInt(e);
            },
            _change: function (e) {
              e <= this.minValue && (e = this.minValue),
                (this.input.value = e),
                this.options.isCart &&
                  document.dispatchEvent(
                    new CustomEvent("cart:quantity" + this.options.namespace, {
                      detail: [this.options.key, e, this.wrapper]
                    })
                  );
            }
          })),
          n
        );
      })()),
      (theme.Slideshow = (function () {
        var e = "animate-out",
          t = "is-paused",
          i = "is-active",
          n = ".slideshow__slide",
          o = ".is-selected",
          s = ".slideshow-wrapper",
          a = ".slideshow__pause",
          r = ".product__thumb-item:not(.hide)",
          c = ".product__thumb-item:not(.hide) a",
          d = ".product__thumb-arrow",
          l = {
            adaptiveHeight: !1,
            autoPlay: !1,
            avoidReflow: !1,
            childNav: null,
            childNavScroller: null,
            childVertical: !1,
            fade: !1,
            initialIndex: 0,
            pageDots: !1,
            pauseAutoPlayOnHover: !1,
            prevNextButtons: !1,
            rightToLeft: theme.config.rtl,
            setGallerySize: !0,
            wrapAround: !0
          };
        function h(e, t) {
          if (
            ((this.el = e),
            (this.args = Object.assign({}, l, t)),
            (this.args.on = {
              ready: this.init.bind(this),
              change: this.slideChange.bind(this),
              settle: this.afterChange.bind(this)
            }),
            this.args.childNav &&
              ((this.childNavEls = this.args.childNav.querySelectorAll(r)),
              (this.childNavLinks = this.args.childNav.querySelectorAll(c)),
              (this.arrows = this.args.childNav.querySelectorAll(d)),
              this.childNavLinks.length && this.initChildNav()),
            this.args.avoidReflow &&
              (function (e) {
                if (!e.id) return;
                var t = e.firstChild;
                for (; null != t && 3 == t.nodeType; ) t = t.nextSibling;
                var i = document.createElement("style");
                (i.innerHTML = `#${e.id} .flickity-viewport{height:${t.offsetHeight}px}`), document.head.appendChild(i);
              })(e),
            (this.slideshow = new Flickity(e, this.args)),
            this.args.autoPlay)
          ) {
            var i = e.closest(s);
            (this.pauseBtn = i.querySelector(a)),
              this.pauseBtn && this.pauseBtn.addEventListener("click", this._togglePause.bind(this));
          }
          window.on(
            "resize",
            theme.utils.debounce(
              300,
              function () {
                this.resize();
              }.bind(this)
            )
          );
        }
        return (
          (h.prototype = Object.assign({}, h.prototype, {
            init: function (e) {
              (this.currentSlide = this.el.querySelector(o)),
                this.args.callbacks &&
                  this.args.callbacks.onInit &&
                  "function" == typeof this.args.callbacks.onInit &&
                  this.args.callbacks.onInit(this.currentSlide),
                window.AOS && AOS.refresh();
            },
            slideChange: function (t) {
              this.args.fade &&
                this.currentSlide &&
                (this.currentSlide.classList.add(e),
                this.currentSlide.addEventListener(
                  "transitionend",
                  function () {
                    this.currentSlide.classList.remove(e);
                  }.bind(this)
                )),
                this.args.childNav && this.childNavGoTo(t),
                this.args.callbacks &&
                  this.args.callbacks.onChange &&
                  "function" == typeof this.args.callbacks.onChange &&
                  this.args.callbacks.onChange(t),
                this.arrows &&
                  this.arrows.length &&
                  (this.arrows[0].classList.toggle("hide", 0 === t),
                  this.arrows[1].classList.toggle("hide", t === this.childNavLinks.length - 1));
            },
            afterChange: function (t) {
              this.args.fade &&
                this.el.querySelectorAll(n).forEach((t) => {
                  t.classList.remove(e);
                }),
                (this.currentSlide = this.el.querySelector(o)),
                this.args.childNav && this.childNavGoTo(this.slideshow.selectedIndex);
            },
            destroy: function () {
              this.args.childNav &&
                this.childNavLinks.length &&
                this.childNavLinks.forEach((e) => {
                  e.classList.remove(i);
                }),
                this.slideshow.destroy();
            },
            _togglePause: function () {
              this.pauseBtn.classList.contains(t)
                ? (this.pauseBtn.classList.remove(t), this.slideshow.playPlayer())
                : (this.pauseBtn.classList.add(t), this.slideshow.pausePlayer());
            },
            resize: function () {
              this.slideshow.resize();
            },
            play: function () {
              this.slideshow.playPlayer();
            },
            pause: function () {
              this.slideshow.pausePlayer();
            },
            goToSlide: function (e) {
              this.slideshow.select(e);
            },
            setDraggable: function (e) {
              (this.slideshow.options.draggable = e), this.slideshow.updateDraggable();
            },
            initChildNav: function () {
              this.childNavLinks[this.args.initialIndex].classList.add("is-active"),
                this.childNavLinks.forEach((e, t) => {
                  e.setAttribute("data-index", t),
                    e.addEventListener(
                      "click",
                      function (e) {
                        e.preventDefault(), this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    ),
                    e.addEventListener(
                      "focus",
                      function (e) {
                        this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    ),
                    e.addEventListener(
                      "keydown",
                      function (e) {
                        13 === e.keyCode && this.goToSlide(this.getChildIndex(e.currentTarget));
                      }.bind(this)
                    );
                }),
                this.arrows.length &&
                  this.arrows.forEach((e) => {
                    e.addEventListener("click", this.arrowClick.bind(this));
                  });
            },
            getChildIndex: function (e) {
              return parseInt(e.dataset.index);
            },
            childNavGoTo: function (e) {
              this.childNavLinks.forEach((e) => {
                e.classList.remove(i);
              });
              var t = this.childNavLinks[e];
              if ((t.classList.add(i), this.args.childNavScroller))
                if (this.args.childVertical) {
                  var n = t.offsetTop;
                  this.args.childNavScroller.scrollTop = n - 100;
                } else {
                  var o = t.offsetLeft;
                  this.args.childNavScroller.scrollLeft = o - 100;
                }
            },
            arrowClick: function (e) {
              e.currentTarget.classList.contains("product__thumb-arrow--prev")
                ? this.slideshow.previous()
                : this.slideshow.next();
            }
          })),
          h
        );
      })()),
      (theme.VariantAvailability = (function () {
        var e = "disabled";
        function t(e) {
          (this.type = e.type),
            (this.variantSelectors = e.variantSelectors),
            (this.variantsObject = e.variantsObject),
            (this.currentVariantObject = e.currentVariantObject),
            (this.form = e.form),
            this.init();
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.variantSelectors.forEach((e) => {
                e.on("change", this.setAvailability.bind(this));
              }),
                this.setAvailability(null, this.currentVariantObject);
            },
            setAvailability: function (e, t) {
              var i,
                n = { option1: [], option2: [], option3: [] },
                o = null;
              if (e) {
                var s = e.currentTarget,
                  a = s.value,
                  r = s.dataset.index;
                i = this.variantsObject.filter(function (e) {
                  return e[r] === a;
                });
              } else {
                var c = this.variantsObject.filter(function (e) {
                    return (
                      t.id !== e.id &&
                      ((t.option2 === e.option2 && t.option3 === e.option3) ||
                        (t.option1 === e.option1 && t.option3 === e.option3) ||
                        (t.option1 === e.option1 && t.option2 === e.option2) ||
                        void 0)
                    );
                  }),
                  d = { variant: t };
                i = Object.assign({}, d, c);
              }
              for (var l in (this.form.querySelectorAll(".variant-input-wrap").forEach((t) => {
                var i = t.dataset.index;
                e && i === r ? (o = r) : this.disableVariantGroup(t);
              }),
              i))
                if (i.hasOwnProperty(l)) {
                  var h = i[l],
                    u = h.option1,
                    m = h.option2,
                    p = h.option3,
                    f = !1 === h.available;
                  u && "option1" !== o && n.option1.push({ value: u, soldOut: f }),
                    m && "option2" !== o && n.option2.push({ value: m, soldOut: f }),
                    p && "option3" !== o && n.option3.push({ value: p, soldOut: f });
                }
              for (var [v, g] of Object.entries(n)) this.manageOptionState(v, g);
            },
            manageOptionState: function (e, t) {
              var i = this.form.querySelector('.variant-input-wrap[data-index="' + e + '"]');
              t.forEach((e) => {
                this.enableVariantOption(i, e);
              });
            },
            enableVariantOptionByValue: function (e, t) {
              for (
                var i = this.form.querySelector('.variant-input-wrap[data-index="' + t + '"]'), n = 0;
                n < e.length;
                n++
              )
                this.enableVariantOption(i, e[n]);
            },
            enableVariantOption: function (t, i) {
              var n = i.value.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, "\\$1");
              if ("dropdown" === this.type) t.querySelector('option[value="' + n + '"]').disabled = !1;
              else {
                var o = t.querySelector('.variant-input[data-value="' + n + '"]');
                if (!o) {
                  return;
                }
                (s = o.querySelector("input")), (a = o.querySelector("label"));
                s.classList.remove(e), a.classList.remove(e), i.soldOut && (s.classList.add(e), a.classList.add(e));
              }
            },
            disableVariantGroup: function (t) {
              "dropdown" === this.type
                ? t.querySelectorAll("option").forEach((e) => {
                    e.disabled = !0;
                  })
                : (t.querySelectorAll("input").forEach((t) => {
                    t.classList.add(e);
                  }),
                  t.querySelectorAll("label").forEach((t) => {
                    t.classList.add(e);
                  }));
            }
          })),
          t
        );
      })()),
      (theme.videoModal = function () {
        var e,
          t = 'a[href*="youtube.com/watch"], a[href*="youtu.be/"]',
          i = ".product-video-trigger--mp4",
          n = ".product-video-mp4-sound",
          o = document.querySelectorAll(t),
          s = document.querySelectorAll(i);
        if (o.length || s.length) {
          var a = document.getElementById("VideoHolder");
          o.length && theme.LibraryLoader.load("youtubeSdk");
          var r = new theme.Modals("VideoModal", "video-modal", {
            closeOffContentClick: !0,
            solid: !0
          });
          o.forEach((e) => {
            e.addEventListener("click", c);
          }),
            s.forEach((e) => {
              e.addEventListener("click", d);
            }),
            document.addEventListener("modalClose.VideoModal", function () {
              e && "function" == typeof e.destroy ? e.destroy() : h();
            });
        }
        function c(t) {
          if (theme.config.youTubeReady) {
            t.preventDefault(), h(), r.open(t);
            var i,
              n,
              o =
                ((i = t.currentTarget.getAttribute("href")),
                !(
                  !(n = i.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/)) ||
                  11 != n[7].length
                ) && n[7]);
            e = new theme.YouTube("VideoHolder", {
              videoId: o,
              style: "sound",
              events: { onReady: l }
            });
          }
        }
        function d(e) {
          h();
          var t = e.currentTarget.parentNode.querySelector(n).cloneNode(!0);
          t.classList.remove("hide"), a.append(t), r.open(e), a.querySelector("video").play();
        }
        function l(e) {
          e.target.unMute(), e.target.playVideo();
        }
        function h() {
          a.innerHTML = "";
        }
      }),
      (theme.announcementBar = (function () {
        var e,
          t,
          i = {
            autoPlay: 5e3,
            avoidReflow: !0,
            cellAlign: theme.config.rtl ? "right" : "left",
            fade: !0
          };
        function n() {
          t && "function" == typeof t.destroy && t.destroy();
        }
        return {
          init: function () {
            (e = document.getElementById("AnnouncementSlider")) &&
              (n(), 1 !== e.dataset.blockCount && (t = new theme.Slideshow(e, i)));
          },
          onBlockSelect: function (i) {
            var n = e.querySelector("#AnnouncementSlide-" + i),
              o = parseInt(n.dataset.index);
            t && "function" == typeof t.pause && (t.goToSlide(o), t.pause());
          },
          onBlockDeselect: function () {
            t && "function" == typeof t.play && t.play();
          },
          unload: n
        };
      })()),
      (theme.customerTemplates = function () {
        function e() {
          document.getElementById("RecoverPasswordForm").classList.toggle("hide"),
            document.getElementById("CustomerLoginForm").classList.toggle("hide");
        }
        "#recover" === window.location.hash && e(),
          (function () {
            var t = document.getElementById("RecoverPassword");
            t &&
              t.addEventListener("click", function (t) {
                t.preventDefault(), e();
              });
            var i = document.getElementById("HideRecoverPasswordLink");
            i &&
              i.addEventListener("click", function (t) {
                t.preventDefault(), e();
              });
          })(),
          (function () {
            if (!document.querySelector(".reset-password-success")) return;
            document.getElementById("ResetSuccess").classList.remove("hide");
          })(),
          (function () {
            var e = document.getElementById("AddressNewForm"),
              t = document.querySelectorAll(".js-address-form");
            if (!e || !t.length) return;
            setTimeout(function () {
              document.querySelectorAll(".js-address-country").forEach((e) => {
                var t = e.dataset.countryId,
                  i = e.dataset.provinceId,
                  n = e.dataset.provinceContainerId;
                new Shopify.CountryProvinceSelector(t, i, { hideElement: n });
              });
            }, 1e3),
              document.querySelector(".address-new-toggle").addEventListener("click", function () {
                e.classList.toggle("hide");
              }),
              document.querySelectorAll(".address-edit-toggle").forEach((e) => {
                e.addEventListener("click", function (e) {
                  var t = e.currentTarget.dataset.formId;
                  document.getElementById("EditAddress_" + t).classList.toggle("hide");
                });
              }),
              document.querySelectorAll(".address-delete").forEach((e) => {
                e.addEventListener("click", function (e) {
                  var t = e.currentTarget.dataset.formId,
                    i = e.currentTarget.dataset.confirmMessage;
                  confirm(i || "Are you sure you wish to delete this address?") &&
                    Shopify &&
                    Shopify.postLink("/account/addresses/" + t, {
                      parameters: { _method: "delete" }
                    });
                });
              });
          })();
      }),
      (theme.headerNav = (function () {
        var e,
          t,
          i,
          n,
          o = "#HeaderWrapper",
          s = "#SiteHeader",
          a = "#LogoContainer img",
          r = ".megamenu",
          c = ".site-navigation",
          d = ".site-nav__item",
          l = ".site-nav__link",
          h = ".site-nav__link--has-dropdown",
          u = ".site-nav__dropdown-link--second-level",
          m = ".site-nav__compress-menu",
          p = '[data-type="nav"]',
          f = '[data-type="search"]',
          v = "site-nav--has-dropdown",
          g = "site-nav__deep-dropdown-trigger",
          y = "is-focused",
          S = "header-wrapper--compressed",
          b = "is-light",
          w = {
            namespace: ".siteNav",
            wrapperOverlayed: !1,
            stickyEnabled: !1,
            stickyActive: !1,
            subarPositionInit: !1,
            threshold: 0
          };
        function L() {
          theme.settings.overlayHeader &&
            document.querySelector(".header-section").classList.add("header-section--overlay");
          var t = theme.config.bpSmall
            ? document.querySelector('.site-header__element--sub[data-type="search"]')
            : document.querySelector('.site-header__element--sub[data-type="nav"]');
          if (t) {
            var i = t.offsetHeight;
            0 !== i && document.documentElement.style.setProperty("--header-padding-bottom", i + "px"),
              w.subarPositionInit || (e.classList.add("header-wrapper--init"), (w.subarPositionInit = !0));
          }
        }
        function E() {
          document.querySelector(".header-section").style.position = "relative";
        }
        function _() {
          w.stickyEnabled && (w.forceStopSticky || requestAnimationFrame(k));
        }
        function k() {
          if (window.scrollY > w.threshold) {
            if (w.stickyActive) return;
            i && theme.utils.prepareTransition(i),
              n && theme.utils.prepareTransition(n),
              (w.stickyActive = !0),
              e.classList.add(S),
              w.wrapperOverlayed && e.classList.remove(b),
              document.dispatchEvent(new CustomEvent("headerStickyChange"));
          } else {
            if (!w.stickyActive) return;
            i && theme.utils.prepareTransition(i),
              n && theme.utils.prepareTransition(n),
              (w.stickyActive = !1),
              (w.threshold = e.getBoundingClientRect().top),
              e.classList.remove(S),
              w.wrapperOverlayed && e.classList.add(b),
              document.dispatchEvent(new CustomEvent("headerStickyChange"));
          }
        }
        function I(e) {
          document.querySelectorAll(a).forEach((e) => {
            var t = e.clientWidth,
              i = e.closest(".header-item").clientWidth;
            t > i ? (e.style.maxWidth = i) : e.removeAttribute("style");
          });
        }
        return {
          init: function () {
            var a;
            (e = document.querySelector(o)),
              (t = document.querySelector(s)),
              (i = e.querySelector(p)),
              (n = e.querySelector(f)),
              (w.threshold = e.getBoundingClientRect().top),
              (w.subarPositionInit = !1),
              (w.stickyEnabled = "true" === t.dataset.sticky),
              w.stickyEnabled
                ? ((w.wrapperOverlayed = e.classList.contains(b)),
                  (theme.config.stickyHeader =
                    ((a = 0),
                    t.querySelectorAll(r).forEach((e) => {
                      var t = e.offsetHeight;
                      t > a && (a = t);
                    }),
                    !(window.innerHeight < a + 120))),
                  theme.config.stickyHeader
                    ? ((w.forceStopSticky = !1),
                      window.scrollY > w.threshold && _(),
                      window.on("scroll" + w.namespace, _))
                    : ((w.forceStopSticky = !0), E()))
                : E(),
              (theme.settings.overlayHeader = "true" === t.dataset.overlay),
              theme.settings.overlayHeader &&
                Shopify &&
                Shopify.designMode &&
                document.body.classList.contains("template-collection") &&
                !document.querySelector(".collection-hero") &&
                this.disableOverlayHeader(),
              L(),
              window.on("resize" + w.namespace, theme.utils.debounce(250, L));
            var S = e.querySelector(m);
            S &&
              S.on("click", function () {
                S.classList.toggle("is-active"),
                  theme.utils.prepareTransition(i, function () {
                    i.classList.toggle("is-active");
                  });
              }),
              (function () {
                var e = !1,
                  t = !1,
                  i = !1;
                theme.config.isTouch &&
                  document.querySelectorAll(h).forEach((e) => {
                    e.on("touchend" + w.namespace, function (e) {
                      e.currentTarget.parentNode.classList.contains(y)
                        ? window.location.replace(e.currentTarget.getAttribute("href"))
                        : (e.preventDefault(), a(), o(e.currentTarget));
                    });
                  });
                function n(i) {
                  e && r(), t && c(), o(i.currentTarget);
                }
                function o(t) {
                  var n = t.parentNode;
                  if ((n.classList.contains(v) && (n.classList.add(y), (e = !0)), !theme.config.isTouch && !i)) {
                    var o = theme.config.isTouch ? "touchend" : "click";
                    (i = !0),
                      document.documentElement.on(
                        o + w.namespace,
                        function () {
                          a(), document.documentElement.off(o + w.namespace), (i = !1);
                        }.bind(this)
                      );
                  }
                }
                function s(e, i) {
                  var n = e.parentNode;
                  (n.classList.contains(g) || i) && (n.classList.add(y), (t = !0));
                }
                function a() {
                  r(), c();
                }
                function r() {
                  document.querySelectorAll(d).forEach((e) => {
                    e.classList.remove(y);
                  });
                }
                function c() {
                  document.querySelectorAll(u).forEach((e) => {
                    e.parentNode.classList.remove(y);
                  });
                }
                document.querySelectorAll(l).forEach((e) => {
                  e.on("focusin" + w.namespace, n),
                    e.on("mouseover" + w.namespace, n),
                    e.on("mouseleave" + w.namespace, a);
                }),
                  document.querySelectorAll(u).forEach((e) => {
                    theme.config.isTouch &&
                      e.on("touchend" + w.namespace, function (e) {
                        var t = e.currentTarget.parentNode;
                        t.classList.contains(g)
                          ? t.classList.contains(y)
                            ? window.location.replace(e.currentTarget.getAttribute("href"))
                            : (e.preventDefault(), c(), s(e.currentTarget))
                          : window.location.replace(e.currentTarget.getAttribute("href"));
                      }),
                      e.on("focusin" + w.namespace, function (e) {
                        c(), s(e.currentTarget, !0);
                      });
                  });
              })();
            var k = t.querySelector(c);
            k.querySelectorAll(".grid-product") && (new theme.QuickAdd(k), new theme.QuickShop(k)),
              window.on("load" + w.namespace, I),
              window.on("resize" + w.namespace, theme.utils.debounce(150, I));
          },
          removeOverlayClass: function () {
            w.wrapperOverlayed && e.classList.remove(b);
          },
          disableOverlayHeader: function () {
            e.classList.remove(w.overlayEnabledClass, b),
              (w.wrapperOverlayed = !1),
              (theme.settings.overlayHeader = !1);
          }
        };
      })()),
      (theme.MobileNav = (function () {
        var e = ".slide-nav__wrapper",
          t = ".slide-nav",
          i = ".slide-nav__dropdown",
          n = "a.slide-nav__link",
          o = ".js-toggle-submenu",
          s = ".mobile-nav-trigger",
          a = "is-active",
          r = { isOpen: !1, menuLevel: 1, inHeader: !1 };
        function c(i) {
          (this.config = Object.assign({}, r, i)),
            (this.namespace = ".nav-header-" + i.id),
            (this.container = document.getElementById(this.config.id)),
            this.container &&
              ((this.wrapper = this.container.querySelector(e)),
              this.wrapper &&
                ((this.nav = this.wrapper.querySelector(t)),
                (this.openTriggers = document.querySelectorAll(s)),
                this.init()));
        }
        return (
          (c.prototype = Object.assign({}, c.prototype, {
            init: function () {
              this.openTriggers.length &&
                this.openTriggers.forEach((e) => {
                  e.addEventListener(
                    "click",
                    function () {
                      this.config.isOpen ? this.close() : this.open();
                    }.bind(this)
                  );
                }),
                this.nav.querySelectorAll(o).forEach((e) => {
                  e.addEventListener("click", this.toggleSubNav.bind(this));
                }),
                this.nav.querySelectorAll(n).forEach((e) => {
                  e.addEventListener("click", this.close.bind(this));
                }),
                this.inHeader &&
                  (document.addEventListener(
                    "unmatchSmall",
                    function () {
                      this.close(null, !0);
                    }.bind(this)
                  ),
                  document.addEventListener("CartDrawer:open", this.close.bind(this)),
                  document.addEventListener("mobileNav:open", this.open.bind(this)),
                  document.addEventListener("mobileNav:close", this.close.bind(this)));
            },
            open: function (e) {
              document.body.style.overflow = "hidden";
              e && e.preventDefault(),
                theme.sizeDrawer(),
                this.openTriggers.forEach((e) => {
                  e.classList.add("is-active");
                }),
                theme.utils.prepareTransition(
                  this.container,
                  function () {
                    this.container.classList.add("is-active");
                  }.bind(this)
                ),
                window.on(
                  "keyup" + this.namespace,
                  function (e) {
                    27 === e.keyCode && this.close();
                  }.bind(this)
                ),
                theme.headerNav.removeOverlayClass(),
                document.documentElement.classList.add("mobile-nav-open"),
                document.dispatchEvent(new CustomEvent("MobileNav:open")),
                (this.config.isOpen = !0),
                setTimeout(
                  function () {
                    window.on(
                      "click" + this.namespace,
                      function (e) {
                        this.close(e);
                      }.bind(this)
                    );
                  }.bind(this),
                  0
                );
            },
            close: function (e, t) {
              var i = !1;
              (e &&
                e.target.closest &&
                e.target.closest(".site-header__drawer") &&
                (e.currentTarget &&
                  e.currentTarget.classList &&
                  e.currentTarget.classList.contains("slide-nav__link") &&
                  (i = !0),
                !i)) ||
                (this.openTriggers.forEach((e) => {
                  e.classList.remove("is-active");
                }),
                t
                  ? this.container.classList.remove("is-active")
                  : theme.utils.prepareTransition(
                      this.container,
                      function () {
                        this.container.classList.remove("is-active");
                      }.bind(this)
                    ),
                document.documentElement.classList.remove("mobile-nav-open"),
                document.dispatchEvent(new CustomEvent("MobileNav:close")),
                window.off("keyup" + this.namespace),
                (document.body.style.overflow = "auto"),
                window.off("click" + this.namespace),
                (this.config.isOpen = !1));
            },
            toggleSubNav: function (e) {
              var t = e.currentTarget;
              this.goToSubnav(t.dataset.target);
            },
            goToSubnav: function (e) {
              var t = this.nav.querySelector(i + '[data-parent="' + e + '"]');
              t
                ? ((this.config.menuLevel = t.dataset.level),
                  2 == this.config.menuLevel &&
                    this.nav.querySelectorAll(i + '[data-level="3"]').forEach((e) => {
                      e.classList.remove(a);
                    }),
                  t.classList.add(a),
                  this.setWrapperHeight(t.offsetHeight))
                : ((this.config.menuLevel = 1),
                  this.wrapper.removeAttribute("style"),
                  this.nav.querySelectorAll(i).forEach((e) => {
                    e.classList.remove(a);
                  })),
                (this.wrapper.dataset.level = this.config.menuLevel);
            },
            setWrapperHeight: function (e) {
              this.wrapper.style.height = e + "px";
            }
          })),
          c
        );
      })()),
      (window.onpageshow = function (e) {
        e.persisted &&
          document.querySelectorAll(".cart__checkout").forEach((e) => {
            e.classList.remove("btn--loading");
          });
      }),
      (theme.headerSearch = (function () {
        var e,
          t,
          i = "",
          n = !1,
          o = ".site-header__search-form",
          s = 'input[type="search"]',
          a = ".site-header__search-container",
          r = ".js-search-header",
          c = "[data-predictive-search-button]",
          d = ".site-header__search-btn--cancel",
          l = "#SearchResultsWrapper",
          h = "#TopSearched",
          u = "#PredictiveWrapper",
          m = "#PredictiveResults",
          p = {},
          f = {
            namespace: ".search",
            topSearched: !1,
            predictiveSearch: !1,
            imageSize: "square"
          },
          v = 27,
          g = 38,
          y = 40,
          S = 9;
        function b() {
          f.predictiveSearch &&
            (p.predictiveWrapper.classList.add("hide"), (p.results.innerHTML = ""), clearTimeout(e)),
            f.topSearched ? p.topSearched.classList.remove("hide") : p.wrapper.classList.add("hide");
        }
        function w(t) {
          if (t && t.target.closest)
            if (t.target.closest(d));
            else {
              if (t.target.closest(".site-header__search-form")) return;
              if (t.target.closest(".site-header__element--sub")) return;
              if (t.target.closest("#SearchResultsWrapper")) return;
              if (t.target.closest(".site-header__search-container")) return;
            }
          document.activeElement.blur(),
            p.wrapper.classList.add("hide"),
            f.topSearched && p.topSearched.classList.remove("hide"),
            f.predictiveSearch && (p.predictiveWrapper.classList.add("hide"), clearTimeout(e)),
            p.inlineSearchContainer && p.inlineSearchContainer.classList.remove("is-active"),
            document.querySelectorAll(o).forEach((e) => {
              e.classList.remove("is-active");
            }),
            window.off("click" + f.namespace);
        }
        function L(e) {
          e.preventDefault(), e.stopImmediatePropagation();
          var t = document.querySelector(a);
          t.classList.add("is-active"), t.querySelector(".site-header__search-input").focus(), q();
        }
        function E() {
          t && t.submit();
        }
        function _(e) {
          e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
          var t = {},
            i = new FormData(e.target);
          for (var n of i.keys()) t[n] = i.get(n);
          t.q && (t.q += "*");
          var o = C(t);
          return (window.location.href = "/search?" + o), !1;
        }
        function k(o) {
          (t = o.currentTarget.closest("form")),
            o.keyCode !== g &&
              o.keyCode !== y &&
              o.keyCode !== S &&
              (o.keyCode !== v
                ? (function (t) {
                    var o = t.value;
                    if ("" === o) return void b();
                    var s = (function (e) {
                      if ("string" != typeof e) return null;
                      return e.trim().replace(/\ /g, "-").toLowerCase();
                    })(o);
                    clearTimeout(e),
                      (e = setTimeout(
                        function () {
                          !(function (e) {
                            if (n) return;
                            if (i === e) return;
                            (i = e), (n = !0);
                            var t = C({
                              q: e,
                              "resources[type]": theme.settings.predictiveSearchType,
                              "resources[limit]": 4,
                              "resources[options][unavailable_products]": "last",
                              "resources[options][fields]": "title,product_type,variants.title,vendor"
                            });
                            fetch("/search/suggest.json?" + t)
                              .then((e) => e.json())
                              .then((e) => {
                                n = !1;
                                var t = {},
                                  i = 0;
                                p.topSearched && p.topSearched.classList.add("hide"),
                                  p.predictiveWrapper.classList.remove("hide");
                                var o = Object.entries(e.resources.results);
                                if (
                                  (Object.keys(o).forEach(function (e) {
                                    var n = o[e],
                                      s = n[0],
                                      a = n[1];
                                    switch (((i += a.length), s)) {
                                      case "products":
                                        t[s] = (function (e) {
                                          var t = "",
                                            i = [];
                                          if (
                                            (e.forEach((e) => {
                                              var t = {
                                                title: e.title,
                                                url: e.url,
                                                image_responsive_url: theme.Images.lazyloadImagePath(e.image),
                                                image_aspect_ratio: e.featured_image.aspect_ratio
                                              };
                                              i.push(t);
                                            }),
                                            i.length)
                                          ) {
                                            var n = theme.buildProductGridItem(i, f.imageSize);
                                            t = `\n<div data-type-products>\n<div class="new-grid product-grid" data-view="small">\n${n}\n</div>\n</div>\n`;
                                          }
                                          return t;
                                        })(a);
                                        break;
                                      case "collections":
                                        t[s] = (function (e) {
                                          var t = "";
                                          if (e.length) {
                                            var i = theme.buildCollectionItem(e);
                                            t = `\n<div data-type-collections>\n<p class="h6 predictive__label">${theme.strings.searchCollections}</p>\n<ul class="no-bullets">\n${i}\n</ul>\n</div>\n`;
                                          }
                                          return t;
                                        })(a);
                                        break;
                                      case "pages":
                                        t[s] = (function (e) {
                                          var t = "";
                                          if (e.length) {
                                            var i = theme.buildPageItem(e);
                                            t = `\n<div data-type-pages>\n<p class="h6 predictive__label">${theme.strings.searchPages}</p>\n<ul class="no-bullets">\n${i}\n</ul>\n</div>\n`;
                                          }
                                          return t;
                                        })(a);
                                        break;
                                      case "articles":
                                        t[s] = (function (e) {
                                          var t = "";
                                          if (
                                            (e.forEach((e) => {
                                              e.image &&
                                                (e.image = theme.Images.getSizedImageUrl(
                                                  e.image,
                                                  "200x200_crop_center"
                                                ));
                                            }),
                                            e.length)
                                          ) {
                                            var i = theme.buildArticleItem(e, f.imageSize);
                                            t = `\n<div data-type-articles>\n<p class="h6 predictive__label">${theme.strings.searchArticles}</p>\n<div class="grid grid--uniform grid--no-gutters">\n${i}\n</div>\n</div>\n`;
                                          }
                                          return t;
                                        })(a);
                                    }
                                  }),
                                  0 !== i)
                                ) {
                                  var s = (function (e) {
                                    var t = "";
                                    e.products && "" !== e.products && (t += e.products);
                                    e.collections && "" !== e.collections && (t += e.collections);
                                    e.pages && "" !== e.pages && (t += e.pages);
                                    e.articles && "" !== e.articles && (t += e.articles);
                                    return t;
                                  })(t);
                                  (p.results.innerHTML = ""),
                                    (p.results.innerHTML = s),
                                    p.wrapper.classList.remove("hide");
                                } else b();
                              });
                          })(s);
                        }.bind(this),
                        500
                      ));
                  })(o.currentTarget)
                : w());
        }
        function I(e) {
          e.currentTarget.parentNode.classList.add("is-active"),
            f.topSearched && p.wrapper.classList.remove("hide"),
            q();
        }
        function q() {
          setTimeout(function () {
            window.on("click" + f.namespace, function (e) {
              w(e);
            });
          }, 0),
            window.on("keyup", function (e) {
              27 === e.keyCode && w();
            });
        }
        function C(e) {
          return Object.keys(e)
            .map(function (t) {
              return t + "=" + encodeURIComponent(e[t]);
            })
            .join("&");
        }
        return {
          init: function () {
            if (
              ((p.inlineSearchContainer = document.querySelector(a)),
              document.querySelectorAll(r).forEach((e) => {
                e.addEventListener("click", L);
              }),
              (p.wrapper = document.querySelector(l)),
              p.wrapper)
            ) {
              if (
                ((p.topSearched = document.querySelector(h)),
                p.topSearched && (f.topSearched = !0),
                theme.settings.predictiveSearch)
              )
                if (document.getElementById("shopify-features"))
                  JSON.parse(document.getElementById("shopify-features").innerHTML).predictiveSearch &&
                    (f.predictiveSearch = !0);
              f.predictiveSearch &&
                ((p.predictiveWrapper = document.querySelector(u)),
                (f.imageSize = p.predictiveWrapper.dataset.imageSize),
                (p.results = document.querySelector(m)),
                (p.submit = p.predictiveWrapper.querySelector(c)),
                p.submit.on("click" + f.namespace, E)),
                document.querySelectorAll(o).forEach((e) => {
                  !(function (e) {
                    e.setAttribute("autocomplete", "off"), e.on("submit" + f.namespace, _);
                    var t = e.querySelector(s);
                    t.on("focus" + f.namespace, I), f.predictiveSearch && t.on("keyup" + f.namespace, k);
                  })(e);
                });
            }
          }
        };
      })()),
      (theme.HeaderCart = (function () {
        var e = "#HeaderCartTrigger",
          t = "#HeaderCart",
          i = ".js-close-header-cart",
          n = ".add-note",
          o = { cartOpen: !1, namespace: ".cart-header" };
        function s() {
          (this.wrapper = document.querySelector(t)),
            this.wrapper &&
              ((this.trigger = document.querySelector(e)),
              (this.noteBtn = this.wrapper.querySelector(n)),
              (this.form = this.wrapper.querySelector("form")),
              document.addEventListener("MobileNav:open", this.close.bind(this)),
              document.addEventListener("modalOpen", this.close.bind(this)),
              this.init());
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function () {
              (this.cartForm = new theme.CartForm(this.form)),
                (this.quickAdd = new theme.QuickAdd(this.wrapper)),
                (this.quickShop = new theme.QuickShop(this.wrapper)),
                this.cartForm.buildCart(),
                this.trigger.on("click", this.open.bind(this)),
                document.querySelectorAll(i).forEach((e) => {
                  e.addEventListener(
                    "click",
                    function () {
                      this.close();
                    }.bind(this)
                  );
                }),
                this.noteBtn &&
                  this.noteBtn.addEventListener(
                    "click",
                    function () {
                      this.noteBtn.classList.toggle("is-active"),
                        this.wrapper.querySelector(".cart__note").classList.toggle("hide");
                    }.bind(this)
                  ),
                document.addEventListener(
                  "ajaxProduct:added",
                  function (e) {
                    this.cartForm.buildCart(), o.cartOpen || this.open();
                  }.bind(this)
                ),
                document.addEventListener("cart:open", this.open.bind(this)),
                document.addEventListener("cart:close", this.close.bind(this));
            },
            open: function (e) {
              "dropdown" === theme.settings.cartType &&
                (e && e.preventDefault(),
                theme.sizeDrawer(),
                theme.utils.prepareTransition(
                  this.wrapper,
                  function () {
                    this.wrapper.classList.add("is-active"), (this.wrapper.scrollTop = 0);
                  }.bind(this)
                ),
                document.documentElement.classList.add("cart-open"),
                theme.a11y.lockMobileScrolling(o.namespace),
                window.on(
                  "keyup" + o.namespace,
                  function (e) {
                    27 === e.keyCode && this.close();
                  }.bind(this)
                ),
                theme.headerNav.removeOverlayClass(),
                document.dispatchEvent(new CustomEvent("CartDrawer:open")),
                document.dispatchEvent(new CustomEvent("drawerOpen")),
                setTimeout(
                  function () {
                    window.on(
                      "click" + o.namespace,
                      function (e) {
                        this.close(e);
                      }.bind(this)
                    );
                  }.bind(this),
                  0
                ),
                (o.cartOpen = !0));
            },
            close: function (e) {
              "dropdown" === theme.settings.cartType &&
                ((e && e.target.closest && e.target.closest(".site-header__cart")) ||
                  (o.cartOpen &&
                    (e && "MobileNav:open" === e.type
                      ? this.wrapper.classList.remove("is-active")
                      : theme.utils.prepareTransition(
                          this.wrapper,
                          function () {
                            this.wrapper.classList.remove("is-active");
                          }.bind(this)
                        ),
                    window.off("keyup" + o.namespace),
                    window.off("click" + o.namespace),
                    theme.a11y.unlockMobileScrolling(o.namespace),
                    document.documentElement.classList.remove("cart-open"),
                    (o.cartOpen = !1))));
            }
          })),
          s
        );
      })()),
      (theme.QuickAdd = (function () {
        var e,
          t = ".js-quick-add-btn",
          i = ".js-quick-add-form",
          n = "#QuickAddHolder",
          o = !1;
        function s(e) {
          e && theme.settings.quickAdd && ((this.container = e), this.init());
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function () {
              var s = this.container.querySelectorAll(t);
              s &&
                s.forEach((e) => {
                  e.addEventListener("click", this.addToCart.bind(this));
                });
              var a = this.container.querySelectorAll(i);
              a.length &&
                ((this.quickAddHolder = document.querySelector(n)),
                o ||
                  ((e = new theme.Modals("QuickAddModal", "quick-add")),
                  (o = !0),
                  document.addEventListener(
                    "modalClose.QuickAddModal",
                    function () {
                      setTimeout(
                        function () {
                          this.quickAddHolder.innerHTML = "";
                        }.bind(this),
                        350
                      );
                    }.bind(this)
                  )),
                a.forEach((e) => {
                  e.addEventListener("click", this.loadQuickAddForm.bind(this));
                }));
            },
            addToCart: function (e) {
              var t = e.currentTarget,
                i = t.querySelector(".btn");
              i.classList.add("btn--loading");
              var n = { items: [{ id: t.dataset.id, quantity: 1 }] };
              fetch(theme.routes.cartAdd, {
                method: "POST",
                body: JSON.stringify(n),
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" }
              })
                .then((e) => e.json())
                .then(
                  function (e) {
                    if (422 === e.status || "bad_request" === e.status);
                    else {
                      var cartContents = fetch(window.Shopify.routes.root + "cart.js")
                        .then((response) => response.json())
                        .then((res) => {
                          var total_amount = res.total_price / 100;
                          total_amount = total_amount.toFixed(2);
                          var gifted_item = $.grep(res.items, function (n) {
                            return n.variant_id == parseInt(gift_product_id);
                          });
                          if (total_amount >= parseInt(unlock_gift_amount)) {
                            $(".cart-message-content").addClass("hide");
                            $(".cart__scrollable").addClass("product-offered");
                            $(".shipping-fee-content").addClass("offer-red");
                            $(".shipping-fee-content").removeClass("shipping-black");
                            $(".shipping-fee-content").html("OFFERTS");
                            $(".progress-bar-wh").css("width", "100%");
                          } else if (total_amount < parseInt(unlock_gift_amount)) {
                            $(".cart-unlock-gift-amount").html(
                              (parseInt(unlock_gift_amount) - total_amount).toFixed(2)
                            );
                            var progressBarWidth = (total_amount * 100) / parseInt(unlock_gift_amount);
                            $(".progress-bar-wh").css("width", progressBarWidth + "%");
                            $(".shipping-fee-content").removeClass("offer-red");
                            $(".shipping-fee-content").addClass("shipping-black");
                            $(".shipping-fee-content").html("Calculés à l’étape de paiement");
                            $(".cart-message-content").removeClass("hide");
                            $(".cart__scrollable").removeClass("product-offered");
                          }

                          if (total_amount == 0) {
                            $(".cart-message").addClass("hide");
                          } else {
                            $(".cart-message").removeClass("hide");
                          }

                          if (
                            total_amount >= parseInt(unlock_gift_amount) &&
                            (gifted_item === undefined || gifted_item.length == 0)
                          ) {
                            let formData = {
                              items: [
                                {
                                  quantity: 1,
                                  id: parseInt(gift_product_id)
                                }
                              ]
                            };
                            fetch(window.Shopify.routes.root + "cart/add.js", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify(formData)
                            })
                              .then((response) => {
                                var n = e;
                                document.dispatchEvent(
                                  new CustomEvent("ajaxProduct:added", {
                                    detail: { product: n, addToCartBtn: t }
                                  })
                                );
                                return response.json();
                              })
                              .catch((error) => {
                                var n = e;
                                document.dispatchEvent(
                                  new CustomEvent("ajaxProduct:added", {
                                    detail: { product: n, addToCartBtn: t }
                                  })
                                );
                                console.error("Error:", error);
                              });
                          } else if (
                            total_amount < parseInt(unlock_gift_amount) &&
                            gifted_item != undefined &&
                            gifted_item.length != 0
                          ) {
                            var q = {
                              type: "POST",
                              url: "/cart/change.js",
                              data: {
                                id: parseInt(gift_product_id),
                                quantity: 0
                              },
                              dataType: "json",
                              success: function (res) {
                                var n = e;
                                document.dispatchEvent(
                                  new CustomEvent("ajaxProduct:added", {
                                    detail: { product: n, addToCartBtn: t }
                                  })
                                );
                                return res.json();
                              },
                              error: function (t, a) {
                                var n = e;
                                document.dispatchEvent(
                                  new CustomEvent("ajaxProduct:added", {
                                    detail: { product: n, addToCartBtn: t }
                                  })
                                );
                              }
                            };
                            jQuery.ajax(q);
                          } else {
                            var n = e;
                            document.dispatchEvent(
                              new CustomEvent("ajaxProduct:added", {
                                detail: { product: n, addToCartBtn: t }
                              })
                            );
                          }
                        });
                    }
                    i.classList.remove("btn--loading");
                  }.bind(this)
                );
            },
            loadQuickAddForm: function (t) {
              this.quickAddHolder.innerHTML = "";
              t.currentTarget;
              var i = t.currentTarget.closest(".grid-product"),
                n = i.getAttribute("data-product-handle"),
                o = i.getAttribute("data-product-id"),
                s = theme.routes.home + "/products/" + n + "?view=ajax";
              (s = s.replace("//", "/")),
                fetch(s)
                  .then(function (e) {
                    return e.text();
                  })
                  .then(
                    function (t) {
                      var i = new DOMParser()
                        .parseFromString(t, "text/html")
                        .querySelector('.product-section[data-product-handle="' + n + '"]');
                      this.quickAddHolder.append(i),
                        theme.sections.register("product", theme.Product, this.quickAddHolder),
                        window.dispatchEvent(new CustomEvent("quickadd:loaded:" + o)),
                        document.dispatchEvent(
                          new CustomEvent("quickadd:loaded", {
                            detail: { productId: o, handle: n }
                          })
                        ),
                        e.open();
                    }.bind(this)
                  );
            }
          })),
          s
        );
      })()),
      (theme.QuickShop = (function () {
        var e = [],
          t = ".grid-product",
          i = ".quick-product__btn",
          n = "#ProductModals";
        function o(e) {
          theme.settings.quickView && ((this.container = e), this.init());
        }
        function s(t) {
          var i = t.currentTarget;
          if (!theme.config.bpSmall && i && i.dataset.productId) {
            var o = (function (e) {
              return {
                id: e.dataset.productId,
                handle: e.dataset.productHandle
              };
            })(i);
            i.removeEventListener("mouseover", s),
              (function (t) {
                var i = document.querySelectorAll('.modal--quick-shop[data-product-id="' + t.id + '"]');
                if (!i.length) return;
                if (e.indexOf(t.id) > -1)
                  !(function (e) {
                    e.length > 1 &&
                      e.forEach(function (e, t) {
                        e.closest("#ProductModals") || e.remove();
                      });
                  })(i),
                    a(t);
                else {
                  !(function (e) {
                    var t = e[0];
                    if (!t) return;
                    e.length > 1 &&
                      e.forEach(function (e, t) {
                        t > 0 && e.remove();
                      });
                    document.querySelector(n).appendChild(t);
                  })(i);
                  var o = document.getElementById("QuickShopHolder-" + t.handle),
                    s = theme.routes.home + "/products/" + t.handle + "?view=modal";
                  (s = s.replace("//", "/")),
                    fetch(s)
                      .then(function (e) {
                        return e.text();
                      })
                      .then(function (e) {
                        var i = new DOMParser()
                          .parseFromString(e, "text/html")
                          .querySelector('.product-section[data-product-handle="' + t.handle + '"]');
                        o &&
                          (o.append(i),
                          theme.sections.register("product", theme.Product, o),
                          theme.collapsibles.init(),
                          theme.videoModal(),
                          a(t));
                      });
                }
                e.push(t.id);
              })(o);
          }
        }
        function a(e) {
          var t = "QuickShopModal-" + e.id,
            n = "quick-modal-" + e.id;
          new theme.Modals(t, n);
          var o = document.querySelectorAll(i + '[data-handle="' + e.handle + '"]');
          o.length &&
            o.forEach((e) => {
              e.classList.remove("quick-product__btn--not-ready");
            });
        }
        return (
          (o.prototype = Object.assign({}, o.prototype, {
            init: function () {
              var e = this.container.querySelectorAll(t);
              e.length &&
                e.forEach((e) => {
                  e.addEventListener("mouseover", s);
                });
            }
          })),
          o
        );
      })()),
      (theme.buildProductGridItem = function (e, t) {
        var i = "";
        return (
          e.forEach((e) => {
            var n = theme.buildProductImage(e, t),
              o = `\n        <div class="grid-item grid-product">\n          <div class="grid-item__content">\n            <a href="${e.url}" class="grid-item__link">\n              <div class="grid-product__image-wrap">\n                ${n}\n              </div>\n              <div class="grid-item__meta">\n                <div class="grid-product__title">${e.title}</div>\n              </div>\n            </a>\n          </div>\n        </div>\n      `;
            i += o;
          }),
          i
        );
      }),
      (theme.buildProductImage = function (e, t) {
        var i = t || theme.settings.productImageSize,
          n = "";
        if ("natural" === i)
          n = `\n        <div class="image-wrap" style="height: 0; padding-bottom: ${e.image_aspect_ratio}%;">\n          <img class="grid-product__image lazyload"\n            data-src="${e.image_responsive_url}"\n            data-widths="[180, 360, 540, 720, 900]"\n            data-aspectratio="${e.image_aspect_ratio}"\n            data-sizes="auto"\n            alt="${e.title}">\n        </div>`;
        else {
          var o = "lazyload";
          theme.settings.productImageCover || (o += " grid__image-contain"),
            (n = `\n        <div class="grid__image-ratio grid__image-ratio--${i}">\n          <img class="${o}"\n              data-src="${e.image_responsive_url}"\n              data-widths="[360, 540, 720, 900, 1080]"\n              data-aspectratio="${e.aspect_ratio}"\n              data-sizes="auto"\n              alt="${e.title}">\n        </div>\n      `);
        }
        return n;
      }),
      (theme.buildCollectionItem = function (e) {
        var t = "";
        return (
          e.forEach((e) => {
            var i = `\n        <li>\n          <a href="${e.url}">\n            ${e.title}\n          </a>\n        </li>\n      `;
            t += i;
          }),
          t
        );
      }),
      (theme.buildPageItem = function (e) {
        var t = "";
        return (
          e.forEach((e) => {
            var i = `\n        <li>\n          <a href="${e.url}">\n            ${e.title}\n          </a>\n        </li>\n      `;
            t += i;
          }),
          t
        );
      }),
      (theme.buildArticleItem = function (e, t) {
        var i = "";
        return (
          e.forEach((e) => {
            var n = theme.buildPredictiveImage(e),
              o = `\n        <div class="grid__item small--one-half medium-up--one-quarter">\n          <a href="${e.url}" class="grid-item__link grid-item__link--inline">\n            <div class="grid-product__image-wrap">\n              <div\n                class="grid__image-ratio grid__image-ratio--object grid__image-ratio--${t}">\n                <div class="predictive__image-wrap">\n                  ${n}\n                </div>\n              </div>\n            </div>\n            <div class="grid-item__meta">\n              ${e.title}\n            </div>\n          </a>\n        </div>\n      `;
            i += o;
          }),
          i
        );
      }),
      (theme.buildPredictiveImage = function (e) {
        var t = "";
        return (
          e.image &&
            (t = `<img class="lazyload"\n            data-src="${e.image}"\n            data-widths="[360, 540, 720]"\n            data-sizes="auto">`),
          t
        );
      }),
      (theme.animationObserver = function () {
        document.querySelectorAll(".animation-contents").forEach((e) => {
          new IntersectionObserver(
            (e, t) => {
              e.forEach((e) => {
                e.isIntersecting && (e.target.classList.add("is-visible"), t.unobserve(e.target));
              });
            },
            { threshold: 1 }
          ).observe(e);
        });
      }),
      (theme.Maps = (function () {
        var e = 14,
          t = null,
          i = [],
          n = {},
          o = '[data-section-type="map"]',
          s = "[data-map]",
          a = ".map-section__overlay";
        function r(e) {
          (this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            (this.namespace = ".map-" + this.sectionId),
            (this.map = e.querySelector(s)),
            (this.key = this.map.dataset.apiKey),
            (n = {
              addressNoResults: theme.strings.addressNoResults,
              addressQueryLimit: theme.strings.addressQueryLimit,
              addressError: theme.strings.addressError,
              authError: theme.strings.authError
            }),
            this.key &&
              theme.initWhenVisible({
                element: this.container,
                callback: this.prepMapApi.bind(this),
                threshold: 20
              });
        }
        return (
          (window.gm_authFailure = function () {
            Shopify.designMode &&
              (document.querySelectorAll(o).forEach((e) => {
                e.classList.add("map-section--load-error");
              }),
              document.querySelectorAll(s).forEach((e) => {
                e.parentNode.removeChild(e);
              }),
              window.mapError(theme.strings.authError));
          }),
          (window.mapError = function (e) {
            var t = document.createElement("div");
            t.classList.add("map-section__error", "errors", "text-center"),
              (t.innerHTML = e),
              document.querySelectorAll(a).forEach((e) => {
                e.parentNode.prepend(t);
              }),
              document.querySelectorAll(".map-section__link").forEach((e) => {
                e.classList.add("hide");
              });
          }),
          (r.prototype = Object.assign({}, r.prototype, {
            prepMapApi: function () {
              if ("loaded" === t) this.createMap();
              else if (
                (i.push(this),
                "loading" !== t && ((t = "loading"), void 0 === window.google || void 0 === window.google.maps))
              ) {
                var e = document.createElement("script");
                (e.onload = function () {
                  (t = "loaded"),
                    i.forEach((e) => {
                      e.createMap();
                    });
                }),
                  (e.src = "https://maps.googleapis.com/maps/api/js?key=" + this.key),
                  document.head.appendChild(e);
              }
            },
            createMap: function () {
              var t = this.map;
              return (function (e) {
                var t = new google.maps.Geocoder();
                if (e) {
                  var i = e.dataset.addressSetting;
                  return new Promise((e, n) => {
                    t.geocode({ address: i }, function (t, i) {
                      i !== google.maps.GeocoderStatus.OK && n(i), e(t);
                    });
                  });
                }
              })(t)
                .then(
                  function (i) {
                    var n = {
                        zoom: e,
                        backgroundColor: "none",
                        center: i[0].geometry.location,
                        draggable: !1,
                        clickableIcons: !1,
                        scrollwheel: !1,
                        disableDoubleClickZoom: !0,
                        disableDefaultUI: !0
                      },
                      o = (this.map = new google.maps.Map(t, n)),
                      s = (this.center = o.getCenter());
                    new google.maps.Marker({ map: o, position: o.getCenter() });
                    google.maps.event.addDomListener(
                      window,
                      "resize",
                      theme.utils.debounce(250, function () {
                        google.maps.event.trigger(o, "resize"), o.setCenter(s), t.removeAttribute("style");
                      })
                    ),
                      Shopify.designMode && window.AOS && AOS.refreshHard();
                  }.bind(this)
                )
                .catch(function (e) {
                  var t;
                  switch (e) {
                    case "ZERO_RESULTS":
                      t = n.addressNoResults;
                      break;
                    case "OVER_QUERY_LIMIT":
                      t = n.addressQueryLimit;
                      break;
                    case "REQUEST_DENIED":
                      t = n.authError;
                      break;
                    default:
                      t = n.addressError;
                  }
                  Shopify.designMode && window.mapError(t);
                });
            },
            onUnload: function () {
              0 !== this.map.length &&
                google &&
                google.maps &&
                google.maps.event &&
                google.maps.event.clearListeners(this.map, "resize");
            }
          })),
          r
        );
      })()),
      (theme.NewsletterPopup = (function () {
        function e(e) {
          this.container = e;
          var t = this.container.getAttribute("data-section-id");
          (this.cookieName = "newsletter-" + t),
            e &&
              "/challenge" !== window.location.pathname &&
              ((this.data = {
                secondsBeforeShow: e.dataset.delaySeconds,
                daysBeforeReappear: e.dataset.delayDays,
                cookie: Cookies.get(this.cookieName),
                testMode: e.dataset.testMode
              }),
              (this.modal = new theme.Modals("NewsletterPopup-" + t, "newsletter-popup-modal")),
              (e.querySelector(".errors") || e.querySelector(".note--success")) && this.modal.open(),
              e.querySelector(".note--success")
                ? this.closePopup(!0)
                : (document.addEventListener("modalClose." + e.id, this.closePopup.bind(this)),
                  (this.data.cookie && "true" !== this.data.testMode) || this.initPopupDelay()));
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            initPopupDelay: function () {
              (Shopify && Shopify.designMode) ||
                setTimeout(
                  function () {
                    this.modal.open();
                  }.bind(this),
                  1e3 * this.data.secondsBeforeShow
                );
            },
            closePopup: function (e) {
              if ("true" !== this.data.testMode) {
                var t = e ? 200 : this.data.daysBeforeReappear;
                Cookies.set(this.cookieName, "opened", {
                  path: "/",
                  expires: t
                });
              } else Cookies.remove(this.cookieName, { path: "/" });
            },
            onLoad: function () {
              this.modal.open();
            },
            onSelect: function () {
              this.modal.open();
            },
            onDeselect: function () {
              this.modal.close();
            }
          })),
          e
        );
      })()),
      (theme.PasswordHeader = (function () {
        function e() {
          this.init();
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            init: function () {
              if (document.querySelector("#LoginModal")) {
                var e = new theme.Modals("LoginModal", "login-modal", {
                  focusIdOnOpen: "password",
                  solid: !0
                });
                document.querySelectorAll(".errors").length && e.open();
              }
            }
          })),
          e
        );
      })()),
      (theme.Photoswipe = (function () {
        var e = ".js-photoswipe__zoom",
          t = ".photoswipe__image",
          i = ".flickity-viewport ",
          n = ".is-selected";
        function o(e, t) {
          (this.container = e),
            (this.sectionId = t),
            (this.namespace = ".photoswipe-" + this.sectionId),
            this.gallery,
            this.images,
            this.items,
            (this.inSlideshow = !1),
            e &&
              "false" !== e.dataset.zoom &&
              ("true" === e.dataset.hasSlideshow && (this.inSlideshow = !0), this.init());
        }
        return (
          (o.prototype = Object.assign({}, o.prototype, {
            init: function () {
              this.container.querySelectorAll(e).forEach((e) => {
                e.on("click" + this.namespace, this.triggerClick.bind(this));
              });
            },
            triggerClick: function (e) {
              this.items = this.getImageData();
              var t = this.inSlideshow ? this.container.querySelector(n) : e.currentTarget,
                i = this.inSlideshow ? this.getChildIndex(t) : t.dataset.index;
              this.initGallery(this.items, i);
            },
            getChildIndex: function (e) {
              for (var t = 0; null != (e = e.previousSibling); ) t++;
              return t + 1;
            },
            getImageData: function () {
              this.images = this.inSlideshow
                ? this.container.querySelectorAll(i + t)
                : this.container.querySelectorAll(t);
              var e = [];
              return (
                this.images.forEach((t) => {
                  var i = {
                    msrc: t.currentSrc || t.src,
                    src: t.getAttribute("data-photoswipe-src"),
                    w: t.getAttribute("data-photoswipe-width"),
                    h: t.getAttribute("data-photoswipe-height"),
                    el: t,
                    initialZoomLevel: 0.5
                  };
                  e.push(i);
                }),
                e
              );
            },
            initGallery: function (e, t) {
              var i = document.querySelectorAll(".pswp")[0],
                n = {
                  allowPanToNext: !1,
                  captionEl: !1,
                  closeOnScroll: !1,
                  counterEl: !1,
                  history: !1,
                  index: t - 1,
                  pinchToClose: !1,
                  preloaderEl: !1,
                  scaleMode: "zoom",
                  shareEl: !1,
                  tapToToggleControls: !1,
                  getThumbBoundsFn: function (t) {
                    var i = window.pageYOffset || document.documentElement.scrollTop,
                      n = e[t].el.getBoundingClientRect();
                    return { x: n.left, y: n.top + i, w: n.width };
                  }
                };
              (this.gallery = new PhotoSwipe(i, PhotoSwipeUI_Default, e, n)),
                this.gallery.init(),
                this.gallery.listen("afterChange", this.afterChange.bind(this));
            },
            afterChange: function () {
              var e = this.gallery.getCurrentIndex();
              this.container.dispatchEvent(
                new CustomEvent("photoswipe:afterChange", {
                  detail: { index: e }
                })
              );
            }
          })),
          o
        );
      })()),
      (theme.Recommendations = (function () {
        var e = {
          placeholder: ".product-recommendations-placeholder",
          sectionClass: " .product-recommendations",
          productResults: ".grid-product"
        };
        function t(t) {
          (this.container = t),
            (this.sectionId = t.getAttribute("data-section-id")),
            (this.url = t.dataset.url),
            (e.recommendations = "Recommendations-" + this.sectionId),
            theme.initWhenVisible({
              element: t,
              callback: this.init.bind(this),
              threshold: 500
            });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var t = document.getElementById(e.recommendations);
              if (t && "false" !== t.dataset.enable) {
                var i = t.dataset.productId,
                  n = t.dataset.limit,
                  o = this.url + "?section_id=product-recommendations&limit=" + n + "&product_id=" + i;
                fetch(o)
                  .then(function (e) {
                    return e.text();
                  })
                  .then(
                    function (i) {
                      var n = new DOMParser().parseFromString(i, "text/html").querySelector(e.sectionClass),
                        o = t.querySelector(e.placeholder);
                      o &&
                        ((o.innerHTML = ""),
                        n
                          ? (o.appendChild(n),
                            theme.reinitProductGridItem(t),
                            document.dispatchEvent(
                              new CustomEvent("recommendations:loaded", {
                                detail: { section: t }
                              })
                            ),
                            0 === n.querySelectorAll(e.productResults).length && this.container.classList.add("hide"))
                          : this.container.classList.add("hide"));
                    }.bind(this)
                  );
              }
            }
          })),
          t
        );
      })()),
      (theme.SlideshowSection = (function () {
        var e = ".parallax-container";
        function t(e) {
          this.container = e;
          var t = e.getAttribute("data-section-id");
          if (
            ((this.slideshow = e.querySelector("#Slideshow-" + t)),
            (this.namespace = "." + t),
            (this.initialIndex = 0),
            this.slideshow)
          ) {
            var i = e.parentElement;
            0 === [].indexOf.call(i.parentElement.children, i)
              ? this.init()
              : theme.initWhenVisible({
                  element: this.container,
                  callback: this.init.bind(this)
                });
          }
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var t = this.slideshow.querySelectorAll(".slideshow__slide");
              if (
                (this.container.hasAttribute("data-immediate-load")
                  ? (this.slideshow.classList.remove("loading", "loading--delayed"),
                    this.slideshow.classList.add("loaded"))
                  : theme.loadImageSection(this.slideshow),
                t.length > 1)
              ) {
                var i = {
                  prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
                  pageDots: this.slideshow.hasAttribute("data-dots"),
                  fade: !0,
                  setGallerySize: !1,
                  initialIndex: this.initialIndex,
                  autoPlay: "true" === this.slideshow.dataset.autoplay && parseInt(this.slideshow.dataset.speed)
                };
                this.flickity = new theme.Slideshow(this.slideshow, i);
              } else t[0].classList.add("is-selected");
              this.container.hasAttribute("data-parallax") &&
                this.container.querySelectorAll(e).forEach(
                  function (e, t) {
                    new theme.Parallax(e, {
                      namespace: this.namespace + "-parallax-" + t
                    });
                  }.bind(this)
                );
            },
            forceReload: function () {
              this.onUnload(), this.init();
            },
            onUnload: function () {
              this.flickity && "function" == typeof this.flickity.destroy && this.flickity.destroy();
            },
            onDeselect: function () {
              this.flickity && "function" == typeof this.flickity.play && this.flickity.play();
            },
            onBlockSelect: function (e) {
              var t = this.slideshow.querySelector(".slideshow__slide--" + e.detail.blockId),
                i = parseInt(t.dataset.index);
              this.flickity && "function" == typeof this.flickity.pause
                ? (this.flickity.goToSlide(i), this.flickity.pause())
                : ((this.initialIndex = i),
                  setTimeout(
                    function () {
                      this.flickity && "function" == typeof this.flickity.pause && this.flickity.pause();
                    }.bind(this),
                    1e3
                  ));
            },
            onBlockDeselect: function () {
              this.flickity &&
                "function" == typeof this.flickity.play &&
                this.flickity.args.autoPlay &&
                this.flickity.play();
            }
          })),
          t
        );
      })()),
      (theme.StoreAvailability = (function () {
        var e = ".js-drawer-open-availability",
          t = ".js-modal-open-availability",
          i = "[data-availability-product-title]";
        function n(e) {
          (this.container = e), (this.baseUrl = e.dataset.baseUrl), (this.productTitle = e.dataset.productName);
        }
        return (
          (n.prototype = Object.assign({}, n.prototype, {
            updateContent: function (n) {
              var o = this.baseUrl + "/variants/" + n + "/?section_id=store-availability",
                s = this;
              fetch(o)
                .then(function (e) {
                  return e.text();
                })
                .then(function (n) {
                  if ("" !== n.trim()) {
                    (s.container.innerHTML = n),
                      (s.container.innerHTML = s.container.firstElementChild.innerHTML),
                      s.container.querySelector(e) &&
                        (s.drawer = new theme.Drawers("StoreAvailabilityDrawer", "availability")),
                      s.container.querySelector(t) &&
                        (s.modal = new theme.Modals("StoreAvailabilityModal", "availability"));
                    var o = s.container.querySelector(i);
                    o && (o.textContent = s.productTitle);
                  } else this.container.innerHTML = "";
                });
            }
          })),
          n
        );
      })()),
      (theme.VideoSection = (function () {
        var e = ".video-parent-section";
        function t(e) {
          (this.container = e),
            (this.sectionId = e.getAttribute("data-section-id")),
            (this.namespace = ".video-" + this.sectionId),
            this.videoObject,
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 500
            });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              var e = this.container.querySelector(".video-div");
              if (e)
                switch (e.dataset.type) {
                  case "youtube":
                    var t = e.dataset.videoId;
                    this.initYoutubeVideo(t);
                    break;
                  case "vimeo":
                    t = e.dataset.videoId;
                    this.initVimeoVideo(t);
                    break;
                  case "mp4":
                    this.initMp4Video();
                }
            },
            initYoutubeVideo: function (t) {
              this.videoObject = new theme.YouTube("YouTubeVideo-" + this.sectionId, { videoId: t, videoParent: e });
            },
            initVimeoVideo: function (t) {
              this.videoObject = new theme.VimeoPlayer("Vimeo-" + this.sectionId, t, { videoParent: e });
            },
            initMp4Video: function () {
              var t = "Mp4Video-" + this.sectionId,
                i = document.getElementById(t),
                n = i.closest(e);
              if (i) {
                n.classList.add("loaded");
                var o = document.querySelector("#" + t).play();
                void 0 !== o &&
                  o
                    .then(function () {})
                    .catch(function () {
                      i.setAttribute("controls", ""), n.classList.add("video-interactable");
                    });
              }
            },
            onUnload: function (e) {
              e.target.id.replace("shopify-section-", "");
              this.videoObject && "function" == typeof this.videoObject.destroy && this.videoObject.destroy();
            }
          })),
          t
        );
      })()),
      (theme.BackgroundImage = (function () {
        var e = ".parallax-container";
        function t(e) {
          if (((this.container = e), e)) {
            var t = e.getAttribute("data-section-id");
            (this.namespace = "." + t),
              theme.initWhenVisible({
                element: this.container,
                callback: this.init.bind(this)
              });
          }
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              if ((theme.loadImageSection(this.container), this.container.dataset && this.container.dataset.parallax)) {
                var t = this.container.querySelector(e),
                  i = {
                    namespace: this.namespace + "-parallax",
                    desktopOnly: !0
                  };
                theme.parallaxSections[this.namespace] = new theme.Parallax(t, i);
              }
            },
            onUnload: function (e) {
              this.container &&
                (theme.parallaxSections[this.namespace] &&
                  "function" == typeof theme.parallaxSections[this.namespace].destroy &&
                  theme.parallaxSections[this.namespace].destroy(),
                delete theme.parallaxSections[this.namespace]);
            }
          })),
          t
        );
      })()),
      (theme.CollectionHeader = (function () {
        var e = !1;
        function t(t) {
          this.namespace = ".collection-header";
          var i = t.querySelector(".collection-hero");
          if (i) {
            if ((e && this.checkIfNeedReload(), theme.loadImageSection(i), t.dataset && t.dataset.parallax)) {
              var n = t.querySelector(".parallax-container"),
                o = { namespace: this.namespace + "-parallax" };
              theme.parallaxSections[this.namespace] = new theme.Parallax(n, o);
            }
          } else theme.settings.overlayHeader && theme.headerNav.disableOverlayHeader();
          e = !0;
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            checkIfNeedReload: function () {
              Shopify.designMode &&
                theme.settings.overlayHeader &&
                (document.querySelector(".header-wrapper").classList.contains("header-wrapper--overlay") ||
                  location.reload());
            },
            onUnload: function () {
              theme.parallaxSections[this.namespace] &&
                (theme.parallaxSections[this.namespace].destroy(), delete theme.parallaxSections[this.namespace]);
            }
          })),
          t
        );
      })()),
      (theme.CollectionSidebar = (function () {
        var e = ".collection-filter__btn",
          t = "#CollectionInlineFilterWrap",
          i = ".filter-wrapper",
          n = ".collection-filter",
          o = { isOpen: !1, namespace: ".collection-filters" };
        function s(e) {
          (this.container = e), document.addEventListener("filter:selected", this.close.bind(this)), this.init();
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function (n) {
              (this.trigger = document.querySelector(e)),
                (this.wrapper = document.querySelector(t)),
                (this.filters = this.wrapper.querySelector(i)),
                n && ((o.isOpen = !1), this.trigger.off("click")),
                this.trigger.on("click", this.toggle.bind(this));
            },
            forceReload: function () {
              theme.a11y.unlockMobileScrolling(o.namespace), this.init(!0);
            },
            toggle: function () {
              o.isOpen ? this.close() : this.open();
            },
            open: function () {
              if (this.filters) {
                var e, t, i;
                (e = document.getElementById("HeaderWrapper").offsetHeight),
                  (t = document.querySelector(n).offsetHeight),
                  (i = window.innerHeight - e - t),
                  document.documentElement.style.setProperty("--maxFiltersHeight", i + "px");
                var s,
                  a =
                    ((s = window.pageYOffset || document.documentElement.scrollTop),
                    document.querySelector(n).getBoundingClientRect().top + s);
                window.scrollTo({ top: a, behavior: "smooth" }),
                  this.trigger.classList.add("is-active"),
                  theme.utils.prepareTransition(
                    this.filters,
                    function () {
                      this.filters.classList.add("is-active");
                    }.bind(this)
                  ),
                  (o.isOpen = !0),
                  theme.a11y.lockMobileScrolling(o.namespace),
                  window.on(
                    "keyup" + o.namespace,
                    function (e) {
                      27 === e.keyCode && this.close();
                    }.bind(this)
                  );
              }
            },
            close: function () {
              this.filters &&
                (this.trigger.classList.remove("is-active"),
                theme.utils.prepareTransition(
                  this.filters,
                  function () {
                    this.filters.classList.remove("is-active");
                  }.bind(this)
                ),
                (o.isOpen = !1),
                theme.a11y.unlockMobileScrolling(o.namespace),
                window.off("keyup" + o.namespace));
            },
            onSelect: function () {
              this.open();
            },
            onDeselect: function () {
              this.close();
            }
          })),
          s
        );
      })()),
      (theme.Collection = (function () {
        var e = !1,
          t = "#SortBy",
          i = ".filter-sort",
          n = ".grid-product__color-image",
          o = ".color-swatch--with-image",
          s = ".grid-view-btn",
          a = ".product-grid",
          r = ".collection-grid__wrapper",
          c = "#CollectionSidebar",
          d = ".tag-list--active-tags",
          l = ".tag-list a",
          h = ".collection-filter",
          u = ".filter-wrapper",
          m = "#CollectionSidebarFilterWrap",
          p = "#CollectionInlineFilterWrap",
          f = { isInit: !1, combineTags: !1, mobileFiltersInPlace: !1 },
          v = "tag--active",
          g = "tag--remove";
        function y(e) {
          (this.container = e),
            (this.containerId = e.id),
            (this.sectionId = e.getAttribute("data-section-id")),
            (this.namespace = ".collection-" + this.sectionId),
            (this.isCollectionTemplate = this.container.dataset.collectionTemplate),
            this.init(e);
        }
        return (
          (y.prototype = Object.assign({}, y.prototype, {
            init: function (e) {
              e || (this.container = document.getElementById(this.containerId)),
                this.isCollectionTemplate &&
                  (this.cloneFiltersOnMobile(),
                  this.initSort(),
                  this.initFilters(),
                  this.initGridOptions(),
                  f.isInit && theme.sections.reinit("collection-sidebar")),
                (this.quickAdd = new theme.QuickAdd(this.container)),
                (this.quickShop = new theme.QuickShop(this.container)),
                (this.colorImages = this.container.querySelectorAll(n)),
                this.colorImages.length &&
                  ((this.swatches = this.container.querySelectorAll(o)), this.colorSwatchHovering()),
                (f.isInit = !0);
            },
            initSort: function () {
              (this.sortSelect = document.querySelector(t)),
                (this.sortBtns = document.querySelectorAll(i)),
                (this.sortSelect || this.sortBtn) && this.initParams(),
                this.sortSelect &&
                  ((this.defaultSort = this.getDefaultSortValue()),
                  this.sortSelect.on("change" + this.namespace, this.onSortChange.bind(this))),
                this.sortBtns.length &&
                  this.sortBtns.forEach((e) => {
                    e.addEventListener(
                      "click",
                      function () {
                        document.dispatchEvent(new Event("filter:selected")),
                          (this.queryParams.sort_by = e.dataset.value),
                          this.goToSortUrl();
                      }.bind(this)
                    );
                  });
            },
            initParams: function () {
              if (((this.queryParams = {}), location.search.length))
                for (var e, t = location.search.substr(1).split("&"), i = 0; i < t.length; i++)
                  (e = t[i].split("=")).length > 1 &&
                    (this.queryParams[decodeURIComponent(e[0])] = decodeURIComponent(e[1]));
            },
            getSortValue: function () {
              return this.sortSelect.value || this.defaultSort;
            },
            getDefaultSortValue: function () {
              return this.sortSelect.getAttribute("data-default-sortby");
            },
            onSortChange: function () {
              (this.queryParams.sort_by = this.getSortValue()), this.goToSortUrl();
            },
            goToSortUrl: function () {
              this.queryParams.page && delete this.queryParams.page,
                (window.location.search = new URLSearchParams(Object.entries(this.queryParams)));
            },
            colorSwatchHovering: function () {
              this.swatches.forEach((e) => {
                e.addEventListener(
                  "mouseenter",
                  function () {
                    this.setActiveColorImage(e);
                  }.bind(this)
                ),
                  e.addEventListener(
                    "touchstart",
                    function (t) {
                      t.preventDefault(), this.setActiveColorImage(e);
                    }.bind(this),
                    { passive: !0 }
                  );
              });
            },
            setActiveColorImage: function (e) {
              var t = e.dataset.variantId,
                i = e.dataset.variantImage;
              this.colorImages.forEach((e) => {
                e.classList.remove("is-active");
              }),
                this.swatches.forEach((e) => {
                  e.classList.remove("is-active");
                });
              var n = this.container.querySelector(".grid-product__color-image--" + t);
              (n.style.backgroundImage = "url(" + i + ")"), n.classList.add("is-active"), e.classList.add("is-active");
              var o = e.dataset.url;
              e.closest(".grid-item__link").setAttribute("href", o);
            },
            initGridOptions: function () {
              var e = this.container.querySelector(a),
                t = this.container.querySelectorAll(s);
              this.container.querySelectorAll(s).forEach((i) => {
                i.addEventListener("click", function () {
                  t.forEach((e) => {
                    e.classList.remove("is-active");
                  }),
                    i.classList.add("is-active");
                  var n = i.dataset.view;
                  (e.dataset.view = n),
                    theme.cart.updateAttribute("product_view", n),
                    window.dispatchEvent(new Event("resize"));
                });
              });
            },
            initFilters: function () {
              document.querySelectorAll(l).length &&
                (document.addEventListener("matchSmall", this.cloneFiltersOnMobile.bind(this)),
                window.off("popstate" + this.namespace),
                window.on(
                  "popstate" + this.namespace,
                  function (e) {
                    e && this.getNewCollectionContent(location.href);
                  }.bind(this)
                ),
                theme.config.stickyHeader &&
                  (this.setFilterStickyPosition(),
                  document.addEventListener(
                    "headerStickyChange",
                    theme.utils.debounce(500, this.setFilterStickyPosition)
                  ),
                  window.on("resize", theme.utils.debounce(500, this.setFilterStickyPosition))),
                (f.combineTags = "true" == document.querySelector(c).getAttribute("data-combine-tags")),
                document.querySelectorAll(l).forEach((e) => {
                  e.addEventListener("click", this.tagClick.bind(this));
                }));
            },
            cloneFiltersOnMobile: function () {
              if (!f.mobileFiltersInPlace) {
                var e = document.querySelector(m);
                if (e) {
                  var t = e.querySelector(u).cloneNode(!0),
                    i = document.querySelector(p);
                  (i.innerHTML = ""), i.append(t), theme.collapsibles.init(i), (f.mobileFiltersInPlace = !0);
                }
              }
            },
            tagClick: function (t) {
              var i = t.currentTarget;
              if (
                (document.dispatchEvent(new Event("filter:selected")),
                !i.classList.contains("no-ajax") && (t.preventDefault(), !e))
              ) {
                e = !0;
                var n = i.parentNode,
                  o = i.href;
                if (f.combineTags)
                  if (n.classList.contains(v)) n.classList.remove(v);
                  else if ((n.classList.add(v), i.closest("li").classList.contains(g))) n.remove();
                  else {
                    var s = document.createElement("li"),
                      a = document.createElement("a");
                    s.classList.add("tag", "tag--remove"),
                      a.classList.add("btn", "btn--small"),
                      (a.innerText = i.innerText),
                      s.appendChild(a),
                      document.querySelectorAll(d).forEach((e) => {
                        e.appendChild(s);
                      });
                  }
                else
                  document.querySelectorAll(l).forEach((e) => {
                    e.parentNode.classList.remove(v);
                  }),
                    n.classList.add(v);
                this.updateScroll(!0),
                  history.pushState({}, "", o),
                  document.querySelector(r).classList.add("unload"),
                  this.getNewCollectionContent(o);
              }
            },
            getNewCollectionContent: function (t) {
              t = -1 === t.indexOf("?") ? t + "?view=ajax" : t + "&view=ajax";
              var i = document.getElementById("CollectionAjaxResult");
              fetch(t)
                .then(function (e) {
                  return e.text();
                })
                .then(
                  function (t) {
                    var n = new DOMParser().parseFromString(t, "text/html").getElementById("CollectionAjaxContent");
                    (i.innerHTML = ""),
                      i.append(n),
                      theme.sections.reinit("collection-template-v2"),
                      this.updateScroll(!1),
                      theme.reinitProductGridItem(),
                      (e = !1);
                  }.bind(this)
                );
            },
            updateScroll: function (e) {
              var t = document.getElementById("CollectionAjaxContent").offsetTop;
              theme.config.stickyHeader && (t -= document.querySelector("#SiteHeader").offsetHeight),
                theme.config.bpSmall || (t -= 10),
                e ? window.scrollTo({ top: t, behavior: "smooth" }) : window.scrollTo({ top: t });
            },
            setFilterStickyPosition: function () {
              var e = document.querySelector(".site-header").offsetHeight - 1;
              document.querySelector(h).style.top = e + "px";
              var t = document.querySelector(".grid__item--sidebar");
              t && (t.style.top = e + 30 + "px");
            },
            forceReload: function () {
              (f.mobileFiltersInPlace = !1), this.init();
            }
          })),
          y
        );
      })()),
      (theme.FooterSection = (function () {
        var e = "[data-disclosure-locale]",
          t = "[data-disclosure-currency]",
          i = "MobileNav",
          n = "FooterMobileNavWrap",
          o = "FooterMobileNav";
        function s(e) {
          (this.container = e),
            (this.localeDisclosure = null),
            (this.currencyDisclosure = null),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 1e3
            });
        }
        return (
          (s.prototype = Object.assign({}, s.prototype, {
            init: function () {
              var i = this.container.querySelector(e),
                n = this.container.querySelector(t);
              i && (this.localeDisclosure = new theme.Disclosure(i)),
                n && (this.currencyDisclosure = new theme.Disclosure(n)),
                theme.config.bpSmall && this.initDoubleMobileNav(),
                theme.collapsibles.init(this.container);
            },
            initDoubleMobileNav: function () {
              var e = document.getElementById(n);
              if (e) {
                var t = document.getElementById(i),
                  s = document.getElementById(o),
                  a = t.cloneNode(!0).querySelector(".slide-nav__wrapper");
                s.appendChild(a), new theme.MobileNav({ id: o, inHeader: !1 }), e.classList.remove("hide");
              }
            },
            onUnload: function () {
              this.localeDisclosure && this.localeDisclosure.destroy(),
                this.currencyDisclosure && this.currencyDisclosure.destroy();
            }
          })),
          s
        );
      })()),
      (theme.HeaderSection = (function () {
        var e = "#MobileNavFooter",
          t = "#FooterMenus";
        function i(e) {
          (this.container = e), (this.sectionId = this.container.getAttribute("data-section-id")), this.init();
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              Shopify &&
                Shopify.designMode &&
                (theme.sections.reinit("slideshow-section"),
                setTimeout(function () {
                  window.dispatchEvent(new Event("resize"));
                }, 500)),
                theme.headerNav.init(),
                theme.announcementBar.init(),
                theme.headerSearch.init(),
                document.body.classList.contains("template-cart") || new theme.HeaderCart(),
                new theme.MobileNav({ id: "MobileNav", inHeader: !0 }),
                theme.config.bpSmall && this.cloneFooter(),
                window.on("resize.header", theme.utils.debounce(300, theme.sizeDrawer));
            },
            cloneFooter: function () {
              var i = document.querySelector(e);
              if (i) {
                var n = document.querySelector(t).cloneNode(!0);
                (n.id = ""), i.appendChild(n);
                var o = i.querySelector(".multi-selectors");
                o &&
                  o.querySelectorAll("[data-disclosure-toggle]").forEach((e) => {
                    var t = e.getAttribute("aria-controls"),
                      i = e.getAttribute("aria-describedby");
                    e.setAttribute("aria-controls", t + "-header"), e.setAttribute("aria-describedby", i + "-header");
                    var n = document.getElementById(t);
                    n && (n.id = t + "-header");
                    var o = document.getElementById(i);
                    o && (o.id = i + "-header");
                    var s = e.parentNode;
                    s && new theme.Disclosure(s);
                  });
              }
            },
            onUnload: function () {}
          })),
          i
        );
      })()),
      (theme.Toolbar = (function () {
        var e = "[data-disclosure-locale]",
          t = "[data-disclosure-currency]";
        function i(e) {
          (this.container = e), (this.sectionId = this.container.getAttribute("data-section-id")), this.init();
        }
        return (
          (i.prototype = Object.assign({}, i.prototype, {
            init: function () {
              this.initDisclosures(), theme.announcementBar.init();
            },
            initDisclosures: function () {
              var i = this.container.querySelector(e),
                n = this.container.querySelector(t);
              i && (this.localeDisclosure = new theme.Disclosure(i)),
                n && (this.currencyDisclosure = new theme.Disclosure(n));
            },
            onBlockSelect: function (e) {
              theme.announcementBar.onBlockSelect(e.detail.blockId);
            },
            onBlockDeselect: function () {
              theme.announcementBar.onBlockDeselect();
            },
            onUnload: function () {
              theme.announcementBar.unload(),
                this.localeDisclosure && this.localeDisclosure.destroy(),
                this.currencyDisclosure && this.currencyDisclosure.destroy();
            }
          })),
          i
        );
      })()),
      (theme.Product = (function () {
        var e = {},
          t = "on-sale",
          i = "disabled",
          n = "is-modal",
          o = "hide",
          s = ".product__video",
          a = ".product__video-wrapper",
          r = ".product-main-slide",
          c = ".is-selected",
          d = ".starting-slide";
        function l(e) {
          this.container = e;
          var t = (this.sectionId = e.getAttribute("data-section-id"));
          (this.inModal = "true" === e.dataset.modal),
            this.modal,
            (this.settings = {
              enableHistoryState: "true" === e.dataset.history || !1,
              namespace: ".product-" + t,
              inventory: e.dataset.inventory || !1,
              incomingInventory: e.dataset.incomingInventory || !1,
              modalInit: !1,
              hasImages: !0,
              imageSetName: null,
              imageSetIndex: null,
              currentImageSet: null,
              imageSize: "620x",
              currentSlideIndex: 0,
              videoLooping: e.dataset.videoLooping
            }),
            this.inModal &&
              ((this.settings.enableHistoryState = !1),
              (this.settings.namespace = ".product-" + t + "-modal"),
              (this.modal = document.getElementById("QuickShopModal-" + t))),
            (this.selectors = {
              variantsJson: "VariantsJson-" + t,
              currentVariantJson: "CurrentVariantJson-" + t,
              form: "#AddToCartForm-" + t,
              media: "[data-product-media-type-model]",
              closeMedia: ".product-single__close-media",
              photoThumbs: ".product__thumb-" + t,
              thumbSlider: "#ProductThumbs-" + t,
              thumbScroller: ".product__thumbs--scroller",
              mainSlider: "#ProductPhotos-" + t,
              imageContainer: "[data-product-images]",
              productImageMain: ".product-image-main--" + t,
              priceWrapper: ".product__price-wrap-" + t,
              price: "#ProductPrice-" + t,
              comparePrice: "#ComparePrice-" + t,
              savePrice: "#SavePrice-" + t,
              priceA11y: "#PriceA11y-" + t,
              comparePriceA11y: "#ComparePriceA11y-" + t,
              unitWrapper: ".product__unit-price-wrapper--" + t,
              unitPrice: ".product__unit-price--" + t,
              unitPriceBaseUnit: ".product__unit-base--" + t,
              sku: "[data-sku]",
              inventory: "ProductInventory-" + t,
              incomingInventory: "ProductIncomingInventory-" + t,
              addToCart: "AddToCart-" + t,
              addToCartText: "AddToCartText-" + t,
              originalSelectorId: "#ProductSelect-" + t,
              singleOptionSelector: ".variant__input-" + t,
              variantColorSwatch: ".variant__input--color-swatch-" + t,
              modalFormHolder: "#ProductFormHolder-" + t,
              availabilityContainer: "#StoreAvailabilityHolder-" + t
            }),
            this.cacheElements(),
            (this.firstProductImage = this.cache.mainSlider.querySelector("img")),
            this.firstProductImage || (this.settings.hasImages = !1);
          var i = this.cache.mainSlider.querySelector("[data-set-name]");
          i && (this.settings.imageSetName = i.dataset.setName), this.init();
        }
        return (
          (l.prototype = Object.assign({}, l.prototype, {
            init: function () {
              this.inModal &&
                (this.container.classList.add(n),
                document.addEventListener(
                  "modalOpen.QuickShopModal-" + this.sectionId,
                  this.openModalProduct.bind(this)
                ),
                document.addEventListener(
                  "modalClose.QuickShopModal-" + this.sectionId,
                  this.closeModalProduct.bind(this)
                )),
                this.inModal ||
                  (this.formSetup(),
                  this.productSetup(),
                  this.videoSetup(),
                  this.initProductSlider(),
                  this.customMediaListners(),
                  this.addIdToRecentlyViewed()),
                window.off("quickadd:loaded:" + this.sectionId),
                window.on("quickadd:loaded:" + this.sectionId, this.initQuickAddForm.bind(this));
            },
            cacheElements: function () {
              this.cache = {
                form: this.container.querySelector(this.selectors.form),
                mainSlider: this.container.querySelector(this.selectors.mainSlider),
                thumbSlider: this.container.querySelector(this.selectors.thumbSlider),
                thumbScroller: this.container.querySelector(this.selectors.thumbScroller),
                productImageMain: this.container.querySelector(this.selectors.productImageMain),
                priceWrapper: this.container.querySelector(this.selectors.priceWrapper),
                comparePriceA11y: this.container.querySelector(this.selectors.comparePriceA11y),
                comparePrice: this.container.querySelector(this.selectors.comparePrice),
                price: this.container.querySelector(this.selectors.price),
                savePrice: this.container.querySelector(this.selectors.savePrice),
                priceA11y: this.container.querySelector(this.selectors.priceA11y)
              };
            },
            formSetup: function () {
              this.initQtySelector(),
                this.initAjaxProductForm(),
                this.availabilitySetup(),
                this.initVariants(),
                this.settings.imageSetName && this.updateImageSet();
            },
            availabilitySetup: function () {
              var e = this.container.querySelector(this.selectors.availabilityContainer);
              e && (this.storeAvailability = new theme.StoreAvailability(e));
            },
            productSetup: function () {
              this.setImageSizes(), this.initImageZoom(), this.initModelViewerLibraries(), this.initShopifyXrLaunch();
            },
            setImageSizes: function () {
              if (this.settings.hasImages) {
                var e = this.firstProductImage.currentSrc;
                e && (this.settings.imageSize = theme.Images.imageSize(e));
              }
            },
            addIdToRecentlyViewed: function () {
              var e = this.container.getAttribute("data-product-id");
              if (e) {
                var t = theme.recentlyViewedIds.indexOf(e);
                t > -1 && theme.recentlyViewedIds.splice(t, 1),
                  theme.recentlyViewedIds.unshift(e),
                  theme.config.hasLocalStorage &&
                    window.localStorage.setItem("recently-viewed", JSON.stringify(theme.recentlyViewedIds));
              }
            },
            initVariants: function () {
              var e = document.getElementById(this.selectors.variantsJson);
              if (e) {
                this.variantsObject = JSON.parse(e.innerHTML);
                var t = {
                    container: this.container,
                    enableHistoryState: this.settings.enableHistoryState,
                    singleOptionSelector: this.selectors.singleOptionSelector,
                    originalSelectorId: this.selectors.originalSelectorId,
                    variants: this.variantsObject
                  },
                  i = this.container.querySelectorAll(this.selectors.variantColorSwatch);
                if (
                  (i.length &&
                    i.forEach((e) => {
                      e.addEventListener(
                        "change",
                        function (t) {
                          var i = e.dataset.colorName,
                            n = e.dataset.colorIndex;
                          this.updateColorName(i, n);
                        }.bind(this)
                      );
                    }),
                  (this.variants = new theme.Variants(t)),
                  this.storeAvailability)
                ) {
                  var n = this.variants.currentVariant ? this.variants.currentVariant.id : this.variants.variants[0].id;
                  this.storeAvailability.updateContent(n),
                    this.container.on("variantChange" + this.settings.namespace, this.updateAvailability.bind(this));
                }
                if (
                  (this.container.on("variantChange" + this.settings.namespace, this.updateCartButton.bind(this)),
                  this.container.on("variantImageChange" + this.settings.namespace, this.updateVariantImage.bind(this)),
                  this.container.on("variantPriceChange" + this.settings.namespace, this.updatePrice.bind(this)),
                  this.container.on(
                    "variantUnitPriceChange" + this.settings.namespace,
                    this.updateUnitPrice.bind(this)
                  ),
                  this.container.querySelectorAll(this.selectors.sku).length &&
                    this.container.on("variantSKUChange" + this.settings.namespace, this.updateSku.bind(this)),
                  (this.settings.inventory || this.settings.incomingInventory) &&
                    this.container.on("variantChange" + this.settings.namespace, this.updateInventory.bind(this)),
                  theme.settings.dynamicVariantsEnable)
                ) {
                  var o = document.getElementById(this.selectors.currentVariantJson);
                  o &&
                    new theme.VariantAvailability({
                      type: theme.settings.dynamicVariantType,
                      variantSelectors: this.cache.form.querySelectorAll(this.selectors.singleOptionSelector),
                      variantsObject: this.variantsObject,
                      currentVariantObject: JSON.parse(o.innerHTML),
                      form: this.cache.form
                    });
                }
                this.settings.imageSetName &&
                  ((this.settings.imageSetIndex = this.cache.form.querySelector(
                    '.variant-input-wrap[data-handle="' + this.settings.imageSetName + '"]'
                  ).dataset.index),
                  this.container.on("variantChange" + this.settings.namespace, this.updateImageSet.bind(this)));
              }
            },
            initQtySelector: function () {
              this.container.querySelectorAll(".js-qty__wrapper").forEach((e) => {
                new theme.QtySelector(e, { namespace: ".product" });
              });
            },
            initAjaxProductForm: function () {
              "dropdown" === theme.settings.cartType && new theme.AjaxProduct(this.cache.form, ".add-to-cart");
            },
            updateColorName: function (e, t) {
              this.container.querySelector("#VariantColorLabel-" + this.sectionId + "-" + t).textContent = e;
            },
            updateCartButton: function (e) {
              var t = e.detail.variant,
                n = document.getElementById(this.selectors.addToCart),
                o = document.getElementById(this.selectors.addToCartText);
              if (t)
                if (t.available) {
                  n.classList.remove(i), (n.disabled = !1);
                  var s = o.dataset.defaultText;
                  o.textContent = s;
                } else n.classList.add(i), (n.disabled = !0), (o.textContent = theme.strings.soldOut);
              else n.classList.add(i), (n.disabled = !0), (o.textContent = theme.strings.unavailable);
            },
            updatePrice: function (e) {
              var i = e.detail.variant;
              if (i)
                if (
                  (this.cache.price || this.cacheElements(),
                  (this.cache.price.innerHTML = theme.Currency.formatMoney(i.price, theme.settings.moneyFormat)),
                  i.compare_at_price > i.price)
                ) {
                  (this.cache.comparePrice.innerHTML = theme.Currency.formatMoney(
                    i.compare_at_price,
                    theme.settings.moneyFormat
                  )),
                    this.cache.priceWrapper.classList.remove(o),
                    this.cache.price.classList.add(t),
                    this.cache.comparePriceA11y.setAttribute("aria-hidden", "false"),
                    this.cache.priceA11y.setAttribute("aria-hidden", "false");
                  var n = i.compare_at_price - i.price;
                  (n =
                    "percent" == theme.settings.saveType
                      ? Math.round((100 * n) / i.compare_at_price) + "%"
                      : theme.Currency.formatMoney(n, theme.settings.moneyFormat)),
                    this.cache.savePrice.classList.remove(o),
                    (this.cache.savePrice.innerHTML = theme.strings.savePrice.replace("[saved_amount]", n));
                } else
                  this.cache.priceWrapper && this.cache.priceWrapper.classList.add(o),
                    this.cache.savePrice.classList.add(o),
                    this.cache.price.classList.remove(t),
                    this.cache.comparePriceA11y && this.cache.comparePriceA11y.setAttribute("aria-hidden", "true"),
                    this.cache.priceA11y.setAttribute("aria-hidden", "true");
            },
            updateUnitPrice: function (e) {
              var t = e.detail.variant;
              t && t.unit_price
                ? ((this.container.querySelector(this.selectors.unitPrice).innerHTML = theme.Currency.formatMoney(
                    t.unit_price,
                    theme.settings.moneyFormat
                  )),
                  (this.container.querySelector(this.selectors.unitPriceBaseUnit).innerHTML =
                    theme.Currency.getBaseUnit(t)),
                  this.container.querySelector(this.selectors.unitWrapper).classList.remove(o))
                : this.container.querySelector(this.selectors.unitWrapper).classList.add(o);
            },
            imageSetArguments: function (e) {
              if ((e = e || (this.variants ? this.variants.currentVariant : null))) {
                var t = (this.settings.currentImageSet = this.getImageSetName(e[this.settings.imageSetIndex])),
                  i = this.settings.imageSetName + "_" + t;
                return (
                  (this.settings.currentSlideIndex = 0),
                  {
                    cellSelector: '[data-group="' + i + '"]',
                    imageSet: i,
                    initialIndex: this.settings.currentSlideIndex
                  }
                );
              }
            },
            updateImageSet: function (e) {
              var t = e ? e.detail.variant : this.variants ? this.variants.currentVariant : null;
              if (t) {
                var i = this.getImageSetName(t[this.settings.imageSetIndex]);
                this.settings.currentImageSet !== i && this.initProductSlider(t);
              }
            },
            updateImageSetThumbs: function (e) {
              this.cache.thumbSlider.querySelectorAll(".product__thumb-item").forEach((t) => {
                t.classList.toggle(o, t.dataset.group !== e);
              });
            },
            getImageSetName: function (e) {
              return e
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/-$/, "")
                .replace(/^-/, "");
            },
            updateSku: function (e) {
              var t = e.detail.variant,
                i = "",
                n = !0;
              t &&
                (t.sku && ((i = t.sku), (n = !1)),
                this.container.querySelectorAll(this.selectors.sku).forEach((e) => {
                  e.classList.toggle("hide", n), (e.querySelector("[data-sku-id]").textContent = i);
                }));
            },
            updateInventory: function (e) {
              var t = e.detail.variant;
              if (!t || !t.inventory_management || "continue" === t.inventory_policy)
                return this.toggleInventoryQuantity(t, !1), void this.toggleIncomingInventory(!1);
              if ("shopify" === t.inventory_management && window.inventories && window.inventories[this.sectionId]) {
                var i = window.inventories[this.sectionId][t.id],
                  n = i.quantity,
                  o = !0,
                  s = !1;
                (n <= 0 || n > theme.settings.inventoryThreshold) && (o = !1),
                  this.toggleInventoryQuantity(t, o, n),
                  !o && "true" === i.incoming && n <= theme.settings.inventoryThreshold && (s = !0),
                  this.toggleIncomingInventory(s, t.available, i.next_incoming_date);
              }
            },
            updateAvailability: function (e) {
              var t = e.detail.variant;
              t && this.storeAvailability.updateContent(t.id);
            },
            toggleInventoryQuantity: function (e, t, i) {
              this.settings.inventory || (t = !1);
              var n = document.getElementById(this.selectors.inventory);
              if (n) {
                (n.textContent = t ? theme.strings.stockLabel.replace("[count]", i) : theme.strings.inStockLabel),
                  i <= theme.settings.inventoryThreshold
                    ? n.parentNode.classList.add("inventory--low")
                    : n.parentNode.classList.remove("inventory--low"),
                  e.available ? n.parentNode.classList.remove("hide") : n.parentNode.classList.add("hide");
              }
            },
            toggleIncomingInventory: function (e, t, i) {
              this.settings.incomingInventory || (e = !1);
              var n = document.getElementById(this.selectors.incomingInventory);
              if (n) {
                var s = n.querySelector(".js-incoming-text");
                if (e) {
                  var a = t
                    ? theme.strings.willNotShipUntil.replace("[date]", i)
                    : theme.strings.willBeInStockAfter.replace("[date]", i);
                  i || (a = theme.strings.waitingForStock), n.classList.remove(o), (s.textContent = a);
                } else n.classList.add(o);
              }
            },
            videoSetup: function () {
              var e = this.cache.mainSlider.querySelectorAll(s);
              if (!e.length) return !1;
              e.forEach((e) => {
                var t = e.dataset.videoType;
                "youtube" === t ? this.initYoutubeVideo(e) : "mp4" === t && this.initMp4Video(e);
              });
            },
            initYoutubeVideo: function (t) {
              e[t.id] = new theme.YouTube(t.id, {
                videoId: t.dataset.youtubeId,
                videoParent: a,
                autoplay: !1,
                style: t.dataset.videoStyle,
                loop: t.dataset.videoLoop,
                events: {
                  onReady: this.youtubePlayerReady.bind(this),
                  onStateChange: this.youtubePlayerStateChange.bind(this)
                }
              });
            },
            youtubePlayerReady: function (t) {
              var i = t.target.getIframe().id;
              if (e[i]) {
                var n = e[i],
                  o = n.videoPlayer;
                "sound" !== n.options.style && o.mute(),
                  n.parent.classList.remove("loading"),
                  n.parent.classList.add("loaded"),
                  this._isFirstSlide(i) && "sound" !== n.options.style && o.playVideo();
              }
            },
            _isFirstSlide: function (e) {
              return this.cache.mainSlider.querySelector(d + " #" + e);
            },
            youtubePlayerStateChange: function (t) {
              var i = t.target.getIframe().id,
                n = e[i];
              switch (t.data) {
                case -1:
                  n.attemptedToPlay && n.parent.classList.add("video-interactable");
                  break;
                case 0:
                  n && "true" === n.options.loop && n.videoPlayer.playVideo();
                  break;
                case 3:
                  n.attemptedToPlay = !0;
              }
            },
            initMp4Video: function (t) {
              (e[t.id] = { id: t.id, type: "mp4" }), this._isFirstSlide(t.id) && this.playMp4Video(t.id);
            },
            stopVideos: function () {
              for (var [t, i] of Object.entries(e))
                i.videoPlayer
                  ? "function" == typeof i.videoPlayer.stopVideo && i.videoPlayer.stopVideo()
                  : "mp4" === i.type && this.stopMp4Video(i.id);
            },
            _getVideoType: function (e) {
              return e.getAttribute("data-video-type");
            },
            _getVideoDivId: function (e) {
              return e.id;
            },
            playMp4Video: function (e) {
              var t = this.container.querySelector("#" + e),
                i = t.play();
              t.setAttribute("controls", ""),
                t.focus(),
                t.addEventListener("focusout", this.returnFocusToThumbnail.bind(this)),
                void 0 !== i &&
                  i
                    .then(function () {})
                    .catch(function (e) {
                      t.setAttribute("controls", ""), t.closest(a).setAttribute("data-video-style", "unmuted");
                    });
            },
            stopMp4Video: function (e) {
              var t = this.container.querySelector("#" + e);
              t.removeEventListener("focusout", this.returnFocusToThumbnail.bind(this)),
                t && "function" == typeof t.pause && (t.removeAttribute("controls"), t.pause());
            },
            returnFocusToThumbnail: function () {
              var e = this.container.querySelector(
                '.product__thumb-item[data-index="' + this.settings.currentSlideIndex + '"] a'
              );
              e && e.focus();
            },
            initImageZoom: function () {
              var e = this.container.querySelector(this.selectors.imageContainer);
              if (e) {
                new theme.Photoswipe(e, this.sectionId);
                e.addEventListener(
                  "photoswipe:afterChange",
                  function (e) {
                    this.flickity && this.flickity.goToSlide(e.detail.index);
                  }.bind(this)
                );
              }
            },
            getThumbIndex: function (e) {
              return e.dataset.index;
            },
            updateVariantImage: function (e) {
              var t = e.detail.variant,
                i =
                  (theme.Images.getSizedImageUrl(t.featured_media.preview_image.src, this.settings.imageSize),
                  this.container.querySelector('.product__thumb[data-id="' + t.featured_media.id + '"]')),
                n = this.getThumbIndex(i);
              void 0 !== n && this.flickity && this.flickity.goToSlide(n);
            },
            initProductSlider: function (e) {
              if (this.cache.mainSlider.querySelectorAll(r).length <= 1) {
                var t = this.cache.mainSlider.querySelector(r);
                t && t.classList.add("is-selected");
              } else {
                if ((this.flickity && "function" == typeof this.flickity.destroy && this.flickity.destroy(), !e)) {
                  var i = this.cache.mainSlider.querySelector(d);
                  this.settings.currentSlideIndex = this._slideIndex(i);
                }
                var n = {
                  adaptiveHeight: !0,
                  avoidReflow: !0,
                  initialIndex: this.settings.currentSlideIndex,
                  childNav: this.cache.thumbSlider,
                  childNavScroller: this.cache.thumbScroller,
                  childVertical: "beside" === this.cache.thumbSlider.dataset.position,
                  pageDots: !0,
                  wrapAround: !0,
                  callbacks: {
                    onInit: this.onSliderInit.bind(this),
                    onChange: this.onSlideChange.bind(this)
                  }
                };
                if (this.settings.imageSetName) {
                  var o = this.imageSetArguments(e);
                  (n = Object.assign({}, n, o)), this.updateImageSetThumbs(n.imageSet);
                }
                this.flickity = new theme.Slideshow(this.cache.mainSlider, n);
              }
            },
            onSliderInit: function (e) {
              this.settings.imageSetName && this.prepMediaOnSlide(e);
            },
            onSlideChange: function (e) {
              if (this.flickity) {
                var t = this.cache.mainSlider.querySelector(
                    '.product-main-slide[data-index="' + this.settings.currentSlideIndex + '"]'
                  ),
                  i = this.settings.imageSetName
                    ? this.cache.mainSlider.querySelectorAll(".flickity-slider .product-main-slide")[e]
                    : this.cache.mainSlider.querySelector('.product-main-slide[data-index="' + e + '"]');
                t.setAttribute("tabindex", "-1"),
                  i.setAttribute("tabindex", 0),
                  this.stopMediaOnSlide(t),
                  this.prepMediaOnSlide(i),
                  (this.settings.currentSlideIndex = e);
              }
            },
            stopMediaOnSlide(t) {
              var i = t.querySelector(s);
              if (i) {
                var n = this._getVideoType(i),
                  o = this._getVideoDivId(i);
                if ("youtube" === n) {
                  if (e[o].videoPlayer) return void e[o].videoPlayer.stopVideo();
                } else if ("mp4" === n) return void this.stopMp4Video(o);
              }
              var a = t.querySelector(this.selectors.media);
              a &&
                a.dispatchEvent(
                  new CustomEvent("mediaHidden", {
                    bubbles: !0,
                    cancelable: !0
                  })
                );
            },
            prepMediaOnSlide(t) {
              var i = t.querySelector(s);
              if (i) {
                var n = this._getVideoType(i),
                  o = this._getVideoDivId(i);
                if ("youtube" === n) {
                  if (e[o].videoPlayer && "sound" !== e[o].options.style) return void e[o].videoPlayer.playVideo();
                } else "mp4" === n && this.playMp4Video(o);
              }
              var a = t.querySelector(this.selectors.media);
              a &&
                (a.dispatchEvent(
                  new CustomEvent("mediaVisible", {
                    bubbles: !0,
                    cancelable: !0
                  })
                ),
                t.querySelector(".shopify-model-viewer-ui__button").setAttribute("tabindex", 0),
                t.querySelector(".product-single__close-media").setAttribute("tabindex", 0));
            },
            _slideIndex: function (e) {
              return e.getAttribute("data-index");
            },
            openModalProduct: function () {
              var e = !1;
              if (this.settings.modalInit) e = !0;
              else {
                var t = this.container.querySelector(this.selectors.modalFormHolder),
                  i = t.dataset.url;
                "preorder" !== t.dataset.template && (i += "?view=ajax"),
                  fetch(i)
                    .then(function (e) {
                      return e.text();
                    })
                    .then(
                      function (e) {
                        var i = new DOMParser().parseFromString(e, "text/html");
                        (this.cache.form = i.querySelector("#AddToCartForm-" + this.sectionId)),
                          (t.innerHTML = ""),
                          t.append(this.cache.form),
                          t.classList.add("product-form-holder--loaded"),
                          this.formSetup(),
                          Shopify && Shopify.PaymentButton && Shopify.PaymentButton.init(),
                          document.dispatchEvent(
                            new CustomEvent("quickview:loaded", {
                              detail: { productId: this.sectionId }
                            })
                          );
                      }.bind(this)
                    ),
                  this.productSetup(),
                  this.videoSetup(),
                  this.updateModalProductInventory(),
                  this.settings.imageSetName
                    ? this.variants
                      ? this.initProductSlider()
                      : document.addEventListener(
                          "quickview:loaded",
                          function (e) {
                            e.detail.productId === this.sectionId && this.initProductSlider();
                          }.bind(this)
                        )
                    : this.initProductSlider(),
                  this.customMediaListners(),
                  this.addIdToRecentlyViewed(),
                  (this.settings.modalInit = !0);
              }
              document.dispatchEvent(
                new CustomEvent("quickview:open", {
                  detail: { initialized: e, productId: this.sectionId }
                })
              );
            },
            updateModalProductInventory: function () {
              (window.inventories = window.inventories || {}),
                this.container.querySelectorAll(".js-product-inventory-data").forEach((e) => {
                  var t = e.dataset.sectionId;
                  (window.inventories[t] = {}),
                    e.querySelectorAll(".js-variant-inventory-data").forEach((e) => {
                      window.inventories[t][e.dataset.id] = {
                        quantity: e.dataset.quantity,
                        incoming: e.dataset.incoming,
                        next_incoming_date: e.dataset.date
                      };
                    });
                });
            },
            closeModalProduct: function () {
              this.stopVideos();
            },
            initQuickAddForm: function () {
              this.updateModalProductInventory(), Shopify && Shopify.PaymentButton && Shopify.PaymentButton.init();
            },
            initModelViewerLibraries: function () {
              var e = this.container.querySelectorAll(this.selectors.media);
              e.length < 1 || theme.ProductMedia.init(e, this.sectionId);
            },
            initShopifyXrLaunch: function () {
              document.addEventListener(
                "shopify_xr_launch",
                function () {
                  this.container
                    .querySelector(this.selectors.productMediaWrapper + ":not(." + self.classes.hidden + ")")
                    .dispatchEvent(
                      new CustomEvent("xrLaunch", {
                        bubbles: !0,
                        cancelable: !0
                      })
                    );
                }.bind(this)
              );
            },
            customMediaListners: function () {
              document.querySelectorAll(this.selectors.closeMedia).forEach((e) => {
                e.addEventListener(
                  "click",
                  function () {
                    var e = this.cache.mainSlider.querySelector(c).querySelector(this.selectors.media);
                    e &&
                      e.dispatchEvent(
                        new CustomEvent("mediaHidden", {
                          bubbles: !0,
                          cancelable: !0
                        })
                      );
                  }.bind(this)
                );
              });
              var e = this.container.querySelector("model-viewer");
              e &&
                (e.addEventListener(
                  "shopify_model_viewer_ui_toggle_play",
                  function (e) {
                    this.mediaLoaded(e);
                  }.bind(this)
                ),
                e.addEventListener(
                  "shopify_model_viewer_ui_toggle_pause",
                  function (e) {
                    this.mediaUnloaded(e);
                  }.bind(this)
                ));
            },
            mediaLoaded: function (e) {
              this.container.querySelectorAll(this.selectors.closeMedia).forEach((e) => {
                e.classList.remove(o);
              }),
                this.flickity && this.flickity.setDraggable(!1);
            },
            mediaUnloaded: function (e) {
              this.container.querySelectorAll(this.selectors.closeMedia).forEach((e) => {
                e.classList.add(o);
              }),
                this.flickity && this.flickity.setDraggable(!0);
            },
            onUnload: function () {
              theme.ProductMedia.removeSectionModels(this.sectionId),
                this.flickity && "function" == typeof this.flickity.destroy && this.flickity.destroy();
            }
          })),
          l
        );
      })()),
      (theme.RecentlyViewed = (function () {
        var e = !1;
        function t(e) {
          e &&
            ((this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 600
            }));
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              if (!e)
                if (((e = !0), theme.recentlyViewedIds.length)) {
                  this.outputContainer = document.getElementById("RecentlyViewed-" + this.sectionId);
                  var t = this.container.getAttribute("data-product-id"),
                    i = theme.routes.search + "?view=recently-viewed&type=product&q=",
                    n = "",
                    o = 0;
                  theme.recentlyViewedIds.forEach(function (e) {
                    e !== t && (o >= 7 || ((n += "id:" + e + " OR "), o++));
                  }),
                    (i += encodeURIComponent(n)),
                    fetch(i)
                      .then(function (e) {
                        return e.text();
                      })
                      .then(
                        function (e) {
                          var t = new DOMParser().parseFromString(e, "text/html");
                          if (t.querySelectorAll(".grid-product").length > 0) {
                            var i = t.querySelector(".product-grid");
                            this.outputContainer.append(i),
                              new theme.QuickAdd(this.outputContainer),
                              new theme.QuickShop(this.outputContainer);
                          } else this.container.classList.add("hide");
                        }.bind(this)
                      );
                } else this.container.classList.add("hide");
            },
            onUnload: function () {
              e = !1;
            }
          })),
          t
        );
      })()),
      (theme.VendorProducts = (function () {
        function e(e) {
          e &&
            ((this.container = e),
            (this.sectionId = this.container.getAttribute("data-section-id")),
            (this.currentProduct = this.container.getAttribute("data-product-id")),
            theme.initWhenVisible({
              element: this.container,
              callback: this.init.bind(this),
              threshold: 600
            }));
        }
        return (
          (e.prototype = Object.assign({}, e.prototype, {
            init: function () {
              (this.outputContainer = document.getElementById("VendorProducts-" + this.sectionId)),
                (this.vendor = this.container.getAttribute("data-vendor"));
              var e = theme.routes.collections + "/vendors?view=vendor-ajax&q=" + this.vendor;
              (e = e.replace("//", "/")),
                fetch(e)
                  .then(function (e) {
                    return e.text();
                  })
                  .then((e) => {
                    var t = 0,
                      i = [],
                      n = [],
                      o = new DOMParser().parseFromString(e, "text/html");
                    o.querySelectorAll(".grid-product").forEach((e) => {
                      var s = e.dataset.productId;
                      if (6 !== t && s !== this.currentProduct) {
                        var a = o.querySelector('.modal[data-product-id="' + s + '"]');
                        a && n.push(a), t++, i.push(e);
                      }
                    }),
                      (this.outputContainer.innerHTML = ""),
                      0 === i.length
                        ? this.container.classList.add("hide")
                        : (this.outputContainer.classList.remove("hide"),
                          this.outputContainer.append(...i),
                          n.length && (this.outputContainer.append(...n), new theme.QuickShop(this.outputContainer)),
                          new theme.QuickAdd(this.outputContainer));
                  });
            }
          })),
          e
        );
      })()),
      (theme.Testimonials = (function () {
        var e = {
          adaptiveHeight: !0,
          avoidReflow: !0,
          pageDots: !0,
          prevNextButtons: !1
        };
        function t(e) {
          (this.container = e), this.timeout;
          var t = e.getAttribute("data-section-id");
          (this.slideshow = e.querySelector("#Testimonials-" + t)),
            (this.namespace = ".testimonial-" + t),
            this.slideshow &&
              theme.initWhenVisible({
                element: this.container,
                callback: this.init.bind(this),
                threshold: 600
              });
        }
        return (
          (t.prototype = Object.assign({}, t.prototype, {
            init: function () {
              this.slideshow.dataset.count <= 3 && (e.wrapAround = !1),
                (this.flickity = new theme.Slideshow(this.slideshow, e)),
                this.slideshow.dataset.count > 2 &&
                  (this.timeout = setTimeout(
                    function () {
                      this.flickity.goToSlide(1);
                    }.bind(this),
                    1e3
                  ));
            },
            onUnload: function () {
              this.flickity && "function" == typeof this.flickity.destroy && this.flickity.destroy();
            },
            onDeselect: function () {
              this.flickity && "function" == typeof this.flickity.play && this.flickity.play();
            },
            onBlockSelect: function (e) {
              var t = this.slideshow.querySelector(".testimonials-slide--" + e.detail.blockId),
                i = parseInt(t.dataset.index);
              clearTimeout(this.timeout),
                this.flickity &&
                  "function" == typeof this.flickity.pause &&
                  (this.flickity.goToSlide(i), this.flickity.pause());
            },
            onBlockDeselect: function () {
              this.flickity && "function" == typeof this.flickity.play && this.flickity.play();
            }
          })),
          t
        );
      })()),
      (theme.isStorageSupported = function (e) {
        if (window.self !== window.top) return !1;
        var t;
        "session" === e && (t = window.sessionStorage), "local" === e && (t = window.localStorage);
        try {
          return t.setItem("test", "1"), t.removeItem("test"), !0;
        } catch (e) {
          return !1;
        }
      }),
      (theme.reinitProductGridItem = function (e) {
        window.SPR && (SPR.initDomEls(), SPR.loadBadges()), theme.collapsibles.init();
      }),
      (theme.sizeDrawer = function () {
        var e = document.getElementById("HeaderWrapper").offsetHeight,
          t = window.innerHeight - e;
        document.documentElement.style.setProperty("--maxDrawerHeight", t + "px");
      }),
      (theme.config.hasSessionStorage = theme.isStorageSupported("session")),
      (theme.config.hasLocalStorage = theme.isStorageSupported("local")),
      theme.config.hasLocalStorage)
    ) {
      var c = window.localStorage.getItem("recently-viewed");
      c && void 0 !== typeof c && (theme.recentlyViewedIds = JSON.parse(c));
    }
    (theme.config.bpSmall = matchMedia(theme.config.mediaQuerySmall).matches),
      matchMedia(theme.config.mediaQuerySmall).addListener(function (e) {
        e.matches
          ? ((theme.config.bpSmall = !0), document.dispatchEvent(new CustomEvent("matchSmall")))
          : ((theme.config.bpSmall = !1), document.dispatchEvent(new CustomEvent("unmatchSmall")));
      }),
      (theme.initGlobals = function () {
        theme.collapsibles.init(), theme.videoModal(), theme.animationObserver();
      }),
      (r = function () {
        if (
          ((theme.sections = new theme.Sections()),
          theme.sections.register("header", theme.HeaderSection),
          theme.sections.register("toolbar", theme.Toolbar),
          theme.sections.register("product", theme.Product),
          theme.sections.register("password-header", theme.PasswordHeader),
          theme.sections.register("photoswipe", theme.Photoswipe),
          theme.sections.register("product-recommendations", theme.Recommendations),
          theme.sections.register("slideshow-section", theme.SlideshowSection),
          theme.sections.register("background-image", theme.BackgroundImage),
          theme.sections.register("testimonials", theme.Testimonials),
          theme.sections.register("video-section", theme.VideoSection),
          theme.sections.register("map", theme.Maps),
          theme.sections.register("footer-section", theme.FooterSection),
          theme.sections.register("store-availability", theme.StoreAvailability),
          theme.sections.register("recently-viewed", theme.RecentlyViewed),
          theme.sections.register("vendor-products", theme.VendorProducts),
          theme.sections.register("newsletter-popup", theme.NewsletterPopup),
          theme.sections.register("collection-header", theme.CollectionHeader),
          theme.sections.register("collection-template-v2", theme.Collection),
          theme.sections.register("collection-sidebar", theme.CollectionSidebar),
          theme.initGlobals(),
          theme.rteInit(),
          theme.settings.isCustomerTemplate && theme.customerTemplates(),
          document.body.classList.contains("template-cart"))
        ) {
          var e = document.getElementById("CartPageForm");
          if (e) {
            var t = new theme.CartForm(e),
              i = document.querySelector('.cart-recommendations[data-location="page"]');
            i && (new theme.QuickAdd(i), new theme.QuickShop(i));
            var n = e.querySelector(".add-note");
            n &&
              n.addEventListener("click", function () {
                n.classList.toggle("is-active"), e.querySelector(".cart__note").classList.toggle("hide");
              }),
              document.addEventListener(
                "ajaxProduct:added",
                function (e) {
                  t.buildCart();
                }.bind(this)
              );
          }
        }
        if (document.body.classList.contains("template-search")) {
          var o = document.querySelector(".search-grid");
          o && o.querySelectorAll(".grid-product").length && (new theme.QuickAdd(o), new theme.QuickShop(o));
        }
        document.addEventListener("recommendations:loaded", function (e) {
          e &&
            e.detail &&
            e.detail.section &&
            (new theme.QuickAdd(e.detail.section), new theme.QuickShop(e.detail.section));
        }),
          document.dispatchEvent(new CustomEvent("page:loaded"));
      }),
      "loading" != document.readyState ? r() : document.addEventListener("DOMContentLoaded", r);
  })();

// ---------------------------------------Product Page Js -------------------------

$(document).ready(function () {
  var Atc = $(".product-single__meta .payment-Atc-button").html();
  $(".stick-atc-btn").html(Atc);
  var price = $(".ProductPrice span.money").first().text();
  $(".price-in-atc").text(price);
  $(".variant-input").click(function () {
    $(".price-in-atc span").hide();
    setTimeout(function () {
      var price = $(".ProductPrice span.money").first().text();
      var Atc = $(".product-single__meta .payment-Atc-button").html();
      $(".price-in-atc").text(price);
      $(".stick-atc-btn").html(Atc);
    }, 500);
  });
  $(".size-variant-wrapper select").change(function () {
    $(".choose-option").addClass("hide");
    $(".payment-Atc-button").removeClass("hide");
    $(".stick-atc-btn").removeClass("hide");
     $(".price-in-atc span").hide();
    setTimeout(function () {
      var price = $(".ProductPrice span.money").first().text();
      var Atc = $(".product-single__meta .payment-Atc-button").html();
      $(".price-in-atc").text(price);
      $(".stick-atc-btn").html(Atc);
    }, 500);
  });
});

function initIframe(){
  var vidDefer = document.getElementsByTagName('iframe');
  for (var i=0; i<vidDefer.length; i++) {
    if(vidDefer[i].getAttribute('data-src')) {
      vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
    }
  }
}
window.onload = function(){setTimeout(function(){
  initIframe();
}, 1000)};