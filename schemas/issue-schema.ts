export const issueSchema = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      node_id: { type: 'string' },
      avatar_url: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      state: { type: 'string', enum: ['open', 'closed'] },
      title: { type: 'string' },
      body: { type: ['string', 'null'] },
      // Add remaining properties...
    },
    required: ['id', 'node_id', 'state', 'title', 'created_at', 'updated_at', 'user'],
  };
  