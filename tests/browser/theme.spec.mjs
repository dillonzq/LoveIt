import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { getHugo } from '../../scripts/tools.mjs';

async function hugoImageFeatures() {
  const { version } = await getHugo();
  const [major, minor] = version.match(/v(\d+)\.(\d+)\./).slice(1).map(Number);
  return {
    encodesWebP: version.includes('+extended') || major > 0 || minor >= 153,
    readsPngOrientation: major > 0 || minor >= 155,
  };
}

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

test('search: pending results cannot be opened and same-page results close the dialog', async ({ page }) => {
  await page.goto('/algolia/blog/guide/');
  await page.evaluate(() => {
    window.openedSearchTabs = [];
    window.open = url => { window.openedSearchTabs.push(url); return null; };
    const pending = new Promise(resolve => { window.finishSearch = resolve; });
    window['algoliasearch/lite'] = { liteClient: () => ({ search: async ({ requests: [{ query }] }) => {
      const next = query === 'next';
      if (next) await pending;
      const uri = next ? '#final-section' : '/algolia/blog/gallery/';
      return { results: [{ hits: [{ uri, title: query, content: query }] }] };
    } }) };
  });
  const toggle = page.locator('#search-toggle-desktop');
  await toggle.click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const input = dialog.getByRole('combobox');
  const listbox = dialog.getByRole('listbox');
  const option = listbox.getByRole('option');
  const openedTabs = () => page.evaluate(() => window.openedSearchTabs);
  await input.fill('first');
  await expect(option).toContainText('first');
  await input.fill('next');
  await expect(listbox).toHaveAttribute('aria-busy', 'true');

  await option.click({ button: 'middle' });
  expect(await openedTabs()).toEqual([]);
  await option.click();
  await expect(page).toHaveURL(/\/algolia\/blog\/guide\/$/);
  for (const key of ['Control+Enter', 'Meta+Enter', 'Shift+Enter']) await input.press(key);
  await page.evaluate(() => window.finishSearch());
  await expect(option).toContainText('next');
  expect(await openedTabs()).toEqual([]);

  await input.press('Control+Enter');
  expect(await openedTabs()).toEqual([expect.stringMatching(/\/guide\/#final-section$/)]);
  await input.press('Enter');
  await expect(page).toHaveURL(/\/guide\/#final-section$/);
  await expect(dialog).toBeHidden();
  await expect(toggle).not.toBeFocused();
});

test('search: the / shortcut can be turned off when browser storage is full', async ({ page }) => {
  await page.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === 'search-slash') throw new DOMException('Storage is full', 'QuotaExceededError');
      return setItem.call(this, key, value);
    };
  });
  await page.goto('/fuse/blog/');
  const toggle = page.locator('#search-toggle-desktop');
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const checkbox = dialog.getByRole('checkbox', { name: 'Press / to open search' });
  await toggle.click();
  await checkbox.uncheck();
  await expect(checkbox).not.toBeChecked();
  await expect(toggle).toHaveAttribute('aria-keyshortcuts', 'Control+K Meta+K');
  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(dialog).toBeHidden();
  await page.keyboard.press('Control+k');
  await expect(checkbox).not.toBeChecked();
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

test('search: closing and reopening invalidates a queued Enter', async ({ page }) => {
  await page.goto('/algolia/blog/guide/');
  await page.evaluate(() => {
    window['algoliasearch/lite'] = { liteClient: () => ({ search: async ({ requests: [{ query }] }) => {
      if (query === 'old') await new Promise(resolve => { window.finishOldSearch = resolve; });
      return { results: [{ hits: [{ uri: '#final-section', title: query, content: query }] }] };
    } }) };
  });
  const toggle = page.locator('#search-toggle-desktop');
  await toggle.click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const input = dialog.getByRole('combobox');
  await input.fill('old');
  await expect.poll(() => page.evaluate(() => Boolean(window.finishOldSearch))).toBe(true);
  await input.press('Enter');
  await page.evaluate(() => {
    document.getElementById('search-dialog').close();
    document.getElementById('search-toggle-desktop').click();
    window.finishOldSearch();
  });
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('');
  await expect(page).toHaveURL(/\/guide\/$/);
  await input.fill('fresh');
  await expect(dialog.getByRole('option')).toContainText('fresh');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/guide\/#final-section$/);
});

test('mobile: search footer and last result fit above the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockAlgolia(page);
  await page.locator('#search-toggle-mobile').click();
  const dialog = page.getByRole('dialog', { name: 'Search' });
  const input = dialog.getByRole('combobox');
  const listbox = dialog.getByRole('listbox');
  await input.fill('mobile');
  const last = listbox.getByRole('option').last();
  await expect(last).toBeAttached();
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, 'height', { configurable: true, value: 220 });
    window.visualViewport.dispatchEvent(new Event('resize'));
    Object.defineProperty(window.visualViewport, 'offsetTop', { configurable: true, value: 35 });
    window.visualViewport.dispatchEvent(new Event('scroll'));
  });
  await expect(dialog).toHaveCSS('height', '220px');
  await expect(dialog).toHaveCSS('top', '35px');
  await input.press('ArrowUp');
  await expect(last).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => dialog.evaluate(el => {
    const list = el.querySelector('#search-results').getBoundingClientRect();
    const option = el.querySelector('#search-results li:last-child').getBoundingClientRect();
    const footer = el.querySelector('.search-footer').getBoundingClientRect();
    return option.top >= list.top && option.bottom <= list.bottom && footer.bottom <= 255;
  })).toBe(true);
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

