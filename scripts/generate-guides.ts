import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toolsSchema } from '../src/lib/tools-schema.ts';
import { toolImagesSchema } from '../src/lib/tool-images-schema.ts';

const tools = toolsSchema.parse(JSON.parse(readFileSync(new URL('../src/data/tools.json', import.meta.url), 'utf8')));
const images = toolImagesSchema.parse(JSON.parse(readFileSync(new URL('../src/data/tool-images.json', import.meta.url), 'utf8')));
const imagesById = new Map(images.map((image) => [image.id, image]));
const output = fileURLToPath(new URL('../src/content/docs/tools/handheld/guides', import.meta.url));
mkdirSync(output, { recursive: true });
type Product = { name: string; specs: Record<string, string>; buy?: { label: string; url: string }[] };

const products: Record<string, Product> = {
  'dewalt-dcd771': { name: '20V MAX Compact Drill/Driver Kit', specs: { Motor: 'Brushed', Chuck: '1/2 in. ratcheting', Speeds: '0–450 / 0–1,500 RPM', Clutch: '16 positions', Platform: '20V MAX' } },
  'dewalt-dcd794': { name: 'ATOMIC 20V MAX Brushless Compact Drill/Driver', specs: { Motor: 'Brushless', Chuck: '1/2 in.', Speed: 'Variable, 2-speed', Platform: '20V MAX', Series: 'ATOMIC Compact' } },
  'dewalt-dcf887': { name: '20V MAX XR 3-Speed Impact Driver', specs: { Drive: '1/4 in. hex', 'Speed settings': '3', 'Maximum speed': '3,250 RPM', 'Maximum torque': '1,825 in-lb', Platform: '20V MAX' } },
  'dewalt-dcf403': { name: '20V MAX XR 3/16-Inch Rivet Tool', specs: { Capacity: 'Up to 3/16 in. rivets', Stroke: '1.18 in.', 'Pulling force': '2,100 lbf', Motor: 'Brushless', Platform: '20V MAX' } },
  'mellif-mfdb001': { name: 'Cordless Workshop Blower', specs: { Model: 'MFDB001', Power: 'DeWalt 20V MAX-compatible battery', Manufacturer: 'Mellif' } },
  'dewalt-dcs369': { name: 'ATOMIC 20V MAX One-Handed Reciprocating Saw', specs: { Stroke: '5/8 in.', 'Maximum speed': '2,800 SPM', 'Blade clamp': 'Tool-free', Motor: 'Brushless', Platform: '20V MAX' } },
  'mellif-mf0401y': { name: 'Cordless Hot-Glue Gun', specs: { Model: 'MF0401Y', Power: 'DeWalt 20V MAX-compatible battery', Manufacturer: 'Mellif' } },
  'dewalt-dcw210': { name: '20V MAX XR 5-Inch Random-Orbit Sander', specs: { Pad: '5 in. hook-and-loop', Speed: '8,000–12,000 OPM', Orbit: '3/32 in.', Motor: 'Brushless', Platform: '20V MAX' } },
  'dewalt-dce530': { name: '20V MAX Cordless Heat Gun', specs: { Temperatures: 'High: 990°F / Low: 550°F', Airflow: '6.7 CFM', Trigger: 'Lock-on / lock-off', Platform: '20V MAX' } },
  'dewalt-dcg416': { name: '20V MAX XR 4-1/2–5-Inch Angle Grinder', specs: { Wheel: '4-1/2 to 5 in.', 'No-load speed': '9,000 RPM', Switch: 'Paddle', Motor: 'Brushless', Platform: '20V MAX / FLEXVOLT Advantage' } },
  'dewalt-dcf680': { name: '8V MAX Gyroscopic Inline Screwdriver Kit', specs: { Drive: '1/4 in. hex', Speed: '0–430 RPM', Clutch: '15 positions', Grip: 'Inline or pistol', Platform: '8V MAX' } },
  'dremel-8250': { name: '8250 12V Brushless Cordless Rotary Tool Kit', specs: { Speed: '5,000–30,000 RPM', Battery: '12V MAX, 3.0 Ah', Collet: '1/32–1/8 in.', Motor: 'Brushless', 'Accessory system': 'EZ Twist nose cap' } },
  'bauer-1678e-b': { name: '10-Amp Deep-Cut Variable-Speed Band Saw', specs: { Motor: '10 amp', Capacity: '5 × 5 in.', Speed: 'Variable', Blade: '44-7/8 × 1/2 in.', Power: '120V corded' } },
  'drill-master-62340': { name: '1,500-Watt Dual-Temperature Heat Gun', specs: { Power: '1,500 W / 120V corded', Temperatures: '572°F / 1,112°F', Model: '62340' } },
  'arrow-t50acn': { name: 'T50ACN Electric Staple Gun and Nailer', specs: { Staples: 'T50, 1/4–9/16 in.', Brad: '5/8 in.', Power: '120V corded', Mechanism: 'Spiral drive' } },
  'bosch-js260': { name: 'JS260 6-Amp Top-Handle Jig Saw', specs: { Motor: '6.0 amp', Speed: '500–3,100 SPM', Stroke: '3/4 in.', Blade: 'T-shank', 'Bevel range': 'Up to 45°' } },
  'dewalt-dcv581h': { name: '20V MAX Cordless/Corded 2-Gallon Wet/Dry Vacuum', specs: { Capacity: '2 gal.', Power: '20V MAX battery or AC', Hose: '5 ft., 1-1/4 in.', Filter: 'HEPA-rated, washable/reusable' } },
  'dewalt-dwe5010': { name: '1/2-Inch Single-Speed Hammer Drill', specs: { Chuck: '1/2 in. keyed', Motor: '7.0 amp', Speed: '0–2,800 RPM', 'Impact rate': '0–47,600 BPM', Power: '120V corded' } },
  'pd204-work-light': { name: 'PD204 Battery-Compatible Work Light', specs: { Model: 'PD204', Brand: 'Unknown', Power: 'DeWalt 20V MAX-compatible battery' } },
  'dremel-8240': { name: '8240 12V High-Performance Cordless Rotary Tool Kit', specs: { Speed: '5,000–35,000 RPM', Battery: '12V MAX, 2.0 Ah', Motor: 'Brushed', 'Accessory system': 'EZ Twist nose cap', Compatibility: 'All Dremel rotary attachments' } }
};

