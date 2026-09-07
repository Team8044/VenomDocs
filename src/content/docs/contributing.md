---
title: Contributing
description: Add, verify, preview, and publish Venom Docs content.
---

## Local preview

```sh
npm install
npm run dev
```

The production check is:

```sh
npm run build
```

This validates inventory records, type-checks Astro content, and builds the static site using the `/VenomDocs/` project path.

## Add or update a tool

1. Edit `src/data/tools.json`. Keep the model number exactly as printed on the tool nameplate.
2. Use a lowercase, stable `id` and a matching guide path under `/tools/handheld/guides/`.
3. Preserve every spreadsheet or inventory source in `sourceRows`; combine duplicate physical inventory into one model record.
4. Link manufacturer product pages and manuals instead of copying manuals into the repository.
5. Add or update the guide in `src/content/docs/tools/handheld/guides/`.
6. Run `npm run build` before opening a pull request.

## Product information rules

- Use the product's commercial name as the page title and keep the model as secondary metadata.
- Include only useful model-specific specifications from an official product page or manual.
- Link the exact manufacturer page and manual. Add Amazon only when the listing is verified as the same model; never link a substitute or search result.
- Leave unknown fields as “Not recorded” instead of adding explanatory filler.

## Publishing

The workflow in `.github/workflows/deploy.yml` builds and deploys pushes to `main`. A repository administrator must select **GitHub Actions** as the Pages source under **Settings → Pages** once.
