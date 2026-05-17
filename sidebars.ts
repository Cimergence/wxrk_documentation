import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Candidate Guide',
      collapsed: false,
      items: [
        'guide/onboarding',
        'guide/profile',
        'guide/technical-review',
        'guide/applications',
        'guide/generate',
        'guide/dashboard',
      ],
    },
    {
      type: 'category',
      label: 'Full Flow Tutorial',
      items: [
        'tutorial/full-flow',
      ],
    },
  ],

  devSidebar: [
    {
      type: 'category',
      label: 'Architecture',
      collapsed: false,
      items: [
        'dev/architecture',
        'dev/api-reference',
        'dev/data-models',
      ],
    },
    {
      type: 'doc',
      id: 'dev/gap-report',
      label: '⚠️ Gap Report',
    },
  ],
};

export default sidebars;
