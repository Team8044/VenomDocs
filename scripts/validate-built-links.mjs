import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = '/VenomDocs';
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (extname(path) === '.html') htmlFiles.push(path);
  }
}

walk(root);
const failures = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const href = match[1];
    if (!href?.startsWith('/')) continue;
    if (!href.startsWith(`${base}/`) && href !== base) {
      failures.push(`${relative(root, file)}: link escapes base path: ${href}`);
      continue;
    }
    const pathname = href.slice(base.length).replace(/^\//, '');
    const target = pathname === '' ? join(root, 'index.html') : pathname.endsWith('/') ? join(root, pathname, 'index.html') : join(root, pathname);
    if (!existsSync(target)) failures.push(`${relative(root, file)}: missing target ${href}`);
  }
}

if (failures.length) throw new Error(`Broken internal links:\n${failures.slice(0, 30).join('\n')}`);
console.log(`Validated internal links across ${htmlFiles.length} HTML files.`);
