import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import swc from 'rollup-plugin-swc';

// https://vitejs.dev/config/
export default defineConfig({
	// swc replaces esbuild, needed to support TS decorators with metadata
	esbuild: false,
	plugins: [vue(), swc()],
	resolve: {
		alias: {
			vue: 'vue/dist/vue.esm-browser.js',
		},
	},
});
