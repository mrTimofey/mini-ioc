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
