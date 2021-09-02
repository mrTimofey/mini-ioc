import 'reflect-metadata';
import type { VueConstructor } from 'vue';
import Container, { Resolvable } from 'mini-ioc';
import { provideContainer, injectContainer, computedResolver } from '.';
import { createRenderer } from 'vue-server-renderer';

// @ts-ignore
const Vue: VueConstructor = require('vue');

@Resolvable
class IdGenerator {
	private instanceCount = 0;

	public next() {
		return ++this.instanceCount;
	}
}

@Resolvable
class SomeClass {
	public someValue = 'test';
	public instanceId: number;

	constructor(idGen: IdGenerator) {
		this.instanceId = idGen.next();
	}
}

const renderer = createRenderer();
const renderApp = async (compText: (comp: any) => string, container?: Container) => {
	const Component = Vue.extend({
		inject: injectContainer(),
		computed: {
			someClass: computedResolver(SomeClass),
			someClassAsNew: computedResolver(SomeClass, true),
		},
		render(h) {
			return h('div', compText(this));
		},
	});
	const App = Vue.extend({
		provide: provideContainer(container),
		render: h => h('div', [Component, Component].map(c => h(c))),
	});
	const app = new App();
	return await renderer.renderToString(app);
};

describe('Vue.js helpers', () => {
	it('#computedInjection(ctor) should return singleton, #computedInjection(ctor, true) should return new instance', async () => {
		expect(await renderApp(comp => `${comp.someClass.instanceId}_${comp.someClassAsNew.instanceId}`)).toContain('<div>1_2</div><div>1_3</div>');
	});

	it('#mapProvider(configure) should create a configured container', async () => {
		const container = new Container();
		container.registerResolver(
			IdGenerator,
			() => new class extends IdGenerator {
				public next() {
					return super.next() * 100;
				}
			}()
		);
		expect(await renderApp(
			comp => `${comp.someClass.instanceId}_${comp.someClassAsNew.instanceId}`,
			container
		)).toContain('<div>100_200</div><div>100_300</div>');
	});
});
