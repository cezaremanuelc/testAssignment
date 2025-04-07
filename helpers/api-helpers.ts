export const getIssues = async (request: any, owner: string, repo: string, headers: any) => {
    const response = await request.get(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      headers,
    });
    return response.json();
  };
  
  export const createIssue = async (request: any, owner: string, repo: string, headers: any, payload: any) => {
    const response = await request.post(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      headers,
      data: payload,
    });
    return response.json();
  };
  
  export const closeIssue = async (request: any, owner: string, repo: string, issueNumber: number, headers: any) => {
    const response = await request.patch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers,
      data: { state: 'closed' },
    });
    return response.json();
  };
  