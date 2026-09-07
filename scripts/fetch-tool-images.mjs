import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const tools = JSON.parse(readFileSync(`${root}/src/data/tools.json`, 'utf8'));
const outputDir = `${root}/public/images/tools`;
const manifestPath = `${root}/src/data/tool-images.json`;
mkdirSync(outputDir, { recursive: true });

const sourceLabels = { DeWalt: 'DeWalt', Dremel: 'Dremel', Arrow: 'Arrow Fastener', Bosch: 'Bosch' };

// Deliberately curated by exact model. Never add a compatible or successor tool here.
const verifiedImages = {
  'dewalt-dcd771': {
    imageSourceUrl: 'https://in.dewalt.global/ASIA/PRODUCT/IMAGES/HIRES/DCD771S2-IN/DCD771S2_2.jpg?resize=530x530',
    sourcePageUrl: 'https://in.dewalt.global/product/dcd771s2/18v-compact-drill-driver',
    sourceLabel: 'DeWalt'
  },
  'dewalt-dcd794': {
    imageSourceUrl: 'https://media.s-bol.com/4o1V2OgD0pkJ/BgL9V3x/550x711.jpg',
    sourcePageUrl: 'https://www.bol.com/nl/nl/p/dewalt-accu-boorschroefmachine-dcd794d2t-18v-geel-zwart-inclusief-2x-2-0ah-li-ion-xr-accu-s-tstak-koffer/9300000230128269/',
    sourceLabel: 'bol'
  },
  'dewalt-dcf887': {
    imageSourceUrl: 'https://toolmart.me/cdn/shop/files/e6d2a2ed-487e-472e-96fb-0ac2f28ad63e.webp?v=1750326135',
    sourcePageUrl: 'https://toolmart.me/en/products/dewalt-dcf887-18v-xr-cordless-impact-driver',
    sourceLabel: 'ToolMart'
  },
  'dewalt-dcf403': {
    imageSourceUrl: 'https://www.mytoolshed.co.uk/artwork/prodzoom/DEW-DeWalt-DCF403-18V-XR-Cordless-Brushless-Riveter-Gun.jpg?h=1000&q=80&w=1000',
    sourcePageUrl: 'https://www.mytoolshed.co.uk/dewalt-dcf403-18v-xr-cordless-brushless-riveter-gun/prod/661458/',
    sourceLabel: 'MyToolShed'
  },
  'dewalt-dcs369': {
    imageSourceUrl: 'https://api.mastertools.nl/media/catalog/product/cache/4ac98b0d5e81b56bd000310ba88c60e0/e/c/ecomm_medium-dcs369n_5.jpg',
    sourcePageUrl: 'https://mastertools.nl/nl_nl/product/dewalt-accu-reciprozaag-dcs369p2-qw',
    sourceLabel: 'Mastertools'
  },
  'dewalt-dcg416': {
    imageSourceUrl: 'https://www.i-tools.co.nz/cdn/shop/files/dcg416_STC6PB30X0JE.jpg?v=1725506812',
    sourcePageUrl: 'https://www.i-tools.co.nz/products/dewalt-brushless-grinder-1820v-max-flexvolt-adv-dcg416-free-bag',
    sourceLabel: 'i-tools'
  },
  'dewalt-dce530': {
    imageSourceUrl: 'https://assets.pawnamerica.com/ProductImages/23523043469/2e530892-5216-4665-834f-cd23df13bfcc.jpg',
    sourcePageUrl: 'https://www.pawnamerica.com/Product/Id/519798',
    sourceLabel: 'Pawn America'
  },
  'dremel-8250': {
    imageSourceUrl: 'https://www.dremel.com/imagestorage/en-us/8250-5-211964-png-16-9-232452_w_750_h_421.png',
    sourcePageUrl: 'https://www.dremel.com/us/en/p/8250-5-f0138250aa',
    sourceLabel: 'Dremel'
  },
  'arrow-t50acn': {
    imageSourceUrl: 'https://cdn11.bigcommerce.com/s-4ytrikgs1c/images/stencil/3840w/products/16673/30684/8-Staple-and-Nail-Gun-T50ACNWM-Right-Angle__71321.1745518446.jpg?compression=lossy',
    sourcePageUrl: 'https://arrowtoolgroup.com/arrow-t50acn-corded-electric-staple-brad-nail-gun/',
    sourceLabel: 'Arrow Tool Group'
  },
  'dremel-8240': {
    imageSourceUrl: 'https://shop.dremel.com/cdn/shop/files/1-dremel-blueprint-8240-5-product-kit-ATF-3000x3000.jpg?v=1743191320',
    sourcePageUrl: 'https://shop.dremel.com/products/dremel-8240-5-cordless-rotary-tool',
    sourceLabel: 'Dremel'
  }
};

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character]);
}

