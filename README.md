# Scala Adoption Tracker

A minimal Docusaurus site that crowdsources public evidence of Scala adoption across companies and OSS projects.

## Adding or updating adopters

We welcome all contributions! You can find all entries in the `/adopters` directory. 
Each file should contain a single YAML object with the following fields:

- `name` – company or project name
- `logoUrl` – absolute URL to a PNG/SVG logo
- `website` – homepage. Public official websites are preferred.
- `description` – short explanation of company or project and how Scala is used there.
- `scala3AdoptionStatus` – one of `not planned`, `planned`, `partial`, `full` (or `null` if unknown)
- `sources` – list of links or short notes backing up the claims
- `size` – integer used for ordering. GitHub star count for OSS projects, headcount for companies. 
- `category` – `product company`, `OSS project`, or `consulting company`

Caveat:
for OSS projects we want to show only those that are not specific to scala-ecosystem but provide value outside of it. 

## Dev Setup

```bash
npm install
npm run start
```