test('Pele diagrams survive cached content; math, copy controls and persisted theme work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/guide/');
  await expect(page.locator('html')).toHaveCSS('font-size', '17px');
  await expect(page.locator('.single-title')).toHaveCSS('letter-spacing', '0.125px');
  await expect(page.locator('script[src*="pele.global"]')).toHaveCount(1);
  await expect(page.locator('script[src*="mermaid"]')).toHaveCount(0);
  await expect(page.locator('.mermaid svg.pele')).toBeVisible();
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.code-header .copy').first()).toBeVisible();
  const background = () => page.locator('.mermaid svg.pele').evaluate(svg => getComputedStyle(svg).getPropertyValue('--pele-bg').trim());
  expect(await background()).toBe('#fff');
  // The theme's defaults have no specificity, so site CSS for .mermaid overrides them in both themes.
  const override = await page.addStyleTag({ content: '.mermaid { --pele-bg: rgb(1, 2, 3); }' });
  expect(await background()).toBe('rgb(1, 2, 3)');
  await page.evaluate(() => document.body.setAttribute('theme', 'dark'));
  expect(await background()).toBe('rgb(1, 2, 3)');
  await page.evaluate(() => document.body.setAttribute('theme', 'light'));
  await override.evaluate(element => element.remove());
  expect(await background()).toBe('#fff');
  // Pele colors come from CSS variables: switching the theme recolors the same SVG.
  await page.locator('.mermaid svg.pele').evaluate(svg => { svg.dataset.original = ''; });
  const before = await page.locator('body').getAttribute('cfg-theme');
  // The switch cycles auto, light and dark.
  for (let i = 0; i < 3 && await page.locator('body').getAttribute('theme') !== 'dark'; i++) {
    await page.locator('#header-desktop .theme-switch').click();
  }
  const after = await page.locator('body').getAttribute('cfg-theme');
  expect(after).not.toBe(before);
  await expect(page.locator('.mermaid svg.pele[data-original]')).toHaveCount(1);
  expect(await background()).toBe('#292a2d');
  await page.reload();
  await expect(page.locator('body')).toHaveAttribute('cfg-theme', after);
  await expect(page.locator('.mermaid svg.pele')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Pele typesets math labels with KaTeX and shows syntax errors in place', async ({ page }) => {
  const errors = [];
  const consoleErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/fuse/blog/pele/');
  const diagrams = page.locator('.mermaid');
  await expect(diagrams).toHaveCount(3);
  await expect(diagrams.nth(0).locator('svg.pele')).toBeVisible();
  await expect(diagrams.nth(0).locator('svg.pele math')).toHaveCount(1);
  await expect(diagrams.nth(0)).not.toContainText('$$');
  // The space reserved for the expression matches its rendered size.
  const fit = await diagrams.nth(0).locator('svg.pele foreignObject').first().evaluate(object => ({
    reserved: Number(object.getAttribute('width')),
    rendered: object.querySelector('math').getBoundingClientRect().width / (object.getScreenCTM()?.a || 1),
  }));
  expect(Math.abs(fit.reserved - fit.rendered)).toBeLessThan(1);
  // A diagram that cannot be drawn shows the error instead and does not stop the others.
  await expect(diagrams.nth(2).locator('svg.pele')).toHaveCount(0);
  await expect(diagrams.nth(2)).not.toBeEmpty();
  expect(consoleErrors.length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('Pele offers localized zoom controls for diagrams shrunk to fit', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/fuse/blog/pele/');
  const sequence = page.locator('.mermaid').nth(1);
  await expect(sequence.locator('svg.pele-sequence')).toBeVisible();
  await expect(sequence.getByRole('button', { name: 'Zoom in' })).toHaveCount(1);
  await expect(sequence.getByRole('button', { name: 'Zoom out' })).toHaveCount(1);
  await page.goto('/fuse/blog/ar/pele/');
  await expect(page.locator('.mermaid svg.pele-sequence')).toBeVisible();
  await expect(page.locator('.mermaid').getByRole('button', { name: 'تكبير', exact: true })).toHaveCount(1);
  await expect(page.locator('.mermaid').getByRole('button', { name: 'تصغير', exact: true })).toHaveCount(1);
  // Measuring math labels must not widen a right-to-left page.
  await expect(page.locator('.mermaid svg.pele math')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

// The referrer meta tag is covered by tests/security-defaults.test.mjs; the fixture overrides head/meta.html.
test('Mermaid renderer from front matter uses securityLevel "strict" unless the config says "loose"', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fuse/blog/mermaid-renderer/');
  await expect(page.locator('script[src*="mermaid.min.js"]')).toHaveCount(1);
  await expect(page.locator('script[src*="pele"]')).toHaveCount(0);
  await expect(page.locator('.mermaid svg')).toBeVisible();
  await expect(page.locator('.mermaid svg.pele')).toHaveCount(0);
  const securityLevel = () => page.evaluate(() => mermaid.mermaidAPI.getConfig().securityLevel);
  expect(await page.evaluate(() => window.config.mermaid)).toEqual({ renderer: 'mermaid', securityLevel: 'strict' });
  expect(await securityLevel()).toBe('strict');
  // The theme switch re-initializes Mermaid from window.config.
  const rerender = async mermaidConfig => {
    await page.evaluate(value => {
      window.config.mermaid = value;
      document.querySelector('.mermaid').innerHTML = '';
    }, mermaidConfig);
    await page.locator('#header-desktop .theme-switch').click();
    await expect(page.locator('.mermaid svg')).toBeVisible();
  };
  await rerender({ renderer: 'mermaid', securityLevel: 'loose' });
  expect(await securityLevel()).toBe('loose');
  await rerender({ renderer: 'mermaid', securityLevel: 'antiscript' });
  expect(await securityLevel()).toBe('strict');
  await rerender({ renderer: 'mermaid' });
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
  const { readsPngOrientation } = await hugoImageFeatures();
  await page.goto('/fuse/blog/');
  const avatar = page.locator('.home-avatar img');
  await expect(avatar).toHaveAttribute('loading', 'eager');
  await expect(avatar).toHaveAttribute('fetchpriority', 'high');
  await expect(avatar).not.toHaveAttribute('src', /loading\.svg/);
  if (readsPngOrientation) {
    await expect(avatar).toHaveAttribute('sizes', '6rem');
    await expect(avatar).toHaveAttribute('srcset', /\.webp 480w, \S+avatar\.png 528w$/);
  } else {
    await expect(avatar).not.toHaveAttribute('srcset');
  }
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
  await expect(page.locator('.mermaid svg.pele')).toBeVisible();
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

test('fixed buttons fade in after scrolling down and the auto header hides until scrolling up', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Switch the desktop header to the "auto" mode before the theme script reads it.
  await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => document.body.setAttribute('data-header-desktop', 'auto')));
  await page.goto('/fuse/blog/guide/');
  const fixedButtons = page.locator('#fixed-buttons');
  const backToTop = page.locator('#back-to-top');
  const header = page.locator('#header-desktop');
  await expect(backToTop).toBeHidden();
  await page.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo({ top: 400, behavior: 'instant' }); });
  await expect(fixedButtons).toHaveClass(/\bis-visible\b/);
  await expect(backToTop).toBeVisible();
  await expect(backToTop).toHaveCSS('pointer-events', 'auto');
  await expect(header).toHaveClass(/\bis-hidden\b/);
  await expect(header).toHaveCSS('opacity', '0');
  await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/\bis-hidden\b/);
  await expect(header).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(fixedButtons).not.toHaveClass(/\bis-visible\b/);
  // Hidden at once for clicks, even while it fades out.
  await expect(backToTop).toHaveCSS('pointer-events', 'none');
  await expect(backToTop).toBeHidden();
  // No page loads animate.css any more; the page title animates with the theme styles.
  await expect(page.locator('link[href*="animate"]')).toHaveCount(0);
  await expect(page.locator('h1.single-title')).toHaveCSS('animation-name', /^title-/);
  expect(errors).toEqual([]);
});

