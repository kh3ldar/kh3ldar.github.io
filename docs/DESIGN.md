# Career Hub design

A CV and portfolio presented as a model-driven app, for people who build or hire for Dynamics 365. The career is the data, and the app around it is real UI. The parody is affectionate; the content is a serious CV.

## Principles

- **Config, not code.** Everything the app shows is typed data in `src/data`: entities, option sets, saved views, forms, sitemap, dashboard, commands, the business process flow, and the records. Components render any entity from that metadata and never branch on an entity name. It is the same rule the PCF controls in the portfolio are built on.
- **Faithful chrome, working controls.** Every button does something real, or answers the way the platform would: an error dialog with an error code, an activity ID and a downloadable log.
- **Tone.** English, dry, short. Jokes live in data, never in component code. Nothing mocks Microsoft, and no Microsoft logos or wordmarks are used. The app is called "Career Hub".
- **Honest content.** Only facts from the CV and the public READMEs. No invented dates or figures. The eMind implementation is anonymised: no client names, no ERP vendor, no numbers beyond the CV.
- **Contact without a phone.** The site shows email, LinkedIn and GitHub. The phone number exists only in the downloadable CV.

## How it fits together

| Platform concept | On the site |
|---|---|
| Sitemap and areas | Career (Dashboard, About me, Positions, Skills, Certifications, Education) and Portfolio (Projects, Accounts, Contacts) |
| Dashboard | KPI tiles, bar charts with a table view, list tiles, a welcome tile with plain buttons |
| Views | Sortable grids with a view selector, "Set as default view", keyword filter, Export to Excel |
| Main forms | Header fields, tabs, locked fields, subgrids, timeline, demo videos |
| Business process flow | Career Path on the About record; Finish opens the Lead quick create |
| Quick create | "Lead" is the contact form; Save shows a contact card with a prefilled email |
| Platform moments | Read-only notification bars, error dialogs, session expiry, "Working on it...", personalization settings |

**Tables:** contact, account, position, project, skill, certification, education, and lead for quick create only. Positions point at accounts, projects point at positions, and projects list their skills, so each relationship can be read from both ends as a subgrid.

**URLs** copy the platform: `/?appid=career&pagetype=entityrecord&etn=project&id=productgrid`. Every page lives on `/` with query parameters, so GitHub Pages serves deep links without a fallback page.

**Layers:** `src/data` holds the metadata and records. `src/platform` holds the router, registry, view resolution, relationships, aggregation, search, formatting, commands and the integrity check. `src/components` and `src/pages` hold the generic UI on Fluent UI 9.

## Decisions

- **Static site on GitHub Pages**, deployed by GitHub Actions. There is no backend; the Lead form ends in a mailto link and copy buttons.
- **Charts are an HTML bar list**, not a chart library. Fluent's chart package ignored spacing settings and drew dense gridlines. The bar list uses one validated colour per theme, value labels at bar ends and no gridlines. Rows are large hover and focus targets, and each chart has a table view. Skills by Category is a bar chart rather than a donut because its values are close together.
- **Timeline posts are undated** unless a real date is known: position start and end, and the repo publication date.
- **Main forms are named "Information"**, as the platform names its defaults. People and companies get initials; other records get their table icon.
- **Performance.** Pages, the quick create drawer, the dialogs and search load as separate chunks. Global CSS and a boot shell are inline in `index.html`, so first paint does not wait for JavaScript. Lighthouse on the live site scores 96 to 100 for performance.
- **Grids.** Full list grids keep arrow-key cell navigation. Compact grids, meaning subgrids and dashboard lists, fit their column and let Tab reach the links directly.
- **Six more projects, one record per repo or control folder (October 2026).** DataversePluginKit and FormScriptKit use two new `project_type` options, C# library and JavaScript library; the PCF records keep type 1. The PCFControls repo is one record per folder, so AddressBook is one record holding three controls. They are generic rewrites of patterns built at eMind, and the records say so. `publishedon` was filled in when the repos went public. All of them are In production: the public repos are generic versions of controls and code that run in production, the same as ProductGrid and ProductAddGrid. The KPI is now "PCF projects in production", captioned "All public on GitHub". It counts records, and AddressBook is one record holding three controls, so "projects" is the true word.
- **Tooling.** TypeScript 6 came with the Vite template. Vitest 4.1 and jsdom 29 are pinned because their next majors refuse Node 25.

## Quality bar

41 tests run in CI: router, formatting, views, relationships, aggregation, search, the integrity check over the real data, repository guards, and grid and link components. Changes are walked in a browser in both themes before they ship.
