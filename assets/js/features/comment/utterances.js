// The utterances widget is an iframe; switching the theme sends it the matching theme.
export default function initUtterances(theme) {
    const utterancesConfig = theme.config.comment.utterances;
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', utterancesConfig.repo);
    script.setAttribute('issue-term', utterancesConfig.issueTerm);
    if (utterancesConfig.label) script.setAttribute('label', utterancesConfig.label);
    script.setAttribute('theme', theme.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme);
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.getElementById('utterances').appendChild(script);
    theme.switchThemeEventSet.add(() => {
        const message = {
            type: 'set-theme',
            theme: theme.isDark ? utterancesConfig.darkTheme : utterancesConfig.lightTheme,
        };
        const iframe = document.querySelector('.utterances-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage(message, 'https://utteranc.es');
    });
}
