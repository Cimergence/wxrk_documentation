import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started">
            Candidate Guide
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/dev/architecture"
            style={{marginLeft: '1rem'}}>
            Developer Docs
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Tailored CVs in seconds',
    description: 'WXRK matches your experience to the job description and generates an ATS-optimised CV without manual editing.',
  },
  {
    title: 'Cover letters in your voice',
    description: 'Your MBTI personality type calibrates the tone, structure, and emphasis of every cover letter.',
  },
  {
    title: 'Track your pipeline',
    description: 'Manage all applications in a Kanban board. Log notes, track status, and see your success rate over time.',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Documentation for the WXRK AI-powered job application platform">
      <HomepageHeader />
      <main>
        <section style={{padding: '3rem 0'}}>
          <div className="container">
            <div className="row">
              {features.map((f, i) => (
                <div key={i} className={clsx('col col--4')}>
                  <div className="text--center padding-horiz--md">
                    <Heading as="h3">{f.title}</Heading>
                    <p>{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="row" style={{marginTop: '3rem'}}>
              <div className="col col--6 col--offset-3 text--center">
                <Heading as="h2">Where to start</Heading>
                <p>New to WXRK? Follow the <Link to="/tutorial/full-flow">Full Candidate Flow Tutorial</Link> for a step-by-step walkthrough.</p>
                <p>Developer? Check the <Link to="/dev/gap-report">Gap Report</Link> for a prioritised list of backend work needed to close the frontend/backend gap.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
