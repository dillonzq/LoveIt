import { copyText, forEach } from '../util.js';

// Toggle buttons of a code block header and the class of the block each one switches.
const toggles = [['.line-numbers-toggle', 'code-line-numbers'], ['.wrap-toggle', 'code-wrap']];

// Code blocks (layouts/_partials/plugin/code-block.html): the title and the ellipsis
// fold the block, the toggle buttons switch line numbers and line wrapping, and the
// copy button copies the code and reports the result.
export default function initCode() {
    forEach(document.querySelectorAll('.code-block'), $codeBlock => {
        toggles.forEach(([selector, className]) => {
            const $toggle = $codeBlock.querySelector(`.code-header > ${selector}`);
            if ($toggle) $toggle.addEventListener('click', () => {
                $toggle.setAttribute('aria-pressed', $codeBlock.classList.toggle(className));
            }, false);
        });
        const $codeTitle = $codeBlock.querySelector('.code-header > .code-title');
        const toggle = () => {
            const open = $codeBlock.classList.toggle('open');
            if ($codeTitle) $codeTitle.setAttribute('aria-expanded', open);
        };
        if ($codeTitle) $codeTitle.addEventListener('click', toggle, false);
        const $ellipses = $codeBlock.querySelector('.code-header .ellipses');
        if ($ellipses) $ellipses.addEventListener('click', toggle, false);
        const $copy = $codeBlock.querySelector('.code-header .copy');
        if ($copy) {
            const $code = $codeBlock.querySelector('code');
            const $status = $codeBlock.querySelector('.code-header .copy-status');
            let resetTimeout;
            $copy.addEventListener('click', () => {
                // innerText adds a line break after every block-level line span on top of
                // the newline already in the code, so copied code had blank lines between lines.
                copyText($code.textContent).then(copied => {
                    window.clearTimeout(resetTimeout);
                    $codeBlock.classList.remove('copied', 'copy-failed');
                    // Restart the flash when the code is copied again before it ends.
                    void $codeBlock.offsetWidth;
                    $codeBlock.classList.add(copied ? 'copied' : 'copy-failed');
                    // Leave the code selected so it can be copied by hand.
                    if (!copied) window.getSelection().selectAllChildren($code);
                    if ($status) {
                        const result = $copy.getAttribute(copied ? 'data-copied' : 'data-copy-failed');
                        $status.textContent = `${$copy.getAttribute('aria-label')}: ${result}`;
                    }
                    resetTimeout = window.setTimeout(() => {
                        $codeBlock.classList.remove('copied', 'copy-failed');
                        if ($status) $status.textContent = '';
                    }, 2000);
                });
            }, false);
        }
    });
}
