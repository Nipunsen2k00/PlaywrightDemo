const { test, expect } = require('@playwright/test');

test('Landing page - Check for errors', async ({ page }) => {
  const errors = [];
  const warnings = [];

  // Listen for console messages
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });

  // Listen for page errors
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });

  // Navigate to landing page
  await page.goto('http://kalm.lk/', { waitUntil: 'networkidle' });

  // Log any errors or warnings found
  if (errors.length > 0) {
    console.log('❌ Console Errors Found:');
    errors.forEach((error) => console.log(`  - ${error}`));
  } else {
    console.log('✓ No console errors detected');
  }

  if (warnings.length > 0) {
    console.log('⚠ Console Warnings Found:');
    warnings.forEach((warning) => console.log(`  - ${warning}`));
  }

  // Check page title exists
  const title = await page.title();
  console.log(`Page Title: ${title}`);
  await expect(title.length).toBeGreaterThan(0);

  // Check page is accessible
  const statusCode = page.url();
  console.log(`✓ Page loaded successfully at: ${statusCode}`);

  // Fail test if there are errors
  expect(errors).toEqual([]);
});

test('Check UI Colors on Landing Page', async ({ page }) => {
  await page.goto('http://kalm.lk/', { waitUntil: 'networkidle' });

  const colorIssues = [];

  // Check background colors
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log(`Body Background Color: ${bodyBg}`);

  // Check all text elements for color definition
  const textColors = await page.evaluate(() => {
    const elements = document.querySelectorAll('body *');
    const colorMap = {};
    
    elements.forEach((el) => {
      const color = window.getComputedStyle(el).color;
      const bgColor = window.getComputedStyle(el).backgroundColor;
      
      // Check for invalid colors (transparent, rgba(0,0,0,0), etc)
      if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
        colorMap[el.tagName + (el.className ? '.' + el.className : '')] = {
          issue: 'Transparent text color detected',
          color: color
        };
      }
      
      // Check buttons and important elements have colors
      if ((el.tagName === 'BUTTON' || el.classList.contains('btn')) && bgColor === 'rgba(0, 0, 0, 0)') {
        colorMap['Button: ' + el.textContent.trim()] = {
          issue: 'Button has no background color',
          bgColor: bgColor
        };
      }
    });
    
    return colorMap;
  });

  // Log color issues found
  if (Object.keys(textColors).length > 0) {
    console.log('❌ UI Color Issues Found:');
    Object.entries(textColors).forEach(([element, issue]) => {
      console.log(`  ${element}: ${JSON.stringify(issue)}`);
      colorIssues.push(issue.issue);
    });
  } else {
    console.log('✓ No obvious color issues detected');
  }

  // Check for missing or broken CSS
  const cssInfo = await page.evaluate(() => {
    const sheets = document.styleSheets;
    const cssStatus = [];
    
    for (let sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        cssStatus.push(`CSS loaded: ${sheet.href || 'inline'} (${rules.length} rules)`);
      } catch (e) {
        cssStatus.push(`CSS Error: ${sheet.href || 'inline'} - ${e.message}`);
      }
    }
    return cssStatus;
  });

  console.log('\nCSS Status:');
  cssInfo.forEach(info => console.log(`  ${info}`));

  // Take screenshot to visually inspect colors
  await page.screenshot({ path: 'landing-page-colors.png' });
  console.log('\n✓ Screenshot saved: landing-page-colors.png');

  // Fail if critical color issues found
  expect(colorIssues.length).toBe(0);
});

test('Check Font Style Errors on Landing Page', async ({ page }) => {
  await page.goto('http://kalm.lk/', { waitUntil: 'networkidle' });

  const fontIssues = [];

  // Check font loading and style issues
  const fontInfo = await page.evaluate(() => {
    const fontData = {
      loadedFonts: [],
      fontFamilies: {},
      fontSizes: {},
      fontWeights: {},
      issues: []
    };

    // Get all elements with text
    const elements = document.querySelectorAll('body *');
    const uniqueFonts = new Set();

    elements.forEach((el) => {
      if (el.children.length === 0 && el.textContent.trim().length > 0) {
        const style = window.getComputedStyle(el);
        
        // Collect font families
        const fontFamily = style.fontFamily;
        if (fontFamily) uniqueFonts.add(fontFamily);
        
        // Check for issues
        if (!fontFamily || fontFamily === 'inherit') {
          fontData.issues.push(`Element missing font-family: ${el.tagName}`);
        }

        // Check font size
        const fontSize = style.fontSize;
        if (!fontSize || fontSize === '0px') {
          fontData.issues.push(`Element has invalid font-size: ${el.tagName} (${fontSize})`);
        }

        // Check font weight
        const fontWeight = style.fontWeight;
        if (!fontWeight || fontWeight === 'normal' || fontWeight === '400') {
          // Normal is ok, but log for verification
        }

        // Check line-height
        const lineHeight = style.lineHeight;
        if (lineHeight === '0px') {
          fontData.issues.push(`Element has zero line-height: ${el.tagName}`);
        }

        // Log font data
        const key = `${fontFamily}`;
        fontData.fontFamilies[key] = (fontData.fontFamilies[key] || 0) + 1;
        fontData.fontSizes[fontSize] = (fontData.fontSizes[fontSize] || 0) + 1;
        fontData.fontWeights[fontWeight] = (fontData.fontWeights[fontWeight] || 0) + 1;
      }
    });

    // Check @font-face rules
    const sheets = document.styleSheets;
    for (let sheet of sheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let rule of rules) {
          if (rule.type === 5) { // FONT_FACE_RULE
            fontData.loadedFonts.push(rule.style.fontFamily);
          }
        }
      } catch (e) {
        // CORS restricted
      }
    }

    return fontData;
  });

  console.log('\n📝 Font Analysis:');
  
  // Report loaded fonts
  if (fontInfo.loadedFonts.length > 0) {
    console.log('✓ Loaded @font-face fonts:');
    fontInfo.loadedFonts.forEach(font => console.log(`  - ${font}`));
  } else {
    console.log('ℹ No custom @font-face fonts detected (using system fonts)');
  }

  // Report font families used
  console.log('\nFont families used:');
  Object.entries(fontInfo.fontFamilies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([font, count]) => console.log(`  ${font}: ${count} elements`));

  // Report font sizes
  console.log('\nFont sizes used:');
  Object.entries(fontInfo.fontSizes)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .slice(0, 10)
    .forEach(([size, count]) => console.log(`  ${size}: ${count} elements`));

  // Report issues
  if (fontInfo.issues.length > 0) {
    console.log('\n❌ Font Style Issues Found:');
    fontInfo.issues.forEach(issue => console.log(`  - ${issue}`));
    fontIssues.push(...fontInfo.issues);
  } else {
    console.log('\n✓ No font style issues detected');
  }

  // Take screenshot for visual inspection
  await page.screenshot({ path: 'landing-page-fonts.png' });
  console.log('\n✓ Screenshot saved: landing-page-fonts.png');

  expect(fontIssues.length).toBe(0);
});

test('Menu links work', async ({ page }) => {
  await page.goto('http://kalm.lk/');

  await page.click('text=About');
  await expect(page).toHaveURL(/about/i);

  await page.click('text=Contact');
  await expect(page).toHaveURL(/contact/i);
});
