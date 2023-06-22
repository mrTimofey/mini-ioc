declare module 'mini-ioc-vue' {
	import type Container from 'mini-ioc';
	import type { InjectionKey } from 'vue';
	export const injectKey: InjectionKey<Container>;
}
