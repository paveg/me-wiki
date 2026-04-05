// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: 'me.wiki',
			defaultLocale: 'root',
			locales: {
				root: { label: '日本語', lang: 'ja' },
				en: { label: 'English', lang: 'en' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/paveg/me.wiki' }],
			lastUpdated: true,
			pagination: false,
			editLink: undefined,
			credits: false,
			customCss: [
				'katex/dist/katex.min.css',
				'./src/styles/custom.css',
			],
			components: {
				MarkdownContent: './src/components/MarkdownContent.astro',
			},
			sidebar: [
				{
					label: 'Wiki',
					items: [
						{ slug: 'wiki/getting-started' },
					],
				},
				{
					label: 'Algorithms',
					autogenerate: { directory: 'wiki/algorithms' },
				},
				{
					label: 'Data Structures',
					autogenerate: { directory: 'wiki/data-structures' },
				},
			],
		}),
	],
});
