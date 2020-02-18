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
    }

    class Theme {
        constructor() {
            this.util = new Util();
            this.scrollTop = 0;
            this.scrollEvents = [];
        }

        initMobileMenu() {
            document.getElementById('menu-toggle').onclick = () => {
                document.getElementById('menu-toggle').classList.toggle('active');
                document.getElementById('menu-mobile').classList.toggle('active');
            };
        }

        initSwitchTheme() {
            this.util.forEach(document.getElementsByClassName('theme-switch'), (button) => {
                button.onclick = () => {
                    document.body.classList.toggle('dark-theme');
                    window.isDark = !window.isDark;
                    window.localStorage && window.localStorage.setItem('theme', window.isDark ? 'dark' : 'light');
                    this.initEcharts();
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
                this.util.forEach(document.querySelectorAll('.content > h' + num), (header) => {
                    header.classList.add('headerLink');
                    header.innerHTML = `<a href="#${header.id}"></a>${header.innerHTML}`;
                });
            }
        }

        _refactorToc(toc) {
            this.util.forEach(toc.querySelectorAll('a:first-child'), (link) => {
                link.classList.add('toc-link');
            });
        }

        _initTocState(tocContainer) {
            if (window.getComputedStyle(tocContainer, null).display !== 'none') {
                const fixed = window.desktopHeaderMode !== 'normal';
                const fixedHeight = document.getElementById('header-desktop').getBoundingClientRect().height;
                const TOP_SPACING = 20 + (fixed ? fixedHeight : 0);
                const minTop = tocContainer.offsetTop;
                const minScrollTop = minTop - TOP_SPACING + (fixed ? 0 : fixedHeight);
                const footerTop = document.getElementById('post-footer').offsetTop;
                const toclinks = tocContainer.getElementsByClassName('toc-link');
                const headerLinks = document.getElementsByClassName('headerLink') || [];
                const tocLinkLis = tocContainer.querySelectorAll('.post-toc-content li');
                const INDEX_SPACING = 5 + (fixed ? fixedHeight : 0);

                const changeTocState = () => {
                    const scrollTop = this.util.getScrollTop();
                    const maxTop = footerTop - tocContainer.getBoundingClientRect().height;
                    const maxScrollTop = maxTop - TOP_SPACING + (fixed ? 0 : fixedHeight);
                    if (scrollTop < minScrollTop) {
                        tocContainer.style.position = 'absolute';
                        tocContainer.style.top = `${minTop}px`;
                    } else if (scrollTop > maxScrollTop) {
                        tocContainer.style.position = 'absolute';
                        tocContainer.style.top = `${maxTop}px`;
                    } else {
                        tocContainer.style.position = 'fixed';
                        tocContainer.style.top = `${TOP_SPACING}px`;
                    }

                    this.util.forEach(toclinks, (link) => { link.classList.remove('active'); });
                    this.util.forEach(tocLinkLis, (link) => { link.classList.remove('has-active'); });
                    let activeTocIndex = headerLinks.length - 1;
                    for (let i = 0; i < headerLinks.length - 1; i++) {
                        const thisTop = headerLinks[i].getBoundingClientRect().top;
                        const nextTop = headerLinks[i + 1].getBoundingClientRect().top;
                        if ((i == 0 && thisTop > INDEX_SPACING)
                         || (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)) {
                            activeTocIndex = i;
                            break;
                        }
                    }
                    if (activeTocIndex !== -1) {
                        toclinks[activeTocIndex].classList.add('active');
                        let parent = toclinks[activeTocIndex].parentElement;
                        while (parent.tagName !== 'NAV') {
                            parent.classList.add('has-active');
                            parent = parent.parentElement.parentElement;
                        }
                    }
                };
                changeTocState();

                if (!this._initTocOnce) {
                    this.scrollEvents.push(changeTocState);
                    this._initTocOnce = true;
                }
            }
        }

        initToc() {
            const tocContainer = document.getElementById('post-toc');
            if (tocContainer !== null) {
                const toc = document.getElementById('TableOfContents');
                if (toc === null) {
                    tocContainer.parentElement.removeChild(tocContainer);
                } else {
                    this._refactorToc(toc);
                    this._initTocState(tocContainer);
                    window.addEventListener('resize', () => {
                        window.setTimeout(() => {
                            this._initTocState(tocContainer);
                        }, 0);
                    }, false);
                }
            }
        }

        initMermaid() {
            if (window.mermaidMap) {
                mermaid.initialize({startOnLoad: false, theme: null});
                Object.keys(mermaidMap).forEach((id) => {
                    const element = document.getElementById(id);
                    mermaid.mermaidAPI.render("d" + id, mermaidMap[id], (svgCode) => {
                        element.innerHTML = svgCode;
                        const svg = element.firstChild;
                        svg.style.width = "100%"
                    }, element);
                });
            }
        }

        initEcharts() {
            if (window.echartsMap) {
                for (let i = 0; i < echartsArr.length; i++) {
                    echartsArr[i].dispose();
                }
                echartsArr = [];
                Object.keys(echartsMap).forEach((id) => {
                    let myChart = echarts.init(document.getElementById(id), window.isDark ? 'dark' : 'macarons', {renderer: 'svg'});
                    myChart.setOption(echartsMap[id]);
                    echartsArr.push(myChart);
                });
                window.addEventListener("resize", function () {
                    this.setTimeout(() => {
                        for (let i = 0; i < echartsArr.length; i++) {
                            echartsArr[i].resize();
                        }
                    }, 0);
                }, false);
            }
        }

        initTypeit() {
            if (window.typeitArr) {
                for (let i = 0; i < typeitArr.length; i++) {
                    const group = typeitArr[i];
                    (function typeone(i) {
                        const content = document.getElementById(`r${group[i]}`).innerHTML;
                        if (i === group.length - 1) {
                            new TypeIt(`#${group[i]}`, {
                                strings: content,
                            }).go();
                            return;
                        }
                        let instance = new TypeIt(`#${group[i]}`, {
                            strings: content,
                            afterComplete: () => {
                                instance.destroy();
                                typeone(i + 1);
                            },
                        }).go();
                    })(0);
                }
            }
        }

        initScroll() {
            for (let i = 0; i < this.scrollEvents.length; i++) {
                document.addEventListener('scroll', this.scrollEvents[i], false);
            }
            const initSmoothScroll = () => {
                const isMobile = window.matchMedia('only screen and (max-width: 560px)').matches;
                if ((!isMobile && window.desktopHeaderMode === 'normal')
                 || (isMobile && window.mobileHeaderMode === 'normal')) {
                    new SmoothScroll('[href^="#"]', {speed: 300, speedAsDuration: true});
                } else {
                    new SmoothScroll('[href^="#"]', {speed: 300, speedAsDuration: true, header: '#header-desktop'});
                }
            };
            initSmoothScroll();
            window.addEventListener('resize', () => {
                window.setTimeout(() => {
                    initSmoothScroll();
                }, 0);
            }, false);
            const headers = [];
            if (window.desktopHeaderMode === 'auto') headers.push(document.getElementById('header-desktop'));
            if (window.mobileHeaderMode === 'auto') headers.push(document.getElementById('header-mobile'));
            this.util.forEach(headers, (header) => {
                header.classList.add('animated');
                header.classList.add('faster');
            });
            const toTopButton = document.getElementById('dynamic-to-top');
            document.addEventListener('scroll', () => {
                const scrollTop = this.util.getScrollTop();
                this.util.forEach(headers, (header) => {
                    if (this.scrollTop < scrollTop) {
                        if (!header.classList.contains('fadeOutUp')) {
                            header.classList.remove('fadeInDown');
                            header.classList.add('fadeOutUp');
                        }
                    } else {
                        if (!header.classList.contains('fadeInDown')) {
                            header.classList.remove('fadeOutUp');
                            header.classList.add('fadeInDown');
                        }
                    }
                    if (scrollTop > 600) {
                        if (this.scrollTop < scrollTop) {
                            if (!toTopButton.classList.contains('fadeOut')) {
                                toTopButton.classList.remove('fadeIn');
                                toTopButton.classList.add('fadeOut');
                            }
                        } else {
                            toTopButton.style.display = 'block';
                            if (!toTopButton.classList.contains('fadeIn')) {
                                toTopButton.classList.remove('fadeOut');
                                toTopButton.classList.add('fadeIn');
                            }
                        }
                    } else {
                        toTopButton.style.display = 'none';
                    }
                });
                this.scrollTop = scrollTop;
            }, false);
        }

        init() {
            this.initMobileMenu();
            this.initSwitchTheme();
            this.initHighlight();
            this.initTable();
            this.initHeaderLink();
            this.initMermaid();
            this.initEcharts();
            this.initTypeit();
            this.initToc();
            this.initScroll();
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
