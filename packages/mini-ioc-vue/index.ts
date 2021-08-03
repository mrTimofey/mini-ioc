import Container, { ICtor } from 'mini-ioc';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IInjectionKey<T> extends Symbol {}

const APP_IOC_CONTAINER_INJECT_KEY = '__VueAppDIContainer__';
export const injectKey: IInjectionKey<Container> = Symbol(APP_IOC_CONTAINER_INJECT_KEY);

export function provideContainer(configure?: (container: Container) => void) {
	const container = new Container();
	if (configure) configure(container);
	return {
		[injectKey as symbol]: container,
	};
}

export function injectContainer() {
	return {
		[APP_IOC_CONTAINER_INJECT_KEY]: injectKey as symbol,
	};
}

export function computedResolver<T>(ctor: ICtor<T>, newInstance: boolean = false): () => T {
	return function(this: any) {
		// eslint-disable-next-line no-invalid-this
		const container = this[APP_IOC_CONTAINER_INJECT_KEY] as Container;
		if (!container) throw new Error('Vue DI container is not provided');
		return newInstance ? container.create(ctor) : container.get(ctor);
	};
}
