import { prefersReducedMotion } from '../util.js';

// TypeIt types out each group of strings one element after another.
export default function initTypeit(theme) {
    const typeitConfig = theme.config.typeit;
    if (prefersReducedMotion()) {
        // Show the full text at once instead of typing it out.
        Object.values(typeitConfig.data).forEach(group => group.forEach(id => {
            const $typeit = document.getElementById(id);
            if (!$typeit) return;
            const strings = theme.data[id];
            const html = Array.isArray(strings) ? strings.join('<br>') : (strings ?? '');
            if ($typeit instanceof HTMLInputElement || $typeit instanceof HTMLTextAreaElement) {
                // Like TypeIt, form fields get the text content as their value.
                const template = document.createElement('template');
                template.innerHTML = html;
                $typeit.value = template.content.textContent;
            } else {
                $typeit.innerHTML = html;
            }
        }));
        return;
    }
    const speed = typeitConfig.speed ? typeitConfig.speed : 100;
    const cursorSpeed = typeitConfig.cursorSpeed ? typeitConfig.cursorSpeed : 1000;
    const cursorChar = typeitConfig.cursorChar ? typeitConfig.cursorChar : '|';
    Object.values(typeitConfig.data).forEach(group => {
        const typeone = (i) => {
            const id = group[i];
            new TypeIt(`#${id}`, {
                strings: theme.data[id],
                speed: speed,
                lifeLike: true,
                cursorSpeed: cursorSpeed,
                cursorChar: cursorChar,
                waitUntilVisible: true,
                afterComplete: instance => {
                    if (i === group.length - 1) {
                        if (typeitConfig.duration >= 0) window.setTimeout(() => {
                            instance.destroy();
                        }, typeitConfig.duration);
                        return;
                    }
                    instance.destroy();
                    typeone(i + 1);
                },
            }).go();
        };
        typeone(0);
    });
}
