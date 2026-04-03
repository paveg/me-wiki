# ADR-0001: Diagram Rendering with beautiful-mermaid (Build-time Rehype Plugin)

## Status
Accepted

## Context
The wiki needs diagrams (flowcharts, data structure visualizations) rendered from text-based definitions. Three approaches were evaluated:

1. **Mermaid (client-side CDN)** — Required fragile DOM workarounds with Starlight's Expressive Code (DEL character separators, manual node replacement). Aesthetically poor defaults.
2. **D2 (build-time CLI)** — Beautiful output but requires a Go binary (d2), different syntax from Mermaid, and dark/light switching needs regeneration or CSS hacks.
3. **beautiful-mermaid (build-time rehype plugin)** — Same Mermaid syntax, superior rendering, runs in Node.js at build time via a custom rehype plugin. Generates both light and dark SVGs, toggled with CSS.

Client-side rendering of beautiful-mermaid failed due to its synchronous ELK.js FakeWorker being blocked by browser CSP. Moving it to a build-time rehype plugin resolved this entirely.

## Decision
Use **beautiful-mermaid** as a custom rehype plugin (`plugins/rehype-beautiful-mermaid.mjs`) that runs at build time:

- Mermaid code blocks in Markdown are converted to inline SVGs during the Astro build.
- Two SVGs are generated per diagram (light + dark theme), toggled via CSS `display` rules matching Starlight's `data-theme` attribute.
- No client-side JavaScript is needed for diagram rendering.
- D2 tooling remains installed (via devbox) as a fallback for diagrams that exceed Mermaid's expressiveness.

## Consequences
**Easier:**
- Authors write standard Mermaid syntax in Markdown — no new language to learn.
- Zero client-side JS for diagrams — fast page loads, no flash of unstyled content.
- Dark/light mode works automatically via CSS.

**Harder:**
- Diagrams only update on rebuild (not hot-reloaded in dev server).
- beautiful-mermaid supports 6 diagram types (Flowchart, State, Sequence, Class, ER, XY Chart) — `block-beta` and other newer Mermaid features are not supported.
- If beautiful-mermaid is abandoned, fallback to client-side Mermaid CDN is straightforward (same syntax).
