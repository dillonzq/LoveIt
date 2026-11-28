export default function initValine(theme) {
    const valineConfig = theme.config.comment.valine;
    // Valine renders comment avatars without alt text. Each avatar sits
    // next to the commenter's name, so mark it decorative, including the
    // avatars that pagination, replies and new comments add later.
    const valine = document.querySelector(valineConfig.el);
    if (valine) {
        const markAvatars = () => {
            valine.querySelectorAll('img.vimg:not([alt])').forEach(img => img.setAttribute('alt', ''));
        };
        new MutationObserver(markAvatars).observe(valine, { childList: true, subtree: true });
    }
    new Valine(valineConfig);
}
