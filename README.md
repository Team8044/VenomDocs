# Venom Docs

Static Team 8044 shop documentation built with Astro Starlight and published at `https://docs.team8044.org/`.

## Develop

```sh
npm install
npm run dev
```

Run the complete validation and production build with `npm run build`. See the in-site contributing guide for content and verification conventions.

## Enable GitHub Pages

In the GitHub repository, open **Settings → Pages** and select **GitHub Actions** as the source. Pushes to `main` will then deploy through `.github/workflows/deploy.yml`.

Set the Pages custom domain to `docs.team8044.org`. In Cloudflare DNS, create a DNS-only `CNAME` record named `docs` targeting `team8044.github.io`, then enable **Enforce HTTPS** after GitHub finishes checking the domain.

The site is intentionally independent of VenomAppsFramework. It reuses Team 8044 identity assets and design tokens but has no runtime or framework dependency on that repository.
