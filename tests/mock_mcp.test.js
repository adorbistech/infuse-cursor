const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const CANONICAL_TOOLS = [
  'infuse_execute',
  'infuse_get_execution',
  'infuse_get_execution_state',
  'infuse_get_execution_result',
  'infuse_list_executions',
  'infuse_list_events',
  'infuse_publish_event',
  'infuse_get_policy',
  'infuse_list_policies',
  'infuse_update_policy',
  'infuse_get_governor_decision',
  'infuse_control',
];

test('MCP Protocol: mock server handshake and 12-tool discovery', async () => {
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      if (payload.method === 'initialize') {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'mcp-session-id': 'cursor-mock-session-123',
        });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: payload.id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: 'infuse',
                version: '1.30.0',
              },
              capabilities: { tools: {} },
            },
          })
        );
      } else if (payload.method === 'notifications/initialized') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      } else if (payload.method === 'tools/list') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            id: payload.id,
            result: {
              tools: CANONICAL_TOOLS.map((name) => ({
                name,
                description: `Canonical INFUSE tool: ${name}`,
                inputSchema: { type: 'object' },
              })),
            },
          })
        );
      } else {
        res.writeHead(400);
        res.end();
      }
    });
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const mockUrl = `http://127.0.0.1:${port}/mcp`;

  try {
    // 1. Initialize
    const initRes = await fetch(mockUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'cursor-client', version: '0.1.0' },
        },
      }),
    });
    assert.equal(initRes.status, 200);
    const initData = await initRes.json();
    assert.equal(initData.result.protocolVersion, '2024-11-05');
    assert.equal(initData.result.serverInfo.name, 'infuse');

    const sessionId = initRes.headers.get('mcp-session-id');
    assert.equal(sessionId, 'cursor-mock-session-123');

    // 2. Initialized notification
    const notifyRes = await fetch(mockUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mcp-session-id': sessionId,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }),
    });
    assert.equal(notifyRes.status, 200);

    // 3. Tools list
    const toolsRes = await fetch(mockUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mcp-session-id': sessionId,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
      }),
    });
    assert.equal(toolsRes.status, 200);
    const toolsData = await toolsRes.json();
    assert.equal(toolsData.result.tools.length, 12);
    const toolNames = toolsData.result.tools.map((t) => t.name);
    assert.deepEqual(toolNames, CANONICAL_TOOLS);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('MCP Protocol: mock server handles error responses cleanly', async () => {
  const server = http.createServer((_req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const mockUrl = `http://127.0.0.1:${port}/mcp`;

  try {
    const res = await fetch(mockUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
      }),
    });
    assert.equal(res.status, 500);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
