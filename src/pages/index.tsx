import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import useGlobalData from '@docusaurus/useGlobalData';

import type {
    Adopter,
    AdoptionStatus,
    AdoptersContent,
    Category,
} from '@site/plugins/adopters-plugin';
import Linkify from "linkify-react";


const createStatusElement = (status: AdoptionStatus | undefined): ReactNode => {
    if (!status) return null;
    const formatted = status === 'full' || status === 'partial' ? 'Scala 3' : null;
    if (!formatted) return null;
    return <span className="adoption-badge" title={status}>{formatted}</span>;
};

const categoryOrder: { key: Category; label: string }[] = [
    {key: 'product company', label: 'Product companies'},
    {key: 'OSS project', label: 'OSS projects'},
    {key: 'consulting company', label: 'Consulting companies'},
];

function SourceList({sources}: { sources: string[] }): ReactNode {
    if (sources.length === 0) {
        return null;
    }
    return (
        <details className="adopter-sources">
            <summary>Sources</summary>
            <ul>
                {sources.map((source) => (
                    <li key={source}><Linkify>{source}</Linkify></li>
                ))}
            </ul>
        </details>
    );
}

function AdopterCard({adopter}: { adopter: Adopter }): ReactNode {
    return (
        <article className="adopter-card">
            <div className="adopter-card__header">
                <Heading as="h3">
                    <a href={adopter.website} target="_blank" rel="noreferrer" className="adopter-link">
                        {adopter.name}
                    </a>
                </Heading>
                <img
                    className="adopter-logo"
                    src={adopter.logoUrl}
                    alt={`${adopter.name} logo`}
                    loading="lazy"
                />
            </div>
            <p className="adopter-usage">{adopter.description}</p>
            {createStatusElement(adopter.scala3AdoptionStatus)}
            <SourceList sources={adopter.sources}/>
        </article>
    );
}

export default function Home(): ReactNode {
    const data = useGlobalData();
    const pluginData = data['adopters-plugin']?.default as AdoptersContent | undefined;
    const adopters = pluginData?.adopters ?? [];
    const unverified = pluginData?.unverified ?? [];
    const lastUpdated = pluginData?.lastUpdated ?? 'unknown date';

    function chunk<T>(arr: T[], n: number): T[][] {
        const size = Math.ceil(arr.length / n);
        return Array.from({ length: n }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );
    }
    const unverifiedColumns = chunk(unverified, 4);

    return (
        <Layout description="Crowdsourced list of companies and projects adopting Scala.">
            <main className="container margin-vert--lg">
                <header>
                    <Heading as="h1">Scala Adoption Tracker</Heading>
                    <p>
                        A curated look at where Scala shows up in the real world—product teams, foundational
                        OSS, and consulting shops. Everything listed here links back to public proof.
                    </p>
                </header>

                {categoryOrder.map(({key, label}) => {
                    const group = adopters.filter((adopter) => adopter.category === key);
                    if (group.length === 0) {
                        return null;
                    }
                    return (
                        <section key={key} className="category-section">
                            <Heading as="h2">{label}</Heading>
                            <div className="adopters-grid">
                                {group.map((adopter) => (
                                    <AdopterCard key={`${key}-${adopter.name}`} adopter={adopter}/>
                                ))}
                            </div>
                            <hr/>
                            {key === 'product company' && unverified.length > 0 && (
                                <div>
                                    <Heading as="h3">And possibly {unverified.length} more!</Heading>
                                    <p>List below has been scraped from various sources but the entries have not been verified.</p>
                                    <details className="adopter-unverified">
                                        <summary>Expand</summary>
                                        <div className="adopters-grid">
                                        {unverifiedColumns.map((col, i) => (
                                            <ul key={i} className="unverified-column">
                                                {col.map((u) => (
                                                    <li key={u.website}>
                                                        <a href={u.website} target="_blank" rel="noreferrer">
                                                            {u.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ))}
                                        </div>
                                    </details>
                                </div>
                            )}
                        </section>
                    );
                })}

                <p className="last-updated">Data last refreshed on {lastUpdated}.</p>
            </main>
        </Layout>
    );
}