const yaml = (value: string) => JSON.stringify(value);
const html = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character);
for (const tool of tools) {
  const product = products[tool.id];
  if (!product) throw new Error(`Missing product details for ${tool.id}`);
  const image = imagesById.get(tool.id);
  if (!image) throw new Error(`Missing image details for ${tool.id}`);
  const imageTag = `<img src="${image.path}" alt=${yaml(image.alt)} loading="eager" decoding="async" />`;
  const imageMarkup = image.verification === 'exact'
    ? `<figure class="tool-media"><a href="${image.sourcePageUrl}">${imageTag}</a><figcaption>Image: ${image.sourceLabel}</figcaption></figure>`
    : `<figure class="tool-media tool-media--needed">${imageTag}<figcaption>Photo needed · ${tool.brand} ${tool.model}</figcaption></figure>`;
  const links = [
    tool.manufacturerUrl && { label: 'Product page', url: tool.manufacturerUrl },
    tool.manualUrl && { label: 'Manual', url: tool.manualUrl },
    ...(product.buy ?? [])
  ].filter((link): link is { label: string; url: string } => Boolean(link));
  const linkMarkup = links.length > 0
    ? `<nav class="tool-actions" aria-label="Product resources">${links.map((link) => `<a href="${link.url}">${html(link.label)}</a>`).join('')}</nav>`
    : '';
  const inventoryNote = tool.notes ? `<p class="tool-inventory-note"><span>Inventory note</span>${html(tool.notes)}</p>` : '';
  const specs = Object.entries(product.specs).map(([key, value]) => `| ${key} | ${value} |`).join('\n');
  writeFileSync(`${output}/${tool.id}.md`, `---
title: ${yaml(product.name)}
description: ${yaml(`${product.name}. ${tool.brand} ${tool.model}.`)}
sidebar:
  label: ${yaml(product.name)}
---

<div class="tool-overview">
  ${imageMarkup}
  <div class="tool-details">
    <dl class="tool-facts">
      <div><dt>Brand</dt><dd>${html(tool.brand)}</dd></div>
      <div><dt>Model</dt><dd>${html(tool.model)}</dd></div>
      <div><dt>Category</dt><dd>${html(tool.category)}</dd></div>
      <div><dt>Quantity</dt><dd>${tool.quantity}</dd></div>
      <div><dt>Location</dt><dd>${html(tool.team.location ?? 'Not recorded')}</dd></div>
    </dl>
    ${inventoryNote}
    ${linkMarkup}
  </div>
</div>

## Key specifications

| Specification | Value |
| --- | --- |
${specs}
`);
}
console.log(`Generated ${tools.length} concise tool pages.`);
