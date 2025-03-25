"use strict";

function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }
  return _createClass(Util, null, [{
    key: "forEach",
    value: function forEach(elements, handler) {
      elements = elements || [];
      for (var i = 0; i < elements.length; i++) handler(elements[i]);
    }
  }, {
    key: "getScrollTop",
    value: function getScrollTop() {
      return document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
    }
  }, {
    key: "isMobile",
    value: function isMobile() {
      return window.matchMedia('only screen and (max-width: 680px)').matches;
    }
  }, {
    key: "isTocStatic",
    value: function isTocStatic() {
      return window.matchMedia('only screen and (max-width: 960px)').matches;
    }
  }, {
    key: "animateCSS",
    value: function animateCSS(element, animation, reserved, callback) {
      var _element$classList;
      if (!Array.isArray(animation)) animation = [animation];
      (_element$classList = element.classList).add.apply(_element$classList, ['animate__animated'].concat(_toConsumableArray(animation)));
      var _handler = function handler() {
        var _element$classList2;
        (_element$classList2 = element.classList).remove.apply(_element$classList2, ['animate__animated'].concat(_toConsumableArray(animation)));
        element.removeEventListener('animationend', _handler);
        if (typeof callback === 'function') callback();
      };
      if (!reserved) element.addEventListener('animationend', _handler, false);
    }
  }]);
}();
var Theme = /*#__PURE__*/function () {
  function Theme() {
    _classCallCheck(this, Theme);
    this.config = window.config;
    this.data = this.config.data;
    this.isDark = document.body.getAttribute('theme') === 'dark';
    this.newScrollTop = Util.getScrollTop();
    this.oldScrollTop = this.newScrollTop;
    this.scrollEventSet = new Set();
    this.resizeEventSet = new Set();
    this.switchThemeEventSet = new Set();
    this.clickMaskEventSet = new Set();
    if (window.objectFitImages) objectFitImages();
  }
  return _createClass(Theme, [{
    key: "initRaw",
    value: function initRaw() {
      var _this = this;
      Util.forEach(document.querySelectorAll('[data-raw]'), function ($raw) {
        $raw.innerHTML = _this.data[$raw.id];
      });
    }
  }, {
    key: "initSVGIcon",
    value: function initSVGIcon() {
      Util.forEach(document.querySelectorAll('[data-svg-src]'), function ($icon) {
        fetch($icon.getAttribute('data-svg-src')).then(function (response) {
          return response.text();
        }).then(function (svg) {
          var $temp = document.createElement('div');
          $temp.insertAdjacentHTML('afterbegin', svg);
          var $svg = $temp.firstChild;
          $svg.setAttribute('data-svg-src', $icon.getAttribute('data-svg-src'));
          $svg.classList.add('icon');
          var $titleElements = $svg.getElementsByTagName('title');
          if ($titleElements.length) $svg.removeChild($titleElements[0]);
          $icon.parentElement.replaceChild($svg, $icon);
        }).catch(function (err) {
          console.error(err);
        });
      });
    }
  }, {
    key: "initTwemoji",
    value: function initTwemoji() {
      if (this.config.twemoji) twemoji.parse(document.body);
    }
  }, {
    key: "initMenuMobile",
    value: function initMenuMobile() {
      var $menuToggleMobile = document.getElementById('menu-toggle-mobile');
      var $menuMobile = document.getElementById('menu-mobile');
      $menuToggleMobile.addEventListener('click', function () {
        document.body.classList.toggle('blur');
        $menuToggleMobile.classList.toggle('active');
        $menuMobile.classList.toggle('active');
      }, false);
      this._menuMobileOnClickMask = this._menuMobileOnClickMask || function () {
        $menuToggleMobile.classList.remove('active');
        $menuMobile.classList.remove('active');
      };
      this.clickMaskEventSet.add(this._menuMobileOnClickMask);
    }
  }, {
    key: "initSwitchTheme",
    value: function initSwitchTheme() {
      var _this2 = this;
      Util.forEach(document.getElementsByClassName('theme-switch'), function ($themeSwitch) {
        $themeSwitch.addEventListener('click', function () {
          if (document.body.getAttribute('theme') === 'dark') document.body.setAttribute('theme', 'light');else document.body.setAttribute('theme', 'dark');
          _this2.isDark = !_this2.isDark;
          window.localStorage && localStorage.setItem('theme', _this2.isDark ? 'dark' : 'light');
          var _iterator = _createForOfIteratorHelper(_this2.switchThemeEventSet),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var event = _step.value;
              event();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }, false);
      });
    }
  }, {
    key: "initSearch",
    value: function initSearch() {
      var _this3 = this;
      var searchConfig = this.config.search;
      var isMobile = Util.isMobile();
      if (!searchConfig || isMobile && this._searchMobileOnce || !isMobile && this._searchDesktopOnce) return;
      var maxResultLength = searchConfig.maxResultLength ? searchConfig.maxResultLength : 10;
      var snippetLength = searchConfig.snippetLength ? searchConfig.snippetLength : 50;
      var highlightTag = searchConfig.highlightTag ? searchConfig.highlightTag : 'em';
      var suffix = isMobile ? 'mobile' : 'desktop';
      var $header = document.getElementById("header-".concat(suffix));
      var $searchInput = document.getElementById("search-input-".concat(suffix));
      var $searchToggle = document.getElementById("search-toggle-".concat(suffix));
      var $searchLoading = document.getElementById("search-loading-".concat(suffix));
      var $searchClear = document.getElementById("search-clear-".concat(suffix));
      if (isMobile) {
        this._searchMobileOnce = true;
        $searchInput.addEventListener('focus', function () {
          document.body.classList.add('blur');
          $header.classList.add('open');
        }, false);
        document.getElementById('search-cancel-mobile').addEventListener('click', function () {
          $header.classList.remove('open');
          document.body.classList.remove('blur');
          document.getElementById('menu-toggle-mobile').classList.remove('active');
          document.getElementById('menu-mobile').classList.remove('active');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this3._searchMobile && _this3._searchMobile.autocomplete.setVal('');
        }, false);
        $searchClear.addEventListener('click', function () {
          $searchClear.style.display = 'none';
          _this3._searchMobile && _this3._searchMobile.autocomplete.setVal('');
        }, false);
        this._searchMobileOnClickMask = this._searchMobileOnClickMask || function () {
          $header.classList.remove('open');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this3._searchMobile && _this3._searchMobile.autocomplete.setVal('');
        };
        this.clickMaskEventSet.add(this._searchMobileOnClickMask);
      } else {
        this._searchDesktopOnce = true;
        $searchToggle.addEventListener('click', function () {
          document.body.classList.add('blur');
          $header.classList.add('open');
          $searchInput.focus();
        }, false);
        $searchClear.addEventListener('click', function () {
          $searchClear.style.display = 'none';
          _this3._searchDesktop && _this3._searchDesktop.autocomplete.setVal('');
        }, false);
        this._searchDesktopOnClickMask = this._searchDesktopOnClickMask || function () {
          $header.classList.remove('open');
          $searchLoading.style.display = 'none';
          $searchClear.style.display = 'none';
          _this3._searchDesktop && _this3._searchDesktop.autocomplete.setVal('');
        };
        this.clickMaskEventSet.add(this._searchDesktopOnClickMask);
      }
      $searchInput.addEventListener('input', function () {
        if ($searchInput.value === '') $searchClear.style.display = 'none';else $searchClear.style.display = 'inline';
      }, false);
      var initAutosearch = function initAutosearch() {
        var autosearch = autocomplete("#search-input-".concat(suffix), {
          hint: false,
          autoselect: true,
          dropdownMenuContainer: "#search-dropdown-".concat(suffix),
          clearOnSelected: true,
          cssClasses: {
            noPrefix: true
          },
          debug: true
        }, {
          name: 'search',
          source: function source(query, callback) {
            $searchLoading.style.display = 'inline';
            $searchClear.style.display = 'none';
            var finish = function finish(results) {
              $searchLoading.style.display = 'none';
              $searchClear.style.display = 'inline';
              callback(results);
            };
            if (searchConfig.type === 'lunr') {
              var search = function search() {
                if (lunr.queryHandler) query = lunr.queryHandler(query);
                var results = {};
                _this3._index.search(query).forEach(function (_ref) {
                  var ref = _ref.ref,
                    metadata = _ref.matchData.metadata;
                  var matchData = _this3._indexData[ref];
                  var uri = matchData.uri,
                    title = matchData.title,
                    context = matchData.content;
                  if (results[uri]) return;
                  var position = 0;
                  Object.values(metadata).forEach(function (_ref2) {
                    var content = _ref2.content;
                    if (content) {
                      var matchPosition = content.position[0][0];
                      if (matchPosition < position || position === 0) position = matchPosition;
                    }
                  });
                  position -= snippetLength / 5;
                  if (position > 0) {
                    position += context.slice(position, position + 20).lastIndexOf(' ') + 1;
                    context = '...' + context.slice(position, position + snippetLength);
                  } else {
                    context = context.slice(0, snippetLength);
                  }
                  Object.keys(metadata).forEach(function (key) {
                    title = title.replace(new RegExp("(".concat(key, ")"), 'gi'), "<".concat(highlightTag, ">$1</").concat(highlightTag, ">"));
                    context = context.replace(new RegExp("(".concat(key, ")"), 'gi'), "<".concat(highlightTag, ">$1</").concat(highlightTag, ">"));
                  });
                  results[uri] = {
                    'uri': uri,
                    'title': title,
                    'date': matchData.date,
                    'context': context
                  };
                });
                return Object.values(results).slice(0, maxResultLength);
              };
              if (!_this3._index) {
                fetch(searchConfig.lunrIndexURL).then(function (response) {
                  return response.json();
                }).then(function (data) {
                  var indexData = {};
                  _this3._index = lunr(function () {
                    var _this4 = this;
                    if (searchConfig.lunrLanguageCode) this.use(lunr[searchConfig.lunrLanguageCode]);
                    this.ref('objectID');
                    this.field('title', {
                      boost: 50
                    });
                    this.field('tags', {
                      boost: 20
                    });
                    this.field('categories', {
                      boost: 20
                    });
                    this.field('content', {
                      boost: 10
                    });
                    this.metadataWhitelist = ['position'];
                    data.forEach(function (record) {
                      indexData[record.objectID] = record;
                      _this4.add(record);
                    });
                  });
                  _this3._indexData = indexData;
                  finish(search());
                }).catch(function (err) {
                  console.error(err);
                  finish([]);
                });
              } else finish(search());
            } else if (searchConfig.type === 'algolia') {
              var algoliasearch = window['algoliasearch/lite'].liteClient;
              _this3._algoliaIndex = _this3._algoliaIndex || algoliasearch(searchConfig.algoliaAppID, searchConfig.algoliaSearchKey);
              _this3._algoliaIndex.search({
                requests: [{
                  indexName: searchConfig.algoliaIndex,
                  query: query,
                  offset: 0,
                  length: maxResultLength * 8,
                  attributesToHighlight: ['title'],
                  attributesToSnippet: ["content:".concat(snippetLength)],
                  highlightPreTag: "<".concat(highlightTag, ">"),
                  highlightPostTag: "</".concat(highlightTag, ">")
                }]
              }).then(function (_ref3) {
                var _ref3$results = _slicedToArray(_ref3.results, 1),
                  hits = _ref3$results[0].hits;
                var results = {};
                hits.forEach(function (_ref4) {
                  var uri = _ref4.uri,
                    date = _ref4.date,
                    title = _ref4._highlightResult.title,
                    content = _ref4._snippetResult.content;
                  if (results[uri] && results[uri].context.length > content.value) return;
                  results[uri] = {
                    uri: uri,
                    title: title.value,
                    date: date,
                    context: content.value
                  };
                });
                finish(Object.values(results).slice(0, maxResultLength));
              }).catch(function (err) {
                console.error(err);
                finish([]);
              });
            }
          },
          templates: {
            suggestion: function suggestion(_ref5) {
              var title = _ref5.title,
                date = _ref5.date,
                context = _ref5.context;
              return "<div><span class=\"suggestion-title\">".concat(title, "</span><span class=\"suggestion-date\">").concat(date, "</span></div><div class=\"suggestion-context\">").concat(context, "</div>");
            },
            empty: function empty(_ref6) {
              var query = _ref6.query;
              return "<div class=\"search-empty\">".concat(searchConfig.noResultsFound, ": <span class=\"search-query\">\"").concat(query, "\"</span></div>");
            },
            footer: function footer(_ref7) {
              _objectDestructuringEmpty(_ref7);
              var _ref8 = searchConfig.type === 'algolia' ? {
                  searchType: 'algolia',
                  icon: '<i class="fab fa-algolia fa-fw" aria-hidden="true"></i>',
                  href: 'https://www.algolia.com/'
                } : {
                  searchType: 'Lunr.js',
                  icon: '',
                  href: 'https://lunrjs.com/'
                },
                searchType = _ref8.searchType,
                icon = _ref8.icon,
                href = _ref8.href;
              return "<div class=\"search-footer\">Search by <a href=\"".concat(href, "\" rel=\"noopener noreffer\" target=\"_blank\">").concat(icon, " ").concat(searchType, "</a></div>");
            }
          }
        });
        autosearch.on('autocomplete:selected', function (_event, suggestion, _dataset, _context) {
          window.location.assign(suggestion.uri);
        });
        if (isMobile) _this3._searchMobile = autosearch;else _this3._searchDesktop = autosearch;
      };
      if (searchConfig.lunrSegmentitURL && !document.getElementById('lunr-segmentit')) {
        var script = document.createElement('script');
        script.id = 'lunr-segmentit';
        script.src = searchConfig.lunrSegmentitURL;
        script.async = true;
        if (script.readyState) {
          script.onreadystatechange = function () {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              initAutosearch();
            }
          };
        } else {
          script.onload = function () {
            initAutosearch();
          };
        }
        document.body.appendChild(script);
      } else initAutosearch();
    }
  }, {
    key: "initDetails",
    value: function initDetails() {
      Util.forEach(document.getElementsByClassName('details'), function ($details) {
        var $summary = $details.getElementsByClassName('details-summary')[0];
        $summary.addEventListener('click', function () {
          $details.classList.toggle('open');
        }, false);
      });
    }
  }, {
    key: "initLightGallery",
    value: function initLightGallery() {
      if (this.config.lightgallery) lightGallery(document.getElementById('content'), {
        plugins: [lgThumbnail, lgZoom],
        selector: '.lightgallery',
        speed: 400,
        hideBarsDelay: 2000,
        allowMediaOverlap: true,
        exThumbImage: 'data-thumbnail',
        toggleThumb: true,
        thumbWidth: 80,
        thumbHeight: '60px',
        actualSize: false,
        showZoomInOutIcons: true
      });
    }
  }, {
    key: "initHighlight",
    value: function initHighlight() {
      Util.forEach(document.querySelectorAll('.code-block'), function ($codeBlock) {
        var $codeTitle = $codeBlock.querySelector('.code-header > .code-title');
        if ($codeTitle) {
          $codeTitle.addEventListener('click', function () {
            $codeBlock.classList.toggle('open');
          }, false);
        }
        var $ellipses = $codeBlock.querySelector('.code-header .ellipses');
        if ($ellipses) {
          $ellipses.addEventListener('click', function () {
            $codeBlock.classList.toggle('open');
          }, false);
        }
        var $copy = $codeBlock.querySelector('.code-header .copy');
        if ($copy) {
          var $code = $codeBlock.querySelector('code');
          $copy.setAttribute('data-clipboard-text', $code.innerText);
          var clipboard = new ClipboardJS($copy);
          var $codeLines = $code.querySelectorAll('span.cl');
          clipboard.on('success', function (_e) {
            if ($codeLines) {
              Util.forEach($codeLines, function ($codeLine) {
                return Util.animateCSS($codeLine, 'animate__flash');
              });
            }
          });
        }
      });
    }
  }, {
    key: "initHeaderLink",
    value: function initHeaderLink() {
      for (var num = 1; num <= 6; num++) {
        Util.forEach(document.querySelectorAll('.single .content > h' + num), function ($header) {
          $header.classList.add('headerLink');
          $header.insertAdjacentHTML('afterbegin', "<a href=\"#".concat($header.id, "\" class=\"header-mark\"></a>"));
        });
      }
    }
  }, {
    key: "initToc",
    value: function initToc() {
      var _this5 = this;
      var $tocCore = document.getElementById('TableOfContents');
      if ($tocCore === null) return;
      if (document.getElementById('toc-static').getAttribute('data-kept') || Util.isTocStatic()) {
        var $tocContentStatic = document.getElementById('toc-content-static');
        if ($tocCore.parentElement !== $tocContentStatic) {
          $tocCore.parentElement.removeChild($tocCore);
          $tocContentStatic.appendChild($tocCore);
        }
        if (this._tocOnScroll) this.scrollEventSet.delete(this._tocOnScroll);
      } else {
        var $tocContentAuto = document.getElementById('toc-content-auto');
        if ($tocCore.parentElement !== $tocContentAuto) {
          $tocCore.parentElement.removeChild($tocCore);
          $tocContentAuto.appendChild($tocCore);
        }
        var $toc = document.getElementById('toc-auto');
        var $page = document.getElementsByClassName('page')[0];
        var rect = $page.getBoundingClientRect();
        $toc.style.left = "".concat(rect.left + rect.width + 20, "px");
        $toc.style.maxWidth = "".concat($page.getBoundingClientRect().left - 20, "px");
        $toc.style.visibility = 'visible';
        var $tocLinkElements = $tocCore.querySelectorAll('a:first-child');
        var $tocLiElements = $tocCore.getElementsByTagName('li');
        var $headerLinkElements = document.getElementsByClassName('headerLink');
        var headerIsFixed = document.body.getAttribute('data-header-desktop') !== 'normal';
        var headerHeight = document.getElementById('header-desktop').offsetHeight;
        var TOP_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
        var minTocTop = $toc.offsetTop;
        var minScrollTop = minTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
        this._tocOnScroll = this._tocOnScroll || function () {
          var footerTop = document.getElementById('post-footer').offsetTop;
          var maxTocTop = footerTop - $toc.getBoundingClientRect().height;
          var maxScrollTop = maxTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
          if (_this5.newScrollTop < minScrollTop) {
            $toc.style.position = 'absolute';
            $toc.style.top = "".concat(minTocTop, "px");
          } else if (_this5.newScrollTop > maxScrollTop) {
            $toc.style.position = 'absolute';
            $toc.style.top = "".concat(maxTocTop, "px");
          } else {
            $toc.style.position = 'fixed';
            $toc.style.top = "".concat(TOP_SPACING, "px");
          }
          Util.forEach($tocLinkElements, function ($tocLink) {
            $tocLink.classList.remove('active');
          });
          Util.forEach($tocLiElements, function ($tocLi) {
            $tocLi.classList.remove('has-active');
          });
          var INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
          var activeTocIndex = $headerLinkElements.length - 1;
          for (var i = 0; i < $headerLinkElements.length - 1; i++) {
            var thisTop = $headerLinkElements[i].getBoundingClientRect().top;
            var nextTop = $headerLinkElements[i + 1].getBoundingClientRect().top;
            if (i === 0 && thisTop > INDEX_SPACING || thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING) {
              activeTocIndex = i;
              break;
            }
          }
          if (activeTocIndex !== -1) {
            $tocLinkElements[activeTocIndex].classList.add('active');
            var $parent = $tocLinkElements[activeTocIndex].parentElement;
            while ($parent !== $tocCore) {
              $parent.classList.add('has-active');
              $parent = $parent.parentElement.parentElement;
            }
          }
        };
        this._tocOnScroll();
        this.scrollEventSet.add(this._tocOnScroll);
      }
    }
  }, {
    key: "initMath",
    value: function initMath() {
      if (this.config.math) renderMathInElement(document.body, this.config.math);
    }
  }, {
    key: "initMermaid",
    value: function initMermaid() {
      var _this6 = this;
      this._mermaidOnSwitchTheme = this._mermaidOnSwitchTheme || function () {
        var $mermaidElements = document.getElementsByClassName('mermaid');
        if ($mermaidElements.length) {
          mermaid.initialize({
            startOnLoad: false,
            theme: _this6.isDark ? 'dark' : 'neutral',
            securityLevel: 'loose'
          });
          Util.forEach($mermaidElements, function ($mermaid) {
            mermaid.render('mermaid-svg-' + $mermaid.id, _this6.data[$mermaid.id]).then(function (_ref9) {
              var svg = _ref9.svg;
              $mermaid.innerHTML = svg;
            });
          });
        }
      };
      this.switchThemeEventSet.add(this._mermaidOnSwitchTheme);
      this._mermaidOnSwitchTheme();
    }
  }, {
    key: "initEcharts",
    value: function initEcharts() {
      var _this7 = this;
      if (this.config.echarts) {
        echarts.registerTheme('light', this.config.echarts.lightTheme);
        echarts.registerTheme('dark', this.config.echarts.darkTheme);
        this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || function () {
          _this7._echartsArr = _this7._echartsArr || [];
          for (var i = 0; i < _this7._echartsArr.length; i++) {
            _this7._echartsArr[i].dispose();
          }
          _this7._echartsArr = [];
          Util.forEach(document.getElementsByClassName('echarts'), function ($echarts) {
            var chart = echarts.init($echarts, _this7.isDark ? 'dark' : 'light', {
              renderer: 'svg'
            });
            chart.setOption(JSON.parse(_this7.data[$echarts.id]));
            _this7._echartsArr.push(chart);
          });
        };
        this.switchThemeEventSet.add(this._echartsOnSwitchTheme);
        this._echartsOnSwitchTheme();
        this._echartsOnResize = this._echartsOnResize || function () {
          for (var i = 0; i < _this7._echartsArr.length; i++) {
            _this7._echartsArr[i].resize();
          }
        };
        this.resizeEventSet.add(this._echartsOnResize);
      }
    }
  }, {
    key: "initMapbox",
    value: function initMapbox() {
      var _this8 = this;
      if (this.config.mapbox) {
        mapboxgl.accessToken = this.config.mapbox.accessToken;
        mapboxgl.setRTLTextPlugin(this.config.mapbox.RTLTextPlugin);
        this._mapboxArr = this._mapboxArr || [];
        Util.forEach(document.getElementsByClassName('mapbox'), function ($mapbox) {
          var _this8$data$$mapbox$i = _this8.data[$mapbox.id],
            lng = _this8$data$$mapbox$i.lng,
            lat = _this8$data$$mapbox$i.lat,
            zoom = _this8$data$$mapbox$i.zoom,
            lightStyle = _this8$data$$mapbox$i.lightStyle,
            darkStyle = _this8$data$$mapbox$i.darkStyle,
            marked = _this8$data$$mapbox$i.marked,
            navigation = _this8$data$$mapbox$i.navigation,
            geolocate = _this8$data$$mapbox$i.geolocate,
            scale = _this8$data$$mapbox$i.scale,
            fullscreen = _this8$data$$mapbox$i.fullscreen;
          var mapbox = new mapboxgl.Map({
            container: $mapbox,
            center: [lng, lat],
            zoom: zoom,
            minZoom: .2,
            style: _this8.isDark ? darkStyle : lightStyle,
            attributionControl: false
          });
          if (marked) {
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapbox);
          }
          if (navigation) {
            mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
          }
          if (geolocate) {
            mapbox.addControl(new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true
              },
              showUserLocation: true,
              trackUserLocation: true
            }), 'bottom-right');
          }
          if (scale) {
            mapbox.addControl(new mapboxgl.ScaleControl());
          }
          if (fullscreen) {
            mapbox.addControl(new mapboxgl.FullscreenControl());
          }
          mapbox.addControl(new MapboxLanguage());
          _this8._mapboxArr.push(mapbox);
        });
        this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || function () {
          Util.forEach(_this8._mapboxArr, function (mapbox) {
            var $mapbox = mapbox.getContainer();
            var _this8$data$$mapbox$i2 = _this8.data[$mapbox.id],
              lightStyle = _this8$data$$mapbox$i2.lightStyle,
              darkStyle = _this8$data$$mapbox$i2.darkStyle;
            mapbox.setStyle(_this8.isDark ? darkStyle : lightStyle);
            mapbox.addControl(new MapboxLanguage());
          });
        };
        this.switchThemeEventSet.add(this._mapboxOnSwitchTheme);
      }
    }
  }, {
    key: "initTypeit",
    value: function initTypeit() {
      var _this9 = this;
      if (this.config.typeit) {
        var typeitConfig = this.config.typeit;
        var speed = typeitConfig.speed ? typeitConfig.speed : 100;
        var cursorSpeed = typeitConfig.cursorSpeed ? typeitConfig.cursorSpeed : 1000;
        var cursorChar = typeitConfig.cursorChar ? typeitConfig.cursorChar : '|';
        Object.values(typeitConfig.data).forEach(function (group) {
          var _typeone = function typeone(i) {
            var id = group[i];
            new TypeIt("#".concat(id), {
              strings: _this9.data[id],
              speed: speed,
              lifeLike: true,
              cursorSpeed: cursorSpeed,
              cursorChar: cursorChar,
              waitUntilVisible: true,
              afterComplete: function afterComplete() {
                if (i === group.length - 1) {
                  if (typeitConfig.duration >= 0) window.setTimeout(function () {
                    instance.destroy();
                  }, typeitConfig.duration);
                  return;
                }
                instance.destroy();
                _typeone(i + 1);
              }
            }).go();
          };
          _typeone(0);
        });
      }
    }
  }, {
    key: "initComment",
    value: function initComment() {
      var _this10 = this;
      if (this.config.comment) {
        if (this.config.comment.gitalk) {
          this.config.comment.gitalk.body = decodeURI(window.location.href);
          var gitalk = new Gitalk(this.config.comment.gitalk);
          gitalk.render('gitalk');
        }
        if (this.config.comment.valine) new Valine(this.config.comment.valine);
        if (this.config.comment.utterances) {
          var utterancesConfig = this.config.comment.utterances;
          var script = document.createElement('script');
          script.src = 'https://utteranc.es/client.js';
          script.setAttribute('repo', utterancesConfig.repo);
          script.setAttribute('issue-term', utterancesConfig.issueTerm);
          if (utterancesConfig.label) script.setAttribute('label', utterancesConfig.label);
          script.setAttribute('theme', this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme);
          script.crossOrigin = 'anonymous';
          script.async = true;
          document.getElementById('utterances').appendChild(script);
          this._utterancesOnSwitchTheme = this._utterancesOnSwitchTheme || function () {
            var message = {
              type: 'set-theme',
              theme: _this10.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme
            };
            var iframe = document.querySelector('.utterances-frame');
            iframe.contentWindow.postMessage(message, 'https://utteranc.es');
          };
          this.switchThemeEventSet.add(this._utterancesOnSwitchTheme);
        }
        if (this.config.comment.giscus) {
          var giscusConfig = this.config.comment.giscus;
          var giscusScript = document.createElement('script');
          giscusScript.src = 'https://giscus.app/client.js';
          giscusScript.setAttribute('data-repo', giscusConfig.repo);
          giscusScript.setAttribute('data-repo-id', giscusConfig.repoId);
          giscusScript.setAttribute('data-category', giscusConfig.category);
          giscusScript.setAttribute('data-category-id', giscusConfig.categoryId);
          giscusScript.setAttribute('data-lang', giscusConfig.lang);
          giscusScript.setAttribute('data-mapping', giscusConfig.mapping);
          giscusScript.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled);
          giscusScript.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
          giscusScript.setAttribute('data-input-position', giscusConfig.inputPosition);
          if (giscusConfig.lazyLoading) giscusScript.setAttribute('data-loading', 'lazy');
          giscusScript.setAttribute('data-theme', this.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme);
          giscusScript.crossOrigin = 'anonymous';
          giscusScript.async = true;
          document.getElementById('giscus').appendChild(giscusScript);
          this._giscusOnSwitchTheme = this._giscusOnSwitchTheme || function () {
            var message = {
              setConfig: {
                theme: _this10.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme,
                reactionsEnabled: false
              }
            };
            var iframe = document.querySelector('iframe.giscus-frame');
            if (!iframe) return;
            iframe.contentWindow.postMessage({
              giscus: message
            }, 'https://giscus.app');
          };
          this.switchThemeEventSet.add(this._giscusOnSwitchTheme);
        }
        if (this.config.comment.waline) Waline.init(this.config.comment.waline);
      }
    }
  }, {
    key: "initCookieconsent",
    value: function initCookieconsent() {
      if (this.config.cookieconsent) cookieconsent.initialise(this.config.cookieconsent);
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      var _this11 = this;
      var $headers = [];
      if (document.body.getAttribute('data-header-desktop') === 'auto') $headers.push(document.getElementById('header-desktop'));
      if (document.body.getAttribute('data-header-mobile') === 'auto') $headers.push(document.getElementById('header-mobile'));
      if (document.getElementById('comments')) {
        var $viewComments = document.getElementById('view-comments');
        $viewComments.href = "#comments";
        $viewComments.parentElement.removeChild($viewComments);
        document.getElementById('fixed-buttons').appendChild($viewComments);
      }
      var $fixedButtons = document.getElementById('fixed-buttons');
      var ACCURACY = 20,
        MINIMUM = 100;
      window.addEventListener('scroll', function () {
        _this11.newScrollTop = Util.getScrollTop();
        var scroll = _this11.newScrollTop - _this11.oldScrollTop;
        var isMobile = Util.isMobile();
        Util.forEach($headers, function ($header) {
          if (scroll > ACCURACY) {
            $header.classList.remove('animate__fadeInDown');
            Util.animateCSS($header, ['animate__fadeOutUp', 'animate__faster'], true);
          } else if (scroll < -ACCURACY) {
            $header.classList.remove('animate__fadeOutUp');
            Util.animateCSS($header, ['animate__fadeInDown', 'animate__faster'], true);
          }
        });
        if (_this11.newScrollTop > MINIMUM) {
          if (isMobile && scroll > ACCURACY) {
            $fixedButtons.classList.remove('animate__fadeIn');
            Util.animateCSS($fixedButtons, ['animate__fadeOut', 'animate__faster'], true);
          } else if (!isMobile || scroll < -ACCURACY) {
            $fixedButtons.style.display = 'block';
            $fixedButtons.classList.remove('animate__fadeOut');
            Util.animateCSS($fixedButtons, ['animate__fadeIn', 'animate__faster'], true);
          }
        } else {
          if (!isMobile) {
            $fixedButtons.classList.remove('animate__fadeIn');
            Util.animateCSS($fixedButtons, ['animate__fadeOut', 'animate__faster'], true);
          }
          $fixedButtons.style.display = 'none';
        }
        var _iterator2 = _createForOfIteratorHelper(_this11.scrollEventSet),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var event = _step2.value;
            event();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        _this11.oldScrollTop = _this11.newScrollTop;
      }, false);
    }
  }, {
    key: "onResize",
    value: function onResize() {
      var _this12 = this;
      window.addEventListener('resize', function () {
        if (!_this12._resizeTimeout) {
          _this12._resizeTimeout = window.setTimeout(function () {
            _this12._resizeTimeout = null;
            var _iterator3 = _createForOfIteratorHelper(_this12.resizeEventSet),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var event = _step3.value;
                event();
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            _this12.initToc();
            _this12.initMermaid();
            _this12.initSearch();
          }, 100);
        }
      }, false);
    }
  }, {
    key: "onClickMask",
    value: function onClickMask() {
      var _this13 = this;
      document.getElementById('mask').addEventListener('click', function () {
        var _iterator4 = _createForOfIteratorHelper(_this13.clickMaskEventSet),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var event = _step4.value;
            event();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        document.body.classList.remove('blur');
      }, false);
    }
  }, {
    key: "init",
    value: function init() {
      var _this14 = this;
      try {
        this.initRaw();
        this.initSVGIcon();
        this.initTwemoji();
        this.initMenuMobile();
        this.initSwitchTheme();
        this.initSearch();
        this.initDetails();
        this.initLightGallery();
        this.initHighlight();
        this.initHeaderLink();
        this.initMath();
        this.initMermaid();
        this.initEcharts();
        this.initTypeit();
        this.initMapbox();
        this.initCookieconsent();
      } catch (err) {
        console.error(err);
      }
      window.setTimeout(function () {
        _this14.initToc();
        _this14.initComment();
        _this14.onScroll();
        _this14.onResize();
        _this14.onClickMask();
      }, 100);
    }
  }]);
}();
var themeInit = function themeInit() {
  var theme = new Theme();
  theme.init();
};
if (document.readyState !== 'loading') {
  themeInit();
} else {
  document.addEventListener('DOMContentLoaded', themeInit, false);
}
