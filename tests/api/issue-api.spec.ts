import { test, expect } from '@playwright/test';
import { getIssues, createIssue, closeIssue } from '../../helpers/api-helpers';
import { BASE_URL_API, HEADERS, OWNER, REPO } from '../../config/env-config';

test.describe('GitHub Issues API Tests', () => {
  let issueNumber: number;

  // Test: Create a new issue
  test('should create a new issue', async ({ request }) => {
    const issuePayload = { title: 'Automated Test Issue', body: 'Created by API Test' };

    console.log('Creating a new issue with payload:', issuePayload);

    const createdIssue = await createIssue(request, OWNER, REPO, HEADERS, issuePayload);

    console.log('API Response for issue creation:', createdIssue);

    expect(createdIssue.title).toBe(issuePayload.title);
    issueNumber = createdIssue.number;

    console.log('Created issue number:', issueNumber);
  });

  // Test: Update the issue
  test('should update the issue', async ({ request }) => {
    const updatePayload = { title: 'Updated Title', body: 'Updated Body' };

    console.log('Updating the issue with payload:', updatePayload);

    const res = await request.patch(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
      headers: HEADERS,
      data: updatePayload,
    });
    const updatedIssue = await res.json();

    console.log('API Response for issue update:', updatedIssue);

    expect(updatedIssue.title).toBe(updatePayload.title);
  });

  // Test: Validate the updated issue details
  test('should validate the updated issue details', async ({ request }) => {
    console.log('Fetching updated issue details for issue number:', issueNumber);

    const res = await request.get(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues/${issueNumber}`, {
      headers: HEADERS,
    });
    const issueDetails = await res.json();

    console.log('API Response for issue details:', issueDetails);

    expect(issueDetails.title).toBe('Updated Title');
  });

  // Test: Retrieve list of issues and confirm the issue exists
  test('should retrieve the list of issues and confirm the issue exists', async ({ request }) => {
    console.log('Fetching list of issues from repository:', `${OWNER}/${REPO}`);

    const issues = await getIssues(request, OWNER, REPO, HEADERS);

    console.log('API Response for issues list:', issues);

    const existingIssue = issues.find(issue => issue.number === issueNumber);

    console.log('Existing issue found in list:', existingIssue);

    expect(existingIssue).not.toBeUndefined();
    expect(existingIssue.title).toBe('Updated Title');
  });

  // Test: Close the issue
  test('should close the issue', async ({ request }) => {
    console.log('Closing issue number:', issueNumber);

    const closedIssue = await closeIssue(request, OWNER, REPO, issueNumber, HEADERS);

    console.log('API Response for closing issue:', closedIssue);

    expect(closedIssue.state).toBe('closed');
  });

  // Negative Tests
  test('should fail to create an issue with an overly long title', async ({ request }) => {
    const longBodyForTitle = 'A'.repeat(100_000); // Assume GitHub enforces a max body length
    const payload = { title: 'Valid Title', body: longBodyForTitle };

    console.log('Creating an issue with an overly long body:', payload);

    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });
    const responseBody = await res.json();

    console.log('API Response for long body issue:', responseBody);

    expect(res.status()).toBe(422); // Assuming the API returns 422 for validation errors
    expect(responseBody.message).toContain('Validation Failed');
  });

  test('should fail to create an issue with an overly long body', async ({ request }) => {
    const longBody = 'A'.repeat(100_000); // Assume GitHub enforces a max body length
    const payload = { title: 'Valid Title', body: longBody };

    console.log('Creating an issue with an overly long body:', payload);

    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });
    const responseBody = await res.json();

    console.log('API Response for long body issue:', responseBody);

    expect(res.status()).toBe(422); // Assuming the API returns 422 for validation errors
    expect(responseBody.message).toContain('Validation Failed');
  });

  test('should create an issue with special characters in the title', async ({ request }) => {
    const specialCharTitle = '!@#$%^&*()_+{}:"<>?[];,./`~|\\';
    const payload = { title: specialCharTitle, body: 'Valid body content with special characters.' };

    console.log('Creating an issue with special characters in title:', payload);

    const res = await request.post(`${BASE_URL_API}/repos/${OWNER}/${REPO}/issues`, {
      headers: HEADERS,
      data: payload,
    });
    const responseBody = await res.json();

    console.log('API Response for special characters issue:', responseBody);

    expect(res.status()).toBe(201); // Assuming success response
    expect(responseBody.title).toBe(specialCharTitle);
  });
});
