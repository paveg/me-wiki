# me.wiki

Personal knowledge base built with Astro Starlight, deployed to Cloudflare Workers.

## Content Guidelines

- **Accuracy first**: When the user asks about a topic, research thoroughly before writing. Minimize hallucinations and errors. Verify facts via web search or authoritative sources. If uncertain, state so explicitly rather than guessing.
- **Cross-linking**: When writing new wiki entries, check existing pages for related content. Add hyperlinks between related pages to build a connected knowledge graph.
- **Supplements**: If a new topic relates to previously researched content, add supplementary notes or references in both the new and existing pages where appropriate.

## Structure

- Wiki content lives in `src/content/docs/wiki/`
- Sidebar is auto-generated from the `wiki/` directory
- Use Mermaid code blocks for diagrams (rendered client-side)
- Frontmatter `sidebar.order` controls page ordering

## Code Conventions

- All implementation code and comments in English
- Wiki content (Markdown body) in Japanese
- Use pnpm as the package manager

## Commands

- `pnpm dev` — local dev server
- `pnpm build` — static build to `dist/`
- `wrangler deploy` — deploy to Cloudflare Workers
