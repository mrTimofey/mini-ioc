import 'reflect-metadata';
import Container, { Resolvable } from 'mini-ioc';
import { provideContainer, injectContainer, computedResolver } from '.';
import { defineComponent, createApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

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

const renderApp = async (compText: (comp: any) => string, container?: Container) => {
	const Component = defineComponent({
		inject: injectContainer(),
		computed: {
			someClass: computedResolver(SomeClass),
			someClassAsNew: computedResolver(SomeClass, true),
		},
		render() {
			return h('div', compText(this));
		},
	});
	const app = createApp({
		provide: provideContainer(container),
		render: () => h('div', [Component, Component].map(c => h(c))),
	});
	return await renderToString(app);
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
