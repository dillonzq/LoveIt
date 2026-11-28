// Comments from the Fediverse: the public replies to a post on a Mastodon server (or another
// server with the Mastodon API), read from /api/v1/statuses/:id and its /context when the
// comments come near the viewport. Reply HTML comes from other servers, so it is sanitized
// with DOMPurify and only the markup Mastodon itself writes in a post is kept.

// Replies deeper than this are listed at this depth, so that a long thread stays readable.
const MAX_DEPTH = 3;

const ALLOWED_TAGS = ['p', 'br', 'a', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li'];
const ALLOWED_ATTR = ['href', 'class', 'title'];
// Mastodon marks the hidden part of long URLs and mentions with these classes; other classes
// are dropped so that a reply cannot borrow the theme's own styles.
const ALLOWED_CLASSES = new Set(['invisible', 'ellipsis', 'mention', 'hashtag', 'h-card', 'u-url']);
const LINK_REL = 'nofollow ugc noopener noreferrer';

function element(tag, className, text) {
    const $element = document.createElement(tag);
    if (className) $element.className = className;
    if (text !== undefined) $element.textContent = text;
    return $element;
}

function link(href, className) {
    const $link = element('a', className);
    // Only web links: an account or attachment URL comes from another server.
    if (/^https?:\/\//i.test(href || '')) {
        $link.href = href;
        $link.rel = LINK_REL;
        $link.target = '_blank';
    }
    return $link;
}

// Replaces each :shortcode: of the server's custom emojis in the text of a node with its image.
function addEmojis($root, emojis) {
    const byCode = new Map();
    for (const emoji of emojis || []) {
        if (emoji && emoji.shortcode && /^https?:\/\//i.test(emoji.static_url || emoji.url || '')) {
            byCode.set(emoji.shortcode, emoji.static_url || emoji.url);
        }
    }
    if (!byCode.size) return;
    const walker = document.createTreeWalker($root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
        const parts = node.nodeValue.split(/:([A-Za-z0-9_]+):/);
        if (parts.length === 1 || !parts.some((part, index) => index % 2 && byCode.has(part))) continue;
        const fragment = document.createDocumentFragment();
        parts.forEach((part, index) => {
            if (index % 2 === 0) {
                if (part) fragment.appendChild(document.createTextNode(part));
            } else if (byCode.has(part)) {
                const $img = element('img', 'mastodon-emoji');
                $img.src = byCode.get(part);
                $img.alt = `:${part}:`;
                $img.title = `:${part}:`;
                $img.loading = 'lazy';
                $img.decoding = 'async';
                fragment.appendChild($img);
            } else {
                fragment.appendChild(document.createTextNode(`:${part}:`));
            }
        });
        node.parentNode.replaceChild(fragment, node);
    }
}

function sanitize(html) {
    const fragment = DOMPurify.sanitize(html || '', {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        RETURN_DOM_FRAGMENT: true,
    });
    fragment.querySelectorAll('[class]').forEach($element => {
        const classes = $element.className.split(/\s+/).filter(name => ALLOWED_CLASSES.has(name));
        if (classes.length) $element.className = classes.join(' ');
        else $element.removeAttribute('class');
    });
    fragment.querySelectorAll('a').forEach($link => {
        if ($link.hasAttribute('href')) {
            $link.rel = LINK_REL;
            $link.target = '_blank';
        }
    });
    return fragment;
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    try {
        return new Intl.DateTimeFormat(document.documentElement.lang || undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
    } catch (_e) {
        return date.toLocaleString();
    }
}

function renderAttachments(status, i18n) {
    const attachments = (status.media_attachments || []).filter(media => media && (media.url || media.remote_url));
    if (!attachments.length) return null;
    const $list = element('div', 'mastodon-attachments');
    for (const media of attachments) {
        const $link = link(media.remote_url || media.url, 'mastodon-attachment');
        if (media.preview_url && /^https?:\/\//i.test(media.preview_url)) {
            const $img = element('img');
            $img.src = media.preview_url;
            $img.alt = media.description || i18n.attachment;
            $img.loading = 'lazy';
            $img.decoding = 'async';
            $link.appendChild($img);
        } else {
            $link.textContent = media.description || i18n.attachment;
        }
        $list.appendChild($link);
    }
    return $list;
}

function renderReply(status, host, authorId, i18n) {
    const account = status.account || {};
    const $article = element('article', 'mastodon-reply');

    const $header = element('div', 'mastodon-reply-header');
    const $account = link(account.url, 'mastodon-account');
    if (/^https?:\/\//i.test(account.avatar_static || '')) {
        // The name next to the avatar says whose it is.
        const $avatar = element('img', 'mastodon-avatar');
        $avatar.src = account.avatar_static;
        $avatar.alt = '';
        $avatar.width = 40;
        $avatar.height = 40;
        $avatar.loading = 'lazy';
        $avatar.decoding = 'async';
        $account.appendChild($avatar);
    }
    const $name = element('span', 'mastodon-name');
    const $displayName = element('bdi', 'mastodon-display-name', account.display_name || account.username || '');
    addEmojis($displayName, account.emojis);
    const acct = account.acct || '';
    $name.append($displayName, element('span', 'mastodon-acct', acct.includes('@') ? `@${acct}` : `@${acct}@${host}`));
    $account.appendChild($name);
    $header.appendChild($account);
    if (authorId && account.id === authorId) $header.appendChild(element('span', 'mastodon-author', i18n.author));
    const $date = link(status.url || status.uri, 'mastodon-date');
    const $time = element('time', '', formatDate(status.created_at));
    $time.dateTime = status.created_at || '';
    $date.appendChild($time);
    $header.appendChild($date);
    $article.appendChild($header);

    const $body = element('div', 'mastodon-content');
    if (status.language) $body.lang = status.language;
    $body.appendChild(sanitize(status.content));
    addEmojis($body, status.emojis);
    const $attachments = renderAttachments(status, i18n);

    // A content warning hides the reply behind its text, as Mastodon does;
    // sensitive media without one is hidden on its own.
    if (status.spoiler_text) {
        const $details = element('details', 'mastodon-spoiler');
        const $summary = element('summary', '', status.spoiler_text);
        addEmojis($summary, status.emojis);
        $details.append($summary, $body);
        if ($attachments) $details.appendChild($attachments);
        $article.appendChild($details);
    } else {
        $article.appendChild($body);
        if ($attachments && status.sensitive) {
            const $details = element('details', 'mastodon-spoiler');
            $details.append(element('summary', '', i18n.sensitive), $attachments);
            $article.appendChild($details);
        } else if ($attachments) {
            $article.appendChild($attachments);
        }
    }
    return $article;
}

// Builds the reply tree from the descendants, which the API lists in thread order.
function renderReplies($list, rootId, descendants, host, authorId, i18n) {
    const ids = new Set(descendants.map(status => status.id));
    const children = new Map();
    for (const status of descendants) {
        // A reply to a post the API leaves out is shown as a reply to the root post.
        const parent = ids.has(status.in_reply_to_id) ? status.in_reply_to_id : rootId;
        if (!children.has(parent)) children.set(parent, []);
        children.get(parent).push(status);
    }
    const render = ($parentList, parentId, depth) => {
        for (const status of children.get(parentId) || []) {
            const $item = element('li', 'mastodon-reply-item');
            $item.appendChild(renderReply(status, host, authorId, i18n));
            $parentList.appendChild($item);
            if (!children.has(status.id)) continue;
            if (depth < MAX_DEPTH) {
                const $nested = element('ol', 'mastodon-replies');
                $item.appendChild($nested);
                render($nested, status.id, depth + 1);
            } else {
                render($parentList, status.id, depth);
            }
        }
    };
    render($list, rootId, 1);
}

async function getJSON(url, signal) {
    const response = await fetch(url, { credentials: 'omit', headers: { Accept: 'application/json' }, signal });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
}

export default function initMastodon(theme) {
    const { host, id, i18n } = theme.config.comment.mastodon;
    const $root = document.getElementById('mastodon');
    if (!$root) return;
    const $status = $root.querySelector('.mastodon-status');
    const $list = $root.querySelector('.mastodon-replies');
    // The status is a live region, so it stays in the page and only its text changes.
    const showStatus = text => {
        $status.textContent = text;
    };

    let started = false;
    const load = async () => {
        if (started) return;
        started = true;
        showStatus(i18n.loading);
        $root.setAttribute('aria-busy', 'true');
        const api = `https://${host}/api/v1/statuses/${encodeURIComponent(id)}`;
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timeout = controller && window.setTimeout(() => controller.abort(), 15000);
        try {
            if (typeof DOMPurify === 'undefined' || !DOMPurify.isSupported) throw new Error('DOMPurify is not available');
            const [status, context] = await Promise.all([
                getJSON(api, controller?.signal),
                getJSON(`${api}/context`, controller?.signal),
            ]);
            const descendants = (Array.isArray(context.descendants) ? context.descendants : [])
                .filter(reply => reply && reply.id && reply.account);
            if (!descendants.length) {
                showStatus(i18n.empty);
                return;
            }
            renderReplies($list, status.id || id, descendants, host, status.account?.id, i18n);
            $list.hidden = false;
            showStatus('');
        } catch (err) {
            console.error('LoveIt: the Mastodon comments could not be loaded.', err);
            showStatus(i18n.error);
        } finally {
            if (timeout) window.clearTimeout(timeout);
            $root.removeAttribute('aria-busy');
        }
    };

    if (!('IntersectionObserver' in window)) {
        load();
        return;
    }
    const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        load();
    }, { rootMargin: '400px 0px' });
    observer.observe($root);
}
