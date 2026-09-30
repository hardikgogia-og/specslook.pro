import fs from 'fs';
import path from 'path';
import { renderFranchiseHtml } from '../src/server/franchisePrerender.ts';

function prerender() {
  const distDir = path.join(process.cwd(), 'dist');
  const distHtmlPath = path.join(distDir, 'index.html');
  const franchiseDir = path.join(distDir, 'franchise');
  const franchiseHtmlPath = path.join(franchiseDir, 'index.html');

  if (!fs.existsSync(distHtmlPath)) {
    console.warn('dist/index.html not found, skipping static franchise prerender');
    return;
  }

  const baseHtml = fs.readFileSync(distHtmlPath, 'utf8');
  const franchiseHtml = renderFranchiseHtml(baseHtml);

  if (!fs.existsSync(franchiseDir)) {
    fs.mkdirSync(franchiseDir, { recursive: true });
  }

  fs.writeFileSync(franchiseHtmlPath, franchiseHtml, 'utf8');
  console.log('✅ Generated static dist/franchise/index.html for AI & Google Search indexing');
}

prerender();
