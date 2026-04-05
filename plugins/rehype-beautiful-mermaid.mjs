import { renderMermaidSVG } from 'beautiful-mermaid';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';

/**
 * Rehype plugin that replaces mermaid code blocks with SVGs at build time.
 * Uses beautiful-mermaid for rendering — runs in Node.js, not in the browser.
 */
export default function rehypeBeautifulMermaid(options = {}) {
  const light = { bg: '#ffffff', fg: '#27272a', ...options.light };
  const dark = { bg: '#111111', fg: '#e6edf3', ...options.dark };

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

      const source = extractText(code);
      if (!source.trim()) return;

      try {
        const lightSvg = injectCssVars(renderMermaidSVG(source, light), light);
        const darkSvg = injectCssVars(renderMermaidSVG(source, dark), dark);

        // Parse SVG strings into hast nodes so they render as real HTML, not escaped text
        const lightNode = fromHtml(lightSvg, { fragment: true, space: 'svg' });
        const darkNode = fromHtml(darkSvg, { fragment: true, space: 'svg' });

        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['mermaid-diagram'] },
          children: [
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid-light'] },
              children: lightNode.children,
            },
            {
              type: 'element',
              tagName: 'div',
              properties: { className: ['mermaid-dark'] },
              children: darkNode.children,
            },
          ],
        };
      } catch (err) {
        console.warn(`[rehype-beautiful-mermaid] Failed to render:\n${source}\n${err.message}`);
      }
    });
  };
}

// Inject CSS variable values into the SVG's <style> block
function injectCssVars(svg, colors) {
  const vars = `svg { --bg:${colors.bg}; --fg:${colors.fg}; }`;
  return svg.replace('<style>', `<style>${vars} `);
}

function extractText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}
