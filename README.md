# IoC/DI container for TypeScript

Minimalistic IoC/DI container for TypeScript without dependencies which does exactly what it should and not more. Proof of concept that IoC/DI container implementation can be that simple.

Out-of-the-box it can only provide you with singleton or everytime-new instances of any class. In case you need something more complex you can register a custom resolver.

Doesn't support primitive values. Because it shouldn't.

Doesn't support TypeScript `interface` and `type`. Actually there are no libraries supporting them since types and interfaces are ephemeral build time entities and they just don't exist in runtime.

## How to use

```
npm i mini-ioc
```

If you want to resolve classes automatically:
* Install `reflect-metadata` to be able to pass type information about constructor arguments and properties to runtime
* Add `import 'reflect-metadata'` to the entry point of your application to make TypeScript provide decorated entities with reflection metadata
* Configure TypeScript to support decorators and runtime type metadata with flags `compilerOptions.experimentalDecorators = true` and `compilerOptions.emitDecoratorMetadata = true` respectively in your `tsconfig.json`

Then you can use an IOC container like this:

```typescript
import Container, { Resolvable } from 'mini-ioc';

// Any class you are going to resolve with container should decorated with Resolvable
@Resolvable
class SomeClass {}

@Resolvable
class SomeOtherClass {
	public constructor(
		// Constructor arguments will be resolved by a container
		public someInstance: SomeClass
	)
}

// Container instance
const container = new Container();

// Resolve class as a single instance every time (like singleton)
const single = container.get(SomeOtherClass);
console.log(single === container.get(SomeOtherClass)); // true

// Resolve a fresh class instance
const newInstance = container.makeNew(SomeOtherClass);
console.log(single === newInstance); // false

// Constructor arguments are resolved automatically as single instances with container.get
console.log(single.someInstance === newInstance.someInstance); // true
```

You can provide any subclass to create a class instance from.

```typescript
import Container, { Resolvable } from 'mini-ioc';

abstract class BaseClass {}
@Resolvable
class SubClass extends BaseClass {}

const container = new Container();

// Bind abstract class implementation
container.bind(BaseClass, SubClass);

console.log(container.get(SomeClass) instanceof Subclass); // true
```

You can completely override default behavior for a class instance creation.

```typescript
import Container from 'mini-ioc';

abstract class BaseClass {}
// Mind that you don't need Resolvable decorator for custom resolvers.
// Helpful for third-party libraries.
class SubClass extends BaseClass {
	protected field!: string;

	public static function makeInstance() {
		const instance = new SubClass();
		instance.field = 'Hello there';
		return instance;
	}
}

const container = new Container();

// Register custom function as a resolver for BaseClass
container.registerResolver(BaseClass, (classCtor, container) => SubClass.makeInstance());

console.log(container.get(SomeClass) instanceof Subclass); // true
```

And that's all.
