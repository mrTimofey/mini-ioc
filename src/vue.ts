import type { ComputedOptions } from 'vue';
import Container, { ICtor } from '.';

export const APP_IOC_CONTAINER_PROVIDE_KEY = 'VueAppDIContainer';

export function mapProvider() {
	return {
		[APP_IOC_CONTAINER_PROVIDE_KEY]: new Container(),
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
