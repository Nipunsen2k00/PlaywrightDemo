const { test, expect } = require('@playwright/test');

test.describe('Simple Demonstration Tests', () => {
  
  test('Test 1: String comparison', async () => {
    const text = 'Playwright Testing';
    expect(text).toContain('Playwright');
    console.log('✓ Test 1 Passed: String contains expected text');
  });

  test('Test 2: Number operations', async () => {
    const result = 5 + 5;
    expect(result).toBe(10);
    console.log('✓ Test 2 Passed: Math calculation is correct');
  });

  test('Test 3: Array validation', async () => {
    const items = ['apple', 'banana', 'orange'];
    expect(items).toContain('banana');
    expect(items.length).toBe(3);
    console.log('✓ Test 3 Passed: Array contains expected items');
  });

  test('Test 4: Boolean logic', async () => {
    const isValid = true;
    expect(isValid).toBeTruthy();
    console.log('✓ Test 4 Passed: Boolean validation successful');
  });

  test('Test 5: Object validation', async () => {
    const user = {
      name: 'Nipun',
      role: 'QA',
      active: true
    };
    expect(user.name).toBe('Nipun');
    expect(user.role).toBe('QA');
    expect(user.active).toBeTruthy();
    console.log('✓ Test 5 Passed: Object properties validated');
  });

  test('Test 6: API-like test with local data', async () => {
    const mockData = {
      status: 200,
      message: 'Success',
      data: [1, 2, 3, 4, 5]
    };
    
    expect(mockData.status).toBe(200);
    expect(mockData.message).toBe('Success');
    expect(mockData.data.length).toBe(5);
    console.log('✓ Test 6 Passed: Mock API response validated');
  });

  test('Test 7: String formatting validation', async () => {
    const email = 'test@example.com';
    const isValidEmail = email.includes('@') && email.includes('.');
    expect(isValidEmail).toBeTruthy();
    console.log('✓ Test 7 Passed: Email format is valid');
  });

  test('Test 8: Array operations', async () => {
    const numbers = [1, 2, 3, 4, 5];
    const filtered = numbers.filter(n => n > 2);
    expect(filtered).toEqual([3, 4, 5]);
    console.log('✓ Test 8 Passed: Array filtering works correctly');
  });

});
