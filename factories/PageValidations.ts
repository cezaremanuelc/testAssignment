import { Page, expect } from '@playwright/test';

export class PageValidations {
  constructor(private page: Page) {}

  async validateLoginPage(): Promise<void> {
    const expectedTexts = [
      'Top repositories',
      'Home',
      '© 2025 GitHub, Inc.',
      'Footer navigation',
      'Terms',
      'Privacy',
      'Security',
      'Status',
      'Docs',
      'Contact',
      'Manage cookies',
      'Do not share my personal information',
    ];

    for (const text of expectedTexts) {
      await expect(this.page.locator('body')).toContainText(text);
    }
    console.log('✅ Login page validated successfully.');
  }

  async validateIssuesPage(): Promise<void> {
    const expectedTexts = [
      'Code',
      'Issues',
      'Pull requests',
      'Discussions',
      'Actions',
      'Projects',
      'Wiki',
      'Security',
      'Insights',
      'Settings',
    ];

    for (const text of expectedTexts) {
      await expect(this.page.locator('body')).toContainText(text);
    }
    console.log('✅ Issues page validated successfully.');
  }

  async validateNewIssuePage(): Promise<void> {
    const expectedTexts = [
      'Create new issue',
      'Add a title',
      'Add a description',
      'Markdown input: edit mode selected.',
      'Write',
      'Preview',
      'Metadata',
      'Assignees',
      'Labels',
      'No labels',
      'Type',
      'No type',
      'Projects',
      'No projects',
      'Milestone',
      'No milestone',
      'Create more',
    ];

    for (const text of expectedTexts) {
      await expect(this.page.locator('body')).toContainText(text);
    }
    console.log('✅ New issue page validated successfully.');
  }
}
