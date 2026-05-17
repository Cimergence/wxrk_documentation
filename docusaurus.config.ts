import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WXRK Documentation',
  tagline: 'AI-powered CV & cover letter generation for candidates',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.wxrk.app',
  baseUrl: '/',

  organizationName: 'wxrk',
  projectName: 'wxrk_documentation',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WXRK Docs',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'User Guide',
        },
        {
          type: 'docSidebar',
          sidebarId: 'devSidebar',
          position: 'left',
          label: 'For Developers',
        },
        {
          href: 'https://github.com/wxrk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'User Guide',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'Profile', to: '/guide/profile' },
            { label: 'Technical Review', to: '/guide/technical-review' },
            { label: 'Generate CV & Cover Letter', to: '/guide/generate' },
          ],
        },
        {
          title: 'Developers',
          items: [
            { label: 'Architecture Overview', to: '/dev/architecture' },
            { label: 'API Reference', to: '/dev/api-reference' },
            { label: 'Gap Report', to: '/dev/gap-report' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WXRK. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'python', 'typescript', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
