# awesome-aeco.github.io

Official website and interactive directory for **Awesome AECO** — the open-source hub for Architecture, Engineering, Construction, and Operations.

- **Brand & Ecosystem Hub:** `https://awesome-aeco.github.io/`
- **Interactive Directory:** `https://awesome-aeco.github.io/awesome/`
- **Curated List Source:** [`awesome-aeco/Awesome-AECO`](https://github.com/awesome-aeco/Awesome-AECO)

## How data sync works

`Awesome-AECO` remains the single source of truth for `readme.md`, `data/catalog.json`, `data/movers.md`, `brand/`, and `badges/`.

During local development and CI builds, `scripts/sync-data.mjs` pulls those files from `../Awesome-AECO` (if present locally) or from `https://raw.githubusercontent.com/awesome-aeco/Awesome-AECO/main/`.

## Local development

```bash
npm install
npm run dev
```

## License

- Site source code: [MIT](LICENSE)
- Curated list content (`readme.md`): CC0 1.0 Universal
- Enriched catalog data (`data/catalog.json`): CC BY 4.0
- Brand assets (name, logos, badges): Protected under [`TRADEMARK.md`](https://github.com/awesome-aeco/Awesome-AECO/blob/main/TRADEMARK.md)