test('on phones the fixed buttons hide while scrolling down and come back when scrolling up', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/fuse/blog/guide/');
  const backToTop = page.locator('#back-to-top');
  const header = page.locator('#header-mobile');
  await page.evaluate(() => { document.body.style.minHeight = '3000px'; window.scrollTo({ top: 400, behavior: 'instant' }); });
  await expect(header).toHaveClass(/\bis-hidden\b/);
  await expect(backToTop).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: 'instant' }));
  await expect(header).not.toHaveClass(/\bis-hidden\b/);
  await expect(backToTop).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await expect(backToTop).toBeHidden();
  await context.close();
});

test('lightGallery opens linked images with thumbnails, zoom and SVG icons', async ({ page }) => {
  const { encodesWebP } = await hugoImageFeatures();
  const errors = [];
  const missing = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) missing.push(response.url()); });
  await page.goto('/fuse/blog/gallery/');
  // The image shortcode without alt uses its src.
  const avatar = page.locator('#content img').nth(1);
  await expect(avatar).toHaveAttribute('alt', await avatar.getAttribute('src'));
  await expect(avatar).toHaveAttribute('alt', /\/images\/avatar\.png$/);
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
  // The first thumbnail uses the smallest available copy. The second sets its own (src_s).
  const firstThumbnail = encodesWebP ? /Wavelength_hu_\w+\.webp$/ : /Wavelength\.jpg$/;
  await expect(page.locator('.lg-thumb-item img').first()).toHaveAttribute('src', firstThumbnail);
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
  const { encodesWebP, readsPngOrientation } = await hugoImageFeatures();
  await page.goto('/fuse/blog/image-processing/');
  await expect(page.locator('script[src*="lazysizes"], img.lazyload, img[data-src]')).toHaveCount(0);
  const images = page.locator('#content img');
  // Exif orientation 6: the 600x400 JPEG is shown 400x600, and its WebP copy is rotated to match.
  const rotated = images.nth(0);
  await expect(rotated).toHaveAttribute('src', /\/image-processing\/rotated\.jpg$/);
  await expect(rotated).toHaveAttribute('width', '400');
  await expect(rotated).toHaveAttribute('height', '600');
  if (encodesWebP) {
    await expect(rotated).toHaveAttribute('srcset', /^\S+\.webp 400w$/);
    await expect(rotated).toHaveAttribute('sizes', /100vw/);
  } else {
    await expect(rotated).not.toHaveAttribute('srcset');
    await expect(rotated).not.toHaveAttribute('sizes');
  }
  await expect(rotated).toHaveAttribute('loading', 'lazy');
  await expect(rotated).toHaveAttribute('decoding', 'async');
  await rotated.scrollIntoViewIfNeeded();
  // naturalWidth follows the density that sizes gives the candidate, so compare the aspect ratio.
  await expect.poll(() => rotated.evaluate(img => img.complete && [img.currentSrc.endsWith('.webp'), Math.round(img.naturalHeight / img.naturalWidth * 10) / 10]))
    .toEqual([encodesWebP, 1.5]);
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
  const png = images.nth(4);
  const [pngWidth, pngHeight] = readsPngOrientation ? ['40', '60'] : ['60', '40'];
  await expect(png).toHaveAttribute('width', pngWidth);
  await expect(png).toHaveAttribute('height', pngHeight);
  await png.scrollIntoViewIfNeeded();
  if (encodesWebP && readsPngOrientation) {
    await expect(png).toHaveAttribute('srcset', new RegExp(`^\\S+\\.webp ${pngWidth}w$`));
    await expect.poll(() => png.evaluate(img => img.complete && [img.currentSrc.endsWith('.webp'), Math.round(img.naturalHeight / img.naturalWidth * 10) / 10]))
      .toEqual([true, 1.5]);
  } else {
    await expect(png).not.toHaveAttribute('srcset');
    await expect.poll(() => png.evaluate(img => img.currentSrc.endsWith('/oriented.png') && img.naturalWidth > 0)).toBe(true);
    await expect.poll(() => png.evaluate(img => img.naturalHeight / img.naturalWidth)).toBeCloseTo(1.5);
  }
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

  const truncated = page.getByAltText('Truncated JPEG', { exact: true });
  await expect(truncated).toHaveAttribute('src', /\/image-processing\/truncated\.jpg$/);
  await expect(truncated).toHaveAttribute('width', '120');
  await expect(truncated).not.toHaveAttribute('height');
  await expect(truncated).not.toHaveAttribute('srcset');

  const paddedApng = page.locator('#content img[title="APNG with metadata"]');
  await expect(paddedApng).toHaveAttribute('src', /\/image-processing\/animated-metadata\.png$/);
  await expect(paddedApng).toHaveAttribute('width', '60');
  await expect(paddedApng).toHaveAttribute('height', '40');
  await expect(paddedApng).not.toHaveAttribute('srcset');

  // The description of a Markdown image is its alt text, without markup or escapes, and an empty one stays empty.
  await expect(images.nth(2)).toHaveAttribute('alt', 'Static');
  await expect(images.nth(3)).toHaveAttribute('alt', 'Remote');
  const styled = page.getByAltText('A styled alt & text', { exact: true });
  await expect(styled).toHaveAttribute('src', /\/image-processing\/rotated\.jpg$/);
  await expect(styled).toHaveAttribute('title', 'A styled alt & text');
  const captioned = page.locator('#content figure').filter({ hasText: 'The caption' });
  await expect(captioned.locator('img')).toHaveAttribute('alt', 'Captioned alt');
  await expect(captioned.locator('a.lightgallery')).toHaveAttribute('title', 'Captioned alt');
  const escaped = page.locator('#content figure').filter({ hasText: 'Escaped' });
  await expect(escaped.locator('img')).toHaveAttribute('alt', 'Cost *extra* & fees');
  await expect(escaped.locator('a.lightgallery')).toHaveAttribute('title', 'Cost *extra* & fees');
  const decorative = page.locator('#content p > img[alt=""]');
  await expect(decorative).toHaveCount(1);
  await expect(decorative).toHaveAttribute('src', /\/image-processing\/rotated\.jpg$/);
  await expect(decorative).not.toHaveAttribute('title');
  // A decorative image with a caption keeps its empty alt; the caption names the link to the gallery.
  const decorativeLink = page.getByRole('link', { name: 'Decorative caption', exact: true });
  await expect(decorativeLink.locator('img')).toHaveAttribute('alt', '');
  // A nested image gives its own alt text, as CommonMark does.
  await expect(page.getByAltText('Outer inner label', { exact: true })).toHaveAttribute('title', 'Outer inner label');
  await expect(page.getByAltText('See logo.', { exact: true })).toHaveAttribute('title', 'See logo.');
  await expect(page.locator('#content img[alt$=".jpg"], #content img[alt$=".png"], #content img[alt$=".webp"]')).toHaveCount(0);

  // The bundle's featured image is the first-screen image: loaded at once with a high priority.
  const featured = page.locator('.featured-image img');
  await expect(featured).toHaveAttribute('src', /\/image-processing\/featured-image\.jpg$/);
  await expect(featured).toHaveAttribute('fetchpriority', 'high');
  await expect(featured).toHaveAttribute('loading', 'eager');
  await expect(featured).not.toHaveAttribute('decoding');
  await expect(featured).toHaveAttribute('width', '600');
  await expect(featured).toHaveAttribute('height', '400');
  await expect.poll(() => featured.evaluate(img => img.offsetWidth === img.parentElement.clientWidth)).toBe(true);
  if (encodesWebP) {
    await expect(featured).toHaveAttribute('srcset', /^\S+\.webp 600w$/);
  } else {
    await expect(featured).not.toHaveAttribute('srcset');
  }
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
  await expect(fixedButtons).toHaveClass(/\bis-visible\b/);
  expect(parseFloat(await fixedButtons.evaluate(element => getComputedStyle(element).transitionDuration))).toBeLessThan(0.01);
  await reduced.goto('/fuse/blog/guide/');
  await expect(reduced.locator('h1.single-title')).toHaveCSS('animation-name', 'none');
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
    const copy = block.getByRole('button', { name: 'Copy to clipboard' });
    await copy.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(text);
    await expect(block).toHaveClass(/\bcopied\b/);
    await expect(block.getByRole('status')).toHaveText('Copy to clipboard: Success');
  }
  await expect(blocks.first()).not.toHaveClass(/\bcopied\b/, { timeout: 5_000 });
  await expect(page.locator('script[src*="clipboard"]')).toHaveCount(0);
  expect(errors).toEqual([]);
  await context.close();
});

