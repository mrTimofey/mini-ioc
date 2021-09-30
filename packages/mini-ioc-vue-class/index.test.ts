import 'reflect-metadata';
import Container, { Resolvable } from 'mini-ioc';
import { Options, Vue } from 'vue-class-component';
import { injectKey } from 'mini-ioc-vue';
import { Inject, InjectNew } from '.';
import { createApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';

function testCaseString(num1: number, num2: number, num3: number) {
	return `${num1} is equal to ${num2} but is not equal to ${num3}`;
}

@Resolvable
class SomeClass {
	private someValue = 42;

	setSomeValue(to: number) {
		this.someValue = to;
	}

	getSomeValue() {
		return this.someValue;
	}
}

@Options({
	template: '<div>{{ text }}</div>',
})
export default class SomeComponent extends Vue {
	@Inject someInstance!: SomeClass;
	@Inject someSameInstance!: SomeClass;
	@InjectNew someOtherInstance!: SomeClass;

	created() {
		this.someInstance.setSomeValue(41); // should affect someSameInstance as well since they points to the same instance
		this.someOtherInstance.setSomeValue(43);
	}

	get text() {
		return testCaseString(
			this.someInstance.getSomeValue(),
			this.someSameInstance.getSomeValue(),
			this.someOtherInstance.getSomeValue()
		);
	}
}

describe('Vue.js class component decorators', () => {
	it('Inject and InjectNew work as expected', async () => {
		const app = createApp({
			render: () => h(SomeComponent),
		});
		const container = new Container();
		app.provide(injectKey, container);
		expect(await renderToString(app)).toBe(`<div>${testCaseString(41, 41, 43)}</div>`);
		expect(container.get(SomeClass).getSomeValue()).toBe(41);
	});
});
