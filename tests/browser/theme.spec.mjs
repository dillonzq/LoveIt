import { test, expect } from '@playwright/test';

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

test('mobile navigation and search survive resizing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/fuse/blog/');
  await page.locator('#menu-toggle-mobile').click();
  await expect(page.locator('#menu-mobile')).toHaveClass(/active/);
  await page.locator('#mask').click({ position: { x: 300, y: 600 } });
  await expect(page.locator('#menu-mobile')).not.toHaveClass(/active/);
  await page.locator('#menu-toggle-mobile').click();
  await page.locator('#search-input-mobile').fill('Needle');
  await expect(page.locator('#search-dropdown-mobile .suggestion-title')).toContainText('Search');
  await page.locator('#search-cancel-mobile').click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator('#search-toggle-desktop').click();
  await page.locator('#search-input-desktop').fill('Needle');
  await expect(page.locator('#search-dropdown-desktop .suggestion-title')).toContainText('Search');
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
