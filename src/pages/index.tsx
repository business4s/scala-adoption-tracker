import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import {usePluginData} from '@docusaurus/useGlobalData';

import type {
  Adopter,
  AdoptionStatus,
  AdoptersContent,
} from '@site/plugins/adopters-plugin';

const statusLabels: Record<AdoptionStatus, string> = {
  'not planned': 'Not planned',
  planned: 'Planned',
  partial: 'Partial',
  full: 'Full',
};

const statusOrder: AdoptionStatus[] = ['not planned', 'planned', 'partial', 'full'];

function AdopterCard({adopter}: {adopter: Adopter}): ReactNode {
  return (
    <article className="adopter-card">
      <div className="adopter-card__header">
        <Heading as="h3">{adopter.name}</Heading>
        <img
          className="adopter-logo"
          src={adopter.logoUrl}
          alt={`${adopter.name} logo`}
          loading="lazy"
        />
      </div>
      <p className="adopter-usage">{adopter.usage}</p>
      <ul>
        <li>
          <strong>Website:</strong>{' '}
          <a href={adopter.website} target="_blank" rel="noreferrer">
            {adopter.website}
          </a>
        </li>
        <li>
          <strong>Category:</strong> {adopter.category}
        </li>
        <li>
          <strong>Company size:</strong> {adopter.size}
        </li>
        <li>
          <strong>Scala 3 adoption status:</strong> {statusLabels[adopter.adoptionStatus]}
        </li>
      </ul>
      {adopter.sources.length > 0 && (
        <div className="adopter-sources">
          <p>
            <strong>Sources:</strong>
          </p>
          <ul>
            {adopter.sources.map((source) => (
              <li key={source}>
                {source.startsWith('http') ? (
                  <a href={source} target="_blank" rel="noreferrer">
                    {source}
                  </a>
                ) : (
                  source
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export default function Home(): ReactNode {
  const {adopters, summary, lastUpdated} =
    usePluginData<AdoptersContent>('adopters-plugin');

  return (
    <Layout description="Crowdsourced list of companies and projects adopting Scala.">
      <main className="container margin-vert--lg">
        <header>
          <Heading as="h1">Scala Adoption Tracker</Heading>
          <p>
            This site compiles public evidence of companies and OSS projects using Scala in
            production. Contributions happen via YAML files in the{' '}
            <code>adopters/</code> folder, and the Docusaurus build validates every entry.
          </p>
          <p className="margin-bottom--lg">Last updated {lastUpdated}.</p>
        </header>

        <section>
          <Heading as="h2">Scala 3 adoption snapshot</Heading>
          <ul>
            {statusOrder.map((status) => (
              <li key={status}>
                <strong>{statusLabels[status]}:</strong> {summary[status] ?? 0}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Heading as="h2">Adopters</Heading>
          <div className="adopters-grid">
            {adopters.map((adopter) => (
              <AdopterCard key={adopter.name} adopter={adopter} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
