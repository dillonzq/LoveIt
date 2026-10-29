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
  await expect(page.locator('link[href*="katex"]')).toHaveCount(1);
  await expect(page.locator('script[src*="katex"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('fixed buttons fade in after scrolling down', async ({ page }) => {
  await page.goto('/fuse/blog/guide/');
  await page.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo(0, 400); });
  await expect(page.locator('#fixed-buttons')).toHaveClass(/\banimate__fadeIn\b/);
});
