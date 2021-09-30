## 0.1.0

First release as a separate package.

## 0.2.0

BREAKING: Moved to `mini-ioc@0.4.0`. Just update both `mini-ioc` to `0.4.0` and `mini-ioc-vue` to `0.2.0` and everything should be just fine.

## 0.2.1

FIX: `injectKey` type is not recognized.

## 0.2.2

Export `APP_IOC_CONTAINER_INJECT_KEY`, default injection key name for container.

## 0.3.0

BREAKING: `injectContainer` is replaced with `injectMixin`.

Migration:

```typescript
// any Vue component
import { injectContainer } from 'mini-ioc-vue';
export default {
	inject: {
		...injectContainer()
	}
}

// ...should be changed to...
import { injectMixin } from 'mini-ioc-vue';
export default {
	mixins: [injectMixin]
}
```
