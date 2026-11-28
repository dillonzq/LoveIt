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
    { name: 'mermaid', when: theme => theme.config.mermaid, load: () => import('./features/mermaid.js') },
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
];

let started = false;
const themeInit = () => {
    if (started) return;
    started = true;
    new Theme().init(features);
};

// The theme starts on DOMContentLoaded, after the deferred scripts and the handlers of this
// event that the site's scripts added before it. A module script runs before the event,
// unless it is loaded late: then the document has been parsed and the load event starts it.
if (document.readyState === 'complete') {
    themeInit();
} else {
    document.addEventListener('DOMContentLoaded', themeInit, false);
    window.addEventListener('load', themeInit, false);
}
