import { createDecorator } from 'vue-class-component';
import { computedResolver, injectMixin } from 'mini-ioc-vue';

function inject(target: any, propKey: string, newInstance: boolean): void {
	createDecorator(options => {
		if (!options.mixins) options.mixins = [];
		if (!options.mixins.includes(injectMixin)) options.mixins.push(injectMixin);
		if (!options.computed) options.computed = {};
		options.computed[propKey] = computedResolver(Reflect.getMetadata('design:type', target, propKey), newInstance);
	})(target, propKey);
}

export const Inject: PropertyDecorator = (target, propKey) => inject(target, propKey as string, false);
export const InjectNew: PropertyDecorator = (target, propKey) => inject(target, propKey as string, true);
