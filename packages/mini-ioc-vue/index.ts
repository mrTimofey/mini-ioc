import Container, { AnyClass } from 'mini-ioc';

export const APP_IOC_CONTAINER_INJECT_KEY = '__VueAppDIContainer__';
export const injectKey = Symbol(APP_IOC_CONTAINER_INJECT_KEY);

export function provideContainer(container = new Container()) {
	return {
		[injectKey]: container,
	};
}

export const injectMixin = {
	inject: {
		[APP_IOC_CONTAINER_INJECT_KEY]: {
			from: injectKey,
			default: null,
		},
	},
} as const;

export function computedResolver<T>(ctor: AnyClass<T>, newInstance: boolean = false): () => T {
	return function(this: any) {
		// eslint-disable-next-line no-invalid-this
		const container = this[APP_IOC_CONTAINER_INJECT_KEY] as Container;
		if (!container) throw new Error('Vue DI container is not provided');
		return newInstance ? container.create(ctor) : container.get(ctor);
	};
}
