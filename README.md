# Career Hub

Barış Kuzu's CV and portfolio, built as a parody of a Dynamics 365 model-driven app. The career is the data: sitemap, views, forms, command bar, Business Process Flow and dashboard are real UI, populated from the CV.

Live at **https://kh3ldar.github.io**.

## How it is built

Vite, React, TypeScript and Fluent UI React v9, deployed to GitHub Pages as a static site.

The site follows the same rule as the PCF controls it showcases: **config, not code**. Entity metadata, option sets, saved views, forms, the sitemap, dashboards, commands, the Business Process Flow and the records themselves live as typed data in `src/data`. The components that render them are generic and never branch on an entity name. Adding a new table is a data change.

URLs mirror a model-driven app, for example `/?appid=career&pagetype=entityrecord&etn=project&id=productgrid`, so every page deep-links without a server.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest
npm run build      # typecheck + production build into dist/
```

Node 24 or newer. Pushing to `main` deploys through GitHub Actions.

## Layout

| Path | What lives there |
|---|---|
| `src/data` | Everything the app shows: metadata, views, forms, sitemap, dashboards, records |
| `src/platform` | Router, metadata registry, view resolution, formatting, commands |
| `src/components` | Generic, metadata-driven UI: grid, form, business process flow, dashboard, quick create |
| `content/cv.md` | Readable CV text, the source for the records |
| `scripts` | CV to Markdown and PDF, demo video download |
| `docs/DESIGN.md` | Design principles and the decision log |

Not affiliated with Microsoft. No Microsoft logos are used; the UI is built with the open-source Fluent UI library.
