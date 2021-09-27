import { defineComponent, inject } from 'vue';
import { injectKey } from 'mini-ioc-vue';
import ClockStore from './store/clock';
import ClockViewOptions from './components/clock-view-options';
import ClockViewComposition from './components/clock-view-composition';
import ClockViewClass from './components/clock-view-class';

export default defineComponent({
	components: {
		ClockViewOptions,
		ClockViewComposition,
		ClockViewClass,
	},
	setup() {
		inject(injectKey)?.get(ClockStore).start();
	},
	template: '<ClockViewOptions /><ClockViewComposition /><ClockViewClass />',
});
