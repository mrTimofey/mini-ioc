import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import swc from 'rollup-plugin-swc';

// this hack is needed for Vite to support decorators with metadata
function swcVite() {
	const plugin = swc();
	const originalTransform = plugin.transform;

	return {
		...plugin,
		transform(...args: Parameters<typeof originalTransform>) {
			if (/\.(js|ts|vue)$/.test(args[1])) {
				return originalTransform.apply(this, args);
			}
			return null;
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	// swc replaces esbuild, needed to support TS decorators with metadata
	esbuild: false,
	plugins: [vue(), swcVite()],
});
