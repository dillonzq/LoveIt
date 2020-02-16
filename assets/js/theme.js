(() => {
    'use strict';

    const forEachElement = (elements, handler) => {
        elements = elements || [];
        for (let i = 0; i < elements.length; i++) {
            handler(elements[i]);
        }
    };

    class Theme {
        initMobileMenu() {
            document.getElementById('menu-toggle').onclick = () => {
                document.getElementById('menu-toggle').classList.toggle('active');
                document.getElementById('menu-mobile').classList.toggle('active');
            };
        }

        initSwitchTheme() {
            forEachElement(document.getElementsByClassName('theme-switch'), (button) => {
                button.onclick = () => {
                    document.body.classList.toggle('dark-theme');
                    window.isDark = !window.isDark;
                    window.localStorage && window.localStorage.setItem('theme', window.isDark ? 'dark' : 'light');
                    this.initEcharts();
                };
            });
        }

        initDynamicToTop() {
            const min = 300;
            const toTopButton = document.getElementById('dynamic-to-top');
            document.addEventListener('scroll', () => {
                const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                if (typeof document.body.style.maxHeight === 'undefined') {
                    toTopButton.style.position = 'absolute';
                    toTopButton.style.top = scrollTop + window.document.documentElement.clientHeight - 20;
                }
                if (scrollTop > min) {
                    (function fadeIn(el, display){
                        display = display || 'block';
                        if (el.style.display !== display) {
                            el.style.opacity = 0;
                            el.style.display = display;
                            (function fade() {
                                let val = parseFloat(el.style.opacity);
                                if ((val += .1) <= 1) {
                                    el.style.opacity = val;
                                    requestAnimationFrame(fade);
                                }
                            })();
                        }
                    })(document.getElementById('dynamic-to-top'));
                } else {
                    (function fadeOut(el){
                        if (el.style.display !== 'none') {
                            el.style.opacity = 1;
                            (function fade() {
                                if ((el.style.opacity -= .1) < 0) {
                                    el.style.display = 'none';
                                } else {
                                    requestAnimationFrame(fade);
                                }
                            })();
                        }
                    })(document.getElementById('dynamic-to-top'));
                }
            }, false);
        }

        initHighlight() {
            forEachElement(document.querySelectorAll('.highlight > .chroma'), (block) => {
                const codes = block.querySelectorAll('pre.chroma > code');
                const code = codes[codes.length - 1];
                const lang = code ? code.className.toLowerCase() : '';
                block.className += ' ' + lang;
            });
            forEachElement(document.querySelectorAll('.highlight > pre.chroma'), (block) => {
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
            forEachElement(document.querySelectorAll('.content table'), (table) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                table.parentElement.replaceChild(wrapper, table);
                wrapper.appendChild(table);
            });
        }

        initHeaderLink() {
            for (let num = 1; num <= 6; num++) {
                forEachElement(document.querySelectorAll('.content > h' + num), (header) => {
                    header.classList.add('headerLink');
                    header.innerHTML = `<a href="#${header.id}"></a>${header.innerHTML}`;
                });
            }
        }

        _refactorToc(toc) {
            forEachElement(toc.querySelectorAll('a:first-child'), (link) => {
                link.classList.add('toc-link');
            });

            // when headings do not start with `h1`
            const oldTocList = toc.children[0];
            let newTocList = oldTocList;
            let temp;
            while (newTocList.children.length === 1
                && (temp = newTocList.children[0].children[0]).tagName === 'UL') {
                newTocList = temp;
            }
            if (newTocList !== oldTocList) toc.replaceChild(newTocList, oldTocList);
        }

        _initTocState(tocContainer) {
            if (window.getComputedStyle(tocContainer, null).display !== 'none') {
                const TOP_SPACING = 80;
                const minTop = tocContainer.offsetTop;
                const minScrollTop = minTop - TOP_SPACING;
                const footerTop = document.getElementById('post-footer').offsetTop;
                const toclinks = tocContainer.getElementsByClassName('toc-link');
                const headerLinks = document.getElementsByClassName('headerLink') || [];
                const tocLinkLis = tocContainer.querySelectorAll('.post-toc-content li');
                const INDEX_SPACING = document.getElementById('header-desktop').getBoundingClientRect().height + 5;

                const changeTocState = () => {
                    const scrollTop = document.documentElement.scrollTop;
                    const maxTop = footerTop - tocContainer.getBoundingClientRect().height;
                    const maxScrollTop = maxTop - TOP_SPACING;
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

                    forEachElement(toclinks, (link) => { link.classList.remove('active'); });
                    forEachElement(tocLinkLis, (link) => { link.classList.remove('has-active'); });
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
                    document.addEventListener('scroll', changeTocState, false);
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
                    window.addEventListener("resize", () => {
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

        initSmoothScroll() {
            new SmoothScroll('[href^="#"]', {speed: 300, speedAsDuration: true, header: '#header-desktop'});
        }

        init() {
            this.initMobileMenu();
            this.initSwitchTheme();
            this.initDynamicToTop();
            this.initHighlight();
            this.initTable();
            this.initHeaderLink();
            this.initMermaid();
            this.initEcharts();
            this.initTypeit();
            this.initToc();
            this.initSmoothScroll();
        }
    }

    const themeInit = () => {
        const theme = new Theme();
        theme.init();
    };

    if (document.readyState !== 'loading') {
        themeInit();
    } else {
        document.addEventListener('DOMContentLoaded', themeInit);
    }
})();
