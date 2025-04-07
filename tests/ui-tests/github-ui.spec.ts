import { test, expect } from '@playwright/test';
import { locators } from '../../locators/github-locators';
import { BASE_URL_UI, OWNER, REPO } from '../../config/env-config';

test.describe('GitHub UI Tests', () => {
  test('should create and close an issue via the GitHub UI', async ({ page }) => {
    // Navigate to GitHub and log in
    await page.goto(`${BASE_URL_UI}/login`);

    // Reject cookies
    const rejectButton = page.locator('button:has-text("Reject")');
    if (await rejectButton.isVisible()) {
      await rejectButton.click();
    }

    await page.fill(locators.loginField, 'emanuelnospam');
    await page.fill(locators.passwordField, 'testPass88*');
    await page.click(locators.submitButton);

    // Navigate to issues page
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);

    // Create a new issue
    await page.locator(locators.newIssueButton).click();
    await page.fill(locators.titleInput, 'Test Issue Title');
    await page.fill(locators.markdownInput, 'Test Issue Body');
    await page.locator(locators.createButton).click();

    // Close the issue
    await page.click(locators.closeIssueButton);
    await page.waitForSelector(locators.reopenIssueButton);

    console.log('Issue successfully created and closed.');
  });
});
