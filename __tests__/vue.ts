import 'reflect-metadata';
import Vue from 'vue';
import Container, { Resolvable } from '../src/index';
import { mapProvider, computedInjection, APP_IOC_CONTAINER_PROVIDE_KEY } from '../src/vue';
import { createRenderer } from 'vue-server-renderer';

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
const renderApp = async (compText: (comp: any) => string, configure?: (c: Container) => void) => {
	const Component = Vue.extend({
		inject: { [APP_IOC_CONTAINER_PROVIDE_KEY]: APP_IOC_CONTAINER_PROVIDE_KEY },
		computed: {
			someClass: computedInjection(SomeClass),
			someClassAsNew: computedInjection(SomeClass, true),
		},
		render(h) {
			return h('div', compText(this));
		},
	});
	const App = Vue.extend({
		provide: mapProvider(configure),
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
		expect(await renderApp(
			comp => `${comp.someClass.instanceId}_${comp.someClassAsNew.instanceId}`,
			container => {
				container.registerResolver(IdGenerator, () => new class extends IdGenerator {
					public next() {
						return super.next() * 100;
					}
				}());
			}
		)).toContain('<div>100_200</div><div>100_300</div>');
	});
});
