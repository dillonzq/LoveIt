import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

async function openSearch(page, engine, language = '') {
  await page.goto(`/${engine}/blog/${language}`);
  await page.locator('#search-toggle-desktop').click();
  return page.locator('#search-input');
}

for (const engine of ['fuse', 'lunr', 'pagefind']) {
  test(`${engine}: English search, subpath links and hidden pages`, async ({ page }) => {
    const input = await openSearch(page, engine);
    await input.fill('Needle');
    const result = page.locator('.suggestion-title').first();
    await expect(result).toContainText('Search <guide> & safety');
    await expect(page.locator('.suggestion-title img')).toHaveCount(0);
    await input.fill('HiddenNebula');
    await expect(page.locator('.search-empty')).toBeVisible();
    await input.fill('InheritedNebula');
    await expect(page.locator('.search-empty')).toBeVisible();
    await input.fill('<img src=x onerror=alert(1)>');
    await expect(page.locator('.search-query')).toContainText('<img src=x');
    await expect(page.locator('.search-empty img')).toHaveCount(0);
    await input.fill('Needle');
    await expect(result).toBeVisible();
    await result.click();
    await expect(page).toHaveURL(new RegExp(`/${engine}/blog/guide/`));
  });

  test(`${engine}: Chinese search`, async ({ page }) => {
    const input = await openSearch(page, engine, 'zh-cn/');
    await input.fill('中文');
    await expect(page.locator('.suggestion-title').first()).toContainText('中文搜索指南');
  });
}

test('rapid input shares an index request and clearing hides stale results', async ({ page }) => {
  let fetches = 0;
  await page.route('**/fuse/blog/index.json', async route => {
    fetches++;
    await new Promise(resolve => setTimeout(resolve, 500));
    await route.continue();
  });
  const input = await openSearch(page, 'fuse');
  await input.fill('alpha');
  await expect.poll(() => fetches).toBe(1);
  await input.fill('Needle');
  await expect(page.locator('.suggestion-context').first()).toContainText('Needle');
  expect(fetches).toBe(1);
  await input.fill('beta');
  await input.fill('');
  await expect(page.locator('#search-loading')).toBeHidden();
  await expect(page.locator('.suggestion-title')).toHaveCount(0);
});

test('Algolia mock preserves the latest async query', async ({ page }) => {
  await page.goto('/algolia/blog/');
  await page.evaluate(() => {
    window['algoliasearch/lite'] = { liteClient: () => ({ search: async ({ requests: [{ query }] }) => {
      await new Promise(resolve => setTimeout(resolve, query === 'first' ? 700 : 10));
      return { results: [{ hits: [{ uri: '/algolia/blog/guide/', title: query, content: query }] }] };
    } }) };
  });
  await page.locator('#search-toggle-desktop').click();
  await page.locator('#search-input').fill('first');
  await page.waitForTimeout(200);
  await page.locator('#search-input').fill('second');
  await expect(page.locator('.suggestion-title')).toHaveText('second');
  await page.waitForTimeout(800);
  await expect(page.locator('.suggestion-title')).toHaveText('second');
});

async function mockAlgolia(page) {
  await page.goto('/algolia/blog/');
  await page.evaluate(() => {
    window['algoliasearch/lite'] = { liteClient: () => ({ search: async ({ requests: [{ query }] }) => ({ results: [{
      hits: ['guide', 'gallery', 'math'].map(slug => ({ uri: `/algolia/blog/${slug}/`, title: `${query} ${slug}`, content: query })),
    }] }) }) };
  });
}

test('search dialog opens with / and Ctrl/Cmd+K, closes with Esc and returns focus', async ({ page }) => {
  await mockAlgolia(page);
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const input = page.getByRole('combobox', { name: 'Search', includeHidden: true });
  const toggle = page.locator('#search-toggle-desktop');
  await expect(toggle).toHaveAttribute('aria-haspopup', 'dialog');

  await page.keyboard.press('/');
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  for (const shortcut of ['Control+k', 'Meta+k']) {
    await toggle.focus();
    await page.keyboard.press(shortcut);
    await expect(dialog).toBeVisible();
    await expect(input).toBeFocused();
    await input.fill('kw');
    await expect(page.locator('#search-results [role="option"]')).toHaveCount(3);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(input).toHaveValue('');
  }

  // `/` types normally in other fields; Ctrl+K still opens search from them.
  await page.evaluate(() => document.querySelector('main').append(Object.assign(document.createElement('textarea'), { id: 'probe' })));
  await page.locator('#probe').focus();
  await page.keyboard.press('/');
  await expect(page.locator('#probe')).toHaveValue('/');
  await expect(dialog).toBeHidden();
  await page.keyboard.press('Control+k');
  await expect(input).toBeFocused();

  // A click on the backdrop closes the dialog.
  await page.mouse.click(10, 700);
  await expect(dialog).toBeHidden();
  await expect(page.locator('#probe')).toBeFocused();
});

