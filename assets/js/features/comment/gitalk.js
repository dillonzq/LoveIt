export default function initGitalk(theme) {
    const gitalkConfig = theme.config.comment.gitalk;
    gitalkConfig.body = decodeURI(window.location.href);
    new Gitalk(gitalkConfig).render('gitalk');
}
