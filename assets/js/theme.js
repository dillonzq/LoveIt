// Entry of the theme script, built by js.Build (layouts/_partials/assets.html) and loaded
// as a module. The core runs on every page; each feature below has its own module under
// features/, loaded only when the page uses the feature. The features start in this
// order, which keeps the order the theme has always used: math is typeset before the
// diagrams are drawn, and the TOC is placed after the content above it is laid out.
import Theme from './core.js';

const comment = name => theme => theme.config.comment?.[name];

const features = [
    { name: 'search', when: theme => theme.config.search && document.getElementById('search-dialog'), load: () => import('./features/search.js') },
    { name: 'gallery', when: theme => theme.config.lightgallery, load: () => import('./features/gallery.js') },
    { name: 'code', when: () => document.querySelector('.code-block'), load: () => import('./features/code.js') },
    { name: 'math', when: theme => theme.config.math, load: () => import('./features/math.js') },
    // A site's own layout can draw diagrams with the Mermaid library it loads itself.
    { name: 'mermaid', when: theme => theme.config.mermaid || (typeof mermaid !== 'undefined' && document.querySelector('.mermaid')), load: () => import('./features/mermaid.js') },
    { name: 'echarts', when: theme => theme.config.echarts, load: () => import('./features/echarts.js') },
    { name: 'typeit', when: theme => theme.config.typeit, load: () => import('./features/typeit.js') },
    { name: 'mapbox', when: theme => theme.config.mapbox, load: () => import('./features/mapbox.js') },
    { name: 'consent', when: theme => theme.config.cookieconsent, load: () => import('./features/consent.js') },
    { name: 'toc', when: () => document.getElementById('TableOfContents'), load: () => import('./features/toc.js') },
    { name: 'gitalk', when: comment('gitalk'), load: () => import('./features/comment/gitalk.js') },
    { name: 'valine', when: comment('valine'), load: () => import('./features/comment/valine.js') },
    { name: 'utterances', when: comment('utterances'), load: () => import('./features/comment/utterances.js') },
    { name: 'giscus', when: comment('giscus'), load: () => import('./features/comment/giscus.js') },
    { name: 'waline', when: comment('waline'), load: () => import('./features/comment/waline.js') },
    { name: 'mastodon', when: comment('mastodon'), load: () => import('./features/comment/mastodon.js') },
];

let started = false;
const themeInit = () => {
    if (started) return;
    started = true;
    new Theme().init(features);
};

// The theme starts on DOMContentLoaded, like the classic script it used to be: after the
// deferred scripts and after the handlers of this event that scripts before the theme
// script added, but before those that later scripts (the script shortcode) added. A module
// script runs after all of them are added, so the config script registers the theme's
// handler in its place (layouts/_partials/assets.html). While the document is loading, it
// sets `loveitStart` to null, calls the function this script stores there on
// DOMContentLoaded and sets it to true then; it sets it to true at once when it runs later.
if (window.loveitStart === null) {
    window.loveitStart = themeInit;
} else if (window.loveitStart === true || document.readyState !== 'loading') {
    themeInit();
} else {
    // Without the config script's handler, e.g. a site's own copy of an older assets.html.
    document.addEventListener('DOMContentLoaded', themeInit, false);
}