test('search combobox: arrow keys move the active option and Enter opens it', async ({ page }) => {
  await mockAlgolia(page);
  await page.locator('#search-toggle-desktop').click();
  const input = page.getByRole('combobox', { name: 'Search' });
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveAttribute('aria-controls', 'search-results');
  await input.fill('kw');
  const listbox = page.getByRole('listbox', { name: 'Search results' });
  const options = listbox.getByRole('option');
  await expect(options).toHaveCount(3);
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('status')).toHaveText('Search results: 3');
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  const expectActive = async index => {
    const id = await options.nth(index).getAttribute('id');
    await expect(input).toHaveAttribute('aria-activedescendant', id);
    await expect(options.nth(index)).toHaveAttribute('aria-selected', 'true');
    await expect(listbox.locator('[aria-selected="true"]')).toHaveCount(1);
  };
  await page.keyboard.press('ArrowDown');
  await expectActive(0);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expectActive(2);
  await page.keyboard.press('ArrowDown');
  await expectActive(0);
  await page.keyboard.press('ArrowUp');
  await expectActive(2);
  await expect(input).toBeFocused();

  // Typing starts over from the first option.
  await input.fill('kx');
  await expect(options.first()).toContainText('kx guide');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowUp');
  await expectActive(2);
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/algolia\/blog\/math\/$/);
});

test('search: Enter without an active option opens the first result; no results are announced', async ({ page }) => {
  await page.goto('/fuse/blog/');
  await page.keyboard.press('/');
  const input = page.locator('#search-input');
  await input.fill('NoSuchWordAnywhere');
  await expect(page.locator('.search-empty')).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('No results found');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/fuse\/blog\/$/);
  await input.fill('Needle');
  await expect(page.locator('.suggestion-title').first()).toContainText('Search <guide> & safety');
  await page.locator('#search-clear').click();
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(page.locator('#search-results [role="option"]')).toHaveCount(0);
  await expect(page.locator('#search-results')).toBeHidden();
  await input.fill('Needle');
  await expect(page.locator('.suggestion-title').first()).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/fuse\/blog\/guide\/$/);
});

test('search: Enter during a pending query opens the new first result, never a stale or unsafe one', async ({ page }) => {
  await page.goto('/algolia/blog/');
  await page.evaluate(() => {
    const slugs = { kw: ['guide', 'gallery'], slow: ['math', 'guide'] };
    window['algoliasearch/lite'] = { liteClient: () => ({ search: async ({ requests: [{ query }] }) => {
      if (query === 'slow') await new Promise(resolve => setTimeout(resolve, 600));
      const hits = query === 'evil'
        ? [{ uri: 'javascript:window.__pwned=1', title: 'evil', content: 'evil' }]
        : (slugs[query] || []).map(slug => ({ uri: `/algolia/blog/${slug}/`, title: `${query} ${slug}`, content: query }));
      return { results: [{ hits }] };
    } }) };
  });
  await page.keyboard.press('/');
  const input = page.locator('#search-input');
  const options = page.locator('#search-results [role="option"]');

  await input.fill('evil');
  await expect(options).toHaveCount(1);
  await page.keyboard.press('Enter');
  await options.first().click();
  expect(await page.evaluate(() => window.__pwned)).toBeUndefined();
  await expect(page).toHaveURL(/\/algolia\/blog\/$/);

  // Confirming an IME candidate in Safari sends Enter with keyCode 229.
  await input.fill('kw');
  await expect(options).toHaveCount(2);
  await input.evaluate(el => el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, bubbles: true, cancelable: true })));
  await page.waitForTimeout(200);
  await expect(page).toHaveURL(/\/algolia\/blog\/$/);

  await page.keyboard.press('ArrowDown');
  await input.fill('slow');
  await expect(page.locator('#search-results')).toHaveAttribute('aria-busy', 'true');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await page.keyboard.press('ArrowDown');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/algolia\/blog\/math\/$/);
});

