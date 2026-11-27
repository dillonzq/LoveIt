import { SearchClient, escapeHTML, highlight } from './search.mjs';

class Util {
    static forEach(elements, handler) {
        elements = elements || [];
        for (let i = 0; i < elements.length; i++) handler(elements[i]);
    }

    static getScrollTop() {
        return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    }

    static isMobile() {
        return window.matchMedia('only screen and (max-width: 680px)').matches;
    }

    static isTocStatic() {
        return window.matchMedia('only screen and (max-width: 960px)').matches;
    }

    static prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    static animateCSS(element, animation, reserved, callback) {
        if (!Array.isArray(animation)) animation = [animation];
        element.classList.add('animate__animated', ...animation);
        const handler = () => {
            element.classList.remove('animate__animated', ...animation);
            element.removeEventListener('animationend', handler);
            if (typeof callback === 'function') callback();
        };
        if (!reserved) element.addEventListener('animationend', handler, false);
    }
}

class Theme {
    constructor() {
        this.config = window.config || {};
        this.data = this.config.data || {};
        this.isDark = document.body.getAttribute('theme') === 'dark';
        this.newScrollTop = Util.getScrollTop();
        this.oldScrollTop = this.newScrollTop;
        this.scrollEventSet = new Set();
        this.resizeEventSet = new Set();
        this.switchThemeEventSet = new Set();
        this.clickMaskEventSet = new Set();
        if (window.objectFitImages) objectFitImages();
    }

    initRaw() {
        Util.forEach(document.querySelectorAll('[data-raw]'), $raw => {
            $raw.innerHTML = this.data[$raw.id];
        });
    }

    initTwemoji() {
        if (this.config.twemoji) twemoji.parse(document.body);
    }

    setMenuMobileOpen(open) {
        const $menuToggleMobile = document.getElementById('menu-toggle-mobile');
        $menuToggleMobile.classList.toggle('active', open);
        $menuToggleMobile.setAttribute('aria-expanded', String(open));
        document.getElementById('menu-mobile').classList.toggle('active', open);
    }

    initMenuMobile() {
        const $menuToggleMobile = document.getElementById('menu-toggle-mobile');
        $menuToggleMobile.addEventListener('click', () => {
            document.body.classList.toggle('blur');
            this.setMenuMobileOpen(!$menuToggleMobile.classList.contains('active'));
        }, false);
        this._menuMobileOnClickMask = this._menuMobileOnClickMask || (() => this.setMenuMobileOpen(false));
        this.clickMaskEventSet.add(this._menuMobileOnClickMask);
    }

    updateThemeSwitchLabels() {
        const cfgTheme = document.body.getAttribute('cfg-theme');
        Util.forEach(document.getElementsByClassName('theme-switch'), $themeSwitch => {
            const label = $themeSwitch.dataset.label;
            const mode = $themeSwitch.getAttribute(`data-label-${cfgTheme}`);
            if (!label) return;
            const text = mode ? `${label}: ${mode}` : label;
            $themeSwitch.setAttribute('title', text);
            $themeSwitch.setAttribute('aria-label', text);
        });
    }

    initSwitchTheme() {
        this.updateThemeSwitchLabels();
        Util.forEach(document.getElementsByClassName('theme-switch'), $themeSwitch => {
            $themeSwitch.addEventListener('click', () => {
                const cfgTheme = document.body.getAttribute('cfg-theme');
                const theme = document.body.getAttribute('theme');

                const themes = ['auto', 'light' ,'dark'];
                const newTheme = themes[(themes.indexOf(cfgTheme) + 1) % themes.length];

                this.isDark = newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.body.setAttribute('theme', this.isDark ? 'dark' : 'light');
                document.body.setAttribute('cfg-theme', newTheme);
                window.localStorage?.setItem('theme', newTheme);
                this.updateThemeSwitchLabels();
                for (let event of this.switchThemeEventSet) event();
            }, false);
        });
    }

