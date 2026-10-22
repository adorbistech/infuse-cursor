const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

test('MCP Config: mcp.json exists and defines canonical remote endpoint', () => {
  const mcpPath = path.join(ROOT_DIR, 'mcp.json');
  assert.ok(fs.existsSync(mcpPath), 'mcp.json must exist');

  const content = fs.readFileSync(mcpPath, 'utf8');
  const config = JSON.parse(content);

  assert.ok(config.mcpServers, 'mcpServers section must exist');
  assert.ok(config.mcpServers.infuse, 'infuse server definition must exist');

  const infuseServer = config.mcpServers.infuse;
  assert.ok(infuseServer.url, 'server URL must be defined');
  assert.equal(typeof infuseServer.url, 'string');
  assert.ok(/^https:\/\//i.test(infuseServer.url), 'MCP URL must use encrypted HTTPS transport');
  assert.equal(infuseServer.url, 'https://infuse-api.adorbistech.com/mcp');
});
