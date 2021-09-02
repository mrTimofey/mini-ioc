# IoC/DI container for TypeScript

Minimalistic IoC/DI container for TypeScript without dependencies which does exactly what it should and not more. Proof of concept that IoC/DI container implementation can be that simple.

Out-of-the-box it can only provide you with singleton or everytime-new instances of any class. In case you need something more complex you can register a custom resolver.

Doesn't support primitive values. Because it shouldn't.

Doesn't support TypeScript `interface` and `type`. Actually there are no libraries supporting them since types and interfaces are ephemeral build time entities and they just don't exist in runtime.

Integrates smoothly to Vue.js 2/3 projects with [vue-class-component](https://github.com/vuejs/vue-class-component) or composition API.

## How to use

```bash
npm i mini-ioc
```

If you want to resolve classes automatically:

-   Install `reflect-metadata` to be able to pass type information about constructor arguments and properties to runtime
-   Add `import 'reflect-metadata'` to the entry point of your application to make TypeScript provide decorated entities with reflection metadata
-   Configure TypeScript to support decorators and runtime type metadata with flags `compilerOptions.experimentalDecorators = true` and `compilerOptions.emitDecoratorMetadata = true` respectively in your `tsconfig.json`

Then you can use an IOC container like this:

```typescript
import Container, { Resolvable } from "mini-ioc";

// Any class you are going to resolve with container should decorated with Resolvable
@Resolvable
class SomeClass {}

@Resolvable
class SomeOtherClass {
	public constructor(
		// Constructor arguments will be resolved by a container
		public someInstance: SomeClass
	);
}

// Container instance
const container = new Container();

// Resolve class as a single instance every time (like singleton)
const single = container.get(SomeOtherClass);
console.log(single === container.get(SomeOtherClass)); // true

// Resolve a fresh class instance
const newInstance = container.create(SomeOtherClass);
console.log(single === newInstance); // false

// Constructor arguments are resolved automatically as single instances with container.get
console.log(single.someInstance === newInstance.someInstance); // true
```

You can provide any subclass to create a class instance from.

```typescript
import Container, { Resolvable } from "mini-ioc";

abstract class BaseClass {}
@Resolvable
class SubClass extends BaseClass {}

const container = new Container();

// Bind abstract class implementation
container.bind(BaseClass, SubClass);

console.log(container.get(BaseClass) instanceof SubClass); // true
```

You can completely override default behavior for a class instance creation.

```typescript
import Container from "mini-ioc";

abstract class BaseClass {}
// Mind that you don't need Resolvable decorator for custom resolvers.
// Helpful for third-party libraries.
class SubClass extends BaseClass {
	protected field!: string;

	public static function makeInstance() {
		const instance = new SubClass();
		instance.field = "Hello there";
		return instance;
	}
}

const container = new Container();

// Register custom function as a resolver for BaseClass
container.registerResolver(BaseClass, (classCtor, container) => classCtor.makeInstance());

console.log(container.get(BaseClass) instanceof SubClass); // true
```

And that's all.

## Vue.js support

```bash
npm i mini-ioc mini-ioc-vue
```

To make things work in Vue.js components you should register mini-ioc container in app root `provide`:

```typescript
import { provideContainer } from "mini-ioc-vue";

const rootOptions = {
	provide: {
		// provideContainer will create a fresh container,
		// if you need a custom container, pass your container to a provideContainer call
		// like so provideContainer(container)
		...provideContainer(),
		// ...mapProvider() // if you don't need configuration
	},
};

// for Vue 2
import Vue from "vue";

const app = new Vue(rootOptions);

// for Vue 3
import { createApp } from "vue";

const app = createApp(rootOptions);
```

### Vue 3 options API (Vue 2 support is limited)

Resolving will work for both Vue 2 and 3, but **typing** will be available only for **Vue 3** with `defineComponent`.

```typescript
import { defineComponent } from "vue";
import { injectContainer, computedResolver } from "mini-ioc-vue";
import SomeClass from "./anywhere";

defineComponent({
	inject: {
		...injectContainer(),
	},
	computed: {
		// resolve as a singleton (container.get)
		someInstance: computedResolver(SomeClass),
		// resolve as an everytime-new instance (container.create)
		freshSomeInstance: computedResolver(SomeClass, true),
	},
});
```

### Vue 3 composition API (Vue 2 + @vue/composition-api)

```typescript
import { defineComponent, inject } from "vue";
import { injectKey } from "mini-ioc-vue";
import SomeClass from "./anywhere";

defineComponent({
	setup() {
		const container = inject(injectKey);
		const someInstance = container.get(SomeClass);
		const freshSomeInstance = container.create(SomeClass);
	},
});
```

### Vue 2/3 + vue-class-component

```bash
npm i mini-ioc mini-ioc-vue mini-ioc-vue-class
```

Decorators are using `computedResolver` under-the-hood so the result is the same as using options API. But with decorators you get typing support for both Vue 2 and 3.

```typescript
import { Inject, InjectNew } from "mini-ioc-vue-class";
import SomeClass from "./anywhere";

class MyComponent {
	// resolve as a singleton (container.get)
	@Inject
	someInstance!: SomeClass;

	// resolve as an everytime-new instance (container.create)
	@InjectNew
	freshSomeInstance!: SomeClass;
}
```
