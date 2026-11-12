import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
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
				'@fractaldesign/fractalsvelte-ui/styles': 'src/lib/styles/custom.css',
				'@fractaldesign/fractalsvelte-ui': 'src/lib/index.ts'
			}
		})
	]
});
