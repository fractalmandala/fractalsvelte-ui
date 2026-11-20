import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// fractalstyler's `./styles` entry is a .css file: the package must be bundled in
	// SSR, or Node's loader is asked to import it and the render fails.
	ssr: {
		noExternal: ['@fractaldesign/fractalstyler']
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: '404.html' }),
			// Examples and docs import the library exactly as a consumer would.
			alias: {
				'@fractaldesign/fractalsvelte-ui/motion': 'src/lib/motion/index.ts',
				'@fractaldesign/fractalsvelte-ui/theme': 'src/lib/theme/index.ts',
				'@fractaldesign/fractalsvelte-ui/styles': 'src/lib/styles/layers/components.css',
				'@fractaldesign/fractalsvelte-ui': 'src/lib/index.ts'
			}
		})
	]
});
