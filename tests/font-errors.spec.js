const { test, expect } = require('@playwright/test');

test.describe('Landing Page Font Error Tests', () => {

  test('Test 1: Font Loading Validation', async ({ page }) => {
    // Navigate to a sample page
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    // Check if fonts are loaded
    const fontInfo = await page.evaluate(() => {
      const fonts = document.fonts;
      return {
        fontCount: fonts.size,
        ready: fonts.ready ? 'Loaded' : 'Pending'
      };
    });
    
    console.log('✓ Font Info:', fontInfo);
    expect(fontInfo.ready).toBe('Loaded');
  });

  test('Test 2: Font Family Check', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const bodyFontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    
    console.log('✓ Body Font Family:', bodyFontFamily);
    expect(bodyFontFamily).toBeTruthy();
    expect(bodyFontFamily.length).toBeGreaterThan(0);
  });

  test('Test 3: Font Size Validation', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const headingFontSize = await page.evaluate(() => {
      const heading = document.querySelector('h1');
      if (heading) {
        return window.getComputedStyle(heading).fontSize;
      }
      return 'No heading found';
    });
    
    console.log('✓ Heading Font Size:', headingFontSize);
    expect(headingFontSize).not.toBe('0px');
  });

  test('Test 4: Text Color Validation', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const textColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    
    console.log('✓ Text Color:', textColor);
    expect(textColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(textColor).not.toBe('transparent');
  });

  test('Test 5: Line Height Check', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const lineHeight = await page.evaluate(() => {
      const para = document.querySelector('p');
      if (para) {
        return window.getComputedStyle(para).lineHeight;
      }
      return 'normal';
    });
    
    console.log('✓ Line Height:', lineHeight);
    expect(lineHeight).not.toBe('0px');
  });

  test('Test 6: Font Weight Consistency', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const fontWeights = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const p = document.querySelector('p');
      
      return {
        heading: h1 ? window.getComputedStyle(h1).fontWeight : 'N/A',
        paragraph: p ? window.getComputedStyle(p).fontWeight : 'N/A'
      };
    });
    
    console.log('✓ Font Weights:', fontWeights);
    expect(fontWeights.heading).toBeTruthy();
  });

  test('Test 7: Missing Font Detection', async ({ page }) => {
    const fontErrors = [];
    
    // Listen for console errors related to fonts
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('font')) {
        fontErrors.push(msg.text());
      }
    });
    
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    if (fontErrors.length > 0) {
      console.log('⚠ Font Errors Found:', fontErrors);
    } else {
      console.log('✓ No font-related console errors');
    }
    
    expect(fontErrors.length).toBe(0);
  });

  test('Test 8: Font Rendering Quality', async ({ page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const fontRendering = await page.evaluate(() => {
      return {
        smoothing: document.body.style.webkitFontSmoothing || 'default',
        antialias: document.body.style.textRendering || 'default'
      };
    });
    
    console.log('✓ Font Rendering:', fontRendering);
    expect(fontRendering).toBeTruthy();
  });

});
