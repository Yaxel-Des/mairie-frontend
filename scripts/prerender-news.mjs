import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');
const template = readFileSync(resolve(outputDirectory, 'index.html'), 'utf8');
const articles = JSON.parse(readFileSync(resolve(projectRoot, 'src/data/news.json'), 'utf8'));
const origin = 'https://www.mairie-bingerville.ci';
const imageUrl = `${origin}/images/actualite-placeholder.svg`;

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

for (const article of articles) {
  const title = `${article.title} | Mairie de Bingerville`;
  const url = `${origin}/actualites/${article.id}`;
  const metadata = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(article.summary)}" />`,
    '<meta property="og:type" content="article" />',
    `<meta property="og:title" content="${escapeHtml(article.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(article.summary)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${imageUrl}" />`,
    '<meta property="og:image:alt" content="Illustration de la Mairie de Bingerville" />',
  ].join('\n    ');
  const pageHtml = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace('</head>', `    ${metadata}\n  </head>`);
  const pageDirectory = resolve(outputDirectory, 'actualites', String(article.id));
  mkdirSync(pageDirectory, { recursive: true });
  writeFileSync(resolve(pageDirectory, 'index.html'), pageHtml);
}
