import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AI Project Builder/);
});

test('chat interface loads', async ({ page }) => {
  await page.goto('/');
  
  // Check for the main chat input
  await expect(page.getByPlaceholder(/Send a message/i)).toBeVisible();
});
