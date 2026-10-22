const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const SUSPICIOUS_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/i,
  /ghp_[a-zA-Z0-9]{20,}/i,
  /bearer\s+[a-zA-Z0-9_\-\.]{20,}/i,
  /-----BEGIN\s+(RSA|EC|DSA|OPENSSH|PRIVATE)\s+KEY-----/i,
];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of SUSPICIOUS_PATTERNS) {
        assert.ok(
          !pattern.test(content),
          `Potential secret detected in ${path.relative(ROOT_DIR, fullPath)} matching ${pattern}`
        );
      }
    }
  }
}

test('Security Integrity: zero embedded secrets or credentials across repository', () => {
  scanDirectory(ROOT_DIR);
});
