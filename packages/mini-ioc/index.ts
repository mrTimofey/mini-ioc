export interface ICtor<T = unknown> {
	new(...args: any[]): T;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Resolver<T = unknown> {
	// eslint-disable-next-line no-use-before-define
	(ctor: ICtor<T>, container: Container): T;
}

export default class Container {
	private instanceMap = new Map<ICtor, unknown>();
	private resolvers = new Map<ICtor, Resolver>();

	/**
	 * Make new instance of the provided class.
	 * @param ctor class to make instance from
	 */
	create<T>(ctor: ICtor<T>): T {
		if (this.resolvers.has(ctor))
			return this.resolvers.get(ctor)!(ctor, this) as T;
		const ctorArgs: ICtor<unknown>[] | undefined = Reflect.getMetadata('design:paramtypes', ctor);
		if (!ctorArgs?.length)
			return new ctor();
		const instance = new ctor(
			...ctorArgs.map(ctorArg => this.get(ctorArg))
		);
		return instance;
	}

	/**
	 * Resolve an instance of the provided class as a singleton.
	 * @param ctor class to make instance from
	 * @param options inject options
	 */
	get<T>(ctor: ICtor<T>): T {
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
	registerResolver<T, X extends T>(ctor: ICtor<T>, resolver: Resolver<X>): this {
		this.resolvers.set(ctor, resolver as Resolver);
		return this;
	}

	/**
	 * Override default (abstract?) class with its subclass.
	 * @param abstract source class
	 * @param target target class
	 */
	bind<T, X extends T>(abstract: ICtor<T>, target: ICtor<X>): this {
		return this.registerResolver(abstract, () => this.create(target));
	}
}

/**
 * Make class automatically resolvable.
 * Use this as a class decorator. It does 2 things:
 * - forces TypeScript compiler to define design:paramtypes metadata for the constructor
 * - marks class as injectable
 * @param ctor injectable entity class/constructor
 */
export const Resolvable: ClassDecorator = () => {
	// nothing
};
