#!/usr/bin/env node
/**
 * Builds the paste-ready cart-platform pages.
 *
 * These pages live inside cart-platform's builder, not on this Worker, so they
 * cannot use the Worker's render-time injection. They are generated instead:
 * one design system in src/pages/_base.css, inlined into each page here, so
 * the funnel and the cart cannot drift apart.
 *
 * Run: npm run build:tc
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src', 'cart', '_src');
const OUT = join(ROOT, 'src', 'cart');

const css = readFileSync(join(ROOT, 'src', 'pages', '_base.css'), 'utf8');

mkdirSync(OUT, { recursive: true });

const pages = readdirSync(SRC).filter((f) => f.endsWith('.html'));
if (!pages.length) {
  console.error('no page sources found in src/cart/_src');
  process.exit(1);
}

for (const page of pages) {
  const template = readFileSync(join(SRC, page), 'utf8');
  // Replacer FUNCTION, never a string: $$, $&, $` and $' in the CSS would
  // otherwise be treated as replacement patterns and silently mangle output.
  const html = template.replace(/\{\{BASE_CSS\}\}/g, () => css);
  const target = join(OUT, basename(page));
  writeFileSync(target, html);
  console.log(`  built  src/cart/${basename(page)}  ${(html.length / 1024).toFixed(1)} KB`);
}
console.log(`${pages.length} page(s) built. Paste each file into cart-platform as raw HTML.`);