test('search: visitors can turn off the / shortcut and the choice persists', async ({ page }) => {
  await page.goto('/fuse/blog/');
  const toggle = page.locator('#search-toggle-desktop');
  const dialog = page.locator('#search-dialog');
  await expect(toggle).toHaveAttribute('aria-keyshortcuts', '/ Control+K Meta+K');
  await toggle.click();
  const checkbox = page.getByRole('checkbox', { name: 'Press / to open search' });
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  await expect(toggle).toHaveAttribute('aria-keyshortcuts', 'Control+K Meta+K');
  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(dialog).toBeHidden();
  await page.reload();
  await page.keyboard.press('/');
  await expect(dialog).toBeHidden();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await expect(checkbox).not.toBeChecked();
  await checkbox.check();
  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(dialog).toBeVisible();
});

test('lunr: a failed Chinese segmenter load is retried by the next search', async ({ page }) => {
  let attempts = 0;
  await page.route('**/lunr.segmentit*.js', route => attempts++ ? route.continue() : route.abort());
  await page.goto('/lunr/blog/zh-cn/');
  await page.locator('#search-toggle-desktop').click();
  await expect.poll(() => attempts).toBe(1);
  await page.locator('#search-input').fill('中文');
  await expect(page.locator('.suggestion-title').first()).toContainText('中文搜索指南');
  expect(attempts).toBe(2);
});

for (const { name, viewport } of [{ name: 'desktop', viewport: { width: 1280, height: 800 } }, { name: 'mobile', viewport: { width: 390, height: 844 } }]) {
  test(`${name}: the open search dialog has no critical or region axe violations`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/fuse/blog/');
    await page.locator(`#search-toggle-${name}`).click();
    await page.locator('#search-input').fill('Needle');
    await expect(page.locator('.suggestion-title').first()).toBeVisible();
    await page.keyboard.press('ArrowDown');
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter(v => v.impact === 'critical' || v.id === 'region').map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`)).toEqual([]);
  });
}

test('Mermaid survives cached content; math, copy controls and persisted theme work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/guide/');
  await expect(page.locator('html')).toHaveCSS('font-size', '17px');
  await expect(page.locator('.single-title')).toHaveCSS('letter-spacing', '0.125px');
  await expect(page.locator('script[src*="mermaid.min.js"]')).toHaveCount(1);
  await expect(page.locator('.mermaid svg')).toBeVisible();
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.code-header .copy').first()).toBeVisible();
  await page.locator('.mermaid svg').evaluate(svg => { svg.dataset.original = ''; });
  await page.setViewportSize({ width: 1000, height: 700 });
  await page.waitForTimeout(300);
  await expect(page.locator('.mermaid svg[data-original]')).toHaveCount(1);
  const before = await page.locator('body').getAttribute('cfg-theme');
  await page.locator('#header-desktop .theme-switch').click();
  const after = await page.locator('body').getAttribute('cfg-theme');
  expect(after).not.toBe(before);
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute('cfg-theme', after);
  expect(errors).toEqual([]);
});

test('mobile navigation and search survive resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/fuse/blog/');
  const menuToggle = page.getByRole('button', { name: 'Menu' });
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  await menuToggle.click();
  await expect(page.locator('#menu-mobile')).toHaveClass(/active/);
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#mask').click({ position: { x: 300, y: 600 } });
  await expect(page.locator('#menu-mobile')).not.toHaveClass(/active/);
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  await menuToggle.click();
  await page.locator('#search-toggle-mobile').click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#search-input')).toBeFocused();
  const dialog = await page.locator('#search-dialog').boundingBox();
  expect(dialog).toMatchObject({ x: 0, y: 0, width: 390, height: 844 });
  await page.locator('#search-input').fill('Needle');
  await expect(page.locator('#search-results .suggestion-title')).toContainText('Search');
  await page.locator('#search-cancel').click();
  await expect(page.locator('#search-dialog')).toBeHidden();
  await expect(page.locator('#search-toggle-mobile')).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('#search-toggle-desktop').click();
  await expect(page.locator('#search-input')).toHaveValue('');
  await page.locator('#search-input').fill('Needle');
  await expect(page.locator('#search-results .suggestion-title')).toContainText('Search');
});

test('header, share and back controls are labelled, keyboard-operable buttons', async ({ page }) => {
  await page.addInitScript(() => {
    window.__opened = [];
    window.open = url => { window.__opened.push(String(url)); return null; };
  });
  await page.goto('/fuse/blog/');
  await page.goto('/fuse/blog/gallery/');
  await expect(page.locator('a[href^="javascript:"]')).toHaveCount(0);

  const header = page.locator('#header-desktop');
  await expect(header.getByRole('button', { name: 'Search' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear', includeHidden: true })).toBeAttached();
  await expect(page.getByRole('combobox', { name: 'Search', includeHidden: true })).toBeAttached();
  await expect(header.getByRole('combobox', { name: 'Select Language' })).toBeAttached();

  const themeSwitch = header.getByRole('button', { name: /^Switch Theme/ });
  await expect(themeSwitch).toHaveAccessibleName('Switch Theme: Auto');
  await themeSwitch.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('cfg-theme', 'light');
  await expect(themeSwitch).toHaveAccessibleName('Switch Theme: Light');
  await page.keyboard.press('Space');
  await expect(page.locator('body')).toHaveAttribute('cfg-theme', 'dark');
  await expect(themeSwitch).toHaveAccessibleName('Switch Theme: Dark');
  await expect(page.locator('#header-mobile .theme-switch')).toHaveAttribute('aria-label', 'Switch Theme: Dark');

  const shareOnX = page.getByRole('button', { name: 'Share on X' });
  await shareOnX.focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.__opened)).toEqual([expect.stringContaining('x.com')]);

  await page.locator('.post-info-more').getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL(/\/fuse\/blog\/$/);
});

for (const { language, dir } of [{ language: '', dir: 'ltr' }, { language: 'ar/', dir: 'rtl' }]) {
  test(`${dir}: header, search dialog and auto TOC follow the language direction`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/fuse/blog/${language}guide/`);
    await expect(page.locator('html')).toHaveAttribute('dir', dir);
    const box = selector => page.locator(selector).boundingBox();
    const rtl = dir === 'rtl';

    const title = await box('#header-desktop .header-title');
    const menu = await box('#header-desktop .menu');
    expect(rtl ? title.x > menu.x : title.x < menu.x).toBe(true);

    const toc = page.locator('#toc-auto');
    await expect(toc).toBeVisible();
    const tocBox = await toc.boundingBox();
    const article = await box('article.page');
    if (rtl) expect(tocBox.x + tocBox.width).toBeLessThanOrEqual(article.x);
    else expect(tocBox.x).toBeGreaterThanOrEqual(article.x + article.width);
    await expect(toc).toHaveCSS(rtl ? 'border-right-width' : 'border-left-width', '4px');

    await page.locator('#search-toggle-desktop').click();
    const input = await box('#search-input');
    const cancel = await box('#search-cancel');
    const icon = await box('#search-dialog .search-icon');
    expect(rtl ? cancel.x < input.x : cancel.x > input.x).toBe(true);
    expect(rtl ? icon.x > input.x + input.width / 2 : icon.x < input.x + input.width / 2).toBe(true);
  });
}

