import 'reflect-metadata';
import { createApp, h } from 'vue';
import { provideContainer } from 'mini-ioc-vue';
import Root from './app';

createApp({
	provide: provideContainer(),
	render: () => h(Root),
}).mount('#app');
