import 'dotenv/config';
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const showUserGuide      = process.env.WXRK_SHOW_USER_GUIDE          !== 'false';
const showFullFlow       = process.env.WXRK_SHOW_FULL_FLOW_TUTORIAL   !== 'false';
const showDevDocs        = process.env.WXRK_SHOW_DEV_DOCS             === 'true';

const mainSidebarItems: SidebarsConfig['mainSidebar'] = [
  { type: 'doc', id: 'getting-started', label: 'Getting Started' },
  ...(showUserGuide ? [{
    type: 'category' as const,
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
  }] : []),
  ...(showFullFlow ? [{
    type: 'category' as const,
    label: 'Full Flow Tutorial',
    items: ['tutorial/full-flow'],
  }] : []),
];

const sidebars: SidebarsConfig = {
  mainSidebar: mainSidebarItems,
  ...(showDevDocs ? {
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
  } : {}),
};

export default sidebars;
