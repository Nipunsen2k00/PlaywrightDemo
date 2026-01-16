const { test, expect } = require('@playwright/test');

test('Register page - Check for console errors and warnings', async ({ page }) => {
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

  // Navigate to register page
  await page.goto('http://kalm.lk/register', { waitUntil: 'networkidle' });

  // Log any errors found
  if (errors.length > 0) {
    console.log('\n❌ Console Errors Found:');
    errors.forEach((error) => console.log(`  - ${error}`));
  } else {
    console.log('✓ No console errors detected');
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Console Warnings Found:');
    warnings.forEach((warning) => console.log(`  - ${warning}`));
  } else {
    console.log('✓ No console warnings detected');
  }

  // Check page title
  const title = await page.title();
  console.log(`\nPage Title: ${title}`);
  await expect(title.length).toBeGreaterThan(0);

  // Check page loaded
  console.log(`✓ Page loaded successfully at: ${page.url()}`);

  // Fail test if there are errors
  expect(errors).toEqual([]);
});

test('Register page - Check form fields and validation', async ({ page }) => {
  await page.goto('http://kalm.lk/register', { waitUntil: 'networkidle' });

  console.log('\n📋 Checking form fields on register page:');

  // Check for form
  const form = await page.locator('form').first();
  const formExists = await form.count().catch(() => 0);

  if (formExists === 0) {
    console.log('⚠️  No form found on register page');
    return;
  }

  console.log('✓ Form found');

  // Get all input fields
  const inputs = await page.locator('input').all();
  console.log(`\n📊 Total input fields found: ${inputs.length}`);

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    const required = await input.getAttribute('required');
    const name = await input.getAttribute('name');

    console.log(`\nInput ${i + 1}:`);
    console.log(`  Type: ${type || 'text'}`);
    console.log(`  Name: ${name || '(no name)'}`);
    console.log(`  Placeholder: ${placeholder || '(none)'}`);
    console.log(`  Required: ${required !== null}`);
  }

  // Get all buttons in form
  const buttons = await page.locator('button').all();
  console.log(`\n🔘 Total buttons found: ${buttons.length}`);

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = await button.textContent();
    const disabled = await button.getAttribute('disabled');
    const type = await button.getAttribute('type');

    console.log(`\nButton ${i + 1}:`);
    console.log(`  Text: ${text?.trim()}`);
    console.log(`  Type: ${type || 'button'}`);
    console.log(`  Disabled: ${disabled !== null}`);
  }
});

test('Register page - Check accessibility', async ({ page }) => {
  await page.goto('http://kalm.lk/register', { waitUntil: 'networkidle' });

  console.log('\n♿ Checking accessibility on register page:');

  // Check for labels
  const labels = await page.locator('label').count();
  console.log(`Labels found: ${labels}`);

  // Check for required fields without labels
  const inputsWithoutLabel = await page.locator('input:not([id])').count();
  if (inputsWithoutLabel > 0) {
    console.log(`⚠️  Warning: ${inputsWithoutLabel} input(s) without associated labels`);
  }

  // Check for proper heading hierarchy
  const h1 = await page.locator('h1').count();
  const h2 = await page.locator('h2').count();
  console.log(`\nHeading structure:`);
  console.log(`  H1: ${h1}`);
  console.log(`  H2: ${h2}`);

  // Check for alt text on images
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  if (imagesWithoutAlt > 0) {
    console.log(`⚠️  Warning: ${imagesWithoutAlt} image(s) without alt text`);
  } else {
    console.log('✓ All images have alt text');
  }

  // Check for proper ARIA labels
  const ariaLabeledElements = await page.locator('[aria-label]').count();
  console.log(`Elements with ARIA labels: ${ariaLabeledElements}`);
});

test('Register page - Test form submission', async ({ page }) => {
  await page.goto('http://kalm.lk/register', { waitUntil: 'networkidle' });

  console.log('\n📝 Testing form submission:');

  // Try to submit empty form
  const submitButton = await page.locator('button[type="submit"]').first();
  const submitButtonExists = await submitButton.count().catch(() => 0);

  if (submitButtonExists === 0) {
    console.log('⚠️  No submit button found');
    return;
  }

  console.log('✓ Submit button found');

  // Try to click submit and check for validation errors
  try {
    await submitButton.click({ timeout: 3000 });
    
    // Wait a bit for validation
    await page.waitForTimeout(500);

    // Check for error messages
    const errorMessages = await page.locator('[role="alert"], .error, .validation-error, [class*="error"]').count();
    
    if (errorMessages > 0) {
      console.log(`✓ Validation errors shown: ${errorMessages} error message(s)`);
    } else {
      console.log('⚠️  No validation errors shown on empty form submission');
    }
  } catch (error) {
    console.log(`Error during form submission test: ${error.message}`);
  }
});
