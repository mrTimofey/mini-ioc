// @ts-nocheck
import type { ComputedOptions, InjectionKey } from 'vue';
import Container, { ICtor } from '.';

export const APP_IOC_CONTAINER_PROVIDE_KEY = 'VueAppDIContainer';

export function mapProvider(configure?: (container: Container) => void) {
	const container = new Container();
	if (configure) configure(container);
	return {
		[APP_IOC_CONTAINER_PROVIDE_KEY]: container,
	};
}

export function computedInjection<T>(ctor: ICtor<T>, newInstance: boolean = false): ComputedOptions<T> {
	return {
		get() {
			const container = (this as any)[APP_IOC_CONTAINER_PROVIDE_KEY] as Container;
			if (!container) throw new Error('Vue DI container is not provided');
			return newInstance ? container.create(ctor) : container.get(ctor);
		},
	};
}

export const injectKey: InjectionKey<Container> = APP_IOC_CONTAINER_PROVIDE_KEY;
