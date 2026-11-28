// The giscus widget is an iframe; switching the theme sends it the matching theme.
export default function initGiscus(theme) {
    const giscusConfig = theme.config.comment.giscus;
    const giscusScript = document.createElement('script');
    giscusScript.src = 'https://giscus.app/client.js';
    giscusScript.setAttribute('data-repo', giscusConfig.repo);
    giscusScript.setAttribute('data-repo-id', giscusConfig.repoId);
    giscusScript.setAttribute('data-category', giscusConfig.category);
    giscusScript.setAttribute('data-category-id', giscusConfig.categoryId);
    giscusScript.setAttribute('data-lang', giscusConfig.lang);
    giscusScript.setAttribute('data-mapping', giscusConfig.mapping);
    giscusScript.setAttribute('data-reactions-enabled', giscusConfig.reactionsEnabled);
    giscusScript.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
    giscusScript.setAttribute('data-input-position', giscusConfig.inputPosition);
    if (giscusConfig.lazyLoading) giscusScript.setAttribute('data-loading', 'lazy');
    giscusScript.setAttribute('data-theme', theme.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme);
    giscusScript.crossOrigin = 'anonymous';
    giscusScript.async = true;
    document.getElementById('giscus').appendChild(giscusScript);
    theme.switchThemeEventSet.add(() => {
        const message = {
            setConfig: {
                theme: theme.isDark ? giscusConfig.darkTheme : giscusConfig.lightTheme,
                reactionsEnabled: false,
            }
        };
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    });
}
