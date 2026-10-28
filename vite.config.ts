import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

function isBasePath(value: string): value is '' | `/${string}` {
	return value === '' || value.startsWith('/');
}

const basePath = process.env.BASE_PATH ?? '';
if (!isBasePath(basePath)) {
	throw new Error('BASE_PATH must be empty or start with a slash.');
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({ fallback: '404.html' }),
			paths: { base: basePath }
		})
	],
	server: {
		// Podman's nginx reaches Vite through host.containers.internal.
		host: '0.0.0.0',
		port: 5173,
		strictPort: true,
		allowedHosts: ['bdxio2026.demo']
	}
});
