// KaTeX auto-render over the page, with the delimiters built in layouts/_partials/assets.html.
export default function initMath(theme) {
    renderMathInElement(document.body, theme.config.math);
}
