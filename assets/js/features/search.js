import { SearchClient, escapeHTML, highlight } from '../search.mjs';
import { forEach, isMobile } from '../util.js';

// The search dialog shared by the desktop and mobile headers (layouts/_partials/search.html):
// the bar grows from the header control it covers, results drop below the header.
export default function initSearch(theme) {
    const searchConfig = theme.config.search;
    const $dialog = document.getElementById('search-dialog');
    if (!searchConfig || !$dialog) return;

    const highlightTag = searchConfig.highlightTag || 'em';
    const $input = document.getElementById('search-input');
    const $results = document.getElementById('search-results');
    const $dropdown = document.getElementById('search-dropdown');
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
    // Set while the desktop bar shrinks back before the dialog closes.
    let closing;
    let closeTimer;
    let navigating = false;
    let followStart = 0;
    let followFrame;
    let client;

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
        forEach($toggles, $toggle => $toggle.setAttribute('aria-keyshortcuts', `${slashEnabled ? '/ ' : ''}Control+K Meta+K`));
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
        $dropdown.hidden = !query;
        $results.hidden = !expanded;
        $input.setAttribute('aria-expanded', String(expanded));
        $empty.hidden = !query || expanded;
        $empty.innerHTML = $empty.hidden ? ''
            : `${escapeHTML(searchConfig.noResultsFound)}: <span class="search-query">"${escapeHTML(query)}"</span>`;
        $status.textContent = !query ? '' : expanded ? `${resultsLabel}: ${results.length}` : searchConfig.noResultsFound;
    };
    const go = ($option, newTab) => {
        const uri = $option?.dataset.uri;
        if (stale || !$dialog.open || closing || !uri) return;
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
            navigating = true;
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
                client ??= new SearchClient(searchConfig);
                results = await client.search(query);
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
    // The mobile keyboard and pinch zoom can resize and move the visual viewport alone.
    const fitViewport = () => {
        $dialog.style.setProperty('--search-viewport-width', `${viewport.width}px`);
        $dialog.style.setProperty('--search-viewport-height', `${viewport.height}px`);
        $dialog.style.setProperty('--search-viewport-left', `${viewport.offsetLeft}px`);
        $dialog.style.setProperty('--search-viewport-top', `${viewport.offsetTop}px`);
        // Resizing can switch between the desktop and the mobile header.
        if ($dialog.open && !closing) setHeaderOpen(true);
        follow();
    };
    // The search bar covers the control it grows from: the desktop header slot
    // or the search row of the mobile menu. Both move while the header animates.
    const $headerDesktop = document.getElementById('header-desktop');
    const $headerMobile = document.getElementById('header-mobile');
    const $anchorDesktop = document.getElementById('search-toggle-desktop');
    const $anchorMobile = document.getElementById('search-toggle-mobile')?.parentElement;
    const place = () => {
        const mobile = isMobile();
        const box = $dialog.getBoundingClientRect();
        const anchor = (mobile ? $anchorMobile : $anchorDesktop)?.getBoundingClientRect();
        // A control partly out of view (a static header scrolled away, a zoomed-in page)
        // gets the fixed fallback place, with the results right below the header height.
        const anchored = anchor && anchor.width > 0 && anchor.top >= box.top && anchor.bottom <= box.bottom
            && anchor.left >= box.left && anchor.right <= box.right;
        $dialog.toggleAttribute('data-anchored', Boolean(anchored));
        if (anchored) {
            const header = (mobile ? $headerMobile : $headerDesktop).getBoundingClientRect();
            $dialog.style.setProperty('--search-bar-left', `${anchor.left - box.left}px`);
            $dialog.style.setProperty('--search-bar-top', `${anchor.top - box.top}px`);
            $dialog.style.setProperty('--search-bar-width', `${anchor.width}px`);
            $dialog.style.setProperty('--search-bar-height', `${anchor.height}px`);
            $dialog.style.setProperty('--search-dropdown-top', `${Math.max(header.bottom, anchor.bottom) - box.top}px`);
        } else {
            $dialog.style.removeProperty('--search-dropdown-top');
        }
    };
    // CSS transitions of the headers, which move the controls the bar covers.
    const transitions = $element => $element?.getAnimations?.({ subtree: true }).filter(animation => 'transitionProperty' in animation) ?? [];
    const transitioning = () => [$headerDesktop, $headerMobile].some($header => transitions($header).some(animation => animation.playState !== 'finished'));
    // Follow the header's transitions frame by frame: for at least a few frames
    // after a change and while a transition is running, up to a few seconds.
    const follow = () => {
        followStart = performance.now();
        const frame = () => {
            place();
            const elapsed = performance.now() - followStart;
            followFrame = $dialog.open && (elapsed < 100 || elapsed < 5000 && transitioning()) ? requestAnimationFrame(frame) : undefined;
        };
        if (!followFrame) frame();
    };
    // The header grows the desktop slot or slides the mobile search row up (see _header.scss).
    const setHeaderOpen = isOpen => {
        const $header = isMobile() ? $headerMobile : $headerDesktop;
        $headerDesktop.classList.toggle('open', isOpen && $header === $headerDesktop);
        $headerMobile.classList.toggle('open', isOpen && $header === $headerMobile);
        if (isOpen) $header.classList.remove('is-hidden');
        document.body.classList.toggle('blur', isOpen);
        if (!isOpen) theme.setMenuMobileOpen(false);
    };
    const open = $opener => {
        closing = undefined;
        clearTimeout(closeTimer);
        $dialog.classList.remove('is-closing');
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
        setHeaderOpen(true);
        follow();
        $input.focus();
        $input.select();
    };
    // The desktop bar shrinks back into the header before the dialog closes.
    const dismiss = () => {
        if (!$dialog.open || closing) return;
        const animate = !isMobile() && $headerDesktop.classList.contains('open')
            && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
        // Like the old field, the query goes at once: a pending search or Enter is dropped.
        resetSearch();
        setHeaderOpen(false);
        if (!animate) {
            $dialog.close();
            return;
        }
        $dialog.classList.add('is-closing');
        const token = closing = {};
        const done = () => {
            if (closing === token) $dialog.close();
        };
        const shrinking = transitions($anchorDesktop);
        Promise.all(shrinking.map(animation => animation.finished)).then(done, done);
        closeTimer = setTimeout(done, shrinking.length ? 1000 : 300);
        follow();
    };

    forEach($toggles, $toggle => $toggle.addEventListener('click', () => open($toggle), false));
    document.getElementById('search-cancel').addEventListener('click', dismiss, false);
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
        if (pressedBackdrop && event.target === $dialog) dismiss();
    }, false);
    // Esc animates like the other ways out; a repeated Esc may close at once.
    $dialog.addEventListener('cancel', event => {
        if (!event.cancelable) return;
        event.preventDefault();
        dismiss();
    }, false);
    $dialog.addEventListener('close', () => {
        // An earlier close event can arrive after the dialog has reopened.
        if ($dialog.open) return;
        closing = undefined;
        clearTimeout(closeTimer);
        cancelAnimationFrame(followFrame);
        followFrame = undefined;
        $dialog.classList.remove('is-closing');
        setHeaderOpen(false);
        viewport?.removeEventListener('resize', fitViewport);
        viewport?.removeEventListener('scroll', fitViewport);
        resetSearch();
        // Focus returns to the opener, unless a result was opened. The mobile search row
        // closes with the menu and resizing can hide the opener: the first visible
        // search or menu button takes the focus instead.
        if (!navigating) {
            const $focus = [opener, ...$toggles, document.getElementById('menu-toggle-mobile')]
                .find($element => $element?.isConnected && $element !== document.body && $element.getClientRects().length);
            // The opener can be scrolled away with a static header; keep the reader's place.
            $focus?.focus({ preventScroll: true });
        }
        navigating = false;
        opener = undefined;
    }, false);
    // A static header scrolls with the page under the open search.
    window.addEventListener('scroll', () => {
        if ($dialog.open) follow();
    }, { passive: true });
    // Resizing can switch between the desktop and the mobile header, also where
    // visualViewport, which fitViewport listens to, is missing.
    window.addEventListener('resize', () => {
        if (!$dialog.open) return;
        if (!closing) setHeaderOpen(true);
        follow();
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
