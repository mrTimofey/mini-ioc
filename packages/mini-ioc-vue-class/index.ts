import type Vue from 'vue';
import type { InjectKey } from 'vue/types/options';
import { createDecorator } from 'vue-class-component';
import { computedResolver, injectContainer } from 'mini-ioc-vue';

function inject(target: Object, propKey: string | symbol, newInstance: boolean): void {
	if (typeof propKey === 'symbol')
		throw new TypeError('Vue class property key must be a string');
	createDecorator(options => {
		if (!options.inject) options.inject = {};
		else if (Array.isArray(options.inject)) {
			const vueInjectObject: { [key: string]: InjectKey } = {};
			for (const key of options.inject) {
				vueInjectObject[key] = key;
			}
			options.inject = vueInjectObject;
		}
		if (!options.computed) options.computed = {};
		Object.assign(options.inject, injectContainer());
		options.computed[propKey] = computedResolver(Reflect.getMetadata('design:type', target, propKey), newInstance);
	})(target as Vue, propKey);
}

export const Inject: PropertyDecorator = (target, propKey) => inject(target, propKey, false);
export const InjectNew: PropertyDecorator = (target, propKey) => inject(target, propKey, true);
