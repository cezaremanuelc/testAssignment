import * as dotenv from 'dotenv';

dotenv.config();

export const BASE_URL_UI = 'https://github.com';
export const BASE_URL_API = 'https://api.github.com';
export const HEADERS = {
  accept: 'application/vnd.github+json',
  authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  'X-GitHub-Api-Version': '2022-11-28',
};

export const OWNER = process.env.REPO_OWNER!;
export const REPO = process.env.REPO_NAME!;
export const GITHUB_URL = process.env.REPO_NAME!;
