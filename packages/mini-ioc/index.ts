export type RealClass<T = unknown> = new (...args: any[]) => T;
export type AbstractClass<T = unknown> = abstract new (...args: any[]) => T;
export type AnyClass<T = unknown> = RealClass<T> | AbstractClass<T>;
// eslint-disable-next-line no-use-before-define
export type Resolver<T = unknown, X = AnyClass<T>> = (ctor: X, container: Container) => T;

interface IMetadataRetriever {
	getMetadata<T>(key: string, ctor: AnyClass<T>): ConstructorParameters<AnyClass<T>>;
}

// eslint-disable-next-line no-use-before-define
let injectContext: Container | null = null;

export function inject<T>(ctor: AnyClass<T>, createNew = false): T {
	if (!injectContext) throw new Error('mini-ioc\'s `inject` function can only be used within a resolvable class constructor');
	return createNew ? injectContext.create(ctor) : injectContext.get(ctor);
}

export default class Container {
	private instanceMap = new Map<AnyClass, unknown>();
	private resolvers = new Map<AnyClass, Resolver>();
	private reflect?: IMetadataRetriever;
	private static createDepth = 0;

	constructor(reflect?: IMetadataRetriever) {
		if (reflect) this.reflect = reflect;
		else if (typeof Reflect === 'object') this.reflect = Reflect;
	}

	/**
	 * Resolves constructor argument values.
	 * @param ctor constructor
	 */
	getResolvedArguments<T>(ctor: AnyClass<T>): any[] {
		const ctorArgs = typeof this.reflect?.getMetadata === 'function'
			? this.reflect.getMetadata('design:paramtypes', ctor)
			: undefined;
		return Array.isArray(ctorArgs) ? ctorArgs.map(ctorArg => this.get(ctorArg)) : [];
	}

	/**
	 * Make new instance of the provided class.
	 * @param ctor class to make instance from
	 */
	create<T>(ctor: AnyClass<T>): T {
		++Container.createDepth;
		injectContext = this;
		const instance = this.resolvers.has(ctor)
			? this.resolvers.get(ctor)!(ctor, this) as unknown as T
			: new (ctor as RealClass<T>)(...this.getResolvedArguments(ctor));
		--Container.createDepth;
		if (Container.createDepth === 0) injectContext = null;
		return instance;
	}

	/**
	 * Resolve an instance of the provided class as a singleton.
	 * @param ctor class to make instance from
	 * @param options inject options
	 */
	get<T>(ctor: AnyClass<T>): T {
		if (this.instanceMap.has(ctor))
			return this.instanceMap.get(ctor) as T;

		const instance = this.create(ctor);
		this.instanceMap.set(ctor, instance);
		return instance;
	}

	/**
	 * Register resolver function. Use it to provide custom class instantiation logic.
	 * @param ctor constructor or class to make instance from
	 * @param resolver factory returning resolved instance
	 */
	registerResolver<T, X extends T>(ctor: RealClass<T>, resolver: Resolver<X, typeof ctor>): this;
	registerResolver<T, X extends T>(ctor: AbstractClass<T>, resolver: Resolver<X, typeof ctor>): this;
	registerResolver(ctor: AnyClass, resolver: Resolver<unknown, RealClass>): this {
		this.resolvers.set(ctor, resolver as Resolver);
		return this;
	}

	/**
	 * Override default (abstract?) class with its subclass.
	 * @param abstract source class
	 * @param target target class
	 */
	bind<T, X extends T>(abstract: AnyClass<T>, target: RealClass<X>): this {
		return this.registerResolver(abstract, () => this.create(target));
	}
}

/**
 * Make class automatically resolvable.
 * Use this as a class decorator. It does 2 things:
 * - forces TypeScript compiler to define design:paramtypes metadata for the constructor
 * - marks class as injectable
 * Requires tsconfig's compilerOptions.emitDecoratorMetadata set to true.
 *
 * If you can't or don't want to use metadata, consider using alternative approach
 * using inject function to set default constructor argument values.
 * See README.md for more details.
 */
export const Resolvable: ClassDecorator = () => {
	// nothing
};
