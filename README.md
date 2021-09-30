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

If you want to resolve classes automatically, you have 2 options.

1. Use decorators with type metadata
	-   Install `reflect-metadata` to be able to pass type information about constructor arguments and properties to runtime
	-   Add `import 'reflect-metadata'` to the entry point of your application to make TypeScript provide decorated entities with reflection metadata
	-   Configure TypeScript to support decorators and runtime type metadata with flags `compilerOptions.experimentalDecorators = true` and `compilerOptions.emitDecoratorMetadata = true` respectively in your `tsconfig.json`
2. Use `inject` function. It is available within a class constructor and can be used to resolve dependencies without metadata provided by decorators.

Then you can use an IOC container like this:

```typescript
import Container, { Resolvable, inject } from "mini-ioc";

// Any class you are going to resolve with container should be decorated with Resolvable...
@Resolvable
class SomeClass {}

@Resolvable
class SomeOtherClass {
	public constructor(
		// Constructor arguments will be resolved by a container automatically based on metadata
		public someInstance: SomeClass
	);
}

// ...or use `inject` instead
class SomeClass {}

@Resolvable
class SomeOtherClass {
	public constructor(
		// Constructor arguments will be resolved by the inject function on constructor call
		public someInstance = inject(SomeClass)
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
// Mind that you don't need Resolvable decorator nor `inject` for custom resolvers.
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

## Vue.js support

```bash
npm i mini-ioc mini-ioc-vue
```

To make things work in Vue.js components you should register mini-ioc container in app root `provide`:

```typescript
import Container from "mini-ioc";
import { injectKey } from "mini-ioc-vue";

const container = new Container();

// configure container bindings here

// for Vue 2
import Vue from "vue";

const app = new Vue({
	provide: {
		[injectKey]: container,
	},
});

// for Vue 3
import { createApp } from "vue";

const app = createApp();
app.provide(injectKey, container);
```

### Vue 3 options API (Vue 2 support is limited)

Resolving will work for both Vue 2 and 3, but **typing** will be available only for **Vue 3** with `defineComponent`.

```typescript
import { defineComponent } from "vue";
import { injectMixin, computedResolver } from "mini-ioc-vue";
import SomeClass from "./anywhere";

defineComponent({
	mixins: [injectMixin],
	computed: {
		// resolve as a singleton (container.get)
		someInstance: computedResolver(SomeClass),
		// resolve as an everytime-new instance (container.create)
		freshSomeInstance: computedResolver(SomeClass, true),
	},
});
```

### Vue 3 composition API (or Vue 2 + @vue/composition-api)

First you should provide additional type information for `inject` somewhere in `.d.ts` file within your project (`src/mini-ioc.d.ts` for example).

*Library itself could provide that too but in this case it will only support one of Vue 2 + `@vue/composition-api` or Vue 3. So some manual actions here are the compromise to support both. Sorry for the inconvenience :)*

```typescript
declare module 'mini-ioc-vue' {
	import type Container from 'mini-ioc';
	import type { InjectionKey } from 'vue'; // for Vue 3
	// import type { InjectionKey } from '@vue/composition-api'; // for Vue 2

	export const injectKey: InjectionKey<Container>;
}
```

```typescript
import { defineComponent, inject } from "vue";
import { injectKey } from "mini-ioc-vue";
import SomeClass from "./anywhere";

defineComponent({
	setup() {
		const container = inject(injectKey);
		if (!container) throw new Error("No container - no component, pal. Come back when have one.");
		const someInstance = container.get(SomeClass);
		const freshSomeInstance = container.create(SomeClass);
	},
});
```

### Vue 2/3 + vue-class-component

```bash
npm i mini-ioc mini-ioc-vue mini-ioc-vue-class
```

Decorators are using `computedResolver` under-the-hood so the result is the same as using options API.

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