    initSearch() {
        const searchConfig = this.config.search;
        const $dialog = document.getElementById('search-dialog');
        if (!searchConfig || !$dialog) return;

        const highlightTag = searchConfig.highlightTag || 'em';
        const $input = document.getElementById('search-input');
        const $results = document.getElementById('search-results');
        const $empty = document.getElementById('search-empty');
        const $status = document.getElementById('search-status');
        const $loading = document.getElementById('search-loading');
        const $clear = document.getElementById('search-clear');
        const $toggles = document.querySelectorAll('[aria-controls="search-dialog"]');
        const $slash = document.getElementById('search-slash');
        const resultsLabel = $results.getAttribute('aria-label');
        const viewport = window.visualViewport;
        let requestId = 0;
        let searchTimer;
        let active = -1;
        // While a new query is pending, the listed options belong to the previous one.
        let stale = false;
        let queuedEnter = false;
        let opener;
        let ready;

        // Lunr's Chinese segmenter is a classic script, loaded before the first search.
        // A failed load is retried by the next search instead of building an index without it.
        const loadSegmentit = () => ready ??= new Promise((resolve, reject) => {
            if (!searchConfig.lunrSegmentitURL || window.lunr?.segmentit) return resolve();
            document.getElementById('lunr-segmentit')?.remove();
            const script = document.createElement('script');
            script.id = 'lunr-segmentit';
            script.src = searchConfig.lunrSegmentitURL;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
                script.remove();
                ready = undefined;
                reject(new Error(`Search segmenter: cannot load ${searchConfig.lunrSegmentitURL}`));
            };
            document.body.appendChild(script);
        });

        // `/` is a single-character shortcut, so visitors can turn it off (WCAG 2.1.4).
        let slashEnabled = true;
        try { slashEnabled = window.localStorage?.getItem('search-slash') !== 'off'; } catch {}
        $slash.checked = slashEnabled;
        const updateShortcuts = () => {
            Util.forEach($toggles, $toggle => $toggle.setAttribute('aria-keyshortcuts', `${slashEnabled ? '/ ' : ''}Control+K Meta+K`));
        };
        updateShortcuts();
        $slash.addEventListener('change', () => {
            slashEnabled = $slash.checked;
            try { window.localStorage?.setItem('search-slash', slashEnabled ? 'on' : 'off'); } catch {}
            updateShortcuts();
        }, false);

