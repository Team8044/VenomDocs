import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toolsSchema } from '../src/lib/tools-schema.ts';
import { toolImagesSchema } from '../src/lib/tool-images-schema.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const tools = toolsSchema.parse(JSON.parse(readFileSync(new URL('../src/data/tools.json', import.meta.url), 'utf8')));
const images = toolImagesSchema.parse(JSON.parse(readFileSync(new URL('../src/data/tool-images.json', import.meta.url), 'utf8')));
const imagesById = new Map(images.map((image) => [image.id, image]));
if (imagesById.size !== images.length) throw new Error('Duplicate ids in tool image manifest');
if (images.length !== tools.length) throw new Error(`Expected ${tools.length} image records, found ${images.length}`);
const ids = new Set<string>();
const guides = new Set<string>();

for (const tool of tools) {
  if (ids.has(tool.id)) throw new Error(`Duplicate tool id: ${tool.id}`);
  if (guides.has(tool.guide)) throw new Error(`Duplicate guide route: ${tool.guide}`);
  ids.add(tool.id);
  guides.add(tool.guide);
  const relativeGuide = `src/content/docs${tool.guide.replace(/\/$/, '.md')}`;
  if (!existsSync(`${root}/${relativeGuide}`)) throw new Error(`Missing guide for ${tool.id}: ${relativeGuide}`);
  const guideContent = readFileSync(`${root}/${relativeGuide}`, 'utf8');
  const image = imagesById.get(tool.id);
  if (!image) throw new Error(`Missing image record for ${tool.id}`);
  if (!image.alt.toLowerCase().includes(tool.model.toLowerCase())) throw new Error(`Image alt text for ${tool.id} must include ${tool.model}`);
  if (!existsSync(`${root}/public${image.path}`)) throw new Error(`Missing local image for ${tool.id}: ${image.path}`);
  if (image.verification === 'exact' && (!image.imageSourceUrl || !image.sourcePageUrl || !image.sourceLabel)) {
    throw new Error(`Exact image for ${tool.id} is missing provenance`);
  }
  if (image.verification === 'photo-needed' && image.imageSourceUrl !== null) throw new Error(`Placeholder for ${tool.id} must be marked photo-needed`);
  if (!guideContent.includes(`src="${image.path}"`)) throw new Error(`Guide for ${tool.id} does not reference its local image`);
  for (const required of ['class="tool-overview"', 'class="tool-media', 'class="tool-details"', 'class="tool-facts"', '## Key specifications']) {
    if (!guideContent.includes(required)) throw new Error(`${tool.id} is missing product-header content: ${required}`);
  }
  for (const removed of ['class="tool-image', 'class="tool-meta"', '## Team inventory', '## Product links']) {
    if (guideContent.includes(removed)) throw new Error(`${tool.id} contains obsolete tool-page layout: ${removed}`);
  }
  if ((guideContent.match(/<dt>Quantity<\/dt>/g) ?? []).length !== 1) throw new Error(`${tool.id} must display quantity exactly once`);
  if (image.verification === 'exact' && !guideContent.includes(`<a href="${image.sourcePageUrl}"><img`)) throw new Error(`${tool.id} exact image must link to its source page`);
  if (image.verification === 'photo-needed' && guideContent.includes(`class="tool-media tool-media--needed"><a`)) throw new Error(`${tool.id} placeholder must not be linked`);
  for (const phrase of ['Required PPE', 'Principal hazards', 'Pre-use inspection', 'Cleanup, storage', 'Team verification needed', 'Inventory provenance']) {
    if (guideContent.includes(phrase)) throw new Error(`${tool.id} contains removed boilerplate: ${phrase}`);
  }
  if (guideContent.includes(`title: "${tool.brand} ${tool.model}"`)) throw new Error(`${tool.id} still uses brand + model as its title`);
}

for (const image of images) {
  if (!ids.has(image.id)) throw new Error(`Image record has no matching tool: ${image.id}`);
}

const total = tools.reduce((sum, tool) => sum + tool.quantity, 0);
if (tools.length !== 20) throw new Error(`Expected 20 unique models, found ${tools.length}`);
if (total !== 25) throw new Error(`Expected 25 total tools from the source sheet, found ${total}`);
const dcd794 = tools.filter((tool) => tool.model === 'DCD794');
if (dcd794.length !== 1 || dcd794[0]?.quantity !== 3) throw new Error('DCD794 must appear once with quantity 3');
if (existsSync(`${root}/src/content/docs/safety/handheld-power-tools.md`)) throw new Error('Removed safety page still exists');

const homepage = readFileSync(`${root}/src/content/docs/index.mdx`, 'utf8');
for (const phrase of ['A living shop manual', 'Start here', 'Browse handheld tools', 'designed to', 'Product resources', 'Take the Tour', 'Safety First', 'tagline:', 'actions:']) {
  if (homepage.includes(phrase)) throw new Error(`Homepage contains removed landing-page copy: ${phrase}`);
}
for (const required of ['template: splash', 'hero:', 'title: Venom Docs', '## Shop & Fabrication', 'Handheld Power Tools', '20 models · 25 tools', '/tools/handheld/']) {
  if (!homepage.includes(required)) throw new Error(`Homepage is missing required directory content: ${required}`);
}
for (const emptyGroup of ['## Technical', '## Team Operations']) {
  if (homepage.includes(emptyGroup)) throw new Error(`Homepage contains an empty future group: ${emptyGroup}`);
}
const catalog = readFileSync(`${root}/src/content/docs/tools/handheld/index.mdx`, 'utf8');
for (const phrase of ['initial catalog', 'How to use this catalog', 'Choose the guide']) {
  if (catalog.includes(phrase)) throw new Error(`Catalog contains removed explanatory copy: ${phrase}`);
}

console.log(`Validated ${tools.length} unique models and ${total} total tools.`);