test('a long auto TOC stays within the viewport and scrolls to the active section', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/fuse/blog/long-toc/');
  const toc = page.locator('#toc-auto');
  const content = page.locator('#toc-content-auto');
  await expect(toc).toBeVisible();
  expect(await content.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await expect(content).toHaveCSS('overflow-y', 'auto');
  const restingBox = await toc.boundingBox();
  expect(restingBox.y + restingBox.height).toBeLessThanOrEqual(600);

  await page.evaluate(() => {
    const top = document.getElementById('section-35').getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - 10, behavior: 'instant' });
  });
  const active = content.locator('a.active');
  await expect(active).toHaveText('Section 35');
  await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(0);

  const tocBox = await toc.boundingBox();
  expect(tocBox.y + tocBox.height).toBeLessThanOrEqual(600);
  const contentBox = await content.boundingBox();
  const activeBox = await active.boundingBox();
  expect(activeBox.y).toBeGreaterThanOrEqual(contentBox.y);
  expect(activeBox.y + activeBox.height).toBeLessThanOrEqual(contentBox.y + contentBox.height);

  // Shrinking the window keeps the active link visible in the shorter TOC.
  await page.setViewportSize({ width: 1280, height: 400 });
  await expect.poll(async () => {
    const [c, a] = await Promise.all([content.boundingBox(), active.boundingBox()]);
    return a.y >= c.y && a.y + a.height <= c.y + c.height && c.y + c.height <= 400;
  }).toBe(true);
});

test('first-screen avatar loads directly and scroll bursts share a frame', async ({ page }) => {
  await page.goto('/fuse/blog/');
  const avatar = page.locator('.home-avatar img');
  await expect(avatar).toHaveAttribute('loading', 'eager');
  await expect(avatar).toHaveAttribute('fetchpriority', 'high');
  await expect(avatar).not.toHaveAttribute('src', /loading\.svg/);
  const frames = await page.evaluate(() => {
    let count = 0;
    const original = window.requestAnimationFrame;
    window.requestAnimationFrame = callback => { count++; return original(callback); };
    for (let i = 0; i < 20; i++) window.dispatchEvent(new Event('scroll'));
    window.requestAnimationFrame = original;
    return count;
  });
  expect(frames).toBe(1);
});