        const options = () => $results.querySelectorAll('[role="option"]');
        const setActive = index => {
            const $options = options();
            for (let i = 0; i < $options.length; i++) $options[i].setAttribute('aria-selected', String(i === index));
            active = index;
            if (index < 0) {
                $input.removeAttribute('aria-activedescendant');
                return;
            }
            $input.setAttribute('aria-activedescendant', $options[index].id);
            $options[index].scrollIntoView({ block: 'nearest' });
        };
        const render = (query, results) => {
            stale = false;
            active = -1;
            $input.removeAttribute('aria-activedescendant');
            $results.removeAttribute('aria-busy');
            $results.replaceChildren(...results.map((item, index) => {
                const $option = document.createElement('li');
                $option.id = `search-option-${index}`;
                $option.className = 'suggestion';
                $option.setAttribute('role', 'option');
                $option.setAttribute('aria-selected', 'false');
                $option.dataset.uri = item.uri;
                $option.innerHTML = `<div><span class="suggestion-title">${highlight(item.title, query, highlightTag)}</span>`
                    + `<span class="suggestion-date">${escapeHTML(item.date || '')}</span></div>`
                    + `<div class="suggestion-context">${highlight(item.context, query, highlightTag)}</div>`;
                return $option;
            }));
            const expanded = results.length > 0;
            $results.hidden = !expanded;
            $input.setAttribute('aria-expanded', String(expanded));
            $empty.hidden = !query || expanded;
            $empty.innerHTML = $empty.hidden ? ''
                : `${escapeHTML(searchConfig.noResultsFound)}: <span class="search-query">"${escapeHTML(query)}"</span>`;
            $status.textContent = !query ? '' : expanded ? `${resultsLabel}: ${results.length}` : searchConfig.noResultsFound;
        };
        const go = ($option, newTab) => {
            const uri = $option?.dataset.uri;
            if (stale || !$dialog.open || !uri) return;
            let url;
            try {
                url = new URL(uri, document.baseURI);
            } catch {
                return;
            }
            // Records come from an index or a remote service; never follow `javascript:` and the like.
            if (!['http:', 'https:'].includes(url.protocol)) return;
            if (newTab) {
                window.open(url.href, '_blank', 'noopener');
            } else {
                // Closing first allows same-page fragment navigation to move focus to the result.
                opener = undefined;
                $dialog.close();
                window.location.assign(url.href);
            }
        };
        const markStale = () => {
            stale = true;
            setActive(-1);
            $results.setAttribute('aria-busy', 'true');
        };
        const search = () => {
            const id = ++requestId;
            const query = $input.value;
            clearTimeout(searchTimer);
            queuedEnter = false;
            $clear.hidden = !query;
            if (!query.trim()) {
                $loading.hidden = true;
                render('', []);
                return;
            }
            markStale();
            $loading.hidden = false;
            $clear.hidden = true;
            searchTimer = setTimeout(async () => {
                let results = [];
                try {
                    await loadSegmentit();
                    this._searchClient = this._searchClient || new SearchClient(searchConfig);
                    results = await this._searchClient.search(query);
                } catch (error) {
                    console.error(error);
                }
                if (id !== requestId || $input.value !== query) return;
                $loading.hidden = true;
                $clear.hidden = false;
                render(query, results);
                // Enter pressed while this query was pending opens its first result.
                if (queuedEnter) go(options()[0], false);
                queuedEnter = false;
            }, 120);
        };
        const resetSearch = () => {
            $input.value = '';
            search();
        };
        // The mobile keyboard can resize the visual viewport alone.
        const fitViewport = () => {
            $dialog.style.setProperty('--search-viewport-height', `${viewport.height}px`);
            $dialog.style.setProperty('--search-viewport-top', `${viewport.offsetTop}px`);
        };
        const open = $opener => {
            if (!$dialog.open) {
                resetSearch();
                // Safari does not focus a clicked button, so the toggle is passed in.
                opener = $opener || document.activeElement;
                $dialog.showModal();
                if (viewport) {
                    fitViewport();
                    viewport.addEventListener('resize', fitViewport);
                    viewport.addEventListener('scroll', fitViewport);
                }
                loadSegmentit().catch(() => {});
            }
            $input.focus();
            $input.select();
        };

