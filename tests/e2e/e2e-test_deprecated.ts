import { test, expect } from '@playwright/test';
import { BASE_URL_UI, BASE_URL_API, HEADERS, OWNER, REPO } from '../../config/env-config';
import { isAwaitKeyword } from 'typescript';
import { randomBytes } from 'crypto';


let randomTitle: string;

let issueNumber: number;
test.describe('GitHub UI Interaction Tests', () => {
  test.beforeAll(() => {
    // Initialize randomTitle before tests
    randomTitle = `${Math.random().toString(36).substring(2, 15)}`;
    console.log('Generated Random Title:', randomTitle);
  });



  test('Complete E2E: Login, Create, Verify, and Close Issue via GitHub UI', async ({ page }) => {
    console.log('Generated Random Title:', randomTitle);

    await page.goto(`${BASE_URL_UI}/login`);

    // Reject cookies (if the banner is visible)
    const rejectButton = page.locator('button:has-text("Reject")');
    if (await rejectButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rejectButton.click();
      console.log('🛑 Rejected cookies.');
    } else {
      console.log('👍 No cookie banner or Reject button visible.');
    }

    // Log in to GitHub
    console.log('🔐 Logging in...');
    await page.fill('#login_field', 'emanuelnospam'); // Replace with actual username
    await page.fill('#password', 'testPass88*'); // Replace with actual password
    await page.click('input[type="submit"]');
    await page.waitForNavigation();
    await expect(page).toHaveURL('https://github.com/');

    // Assert specific text is present on the page
    await expect(page.locator('body')).toContainText('Top repositories');
    await expect(page.locator('body')).toContainText('Home');
    await expect(page.locator('body')).toContainText('© 2025 GitHub, Inc.');
    await expect(page.locator('body')).toContainText('Footer navigation');
    await expect(page.locator('body')).toContainText('Terms');
    await expect(page.locator('body')).toContainText('Privacy');
    await expect(page.locator('body')).toContainText('Security');
    await expect(page.locator('body')).toContainText('Status');
    await expect(page.locator('body')).toContainText('Docs');
    await expect(page.locator('body')).toContainText('Contact');
    await expect(page.locator('body')).toContainText('Manage cookies');
    await expect(page.locator('body')).toContainText('Do not share my personal information');


    console.log('✅ Login successful.');

    // Navigate to the Issues Page
    console.log('🔗 Navigating to the GitHub Issues page...');
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`); // Uses the environment variables
    await expect(page).toHaveURL(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);
    console.log('✅ Issues page successfully loaded.');

    await expect(page.locator('body')).toContainText('Code');
    await expect(page.locator('body')).toContainText('Issues');
    await expect(page.locator('body')).toContainText('Pull requests');
    await expect(page.locator('body')).toContainText('Discussions');
    await expect(page.locator('body')).toContainText('Actions');
    await expect(page.locator('body')).toContainText('Projects');
    await expect(page.locator('body')).toContainText('Wiki');
    await expect(page.locator('body')).toContainText('Security');
    await expect(page.locator('body')).toContainText('Insights');
    await expect(page.locator('body')).toContainText('Settings');

    // Create a New Issue
    console.log('📝 Creating a new issue...');

    await page.locator('text=New issue').click();

    //page validations
    await expect(page.locator('body')).toContainText('Code');
    await expect(page.locator('body')).toContainText('Issues');
    await expect(page.locator('body')).toContainText('Pull requests');
    await expect(page.locator('body')).toContainText('Discussions');
    await expect(page.locator('body')).toContainText('Actions');
    await expect(page.locator('body')).toContainText('Projects');
    await expect(page.locator('body')).toContainText('Wiki');
    await expect(page.locator('body')).toContainText('Security');
    await expect(page.locator('body')).toContainText('Insights');
    await expect(page.locator('body')).toContainText('Settings');

    await expect(page.locator('body')).toContainText('Create new issue');
    await expect(page.locator('body')).toContainText('Add a title');

    await expect(page.locator('body')).toContainText('Add a description');
    await expect(page.locator('body')).toContainText('Markdown input: edit mode selected.');
    await expect(page.locator('body')).toContainText('Write');
    await expect(page.locator('body')).toContainText('Preview');

    await expect(page.locator('body')).toContainText('Metadata');
    await expect(page.locator('body')).toContainText('Assignees');

    await expect(page.locator('body')).toContainText('Labels');
    await expect(page.locator('body')).toContainText('No labels');
    await expect(page.locator('body')).toContainText('Type');
    await expect(page.locator('body')).toContainText('No type');
    await expect(page.locator('body')).toContainText('Projects');
    await expect(page.locator('body')).toContainText('No projects');
    await expect(page.locator('body')).toContainText('Milestone');
    await expect(page.locator('body')).toContainText('No milestone');
    await expect(page.locator('body')).toContainText('Create more');

    await expect(page.locator('body')).toContainText('Footer navigation');
    await expect(page.locator('body')).toContainText('Terms');
    await expect(page.locator('body')).toContainText('Privacy');



    await expect(page.locator('body')).toContainText('Contact');
    await expect(page.locator('body')).toContainText('Manage cookies');
    await expect(page.locator('body')).toContainText('Do not share my personal information');
    await expect(page.locator('body')).toContainText('New Issue');


    console.log('✅ All specified text is present on the page.');



    await page.waitForSelector('[placeholder="Title"]');
    await page.fill('[placeholder="Title"]', randomTitle);
    await page.fill('[aria-label="Markdown value"]', 'This is a test issue created via Playwright.');
    await page.locator('//span[@class="prc-Button-Label-pTQ3x" and contains(text(), "Create")]').click();
    console.log('✅ Issue successfully created via UI.');

    // Verify the Issue in the List via UI
    console.log('🔍 Verifying issue in the list via UI...');
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`); // Navigate back to the issues list

    // Locate the span element
    console.log('🔍 Locating the first span with text "E2E Test Issue"...');

    // Target the first matching span

    // Locate the input field by its unique ID
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

    // Locate the "Close issue" button
    const closeIssueButton = page.locator('//span[@data-component="text" and @class="prc-Button-Label-pTQ3x" and text()="Close issue"]');

    // Click the button
    console.log('🔒 Clicking the "Close issue" button...');
    await closeIssueButton.click();
    console.log('✅ Issue successfully closed /  verified in the UI.');

    // Retrieve Issue Details via API - to be fixed

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
