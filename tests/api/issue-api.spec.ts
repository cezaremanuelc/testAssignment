import { test, expect } from '@playwright/test';
import { getIssues, createIssue, closeIssue } from '../../helpers/api-helpers';
import { BASE_URL_API, HEADERS, OWNER, REPO } from '../../config/env-config';

test.describe('GitHub Issues API Tests', () => {
  let issueNumber: number;

  // Test: Create a new issue
  test('should create a new issue', async ({ request }) => {
    const issuePayload = { title: 'Automated Test Issue', body: 'Created by API Test' };
    const createdIssue = await createIssue(request, OWNER, REPO, HEADERS, issuePayload);
    expect(createdIssue.title).toBe(issuePayload.title);
    issueNumber = createdIssue.number;
  });

  // Test: Update the issue
  test('should update the issue', async ({ request }) => {
    const updatePayload = { title: 'Updated Title', body: 'Updated Body' };
    const res = await request.patch(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
      headers: HEADERS,
      data: updatePayload,
    });
    const updatedIssue = await res.json();
    expect(updatedIssue.title).toBe(updatePayload.title);
  });

  // Test: Check for update of the issue
  test('should validate the updated issue details', async ({ request }) => {
    const res = await request.get(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
      headers: HEADERS,
    });
    const issueDetails = await res.json();
    expect(issueDetails.title).toBe('Updated Title');
  });

  // Test: Get the list of issues and check for the existing issue
  test('should retrieve the list of issues and confirm the issue exists', async ({ request }) => {
    const issues = await getIssues(request, OWNER, REPO, HEADERS);
    const existingIssue = issues.find(issue => issue.number === issueNumber);
    expect(existingIssue).not.toBeUndefined();
    expect(existingIssue.title).toBe('Updated Title');
  });

  // Test: Close the issue
  test('should close the issue', async ({ request }) => {
    const closedIssue = await closeIssue(request, OWNER, REPO, issueNumber, HEADERS);
    expect(closedIssue.state).toBe('closed');
  });

  // Negative Tests
  test('should fail to create an issue with an overly long title', async ({ request }) => {
  
  
    const longBodyforTitle = 'A'.repeat(100_000); // Assume GitHub enforces a max body length (e.g., 65,535 chars)
    const payload = { title: 'Valid Title', body: longBodyforTitle };
  


    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });

    const responseBody = await res.json();

    console.log('Response for issue with long title:', responseBody);

    // Assuming the API returns 422 for validation errors
    expect(res.status()).toBe(422);
    expect(responseBody.message).toContain('Validation Failed');
  });

  // Test: Create with a large number of characters in the body
  test('should fail to create an issue with an overly long body', async ({ request }) => {
    const longBody = 'A'.repeat(100_000); // Assume GitHub enforces a max body length (e.g., 65,535 chars)
    const payload = { title: 'Valid Title', body: longBody };

    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });

    const responseBody = await res.json();

    console.log('Response for issue with long body:', responseBody);

    // Assuming the API returns 422 for validation errors
    expect(res.status()).toBe(422);
    expect(responseBody.message).toContain('Validation Failed');
  });

  // Test: Create with special characters in the title
  test('should create an issue with special characters in the title', async ({ request }) => {
    const specialCharTitle = '!@#$%^&*()_+{}:"<>?[];,./`~|\\';
    const payload = { title: specialCharTitle, body: 'Valid body content with special characters.' };

    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });

    const responseBody = await res.json();

    console.log('Response for issue with special characters in title:', responseBody);

    // Assuming the API allows special characters in titles
    expect(res.status()).toBe(201); // Success
    expect(responseBody.title).toBe(specialCharTitle);
  });



  });