        Util.forEach($toggles, $toggle => $toggle.addEventListener('click', () => {
            this.setMenuMobileOpen(false);
            document.body.classList.remove('blur');
            open($toggle);
        }, false));
        document.getElementById('search-cancel').addEventListener('click', () => $dialog.close(), false);
        $clear.addEventListener('click', () => {
            $input.value = '';
            search();
            $input.focus();
        }, false);
        $input.addEventListener('input', search, false);
        // Safari reports the Enter that commits an IME candidate with isComposing false and keyCode 229.
        const composing = event => event.isComposing || event.keyCode === 229;
        $input.addEventListener('keydown', event => {
            if (composing(event)) return;
            const count = options().length;
            const newTab = event.ctrlKey || event.metaKey || event.shiftKey;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (!count || stale) return;
                event.preventDefault();
                const step = event.key === 'ArrowDown' ? 1 : -1;
                setActive(active < 0 && step < 0 ? count - 1 : (active + step + count) % count);
            } else if (event.key === 'Enter') {
                if (stale) {
                    event.preventDefault();
                    // Opening a new tab requires the keypress's user activation.
                    if (!newTab && !event.altKey) queuedEnter = true;
                } else if (count) {
                    event.preventDefault();
                    go(options()[Math.max(active, 0)], newTab);
                }
            }
        }, false);
        $results.addEventListener('click', event => {
            go(event.target.closest('[role="option"]'), event.ctrlKey || event.metaKey || event.shiftKey);
        }, false);
        $results.addEventListener('auxclick', event => {
            if (event.button === 1) go(event.target.closest('[role="option"]'), true);
        }, false);
        // A click on the backdrop lands on the dialog itself; ignore drags that start inside the panel.
        let pressedBackdrop = false;
        $dialog.addEventListener('pointerdown', event => { pressedBackdrop = event.target === $dialog; }, false);
        $dialog.addEventListener('click', event => {
            if (pressedBackdrop && event.target === $dialog) $dialog.close();
        }, false);
        $dialog.addEventListener('close', () => {
            // An earlier close event can arrive after the dialog has reopened.
            if ($dialog.open) return;
            viewport?.removeEventListener('resize', fitViewport);
            viewport?.removeEventListener('scroll', fitViewport);
            resetSearch();
            if (opener?.isConnected && opener !== document.body) opener.focus();
            opener = undefined;
        }, false);
        document.addEventListener('keydown', event => {
            // Autofill dispatches keydown events without a key.
            if (event.defaultPrevented || composing(event) || event.altKey || !event.key) return;
            const shortcut = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'k';
            const slash = event.key === '/' && !event.ctrlKey && !event.metaKey && !$dialog.open && slashEnabled
                && !event.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
            if (!shortcut && !slash) return;
            event.preventDefault();
            open();
        }, false);
    }

    initDetails() {
        Util.forEach(document.getElementsByClassName('details'), $details => {
            const $summary = $details.getElementsByClassName('details-summary')[0];
            $summary.addEventListener('click', () => {
                $details.classList.toggle('open');
            }, false);
        });
    }

    initLightGallery() {
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
            showZoomInOutIcons: true,
            // lightGallery 3 hides the zoom buttons on touch devices; keep them as in v2.
            // mobileSettings replaces the defaults as a whole, so restate the others.
            mobileSettings: {
                controls: false,
                showCloseIcon: false,
                download: false,
                showGestureButtons: true,
            },
        });
    }

    initHighlight() {
        Util.forEach(document.querySelectorAll('.code-block'), $codeBlock => {
            const $codeTitle = $codeBlock.querySelector('.code-header > .code-title');
            if ($codeTitle) {
                $codeTitle.addEventListener('click', () => {
                    $codeBlock.classList.toggle('open');
                }, false);
            }
            const $ellipses = $codeBlock.querySelector('.code-header .ellipses');
            if ($ellipses) {
                $ellipses.addEventListener('click', () => {
                    $codeBlock.classList.toggle('open');
                }, false);
            }
            const $copy = $codeBlock.querySelector('.code-header .copy');
            if ($copy) {
                const $code = $codeBlock.querySelector('code');
                // innerText adds a line break after every block-level line span on top of
                // the newline already in the code, so copied code had blank lines between lines.
                $copy.setAttribute('data-clipboard-text', $code.textContent);
                const clipboard = new ClipboardJS($copy);
                const $codeLines = $code.querySelectorAll('span.cl');
                clipboard.on('success', _e => {
                    if ($codeLines) {
                        Util.forEach($codeLines, $codeLine => Util.animateCSS($codeLine, 'animate__flash'))
                    }
                });
            }
        });
    }

    initToc() {
        const $tocCore = document.getElementById('TableOfContents');
        if ($tocCore === null) return;
        if (document.getElementById('toc-static').getAttribute('data-kept') || Util.isTocStatic()) {
            const $tocContentStatic = document.getElementById('toc-content-static');
            if ($tocCore.parentElement !== $tocContentStatic) {
                $tocCore.parentElement.removeChild($tocCore);
                $tocContentStatic.appendChild($tocCore);
            }
            if (this._tocOnScroll) this.scrollEventSet.delete(this._tocOnScroll);
        } else {
            const $tocContentAuto = document.getElementById('toc-content-auto');
            if ($tocCore.parentElement !== $tocContentAuto) {
                $tocCore.parentElement.removeChild($tocCore);
                $tocContentAuto.appendChild($tocCore);
            }
            const $toc = document.getElementById('toc-auto');
            const $page = document.getElementsByClassName('page')[0];
            const rect = $page.getBoundingClientRect();
            // The TOC sits beside the page on its inline-end side: right in LTR, left in RTL.
            const gap = 20;
            const width = rect.left - gap;
            const isRtl = window.getComputedStyle($toc).direction === 'rtl';
            $toc.style.left = `${isRtl ? rect.left - gap - width : rect.right + gap}px`;
            $toc.style.maxWidth = `${width}px`;
            $toc.style.visibility = 'visible';
            const $tocLinkElements = $tocCore.querySelectorAll('a:first-child');
            const $tocLiElements = $tocCore.getElementsByTagName('li');
            // Match headings inside the article so a wrapper with the same ID cannot become a TOC target.
            const $headings = $page.querySelectorAll('.content :is(h1, h2, h3, h4, h5, h6)[id]');
            const headingsById = new Map(Array.from($headings, $heading => [$heading.id, $heading]));
            const $tocTargets = Array.from($tocLinkElements, $tocLink => [$tocLink, headingsById.get($tocLink.getAttribute('href').slice(1))])
                .filter(([, $heading]) => $heading);
            const $headerLinkElements = $tocTargets.map(([, $heading]) => $heading);
            const $targetTocLinks = $tocTargets.map(([$tocLink]) => $tocLink);
            const headerIsFixed = document.body.getAttribute('data-header-desktop') !== 'normal';
            const headerHeight = document.getElementById('header-desktop').offsetHeight;
            const TOP_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
            const minTocTop = $toc.offsetTop;
            const minScrollTop = minTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
            // Re-check that the active link is visible after every (re)initialization, e.g. on resize.
            this._lastActiveTocIndex = -1;
            this._tocOnScroll = this._tocOnScroll || (() => {
                // Keep the whole TOC on screen: cap its height to the space below its current top,
                // which is lower at rest than while fixed. Longer contents scroll inside it.
                const tocViewportTop = Math.max(minTocTop + (headerIsFixed ? 0 : headerHeight) - this.newScrollTop, TOP_SPACING);
                $toc.style.maxHeight = `calc(100vh - ${tocViewportTop + 20}px)`;
                const footerTop = document.getElementById('post-footer').offsetTop;
                const maxTocTop = footerTop - $toc.getBoundingClientRect().height;
                const maxScrollTop = maxTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
                if (this.newScrollTop < minScrollTop) {
                    $toc.style.position = 'absolute';
                    $toc.style.top = `${minTocTop}px`;
                } else if (this.newScrollTop > maxScrollTop) {
                    $toc.style.position = 'absolute';
                    $toc.style.top = `${maxTocTop}px`;
                } else {
                    $toc.style.position = 'fixed';
                    $toc.style.top = `${TOP_SPACING}px`;
                }

                Util.forEach($tocLinkElements, $tocLink => { $tocLink.classList.remove('active'); });
                Util.forEach($tocLiElements, $tocLi => { $tocLi.classList.remove('has-active'); });
                const INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
                let activeTocIndex = $headerLinkElements.length - 1;
                for (let i = 0; i < $headerLinkElements.length - 1; i++) {
                    const thisTop = $headerLinkElements[i].getBoundingClientRect().top;
                    const nextTop = $headerLinkElements[i + 1].getBoundingClientRect().top;
                    if ((i === 0 && thisTop > INDEX_SPACING)
                     || (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)) {
                        activeTocIndex = i;
                        break;
                    }
                }
                if (activeTocIndex !== -1) {
                    $targetTocLinks[activeTocIndex].classList.add('active');
                    let $parent = $targetTocLinks[activeTocIndex].parentElement;
                    while ($parent !== $tocCore) {
                        $parent.classList.add('has-active');
                        $parent = $parent.parentElement.parentElement;
                    }
                }
                // When the active section changes, scroll it into view inside the TOC only,
                // leaving the page scroll alone and the reader free to browse the TOC otherwise.
                if (activeTocIndex !== this._lastActiveTocIndex) {
                    this._lastActiveTocIndex = activeTocIndex;
                    if (activeTocIndex !== -1 && $tocContentAuto.scrollHeight > $tocContentAuto.clientHeight) {
                        const box = $tocContentAuto.getBoundingClientRect();
                        const link = $targetTocLinks[activeTocIndex].getBoundingClientRect();
                        if (link.top < box.top) $tocContentAuto.scrollTop += Math.floor(link.top - box.top);
                        else if (link.bottom > box.bottom) $tocContentAuto.scrollTop += Math.ceil(link.bottom - box.bottom);
                    }
                }
            });
            this._tocOnScroll();
            this.scrollEventSet.add(this._tocOnScroll);
        }
    }

    initMath() {
        if (this.config.math) renderMathInElement(document.body, this.config.math);
    }

    getMermaidDefinition(element) {
        if (!element) return null;

        const id = element.id;
        if (id && this.data && typeof this.data[id] === 'string') {
            const fromConfig = this.data[id].trim();
            if (fromConfig.length > 0) return fromConfig;
        }

        const fromText = element.textContent;
        if (fromText && fromText.trim().length > 0) {
            return fromText.trim();
        }

        return null;
    }

    initMermaid() {
        this._mermaidOnSwitchTheme = this._mermaidOnSwitchTheme || (() => {
            const $mermaidElements = document.getElementsByClassName('mermaid');
            if (!$mermaidElements.length) return;

            // "loose" only when the site sets it explicitly; anything else renders with "strict".
            const securityLevel = this.config.mermaid && this.config.mermaid.securityLevel === 'loose' ? 'loose' : 'strict';
            mermaid.initialize({startOnLoad: false, theme: this.isDark ? 'dark' : 'neutral', securityLevel});
            // Identical diagrams in separately rendered blocks share an element id; the index keeps render ids unique.
            Array.from($mermaidElements).forEach(($mermaid, index) => {
                const definition = this.getMermaidDefinition($mermaid);
                if (!definition) return;

                mermaid
                    .render(`mermaid-svg-${$mermaid.id}-${index}`, definition)
                    .then(({ svg }) => {
                        $mermaid.innerHTML = svg;
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
        this.switchThemeEventSet.add(this._mermaidOnSwitchTheme);
        this._mermaidOnSwitchTheme();
    }

    initEcharts() {
        if (this.config.echarts) {
            echarts.registerTheme('light', this.config.echarts.lightTheme);
            echarts.registerTheme('dark', this.config.echarts.darkTheme);
            this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || (() => {
                this._echartsArr = this._echartsArr || [];
                for (let i = 0; i < this._echartsArr.length; i++) {
                    this._echartsArr[i].dispose();
                }
                this._echartsArr = [];
                Util.forEach(document.getElementsByClassName('echarts'), $echarts => {
                    const chart = echarts.init($echarts, this.isDark ? 'dark' : 'light', {renderer: 'svg'});
                    chart.setOption(JSON.parse(this.data[$echarts.id]));
                    this._echartsArr.push(chart);
                });
            });
            this.switchThemeEventSet.add(this._echartsOnSwitchTheme);
            this._echartsOnSwitchTheme();
            this._echartsOnResize = this._echartsOnResize || (() => {
                for (let i = 0; i < this._echartsArr.length; i++) {
                    this._echartsArr[i].resize();
                }
            });
            this.resizeEventSet.add(this._echartsOnResize);
        }
    }

    initMapbox() {
        if (this.config.mapbox) {
            // Mapbox GL JS v3 requires WebGL 2; skip maps instead of throwing and aborting the remaining init steps.
            if (!mapboxgl.supported()) {
                console.warn('Mapbox GL JS is not supported by this browser (WebGL 2 is required).');
                return;
            }
            mapboxgl.accessToken = this.config.mapbox.accessToken;
            this._mapboxArr = this._mapboxArr || [];
            Util.forEach(document.getElementsByClassName('mapbox'), $mapbox => {
                const { lng, lat, zoom, lightStyle, darkStyle, marked, navigation, geolocate, scale, fullscreen } = this.data[$mapbox.id];
                const mapbox = new mapboxgl.Map({
                    container: $mapbox,
                    center: [lng, lat],
                    zoom: zoom,
                    minZoom: .2,
                    style: this.isDark ? darkStyle : lightStyle,
                    attributionControl: false,
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
                            enableHighAccuracy: true,
                        },
                        showUserLocation: true,
                        trackUserLocation: true,
                    }), 'bottom-right');
                }
                if (scale) {
                    mapbox.addControl(new mapboxgl.ScaleControl());
                }
                if (fullscreen) {
                    mapbox.addControl(new mapboxgl.FullscreenControl());
                }
                mapbox.addControl(new MapboxLanguage());
                this._mapboxArr.push(mapbox);
            });
            this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || (() => {
                Util.forEach(this._mapboxArr, mapbox => {
                    const $mapbox = mapbox.getContainer();
                    const { lightStyle, darkStyle } = this.data[$mapbox.id];
                    mapbox.setStyle(this.isDark ? darkStyle : lightStyle);
                    mapbox.addControl(new MapboxLanguage());
                });
            });
            this.switchThemeEventSet.add(this._mapboxOnSwitchTheme);
        }
    }

    initTypeit() {
        if (this.config.typeit) {
            const typeitConfig = this.config.typeit;
            if (Util.prefersReducedMotion()) {
                // Show the full text at once instead of typing it out.
                Object.values(typeitConfig.data).forEach(group => group.forEach(id => {
                    const $typeit = document.getElementById(id);
                    if (!$typeit) return;
                    const strings = this.data[id];
                    const html = Array.isArray(strings) ? strings.join('<br>') : (strings ?? '');
                    if ($typeit instanceof HTMLInputElement || $typeit instanceof HTMLTextAreaElement) {
                        // Like TypeIt, form fields get the text content as their value.
                        const template = document.createElement('template');
                        template.innerHTML = html;
                        $typeit.value = template.content.textContent;
                    } else {
                        $typeit.innerHTML = html;
                    }
                }));
                return;
            }
            const speed = typeitConfig.speed ? typeitConfig.speed : 100;
            const cursorSpeed = typeitConfig.cursorSpeed ? typeitConfig.cursorSpeed : 1000;
            const cursorChar = typeitConfig.cursorChar ? typeitConfig.cursorChar : '|';
            Object.values(typeitConfig.data).forEach(group => {
                const typeone = (i) => {
                    const id = group[i];
                    new TypeIt(`#${id}`, {
                        strings: this.data[id],
                        speed: speed,
                        lifeLike: true,
                        cursorSpeed: cursorSpeed,
                        cursorChar: cursorChar,
                        waitUntilVisible: true,
                        afterComplete: instance => {
                            if (i === group.length - 1) {
                                if (typeitConfig.duration >= 0) window.setTimeout(() => {
                                    instance.destroy();
                                }, typeitConfig.duration);
                                return;
                            }
                            instance.destroy();
                            typeone(i + 1);
                        },
                    }).go();
                };
                typeone(0);
            });
        }
    }

    initComment() {
        if (this.config.comment) {
            if (this.config.comment.gitalk) {
                this.config.comment.gitalk.body = decodeURI(window.location.href);
                const gitalk = new Gitalk(this.config.comment.gitalk);
                gitalk.render('gitalk');
            }
            if (this.config.comment.valine) {
                // Valine renders comment avatars without alt text. Each avatar sits
                // next to the commenter's name, so mark it decorative, including the
                // avatars that pagination, replies and new comments add later.
                const valine = document.querySelector(this.config.comment.valine.el);
                if (valine) {
                    const markAvatars = () => {
                        valine.querySelectorAll('img.vimg:not([alt])').forEach(img => img.setAttribute('alt', ''));
                    };
                    new MutationObserver(markAvatars).observe(valine, { childList: true, subtree: true });
                }
                new Valine(this.config.comment.valine);
            }
            if (this.config.comment.utterances) {
                const utterancesConfig = this.config.comment.utterances;
                const script = document.createElement('script');
                script.src = 'https://utteranc.es/client.js';
                script.setAttribute('repo', utterancesConfig.repo);
                script.setAttribute('issue-term', utterancesConfig.issueTerm);
                if (utterancesConfig.label) script.setAttribute('label', utterancesConfig.label);
                script.setAttribute('theme', this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme);
                script.crossOrigin = 'anonymous';
                script.async = true;
                document.getElementById('utterances').appendChild(script);
                this._utterancesOnSwitchTheme = this._utterancesOnSwitchTheme || (() => {
                    const message = {
                        type: 'set-theme',
                        theme: this.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme,
                    };
                    const iframe = document.querySelector('.utterances-frame');
                    if (!iframe) return;
                    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
                });
                this.switchThemeEventSet.add(this._utterancesOnSwitchTheme);
            }

            if (this.config.comment.giscus) {
                const giscusConfig = this.config.comment.giscus;
                const giscusScript = document.createElement('script');
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
                this._giscusOnSwitchTheme = this._giscusOnSwitchTheme || (() => {
                    const message = {
                        setConfig: {
                            theme: this.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme,
                            reactionsEnabled: false,
                        }
                    };
                    const iframe = document.querySelector('iframe.giscus-frame');
                    if (!iframe) return;
                    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
                });
                this.switchThemeEventSet.add(this._giscusOnSwitchTheme);
            }
            if (this.config.comment.waline) Waline.init(this.config.comment.waline);
        }
    }

    initCookieconsent() {
        if (this.config.cookieconsent) cookieconsent.initialise(this.config.cookieconsent);
    }

    onScroll() {
        const $headers = [];
        if (document.body.getAttribute('data-header-desktop') === 'auto') $headers.push(document.getElementById('header-desktop'));
        if (document.body.getAttribute('data-header-mobile') === 'auto') $headers.push(document.getElementById('header-mobile'));
        if (document.getElementById('comments')) {
            const $viewComments = document.getElementById('view-comments');
            $viewComments.href = `#comments`;
            $viewComments.parentElement.removeChild($viewComments);
            document.getElementById('fixed-buttons').appendChild($viewComments);
        }
        const $fixedButtons = document.getElementById('fixed-buttons');
        const ACCURACY = 20, MINIMUM = 100;
        let scrollFrame;
        window.addEventListener('scroll', () => {
            if (scrollFrame) return;
            scrollFrame = requestAnimationFrame(() => {
                scrollFrame = null;
                this.newScrollTop = Util.getScrollTop();
                const scroll = this.newScrollTop - this.oldScrollTop;
                const isMobile = Util.isMobile();
                Util.forEach($headers, $header => {
                    if (scroll > ACCURACY) {
                        $header.classList.remove('animate__fadeInDown');
                        Util.animateCSS($header, ['animate__fadeOutUp', 'animate__faster'], true);
                    } else if (scroll < - ACCURACY) {
                        $header.classList.remove('animate__fadeOutUp');
                        Util.animateCSS($header, ['animate__fadeInDown', 'animate__faster'], true);
                    }
                });
                if (this.newScrollTop > MINIMUM) {
                    if (isMobile && scroll > ACCURACY) {
                        $fixedButtons.classList.remove('animate__fadeIn');
                        Util.animateCSS($fixedButtons, ['animate__fadeOut', 'animate__faster'], true);
                    } else if (!isMobile || scroll < - ACCURACY) {
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
                for (let event of this.scrollEventSet) event();
                this.oldScrollTop = this.newScrollTop;
            });
        }, { passive: true });
    }

    onResize() {
        window.addEventListener('resize', () => {
            if (!this._resizeTimeout) {
                this._resizeTimeout = window.setTimeout(() => {
                    this._resizeTimeout = null;
                    for (let event of this.resizeEventSet) event();
                    this.initToc();
                }, 100);
            }
        }, false);
    }

    onClickMask() {
        document.getElementById('mask').addEventListener('click', () => {
            for (let event of this.clickMaskEventSet) event();
            document.body.classList.remove('blur');
        }, false);
    }

    init() {
        try {
            this.initRaw();
            this.initTwemoji();
            this.initMenuMobile();
            this.onClickMask();
            this.initSwitchTheme();
            this.initSearch();
            this.onResize();
            this.onScroll();
            this.initDetails();
            this.initLightGallery();
            this.initHighlight();
            this.initMath();
            this.initMermaid();
            this.initEcharts();
            this.initTypeit();
            this.initMapbox();
            this.initCookieconsent();
        } catch (err) {
            console.error(err);
        }

        window.setTimeout(() => {
            this.initToc();
            this.initComment();

        }, 100);
    }
}

const themeInit = () => {
    const theme = new Theme();
    theme.init();
};

if (document.readyState !== 'loading') {
    themeInit();
} else {
    document.addEventListener('DOMContentLoaded', themeInit, false);
}
