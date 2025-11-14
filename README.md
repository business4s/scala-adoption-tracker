# Scala Adoption Tracker

A minimal Docusaurus site that crowdsources public evidence of Scala adoption across companies and OSS projects. YAML files in `adopters/` are loaded directly at build time, validated, and rendered as a single responsive grid.

## Requirements

- Node.js 20+

## Setup

```bash
npm install
```

### Useful commands

```bash
npm run start # run the dev server at http://localhost:3000
npm run build # produce the static site in build/
```

## Adding or updating adopters

Each YAML file under `adopters/` should contain:

- `name` – company or project name
- `logoUrl` – absolute URL to a PNG/SVG logo
- `website` – canonical homepage
- `usage` – short explanation of how Scala is used
- `adoptionStatus` – one of `not planned`, `planned`, `partial`, `full`
- `sources` – list of links or short notes backing up the claim
- `size` – integer headcount (used for ordering)
- `category` – `product company`, `OSS project`, or `consulting company`

Because the Docusaurus build imports and validates those YAML files directly, any malformed entry will fail CI immediately—simply run `npm run build` before opening a PR.
