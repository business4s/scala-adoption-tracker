# Scala Adoption Tracker

A minimal Docusaurus site that crowdsources public evidence of Scala adoption across companies and OSS projects.

## Adding or updating adopters

We welcome all contributions! The easiest way is the [submission form](https://business4s.org/scala-adoption-tracker/submit)
— it generates the file for you and takes you straight to GitHub to open a PR.

Alternatively, edit the `/adopters` directory directly.
Each file should contain a single YAML object with the following fields:

- `name` – company or project name
- `logoUrl` – absolute URL to a PNG/SVG logo
- `website` – homepage. Public official websites are preferred.
- `description` – short explanation of company or project and how Scala is used there.
- `scala3AdoptionStatus` – one of `not planned`, `planned`, `partial`, `full` (or `null` if unknown)
- `sources` – list of links or short notes backing up the claims. Could be GitHub repos, blog posts, conference talks, etc.
- `size` – integer used for ordering. GitHub star count for OSS projects, headcount for companies. 
- `category` – `product company`, `OSS project`, or `consulting company`

Caveats:
* for OSS projects we want to show only those that are not specific to scala-ecosystem but provide value outside of it. 
* when adding a new adopter make sure it's not present in `adopters/_others.yaml`

## Dev Setup

```bash
npm install
npm run start
```

## Future work

If the community finds this project useful, we could add the following features:
* Tracking codebase size
* Search
* &lt;your great idea here&gt;