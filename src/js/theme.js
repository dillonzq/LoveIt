(() => {
    'use strict';

    class Util {
        forEach(elements, handler) {
            elements = elements || [];
            for (let i = 0; i < elements.length; i++) {
                handler(elements[i]);
            }
        }

        getScrollTop() {
            return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        }

        isMobile() {
            return window.matchMedia('only screen and (max-width: 680px)').matches;
        }

        isTocStatic() {
            return window.matchMedia('only screen and (max-width: 960px)').matches;
        }
    }

    class Theme {
        constructor() {
            this.util = new Util();
            this.newScrollTop = this.util.getScrollTop();
            this.oldScrollTop = this.newScrollTop;
            this.scrollEventSet = new Set();
            this.resizeEventSet = new Set();
            this.switchThemeEventSet = new Set();
        }

        initMenuMobile() {
            const menuToggleMobile = document.getElementById('menu-toggle-mobile');
            const menuMobile = document.getElementById('menu-mobile');
            this._menuMobileOnScroll = this._menuMobileOnScroll || (() => {
                menuToggleMobile.classList.remove('active');
                menuMobile.classList.remove('active');
            });
            if (this.util.isMobile()) {
                menuToggleMobile.onclick = () => {
                    menuToggleMobile.classList.toggle('active');
                    menuMobile.classList.toggle('active');
                };
                this.scrollEventSet.add(this._menuMobileOnScroll);
            } else {
                this.scrollEventSet.delete(this._menuMobileOnScroll);
            }
        }

        initSwitchTheme() {
            this.util.forEach(document.getElementsByClassName('theme-switch'), (button) => {
                button.onclick = () => {
                    document.body.classList.toggle('dark-theme');
                    window.isDark = !window.isDark;
                    window.localStorage && window.localStorage.setItem('theme', window.isDark ? 'dark' : 'light');
                    for (let event of this.switchThemeEventSet) event();
                };
            });
        }

        initHighlight() {
            this.util.forEach(document.querySelectorAll('.highlight > .chroma'), (block) => {
                const codes = block.querySelectorAll('pre.chroma > code');
                const code = codes[codes.length - 1];
                const lang = code ? code.className.toLowerCase() : '';
                block.className += ' ' + lang;
            });
            this.util.forEach(document.querySelectorAll('.highlight > pre.chroma'), (block) => {
                const chroma = document.createElement('div');
                chroma.className = block.className;
                const table = document.createElement('table');
                chroma.appendChild(table);
                const tbody = document.createElement('tbody');
                table.appendChild(tbody);
                const tr = document.createElement('tr');
                tbody.appendChild(tr);
                const td = document.createElement('td');
                tr.appendChild(td);
                block.parentElement.replaceChild(chroma, block);
                td.appendChild(block);
            });
        }

        initTable() {
            this.util.forEach(document.querySelectorAll('.content table'), (table) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                table.parentElement.replaceChild(wrapper, table);
                wrapper.appendChild(table);
            });
        }

        initHeaderLink() {
            for (let num = 1; num <= 6; num++) {
                this.util.forEach(document.querySelectorAll('.page.single .content > h' + num), (header) => {
                    header.classList.add('headerLink');
                    header.innerHTML = `<a href="#${header.id}" class="header-mark"></a>${header.innerHTML}`;
                });
            }
        }

        initToc() {
            const tocCore = document.getElementById('TableOfContents');
            if (tocCore === null) return;
            if (this.util.isTocStatic()) {
                const tocContentStatic = document.getElementById('toc-content-static');
                if (tocCore.parentElement !== tocContentStatic) {
                    tocCore.parentElement.removeChild(tocCore);
                    tocContentStatic.appendChild(tocCore);
                }
                if (this._tocOnScroll) this.scrollEventSet.delete(this._tocOnScroll);
            } else {
                const tocContentAuto = document.getElementById('toc-content-auto');
                if (tocCore.parentElement !== tocContentAuto) {
                    tocCore.parentElement.removeChild(tocCore);
                    tocContentAuto.appendChild(tocCore);
                }
                const toc = document.getElementById('toc-auto');
                const page = document.getElementsByClassName('page')[0];
                toc.style.maxWidth = `${page.getBoundingClientRect().left - 20}px`;
                this._tocLinks = this._tocLinks || tocCore.getElementsByTagName('a');
                this._tocLis = this._tocLis || tocCore.getElementsByTagName('li');
                this._headerLinks = this._headerLinks || document.getElementsByClassName('headerLink');
                const headerIsFixed = window.desktopHeaderMode !== 'normal';
                const headerHeight = document.getElementById('header-desktop').offsetHeight;
                const TOP_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
                const minTocTop = toc.offsetTop;
                const minScrollTop = minTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
                this._tocOnScroll = this._tocOnScroll || (() => {
                    const footerTop = document.getElementById('post-footer').offsetTop;
                    const maxTocTop = footerTop - toc.getBoundingClientRect().height;
                    const maxScrollTop = maxTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
                    const rect = page.getBoundingClientRect();
                    if (this.newScrollTop < minScrollTop) {
                        toc.style.position = 'absolute';
                        toc.style.top = `${minTocTop}px`;
                        toc.style.left = `${rect.width + 20}px`;
                    } else if (this.newScrollTop > maxScrollTop) {
                        toc.style.position = 'absolute';
                        toc.style.top = `${maxTocTop}px`;
                        toc.style.left = `${rect.width + 20}px`;
                    } else {
                        toc.style.position = 'fixed';
                        toc.style.top = `${TOP_SPACING}px`;
                        toc.style.left = `${rect.left + rect.width + 20}px`;
                    }

                    this.util.forEach(this._tocLinks, (link) => { link.classList.remove('active'); });
                    this.util.forEach(this._tocLis, (link) => { link.classList.remove('has-active'); });
                    const INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
                    let activeTocIndex = this._headerLinks.length - 1;
                    for (let i = 0; i < this._headerLinks.length - 1; i++) {
                        const thisTop = this._headerLinks[i].getBoundingClientRect().top;
                        const nextTop = this._headerLinks[i + 1].getBoundingClientRect().top;
                        if ((i == 0 && thisTop > INDEX_SPACING)
                         || (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)) {
                            activeTocIndex = i;
                            break;
                        }
                    }
                    if (activeTocIndex !== -1) {
                        this._tocLinks[activeTocIndex].classList.add('active');
                        let parent = this._tocLinks[activeTocIndex].parentElement;
                        while (parent !== tocCore) {
                            parent.classList.add('has-active');
                            parent = parent.parentElement.parentElement;
                        }
                    }
                });
                this._tocOnScroll();
                this.scrollEventSet.add(this._tocOnScroll);
            }
        }

        initMermaid() {
            const elements = document.getElementsByClassName('mermaid');
            if (elements.length) {
                mermaid.initialize({startOnLoad: false, theme: 'null'});
                this.util.forEach(elements, (element) => {
                    mermaid.mermaidAPI.render('svg-' + element.id, window.contentMap[element.id], (svgCode) => {
                        element.innerHTML = svgCode;
                    }, element);
                });
            }
        }

        initEcharts() {
            this._echartsOnSwitchTheme = this._echartsOnSwitchTheme || (() => {
                this._echartsArr = this._echartsArr || [];
                for (let i = 0; i < this._echartsArr.length; i++) {
                    this._echartsArr[i].dispose();
                }
                this._echartsArr = [];
                this.util.forEach(document.getElementsByClassName('echarts'), (element) => {
                    const chart = echarts.init(element, window.isDark ? 'dark' : 'macarons', {renderer: 'svg'});
                    chart.setOption(JSON.parse(window.contentMap[element.id]));
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

        initMapbox() {
            this._mapboxArr = this._mapboxArr || [];
            this.util.forEach(document.getElementsByClassName('mapbox'), (element) => {
                const options = window.contentMap[element.id];
                const mapbox = new mapboxgl.Map({
                    container: element,
                    center: [options['lng'], options['lat']],
                    zoom: options['zoom'],
                    minZoom: .2,
                    style: window.isDark ? options['dark-style'] : options['light-style'],
                    attributionControl: false,
                });
                if (options['navigation']) {
                    mapbox.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
                }
                if (options['geolocate']) {
                    mapbox.addControl(new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true,
                        },
                        showUserLocation: true,
                        trackUserLocation: true,
                    }), 'bottom-right');
                }
                if (options['scale']) {
                    mapbox.addControl(new mapboxgl.ScaleControl());
                }
                if (options['fullscreen']) {
                    mapbox.addControl(new mapboxgl.FullscreenControl());
                }
                mapbox.addControl(new MapboxLanguage());
                new mapboxgl.Marker().setLngLat([options['lng'], options['lat']]).addTo(mapbox);
                this._mapboxArr.push(mapbox);
            });
            this._mapboxOnSwitchTheme = this._mapboxOnSwitchTheme || (() => {
                this.util.forEach(this._mapboxArr, (mapbox) => {
                    const element = mapbox.getContainer();
                    const options = window.contentMap[element.id];
                    mapbox.setStyle(window.isDark ? options['dark-style'] : options['light-style']);
                });
            });
            this.switchThemeEventSet.add(this._mapboxOnSwitchTheme);
        }

        initTypeit() {
            if (window.typeitArr) {
                for (let i = 0; i < window.typeitArr.length; i++) {
                    const group = window.typeitArr[i];
                    (function typeone(i) {
                        const id = group[i];
                        if (i === group.length - 1) {
                            new TypeIt(`#${id}`, {
                                strings: window.contentMap[id],
                            }).go();
                            return;
                        }
                        let instance = new TypeIt(`#${id}`, {
                            strings: window.contentMap[id],
                            afterComplete: () => {
                                instance.destroy();
                                typeone(i + 1);
                            },
                        }).go();
                    })(0);
                }
            }
        }

        initSmoothScroll() {
            if ((!this.util.isMobile() && window.desktopHeaderMode === 'normal')
              || (this.util.isMobile() && window.mobileHeaderMode === 'normal')) {
                new SmoothScroll('[href^="#"]', {speed: 300, speedAsDuration: true});
            } else {
                new SmoothScroll('[href^="#"]', {speed: 300, speedAsDuration: true, header: '#header-desktop'});
            }
        }

        onScroll() {
            const headers = [];
            if (window.desktopHeaderMode === 'auto') headers.push(document.getElementById('header-desktop'));
            if (window.mobileHeaderMode === 'auto') headers.push(document.getElementById('header-mobile'));
            this.util.forEach(headers, (header) => {
                header.classList.add('animated');
                header.classList.add('faster');
            });
            const comments = document.getElementsByClassName('comment');
            if (comments.length) {
                const button = document.getElementById('comment-button');
                button.href = `#${comments[0].id}`;
                button.style.display = 'block';
            }
            const fixedButtons = document.getElementById('fixed-buttons');
            const MIN_SCROLL = 10;
            window.addEventListener('scroll', () => {
                this.newScrollTop = this.util.getScrollTop();
                const scroll = this.newScrollTop - this.oldScrollTop;
                this.util.forEach(headers, (header) => {
                    if (scroll > MIN_SCROLL) {
                        header.classList.remove('fadeInDown');
                        header.classList.add('fadeOutUp');
                    } else if (scroll < - MIN_SCROLL) {
                        header.classList.remove('fadeOutUp');
                        header.classList.add('fadeInDown');
                    }
                });
                if (this.newScrollTop > 20) {
                    if (scroll > MIN_SCROLL) {
                        fixedButtons.classList.remove('fadeIn');
                        fixedButtons.classList.add('fadeOut');
                    } else if (scroll < - MIN_SCROLL) {
                        fixedButtons.style.display = 'block';
                        fixedButtons.classList.remove('fadeOut');
                        fixedButtons.classList.add('fadeIn');
                    }
                } else {
                    fixedButtons.style.display = 'none';
                }
                if (!this._scrollTimeout) {
                    this._scrollTimeout = window.setTimeout(() => {
                        this._scrollTimeout = null;
                        for (let event of this.scrollEventSet) event();
                    }, 10);
                }
                this.oldScrollTop = this.newScrollTop;
            }, false);
        }

        onResize() {
            window.addEventListener('resize', () => {
                if (!this._resizeTimeout) {
                    this._resizeTimeout = window.setTimeout(() => {
                        this._resizeTimeout = null;
                        for (let event of this.resizeEventSet) event();
                        this.initMenuMobile();
                        this.initToc();
                        this.initSmoothScroll();
                        this.initMermaid()
                    }, 100);
                }
            }, false);
        }

        init() {
            this.initMenuMobile();
            this.initSwitchTheme();
            this.initHighlight();
            this.initTable();
            this.initHeaderLink();
            this.initMermaid();
            this.initEcharts();
            this.initMapbox();
            this.initTypeit();
            this.initToc();
            this.initSmoothScroll();

            this.onScroll();
            this.onResize();
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
})();
