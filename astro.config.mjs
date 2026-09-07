import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://docs.team8044.org',
  base: '/',
  integrations: [
    starlight({
      title: 'Venom Docs',
      description: 'Team 8044 shop knowledge, safety guidance, and equipment documentation.',
      logo: { src: './src/assets/venom-logo.png', replacesTitle: false },
      favicon: '/favicon.png',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Team8044/VenomDocs' }],
      editLink: { baseUrl: 'https://github.com/Team8044/VenomDocs/edit/main/' },
      customCss: ['./src/styles/venom.css'],
      components: { Header: './src/components/Header.astro' },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: 'Start Here', items: [{ slug: 'index' }] },
        {
          label: 'Handheld Power Tools',
          items: [
            { slug: 'tools/handheld' },
            { autogenerate: { directory: 'tools/handheld/guides', collapsed: true } }
          ]
        },
        { label: 'Contributing', items: [{ slug: 'contributing' }] }
      ]
    })
  ]
});
