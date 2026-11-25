import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface CatalogEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string | null;
  github_url: string | null;
  github_repo: string | null;
  tags: string[];
  is_new: boolean;
  github: {
    full_name: string;
    stars: number | null;
    forks: number | null;
    open_issues: number | null;
    language: string | null;
    license: string | null;
    topics: string[];
    archived: boolean;
    pushed_at: string | null;
    default_branch: string | null;
    homepage: string | null;
    error: string | null;
    stars_prev: number | null;
    stars_delta: number | null;
  } | null;
}

export interface CatalogData {
  schema_version: number;
  generated_at: string;
  source: string;
  license: string;
  stats: {
    total_entries: number;
    categories: number;
    github_repos: number;
    enriched_repos: number;
    archived_repos: number;
    fetch_errors: number;
  };
  categories: string[];
  entries: CatalogEntry[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

const syncedDir = resolve(process.cwd(), 'src/synced');

export function loadCatalog(): CatalogData {
  const raw = readFileSync(resolve(syncedDir, 'catalog.json'), 'utf-8');
  return JSON.parse(raw) as CatalogData;
}

export function loadMoversMarkdown(): string {
  return readFileSync(resolve(syncedDir, 'movers.md'), 'utf-8');
}

export function loadFaqFromReadme(): FaqItem[] {
  const readme = readFileSync(resolve(syncedDir, 'readme.md'), 'utf-8');
  const faqMatch = readme.match(/## FAQ\s+([\s\S]*?)(?=\n## |\s*$)/);
  if (!faqMatch) return [];

  const blocks = faqMatch[1].split(/\n### /).slice(1);
  return blocks
    .map((block) => {
      const [firstLine, ...rest] = block.split('\n');
      const question = firstLine.trim();
      const answer = rest
        .join('\n')
        .trim()
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
        .replace(/\s+/g, ' ');
      return { question, answer };
    })
    .filter((item) => item.question && item.answer);
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatShortStars(n: number | null | undefined): string {
  if (n == null) return '';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
