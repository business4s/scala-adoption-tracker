import {useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import useGlobalData from '@docusaurus/useGlobalData';
import yaml from 'yaml';

import type {AdoptersContent} from '@site/plugins/adopters-plugin';

const REPO_URL = 'https://github.com/business4s/scala-adoption-tracker';

const statusOptions = [
    {value: '', label: 'Unknown'},
    {value: 'not planned', label: 'Not planned'},
    {value: 'planned', label: 'Planned'},
    {value: 'partial', label: 'Partial'},
    {value: 'full', label: 'Full'},
];

const categoryOptions = [
    {value: 'product company', label: 'Product company'},
    {value: 'OSS project', label: 'OSS project'},
    {value: 'consulting company', label: 'Consulting company'},
];

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export default function Submit(): ReactNode {
    const data = useGlobalData();
    const pluginData = data['adopters-plugin']?.default as AdoptersContent | undefined;
    const existingNames = useMemo(
        () => new Set((pluginData?.adopters ?? []).map((a) => a.name.toLowerCase())),
        [pluginData],
    );

    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('product company');
    const [size, setSize] = useState('');
    const [sources, setSources] = useState('');

    const sourceList = sources
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    const yamlText = yaml.stringify({
        name: name.trim(),
        logoUrl: logoUrl.trim(),
        website: website.trim(),
        description: description.trim(),
        scala3AdoptionStatus: status === '' ? null : status,
        category,
        size: Number(size) || 0,
        sources: sourceList,
    });

    const slug = slugify(name);
    const isDuplicate = existingNames.has(name.trim().toLowerCase());
    const ready = name.trim() && website.trim() && logoUrl.trim() && size.trim() && sourceList.length > 0;

    const githubUrl =
        `${REPO_URL}/new/main` +
        `?filename=${encodeURIComponent(`adopters/${slug || 'new-adopter'}.yaml`)}` +
        `&value=${encodeURIComponent(yamlText)}`;

    return (
        <Layout title="Add an entry" description="Submit a new Scala adopter via a GitHub pull request.">
            <main className="container margin-vert--lg submit-page">
                <Heading as="h1">Add an entry</Heading>
                <p>
                    Fill in the form and press the button below — it will take you to GitHub with a
                    ready-made file so you can open a pull request in a couple of clicks. You need a
                    GitHub account, and the PR is created from your own fork under your name.
                </p>

                <div className="submit-layout">
                    <form className="submit-form" onSubmit={(e) => e.preventDefault()}>
                        <label>
                            <span>Name<span className="submit-required">*</span></span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Acme Corp"
                            />
                            {isDuplicate && (
                                <span className="submit-warning">
                                    An entry with this name already exists. Consider updating{' '}
                                    <a href={`${REPO_URL}/edit/main/adopters/${slug}.yaml`} target="_blank" rel="noreferrer">
                                        the existing file
                                    </a>{' '}
                                    instead.
                                </span>
                            )}
                        </label>
                        <label>
                            <span>Website<span className="submit-required">*</span></span>
                            <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="https://acme.example"
                            />
                            <small>Homepage. Public official websites are preferred.</small>
                        </label>
                        <label>
                            <span>Logo URL<span className="submit-required">*</span></span>
                            <input
                                type="url"
                                value={logoUrl}
                                onChange={(e) => setLogoUrl(e.target.value)}
                                placeholder="https://avatars.githubusercontent.com/u/..."
                            />
                            <small>Absolute URL to a PNG/SVG logo, ideally square.</small>
                        </label>
                        <label>
                            Description
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What the company/project does and how Scala is used there."
                            />
                        </label>
                        <label>
                            <span>Category<span className="submit-required">*</span></span>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categoryOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Scala 3 adoption status
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <span>Size<span className="submit-required">*</span></span>
                            <input
                                type="number"
                                min={0}
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="1000"
                            />
                            <small>GitHub star count for OSS projects, headcount for companies. Used for ordering.</small>
                        </label>
                        <label>
                            <span>Sources<span className="submit-required">*</span></span>
                            <textarea
                                rows={4}
                                value={sources}
                                onChange={(e) => setSources(e.target.value)}
                                placeholder={'https://github.com/acme/repo\nhttps://acme.example/blog/why-scala'}
                            />
                            <small>
                                One per line. Links or short notes backing up the claims: GitHub repos, blog
                                posts, conference talks, job ads, etc.
                            </small>
                        </label>
                    </form>

                    <aside className="submit-preview">
                        <Heading as="h3">Preview</Heading>
                        <p className="submit-preview__filename">
                            <code>adopters/{slug || 'new-adopter'}.yaml</code>
                        </p>
                        <CodeBlock language="yaml">{yamlText}</CodeBlock>
                        <a
                            className="button button--primary button--lg"
                            href={ready ? githubUrl : undefined}
                            target="_blank"
                            rel="noreferrer"
                            aria-disabled={!ready}
                            onClick={(e) => {
                                if (!ready) e.preventDefault();
                            }}
                        >
                            Open pull request on GitHub
                        </a>
                        {!ready && (
                            <p className="submit-hint">
                                Fill in the required fields (name, website, logo, size, at least one source) to continue.
                            </p>
                        )}
                        <p className="submit-hint">
                            On GitHub: review the file, click <strong>Commit changes…</strong>, then{' '}
                            <strong>Propose changes</strong> and <strong>Create pull request</strong>.
                        </p>
                    </aside>
                </div>
            </main>
        </Layout>
    );
}