test('content shortcodes survive cached content and nesting; grouped TypeIt types in order', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/typeit/');
  const lines = page.locator('.typeit > div');
  await expect(lines.nth(0)).toContainText('First typed line', { timeout: 15_000 });
  await expect(lines.nth(1)).toContainText('Second typed line', { timeout: 15_000 });
  await expect(page.locator('.raw-check')).toHaveText('Raw HTML');
  await expect(page.getByText('Styled text')).toHaveCSS('color', 'rgb(1, 2, 3)');
  await expect(page.getByText('Nested alpha')).toHaveCSS('color', 'rgb(4, 5, 6)');
  await expect(page.getByText('Nested beta')).toHaveCSS('color', 'rgb(7, 8, 9)');
  expect(await page.evaluate(() => window.scriptOrder)).toEqual(['first', 'second', 'nested a', 'nested b']);
  await expect(page.locator('.mermaid svg')).toBeVisible();
  const ids = await page.$$eval('[id^="id-"]', elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(ids.length);
  expect(errors).toEqual([]);
});

test('music shortcode uses the configured Meting API and its api override', async ({ page }) => {
  const requests = [];
  await page.route(/^https:\/\/(api\.injahow\.cn|meting\.test)\//, route => {
    requests.push(route.request().url());
    route.fulfill({ contentType: 'application/json', body: JSON.stringify([{ name: 'Mocked song', artist: 'Mocked artist', url: '', pic: '', lrc: '' }]) });
  });
  await page.goto('/fuse/blog/music/');
  await expect(page.locator('meting-js .aplayer-title')).toHaveText(['Mocked song', 'Mocked song']);
  expect(requests.map(url => url.replace(/&r=[\d.]+$/, '')).sort()).toEqual([
    'https://api.injahow.cn/meting/?server=netease&type=song&id=1868553',
    'https://meting.test/api?server=netease&type=playlist&id=60198',
  ]);
});

test('passthrough math renders on the server and loads only the KaTeX stylesheet', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/math/');
  await expect(page.locator('.content .katex')).toHaveCount(2);
  await expect(page.locator('.content .katex-display')).toBeVisible();
  await expect(page.locator('.content .katex-mathml').first()).toHaveCSS('position', 'absolute');
  // KaTeX >= 0.18 prefixes internal classes; old Hugo's markup must be renamed to match the bundled stylesheet.
  await expect(page.locator('.content .katex-html > .katex-base').first()).toHaveCSS('display', 'inline-block');
  await expect(page.locator('.content .katex-strut').first()).toHaveCSS('display', 'inline-block');
  await expect(page.locator('.content .katex-html .base, .content .katex-html .strut')).toHaveCount(0);
  await expect(page.locator('link[href*="katex"]')).toHaveCount(1);
  await expect(page.locator('script[src*="katex"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('ECharts renders with the site themes and re-renders on theme switch', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/echarts/');
  await expect(page.locator('script[src*="echarts.min.js"]')).toHaveCount(1);
  const chart = page.locator('.echarts svg');
  await expect(chart).toBeVisible();
  await expect(chart).toContainText('Weekly visits');
  await expect(chart).toContainText('Visits');
  expect(await page.evaluate(() => echarts.version)).toMatch(/^6\./);
  const background = () => page.locator('.echarts').evaluate(element => echarts.getInstanceByDom(element).getOption().backgroundColor);
  await expect(page.locator('body')).toHaveAttribute('theme', 'light');
  expect(await background()).toBe('rgba(0,0,0,0)');
  // The switch cycles auto -> light -> dark.
  for (let i = 0; i < 3 && await page.locator('body').getAttribute('theme') !== 'dark'; i++) await page.locator('#header-desktop .theme-switch').click();
  await expect(page.locator('body')).toHaveAttribute('theme', 'dark');
  expect(await background()).toBe('rgba(41,52,65,1)');
  await expect(chart).toContainText('Weekly visits');
  expect(errors).toEqual([]);
});

