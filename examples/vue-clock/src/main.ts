import 'reflect-metadata';
import { createApp, h } from 'vue';
import Container from 'mini-ioc';
import { injectKey } from 'mini-ioc-vue';
import Root from './app';

const container = new Container();

createApp({
	render: () => h(Root),
})
	.provide(injectKey, container)
	.mount('#app');
