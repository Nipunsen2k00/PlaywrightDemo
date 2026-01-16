const { test, expect } = require('@playwright/test');

test('Landing page - Check button availability and clicking', async ({ page }) => {
  // Navigate to landing page
  await page.goto('http://kalm.lk/', { waitUntil: 'networkidle' });

  // Get all buttons on the page
  const buttons = await page.locator('button').all();
  console.log(`\n📊 Total buttons found: ${buttons.length}`);

  if (buttons.length === 0) {
    console.log('⚠️  No buttons found on landing page');
    return;
  }

  // Check each button
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const isVisible = await button.isVisible();
    const isEnabled = await button.isEnabled();
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute('aria-label');

    console.log(`\nButton ${i + 1}:`);
    console.log(`  Text: ${text?.trim() || '(no text)'}`);
    console.log(`  Aria-label: ${ariaLabel || '(none)'}`);
    console.log(`  Visible: ${isVisible}`);
    console.log(`  Enabled: ${isEnabled}`);

    // Test clicking if visible and enabled
    if (isVisible && isEnabled) {
      try {
        await button.click({ timeout: 5000 });
        console.log(`  ✓ Successfully clicked`);
      } catch (error) {
        console.log(`  ❌ Failed to click: ${error.message}`);
      }
    } else {
      console.log(`  ⚠️  Cannot click (Visible: ${isVisible}, Enabled: ${isEnabled})`);
    }
  }

  // Also check for links that look like buttons (role=button or button-like styling)
  const linkButtonsCount = await page.locator('a[role="button"]').count();

  if (linkButtonsCount > 0) {
    console.log(`\n📊 Additional link buttons found: ${linkButtonsCount}`);
  }
});

test('Landing page - Check specific button interactions', async ({ page }) => {
  await page.goto('http://kalm.lk/', { waitUntil: 'networkidle' });

  // Check for common CTA buttons
  const commonButtonSelectors = [
    'button:has-text("Submit")',
    'button:has-text("Click")',
    'button:has-text("Sign")',
    'button:has-text("Get")',
    'button:has-text("Contact")',
    'a[role="button"]',
  ];

  console.log('\n🔍 Checking for common CTA buttons:');
  
  for (const selector of commonButtonSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      console.log(`  ✓ Found ${count} button(s) matching: ${selector}`);
      
      const firstButton = page.locator(selector).first();
      const isClickable = await firstButton.isEnabled();
      console.log(`    Clickable: ${isClickable}`);
    }
  }
});