test('Waline loads its UMD build, renders comments and follows the dark theme', async ({ page }) => {
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(/^https:\/\/emoji\.test\//, route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ name: 'twemoji', prefix: '', type: 'png', icon: '1f603', items: ['1f603'] }) }));
  await page.route(/^https:\/\/waline\.test\//, route => {
    const url = new URL(route.request().url());
    requests.push(`${url.pathname}?${url.searchParams.get('lang')}`);
    const data = url.pathname === '/api/comment' && url.searchParams.has('path')
      ? { page: 1, totalPages: 1, pageSize: 10, count: 1, data: [{ objectId: '1', nick: 'Mocked visitor', comment: '<p>Mocked comment</p>', time: Date.UTC(2025, 0, 5), link: '', avatar: '', like: 0, children: [] }] }
      : [];
    route.fulfill({ contentType: 'application/json', body: JSON.stringify({ errno: 0, errmsg: '', data }) });
  });
  await page.goto('/fuse/blog/waline/');
  await expect(page.locator('script[src*="waline"]')).toHaveCount(1);
  await expect(page.locator('#waline .wl-card .wl-content')).toHaveText('Mocked comment');
  expect(requests).toContain('/api/comment?en');
  const background = () => page.locator('#waline').evaluate(element => getComputedStyle(element).getPropertyValue('--waline-bg-color').trim());
  await page.evaluate(() => document.body.setAttribute('theme', 'light'));
  expect(await background()).toBe('#fff');
  await page.evaluate(() => document.body.setAttribute('theme', 'dark'));
  expect(await background()).toBe('#1e1e1e');
  expect(errors).toEqual([]);
});

test('Valine avatars are decorative on every page of comments and the example site skips the IP lookup', async ({ page }) => {
  const errors = [];
  const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.route(/\/avatar\//, route => route.fulfill({ status: 204 }));
  // Valine reuses a LeanCloud SDK that is already on the page, so a small stand-in
  // serves three top-level comments, two per page, and one reply.
  await page.addInitScript(() => {
    const comment = (id, nick, extra = {}) => {
      const fields = { nick, mail: `${id}@example.com`, link: '', ua: '', comment: `<p>Comment ${id}</p>`, insertedAt: new Date(Date.UTC(2025, 0, 6)), url: '/', ...extra };
      return { id, get: key => fields[key] };
    };
    const comments = [comment('c1', 'First'), comment('c2', 'Second'), comment('c3', 'Third')];
    class Query {
      static or() { return new Query(); }
      static doCloudQuery(cql) { return Promise.resolve({ results: cql.includes('"c1"') ? [comment('r1', 'Reply', { rid: 'c1' })] : [] }); }
      doesNotExist() { return this; }
      equalTo() { return this; }
      exists() { return this; }
      addDescending() { return this; }
      limit(size) { this.size = size; return this; }
      skip(start) { this.start = start; return this; }
      count() { return Promise.resolve(comments.length); }
      find() { return Promise.resolve(comments.slice(this.start, this.start + this.size)); }
    }
    window.AV = { version: '4.0.0', applicationId: 'test', applicationKey: 'test', init() {}, Query };
  });
  await page.goto('/fuse/blog/valine/');
  const avatars = page.locator('#valine img.vimg');
  const decorative = page.locator('#valine img.vimg[alt=""]');
  await expect(page.locator('#valine .vcards > .vcard')).toHaveCount(2);
  await expect(avatars).toHaveCount(3);
  await expect(decorative).toHaveCount(3);
  await page.locator('#valine .vpage .vmore').click();
  await expect(page.locator('#valine .vcards > .vcard')).toHaveCount(3);
  await expect(avatars).toHaveCount(4);
  await expect(decorative).toHaveCount(4);
  expect(requests.filter(url => url.includes('upaiyun.com'))).toEqual([]);
  expect(errors).toEqual([]);
});

test('fixed buttons fade in after scrolling down', async ({ page }) => {
  await page.goto('/fuse/blog/guide/');
  await page.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo(0, 400); });
  await expect(page.locator('#fixed-buttons')).toHaveClass(/\banimate__fadeIn\b/);
});

