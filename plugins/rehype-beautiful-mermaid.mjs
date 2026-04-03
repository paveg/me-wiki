import { renderMermaidSVG } from 'beautiful-mermaid';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that replaces mermaid code blocks with SVGs at build time.
 * Uses beautiful-mermaid for rendering — runs in Node.js, not in the browser.
 */
export default function rehypeBeautifulMermaid(options = {}) {
  const light = { transparent: true, ...options.light };
  const dark = { bg: '#0d1117', fg: '#e6edf3', transparent: true, ...options.dark };

  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Match: <pre><code class="language-mermaid">...</code></pre>
      if (
        node.tagName !== 'pre' ||
        !node.children?.[0] ||
        node.children[0].tagName !== 'code'
      ) return;

      const code = node.children[0];
      const classes = code.properties?.className || [];
      if (!classes.includes('language-mermaid')) return;

      // Extract the raw mermaid source text
      const source = extractText(code);
      if (!source.trim()) return;

      try {
        const lightSvg = renderMermaidSVG(source, light);
        const darkSvg = renderMermaidSVG(source, dark);

        // Replace the <pre> node with a <div> containing both themed SVGs
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['mermaid-diagram'] },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid-light'] },
              children: [{ type: 'raw', value: lightSvg }],
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid-dark'] },
              children: [{ type: 'raw', value: darkSvg }],
            },
          ],
        };
      } catch (err) {
        console.warn(`[rehype-beautiful-mermaid] Failed to render:\n${source}\n${err.message}`);
      }
    });
  };
}

function extractText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}
