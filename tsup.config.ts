import { defineConfig } from "tsup"

export default defineConfig(opts => ({
	entry: ["src/index.ts", opts.watch ? "src/utils/filamentConfigParser.ts" : " "],
	splitting: true,
	clean: true,
	dts: {
		footer: 'declare module "bambu-node"',
	},
	format: "esm",
	target: "es2020",
	minify: !opts.watch,
	outDir: "dist",
}))