test('lightGallery opens linked images with thumbnails, zoom and SVG icons', async ({ page }) => {
  const errors = [];
  const missing = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await page.goto('/fuse/blog/gallery/');
  // lightGallery ignores navigation while a slide transition, including the
  // opening one, is running, so each step waits for its lgAfterSlide.
  const slideAfter = async action => {
    await page.evaluate(() => {
      window.lgSlid = new Promise(resolve => document.getElementById('content').addEventListener('lgAfterSlide', resolve, { once: true }));
    });
    await action();
    await page.evaluate(() => window.lgSlid);
  };
  await slideAfter(() => page.locator('a.lightgallery').first().click());
  const outer = page.locator('.lg-outer');
  await expect(outer).toHaveClass(/\blg-visible\b/);
  await expect(page.locator('.lg-current .lg-image')).toHaveAttribute('src', /Wavelength\.jpg$/);
  await expect(page.locator('.lg-sub-html h2')).toHaveText('Wavelength');
  await expect(page.locator('.lg-thumb-item')).toHaveCount(2);
  // The second image sets its own thumbnail (src_s), which exThumbImage must pick up.
  await expect(page.locator('.lg-thumb-item img').nth(1)).toHaveAttribute('src', /Wavelength\.jpg$/);
  for (const button of ['.lg-close', '.lg-download', '.lg-toggle-thumb', '.lg-zoom-in', '.lg-zoom-out']) {
    await expect(page.locator(`.lg-toolbar ${button} svg`)).toBeVisible();
  }
  await slideAfter(() => page.locator('.lg-next').click());
  await expect(page.locator('.lg-counter')).toContainText('2 / 2');
  await page.locator('.lg-zoom-in').click();
  await expect(outer).toHaveClass(/\blg-zoomed\b/);
  await page.locator('.lg-close').click();
  await expect(outer).not.toHaveClass(/\blg-visible\b/);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

test('lightGallery keeps the zoom buttons and mobile defaults on phones', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();
  await page.goto('/fuse/blog/gallery/');
  await page.locator('a.lightgallery').first().click();
  await expect(page.locator('.lg-outer')).toHaveClass(/\blg-visible\b/);
  await expect(page.locator('.lg-toolbar .lg-zoom-in')).toBeVisible();
  await expect(page.locator('.lg-toolbar .lg-zoom-out')).toBeVisible();
  for (const hidden of ['.lg-close', '.lg-download', '.lg-next', '.lg-prev']) {
    await expect(page.locator(hidden)).toHaveCount(0);
  }
  await context.close();
});

test('skip link is the first tab stop and moves focus to the main content', async ({ page }) => {
  await page.goto('/fuse/blog/guide/');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toHaveText('Skip to main content');
  expect((await skipLink.boundingBox()).y + (await skipLink.boundingBox()).height).toBeLessThanOrEqual(0);
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.goto('/fuse/blog/zh-cn/');
  await expect(page.locator('.skip-link')).toHaveText('跳到正文');
});

test('reduced motion disables smooth scrolling, transitions and the TypeIt animation', async ({ browser, page }) => {
  await page.goto('/fuse/blog/guide/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');

  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const reduced = await context.newPage();
  const errors = [];
  reduced.on('pageerror', error => errors.push(error.message));
  await reduced.goto('/fuse/blog/typeit/');
  await expect(reduced.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  const lines = reduced.locator('.typeit > div');
  await expect(lines).toHaveText(['First typed line', 'Second typed line'], { timeout: 1_000 });
  await expect(reduced.locator('.typeit > input')).toHaveValue('Typed input', { timeout: 1_000 });
  await expect(reduced.locator('.ti-cursor')).toHaveCount(0);
  await reduced.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo(0, 400); });
  const fixedButtons = reduced.locator('#fixed-buttons');
  await expect(fixedButtons).toHaveClass(/\banimate__fadeIn\b/);
  expect(parseFloat(await fixedButtons.evaluate(element => getComputedStyle(element).animationDuration))).toBeLessThan(0.01);
  expect(errors).toEqual([]);
  await context.close();
});

async function structuredData(page, path) {
  await page.goto(path);
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  return JSON.parse(await scripts.textContent());
}

test('JSON-LD is valid for home and pages with special characters and non-raster images', async ({ page }) => {
  const site = await structuredData(page, '/fuse/blog/');
  expect(site).toMatchObject({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'LoveIt', inLanguage: 'en' });
  expect(site.image).toMatchObject({ '@type': 'ImageObject', width: 3200, height: 2048 });
  expect(site.thumbnailUrl).toMatch(/\/fuse\/blog\/images\/screenshot\.png$/);
  const rtlSite = await structuredData(page, '/fuse/blog/ar/');
  expect(rtlSite.thumbnailUrl).toBe('https://cdn.example.com/thumbnail.png');

  const post = await structuredData(page, '/fuse/blog/structured-data/');
  expect(post).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Structured "data" \\ </script> check',
    description: 'Quotes " and a closing </script><script>window.injected = true</script> tag',
    keywords: 'quote "tag", plain',
    datePublished: '2025-01-02T00:00:00+00:00',
    dateModified: '2025-01-03T00:00:00+00:00',
  });
  expect(post.wordCount).toBeGreaterThan(0);
  expect(post.image).toEqual([
    { '@type': 'ImageObject', url: expect.stringMatching(/\/fuse\/blog\/structured-data\/diagram\.svg$/) },
    'https://cdn.example.com/cover.png',
  ]);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();

  const translated = await structuredData(page, '/fuse/blog/zh-cn/guide/');
  expect(translated).toMatchObject({ headline: '中文搜索指南', inLanguage: 'zh-CN' });
  expect(translated).not.toHaveProperty('description');
});

