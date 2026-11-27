import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

async function openSearch(page, engine, language = '') {
  await page.goto(`/${engine}/blog/${language}`);
  await page.locator('#search-toggle-desktop').click();
  return page.locator('#search-input-desktop');
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
  await expect(page.locator('#search-loading-desktop')).toBeHidden();
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
  await page.locator('#search-input-desktop').fill('first');
  await page.waitForTimeout(200);
  await page.locator('#search-input-desktop').fill('second');
  await expect(page.locator('.suggestion-title')).toHaveText('second');
  await page.waitForTimeout(800);
  await expect(page.locator('.suggestion-title')).toHaveText('second');
});

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

// The referrer meta tag is covered by tests/security-defaults.test.mjs; the fixture overrides head/meta.html.
test('Mermaid uses securityLevel "strict" unless the config says "loose"', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/guide/');
  await expect(page.locator('.mermaid svg')).toBeVisible();
  const securityLevel = () => page.evaluate(() => mermaid.mermaidAPI.getConfig().securityLevel);
  expect(await page.evaluate(() => window.config.mermaid)).toEqual({ securityLevel: 'strict' });
  expect(await securityLevel()).toBe('strict');
  // The theme switch re-initializes Mermaid from window.config.
  const rerender = async mermaidConfig => {
    await page.evaluate(value => {
      if (value === undefined) delete window.config.mermaid;
      else window.config.mermaid = value;
      document.querySelector('.mermaid').innerHTML = '';
    }, mermaidConfig);
    await page.locator('#header-desktop .theme-switch').click();
    await expect(page.locator('.mermaid svg')).toBeVisible();
  };
  await rerender({ securityLevel: 'loose' });
  expect(await securityLevel()).toBe('loose');
  await rerender({ securityLevel: 'antiscript' });
  expect(await securityLevel()).toBe('strict');
  await rerender(undefined);
  expect(await securityLevel()).toBe('strict');
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
  await page.locator('#search-input-mobile').fill('Needle');
  await expect(page.locator('#search-dropdown-mobile .suggestion-title')).toContainText('Search');
  await page.locator('#search-cancel-mobile').click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('#search-toggle-desktop').click();
  await page.locator('#search-input-desktop').fill('Needle');
  await expect(page.locator('#search-dropdown-desktop .suggestion-title')).toContainText('Search');
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
  await expect(header.getByRole('button', { name: 'Clear', includeHidden: true })).toBeAttached();
  await expect(header.getByRole('combobox', { name: 'Search' })).toBeAttached();
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

test('theme icons are inline SVG and only content that uses Font Awesome loads it', async ({ page }) => {
  const fontBytes = {};
  const iconRequests = [];
  page.on('requestfinished', async request => {
    if (/\/lib\/(fontawesome-free|simple-icons)\//.test(request.url())) iconRequests.push(request.url());
    if (request.resourceType() !== 'font') return;
    const { responseBodySize } = await request.sizes();
    fontBytes[page.url()] = (fontBytes[page.url()] || 0) + responseBodySize;
  });
  for (const path of ['/fuse/blog/', '/fuse/blog/gallery/', '/fuse/blog/tags/icons/', '/fuse/blog/404.html']) {
    await page.goto(path, { waitUntil: 'networkidle' });
    await expect(page.locator('link[href*="fontawesome"]')).toHaveCount(0);
    await expect(page.locator('[data-svg-src], i[class*="fa-"]')).toHaveCount(0);
    await expect(page.locator('#header-desktop .theme-switch svg.icon')).toHaveCount(3);
    const { violations } = await new AxeBuilder({ page }).withRules(['svg-img-alt']).analyze();
    expect(violations).toEqual([]);
    expect(fontBytes[page.url()] || 0).toBeLessThanOrEqual(60 * 1024);
  }
  expect(iconRequests).toEqual([]);

  // Icon-only social links are named by their icon.
  await page.goto('/fuse/blog/');
  await expect(page.locator('.home-profile .links svg[role="img"]').first()).toHaveAttribute('aria-label', /\S/);
  // Each theme mode shows its own icon.
  const visibleIcon = () => page.locator('#header-desktop .theme-switch svg:visible').getAttribute('class');
  await expect.poll(visibleIcon).toContain('theme-icon-auto');
  await page.locator('#header-desktop .theme-switch').click();
  await expect.poll(visibleIcon).toContain('theme-icon-light');

  await page.goto('/fuse/blog/font-awesome/');
  await expect(page.locator('link[href*="fontawesome"]')).not.toHaveCount(0);
  const rocket = page.locator('#content i.fas.fa-rocket');
  await expect(rocket).toBeVisible();
  await expect.poll(() => rocket.evaluate(icon => getComputedStyle(icon, '::before').fontFamily)).toContain('Font Awesome');
  await expect(page.locator('#content .admonition svg.icon')).toHaveCount(3);
  // Only the title icon is positioned; icons in the admonition body stay in the text flow.
  await expect(page.locator('#content .admonition .admonition-content svg.icon')).toHaveCSS('position', 'static');
  await expect(page.locator('#content').getByRole('img', { name: 'Checked', exact: true })).toHaveCount(2);
  await expect(page.locator('#content').getByRole('img', { name: 'Unchecked', exact: true })).toHaveCount(1);
  const { violations } = await new AxeBuilder({ page }).include('#content').withRules(['svg-img-alt', 'label']).analyze();
  expect(violations).toEqual([]);

  // HTML that the raw shortcode inserts after load still gets the webfont.
  await page.goto('/fuse/blog/raw-icon/');
  await expect(page.locator('link[href*="fontawesome"]')).not.toHaveCount(0);
  await expect(page.locator('#content i.fas.fa-anchor')).toBeVisible();

  // So does a byline whose author name uses a Font Awesome class.
  await page.goto('/fuse/blog/author-icon/');
  await expect(page.locator('link[href*="fontawesome"]')).not.toHaveCount(0);
});

test('icon prose does not load webfonts and local SVGs retain their fills', async ({ page }) => {
  await page.goto('/fuse/blog/icon-prose/');
  await expect(page.locator('link[href*="fontawesome"]')).toHaveCount(0);
  const icon = page.getByRole('img', { name: 'Custom SVG' });
  await expect(icon.locator('path').first()).toHaveCSS('fill', 'rgb(255, 0, 0)');
  await expect(icon.locator('path').last()).toHaveCSS('fill', 'none');
});

for (const { language, dir } of [{ language: '', dir: 'ltr' }, { language: 'ar/', dir: 'rtl' }]) {
  test(`${dir}: header, search dropdown and auto TOC follow the language direction`, async ({ page }) => {
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
    const dropdown = await box('#search-dropdown-desktop');
    const viewport = page.viewportSize();
    expect(rtl ? dropdown.x < viewport.width / 2 : dropdown.x > viewport.width / 2).toBe(true);
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
  // The first thumbnail is the smallest WebP copy; the second image sets its own (src_s),
  // which exThumbImage must pick up.
  await expect(page.locator('.lg-thumb-item img').first()).toHaveAttribute('src', /Wavelength_hu_\w+\.webp$/);
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

test('local images get their size, WebP srcset and native lazy loading; others are left alone', async ({ page }) => {
  await page.goto('/fuse/blog/image-processing/');
  await expect(page.locator('script[src*="lazysizes"], img.lazyload, img[data-src]')).toHaveCount(0);
  const images = page.locator('#content img');
  // Exif orientation 6: the 600x400 JPEG is shown 400x600, and its WebP copy is rotated to match.
  const rotated = images.nth(0);
  await expect(rotated).toHaveAttribute('src', /\/image-processing\/rotated\.jpg$/);
  await expect(rotated).toHaveAttribute('width', '400');
  await expect(rotated).toHaveAttribute('height', '600');
  await expect(rotated).toHaveAttribute('srcset', /^\S+\.webp 400w$/);
  await expect(rotated).toHaveAttribute('sizes', /100vw/);
  await expect(rotated).toHaveAttribute('loading', 'lazy');
  await expect(rotated).toHaveAttribute('decoding', 'async');
  await rotated.scrollIntoViewIfNeeded();
  // naturalWidth follows the density that sizes gives the candidate, so compare the aspect ratio.
  await expect.poll(() => rotated.evaluate(img => img.complete && [img.currentSrc.endsWith('.webp'), Math.round(img.naturalHeight / img.naturalWidth * 10) / 10])).toEqual([true, 1.5]);
  // A width alone gets the height that keeps the aspect ratio.
  const narrow = images.nth(1);
  await expect(narrow).toHaveAttribute('width', '200');
  await expect(narrow).toHaveAttribute('height', '300');
  // Files under static/ and remote images are used as they are.
  for (const [index, src] of [[2, /\/android-chrome-192x192\.png$/], [3, /^https:\/\/cdn\.example\.com\/remote\.png$/]]) {
    const image = images.nth(index);
    await expect(image).toHaveAttribute('src', src);
    await expect(image).not.toHaveAttribute('srcset');
    await expect(image).not.toHaveAttribute('width');
    await expect(image).toHaveAttribute('loading', 'lazy');
  }
  // Hugo reads a PNG's Exif orientation from 0.155.0 (.Meta); before that, only JPEG and TIFF orientation.
  const hugoVersion = process.env.LOVEIT_HUGO_VERSION || 'locked';
  const readsPngOrientation = !(hugoVersion === 'minimum' || /^v?0\.(?:\d{1,2}|1[0-4]\d|15[0-4])\./.test(hugoVersion));
  const png = images.nth(4);
  const [pngWidth, pngHeight] = readsPngOrientation ? ['40', '60'] : ['60', '40'];
  await expect(png).toHaveAttribute('width', pngWidth);
  await expect(png).toHaveAttribute('height', pngHeight);
  await expect(png).toHaveAttribute('srcset', new RegExp(`^\\S+\\.webp ${pngWidth}w$`));
  await png.scrollIntoViewIfNeeded();
  await expect.poll(() => png.evaluate(img => img.complete && [img.currentSrc.endsWith('.webp'), Math.round(img.naturalHeight / img.naturalWidth * 10) / 10]))
    .toEqual([true, readsPngOrientation ? 1.5 : 0.7]);
  // Animated PNG and WebP keep their animation: their size, but no WebP copies.
  // The APNG has a text chunk that mentions IDAT and acTL before its real acTL chunk.
  for (const [index, size] of [[5, ['60', '40']], [6, ['160', '33']]]) {
    const image = images.nth(index);
    await expect(image).toHaveAttribute('src', /\/image-processing\/animated\.(png|webp)$/);
    await expect(image).not.toHaveAttribute('srcset');
    await expect(image).toHaveAttribute('width', size[0]);
    await expect(image).toHaveAttribute('height', size[1]);
  }
  // A width of 0 counts as missing.
  await expect(images.nth(7)).toHaveAttribute('width', '400');
  await expect(images.nth(7)).toHaveAttribute('height', '600');
  // An oriented JPEG Hugo cannot decode keeps its size and is used as it is, without failing the build.
  const broken = images.nth(8);
  await expect(broken).toHaveAttribute('src', /\/image-processing\/broken\.jpg$/);
  await expect(broken).toHaveAttribute('width', '400');
  await expect(broken).toHaveAttribute('height', '600');
  await expect(broken).not.toHaveAttribute('srcset');

  // The bundle's featured image is the first-screen image: loaded at once with a high priority.
  const featured = page.locator('.featured-image img');
  await expect(featured).toHaveAttribute('src', /\/image-processing\/featured-image\.jpg$/);
  await expect(featured).toHaveAttribute('fetchpriority', 'high');
  await expect(featured).toHaveAttribute('loading', 'eager');
  await expect(featured).not.toHaveAttribute('decoding');
  await expect(featured).toHaveAttribute('width', '600');
  await expect(featured).toHaveAttribute('height', '400');
  await expect(featured).toHaveAttribute('srcset', /^\S+\.webp 480w, \S+\.webp 600w$/);
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

test.describe('heading anchors without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('are built into article headings, named by them and keep their formatting', async ({ page }) => {
    await page.goto('/fuse/blog/headings/');
    const content = page.locator('.content#content');
    const anchors = content.locator('> :is(h2, h3, h4, h5, h6) > a.header-mark');
    await expect(anchors).toHaveCount(5);
    for (const [id, name] of [
      ['plain-section', 'Plain section'],
      ['section-with-code-and-emphasis', 'Section with code and emphasis'],
      ['custom-id', 'Custom attributes'],
      ['content', 'Content'],
      ['last-section', 'Last section'],
    ]) {
      const anchor = content.locator(`#${id} > a.header-mark`);
      await expect(anchor).toBeVisible();
      await expect(anchor).toHaveAttribute('href', `#${id}`);
      await expect(anchor).toHaveAccessibleName(name);
      // The decorative "#" or "|" mark stays out of the heading's own name.
      await expect(content.getByRole('heading', { name, exact: true })).toHaveAttribute('id', id);
    }
    const formatted = content.locator('#section-with-code-and-emphasis');
    await expect(formatted.locator('code')).toHaveText('code');
    await expect(formatted.locator('em')).toHaveText('emphasis');
    const custom = content.locator('#custom-id');
    await expect(custom).toHaveClass('custom-class');
    await expect(custom).toHaveAttribute('data-count', '42');
    await expect(custom).toHaveAttribute('title', 'Say "hi" & <go>');
    // Headings the theme never marked keep no visible or focusable anchor.
    await expect(content.locator('#top-level-heading > a.header-mark')).toBeHidden();
    await expect(content.locator('.admonition #nested-heading > a.header-mark')).toBeHidden();
    // An empty heading keeps its ID but gets no unnamed link. It sits in the admonition to stay out of the TOC.
    await expect(content.locator('h5#divider')).toBeAttached();
    await expect(content.locator('#divider > a')).toHaveCount(0);
    await expect(content.locator('h5#space-divider')).toBeAttached();
    await expect(content.locator('#space-divider > a')).toHaveCount(0);
    await expect(content.locator('h5#formatted-space-divider')).toBeAttached();
    await expect(content.locator('#formatted-space-divider > a')).toHaveCount(0);

    await content.locator('#last-section > a.header-mark').click();
    await expect(page).toHaveURL(/\/headings\/#last-section$/);
  });

  test('stay out of the feed and the Markdown output', async ({ request }) => {
    const feed = await (await request.get('/fuse/blog/index.xml')).text();
    expect(feed).toContain('<h2 id="plain-section">Plain section</h2>');
    expect(feed).not.toContain('header-mark');
    const markdown = await (await request.get('/fuse/blog/headings/index.md')).text();
    expect(markdown).toContain('## Plain section');
    expect(markdown).not.toContain('header-mark');
  });
});

test('every link on an article with heading anchors has an accessible name', async ({ page }) => {
  await page.goto('/fuse/blog/headings/');
  const { violations } = await new AxeBuilder({ page }).withRules(['link-name']).analyze();
  expect(violations).toEqual([]);
});

for (const missing of [false, true]) {
  test(`the auto TOC follows the article headings it links to${missing ? ', skipping links without a heading' : ''}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // With autoHeadingID off, Hugo links headings that have no ID to "#".
    if (missing) {
      await page.route('**/fuse/blog/headings/', async route => {
        const response = await route.fetch();
        const body = (await response.text()).replace(/<a href=["']?#(plain-section|section-with-code-and-emphasis)["']?>/g, '<a href="#">');
        await route.fulfill({ response, body });
      });
    }
    await page.setViewportSize({ width: 1280, height: 400 });
    await page.goto('/fuse/blog/headings/');
    const content = page.locator('#toc-content-auto');
    await expect(page.locator('#toc-auto')).toBeVisible();
    if (missing) await expect(content.locator('a[href="#"]')).toHaveCount(2);
    const sections = [['custom-id', 'Custom attributes'], ['content', 'Content'], ['last-section', 'Last section']];
    if (!missing) sections.unshift(['plain-section', 'Plain section']);
    for (const [id, name] of sections) {
      await page.locator(`.content :is(h2, h3)[id="${id}"]`).evaluate(heading => {
        const top = heading.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top - 10, behavior: 'instant' });
      });
      await expect(content.locator('a.active')).toHaveText(name);
    }
    expect(errors).toEqual([]);
  });
}

test('Read More links name their post, microdata uses https and summaries keep it', async ({ page }) => {
  await page.goto('/fuse/blog/');
  const readMore = page.locator('.home .summary .post-footer > a').first();
  // Only "Read More" shows; the post title stays in the link text for crawlers but off screen.
  await expect(readMore).toHaveAccessibleName(/^Read More: \S/);
  const typed = page.getByRole('link', { name: 'Read More: Typed post' });
  await expect(typed).toHaveText('Read More Typed post', { useInnerText: true });
  expect(await typed.evaluate(link => link.firstChild.textContent)).toBe('Read More');
  const hidden = await typed.locator('.visually-hidden').boundingBox();
  expect(hidden.width * hidden.height).toBeLessThanOrEqual(1);
  await typed.focus();
  await expect(typed).toBeFocused();
  const literalTitle = 'std::vector<int> & 😄';
  const literal = page.getByRole('link', { name: `Read More: ${literalTitle}`, exact: true });
  await expect(literal.locator('.visually-hidden')).toHaveText(literalTitle);
  await expect(page.locator('[itemtype^="http:"]')).toHaveCount(0);
  await expect(page.locator('.summary[itemtype="https://schema.org/Article"]').first()).toBeAttached();
  await expect(page.locator('.footer [itemtype="https://schema.org/CreativeWork"]')).toHaveCount(1);
  await page.goto('/fuse/blog/zh-cn/');
  await expect(page.getByRole('link', { name: '阅读全文：中文搜索指南' })).toHaveCount(1);
});

test('footnotes and their references are highlighted when a link jumps to them', async ({ browser, page }) => {
  await page.goto('/fuse/blog/long-toc/');
  const reference = page.locator('sup[id^="fnref"]').first();
  const note = page.locator('.footnotes li').first();
  await expect(note).not.toHaveCSS('outline-style', 'solid');
  await reference.locator('a').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#fn:1$/);
  await expect(note).toHaveCSS('outline-style', 'solid');
  await expect(note).toHaveCSS('animation-name', 'footnote-target');
  await expect(note).toBeInViewport();
  await note.locator('a.footnote-backref').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#fnref:1$/);
  await expect(reference).toHaveCSS('outline-style', 'solid');
  await expect(note).not.toHaveCSS('outline-style', 'solid');

  // Highlighted text and links keep at least 4.5:1 contrast in both themes.
  const contrast = locator => locator.evaluate(element => {
    const rgba = value => value.match(/[\d.]+/g).map(Number);
    const over = ([r, g, b, a = 1], [br, bg, bb]) => [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
    const target = element.closest(':target');
    const background = over(rgba(getComputedStyle(target).backgroundColor), rgba(getComputedStyle(document.body).backgroundColor));
    const luminance = rgb => rgb.map(v => v / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const [a, b] = [luminance(over(rgba(getComputedStyle(element).color), background)), luminance(background)];
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  });
  for (const theme of ['light', 'dark']) {
    await page.goto('/fuse/blog/long-toc/#fnref:1');
    await page.evaluate(theme => document.body.setAttribute('theme', theme), theme);
    expect(await contrast(reference.locator('a'))).toBeGreaterThanOrEqual(4.5);
    await page.goto('/fuse/blog/long-toc/#fn:1');
    await page.evaluate(theme => document.body.setAttribute('theme', theme), theme);
    expect(await contrast(note.locator('p'))).toBeGreaterThanOrEqual(4.5);
    expect(await contrast(note.locator('a.footnote-backref'))).toBeGreaterThanOrEqual(4.5);
  }
  await expect(note).toHaveCSS('outline-color', 'rgb(85, 189, 226)');

  // Reduced motion keeps the highlight but drops the animation.
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const reduced = await context.newPage();
  await reduced.goto('/fuse/blog/long-toc/#fn:1');
  const reducedNote = reduced.locator('.footnotes li').first();
  await expect(reducedNote).toHaveCSS('outline-style', 'solid');
  await expect(reducedNote).toHaveCSS('animation-name', 'none');
  await context.close();
});
