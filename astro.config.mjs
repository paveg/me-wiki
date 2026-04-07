// @ts-check

import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkMoonmaid from "moonmaid/remark-plugin";
import { resolve } from "node:path";

const moonmaidWasmPath =
	"file://" + resolve(process.cwd(), "src/moonmaid.wasm");

export default defineConfig({
	markdown: {
		remarkPlugins: [
			remarkMath,
			[remarkMoonmaid, { wasmPath: moonmaidWasmPath }],
		],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		starlight({
			title: "me.wiki",
			defaultLocale: "root",
			locales: {
				root: { label: "日本語", lang: "ja" },
				en: { label: "English", lang: "en" },
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/paveg/me.wiki",
				},
			],
			lastUpdated: true,
			pagination: false,
			editLink: undefined,
			credits: false,
			customCss: ["katex/dist/katex.min.css", "./src/styles/custom.css"],
			sidebar: [
				{
					label: "Wiki",
					items: [
							{ slug: "wiki/getting-started" },
							{ slug: "wiki/pattern-recognition" },
							{ slug: "wiki/todo" },
						],
				},
				{
					label: "Algorithms",
					autogenerate: { directory: "wiki/algorithms" },
				},
				{
					label: "Data Structures",
					autogenerate: { directory: "wiki/data-structures" },
				},
				{
					label: "Math",
					autogenerate: { directory: "wiki/math" },
				},
			],
		}),
	],
});