async function makePlaceholder(tool, destination) {
  const svg = `<svg width="1200" height="760" viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="760" rx="36" fill="#171b21"/>
    <rect x="28" y="28" width="1144" height="704" rx="24" fill="none" stroke="#3a424e" stroke-width="4" stroke-dasharray="16 14"/>
    <path d="M505 274h190v150H505zM545 234h110v40H545zM555 424h90v56h-90z" fill="none" stroke="#929aa6" stroke-width="12" stroke-linejoin="round"/>
    <text x="600" y="560" text-anchor="middle" fill="#f3f4f6" font-family="Arial, sans-serif" font-size="44" font-weight="700">Photo needed</text>
    <text x="600" y="620" text-anchor="middle" fill="#aab1bc" font-family="Arial, sans-serif" font-size="30">${escapeXml(tool.brand)} ${escapeXml(tool.model)}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(destination);
}

async function imageUrlFromPage(pageUrl) {
  const response = await fetch(pageUrl, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 VenomDocs/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const html = await response.text();
  const matches = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i
  ];
  for (const pattern of matches) {
    const match = html.match(pattern);
    if (match?.[1]) return new URL(match[1].replaceAll('&amp;', '&'), response.url).href;
  }
  throw new Error('No social product image found');
}

async function saveExactImage(image, destination) {
  const response = await fetch(image.imageSourceUrl, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 VenomDocs/1.0', referer: image.sourcePageUrl }
  });
  if (!response.ok) throw new Error(`image ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  await sharp(input).rotate().resize({ width: 1200, height: 760, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(destination);
}

const records = [];
for (const tool of tools) {
  const destination = `${outputDir}/${tool.id}.webp`;
  const alt = `${tool.name}, ${tool.brand} ${tool.model}`;
  const verified = verifiedImages[tool.id];
  if (verified) {
    try {
      await saveExactImage(verified, destination);
      records.push({ id: tool.id, path: `/images/tools/${tool.id}.webp`, alt, ...verified, verification: 'exact' });
      console.log(`exact        ${tool.id}`);
      continue;
    } catch (error) {
      console.warn(`curated image failed for ${tool.id}: ${error.message}`);
    }
  }
  if (!tool.manufacturerUrl) {
    await makePlaceholder(tool, destination);
    records.push({ id: tool.id, path: `/images/tools/${tool.id}.webp`, alt, imageSourceUrl: null, sourcePageUrl: null, sourceLabel: null, verification: 'photo-needed' });
    console.log(`placeholder  ${tool.id}`);
    continue;
  }
  try {
    const imageSourceUrl = await imageUrlFromPage(tool.manufacturerUrl);
    await saveExactImage({ imageSourceUrl, sourcePageUrl: tool.manufacturerUrl }, destination);
    records.push({ id: tool.id, path: `/images/tools/${tool.id}.webp`, alt, imageSourceUrl, sourcePageUrl: tool.manufacturerUrl, sourceLabel: sourceLabels[tool.brand] ?? tool.brand, verification: 'exact' });
    console.log(`exact        ${tool.id}`);
  } catch (error) {
    await makePlaceholder(tool, destination);
    records.push({ id: tool.id, path: `/images/tools/${tool.id}.webp`, alt, imageSourceUrl: null, sourcePageUrl: tool.manufacturerUrl, sourceLabel: null, verification: 'photo-needed' });
    console.warn(`placeholder  ${tool.id}: ${error.message}`);
  }
}

writeFileSync(manifestPath, `${JSON.stringify(records, null, 2)}\n`);
console.log(`Wrote ${records.length} image records.`);
