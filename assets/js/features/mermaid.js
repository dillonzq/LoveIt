import { forEach } from '../util.js';

// The diagram source comes from the page data, or from the element text.
function getDefinition(theme, element) {
    if (!element) return null;

    const id = element.id;
    if (id && theme.data && typeof theme.data[id] === 'string') {
        const fromConfig = theme.data[id].trim();
        if (fromConfig.length > 0) return fromConfig;
    }

    const fromText = element.textContent;
    if (fromText && fromText.trim().length > 0) {
        return fromText.trim();
    }

    return null;
}

// Typesets $$...$$ in Pele labels with KaTeX when the page loads it; Pele shows the TeX source otherwise.
function getPeleMath() {
    if (typeof katex === 'undefined') return undefined;
    let probe;
    return (tex, size) => {
        if (!probe) {
            // A clipped, fixed box at the viewport origin never widens the page, also in RTL.
            const box = document.createElement('div');
            box.setAttribute('aria-hidden', 'true');
            box.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
            probe = document.createElement('div');
            probe.style.cssText = 'display:inline-block;white-space:nowrap';
            box.appendChild(probe);
            document.body.appendChild(box);
        }
        let expression;
        try {
            // MathML only: Safari misplaces KaTeX's HTML output inside SVG.
            probe.innerHTML = katex.renderToString(tex, { displayMode: true, output: 'mathml' });
            expression = probe.querySelector('math');
        } catch (err) {
            return null;
        }
        if (!expression) return null;
        // Measure the bare <math> that Pele inserts, at the label's font size, without KaTeX's wrapper styles.
        probe.replaceChildren(expression);
        probe.style.fontSize = `${size}px`;
        const { width, height } = expression.getBoundingClientRect();
        return { html: expression.outerHTML, width, height };
    };
}

// Pele lays diagrams out for their container and redraws them on resize; colors come from CSS variables,
// so switching the theme needs no re-render.
function initPele(theme) {
    const options = {
        math: getPeleMath(),
        zoom: { labels: theme.config.mermaid.zoomLabels },
        onError: err => console.error(err),
    };
    forEach(document.getElementsByClassName('mermaid'), $mermaid => {
        if ($mermaid.dataset.peleMounted) return;
        const definition = getDefinition(theme, $mermaid);
        if (!definition) return;
        $mermaid.dataset.peleMounted = 'true';
        pele.mount($mermaid, definition, options);
    });
}

// Mermaid renders the diagrams again in the other theme when it switches.
function initMermaid(theme) {
    const render = () => {
        const $mermaidElements = document.getElementsByClassName('mermaid');
        if (!$mermaidElements.length) return;

        // "loose" only when the site sets it explicitly; anything else renders with "strict".
        const securityLevel = theme.config.mermaid && theme.config.mermaid.securityLevel === 'loose' ? 'loose' : 'strict';
        mermaid.initialize({ startOnLoad: false, theme: theme.isDark ? 'dark' : 'neutral', securityLevel });
        // Identical diagrams in separately rendered blocks share an element id; the index keeps render ids unique.
        Array.from($mermaidElements).forEach(($mermaid, index) => {
            const definition = getDefinition(theme, $mermaid);
            if (!definition) return;

            mermaid
                .render(`mermaid-svg-${$mermaid.id}-${index}`, definition)
                .then(({ svg, bindFunctions }) => {
                    $mermaid.innerHTML = svg;
                    // Attaches `click` callbacks, which Mermaid allows with securityLevel "loose".
                    if (bindFunctions) bindFunctions($mermaid);
                })
                .catch(err => {
                    console.error(err);
                });
        });
    };
    theme.switchThemeEventSet.add(render);
    render();
}

// Diagrams of the mermaid shortcode and code blocks, drawn by Pele (default) or Mermaid.
export default function initDiagrams(theme) {
    if (theme.config.mermaid?.renderer === 'pele') initPele(theme);
    else initMermaid(theme);
}