test('keyboard users can expand a collapsed code block and copy it', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  await page.goto('/fuse/blog/code-collapsed/');
  const block = page.locator('.code-block');
  const toggle = block.getByRole('button', { name: 'Bash' });
  const copy = block.getByRole('button', { name: 'Copy to clipboard' });
  const code = block.locator('.highlight pre');
  const arrow = toggle.locator('.arrow');
  await expect(block).not.toHaveClass(/\bopen\b/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(copy).toBeHidden();
  await expect(code).toBeHidden();
  await toggle.focus();
  await page.keyboard.press('Tab');
  await expect(code).not.toBeFocused();

  await page.locator('html').evaluate(element => { element.dir = 'rtl'; });
  await expect(arrow).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(block).toHaveClass(/\bopen\b/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(code).toBeVisible();
  await expect(arrow).toHaveCSS('transform', 'matrix(0, 1, -1, 0, 0, 0)');
  await page.keyboard.press('Tab');
  await expect(copy).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('echo one\necho two\necho three');
  await context.close();
});

test('copy buttons fall back to execCommand and leave the code selected when copying fails', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    window.copied = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) } });
    document.execCommand = command => {
      if (command !== 'copy' || window.failCopy) return false;
      window.copied.push(document.activeElement.value);
      return true;
    };
  });
  await page.goto('/fuse/blog/code-blocks/');
  const block = page.locator('.code-block').first();
  await block.locator('.copy').click();
  await expect(block).toHaveClass(/\bcopied\b/);
  expect(await page.evaluate(() => window.copied)).toEqual(['echo one\n  echo two\necho three']);
  // The hidden textarea used for the fallback is removed again.
  await expect(page.locator('body > textarea')).toHaveCount(0);

  await page.evaluate(() => { window.failCopy = true; });
  await block.locator('.copy').click();
  await expect(block).toHaveClass(/\bcopy-failed\b/);
  await expect(block).not.toHaveClass(/\bcopied\b/);
  await expect(block.getByRole('status')).toHaveText('Copy to clipboard: Failure');
  expect(await page.evaluate(() => window.getSelection().toString().trim())).toContain('echo three');
  await expect(block.locator('.copy')).toHaveCSS('color', 'rgb(198, 40, 40)');
  expect(errors).toEqual([]);
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
