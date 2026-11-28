import { forEach, isTocStatic } from '../util.js';

// The table of contents of a post (layouts/posts/single.html): kept in the article on
// narrow screens or when the page asks for it, otherwise beside the article, where it
// follows the scroll and highlights the section being read.
export default function initToc(theme) {
    const $tocCore = document.getElementById('TableOfContents');
    // The scroll handler of the current placement; each placement measures the page anew.
    let onScroll;
    const place = () => {
        if (onScroll) theme.scrollEventSet.delete(onScroll);
        onScroll = undefined;
        if (document.getElementById('toc-static').getAttribute('data-kept') || isTocStatic()) {
            const $tocContentStatic = document.getElementById('toc-content-static');
            if ($tocCore.parentElement !== $tocContentStatic) {
                $tocCore.parentElement.removeChild($tocCore);
                $tocContentStatic.appendChild($tocCore);
            }
            return;
        }
        const $tocContentAuto = document.getElementById('toc-content-auto');
        if ($tocCore.parentElement !== $tocContentAuto) {
            $tocCore.parentElement.removeChild($tocCore);
            $tocContentAuto.appendChild($tocCore);
        }
        const $toc = document.getElementById('toc-auto');
        const $page = document.getElementsByClassName('page')[0];
        const rect = $page.getBoundingClientRect();
        // The TOC sits beside the page on its inline-end side: right in LTR, left in RTL.
        const gap = 20;
        const width = rect.left - gap;
        const isRtl = window.getComputedStyle($toc).direction === 'rtl';
        $toc.style.left = `${isRtl ? rect.left - gap - width : rect.right + gap}px`;
        $toc.style.maxWidth = `${width}px`;
        $toc.style.visibility = 'visible';
        const $tocLinkElements = $tocCore.querySelectorAll('a:first-child');
        const $tocLiElements = $tocCore.getElementsByTagName('li');
        // Match headings inside the article so a wrapper with the same ID cannot become a TOC target.
        const $headings = $page.querySelectorAll('.content :is(h1, h2, h3, h4, h5, h6)[id]');
        const headingsById = new Map(Array.from($headings, $heading => [$heading.id, $heading]));
        const $tocTargets = Array.from($tocLinkElements, $tocLink => [$tocLink, headingsById.get($tocLink.getAttribute('href').slice(1))])
            .filter(([, $heading]) => $heading);
        const $headerLinkElements = $tocTargets.map(([, $heading]) => $heading);
        const $targetTocLinks = $tocTargets.map(([$tocLink]) => $tocLink);
        const headerIsFixed = document.body.getAttribute('data-header-desktop') !== 'normal';
        const headerHeight = document.getElementById('header-desktop').offsetHeight;
        const TOP_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
        // The TOC stays in place while measured, so this is its top at rest.
        $toc.style.position = '';
        $toc.style.top = '';
        const minTocTop = $toc.offsetTop;
        const minScrollTop = minTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
        // Re-check that the active link is visible after every placement, e.g. on resize.
        let lastActiveTocIndex = -1;
        onScroll = () => {
            // Keep the whole TOC on screen: cap its height to the space below its current top,
            // which is lower at rest than while fixed. Longer contents scroll inside it.
            const tocViewportTop = Math.max(minTocTop + (headerIsFixed ? 0 : headerHeight) - theme.newScrollTop, TOP_SPACING);
            $toc.style.maxHeight = `calc(100vh - ${tocViewportTop + 20}px)`;
            const footerTop = document.getElementById('post-footer').offsetTop;
            const maxTocTop = footerTop - $toc.getBoundingClientRect().height;
            const maxScrollTop = maxTocTop - TOP_SPACING + (headerIsFixed ? 0 : headerHeight);
            if (theme.newScrollTop < minScrollTop) {
                $toc.style.position = 'absolute';
                $toc.style.top = `${minTocTop}px`;
            } else if (theme.newScrollTop > maxScrollTop) {
                $toc.style.position = 'absolute';
                $toc.style.top = `${maxTocTop}px`;
            } else {
                $toc.style.position = 'fixed';
                $toc.style.top = `${TOP_SPACING}px`;
            }

            forEach($tocLinkElements, $tocLink => { $tocLink.classList.remove('active'); });
            forEach($tocLiElements, $tocLi => { $tocLi.classList.remove('has-active'); });
            const INDEX_SPACING = 20 + (headerIsFixed ? headerHeight : 0);
            let activeTocIndex = $headerLinkElements.length - 1;
            for (let i = 0; i < $headerLinkElements.length - 1; i++) {
                const thisTop = $headerLinkElements[i].getBoundingClientRect().top;
                const nextTop = $headerLinkElements[i + 1].getBoundingClientRect().top;
                if ((i === 0 && thisTop > INDEX_SPACING)
                 || (thisTop <= INDEX_SPACING && nextTop > INDEX_SPACING)) {
                    activeTocIndex = i;
                    break;
                }
            }
            if (activeTocIndex !== -1) {
                $targetTocLinks[activeTocIndex].classList.add('active');
                let $parent = $targetTocLinks[activeTocIndex].parentElement;
                while ($parent !== $tocCore) {
                    $parent.classList.add('has-active');
                    $parent = $parent.parentElement.parentElement;
                }
            }
            // When the active section changes, scroll it into view inside the TOC only,
            // leaving the page scroll alone and the reader free to browse the TOC otherwise.
            if (activeTocIndex !== lastActiveTocIndex) {
                lastActiveTocIndex = activeTocIndex;
                if (activeTocIndex !== -1 && $tocContentAuto.scrollHeight > $tocContentAuto.clientHeight) {
                    const box = $tocContentAuto.getBoundingClientRect();
                    const link = $targetTocLinks[activeTocIndex].getBoundingClientRect();
                    if (link.top < box.top) $tocContentAuto.scrollTop += Math.floor(link.top - box.top);
                    else if (link.bottom > box.bottom) $tocContentAuto.scrollTop += Math.ceil(link.bottom - box.bottom);
                }
            }
        };
        onScroll();
        theme.scrollEventSet.add(onScroll);
    };
    place();
    theme.resizeEventSet.add(place);
    // The theme starts before the DOMContentLoaded handlers of later scripts, which can change
    // the header, and before images and web fonts have loaded: place the TOC again then.
    if (document.readyState !== 'complete') window.addEventListener('load', place, { once: true });
    if (document.fonts && document.fonts.status === 'loading') document.fonts.ready.then(place);
}
