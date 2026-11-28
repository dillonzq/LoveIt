import { forEach, getScrollTop, isMobile } from './util.js';

// State and behavior every page has: the header, the mobile menu, the theme switch,
// scrolling and resizing. Feature modules get this object and subscribe to its events.
export default class Theme {
    constructor() {
        this.config = window.config || {};
        this.data = this.config.data || {};
        this.isDark = document.body.getAttribute('theme') === 'dark';
        this.newScrollTop = getScrollTop();
        this.oldScrollTop = this.newScrollTop;
        this.scrollEventSet = new Set();
        this.resizeEventSet = new Set();
        this.switchThemeEventSet = new Set();
        this.clickMaskEventSet = new Set();
    }

    initRaw() {
        forEach(document.querySelectorAll('[data-raw]'), $raw => {
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
        this.clickMaskEventSet.add(() => this.setMenuMobileOpen(false));
    }

    updateThemeSwitchLabels() {
        const cfgTheme = document.body.getAttribute('cfg-theme');
        forEach(document.getElementsByClassName('theme-switch'), $themeSwitch => {
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
        forEach(document.getElementsByClassName('theme-switch'), $themeSwitch => {
            $themeSwitch.addEventListener('click', () => {
                const cfgTheme = document.body.getAttribute('cfg-theme');

                const themes = ['auto', 'light', 'dark'];
                const newTheme = themes[(themes.indexOf(cfgTheme) + 1) % themes.length];

                this.isDark = newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.body.setAttribute('theme', this.isDark ? 'dark' : 'light');
                document.body.setAttribute('cfg-theme', newTheme);
                window.localStorage?.setItem('theme', newTheme);
                this.updateThemeSwitchLabels();
                this.dispatch(this.switchThemeEventSet);
            }, false);
        });
    }

    initDetails() {
        forEach(document.getElementsByClassName('details'), $details => {
            const $summary = $details.getElementsByClassName('details-summary')[0];
            $summary.addEventListener('click', () => {
                $details.classList.toggle('open');
            }, false);
        });
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
                this.newScrollTop = getScrollTop();
                const scroll = this.newScrollTop - this.oldScrollTop;
                const mobile = isMobile();
                // The open search bar sits over the header.
                if (!document.getElementById('search-dialog')?.open) forEach($headers, $header => {
                    if (scroll > ACCURACY) $header.classList.add('is-hidden');
                    else if (scroll < - ACCURACY) $header.classList.remove('is-hidden');
                });
                if (this.newScrollTop > MINIMUM) {
                    if (mobile && scroll > ACCURACY) $fixedButtons.classList.remove('is-visible');
                    else if (!mobile || scroll < - ACCURACY) $fixedButtons.classList.add('is-visible');
                } else {
                    $fixedButtons.classList.remove('is-visible');
                }
                this.dispatch(this.scrollEventSet);
                this.oldScrollTop = this.newScrollTop;
            });
        }, { passive: true });
    }

    onResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) return;
            resizeTimeout = window.setTimeout(() => {
                resizeTimeout = null;
                this.dispatch(this.resizeEventSet);
            }, 100);
        }, false);
    }

    onClickMask() {
        document.getElementById('mask').addEventListener('click', () => {
            this.dispatch(this.clickMaskEventSet);
            document.body.classList.remove('blur');
        }, false);
    }

    // Calls each handler of an event; one that throws does not stop the others.
    dispatch(handlers) {
        for (const handler of handlers) {
            try {
                handler();
            } catch (err) {
                console.error(err);
            }
        }
    }

    // Runs each step on its own, so that one that throws does not stop the others.
    run(steps) {
        for (const step of steps) {
            try {
                step.call(this);
            } catch (err) {
                console.error(err);
            }
        }
    }

    // Loads the modules of the features the page uses at once and starts them in the
    // given order, as each is ready. A module that fails to load or start is reported
    // and skipped.
    async start(features) {
        const used = features.filter(feature => {
            try {
                return Boolean(feature.when(this));
            } catch (err) {
                console.error(err);
                return false;
            }
        });
        // Settled at once, so that a module failing while an earlier one loads is not an unhandled rejection.
        const modules = used.map(feature => feature.load().then(module => ({ module }), error => ({ error })));
        for (let i = 0; i < used.length; i++) {
            const { module, error } = await modules[i];
            try {
                if (error) throw error;
                module.default(this);
            } catch (err) {
                console.error(`LoveIt: the ${used[i].name} feature failed to start.`, err);
            }
        }
    }

    init(features) {
        this.run([
            this.initRaw,
            this.initTwemoji,
            this.initMenuMobile,
            this.onClickMask,
            this.initSwitchTheme,
            this.onResize,
            this.onScroll,
            this.initDetails,
        ]);
        return this.start(features);
    }
}
