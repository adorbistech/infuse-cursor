const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

test('Plugin Manifest: .cursor-plugin/plugin.json exists and is valid', () => {
  const manifestPath = path.join(ROOT_DIR, '.cursor-plugin', 'plugin.json');
  assert.ok(fs.existsSync(manifestPath), '.cursor-plugin/plugin.json must exist');

  const content = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  assert.equal(manifest.name, 'infuse');
  assert.equal(manifest.version, '0.1.0');
  assert.ok(manifest.description, 'description must be present');
  assert.equal(typeof manifest.description, 'string');
  assert.ok(manifest.author && manifest.author.name === 'Adorbis', 'author must be Adorbis');
  assert.equal(manifest.license, 'Apache-2.0');
  assert.equal(manifest.repository, 'https://github.com/adorbistech/infuse-cursor');
  assert.equal(manifest.homepage, 'https://infuse.adorbistech.com');
});
