import 'reflect-metadata';
import { createApp, h } from 'vue';
import { mapProvider } from 'mini-ioc/dist/vue';
import Root from './app';

createApp({
	provide: mapProvider(),
	render: () => h(Root),
}).mount('#app');
