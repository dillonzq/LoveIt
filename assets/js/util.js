// Helpers shared by the core and the feature modules.

export function forEach(elements, handler) {
    elements = elements || [];
    for (let i = 0; i < elements.length; i++) handler(elements[i]);
}

export function getScrollTop() {
    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}

export function isMobile() {
    return window.matchMedia('only screen and (max-width: 680px)').matches;
}

export function isTocStatic() {
    return window.matchMedia('only screen and (max-width: 960px)').matches;
}

export function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Copies text with the Clipboard API. Where it is missing or refused (pages
// served over plain HTTP, denied permission), falls back to execCommand on a
// hidden textarea, as clipboard.js did. Resolves to whether the text was copied.
export function copyText(text) {
    const fallback = () => {
        const $active = document.activeElement;
        const $textarea = document.createElement('textarea');
        $textarea.value = text;
        $textarea.setAttribute('readonly', '');
        $textarea.style.position = 'fixed';
        $textarea.style.top = '0';
        $textarea.style.opacity = '0';
        document.body.appendChild($textarea);
        $textarea.select();
        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (_e) {
            copied = false;
        }
        $textarea.remove();
        if ($active && typeof $active.focus === 'function') $active.focus({ preventScroll: true });
        return copied;
    };
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true, fallback);
    }
    return Promise.resolve(fallback());
}
