See [GutHub releases](https://github.com/mrTimofey/mini-ioc/releases) for versions <=0.2.0.

## 0.3.0

Vue.js support moved to separate packages `mini-ioc-vue` and `mini-ioc-vue-class`.

`mini-ioc` functionality remains unchanged.

## 0.4.0

`ICtor` interface replaced with `AbstractClass`, `RealClass` and `AnyClass` types. Now `container#registerResolver` supports an abstract class as a first argument.

## 0.4.1

Container constructor now receives optional custom Reflect object.

## 0.5.0

`inject` function added. It can be used to inject dependencies within a class constructor without decorators support.

```typescript
import Dep1 from 'somewhere';
import Dep2 from 'somewhere-else';
import { Resolvable, inject } from 'mini-ioc';

// with decorators

@Resolvable
class ClassWithDecorators {
	constructor(
		private dep1: Dep1,
		private dep2: Dep2
	) {}
}

// without decorators

class ClassWithoutDecorators {
	constructor(
		private dep1 = inject(Dep1),
		private dep2 = inject(Dep2)
	) {}
}
```

## 1.0.0

`getResolvedArguments` method added to the container. Now you can use default resolving behavior within a resolver function.

```typescript
container.registerResolver(SomeClass, (Ctor, container) => {
	// you can just call `new Ctor()` if you don't use decorators, but what if you will some day?
	const instance = new Ctor(...container.getResolvedArguments(ctor));
	instances.initSomethingImportant(42);
	return instance;
});
```

## 1.0.1

`registerResolver` TypeScript 5 type error fixed when using `new` resolver's first argument. Also the method became more strict with abstract classes.

```typescript
container.registerResolver(SomeClass, (Ctor, container) => {
	// this doesn't pass a type-check for 1.0.0, but fixed in 1.0.1
	return new Ctor(...container.getResolvedArguments(ctor));
});

container.registerResolver(AbstractSomeClass, (Ctor, container) => {
	// this still fails a type-check if first argument is an abstract class
	return new Ctor(...container.getResolvedArguments(ctor));
});
```
