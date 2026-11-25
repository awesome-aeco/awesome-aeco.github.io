import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const localSource = process.env.AWESOME_AECO_LOCAL_DIR
  ? resolve(process.env.AWESOME_AECO_LOCAL_DIR)
  : resolve(rootDir, '../Awesome-AECO');

const remoteBase =
  process.env.AWESOME_AECO_RAW_BASE ||
  'https://raw.githubusercontent.com/awesome-aeco/Awesome-AECO/main';

const filesToSync = [
  { src: 'data/catalog.json', dest: ['src/synced/catalog.json', 'public/data/catalog.json'] },
  { src: 'data/movers.md', dest: ['src/synced/movers.md'] },
  { src: 'readme.md', dest: ['src/synced/readme.md'] },
  { src: 'TRADEMARK.md', dest: ['src/synced/TRADEMARK.md'] },
  { src: 'brand/icon.svg', dest: ['public/brand/icon.svg'] },
  { src: 'brand/icon.png', dest: ['public/brand/icon.png'] },
  { src: 'brand/logo-light.svg', dest: ['public/brand/logo-light.svg'] },
  { src: 'brand/logo-dark.svg', dest: ['public/brand/logo-dark.svg'] },
  { src: 'brand/og-card.svg', dest: ['public/brand/og-card.svg'] },
  { src: 'brand/og-card.png', dest: ['public/brand/og-card.png'] },
  { src: 'brand/badges/featured.svg', dest: ['public/brand/badges/featured.svg'] },
  { src: 'brand/badges/verified.svg', dest: ['public/brand/badges/verified.svg'] },
  { src: 'brand/badges/partner.svg', dest: ['public/brand/badges/partner.svg'] },
  { src: 'badges/featured-in-awesome-aeco.svg', dest: ['public/badges/featured-in-awesome-aeco.svg'] },
];

const useLocal = !process.env.CI && existsSync(join(localSource, 'data/catalog.json'));
console.log(
  useLocal
    ? `[sync] Copying Awesome-AECO assets from local sibling: ${localSource}`
    : `[sync] Fetching Awesome-AECO assets from ${remoteBase}`
);

for (const item of filesToSync) {
  let buffer = null;
  const localPath = join(localSource, item.src);

  if (useLocal && existsSync(localPath)) {
    for (const relDest of item.dest) {
      const fullDest = join(rootDir, relDest);
      mkdirSync(dirname(fullDest), { recursive: true });
      copyFileSync(localPath, fullDest);
    }
    continue;
  }

  const url = `${remoteBase}/${item.src}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  buffer = Buffer.from(await res.arrayBuffer());

  for (const relDest of item.dest) {
    const fullDest = join(rootDir, relDest);
    mkdirSync(dirname(fullDest), { recursive: true });
    writeFileSync(fullDest, buffer);
  }
}

console.log(`[sync] Synced ${filesToSync.length} source files.`);
