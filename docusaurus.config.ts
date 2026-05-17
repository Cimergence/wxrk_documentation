import 'dotenv/config';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const showUserGuide    = process.env.WXRK_SHOW_USER_GUIDE          !== 'false';
const showDevDocs      = process.env.WXRK_SHOW_DEV_DOCS             === 'true';

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
  customFields: { showDevDocs },
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
          exclude: [
            ...(showDevDocs ? [] : ['dev/**']),
            ...(showUserGuide ? [] : ['guide/**', 'tutorial/**']),
          ],
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
        ...(showUserGuide ? [{
          type: 'docSidebar' as const,
          sidebarId: 'mainSidebar',
          position: 'left' as const,
          label: 'User Guide',
        }] : []),
        ...(showDevDocs ? [{
          type: 'docSidebar' as const,
          sidebarId: 'devSidebar',
          position: 'left' as const,
          label: 'For Developers',
        }] : []),
        {
          href: 'https://github.com/Cimergence/wxrk_documentation',
          label: 'GitHub',
          position: 'right' as const,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        ...(showUserGuide ? [{
          title: 'User Guide',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'Profile', to: '/guide/profile' },
            { label: 'Technical Review', to: '/guide/technical-review' },
            { label: 'Generate CV & Cover Letter', to: '/guide/generate' },
          ],
        }] : []),
        ...(showDevDocs ? [{
          title: 'Developers',
          items: [
            { label: 'Architecture Overview', to: '/dev/architecture' },
            { label: 'API Reference', to: '/dev/api-reference' },
            { label: 'Gap Report', to: '/dev/gap-report' },
          ],
        }] : []),
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