async function socialImages(page, path) {
  await page.goto(path);
  return page.locator('head').evaluate(head => ({
    og: [...head.querySelectorAll('meta[property^="og:image"]')].map(meta => [meta.getAttribute('property'), meta.content]),
    card: head.querySelector('meta[name="twitter:card"]')?.content,
    twitter: head.querySelector('meta[name="twitter:image"]')?.content,
  }));
}

test('Open Graph and Twitter Cards use the theme images and publish local ones', async ({ page, request }) => {
  const home = await socialImages(page, '/fuse/blog/');
  expect(home.og).toEqual([
    ['og:image', expect.stringMatching(/\/fuse\/blog\/images\/Apple-Devices-Preview\.png$/)],
    ['og:image:width', '3200'],
    ['og:image:height', '2048'],
  ]);
  expect(home).toMatchObject({ card: 'summary_large_image', twitter: home.og[0][1] });

  // seo.images comes first; empty entries and SVG images are skipped.
  const post = await socialImages(page, '/fuse/blog/structured-data/');
  expect(post).toEqual({
    og: [['og:image', 'https://cdn.example.com/cover.png']],
    card: 'summary_large_image',
    twitter: 'https://cdn.example.com/cover.png',
  });

  const featured = await socialImages(page, '/fuse/blog/social-image/');
  expect(featured.og).toEqual([
    ['og:image', expect.stringMatching(/\/fuse\/blog\/images\/zion-national-park\.jpg$/)],
    ['og:image:width', '600'],
    ['og:image:height', '400'],
  ]);
  expect(featured.twitter).toBe(featured.og[0][1]);

  // Like Hugo's own templates, a bundle image named like *cover* is used without any image parameter.
  const bundle = await socialImages(page, '/fuse/blog/bundle-cover/');
  expect(bundle.og).toEqual([
    ['og:image', expect.stringMatching(/\/fuse\/blog\/bundle-cover\/cover\.jpg$/)],
    ['og:image:width', '800'],
    ['og:image:height', '533'],
  ]);
  for (const url of [home.og[0][1], featured.og[0][1], bundle.og[0][1]]) {
    expect((await request.get(url)).ok()).toBe(true);
  }
});

test('copy buttons copy code verbatim and unknown languages keep the code block style', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/code-blocks/');
  const blocks = page.locator('.code-block');
  await expect(blocks).toHaveCount(4);
  // Options of an unknown language apply to its plain-text fallback, whichever Hugo version stores them.
  await expect(blocks.nth(1)).toHaveAttribute('style', /counter-reset: ?code-block 4\b/);
  await expect(blocks.nth(1)).toHaveClass(/\bcode-line-numbers\b/);
  await expect(blocks.nth(3)).not.toHaveClass(/\bcode-line-numbers\b/);
  const expected = ['echo one\n  echo two\necho three', 'let answer = 42;\nprint answer', 'plain one\nplain two'];
  for (const [index, text] of expected.entries()) {
    const block = blocks.nth(index);
    // Every block is highlighted by Chroma, so it gets line numbers and the code colors.
    await expect(block.locator('pre.chroma span.line')).toHaveCount(text.split('\n').length);
    await block.locator('.copy').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(text);
  }
  expect(errors).toEqual([]);
  await context.close();
});

test('home page and its feed list the posts section and pages typed "posts" or "post"', async ({ page, request }) => {
  await page.goto('/fuse/blog/');
  const titles = page.locator('.home .single-title');
  await expect(titles.filter({ hasText: 'Typed post' })).toHaveCount(1);
  await expect(titles.filter({ hasText: 'Posts type elsewhere' })).toHaveCount(1);
  await expect(titles.filter({ hasText: 'Post type elsewhere' })).toHaveCount(1);
  await expect(titles.filter({ hasText: 'Plain note' })).toHaveCount(0);
  const feed = await (await request.get('/fuse/blog/index.xml')).text();
  expect(feed).toContain('<title>Typed post</title>');
  expect(feed).toContain('<title>Posts type elsewhere</title>');
  expect(feed).toContain('<title>Post type elsewhere</title>');
  expect(feed).not.toContain('<title>Plain note</title>');
});
