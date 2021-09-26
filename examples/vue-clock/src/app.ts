import { defineComponent, inject } from 'vue';
import { injectKey } from 'mini-ioc-vue';
import ClockStore from './store/clock';
import ClockViewOptions from './components/clock-view-options';

export default defineComponent({
	components: {
		ClockViewOptions,
	},
	setup() {
		inject(injectKey)?.get(ClockStore).start();
	},
	template: '<ClockViewOptions />',
});
