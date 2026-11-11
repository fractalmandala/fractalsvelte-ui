import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('./src/site', import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			$site: site
		}
	},
	plugins: [
		sveltekit({
			alias: {
				$lib: 'src/lib',
				// demos import the package by its published name, exactly as a user would
				'@fractaldesign/fractalsvelte-ui/icons/keylinestroke': 'src/lib/icons/keylinestroke.ts',
				'@fractaldesign/fractalsvelte-ui/icons/keylinefill': 'src/lib/icons/keylinefill.ts',
				'@fractaldesign/fractalsvelte-ui/icons': 'src/lib/icons/index.ts',
				'@fractaldesign/fractalsvelte-ui': 'src/lib/index.ts',
				'#lib': 'src/lib'
			},
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			prerender: {
				handleHttpError: 'warn',
				handleMissingId: 'warn'
			},
			extensions: ['.svelte', '.md'],
			preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md'] })]
		})
	],
	ssr: {
		noExternal: ['@fractaldesign/pop-svelte']
	},
	optimizeDeps: {
		exclude: ['@fractaldesign/pop-svelte']
	},
	server: {
		fs: {
			allow: ['..']
		}
	}
});
