import { test, expect } from '@playwright/test';
import { BASE_URL_UI, BASE_URL_API, HEADERS, OWNER, REPO } from '../../config/env-config';

test.describe('GitHub UI Interaction Tests', () => {
  let issueNumber: number;

  test('Complete E2E: Login, Create, Verify, and Close Issue via GitHub UI', async ({ page, request }) => {
    // Navigate to GitHub Login Page
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
    console.log('✅ Login successful.');

    // Navigate to the Issues Page
    console.log('🔗 Navigating to the GitHub Issues page...');
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`); // Uses the environment variables
    await expect(page).toHaveURL(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`);
    console.log('✅ Issues page successfully loaded.');

    // Create a New Issue
    console.log('📝 Creating a new issue...');
    await page.locator('text=New issue').click();
    await page.waitForSelector('[placeholder="Title"]');
    await page.fill('[placeholder="Title"]', 'E2E Test Issue');
    await page.fill('[aria-label="Markdown value"]', 'This is a test issue created via Playwright.');
    await page.locator('//span[@class="prc-Button-Label-pTQ3x" and contains(text(), "Create")]').click();
    console.log('✅ Issue successfully created via UI.');

    // Verify the Issue in the List via UI
    console.log('🔍 Verifying issue in the list via UI...');
    await page.goto(`${BASE_URL_UI}/${OWNER}/${REPO}/issues`); // Navigate back to the issues list

    // Locate the span element
    console.log('🔍 Locating the first span with text "E2E Test Issue"...');
    
    
    
    // Target the first matching span
    await page.locator('//span[@class="prc-Text-Text-0ima0" and text()="E2E Test Issue"]').nth(0).click();



    console.log('🔒 Locating the "Close issue" button...');

    // Locate the "Close issue" button
    const closeIssueButton = page.locator('//span[@data-component="text" and @class="prc-Button-Label-pTQ3x" and text()="Close issue"]');
    
    // Click the button
    console.log('🔒 Clicking the "Close issue" button...');
    await closeIssueButton.click();
    

    console.log('✅ Issue successfully closed /  verified in the UI.');

    // Retrieve Issue Details via API
    console.log('🌐 Verifying issue creation via API...');
    const issuesResponse = await request.get(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, { headers: HEADERS });
    const issues = await issuesResponse.json();
    const createdIssue = issues.find((issue: { title: string }) => issue.title === 'E2E Test Issue');
    expect(createdIssue).not.toBeUndefined();
    expect(createdIssue.state).toBe('open');
    issueNumber = createdIssue.number;
    console.log(`✅ API verified issue #${issueNumber} is open.`);

    console.log('🔍 Locating the first issue row with the title "E2E Test Issue"...');


    console.log('✅ Issue successfully closed via UI.');
    // Verify Closed Issue Status via the API
    console.log('🌐 Verifying issue closure via API...');
    const closedIssueResponse = await request.get(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, { headers: HEADERS });
    const updatedIssues = await closedIssueResponse.json();
    const closedIssue = updatedIssues.find((issue: { title: string }) => issue.title === 'E2E Test Issue');
    expect(closedIssue).not.toBeUndefined();
    expect(closedIssue.state).toBe('closed');
    console.log('✅ API confirmed the issue is closed.');
  });
});
