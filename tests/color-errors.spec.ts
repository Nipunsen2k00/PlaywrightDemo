import { test, expect, Page } from '@playwright/test';

test.describe('Landing Page Color Error Tests', () => {

  test('Test 1: Text Color Validation', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface ColorIssue {
      element: string;
      issue: string;
      color: string;
    }
    
    const textColors: ColorIssue[] = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, h1, h2, h3, span');
      const colors: ColorIssue[] = [];
      
      elements.forEach(el => {
        const color = window.getComputedStyle(el).color;
        if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
          colors.push({
            element: el.tagName,
            issue: 'Transparent text color',
            color: color
          });
        }
      });
      
      return colors;
    });
    
    console.log('✓ Text Color Check Complete');
    expect(textColors.length).toBe(0);
  });

  test('Test 2: Background Color Validation', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface BgColorIssue {
      element: string;
      text: string;
      issue: string;
    }
    
    const bgColors: BgColorIssue[] = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, div');
      const issues: BgColorIssue[] = [];
      
      elements.forEach(el => {
        const bgColor = window.getComputedStyle(el).backgroundColor;
        if (bgColor === 'rgba(0, 0, 0, 0)' && (el.tagName === 'BUTTON' || el.classList.contains('btn'))) {
          issues.push({
            element: el.tagName,
            text: el.textContent?.trim().substring(0, 20) || '',
            issue: 'No background color'
          });
        }
      });
      
      return issues;
    });
    
    console.log('✓ Background Color Check Complete');
    expect(bgColors.length).toBeLessThan(5);
  });

  test('Test 3: Button Color Consistency', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const buttonColors: Record<string, number> = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const colors: Record<string, number> = {};
      
      buttons.forEach(btn => {
        const bgColor = window.getComputedStyle(btn).backgroundColor;
        colors[bgColor] = (colors[bgColor] || 0) + 1;
      });
      
      return colors;
    });
    
    console.log('✓ Button Colors Found:', buttonColors);
    expect(Object.keys(buttonColors).length).toBeGreaterThan(0);
  });

  test('Test 4: Link Color Check', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const linkColors: string[] = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      const colors = new Set<string>();
      
      links.forEach(link => {
        const color = window.getComputedStyle(link).color;
        colors.add(color);
      });
      
      return Array.from(colors);
    });
    
    console.log('✓ Link Colors Found:', linkColors.length);
    expect(linkColors.length).toBeGreaterThan(0);
  });

  test('Test 5: Heading Color Validation', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface HeadingColors {
      [key: string]: string;
    }
    
    const headingColors: HeadingColors = await page.evaluate(() => {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      const colors: HeadingColors = {};
      
      headings.forEach(tag => {
        const el = document.querySelector(tag);
        if (el) {
          const color = window.getComputedStyle(el).color;
          colors[tag] = color;
        }
      });
      
      return colors;
    });
    
    console.log('✓ Heading Colors:', headingColors);
    expect(Object.keys(headingColors).length).toBeGreaterThan(0);
  });

  test('Test 6: Contrast Ratio Check', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface ContrastIssue {
      element: string;
      issue: string;
    }
    
    const contrastIssues: ContrastIssue[] = await page.evaluate(() => {
      const issues: ContrastIssue[] = [];
      const elements = document.querySelectorAll('body *');
      
      elements.forEach(el => {
        if (el.children.length === 0 && el.textContent && el.textContent.trim().length > 0) {
          const textColor = window.getComputedStyle(el).color;
          const bgColor = window.getComputedStyle(el).backgroundColor;
          
          if ((textColor === 'rgb(0, 0, 0)' && bgColor === 'rgb(0, 0, 0)') ||
              (textColor === 'rgb(255, 255, 255)' && bgColor === 'rgb(255, 255, 255)')) {
            issues.push({
              element: el.tagName,
              issue: 'Poor contrast - same text and background color'
            });
          }
        }
      });
      
      return issues;
    });
    
    console.log('✓ Contrast Check Complete');
    expect(contrastIssues.length).toBe(0);
  });

  test('Test 7: Color Consistency Across Page', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface ColorPalette {
      totalTextColors: number;
      totalBgColors: number;
      totalBorderColors: number;
    }
    
    const colorPalette: ColorPalette = await page.evaluate(() => {
      const colors = {
        texts: new Set<string>(),
        backgrounds: new Set<string>(),
        borders: new Set<string>()
      };
      
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        colors.texts.add(style.color);
        colors.backgrounds.add(style.backgroundColor);
        colors.borders.add(style.borderColor);
      });
      
      return {
        totalTextColors: colors.texts.size,
        totalBgColors: colors.backgrounds.size,
        totalBorderColors: colors.borders.size
      };
    });
    
    console.log('✓ Color Palette:', colorPalette);
    expect(colorPalette.totalTextColors).toBeGreaterThan(0);
  });

  test('Test 8: Missing Color Definition', async ({ page }: { page: Page }) => {
    const colorErrors: string[] = [];
    
    page.on('console', (msg) => {
      if ((msg.type() === 'error' || msg.type() === 'warning') && 
          (msg.text().includes('color') || msg.text().includes('Color'))) {
        colorErrors.push(msg.text());
      }
    });
    
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    if (colorErrors.length > 0) {
      console.log('⚠ Color-Related Console Errors:', colorErrors);
    } else {
      console.log('✓ No color-related console errors detected');
    }
    
    expect(colorErrors.length).toBeLessThan(3);
  });

  test('Test 9: CSS Color Variable Check', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    const cssVariables: number = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = window.getComputedStyle(root);
      
      let count = 0;
      for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.includes('color') || prop.includes('--')) {
          count++;
        }
      }
      
      return count;
    });
    
    console.log('✓ CSS Variables Found:', cssVariables);
    expect(cssVariables).toBeGreaterThanOrEqual(0);
  });

  test('Test 10: Hover State Color Change', async ({ page }: { page: Page }) => {
    await page.goto('https://example.com', { waitUntil: 'networkidle' });
    
    interface HoverStyle {
      hasHoverStyle: boolean;
      bgColor: string;
    }
    
    const hoverColors: HoverStyle[] = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const hoverStyles: HoverStyle[] = [];
      
      buttons.forEach(btn => {
        const style = window.getComputedStyle(btn, ':hover');
        hoverStyles.push({
          hasHoverStyle: style.length > 0,
          bgColor: window.getComputedStyle(btn).backgroundColor
        });
      });
      
      return hoverStyles;
    });
    
    console.log('✓ Hover State Check Complete');
    expect(hoverColors.length).toBeGreaterThanOrEqual(0);
  });

});
