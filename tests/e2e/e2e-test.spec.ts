import { test, expect } from '@playwright/test';
import { PageValidations } from '../../factories/PageValidations';
import { BASE_URL_UI, BASE_URL_API, HEADERS, OWNER, REPO, GITHUB_USERNAME, GITHUB_PASSWORD } from '../../config/env-config';

let randomTitle: string;

test.describe('GitHub E2E Tests', () => {
  test.beforeAll(() => {
    randomTitle = `${Math.random().toString(36).substring(2, 15)}`;
    console.log('Generated Random Title:', randomTitle);
  });

  test('E2E: Login, Create, Verify, and Close Issue via UI', async ({ page }) => {
    const validations = new PageValidations(page);

    // Navigate to login page
    await page.goto(`${BASE_URL_UI}/login`);

    // Log in
    await page.fill('#login_field', GITHUB_USERNAME);
    await page.fill('#password', GITHUB_PASSWORD);
    await page.click('input[type="submit"]');
    await page.waitForNavigation();
    await expect(page).toHaveURL('https://github.com/');
    console.log('✅ Login successful.');

    // Validate login page
    await validations.validateLoginPage();

    // Navigate to issues page
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);
    await expect(page).toHaveURL(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);
    console.log('✅ Issues page loaded successfully.');

    // Validate issues page
    await validations.validateIssuesPage();

    // Create a new issue
    await page.locator('text=New issue').click();
    await validations.validateNewIssuePage();
    
    
    await page.fill('[placeholder="Title"]', randomTitle);
    await page.fill('[aria-label="Markdown value"]', 'This is a test issue created via Playwright.');
    await page.locator('//span[contains(text(), "Create")]').click();
    console.log('✅ Issue created successfully.');

    // Verify the issue is created
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);
    


    const inputField = page.locator('input#repository-input');

    // Click the input field to focus
    console.log('🔍 Clicking the input field...');
    await inputField.click();

    // Clear the input field
    console.log('🧹 Clearing the input field...');

    await inputField.clear();
    await inputField.fill(randomTitle);
    await inputField.press('Enter');

    for (let i = 0; i < 5; i++) { // Try up to 5 times
      await page.reload();
      if (await page.locator(`//span[@class="prc-Text-Text-0ima0" and text()="${randomTitle}"]`).first().isVisible()) {
        console.log('✅ Element found!');
        await page.locator(`//span[@class="prc-Text-Text-0ima0" and text()="${randomTitle}"]`).nth(0).click();
        break;
      }
      console.log('❌ Element not found. Retrying...');
    }

    console.log('🔒 Locating the "Close issue" button...');
    
    await expect(page.locator(`//span[text()="${randomTitle}"]`).first()).toBeVisible();
    console.log('✅ Issue verified successfully.');

    // Close the issue
    const closeIssueButton = page.locator('//span[contains(text(), "Close issue")]');
    await closeIssueButton.click();
    console.log('✅ Issue closed successfully.');
  });
 test('API validations ->', async ({ page, request }) => {
    console.log('🔍 Using randomTitle in second test:', randomTitle)

    console.log('🌐 Verifying issue creation via API...')
    const issuesResponse = await request.get(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, { headers: HEADERS });
    const issues = await issuesResponse.json();
    console.log('')


    // Verify Closed Issue Status via the API

    console.log('🌐 Verifying issue closure via API...');

    console.log('🔍 Sending GET request to fetch updated list of issues...');


    console.log('🔍 Fetching closed issues from the GitHub repository...');
    const closedIssueResponse = await request.get(
      `${BASE_URL_API}/repos/${OWNER}/${REPO}/issues?state=closed`,
      { headers: HEADERS }
    );

    console.log('✅ Received response from API. Status:', closedIssueResponse.status());
    const closedIssues = await closedIssueResponse.json();

    console.log('🔎 Closed issues retrieved:', closedIssues);

    // Find the specific issue by its title
    const closedIssue = closedIssues.find((issue: { title: string }) => issue.title === randomTitle);

    console.log(closedIssue)

    if (closedIssue) {
      console.log(`✅ Issue with title "${randomTitle}" found in closed issues.`);
      console.log('Issue details:', closedIssue);
      expect(closedIssue.state).toBe('closed');
    } else {
      console.log(`❌ Issue with title "${randomTitle}" not found in closed issues.`);
      throw new Error(`Issue with title "${randomTitle}" not found in closed issues.`);
    }



  });
});